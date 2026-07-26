import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { cookies: { getAll: () => request.cookies.getAll(), setAll: (cookiesToSet) => { cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value)); response = NextResponse.next({ request }); cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); } } });
  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const protectedPaths = ["/dashboard", "/roadmaps", "/projects", "/leaderboard", "/community", "/profile", "/settings", "/jobs", "/resume", "/recruiter"];
  if (!user && (path === "/certificates" || protectedPaths.some((protectedPath) => path.startsWith(protectedPath)))) { const redirectUrl = request.nextUrl.clone(); redirectUrl.pathname = "/login"; redirectUrl.searchParams.set("next", path); return NextResponse.redirect(redirectUrl); }
  if (user && (path === "/login" || path === "/signup")) { const redirectUrl = request.nextUrl.clone(); redirectUrl.pathname = "/dashboard"; redirectUrl.search = ""; return NextResponse.redirect(redirectUrl); }
  return response;
}
