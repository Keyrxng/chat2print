import { useState, useRef, useEffect, Suspense } from "react";
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
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
interface ImagePlacementEditorProps {
  selectedTemplate: __Template | undefined;
  selectedVariant: __Variant | undefined;
  selectedProduct: __Prod | undefined;
  printFiles: __Temp | undefined;
  userImage: string;
  action: (product: __Prod) => void;
}

const ImagePlacementEditor: React.FC<ImagePlacementEditorProps> = ({
  selectedTemplate,
  selectedVariant,
  userImage,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0, scale: 1 });
  const [imageSrc, setImageSrc] = useState<string>(
    selectedTemplate?.background_url ?? selectedTemplate?.image_url ?? ""
  );
  const editorRef = useRef<HTMLDivElement>(null);
  const [viewSwitch, setViewSwitch] = useState<HTMLButtonElement | null>(null);
  const [isSubbed, setIsSubbed] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [enhancing, setEnhancing] = useState<boolean>(false);
  const [isMockingUp, setIsMockingUp] = useState<boolean>(false);
  const [upscaledImage, setUpscaledImage] = useState<string>("");
  const [mocks, setMocks] = useState<any[]>([]);
  const [viewingMocks, setViewingMocks] = useState<boolean>(false);
  console.log("mocks: ", mocks);

  const [transform, setTransform] = useState({
    scale: 1,
    positionX: 0,
    positionY: 0,
  });
  const observerRef = useRef<MutationObserver | null>(null);

  const supabase = createClientComponentClient();

  useEffect(() => {
    const intitalPosition = {
      x: selectedTemplate?.print_area_left ?? 100,
      y: selectedTemplate?.print_area_top ?? 100,
      scale: 1,
    };
    setPosition((prev) => (prev = intitalPosition));
    async function load() {
      const completed = await fetchMockups();
      setMocks((prev) => (prev = completed));

      setImageSrc(
        selectedTemplate?.background_url ?? selectedTemplate?.image_url ?? ""
      );
    }
    load();
  }, [selectedTemplate]);

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
              setImageSrc((prev) => (prev = selectedTemplate?.image_url!));
            } else {
              setImageSrc((prev) => (prev = selectedTemplate?.background_url!));
            }
          }
        });
      });
      observerRef.current.observe(viewSwitch, { attributes: true });
    }
  }, [selectedTemplate, viewSwitch]);

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

  const handleEnhanceUpscale = async () => {
    if (!isSubbed) {
      setIsOpen(true);
      return;
    } else {
      setIsOpen(false);
    }

    setEnhancing(true);
    const res = await fetch("/api/upscale", {
      method: "POST",
      body: JSON.stringify({
        url: userImage,
      }),
    });

    const data = await res.json();

    setUpscaledImage(data);

    await handleCreateMockup(data);

    setEnhancing(false);
  };

  const handleCreateMockup = async (imageData: string) => {
    setIsMockingUp(true);
    console.log("creating mockup");
    console.log(imageData);
    const scaledWidth = selectedTemplate?.print_area_width! * transform.scale;
    const scaledHeight = selectedTemplate?.print_area_height! * transform.scale;
    const offsetX = transform.positionX;
    const offsetY = transform.positionY;

    const prodID = selectedVariant?.product_id;
    const variantID = selectedVariant?.id;

    if (!prodID || !variantID) {
      throw new Error("No product or variant IDs found");
    }

    const ress = await fetch("/api/pod/", {
      method: "POST",
      body: JSON.stringify({
        productId: prodID,
        imageUrl: imageData,
        variantIDs: [variantID],
        scaledWidth,
        scaledHeight,
        offsetX,
        offsetY,
      }),
    });

    const data = await ress.json();

    const taskKey = data.result.task_key;
    saveTaskKeyToSupa(taskKey);
    setIsMockingUp(false);
  };

  const saveTaskKeyToSupa = async (taskKey: string) => {
    const { data: error } = await supabase.from("mockups").insert({
      status: "pending",
      task_key: taskKey,
    });

    if (error) {
      console.log(error);
    } else {
    }
  };

  const fetchMockups = async () => {
    const { data } = await supabase.auth.getUser();
    const user_id = data?.user?.id;

    const { data: mockups, error } = await supabase
      .from("mockups")
      .select("*")
      .eq("user_id", user_id);

    if (error) {
      console.log(error);
    }

    const completed = [];
    for (const mockup of mockups!) {
      if (mockup.status === "completed") {
        completed.push(mockup);
        continue;
      }
      const res = await fetch("/api/pod/fetch-mocks", {
        method: "POST",
        body: JSON.stringify({
          taskKey: mockup.task_key,
        }),
      });

      const data = await res.json();

      if (data.result.status === "completed" && mockup.status !== "completed") {
        completed.push(data.result);

        const { data: statusData, error: editError } = await supabase
          .from("mockups")
          .upsert({
            status: "completed",
            task_key: mockup.task_key,
            mockups: data.result.mockups,
            printFiles: data.result.printfiles,
          })
          .eq("task_key", mockup.task_key);

        console.log("posting to supa: ", mockup.task_key);
        console.log("statusData: ", statusData);

        if (editError) {
          console.log("editError: ", editError);
        }
      }
    }
    setMocks(completed);

    return completed;
  };

  const Mockup = () => {
    const [activeMock, setActiveMock] = useState<any>();
    const [activeMockup, setActiveMockup] = useState<any>();

    console.log("activeMock: ", activeMock);
    return (
      <Suspense fallback={<div>Loading...</div>}>
        {/* need to display all of the user mocks bnicely and selectable  */}
        <div className="flex flex-row justify-center items-center">
          {mocks.map((mock, index) => (
            <>
              {!activeMock && (
                <button
                  key={index}
                  className="flex flex-col w-full h-full justify-center items-center border-2 border-accent rounded-lg p-2 m-2 hover:bg-accent hover:text-background transition-all duration-300"
                  onClick={() => {
                    setActiveMock(mock);
                  }}
                >
                  <Image
                    src={mock.mockups[0].mockup_url}
                    width={500}
                    height={500}
                    alt="mockup"
                    className="rounded-lg"
                  />
                </button>
              )}

              {activeMock &&
                activeMock.printFiles.map((mockup, index) => (
                  <button
                    key={index}
                    className="flex flex-col justify-center items-center border-2 border-accent rounded-lg p-2 m-2 hover:bg-accent hover:text-background transition-all duration-300"
                    onClick={() => {
                      setActiveMockup(mockup.url);
                    }}
                  >
                    <Image
                      src={mockup.url}
                      width={500}
                      height={500}
                      alt="mockup"
                      className="rounded-lg"
                    />
                  </button>
                ))}
            </>
          ))}
        </div>
        <div className="bottom-0 justify-between h-full flex">
          <div className="flex text-accent items-center space-x-4 px-2 py-1 hover:text-accent rounded-lg">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setViewingMocks(!viewingMocks)}
                    className="relative w-full text-accent bg-background border-2 hover:bg-accent hover:text-background"
                  >
                    Go back to editor
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-accent opacity-90 bg-background rounded-md overflow-ellipsis mb-2 max-w-xs flex-wrap">
                  <p className="text-accent text-sm">Go back to the editor.</p>
                  <p className="text-accent text-sm"></p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex text-accent items-center space-x-4 px-2 py-1 hover:text-accent rounded-lg">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setActiveMock(null)}
                    className="relative w-full text-accent bg-background border-2 hover:bg-accent hover:text-background"
                  >
                    Go back to mockups
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-accent opacity-90 bg-background rounded-md overflow-ellipsis mb-2 max-w-xs flex-wrap">
                  <p className="text-accent text-sm">
                    Go back to your collection of mockups.
                  </p>
                  <p className="text-accent text-sm"></p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </Suspense>
    );
  };

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <>
          {enhancing && (
            <div className="fixed z-50 inset-0 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>

                <div
                  className="inline-block align-bottom bg-background rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-headline"
                >
                  <div className="flex flex-col justify-center items-center p-6">
                    <div className="flex flex-col justify-center items-center">
                      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
                      <p className="text-accent text-2xl mt-4">
                        Enhancing your image...
                      </p>
                      <p className="text-accent text-center text-sm mt-2">
                        The enhanced image will be applied to any future mockups
                        and of course, your final product.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isMockingUp && (
            <div className="fixed z-50 inset-0 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>

                <div
                  className="inline-block align-bottom bg-background rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-headline"
                >
                  <div className="flex flex-col justify-center items-center p-6">
                    <div className="flex flex-col justify-center items-center">
                      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
                      <p className="text-accent text-2xl mt-4">
                        Creating your mockup...
                      </p>
                      <p className="text-accent text-center text-sm mt-2">
                        This may take a minute or two. Future updates will
                        improve this process.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewingMocks ? (
            <Mockup />
          ) : (
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
                  onTransformChange(
                    state.scale,
                    state.positionX,
                    state.positionY
                  )
                }
                onPanning={({ state }) =>
                  onTransformChange(
                    state.scale,
                    state.positionX,
                    state.positionY
                  )
                }
                onPinching={({ state }) =>
                  onTransformChange(
                    state.scale,
                    state.positionX,
                    state.positionY
                  )
                }
                onZoomStop={({ state }) =>
                  onTransformChange(
                    state.scale,
                    state.positionX,
                    state.positionY
                  )
                }
                onPanningStop={({ state }) =>
                  onTransformChange(
                    state.scale,
                    state.positionX,
                    state.positionY
                  )
                }
              >
                {imageSrc ? (
                  <div
                    className="relative bg-center bg-no-repeat bg-cover h-[650px] w-[650px] fill"
                    style={{ backgroundImage: `url(${imageSrc})` }}
                    ref={editorRef}
                  >
                    <TransformComponent wrapperClass="relative h-auto w-auto fill">
                      <div className="relative w-[650px] h-[650px]">
                        <Suspense fallback={<div>Loading...</div>}>
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
                        </Suspense>
                      </div>
                    </TransformComponent>
                  </div>
                ) : (
                  <div
                    className="relative bg-center bg-no-repeat bg-cover h-[650px] w-[650px] fill"
                    style={{}}
                    ref={editorRef}
                  >
                    <TransformComponent wrapperClass="relative h-auto w-auto fill">
                      <div className="relative w-[650px] h-[650px]">
                        <Suspense fallback={<div>Loading...</div>}>
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
                        </Suspense>
                      </div>
                    </TransformComponent>
                  </div>
                )}
              </TransformWrapper>
              <div className="flex mx-8 mt-1 justify-between">
                {/* {isOpen && (
      <PricingModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    )} */}
                <div className="flex text-accent items-center space-x-4 px-2 py-1 hover:bg-background hover:text-accent rounded-lg">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <>
                          <div className="upscale-button">
                            <Button
                              onClick={() => handleEnhanceUpscale()}
                              className="relative w-full text-accent bg-background border-2 hover:bg-accent hover:text-background"
                            >
                              Generate Mockup
                            </Button>
                            <div className="shine-effect"></div>
                          </div>
                        </>
                      </TooltipTrigger>
                      <TooltipContent className="text-accent opacity-90 bg-background overflow-ellipsis mb-2 max-w-xs rounded-md flex-wrap">
                        <p className="text-accent text-sm">
                          This feature uses a state of the art AI upscaling
                          model to enhance your image. This results in 4x print
                          quality increase over the original ChatGPT image.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* <div className="flex text-accent items-center space-x-4 px-2 py-1 hover:bg-background hover:text-accent rounded-lg">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => handleEnhanceUpscale()}
                          className="relative w-full text-accent bg-background border-2 hover:bg-accent hover:text-background"
                        >
                          Generate Mockup
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="text-accent opacity-90 bg-background rounded-md overflow-ellipsis mb-2 max-w-xs flex-wrap">
                        <p className="text-accent text-sm">
                          This feature will generate a mockup of your image on
                          the selected product. Whether or not you have access
                          to AI upscaling, this feature will always be
                          available.
                        </p>
                        <p className="text-accent text-sm">
                          Note: Lower quality images will result in lower
                          quality end products and may not appear as expected.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div> */}

                <div className="flex text-accent items-center space-x-4 px-2 py-1 hover:bg-background hover:text-accent rounded-lg">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => setViewingMocks(!viewingMocks)}
                          className="relative w-full text-accent bg-background border-2 hover:bg-accent hover:text-background"
                        >
                          View Mockups
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="text-accent opacity-90 bg-background rounded-md overflow-ellipsis mb-2 max-w-xs flex-wrap">
                        <p className="text-accent text-sm">
                          This feature will switch the editor to view your
                          generated mockups.
                        </p>
                        <p className="text-accent text-sm"></p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </>
          )}
        </>
      </Suspense>
    </>
  );
};

export default ImagePlacementEditor;

/**
 *   function PricingModal({
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
 */
