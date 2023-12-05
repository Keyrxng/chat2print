// MainProduct.tsx
import { Design } from "@/types/all";
import Image from "next/image";

interface MainProductProps {
  design: Design;
}

export const MainProduct = ({ design }: MainProductProps) => {
  return (
    <div className="rounded-lg overflow-hidden justify-center text-center align-middle shadow-2xl transition-shadow duration-300 border-4 border-yellow-500">
      <Image
        src={design.imageUrl}
        alt={design.name}
        className="w-full h-full object-cover"
        width={300}
        height={300}
      />
    </div>
  );
};
