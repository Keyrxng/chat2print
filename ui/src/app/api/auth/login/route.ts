import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import type { Database } from "@/lib/database.types";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  const doesUserHaveStorageFolder = await supabase.storage
    .from("user_uploads")
    .list(`${data.user?.id}/`);

  if (doesUserHaveStorageFolder.data?.length === 0) {
    const { error: folderError } = await supabase.storage
      .from("user_uploads")
      .upload(`${data.user?.id}/temp.png`, "temp", {
        cacheControl: "3600",
        upsert: false,
      });

    if (folderError)
      return new Response(JSON.stringify(folderError), { status: 420 });
  }

  if (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
    });
  } else {
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  }
}
