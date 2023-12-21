import { __Prod } from "@/types/all";
import Image from "next/image";

interface ProductOptionProps {
  key: number;
  product: __Prod;
  isSelected: boolean;
  onSelect: (design: __Prod) => void;
}

export const ProductOption = ({
  product,
  isSelected,
  onSelect,
}: ProductOptionProps) => {
  const selectedClass = isSelected
    ? "ring ring-offset-2 ring-offset-accent ring-accent"
    : "";

  const isSame =
    Math.round(Number(product?.priceRange.low) * 2) ===
    Math.round(Number(product?.priceRange.high) * 2);

  return (
    <div
      className={`cursor-pointer mx-auto p-4 rounded-lg border gradientBG text-muted-foreground hover:bg-dark-700 transition duration-300 ease-in-out hover:scale-105 ${selectedClass}`}
      onClick={() => onSelect(product)}
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
                Number(product?.priceRange.low) * 2
              )} - £${Math.round(Number(product?.priceRange.high) * 2)}`
            : `£${Math.round(Number(product?.priceRange.low) * 2)}`}
        </p>
      </div>
    </div>
  );
};
