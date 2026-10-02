import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const appOrigin = configuredSiteUrl ? new URL(configuredSiteUrl).origin : requestUrl.origin;
  const requestedNext = requestUrl.searchParams.get("next") ?? "/";
  const destination = new URL(requestedNext, appOrigin);
  const safeDestination = destination.origin === appOrigin
    ? destination
    : new URL("/", appOrigin);
  const code = requestUrl.searchParams.get("code");

  try {
    if (code) {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && requestUrl.searchParams.get("flow") === "signup") {
        await supabase.auth.signOut();
      } else if (error) {
        safeDestination.pathname = "/login";
        safeDestination.search = "?error=confirmation";
      }
    } else {
      safeDestination.pathname = "/login";
      safeDestination.search = "?error=confirmation";
    }
  } catch {
    safeDestination.pathname = "/login";
    safeDestination.search = "?error=confirmation";
  }

  const response = NextResponse.redirect(safeDestination);
  response.headers.set("Cache-Control", "no-store");
  return response;
}