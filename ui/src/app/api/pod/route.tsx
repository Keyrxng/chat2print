import { NextRequest } from "next/server";
import PODHandler from "./PODHandler";
import fs from "fs";
import { Product } from "@/types/all";

const podHandler = new PODHandler(process.env.PRINTFUL_API_KEY);

/**
 * 
 * @param req  {
      id: 36,
      parent_id: 9,
      image_url: 'https://files.cdn.printful.com/o/upload/catalog_category/e6/e6e4aff73d34be63c8d5b36ff4fc90ee_t?v=1695893042',
      catalog_position: 19,
      size: 'small',
      title: 'Hoodies'
    },
    {
      id: 37,
      parent_id: 9,
      image_url: 'https://files.cdn.printful.com/o/upload/catalog_category/cc/cc038c312495fd88d73b582c6b09e15f_t?v=1695893042',
      catalog_position: 9,
      size: 'small',
      title: 'Sweatshirts'
    },
    {
      id: 38,
      parent_id: 12,
      image_url: 'https://files.cdn.printful.com/o/upload/catalog_category/b6/b6a957579df32ee1de862559b7dcd2d6_t?v=1695893042',
      catalog_position: 5,
      size: 'small',
      title: 'T-shirts'
    },
{
      id: 55,
      parent_id: 21,
      image_url: 'https://files.cdn.printful.com/o/upload/catalog_category/6f/6f2f0c50f2558af01e4f8eebbc09a66d_t?v=1695893042',
      catalog_position: 21,
      size: 'small',
      title: 'Posters'
    },
    {
      id: 56,
      parent_id: 21,
      image_url: 'https://files.cdn.printful.com/o/upload/catalog_category/34/347883396e6a71fdb25121f20c85e2b3_t?v=1695893042',
      catalog_position: 25,
      size: 'small',
      title: 'Framed posters'
    },
    {
      id: 57,
      parent_id: 21,
      image_url: 'https://files.cdn.printful.com/o/upload/catalog_category/7c/7c2dd885646f3971b7199ac833a0232f_t?v=1695893042',
      catalog_position: 27,
      size: 'small',
      title: 'Canvas prints'
    },
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
  console.log("podHandler");
  const store = await podHandler.getStoreProducts();
  console.log("store products: ", store);
  const testProd = {
    sync_product: {
      name: "string",
    },
    sync_variants: [
      {
        variant_id: 1,
        files: [
          {
            url: "string",
          },
        ],
      },
    ],
  };

  const cats = await podHandler.getProductCategories();

  const product = await podHandler.getProductsInCategory(56);

  const prodInfo = await podHandler.getProductDetails(172);

  const newProduct: Product = {
    sync_product: {
      name: "Test Product",
    },
    sync_variants: [
      {
        variant_id: 1,
        files: [
          {
            url: await req.json().then((data) => data.imageUrl),
          },
        ],
      },
    ],
  };

  const newProd = await podHandler.createProduct(newProduct);

  console.log("new product: ", newProd);

  const newProducts = await podHandler.getStoreProducts();
  console.log("new store products: ", newProducts);

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
