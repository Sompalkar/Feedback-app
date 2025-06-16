import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  try {
    const code = requestUrl.searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(new URL("/login", requestUrl.origin));
    }

    const cookieStore = cookies();
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(new URL("/login", requestUrl.origin));
    }

    return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(new URL("/login", requestUrl.origin));
  }
}
