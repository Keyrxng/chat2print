import { __Prod } from "@/types/all";
import Image from "next/image";

interface ProductOptionProps {
  product: __Prod;
  vid: number;
  pid: number;
}

export const ProductOption = ({ product, vid, pid }: ProductOptionProps) => {
  const isSame =
    Math.round(Number(product?.priceRange.low) * 1.8) ===
    Math.round(Number(product?.priceRange.high) * 1.8);

  const prod = product.variants[0].name
    .replaceAll(" ", "-")
    .replaceAll("-/-", "-")
    .toLowerCase();

  const url = `/studio/${prod}?pid=${product.product.id}&vid=${product.variants[0].id}`;

  return (
    <a href={url} className="flex flex-col items-center justify-center">
      <div
        className={`cursor-pointer mx-auto p-4 rounded-lg border gradientBG text-muted-foreground hover:bg-dark-700 transition duration-300 ease-in-out hover:scale-105`}
      >
        <Image
          width={300}
          height={300}
          src={product?.product.image}
          alt={product?.product.type_name}
          className="rounded-lg"
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />
        <div className="text-center mt-2">
          <h3 className="text-sm text-accent font-bold">
            {product?.product.type_name}
          </h3>
          <p className="text-sm font-bold">
            {!isSame
              ? `From £${Math.round(
                  Number(product?.priceRange.low) * 1.8
                )} - £${Math.round(Number(product?.priceRange.high) * 1.8)}`
              : `£${Math.round(Number(product?.priceRange.low) * 1.8)}`}
          </p>
        </div>
      </div>
    </a>
  );
};
