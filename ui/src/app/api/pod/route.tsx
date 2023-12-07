import { NextRequest } from "next/server";
import PODHandler from "../../../classes/PODHandler";
import { Product } from "@/types/all";
import { promises as fs } from "fs";
import products from "./sync_products";

const podHandler = new PODHandler(process.env.PRINTFUL_API_KEY);

export async function POST(req: NextRequest, res: NextRequest) {
  const storeProds = await podHandler.getStoreProducts();

  console.log(storeProds);
}

export async function GET(req, res) {
  const storeProds = await podHandler.getStoreProducts();

  console.log(storeProds);
}

/**
 * TODO: 1. run through cats once again and get all products then write products to own json for each product, why? print files and pricing
 * TODO: 2. files represent placement of design on product amongst other things
 * TODO: 3. With a json of all avail placements, we can create mock generation tasks with user design images
 * TODO: 4. Once mock generation is complete, we return to user
 * TODO: 5. Mocks are async so will need to poll for completion, UI must reflect this
 * TODO: 6. Once mock is complete, user can select mock and add to cart
 * TODO: 7. User can then checkout and pay for order with inlined stripe object for payment
 * TODO: 8. Once order is paid for, we can create order on printful and return order details to user
 * TODO: 9. User can then view order details and track order status
 * TODO: 10. Product prices are built into api response so pull each product price into seperate json file
 * TODO: 11. When posting new products to store, we can pull price from json file and set price on product creation
 */

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
// async function getProdsFromCat() {
//   const cats = [
//     {
//       id: 55,
//       parent_id: 21,
//       image_url:
//         "https://files.cdn.printful.com/o/upload/catalog_category/6f/6f2f0c50f2558af01e4f8eebbc09a66d_t?v=1695893042",
//       catalog_position: 21,
//       size: "small",
//       title: "Posters",
//     },
//     {
//       id: 56,
//       parent_id: 21,
//       image_url:
//         "https://files.cdn.printful.com/o/upload/catalog_category/34/347883396e6a71fdb25121f20c85e2b3_t?v=1695893042",
//       catalog_position: 25,
//       size: "small",
//       title: "Framed posters",
//     },
//     {
//       id: 57,
//       parent_id: 21,
//       image_url:
//         "https://files.cdn.printful.com/o/upload/catalog_category/7c/7c2dd885646f3971b7199ac833a0232f_t?v=1695893042",
//       catalog_position: 27,
//       size: "small",
//       title: "Canvas prints",
//     },
//     {
//       id: 268,
//       parent_id: 4,
//       image_url:
//         "https://files.cdn.printful.com/o/upload/catalog_category/6b/6bdffdfdd80119c81801095687ccb23c_t?v=1695893042",
//       catalog_position: 2,
//       size: "small",
//       title: "Pins",
//     },
//     {
//       id: 202,
//       parent_id: 190,
//       image_url:
//         "https://files.cdn.printful.com/o/upload/catalog_category/73/73bb6857a7ff2846aa1775d9a5bd3111_t?v=1695893042",
//       catalog_position: 7,
//       size: "small",
//       title: "Stickers",
//     },
//     {
//       id: 239,
//       parent_id: 21,
//       image_url:
//         "https://files.cdn.printful.com/o/upload/catalog_category/ee/ee9abe43d0f1e1830f5db77b1773b9cc_t?v=1695893042",
//       catalog_position: 4,
//       size: "small",
//       title: "Metal prints",
//     },
//     {
//       id: 249,
//       parent_id: 112,
//       image_url:
//         "https://files.cdn.printful.com/o/upload/catalog_category/c0/c0589d987c5ff94537b197c4118744e2_t?v=1695893042",
//       catalog_position: 3,
//       size: "small",
//       title: "Coasters",
//     },
//     {
//       id: 250,
//       parent_id: 243,
//       image_url:
//         "https://files.cdn.printful.com/o/upload/catalog_category/7b/7bde5adc206114f640db91681f62ee33_t?v=1695893042",
//       catalog_position: 3,
//       size: "small",
//       title: "Laptop cases",
//     },
//     {
//       id: 251,
//       parent_id: 243,
//       image_url:
//         "https://files.cdn.printful.com/o/upload/catalog_category/a2/a2e5973f9640d28d55d5a7466cadc09a_t?v=1695893042",
//       catalog_position: 4,
//       size: "small",
//       title: "Mouse pads",
//     },
//     {
//       id: 244,
//       parent_id: 243,
//       image_url:
//         "https://files.cdn.printful.com/o/upload/catalog_category/42/42c30953b1b7a172dcfc034ab03d9dec_t?v=1695893042",
//       catalog_position: 0,
//       size: "small",
//       title: "Phone cases",
//     },
//   ];

//   const allProducts = [];

//   for (const vars of cats) {
//     const prods = await podHandler.getProductsInCategory(vars.id);
//     const prodInfos = [];

//     if (prods.code !== 200) continue;
//     if (prods.result.length === 0) continue;
//     const results = prods.result;

//     for (const item of results) {
//       if (item.is_discontinued) continue;
//       prodInfos.push(item);
//     }

//     for (const item of prodInfos) {
//       const prodDeets = await podHandler.getProductDetails(item.id);
//       if (prodDeets.code !== 200) continue;

//       const prod = prodDeets.result;
//       const prodVariants = prod.variants;

//       let prodObjs = [];

//       for (const variant of prodVariants) {
//         prodObjs.push({
//           variant_id: variant.id,
//           files: variant.image,
//         });
//       }

//       const product: Product = {
//         sync_product: {
//           name: prod.product.title,
//         },
//         sync_variants: prodObjs,
//       };

//       allProducts.push(product);
//     }
//   }

//   for (const prod of allProducts) {
//     await fs.writeFile(
//       `./public/sync_products/${prod.sync_product.name
//         .toLowerCase()
//         .split(" ")
//         .join("_")}.json`,
//       JSON.stringify(prod)
//     );
//   }
// }
