import Products from "@/data/products";

const products = Object.values(Products);

export async function POST(req: any, res: any) {
  const data = products.find(
    (product) => product.product.title === req.body.title
  );

  if (!data) {
    return new Response(JSON.stringify({ error: "Invalid product" }), {
      status: 401,
    });
  }

  const product = data.product;
  const variants = data.variants;

  return new Response(
    JSON.stringify({
      product,
      variants,
    }),
    {
      status: 200,
    }
  );
}
