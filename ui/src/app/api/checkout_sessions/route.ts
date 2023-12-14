import { Stripe } from "stripe";

const key = process.env.STRIPE_KEY;
if (!key) throw new Error("Missing Stripe Key");
const stripe = new Stripe(key);

export async function POST(req: Request, res: any) {
  const args = await req.json();

  const name = args.mockup.product;
  const price = Math.round(Number(args.itemPrice));
  const quantity = args.quantity.toString();

  const currency = "usd";

  console.log("Creating checkout session for:", name, price, quantity);

  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: name,
            },
            unit_amount: price * 100,
          },
          quantity: quantity,
        },
      ],
      mode: "payment",
      return_url: `${req.headers.get(
        "origin"
      )}/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    return new Response(
      JSON.stringify({ clientSecret: session.client_secret })
    );
  } catch (err: any) {
    console.log("Error creating checkout session:", err.message);
    return new Response(err.message, { status: err.statusCode || 500 });
  }
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
