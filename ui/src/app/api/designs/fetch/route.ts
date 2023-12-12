import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import type { Database } from "@/lib/database.types";

export async function POST() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });

  const { data, error } = await supabase.auth.getSession();

  if (!data.session?.user?.id) throw new Error("No user ID");

  console.log(data.session);
  console.log(error);

  if (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
    });
  }
  return new Response(JSON.stringify({ data }), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}

export async function GET() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });

  const { data, error } = await supabase.auth.getSession();

  if (!data.session?.user?.id) throw new Error("No user ID");

  const { data: designs } = await supabase.storage
    .from("user_uploads")
    .list(`${data.session?.user?.id}/`);

  const handleUpscaled = async () => {
    const { data: image } = await supabase.storage
      .from("user_uploads")
      .list(`${data.session?.user?.id}/upscaled/`);
  };

  const images = await Promise.all(
    designs!.map(async (design) => {
      if (design.name === "temp.png") return;
      if (design.name === "upscaled") return;
      if (design.name === null || design.name === undefined) return;
      const { data: image } = supabase.storage
        .from("user_uploads")
        .getPublicUrl(`${data.session?.user?.id}/${design.name}`);
      return image.publicUrl;
    })
  );

  images.filter((image) => image !== undefined && image !== null);

  if (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
    });
  }
  return new Response(JSON.stringify({ images }), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}
