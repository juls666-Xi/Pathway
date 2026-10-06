import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const pathname = request.nextUrl.pathname;
  const isPublicAuthRoute = pathname === "/login"
    || pathname.startsWith("/login/")
    || pathname === "/auth/callback";
  const isApiRoute = pathname === "/api" || pathname.startsWith("/api/");
  let response = NextResponse.next({ request });
  let authenticated = false;

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });

    const { data } = await supabase.auth.getUser();
    authenticated = Boolean(data.user);
  }

  if (!authenticated && !isPublicAuthRoute && !isApiRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    const redirectResponse = NextResponse.redirect(loginUrl);
    response.headers.getSetCookie().forEach((cookie) => {
      redirectResponse.headers.append("Set-Cookie", cookie);
    });
    redirectResponse.headers.set("Cache-Control", "private, no-store, max-age=0");
    return redirectResponse;
  }

  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};