// Page.tsx
"use client";
import { useEffect, useState } from "react";
import { ProductOption } from "@/components/ProductOption";
import { MainProduct } from "@/components/MainProduct";
import { Design } from "@/types/all";

const userDesigns = [
  {
    id: 1,
    name: "Next.js T-Shirt",
    description: "The official Next.js T-Shirt",
    price: 19.99,
    imageUrl: "/next.svg",
  },
  {
    id: 2,
    name: "Next.js Hoodie",
    description: "The official Next.js Hoodie",
    price: 29.99,
    imageUrl: "/next.svg",
  },
  {
    id: 3,
    name: "Next.js Sticker",
    description: "The official Next.js Sticker",
    price: 1.99,
    imageUrl: "/next.svg",
  },
];

export default function Page() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [productOptions, setProductOptions] = useState<Design[]>([]);

  useEffect(() => {
    async function loadDesigns() {
      setDesigns(userDesigns);
      setSelectedDesign(userDesigns[0]);
      setProductOptions(userDesigns);
    }

    loadDesigns();
  }, []);

  const handleSelectDesign = (design: Design) => {
    setSelectedDesign(design);
  };

  return (
    <div className="gradientBG text-white m-14 flex flex-col items-center justify-center">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-2 self-center">
            {selectedDesign && <MainProduct design={selectedDesign} />}
          </div>
          <div className="md:col-span-1">
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              {productOptions.map((option) => (
                <ProductOption
                  key={option.id}
                  design={option}
                  isSelected={selectedDesign?.id === option.id}
                  onSelect={handleSelectDesign}
                />
              ))}
            </div>
          </div>
        </div>
        {selectedDesign && (
          <div className="flex flex-col md:flex-row justify-between items-center mt-8 p-4 rounded-lg bg-background text-accent">
            <div>
              <h2 className="text-2xl font-bold ">{selectedDesign.name}</h2>
              <p className="text-lg">{selectedDesign.description}</p>
              <p className="text-xl font-bold">${selectedDesign.price}</p>
            </div>
            <button
              className="mt-4 md:mt-0 hover:bg-background gradientBG text-accent font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1"
              onClick={() => (window.location.href = "/checkout")}
            >
              Buy Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
