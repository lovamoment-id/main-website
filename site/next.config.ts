import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * /v/[orderSlug] reads the raw template HTML at request time from
   * ../Template/[slug]/index.html, which sits outside this Next project.
   *
   * Vercel only uploads files it has traced, so without these two options the
   * route builds fine and then 500s in production with "file tidak terbaca".
   * outputFileTracingRoot widens the trace to the repo root; the include then
   * pulls in only the index.html files, not the ~223 MB of demo images and
   * audio sitting next to them.
   */
  outputFileTracingRoot: path.join(__dirname, ".."),
  outputFileTracingIncludes: {
    "/v/[orderSlug]": ["../Template/*/index.html"],
  },
};

export default nextConfig;
