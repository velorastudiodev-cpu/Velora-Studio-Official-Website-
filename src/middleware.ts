import { NextResponse, type NextRequest } from "next/server";

/**
 * Strict CSP with a fresh nonce per request: only scripts carrying it run, so injected markup cannot
 * execute. Next.js reads the nonce from the request's CSP header and stamps it on its own scripts;
 * the layout stamps it on ours. Inline styles stay allowed: React style props and next/font use them.
 */
export function middleware(request: NextRequest) {
  // Pages are read-only (no server actions): anything but GET/HEAD gets a clean 405, not a render or a 500.
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new NextResponse(null, { status: 405, headers: { Allow: "GET, HEAD" } });
  }

  const nonce = btoa(crypto.randomUUID());
  const dev = process.env.NODE_ENV !== "production";
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");

  const headers = new Headers(request.headers);
  headers.set("x-nonce", nonce);
  headers.set("Content-Security-Policy", csp);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  // Pages only: static files, images and metadata routes carry no scripts.
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|brand|work|favicon.ico|robots.txt|sitemap.xml|opengraph-image).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
