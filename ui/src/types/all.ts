export interface _Product {
  name: string;
  id: number;
}

export interface Variant {
  variant_id: number;
  variant_name: string;
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
