"use client";
import { __PrintFiles, __Prod, __Template, __Variant } from "@/types/all";
import ImagePlacementEditor from "./TemplateEditor";
import templates from "@/data/templates";
import { useEffect, useState } from "react";

interface MainProductProps {
  image: string;
  product: __Prod | undefined;
  variant: __Variant | undefined;
  selectedTemplate: __PrintFiles | undefined;
}

export const MainProduct = ({
  image,
  product,
  variant,
  selectedTemplate,
}: MainProductProps) => {
  return (
    <div className="rounded-lg max-w-3xl overflow-hidden justify-center text-center align-middle shadow-2xl transition-shadow duration-300 ">
      <ImagePlacementEditor
        selectedTemplate={selectedTemplate}
        selectedTemp={selectedTemplate}
        selectedVariant={variant}
        selectedProduct={product}
        userImage={image}
      />
    </div>
  );
};
