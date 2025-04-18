import { NextRequest } from "next/server";
import PODHandler from "../../../../classes/PODHandler";

const podHandler = new PODHandler();
/*
'https://api.printful.com/orders' with post will create a draft order
'https://api.printful.com/orders' with get will get all orders
'https://api.printful.com/orders/{your_order_id}/confirm' with post will confirm the order

actually fulfills the order, paying for it from funds in the Printful account

'https://api.printful.com/orders/{your_order_id}/confirm' \
 */

export async function POST(req: NextRequest, res: NextRequest) {
  const args = JSON.parse(await req.text());

  const response = await podHandler.createOrder(args);

  const data = {
    status: response.result.status,
    dpi: response.result.items[0].files[0].dpi,
    print_status: response.result.items[0].files[0].status,
  };

  try {
    return new Response(JSON.stringify(data), {
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify(err), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
