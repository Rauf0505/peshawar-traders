import { createRequire } from "node:module";
import { getServerConfig } from "../config.server";

const _require = createRequire(import.meta.url);

let _imagekit: any | null = null;

function getImageKit() {
  if (_imagekit) return _imagekit;
  const config = getServerConfig();
  const { imagekit: ik } = config;
  if (!ik.publicKey || !ik.privateKey || !ik.urlEndpoint) {
    throw new Error("ImageKit credentials not configured in .env");
  }
  const ImageKit = _require("imagekit") as any;
  _imagekit = new ImageKit({
    publicKey: ik.publicKey,
    privateKey: ik.privateKey,
    urlEndpoint: ik.urlEndpoint,
  });
  return _imagekit;
}

export function uploadImage(fileBase64: string, fileName: string, folder: string) {
  const imagekit = getImageKit();
  return new Promise<{ url: string; fileId: string }>((resolve, reject) => {
    imagekit.upload(
      {
        file: fileBase64,
        fileName,
        folder: `/wildwood/${folder}`,
        useUniqueFileName: true,
      },
      (err: Error | null, result: any) => {
        if (err) reject(err);
        else resolve({ url: result.url, fileId: result.fileId });
      },
    );
  });
}

export function deleteImage(fileId: string) {
  const imagekit = getImageKit();
  return new Promise<void>((resolve, reject) => {
    imagekit.deleteFile(fileId, (err: Error | null) => {
      if (err) reject(err);
      else resolve();
    });
  });
}
