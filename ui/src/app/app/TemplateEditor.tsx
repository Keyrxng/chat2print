import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  __Prod,
  __Temp,
  __Template,
  __Variant,
  __PrintFiles,
  __VariantMapping,
} from "@/types/all";
import { Button } from "@/components/ui/button";
import PODHandler from "@/classes/PODHandler";
import templates from "@/data/templates";
import { HelpCircle, InfoIcon } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
interface ImagePlacementEditorProps {
  selectedTemplate: __Template | undefined;
  selectedVariant: __Variant | undefined;
  selectedProduct: __Prod | undefined;
  userImage: string;
}

const ImagePlacementEditor: React.FC<ImagePlacementEditorProps> = ({
  selectedTemplate,
  selectedVariant,
  selectedProduct,
  userImage,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0, scale: 1 });
  const [imageSrc, setImageSrc] = useState<string>("");
  const editorRef = useRef<HTMLDivElement>(null);
  const [viewSwitch, setViewSwitch] = useState<HTMLButtonElement | null>(null);
  const [transform, setTransform] = useState({
    scale: 1,
    positionX: 0,
    positionY: 0,
  });
  let observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const viewSw = document.getElementById("view-switch");
    setViewSwitch(viewSw as HTMLButtonElement);

    if (viewSwitch) {
      observerRef.current = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === "data-state") {
            const newState = (mutation.target as HTMLElement).getAttribute(
              "data-state"
            );
            console.log(newState);
            if (newState === "unchecked") {
              setImageSrc(
                (prev) =>
                  (prev =
                    selectedTemplate?.background_url ??
                    selectedTemplate?.image_url ??
                    "")
              );
            } else {
              setImageSrc(
                (prev) =>
                  (prev =
                    selectedTemplate?.image_url ??
                    selectedTemplate?.background_url ??
                    "")
              );
            }
          }
        });
      });
      observerRef.current.observe(viewSwitch, { attributes: true });
    }
  }, [
    imageSrc,
    selectedTemplate?.background_url,
    selectedTemplate?.image_url,
    viewSwitch,
  ]);

  useEffect(() => {
    const initialPosition = {
      x: selectedTemplate?.print_area_left ?? 100,
      y: selectedTemplate?.print_area_top ?? 100,
      scale: 1,
    };
    setPosition(initialPosition);
    setImageSrc(
      selectedTemplate?.background_url ?? selectedTemplate?.image_url ?? ""
    );
  }, [selectedTemplate, userImage]);

  const handleDrag = (event: React.DragEvent) => {
    setPosition({
      x: event.clientX - editorRef.current?.offsetLeft!,
      y: event.clientY - editorRef.current?.offsetTop!,
      scale: 1,
    });
  };

  const onTransformChange = (
    zoomScale: number,
    positionX: number,
    positionY: number
  ) => {
    console.log(
      `zoomScale: ${zoomScale}, positionX: ${positionX}, positionY: ${positionY}`
    );
    setTransform({
      scale: zoomScale,
      positionX: positionX,
      positionY: positionY,
    });
  };

  const handleCreateMockup = async () => {
    const scaledWidth = selectedTemplate?.print_area_width! * transform.scale;
    const scaledHeight = selectedTemplate?.print_area_height! * transform.scale;
    const offsetX = transform.positionX;
    const offsetY = transform.positionY;
    const selectTemplateId = selectedTemplate?.template_id;

    const preffixedImageUrl =
      "https://ywaeexoevxxjquwlhfjx.supabase.co/storage/v1/object/public/no_reg_designs/" +
      userImage.split("/").pop();
    const res = await fetch("/api/upscale", {
      method: "POST",
      body: JSON.stringify({
        url: preffixedImageUrl,
      }),
    });

    const data = await res.json();
    console.log(data);
    const upscaledImage = data.output[data.output.length - 1];
    console.log(upscaledImage);

    const imageUrl = userImage;
    const varMap = Object.values(templates).flatMap((template) => template);

    const t = varMap.filter(({ template }) =>
      template.templates.find((t) => t.template_id === selectTemplateId)
    );

    const prodID = selectedVariant?.product_id;
    const variantID = selectedVariant?.id;
    console.log("slected variant: ", selectedVariant);
    if (!prodID || !variantID) {
      return;
    }

    const ress = await fetch("/api/pod/", {
      method: "POST",
      body: JSON.stringify({
        productId: prodID,
        imageUrl: preffixedImageUrl,
        variantIDs: [variantID],
        scaledWidth,
        scaledHeight,
        offsetX,
        offsetY,
      }),
    });
    console.log(imageUrl);

    console.log("client response: ", await ress.json());
  };

  function PricingModal({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) {
    if (!isOpen) return null;
    const paymentTierOpts = [
      {
        name: "Basic",
        price: 5.99,
        features: [
          { label: "Storage:", value: "10 designs (p/w)" },
          { label: "Storage Limit:", value: "1GB (p/m)" },
          { label: "AI Enhance & Upscale:", value: "5 (p/d)" },
          { label: "Mockup Generation:", value: "2 (p/d)" },
          { label: "Basic Support", value: "" },
        ],
        isPopular: false,
      },
      {
        name: "Pro",
        price: 19.99,
        features: [
          { label: "Storage:", value: "500 designs (p/w)" },
          { label: "Storage Limit:", value: "5GB (p/m)" },
          { label: "AI Enhance & Upscale:", value: "250 (p/d)" },
          { label: "Mockup Generation:", value: "250 (p/d)" },
          { label: "Priority Support", value: "" },
          { label: "Product Requests", value: "" },
          { label: "New feature Early-Access", value: "" },
        ],
        isPopular: true,
      },
      {
        name: "Business",
        price: 50,
        features: [
          { label: "Storage:", value: "2500 designs (p/w)" },
          { label: "Storage Limit:", value: "50GB (p/m)" },
          { label: "AI Enhance & Upscale:", value: "1250 (p/d)" },
          { label: "Mockup Generation:", value: "1250 (p/d)" },
          { label: "Priority Support", value: "" },
          { label: "Product Requests", value: "" },
          { label: "New feature Early-Access", value: "" },
        ],
        isPopular: false,
      },
    ];

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="text-accent opacity-90 bg-background rounded-md overflow-ellipsis mb-2 max-w-6xl flex-wrap">
          <div className="grid md:grid-cols-3 gap-4 p-4">
            {paymentTierOpts.map((tier, index) => (
              <div
                key={index}
                className={`relative flex flex-col justify-between border p-4 m-2 rounded-lg ${
                  tier.isPopular ? "border-yellow-400" : "border-gray-300"
                } shadow-lg transition-all duration-300 hover:shadow-xl h-full`}
              >
                <div>
                  <div>
                    <h3
                      className={`text-lg font-semibold ${
                        tier.isPopular ? "text-yellow-500" : "text-gray-700"
                      }`}
                    >
                      {tier.name}
                    </h3>
                    <p className="text-3xl font-bold">
                      ${tier.price}
                      <span className="text-xl">/mo</span>
                    </p>
                  </div>
                  <ul className="my-4">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center my-2">
                        <svg
                          className="w-4 h-4 text-green-500 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 01.083 1.32l-7 8a1 1 0 01-1.4.083l-4-4a1 1 0 011.32-1.497l3.3 3.291 6.293-7.291a1 1 0 011.404-.206z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>
                          {feature.label} <strong>{feature.value}</strong>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className="bg-primary text-accent rounded hover:text-sky-200 py-2 px-4 transition ease-in-out duration-300 w-full font-bold">
                  Subscribe
                </Button>

                {tier.isPopular && (
                  <span className="absolute top-0 transform -translate-y-1/2 px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-bold">
                    Popular
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="justify-center text-center mt-6 text-sm">
            <p>
              Have questions?{" "}
              <a href="#" className="text-yellow-500 hover:underline">
                Contact sales
              </a>
            </p>
            <p>
              View full{" "}
              <a href="#" className="text-yellow-500 hover:underline">
                pricing details
              </a>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  const [isSubbed, setIsSubbed] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleUpscale = async () => {
    // return new Promise((resolve, reject) => {
    //   const preffixedImageUrl =
    //     "https://ywaeexoevxxjquwlhfjx.supabase.co/storage/v1/object/public/no_reg_designs/" +
    //     userImage.split("/").pop();
    //   const res = fetch("/api/upscale", {
    //     method: "POST",
    //     body: JSON.stringify({
    //       url: preffixedImageUrl,
    //     }),
    //   });
    //   resolve(res);
    // });
  };

  return (
    <>
      <TransformWrapper
        initialScale={position.scale}
        initialPositionX={-position.x}
        initialPositionY={-position.y}
        centerOnInit={true}
        limitToBounds={false}
        maxPositionX={Infinity}
        maxPositionY={Infinity}
        minPositionX={-Infinity}
        minPositionY={-Infinity}
        onZoom={({ state }) =>
          onTransformChange(state.scale, state.positionX, state.positionY)
        }
        onPanning={({ state }) =>
          onTransformChange(state.scale, state.positionX, state.positionY)
        }
        onPinching={({ state }) =>
          onTransformChange(state.scale, state.positionX, state.positionY)
        }
        onZoomStop={({ state }) =>
          onTransformChange(state.scale, state.positionX, state.positionY)
        }
        onPanningStop={({ state }) =>
          onTransformChange(state.scale, state.positionX, state.positionY)
        }
      >
        <div
          className="relative bg-center bg-no-repeat bg-cover h-[650px] w-[650px] fill"
          style={{ backgroundImage: `url(${imageSrc})` }}
          ref={editorRef}
        >
          <TransformComponent wrapperClass="relative h-auto w-auto fill">
            <div className="relative w-[650px] h-[650px]">
              <Image
                onDrag={handleDrag}
                alt="user image"
                width={1024}
                height={1024}
                src={userImage}
                className="z-10"
                style={{
                  maxWidth: "100%",
                  width: "15%",
                  height: "15%",
                }}
              />
            </div>
          </TransformComponent>
        </div>
      </TransformWrapper>
      <div className="flex mx-8 mt-1 justify-between ">
        <div className="flex text-accent items-center space-x-4 px-2 py-1 hover:bg-background hover:text-accent rounded-lg">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <>
                  <div className="upscale-button">
                    <Button
                      onClick={() => setIsOpen(!isOpen)}
                      className="relative w-full text-accent bg-background border-2 hover:bg-accent hover:text-background"
                    >
                      Enhanced AI Upscale
                    </Button>
                    <div className="shine-effect"></div>
                  </div>
                </>
              </TooltipTrigger>
              <TooltipContent className="text-accent opacity-90 bg-background overflow-ellipsis mb-2 max-w-xs rounded-md flex-wrap">
                <p className="text-accent text-sm">
                  This feature uses a state of the art AI upscaling model to
                  enhance your image. This results in 4x print quality increase
                  over the original ChatGPT image.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {isOpen && (
          <PricingModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        )}

        <div className="flex text-accent items-center space-x-4 px-2 py-1 hover:bg-background hover:text-accent rounded-lg">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => handleCreateMockup()}
                  className="relative w-full text-accent bg-background border-2 hover:bg-accent hover:text-background"
                >
                  Generate Mockup
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-accent opacity-90 bg-background rounded-md overflow-ellipsis mb-2 max-w-xs flex-wrap">
                <p className="text-accent text-sm">
                  This feature will generate a mockup of your image on the
                  selected product. Whether or not you have access to AI
                  upscaling, this feature will always be available.
                </p>
                <p className="text-accent text-sm">
                  Note: Lower quality images will result in lower quality end
                  products and may not appear as expected.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* <div className="flex text-accent items-center space-x-4 px-2 py-1 hover:bg-background hover:text-accent rounded-lg">
          <div className="upscale-button shine-effect"></div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => handleCreateMockup()}
                  className="relative w-full text-accent bg-background border-2 hover:bg-accent hover:text-background"
                >
                  Generate Mockup
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-accent opacity-90 bg-background overflow-ellipsis mb-2 max-w-sm flex-wrap">
                <p className="text-accent text-sm">
                  This feature uses a state of the art AI upscaling model to
                  enhance your image. This results in 4x print quality increase
                  over the original ChatGPT image.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div> */}
      </div>
    </>
  );
};

export default ImagePlacementEditor;
