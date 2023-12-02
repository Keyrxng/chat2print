import React from "react";
import { useRouter } from "next/router";
import ProductCard from "@/components/ProductCard";
import productsAPI from "../api/pod/route";

interface Props {
  product: any;
}

const Page = ({ product }: Props) => {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return <ProductCard product={product} />;
};

export const generateStaticParams = async () => {
  const products = await productsAPI();
  const params = products.map((product) => ({
    params: { product: product.slug },
  }));
  return params;
};

export const generateStaticPaths = async () => {
  const paths = await generateStaticParams();
  return {
    paths,
    fallback: false,
  };
};
