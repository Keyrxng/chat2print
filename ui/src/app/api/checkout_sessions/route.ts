import { Stripe } from "stripe";

const key = process.env.STRIPE_KEY;
if (!key) throw new Error("Missing Stripe Key");
const stripe = new Stripe(key);

export async function POST(req: Request, res: any) {
  const args = await req.json();

  const name = args.mockup.product;
  const price = Math.round(Number(args.itemPrice));
  const quantity = args.quantity.toString();
  const stock = args.stock;
  const userDetails = args.userDetails;

  const eu = [
    "AL",
    "AD",
    "AM",
    "AT",
    "AZ",
    "BY",
    "BE",
    "BA",
    "BG",
    "HR",
    "CY",
    "CZ",
    "DK",
    "EE",
    "FI",
    "FR",
    "GE",
    "DE",
    "GR",
    "HU",
    "IS",
    "IE",
    "IT",
    "KZ",
    "XK",
    "LV",
    "LI",
    "LT",
    "LU",
    "MT",
    "MD",
    "MC",
    "ME",
    "NL",
    "MK",
    "NO",
    "PL",
    "PT",
    "RO",
    "RU",
    "SM",
    "RS",
    "SK",
    "SI",
    "ES",
    "SE",
    "CH",
    "TR",
    "UA",
    "GB",
    "VA",
  ];

  const inStock = stock.filter((item: any) => {
    if (item.status === "in_stock") {
      if (item.region.length > 2) {
        item.region = item.region.slice(3);
      }
      return item.region;
    }
  });
  const inStockRegion = inStock.map((item: any) => item.region);

  if (inStockRegion.includes("EU")) {
    inStockRegion.findIndex((item: string) => item === "EU");
    inStockRegion.splice(
      inStockRegion.findIndex((item: string) => item === "EU"),
      1
    );
    inStockRegion.push(...eu);
  }

  if (inStockRegion.includes("UK")) {
    inStockRegion.findIndex((item: string) => item === "UK");
    inStockRegion.splice(
      inStockRegion.findIndex((item: string) => item === "UK"),
      1
    );
    inStockRegion.push("GB");
  }

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      payment_method_types: ["card"],
      billing_address_collection: userDetails.billing_address
        ? "required"
        : "auto",
      phone_number_collection: {
        enabled: true,
      },
      customer_email: userDetails.email,
      shipping_address_collection: {
        allowed_countries: inStockRegion,
      },
      currency: "GBP",
      line_items: [
        {
          price_data: {
            currency: "GBP",
            product_data: {
              name: name,
            },
            unit_amount: price * 100,
          },
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
            maximum: 10,
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
      JSON.stringify({ clientSecret: session.client_secret, id: session.id })
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
