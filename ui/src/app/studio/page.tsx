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

function formatTextToHTML(text: string) {
  const lines = text?.split("\n");

  let htmlLines = [];
  let inList = false;

  lines?.forEach((line: string) => {
    if (line.startsWith("•")) {
      if (!inList) {
        htmlLines.push("<ul>");
        inList = true;
      }
      htmlLines.push(`<li>${line.substring(2)}</li>`);
    } else {
      if (inList) {
        htmlLines.push("</ul>");
        inList = false;
      }
      if (line.trim() !== "") {
        htmlLines.push(`${line}`);
      }
    }
  });

  if (inList) {
    htmlLines.push("</ul>");
  }

  return htmlLines;
}

export default function Page() {
  const [selectedImage, setSelectedImage] = useState<string>("");

  const [selectedProduct, setSelectedProduct] = useState<__Prod>();
  const [selectedDesign, setSelectedDesign] = useState<__Product>();
  const [selectedVariant, setSelectedVariant] = useState<__Variant>();
  const [template, setTemplate] = useState<__Template>();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    loadForEditor(products["canvas"].variants[0]);
    setSelectedVariant(products["canvas"].variants[0]);
    handleChosenProduct(products["canvas"]);
  }, []);

  useEffect(() => {
    console.log(selectedVariant);
    if (selectedVariant?.id) {
      loadForEditor(selectedVariant);
    }
  }, [selectedVariant]);

  const handleChosenProduct = (product: __Prod) => {
    setSelectedDesign(product.product);
    setSelectedProduct(product);
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
        return template?.template.templates.find(
          (t) => t.template_id === selected.template_id
        );
      })
      .find((template) => template !== undefined);

    setTemplate(selectedTemplate);
  };

  return (
    <div className="flex flex-row max-[1780px]:flex-col min-w-max text-center">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="gradientBG text-white m-8 flex flex-col max-w-5xl">
          <div className="container text-accent mx-auto p-4">
            <ImagePlacementEditor
              selectedTemplate={template}
              selectedVariant={selectedVariant}
              selectedProduct={selectedProduct}
              userImage={selectedImage}
              onSelect={handleChosenProduct}
              setSelectedImage={setSelectedImage}
              setSelectedVariant={setSelectedVariant}
            />
          </div>
        </div>
        <div className="flex flex-row max-w-lg self-center  max-[1780px]:max-w-5xl items-center rounded-lg bg-background text-accent">
          <div>
            <div className="flex flex-row my-2 gap-4 justify-between items-center">
              <h2 className="text-2xl font-bold ">{selectedVariant?.name}</h2>
              <h2 className="text-2xl font-bold ">
                ${Math.round(Number(selectedVariant?.price) * 1.4)}
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

              {formatTextToHTML(selectedDesign?.description ?? "").map(
                (line, index) => (
                  <p
                    key={index}
                    className="p-2"
                    dangerouslySetInnerHTML={{ __html: line }}
                  />
                )
              )}
            </div>

            <div className="flex flex-col gap-4 justify-between items-center">
              <h1 className="text-2xl font-bold">
                Purchase it using the mockup viewer.
              </h1>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
