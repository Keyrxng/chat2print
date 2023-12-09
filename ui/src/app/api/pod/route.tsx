import { NextRequest } from "next/server";
import PODHandler from "../../../classes/PODHandler";
import Products from "@/data/products";
import fs from "fs/promises";

const key = process.env.PRINTFUL_API_KEY;
if (!key) throw new Error("Missing Printful API Key");
const podHandler = new PODHandler(key);

export async function POST(req: NextRequest, res: NextRequest) {
  const templates = [];

  for (const product of Object.values(Products)) {
    const temp = await podHandler.getTemplateLayout(product.product.id);
    const printFiles = await podHandler.getVariantPrintFiles(
      product.product.id
    );

    const p = {
      name: product.product.title,
      template: temp.result,
      printFiles: printFiles.result,
    };
    templates.push(p);
  }

  for (const template of templates) {
    await fs.writeFile(
      `./src/data/templates/${template.name}.json`,
      JSON.stringify(template)
    );
  }
}

export async function GET(req: any, res: any) {
  const templates = [];

  for (const product of Object.values(Products)) {
    const temp = await podHandler.getTemplateLayout(product.product.id);
    const printFiles = await podHandler.getVariantPrintFiles(
      product.product.id
    );

    const p = {
      name: product.product.title,
      template: temp.result,
      printFiles: printFiles.result,
    };
    templates.push(p);
  }

  for (const template of templates) {
    await fs.writeFile(
      `./src/data/templates/${template.name}.json`,
      JSON.stringify(template)
    );
  }
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
