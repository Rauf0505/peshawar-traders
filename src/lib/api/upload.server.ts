import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { verifyToken } from "./auth.server";
import { uploadImage as ikUpload, deleteImage as ikDelete } from "./imagekit.server";

function requireAuth(token: string) {
  const user = verifyToken(token);
  if (!user) throw new Error("Unauthorized");
  return user;
}

export const uploadProductImage = createServerFn({ method: "POST" })
  .validator(
    z.object({
      token: z.string(),
      base64: z.string(),
      fileName: z.string(),
      folder: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const result = await ikUpload(data.base64, data.fileName, data.folder ?? "products");
    return result;
  });

export const uploadBrandImage = createServerFn({ method: "POST" })
  .validator(
    z.object({
      token: z.string(),
      base64: z.string(),
      fileName: z.string(),
      folder: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const result = await ikUpload(data.base64, data.fileName, data.folder ?? "brands");
    return result;
  });

export const deleteProductImage = createServerFn({ method: "POST" })
  .validator(
    z.object({
      token: z.string(),
      fileId: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);
    await ikDelete(data.fileId);
    return { success: true };
  });
