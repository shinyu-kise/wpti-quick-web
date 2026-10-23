import type { NextConfig } from "next";

// All dialogue state stays in the browser. This candidate needs no application server.
const nextConfig: NextConfig = { output: "export" };

export default nextConfig;
