import { NextRequest } from "next/server";
import PODHandler from "../../../../classes/PODHandler";

const key = process.env.PRINTFUL_API_KEY;
if (!key) throw new Error("Missing Printful API Key");
const podHandler = new PODHandler(key);

/*
/**
 * 
{
    "recipient": {
        "name": "recipients name",
        "address1": "12 address avenue, Bankstown",
        "city": "Sydney",
        "state_code": "NSW",
        "country_code": "AU",
        "zip": "2200"
    },
    "items": [
        {
            "variant_id": 11513,
            "quantity": 1,
            "files": [
                {
                    "url": "http://example.com/files/posters/poster_1.jpg"
                }
            ]
        }
    ]
}

'https://api.printful.com/orders' with post will create a draft order
'https://api.printful.com/orders' with get will get all orders
'https://api.printful.com/orders/{your_order_id}/confirm' with post will confirm the order

actually fulfills the order, paying for it from funds in the Printful account

'https://api.printful.com/orders/{your_order_id}/confirm' \
 */

export async function POST(req: NextRequest, res: NextRequest) {
  const args = JSON.parse(await req.text());
  const response = await podHandler.createOrder(args);

  try {
    return new Response(JSON.stringify(response), {
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify(err), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
