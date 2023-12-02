import { NextRequest } from "next/server";
import PODHandler from "./PODHandler";
import { Product } from "@/types/all";

const podHandler = new PODHandler(process.env.PRINTFUL_API_KEY);

/**
 *
 * @param req body should contain imageUrl
 */
export async function handler(req, res) {
  const sponse = {
    result: {
      id: "123",
      name: "Test Product",
      slug: "test-product",
      variants: [
        {
          id: "123",
          name: "Test Product",
          slug: "test-product",
          files: [
            {
              id: "123",
              name: "Test Product",
              slug: "test-product",
              url: "https://www.google.com",
            },
          ],
        },
      ],
    },
  };

  res.status(200).json(sponse);
}

export async function POST(req: NextRequest, res: NextRequest) {
  // console.log("podHandler");
  // const store = await podHandler.getStoreProducts();
  // console.log("store products: ", store);
  // const testProd = {
  //   sync_product: {
  //     name: "string",
  //   },
  //   sync_variants: [
  //     {
  //       variant_id: 1,
  //       files: [
  //         {
  //           url: "string",
  //         },
  //       ],
  //     },
  //   ],
  // };

  // const cats = await podHandler.getProductCategories();

  // const product = await podHandler.getProductsInCategory(56);

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

  return new Response(JSON.stringify(sponse), {
    status: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}

export async function GET(req, res) {
  console.log(req.body);

  const sponse = {
    result: {
      id: "123",
      name: "Test Product",
      slug: "test-product",
      variants: [
        {
          id: "123",
          name: "Test Product",
          slug: "test-product",
          files: [
            {
              id: "123",
              name: "Test Product",
              slug: "test-product",
              url: "https://www.google.com",
            },
          ],
        },
      ],
    },
  };

  return new Response(JSON.stringify(sponse), {
    status: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}
