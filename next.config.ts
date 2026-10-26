import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Metadata is static here, so always put it in <head> rather than streaming it into <body>:
  // link previews and simple crawlers read only the head.
  htmlLimitedBots: /.*/,
};

export default nextConfig;
