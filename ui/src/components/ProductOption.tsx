// ProductOption.tsx
import { Design } from "@/types/all";
import Image from "next/image";

interface ProductOptionProps {
  design: Design;
  isSelected: boolean;
  onSelect: (design: Design) => void;
}

export const ProductOption = ({
  design,
  isSelected,
  onSelect,
}: ProductOptionProps) => {
  const selectedClass = isSelected
    ? "ring ring-offset-2 ring-offset-accent ring-accent"
    : "";
  return (
    <div
      className={`cursor-pointer mx-auto p-4 rounded-lg border gradientBG text-muted-foreground hover:bg-dark-700 transition duration-300 ease-in-out hover:scale-105 ${selectedClass}`}
      onClick={() => onSelect(design)}
    >
      <Image
        width={300}
        height={300}
        src={design.imageUrl}
        alt={design.name}
        className="rounded-lg"
      />
      <div className="text-center mt-2">
        <h3 className="text-lg font-bold">{design.name}</h3>
        <p className="text-sm">{design.description}</p>
        <p className="text-md font-bold">${design.price}</p>
      </div>
    </div>
  );
};
