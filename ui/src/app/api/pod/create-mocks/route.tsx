import { NextRequest } from "next/server";
import PODHandler from "../../../../classes/PODHandler";

const podHandler = new PODHandler();

export async function POST(req: NextRequest, res: NextRequest) {
  const args = JSON.parse(await req.text());
  try {
    const response = await podHandler.createMockupTask(
      args.productId,
      args.imageUrl,
      args.variantIDs,
      args.scaledWidth,
      args.scaledHeight,
      args.offsetX,
      args.offsetY
    );

    return new Response(JSON.stringify(response), {
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

export async function GET(req: any, res: any) {
  const body = req.body;
  // const args = JSON.parse(body);

  // console.log(args);
  // console.log(await req.text());
}

// async function postProductsToStore() {
//   const canvases = products.canvas;
//   const framedCanvas = products.framed_canvas;
//   const thinCanvas = products.thin_canvas;
//   const posters = products.premium_luster_photo_paper_poster;
//   const framedPosters = products.premium_luster_photo_paper_framed_poster;
//   const metalPrints = products.glossy_metal_print;
//   const stickers = products.sticker_sheet;
//   const pins = products.pin_buttons;
//   const coasters = products.cork_coaster;
//   const clearIphoneCases = products.clear_iphone_case;
//   const toughIphoneCases = products.tough_iphone_case;
//   const clearSamsungCases = products.clear_samsung_case;
//   const toughSamsungCases = products.tough_samsung_case;
//   const mousePads = products.mouse_pad;
//   const gamingMousePads = products.gaming_mouse_pad;
//   const holographicStickers = products.holographic_stickers;
//   const laptopSleeves = products.laptop_sleeve;
//   const snapSamsungCasess = products.snap_samsung_case;
//   const snapIphoneCases = products.snap_iphone_case;

//   const prods = [
//     canvases,
//     framedCanvas,
//     thinCanvas,
//     posters,
//     framedPosters,
//     metalPrints,
//     stickers,
//     pins,
//     coasters,
//     clearIphoneCases,
//     toughIphoneCases,
//     clearSamsungCases,
//     toughSamsungCases,
//     mousePads,
//     gamingMousePads,
//     holographicStickers,
//     laptopSleeves,
//     snapSamsungCasess,
//     snapIphoneCases,
//   ];

//   for (const prod of prods) {
//     console.log(`Creating product:  ${prod.sync_product.name}`);
//     await podHandler.createProduct(prod);

//     console.log(`Bracing for timeout...`);
//     await new Promise((resolve) => setTimeout(resolve, 15000));
//   }
// }
