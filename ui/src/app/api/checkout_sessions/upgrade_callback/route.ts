import { Database } from "@/lib/database.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Stripe } from "stripe";

const key = process.env.STRIPE_KEY;
if (!key) throw new Error("Missing Stripe Key");
const stripe = new Stripe(key);
const cookieStore = cookies();
const supabase = createRouteHandlerClient<Database>(
  {
    cookies: () => cookieStore,
  },
  {
    options: {
      global: {
        headers: {
          "cache-control": "public, max-age=604800",
        },
      },
    },
  }
);

export async function POST(req: Request, res: any) {
  const { data, error } = await supabase.auth.getSession();

  if (!data.session?.user?.id) throw new Error("No user ID");

  const urlParams = new URL(req.url).searchParams;
  const tier = urlParams.get("tier");

  const { data: upload, error: uploadError } = await supabase
    .from("upgrades")
    .insert({
      // @ts-ignore
      tier: tier,
      id: urlParams.get("id"),
    });

  if (uploadError) {
    console.log(uploadError);
    return new Response(uploadError.message, { status: 500 });
  }

  return new Response(JSON.stringify({ tier: tier }), { status: 200 });
}

export async function GET(req: Request, res: any) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const session_id = searchParams.get("session_id");

    const session = await stripe.checkout.sessions.retrieve(
      session_id as string
    );

    return new Response(JSON.stringify(session));
  } catch (err: any) {
    console.log("Error retrieving checkout session:", err.message);
    return new Response(err.message, { status: err.statusCode || 500 });
  }
}
