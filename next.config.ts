import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // solc ships a multi-MB emscripten compiler binary — keep it out of the
  // webpack bundle and load it from node_modules at runtime instead.
  serverExternalPackages: ["solc"],
};

export default nextConfig;
