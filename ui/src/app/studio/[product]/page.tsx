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
    <div className="flex flex-row max-[1780px]:flex-col min-w-max text-center">
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
          <div className="flex flex-row max-w-lg self-center mb-4 max-[1780px]:max-w-4xl items-center rounded-lg bg-background text-accent">
            <div>
              <div className="flex flex-row my-2 gap-4 justify-between items-center">
                <h2 className="text-2xl font-bold ">{selectedVariant?.name}</h2>
                <h2 className="text-2xl font-bold ">
                  £{Math.round(Number(selectedVariant?.price) * 2)}
                </h2>
              </div>

              <div className="justify-between pb-0 max-[1780px]:pb-16 items-center h-fit text-lg">
                <div className="flex justify-center text-center mx-4">
                  <div>
                    <p className="text-sm">Stock Checker</p>
                    <select className="border bg-background text-accent rounded-lg p-2">
                      {selectedVariant?.availability_status?.map((status) => (
                        <option key={status.region} value={status.region}>
                          {status.region} - {status.status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {formatTextToHTML(
                  selectedProduct?.product.description ?? ""
                ).map((line, index) => (
                  <p
                    key={index}
                    className="p-2"
                    dangerouslySetInnerHTML={{ __html: line }}
                  />
                ))}
              </div>

              <div className="flex flex-col gap-4 justify-between items-center">
                <h1 className="text-2xl font-bold">
                  Purchase it using the mockup viewer.
                </h1>
              </div>
            </div>
          </div>
        )}
      </Suspense>
    </div>
  );
}
