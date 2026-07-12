import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "../db/connection.server";
import { users } from "../db/schema.server";
import { getServerConfig } from "../config.server";

function createToken(username: string): string {
  const { createHmac } = require("node:crypto") as typeof import("node:crypto");
  const config = getServerConfig();
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      username,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400,
    }),
  ).toString("base64url");
  const signature = createHmac("sha256", config.jwtSecret)
    .update(`${header}.${payload}`)
    .digest("base64url");
  return `${header}.${payload}.${signature}`;
}

export function verifyToken(token: string): { username: string } | null {
  try {
    const { createHmac, timingSafeEqual } = require("node:crypto") as typeof import("node:crypto");
    const config = getServerConfig();
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, payload, signature] = parts;
    const expectedSig = createHmac("sha256", config.jwtSecret)
      .update(`${header}.${payload}`)
      .digest("base64url");
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSig);
    if (sigBuffer.length !== expectedBuffer.length) return null;
    if (!timingSafeEqual(sigBuffer, expectedBuffer)) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (data.exp < Math.floor(Date.now() / 1000)) return null;
    return { username: data.username };
  } catch {
    return null;
  }
}

function verifyPassword(password: string, hash: string): boolean {
  const { scryptSync, timingSafeEqual } = require("node:crypto") as typeof import("node:crypto");
  const [salt, key] = hash.split(":");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return timingSafeEqual(Buffer.from(derived), Buffer.from(key));
}

export async function login({ data }: { data: any }) {
    const db = await getDb();
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, data.username))
      .limit(1);

    if (!user || !verifyPassword(data.password, user.passwordHash)) {
      return { success: false, error: "Invalid credentials" };
    }

    const token = createToken(user.username);
    return { success: true, token };
  }

export async function verifyAuth({ data }: { data: any }) {
    const result = verifyToken(data.token);
    return { valid: !!result, username: result?.username ?? null };
  }

export async function changePassword({ data }: { data: any }) {
    const tokenData = verifyToken(data.token);
    if (!tokenData) throw new Error("Unauthorized");

    const db = await getDb();
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, tokenData.username))
      .limit(1);

    if (!user || !verifyPassword(data.currentPassword, user.passwordHash)) {
      throw new Error("Current password is incorrect");
    }

    const { scryptSync, randomBytes } = await import("node:crypto") as typeof import("node:crypto");
    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(data.newPassword, salt, 64).toString("hex");

    await db
      .update(users)
      .set({ passwordHash: `${salt}:${hash}` })
      .where(eq(users.id, user.id));

    return { success: true };
  }
