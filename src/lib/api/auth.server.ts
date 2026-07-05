import { createServerFn } from "@tanstack/react-start";
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

export const login = createServerFn({ method: "POST" })
  .validator(z.object({
    username: z.string().min(1),
    password: z.string().min(1),
  }))
  .handler(async ({ data }) => {
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
  });

export const verifyAuth = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string() }))
  .handler(async ({ data }) => {
    const result = verifyToken(data.token);
    return { valid: !!result, username: result?.username ?? null };
  });
