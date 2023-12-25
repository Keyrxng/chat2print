"use client";

import { Suspense, useEffect, useState } from "react";
import products from "@/data/products";
import templates from "@/data/templates";

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
interface PFILE {
  printfile_id: number;
  width: number;
  height: number;
  dpi: number;
  fill_mode: string;
  can_rotate: boolean;
}

export default function Page(params: { type: string; product: string }) {
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

    const product = Object.values(products).find(
      (product) => product.product.id === pid
    );
    const variant = product?.variants.find((variant) => variant.id === vid);

    if (product && variant) {
      setSelectedProduct(product);
      setSelectedVariant(variant);
      loadForEditor(variant);
    }
  }, [params.product, params.type]);

  useEffect(() => {
    if (!selectedVariant) return;
    if (selectedVariant?.id) {
      loadForEditor(selectedVariant);
    }
  }, [selectedVariant]);

  const handleChosenProduct = (product: __Prod) => {
    setSelectedProduct((prev) => (prev = product));
    setSelectedVariant(product.variants[0]);
    loadForEditor(product.variants[0]);
  };

  const loadForEditor = async (variant: __Variant) => {
    const varID = variant?.id;

    const selectedVariant = Object.values(templates)
      .flatMap((template) => template.template.variant_mapping)
      .filter((variant) => variant.variant_id === varID)
      .flatMap((variant) => variant.templates);

    const selectedTemplate = selectedVariant
      .map((selected) => {
        const template = Object.values(templates).find((t) =>
          t.template.templates.some(
            (t) => t.template_id === selected.template_id
          )
        );

        const id = template?.template.templates.find(
          (t) => t.template_id === selected.template_id
        );

        const printFiles = template?.printFiles.printfiles.find(
          (file) => file.printfile_id === id?.printfile_id
        );

        return { id, printFiles };
      })
      .find((template) => template !== undefined);

    setTemplate(selectedTemplate?.id);
    setPrintFiles(selectedTemplate?.printFiles);
  };

  return (
    <div className="flex flex-row max-[1780px]:flex-col min-w-max text-center">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="gradientBG rounded-md flex flex-col min-h-screen h-max max-w-7xl">
          <div className="text-accent mx-auto p-4">
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
          </div>
        </div>

        {!viewingMock && (
          <div className="flex flex-row max-w-lg self-center mb-4 max-[1780px]:max-w-4xl items-center rounded-lg bg-background text-accent">
            <div>
              <div className="flex flex-row my-2 gap-4 justify-between items-center">
                <h2 className="text-2xl font-bold ">{selectedVariant?.name}</h2>
                <h2 className="text-2xl font-bold ">
                  £{Math.round(Number(selectedVariant?.price) * 2.3)}
                </h2>
              </div>

              <div className="justify-between pb-0 max-[1780px]:pb-16 items-center h-fit text-lg">
                <div className="flex justify-center text-center mx-4">
                  <div>
                    <p className="text-sm">Stock Checker</p>
                    <select
                      className="border bg-background text-accent rounded-lg p-2"
                      onChange={(e) =>
                        setSelectedVariant(
                          selectedProduct?.variants.find(
                            (variant) => e.target.value === variant.name
                          )
                        )
                      }
                    >
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
