import { ProductOption } from "@/components/ProductOption";
import products from "@/data/products";
import React from "react";

export async function generateStaticParams() {
  const prods = Object.values(products);

  let paths: { product: string; type: string; vid: number; pid: number }[] = [];
  prods.forEach((product) => {
    product.variants.forEach((variant) => {
      paths.push({
        type: "custom-" + product.product.type.toLowerCase(),
        product: variant.name.toLowerCase().replace(" ", "-"),
        vid: variant.id,
        pid: product.product.id,
      });
    });
  });

  return paths;
}

export default function page(params: {
  type: string;
  product: string;
  vid: number;
  pid: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-center text-accent">
        Select a blank product to start designing
      </h1>
      <div className="grid grid-cols-2 mx-8 pt-4 px-4 md:grid-cols-4 gap-4">
        {Object.values(products).map((option) => (
          <ProductOption
            key={option.product.id}
            product={option}
            vid={params.vid}
            pid={params.pid}
          />
        ))}
      </div>
    </div>
  );
}
