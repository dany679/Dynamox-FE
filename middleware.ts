// // /middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const urls = [
  {
    url: "/points",
    name: "Pontos de acesso",
  },
  {
    url: "/",
    name: "Maquinas",
  },
  {
    url: "/about",
    name: "Sobre",
  },
  {
    url: "/login",
    name: "Login",
  },
  {
    url: "/registrar",
    name: "Registrar",
  },
];

export const config = { matcher: "/((?!.*\\.).*)" }; //stop middleware in static files please
export async function middleware(request: NextRequest) {
  // Store current request url in a custom header, which you can read later
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);
  // const session = request.cookies.get("token")?.value || "";
  const pathname = request.nextUrl.pathname;
  const result = urls.find((item) => item.url === pathname);
  const page = result?.name || "Not Found";
  requestHeaders.set("title", page);
  const publicPaths = ["/login", "/registrar"];
  const isPublic =
    publicPaths.includes(pathname) || pathname.startsWith("/api/auth") || publicPaths.includes("/api/auth");

  // console.log("MIDDLEWARE-----------------------------------------------");
  // console.log(pathname);

  if (isPublic) return NextResponse.next();
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next({
    request: {
      // Apply new request headers
      headers: requestHeaders,
    },
  });
}
