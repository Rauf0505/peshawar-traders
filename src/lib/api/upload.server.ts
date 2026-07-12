import { z } from "zod";
import { verifyToken } from "./auth.server";
import { uploadImage as ikUpload, deleteImage as ikDelete } from "./imagekit.server";

function requireAuth(token: string) {
  const user = verifyToken(token);
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function uploadProductImage({ data }: { data: any }) {
    requireAuth(data.token);
    const result = await ikUpload(data.base64, data.fileName, data.folder ?? "products");
    return result;
  }

export async function uploadBrandImage({ data }: { data: any }) {
    requireAuth(data.token);
    const result = await ikUpload(data.base64, data.fileName, data.folder ?? "brands");
    return result;
  }

export async function uploadHeroImage({ data }: { data: any }) {
    requireAuth(data.token);
    const result = await ikUpload(data.base64, data.fileName, data.folder ?? "hero");
    return result;
  }

export async function deleteProductImage({ data }: { data: any }) {
    requireAuth(data.token);
    await ikDelete(data.fileId);
    return { success: true };
  }
