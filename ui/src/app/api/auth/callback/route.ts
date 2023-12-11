import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import type { Database } from "@/lib/database.types";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({
      cookies: () => cookieStore,
    });
    await supabase.auth.exchangeCodeForSession(code);

    const { data: user } = await supabase.auth.getUser(code);

    console.log("user", user);

    const { data, error: folderError } = await supabase.storage
      .from("user_uploads")
      .upload(`${user.user?.id}/temp.png`, "temp", {
        cacheControl: "3600",
        upsert: false,
      });

    console.log("upload nfolder", data);

    if (folderError) throw folderError;
  }

  return NextResponse.redirect(requestUrl.origin);
}
