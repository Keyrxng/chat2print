import React, { useState } from "react";
import { motion } from "framer-motion";
import { __Prod, __Variant } from "@/types/all";
import { formatTextToHTML } from "@/utils/formatToHtml";
import { Info, Lock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

const DescAndGen = ({
  selectedProduct,
  selectedVariant,
  selectedImage,
  setSelectedImage,
}: {
  selectedProduct: __Prod | undefined;
  selectedVariant: __Variant | undefined;
  selectedImage: string;
  setSelectedImage: (arg0: string) => void;
}) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showGen, setShowGen] = useState(false);
  const [quality, setQuality] = useState("Standard");
  const [dimension, setDimension] = useState("Portrait");
  const [style, setStyle] = useState("Vivid");
  const [showInfo, setShowInfo] = useState(false);

  const handleSubmitPrompt = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setSuccessMessage("");

    try {
      const { response } = await fetch("/api/openai/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          quality: quality,
          dimension: dimension,
          style: style,
        }),
      }).then((res) => res.json());

      console.log("response: ", response.data);

      const b64 = response.data[0].b64_json;

      const imageUrl = `data:image/png;base64,${b64}`;

      setImageUrl(imageUrl);
      setSelectedImage(imageUrl);

      setPrompt(response.data[0].revised_prompt);

      setSuccessMessage("Image generated successfully!");
    } catch (error) {
      setSuccessMessage(
        "An error occurred while generating the image. " + error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const howTo = [
    {
      title: "Quality",
      description:
        "You can choose between standard and HD quality. HD quality is available for Premium and Pro users.",
    },
    {
      title: "Dimensions",
      description:
        "You can choose between square, portrait and landscape dimensions.",
    },
    {
      title: "Prompt",
      description:
        "Be as creative and as intentional as possible with your prompt. For safety reasons, your prompt is rewritten and optimized as to help to provide a better final result so don't worry if it doesn't quite make sense or is too short.",
    },
  ];

  const qualityOpts = [
    {
      name: "Standard",
      value: "Standard",
      disabled: false,
    },
    {
      name: "HD",
      value: "HD",
      disabled: true,
    },
  ];

  const dimensionOpts = [
    {
      name: "Portrait",
      value: "Portrait",
    },
    {
      name: "Landscape",
      value: "Landscape",
    },
    {
      name: "Square",
      value: "Square",
    },
  ];

  const styles = [
    {
      name: "Vivid",
      value: "Vivid",
    },
    {
      name: "Natural",
      value: "Natural",
    },
  ];

  const BlurOverlay = () => {
    return (
      <div className="absolute w-1/2 max-w-lg h-1/2 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
        <div className="text-white">
          <Lock className="h-12 w-12 mx-auto" />
          <p className="text-center mt-2">Premium Feature</p>
        </div>
      </div>
    );
  };
  const [blurred, setBlurred] = useState(true);

  return (
    <div className="flex flex-col text-center items-center mt-1 gap-14">
      <div
        className={`m-4 w-fit border ${
          !showGen ? "animate-pulse" : ""
        } border-accent rounded-2xl items-center`}
      >
        <div className="flex flex-row justify-between items-center">
          <button
            className="px-6 py-2 bg-primary rounded-lg text-center align-middle items-center w-fit text-white font-bold shadow-lg"
            onClick={() => setShowGen((prev) => !prev)}
          >
            {showGen ? "View Product Description" : "Open AI Image Generator"}
          </button>
        </div>
      </div>
      <div className="flex flex-row max-w-lg self-center mb-4 max-[1780px]:max-w-4xl items-center rounded-lg bg-background text-accent">
        {showGen && (
          <>
            {blurred && <BlurOverlay />}
            <div className="flex gradientBG flex-col items-center justify-center p-4 w-full max-w-2xl mx-auto rounded-lg shadow-md">
              <span>
                <Info
                  className="h-6 w-6 text-accent cursor-pointer"
                  onClick={() => setShowInfo(!showInfo)}
                />
              </span>

              {showInfo && (
                <div className="bg-background p-4 max-w-md rounded-md text-accent shadow-lg mt-2">
                  <ul>
                    {howTo.map((item) => (
                      <li key={item.title} className="mb-2">
                        <h2 className="text-lg font-bold">{item.title}</h2>
                        <p className="text-sm">{item.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-between m-4 gap-4">
                <Select
                  defaultValue="Portrait"
                  onValueChange={(e) => setDimension(e)}
                  disabled={blurred}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Layouts</SelectLabel>
                      {dimensionOpts.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select
                  disabled={blurred}
                  defaultValue="Vivid"
                  onValueChange={(e) => setStyle(e)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Style</SelectLabel>
                      {styles.map((option) => (
                        <SelectItem
                          key={option.value}
                          onClick={() => setStyle(option.value)}
                          value={option.value}
                        >
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select
                  defaultValue="Standard"
                  onValueChange={(e) => setQuality(e)}
                  disabled={blurred}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Quality</SelectLabel>
                      {qualityOpts.map((option) => (
                        <SelectItem
                          key={option.value}
                          onClick={() => setQuality(option.value)}
                          value={option.value}
                          disabled={option.disabled}
                        >
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <Textarea
                className="w-full h-44 p-2 bg-background rounded-lg mb-2 text-accent"
                placeholder="Enter your prompt here..."
                disabled={blurred || isLoading}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div className="grid text-sm grid-cols-3 gap-2 px-2 justify-between bg-gray-700 rounded-full p-1 items-center">
                <p>Layout: {dimension}</p>
                <p>Style: {style}</p>
                <p>Quality: {quality}</p>
              </div>

              <motion.button
                className="px-6 py-2 bg-primary border border-accent m-2 rounded-lg text-white font-bold shadow-lg"
                onClick={handleSubmitPrompt}
                disabled={blurred || isLoading}
              >
                {isLoading ? "Generating..." : "Generate Design"}
              </motion.button>

              <p className="text-sm">{successMessage}</p>
            </div>
          </>
        )}

        {!showGen && (
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

              {formatTextToHTML(selectedProduct?.product.description ?? "").map(
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
        )}
      </div>
    </div>
  );
};

export default DescAndGen;
