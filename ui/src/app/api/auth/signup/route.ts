import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import type { Database } from "@/lib/database.types";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
  try {
    const { data: user, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${requestUrl.origin}/api/auth/callback`,
      },
    });

    if (error) {
      return new Response(JSON.stringify(error), {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify({ user }), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify(err), {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
    });
  }
}
