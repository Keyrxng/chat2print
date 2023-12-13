"use client";

import { Suspense, useEffect, useState } from "react";
import { ProductOption } from "@/components/ProductOption";
import Image from "next/image";
import { InfoIcon, X } from "lucide-react";
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
} from "@/types/all";
import { MainProduct } from "./MainProduct";
import { VariantSelection } from "@/components/VariantSelection";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProductSelection } from "@/components/ProductSelection";
import { OptionsSelection } from "@/components/OptionsSelection";

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
  const [userImages, setUserImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const [chosenProduct, setChosenProduct] = useState<__Prod>();
  const [selectedProduct, setSelectedProduct] = useState<__Prod>();
  const [selectedDesign, setSelectedDesign] = useState<__Product>();
  const [productOpts, setProductOpts] = useState<__ProductsList>(products);
  const [selectedVariant, setSelectedVariant] = useState<__Variant>();
  const [printFiles, setPrintFiles] = useState<__PrintFiles>();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    async function load() {
      const imgs = await fetch("/api/designs/fetch");
      const data = await imgs.json();
      let { images } = data;
      images = images.filter((img: string) => img !== null);

      setUserImages(images);
      setSelectedImage(images[0]);
    }
    handleChosenProduct(productOpts["canvas"]);
    setSelectedVariant(productOpts["canvas"].variants[0]);
    setTemplate(productOpts["canvas"].product.type_name);
    load();
  }, []);

  async function setTemplate(prodName: string) {
    const temp = Object.values(templates).map((temp) => {
      if (temp.name === prodName) {
        return temp;
      }
    });

    const t = temp.filter((item) => item !== undefined)[0];

    setPrintFiles(t);
    return t;
  }

  const handleChosenProduct = (product: __Prod) => {
    setSelectedDesign(product.product);
    setSelectedProduct(product);
    setSelectedVariant(product.variants[0]);
    setChosenProduct(product);
    setTemplate(product.product.type_name);
  };

  const handleSelectImage = (image: string) => {
    setSelectedImage(image);
  };

  const handleDeleteImage = (image: string) => {
    for (const img of userImages) {
      if (img === image) {
        userImages.splice(userImages.indexOf(img), 1);
      }
    }

    setUserImages((prev) => prev.filter((img) => img !== image));
  };

  const handlePODApi = async () => {
    const response = await fetch("/api/designs/fetch");
    const data = await response.json();
    const { designs } = data;
  };

  const ImageSlider = () => {
    return (
      <div className="flex flex-row justify-center items-center max-w-6xl">
        {userImages.map((image, index) => (
          <div key={index} className="flex">
            <div className="relative hover:translate-y-2.5 transition duration-300 ease-in-out transform hover:scale">
              <button onClick={() => handleSelectImage(image)} className="m-1">
                <Image
                  src={image}
                  alt="design"
                  width={100}
                  height={100}
                  className="rounded-full"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    objectFit: "cover",
                  }}
                />
              </button>
              <button
                onClick={() => handleDeleteImage(image)}
                className="absolute bottom-0 left-0 mt-2 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none "
              >
                <X className="h-4 w-4 text-accent " />
              </button>
            </div>
          </div>
        ))}
        <div className="relative hover:translate-y-2.5 transition duration-300 ease-in-out transform hover:scale">
          <button className="m-1" onClick={() => handlePODApi()}>
            <div className="bg-background rounded-full h-20 w-20 flex items-center justify-center">
              <p className="text-accent self-center text-5xl mb-1">+</p>
            </div>
          </button>
          <button className="absolute bottom-0 left-0 mt-2 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none "></button>
        </div>
      </div>
    );
  };

  function ProductSwitch() {
    const [checked, setChecked] = useState(false);

    const handleSwitch = () => {
      setChecked(!checked);
      setIsChecked(!isChecked);
    };

    return (
      <>
        <div className="flex text-accent items-center space-x-4 px-2 py-1 border rounded-lg">
          <h1 className="text-sm">Change View</h1>
          <Switch onClick={() => handleSwitch} id="view-switch" />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon />
              </TooltipTrigger>
              <TooltipContent>
                <p>Not all products have alternative views.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </>
    );
  }

  /**
   * In the context of mockup generation options, generally speaking, refer to the part of the product being displayed.
   * option_groups refers to the "style" of the mockup.
   * For example "Front" refers to an option but "Wrinkled" or "On Hanger" are option_groups.
   */

  return (
    <div className="flex flex-row max-[1780px]:flex-col min-w-max text-center">
      <div className="gradientBG text-white m-8 flex flex-col max-w-5xl">
        <div className="container text-accent mx-auto p-4">
          <div className="flex flex-row mx-8 m-4 justify-between items-center">
            <ProductSelection
              product={chosenProduct}
              setSelectedProduct={handleChosenProduct}
            />
            <VariantSelection
              chosen={selectedVariant}
              variants={selectedProduct?.variants}
              setSelectedVariant={setSelectedVariant}
            />
            <div>
              <ProductSwitch />
            </div>
          </div>
          <div className="grid grid-cols-1 max-h-min md:grid-cols-3 gap-8">
            <div className="col-span-2  max-h-min">
              <MainProduct
                image={selectedImage}
                product={selectedProduct}
                variant={selectedVariant}
                selectedTemplate={printFiles}
              />
            </div>

            <div className="">
              <div className="grid grid-cols-2 mx-8 pt-4 px-4 overflow-y-auto max-w-1xl max-h-[650px] md:grid-cols-1 gap-4">
                {Object.values(productOpts).map((option, index) => (
                  <ProductOption
                    key={index}
                    image={selectedImage}
                    product={option}
                    isSelected={selectedDesign?.id === option.product.id}
                    onSelect={handleChosenProduct}
                  />
                ))}
              </div>

              <OptionsSelection
                chosen={selectedVariant}
                variants={selectedProduct?.variants}
                options={selectedDesign?.files}
              />
            </div>
          </div>
          <div className="flex flex-row gap-2 right-0 items-center mb-4 p-4 rounded-lg text-accent"></div>
          <div className="max-h-[120px]">
            <ImageSlider />
          </div>
        </div>
      </div>
      <div className="flex flex-row max-w-lg self-center  max-[1780px]:max-w-5xl items-center rounded-lg bg-background text-accent">
        <div>
          <div className="flex flex-row my-2 gap-4 justify-between items-center">
            <h2 className="text-2xl font-bold ">{selectedVariant?.name}</h2>
            <h2 className="text-2xl font-bold ">£{selectedVariant?.price}</h2>
          </div>
          <button
            className="flex-end right-0 w-full mt-4 md:mt-0 text-lg hover:bg-accent border border-accent    hover:text-background   text-accent font-bold py-2 px-4 rounded transition duration-300 ease-in-out    "
            onClick={() => (window.location.href = "/checkout")}
          >
            Buy Now
          </button>
          <div className="justify-between pb-0 max-[1780px]:pb-16 items-center h-fit text-lg">
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
        </div>
      </div>
    </div>
  );
}
