"use client";

import { Suspense, useEffect, useState } from "react";
import {
  __Prod,
  __Product,
  __ProductsList,
  __Variant,
  __ProductTemplate,
  __PrintFiles,
  __Temp,
  __Template,
} from "@/types/all";
import ImagePlacementEditor from "./TemplateEditor";
import { formatTextToHTML } from "@/utils/formatToHtml";
import Image from "next/image";
import BuiltinChat from "@/components/BuiltinChat";
import DescAndGen from "@/components/BuiltinChat";
interface PFILE {
  printfile_id: number;
  width: number;
  height: number;
  dpi: number;
  fill_mode: string;
  can_rotate: boolean;
}

export default function Page(params: { [x: string]: never }) {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<__Prod>();
  const [selectedVariant, setSelectedVariant] = useState<__Variant>();
  const [template, setTemplate] = useState<__Template>();
  const [viewingMock, setViewingMock] = useState<boolean>(false);
  const [printFiles, setPrintFiles] = useState<PFILE>();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pid = Number(urlParams.get("pid"));
    const vid = Number(urlParams.get("vid"));

    async function load() {
      const data = await fetch("/api/data/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pid, vid }),
      });

      const json = await data.json();
      console.log("json: ", json);

      setSelectedProduct(json.product);
      setSelectedVariant(json.variant);
      loadForEditor(json.template, json.printFiles);
    }

    load();
  }, [params.product, params.type]);

  const handleChosenProduct = (product: __Prod) => {
    setSelectedProduct((prev) => (prev = product));
    setSelectedVariant(product.variants[0]);
  };

  const loadForEditor = async (template: __Template, printFiles: PFILE) => {
    setTemplate(template);
    setPrintFiles(printFiles);
  };

  return (
    <div className="flex mb-10 flex-row max-[1780px]:flex-col min-w-max text-center">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="gradientBG rounded-md flex flex-col min-h-screen h-max max-w-7xl">
          <div className="text-accent mx-auto p-4">
            {!printFiles ? (
              <>
                <Image
                  blurDataURL={selectedImage}
                  src={selectedImage}
                  alt="Product Image"
                  width={500}
                  height={500}
                />
              </>
            ) : (
              <ImagePlacementEditor
                selectedTemplate={template}
                selectedVariant={selectedVariant}
                selectedProduct={selectedProduct}
                userImage={selectedImage}
                onSelect={handleChosenProduct}
                setSelectedImage={setSelectedImage}
                setSelectedVariant={setSelectedVariant}
                setViewingMock={setViewingMock}
                printFiles={printFiles}
              />
            )}
          </div>
        </div>

        {!viewingMock && (
          <DescAndGen
            selectedProduct={selectedProduct}
            selectedVariant={selectedVariant}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />
        )}
      </Suspense>
    </div>
  );
}
