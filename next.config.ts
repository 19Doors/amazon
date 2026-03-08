import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "https://172.25.191.107:3000", // your local network IP
    "https://100.94.163.127:3000", // your Tailscale IP (from the log)
    "100.94.163.127",

    // If you have a Tailscale MagicDNS hostname, add it too:
    // "https://your-machine.tailnet-name.ts.net:3000",
  ],
  /* config options here */
};

export default nextConfig;
