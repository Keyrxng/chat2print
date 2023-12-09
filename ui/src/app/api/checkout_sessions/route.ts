import { Stripe } from "stripe";

const key = process.env.STRIPE_KEY;
if (!key) throw new Error("Missing Stripe Key");
const stripe = new Stripe(key);

export async function POST(req: Request, res: any) {
  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "T-shirt",
            },
            unit_amount: 2000,
          },
          quantity: 1,
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
    return new Response(err.message, { status: err.statusCode || 500 });
  }
}
