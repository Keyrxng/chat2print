import { NextRequest } from "next/server";
import PODHandler from "../../../classes/PODHandler";
import { Product } from "@/types/all";
import Products from "./newProducts.json";
import _Products from "./products.json";
import { promises as fs } from "fs";

const podHandler = new PODHandler(process.env.PRINTFUL_API_KEY);

export async function POST(req: NextRequest, res: NextRequest) {
  console.log("podHandler");
  const store = await podHandler.getStoreProducts();

  const prodVariants = [];
  const prodInfos = [];

  for (const item of _Products) {
    prodInfos.push(item.result.product);
    prodVariants.push(item.result.variants);
  }

  const products = [];
  for (const item of prodInfos) {
    const product = {
      ...item,
      variants: prodVariants[prodInfos.indexOf(item)],
    };
    products.push(product);
  }

  const newProducts = [];

  for (const product of products) {
    if (product.is_discontinued) continue;
    const newProduct: Product = {
      sync_product: {
        name: product.title,
        id: product.id,
      },
      sync_variants: product.variants.map((variant) => ({
        variant_id: variant.id,
        variant_name: variant.name,
        files: [
          {
            url: variant.image,
          },
        ],
      })),
    };
    newProducts.push(newProduct);
  }

  await fs.writeFile("./public/newProducts.json", JSON.stringify(newProducts));
}
export async function GET(req, res) {
  console.log("podHandler");
  const store = await podHandler.getStoreProducts();

  const prodVariants = [];
  const prodInfos = [];

  for (const item of _Products) {
    prodInfos.push(item.result.product);
    prodVariants.push(item.result.variants);
  }

  const products = [];
  for (const item of prodInfos) {
    const product = {
      ...item,
      variants: prodVariants[prodInfos.indexOf(item)],
    };
    products.push(product);
  }

  const newProducts = [];
  const cats = [
    {
      id: 55,
      parent_id: 21,
      image_url:
        "https://files.cdn.printful.com/o/upload/catalog_category/6f/6f2f0c50f2558af01e4f8eebbc09a66d_t?v=1695893042",
      catalog_position: 21,
      size: "small",
      title: "Posters",
    },
    {
      id: 56,
      parent_id: 21,
      image_url:
        "https://files.cdn.printful.com/o/upload/catalog_category/34/347883396e6a71fdb25121f20c85e2b3_t?v=1695893042",
      catalog_position: 25,
      size: "small",
      title: "Framed posters",
    },
    {
      id: 57,
      parent_id: 21,
      image_url:
        "https://files.cdn.printful.com/o/upload/catalog_category/7c/7c2dd885646f3971b7199ac833a0232f_t?v=1695893042",
      catalog_position: 27,
      size: "small",
      title: "Canvas prints",
    },
    {
      id: 268,
      parent_id: 4,
      image_url:
        "https://files.cdn.printful.com/o/upload/catalog_category/6b/6bdffdfdd80119c81801095687ccb23c_t?v=1695893042",
      catalog_position: 2,
      size: "small",
      title: "Pins",
    },
    {
      id: 202,
      parent_id: 190,
      image_url:
        "https://files.cdn.printful.com/o/upload/catalog_category/73/73bb6857a7ff2846aa1775d9a5bd3111_t?v=1695893042",
      catalog_position: 7,
      size: "small",
      title: "Stickers",
    },
    {
      id: 239,
      parent_id: 21,
      image_url:
        "https://files.cdn.printful.com/o/upload/catalog_category/ee/ee9abe43d0f1e1830f5db77b1773b9cc_t?v=1695893042",
      catalog_position: 4,
      size: "small",
      title: "Metal prints",
    },
    {
      id: 249,
      parent_id: 112,
      image_url:
        "https://files.cdn.printful.com/o/upload/catalog_category/c0/c0589d987c5ff94537b197c4118744e2_t?v=1695893042",
      catalog_position: 3,
      size: "small",
      title: "Coasters",
    },
    {
      id: 250,
      parent_id: 243,
      image_url:
        "https://files.cdn.printful.com/o/upload/catalog_category/7b/7bde5adc206114f640db91681f62ee33_t?v=1695893042",
      catalog_position: 3,
      size: "small",
      title: "Laptop cases",
    },
    {
      id: 251,
      parent_id: 243,
      image_url:
        "https://files.cdn.printful.com/o/upload/catalog_category/a2/a2e5973f9640d28d55d5a7466cadc09a_t?v=1695893042",
      catalog_position: 4,
      size: "small",
      title: "Mouse pads",
    },
    {
      id: 244,
      parent_id: 243,
      image_url:
        "https://files.cdn.printful.com/o/upload/catalog_category/42/42c30953b1b7a172dcfc034ab03d9dec_t?v=1695893042",
      catalog_position: 0,
      size: "small",
      title: "Phone cases",
    },
  ];
  let count = 0;
  for (const product of products) {
    if (product.is_discontinued) continue;
    const newProduct: Product = {
      sync_product: {
        name: product.title,
        id: product.id,
      },
      sync_variants: product.variants.map((variant) => ({
        variant_id: variant.id,
        variant_name: variant.name,
        files: [
          {
            url: variant.image,
          },
        ],
      })),
    };
    newProducts.push(newProduct);
  }

  await fs.writeFile("./public/newProducts.json", JSON.stringify(newProducts));
}
// const cats = [
//   {
//     id: 55,
//     parent_id: 21,
//     image_url:
//       "https://files.cdn.printful.com/o/upload/catalog_category/6f/6f2f0c50f2558af01e4f8eebbc09a66d_t?v=1695893042",
//     catalog_position: 21,
//     size: "small",
//     title: "Posters",
//   },
//   {
//     id: 56,
//     parent_id: 21,
//     image_url:
//       "https://files.cdn.printful.com/o/upload/catalog_category/34/347883396e6a71fdb25121f20c85e2b3_t?v=1695893042",
//     catalog_position: 25,
//     size: "small",
//     title: "Framed posters",
//   },
//   {
//     id: 57,
//     parent_id: 21,
//     image_url:
//       "https://files.cdn.printful.com/o/upload/catalog_category/7c/7c2dd885646f3971b7199ac833a0232f_t?v=1695893042",
//     catalog_position: 27,
//     size: "small",
//     title: "Canvas prints",
//   },
//   {
//     id: 268,
//     parent_id: 4,
//     image_url:
//       "https://files.cdn.printful.com/o/upload/catalog_category/6b/6bdffdfdd80119c81801095687ccb23c_t?v=1695893042",
//     catalog_position: 2,
//     size: "small",
//     title: "Pins",
//   },
//   {
//     id: 202,
//     parent_id: 190,
//     image_url:
//       "https://files.cdn.printful.com/o/upload/catalog_category/73/73bb6857a7ff2846aa1775d9a5bd3111_t?v=1695893042",
//     catalog_position: 7,
//     size: "small",
//     title: "Stickers",
//   },
//   {
//     id: 239,
//     parent_id: 21,
//     image_url:
//       "https://files.cdn.printful.com/o/upload/catalog_category/ee/ee9abe43d0f1e1830f5db77b1773b9cc_t?v=1695893042",
//     catalog_position: 4,
//     size: "small",
//     title: "Metal prints",
//   },
//   {
//     id: 249,
//     parent_id: 112,
//     image_url:
//       "https://files.cdn.printful.com/o/upload/catalog_category/c0/c0589d987c5ff94537b197c4118744e2_t?v=1695893042",
//     catalog_position: 3,
//     size: "small",
//     title: "Coasters",
//   },
//   {
//     id: 250,
//     parent_id: 243,
//     image_url:
//       "https://files.cdn.printful.com/o/upload/catalog_category/7b/7bde5adc206114f640db91681f62ee33_t?v=1695893042",
//     catalog_position: 3,
//     size: "small",
//     title: "Laptop cases",
//   },
//   {
//     id: 251,
//     parent_id: 243,
//     image_url:
//       "https://files.cdn.printful.com/o/upload/catalog_category/a2/a2e5973f9640d28d55d5a7466cadc09a_t?v=1695893042",
//     catalog_position: 4,
//     size: "small",
//     title: "Mouse pads",
//   },
//   {
//     id: 244,
//     parent_id: 243,
//     image_url:
//       "https://files.cdn.printful.com/o/upload/catalog_category/42/42c30953b1b7a172dcfc034ab03d9dec_t?v=1695893042",
//     catalog_position: 0,
//     size: "small",
//     title: "Phone cases",
//   },
// ];
// const prodInfo = await podHandler.getProductDetails(172);

// const newProduct: Product = {
//   sync_product: {
//     name: "Test Product",
//   },
//   sync_variants: [
//     {
//       variant_id: 1,
//       files: [
//         {
//           url: await req.json().then((data) => data.imageUrl),
//         },
//       ],
//     },
//   ],
// };

// const newProd = await podHandler.createProduct(newProduct);

// console.log("new product: ", newProd);

// const newProducts = await podHandler.getStoreProducts();
// console.log("new store products: ", newProducts);

// const sponse = {
//   result: {
//     id: "123",
//     name: "Test Product",
//     slug: "test-product",
//     variants: [
//       {
//         id: "123",
//         name: "Test Product",
//         slug: "test-product",
//         files: [
//           {
//             id: "123",
//             name: "Test Product",
//             slug: "test-product",
//             url: "https://www.google.com",
//           },
//         ],
//       },
//     ],
//   },
// };

// return new Response(JSON.stringify(sponse), {
//   status: 200,
//   headers: { "Access-Control-Allow-Origin": "*" },
// });

/**
 *   console.log("store products: ", store);

  const prodVariants = [];
  const prodInfos = [];

  for (const item of Products) {
    prodInfos.push(item.result.product);
    prodVariants.push(item.result.variants);
  }

  const products = [];
  for (const item of prodInfos) {
    const product = {
      ...item,
      variants: prodVariants[prodInfos.indexOf(item)],
    };
    products.push(product);
  }

  const newProducts = [];

  for (const product of products) {
    if (product.is_discontinued) continue;
    const newProduct: Product = {
      sync_product: {
        name: product.title,
      },
      sync_variants: product.variants.map((variant) => ({
        variant_id: variant.id,
        variant_name: variant.name,
        files: [
          {
            url: variant.image,
          },
        ],
      })),
    };
    newProducts.push(newProduct);
  }

  await fs.writeFile("./public/newProducts.json", JSON.stringify(newProducts));
 */
