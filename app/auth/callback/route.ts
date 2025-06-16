import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(
        new URL("/login?error=No code provided", requestUrl.origin)
      );
    }

    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(
        new URL("/login?error=Invalid code", requestUrl.origin)
      );
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(
      new URL("/login?error=Something went wrong", requestUrl.origin)
    );
  }
}
