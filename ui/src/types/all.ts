export interface _Product {
  name: string;
}

export interface Variant {
  variant_id: number;
  files: File[];
}

export interface File {
  url: string;
}

export type Product = {
  sync_product: _Product;
  sync_variants: Variant[];
};

export interface Design {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

import Products from "@/data/products";
export type __ProductsList = typeof Products;
export type __Prod = typeof Products extends { [key: string]: infer U }
  ? U
  : never;
export type __Product = __Prod["product"];
export type __Variant = __Prod["variants"][number];

import Templates from "@/data/templates";

export type __TemplatesList = typeof Templates;
export type __Temp = typeof Templates extends { [key: string]: infer U }
  ? U
  : never;
export type __ProductTemplate = __Temp["template"];
export type __VariantMapping = __ProductTemplate["variant_mapping"];
export type __Template = __Temp["template"]["templates"][number]
export type __PrintFiles = __Temp["printFiles"];

