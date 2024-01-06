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

  console.log(args);
  const response = await podHandler.estimateCosts(args);

  delete response.result.costs.subtotal;
  delete response.result.costs.total;

  const data = {
    currency: response.result.costs.currency,
    total: response.result.retail_costs.total,
    discount: response.result.costs.discount,
    shipping: response.result.costs.shipping,
    tax: response.result.costs.tax,
    vat: response.result.retail_costs.vat,
    additional_fee: response.result.costs.additional_fee,
    fulfillment_fee: response.result.costs.fulfillment_fee,
    digitization_fee: response.result.costs.digitization,
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
