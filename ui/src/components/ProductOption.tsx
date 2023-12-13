// ProductOption.tsx
import { Design, __Prod } from "@/types/all";
import Image from "next/image";

interface ProductOptionProps {
  key: number;
  image: string;
  product: __Prod;
  isSelected: boolean;
  onSelect: (design: __Prod) => void;
}

export const ProductOption = ({
  image,
  product,
  isSelected,
  onSelect,
}: ProductOptionProps) => {
  const selectedClass = isSelected
    ? "ring ring-offset-2 ring-offset-accent ring-accent"
    : "";
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
        <h3 className="text-sm font-bold">{product?.product.type_name}</h3>
        <p className="text-sm font-bold">
          £{product?.priceRange.low} - £{product?.priceRange.high}
        </p>
      </div>
    </div>
  );
};
