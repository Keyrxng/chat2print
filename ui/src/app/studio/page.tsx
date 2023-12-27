import { ProductOption } from "@/components/ProductOption";
import { ProductsDisplay } from "@/components/ProductsDisplay";
import products from "@/data/products";
import React, { Suspense } from "react";

export async function generateStaticParams() {
  const prods = Object.values(products);

  let paths: { product: string; type: string; vid: number; pid: number }[] = [];

  for (const prod of prods) {
    const product = await fetch("/api/data/product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pid: prod.product }),
    });

    const json = await product.json();

    paths.push({
      type: "custom-" + json.product.type.toLowerCase(),
      product: json.variant.name.toLowerCase().replace(" ", "-"),
      vid: json.variant.id,
      pid: json.product.id,
    });
  }

  return paths;
}

export default function Page(params: { [x: string]: never }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-center text-accent">
        Select a blank product to start designing
      </h1>
      <div className="grid grid-cols-3 mx-8 pt-4 px-4 gap-4">
        {Object.values(products).map((option) => (
          <ProductOption
            key={option.product.id}
            product={option}
            vid={params.vid}
            pid={params.pid}
          />
        ))}
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductsDisplay />
      </Suspense>
    </div>
  );
}
