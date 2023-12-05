// MainProduct.tsx
import { Design } from "@/types/all";
import Image from "next/image";

interface MainProductProps {
  design: Design;
}

export const MainProduct = ({ design }: MainProductProps) => {
  return (
    <div className="rounded-lg max-w-3xl overflow-hidden justify-center text-center align-middle shadow-2xl transition-shadow duration-300 ">
      <Image
        src={design.imageUrl}
        alt={design.name}
        className="w-full h-full object-cover"
        width={768}
        height={768}
      />
    </div>
  );
};
