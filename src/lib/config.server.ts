import process from "node:process";

export function getServerConfig() {
  return {
    nodeEnv: process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET || "dev-secret-change-in-production",
    supabaseDatabaseUrl: process.env.SUPABASE_DATABASE_URL || "",
    imagekit: {
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
    },
  };
}
