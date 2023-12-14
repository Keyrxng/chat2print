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
import { Input } from "@/components/ui/input";
import React from "react";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
interface ImagePlacementEditorProps {
  selectedTemplate: __Template | undefined;
  selectedVariant: __Variant | undefined;
  userImage: string;
  onSelect: (design: __Prod) => void;
  setSelectedImage: (image: string) => void;
  selectedProduct: __Prod | undefined;
  setSelectedVariant: (variant: __Variant) => void;
}

import { loadStripe } from "@stripe/stripe-js";
import { ProductOption } from "@/components/ProductOption";
import products from "@/data/products";
import { ImageSlider } from "@/components/ImageSlider";
import { ProductSelection } from "@/components/ProductSelection";
import { VariantSelection } from "@/components/VariantSelection";

const stripePromise = loadStripe(
  "pk_test_51OIcuCJ8INwD5VucXOT3hww245XJiYrEpbnw3jHf0jboTJhrMix1TH4jf3oqGR4uChV4TyoH2iSL284KOFbAxTJJ00MDub5FdJ"
);

const ImagePlacementEditor: React.FC<ImagePlacementEditorProps> = ({
  selectedTemplate,
  selectedVariant,
  userImage,
  onSelect,
  setSelectedImage,
  selectedProduct,
  setSelectedVariant,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0, scale: 1 });
  const [imageSrc, setImageSrc] = useState<string>(
    selectedTemplate?.background_url ?? selectedTemplate?.image_url ?? ""
  );
  const editorRef = useRef<HTMLDivElement>(null);
  const [viewSwitch, setViewSwitch] = useState<HTMLButtonElement | null>(null);
  const [enhancing, setEnhancing] = useState<boolean>(false);
  const [isMockingUp, setIsMockingUp] = useState<boolean>(false);
  const [upscaledImage, setUpscaledImage] = useState<string>("");
  const [mocks, setMocks] = useState<any[]>([]);
  const [viewingMocks, setViewingMocks] = useState<boolean>(false);
  const [needAccount, setNeedAccount] = useState<boolean>(false);
  const observerRef = useRef<MutationObserver | null>(null);
  const [userImages, setUserImages] = useState<string[]>([]);

  const [transform, setTransform] = useState({
    scale: 1,
    positionX: 0,
    positionY: 0,
  });

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

    async function set() {
      try {
        const imgs = await fetch("/api/designs/fetch");
        const data = await imgs.json();
        let { images } = data;
        images = images.filter((img: string) => img !== null);
        setUserImages(images);
        setSelectedImage(images[0]);
      } catch (err) {}
    }
    set();
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
    const { data: userData } = await supabase.auth.getUser();

    if (!userData?.user?.id) {
      setNeedAccount(true);
      return;
    }

    setEnhancing(true);
    console.log("userImage: ", userImage);
    if (!userImage) {
      alert("Please upload an image first");
      setEnhancing(false);
      return;
    }

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
    const supaToSave = {
      product: selectedVariant.name,
      task_key: taskKey,
      status: "pending",
    };
    saveTaskKeyToSupa(supaToSave);
    setIsMockingUp(false);
  };

  const saveTaskKeyToSupa = async (supaToSave: {
    product: string;
    task_key: string;
    status: string;
  }) => {
    const { data: error } = await supabase.from("mockups").insert(supaToSave);

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
      return [];
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

  const HandleSale = async ({
    mockup,
    quantity,
  }: {
    mockup: any;
    quantity: number;
  }) => {
    const [clientSecret, setClientSecret] = useState<string>("");
    const itemPrice = selectedVariant?.price;

    useEffect(() => {
      fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mockup,
          quantity,
          itemPrice,
        }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch((err) => console.log(err));
    }, []);

    return (
      <>
        <div id="checkout">
          {clientSecret && (
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
        </div>
      </>
    );
  };

  const Mockup = () => {
    const [activeMock, setActiveMock] = useState<any>(null);
    const [checkout, setCheckout] = useState<boolean>(false);
    const [quantity, setQuantity] = useState<number>(1);
    const [mockImg, setMockImg] = useState<string>("");

    useEffect(() => {
      const mock = activeMock?.mockups?.[0].mockup_url;
      setMockImg((prev) => (prev = mock));
      console.log("mock: ", mock);
    }, [activeMock, mockImg]);

    const handleSet = (mock: any) => {
      setActiveMock(mock);
      setMockImg(mock.mockups?.[0].mockup_url);
    };

    return (
      <>
        {!activeMock ? (
          <div className="grid grid-cols-3 gap-3 mx-4 justify-center items-center">
            {mocks.map((mock, index) => (
              <button
                key={mock.task_key}
                className="flex flex-col w-full h-full justify-center items-center border-2 border-accent rounded-lg p-2 m-2 hover:bg-accent hover:text-background transition-all duration-300"
                onClick={() => handleSet(mock)}
              >
                <Image
                  src={mockImg ?? mock.mockups[0].mockup_url}
                  width={500}
                  height={500}
                  alt="mockup"
                  className="rounded-lg"
                />
                <p className="text-accent text-sm mt-2">{mock.product}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center justify-center ">
            <p className="text-accent text-sm ">{activeMock.product}</p>
            <button
              className="flex-end right-0 w-full text-lg hover:bg-accent border border-accent hover:text-background text-accent font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
              onClick={() => setCheckout(true)}
            >
              Buy Now
            </button>
            <div className="relative justify-center w-[900px] h-[900px]">
              <Image
                src={mockImg}
                width={4094}
                height={4094}
                alt="mockup"
                style={{ willChange: "transform" }}
                className="absolute top-0 left-0  pb-40 mb-40 max-4-xl w-auto h-auto rounded-lg m-8 "
              />
            </div>
          </div>
        )}

        {checkout && <HandleSale mockup={activeMock} quantity={quantity} />}
      </>
    );
  };

  const Login = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isRegistering, setIsRegistering] = React.useState(true);

    const signinValidation = () => {
      if (email === "") {
        alert("Please enter your email address");
        return false;
      }
      if (password === "") {
        alert("Please enter your password");
        return false;
      }
      if (!email.includes("@")) {
        alert("Please enter a valid email");
        return false;
      }
      if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return false;
      }
      if (password.length >= 255) {
        alert("Password must be less than 255 characters");
        return false;
      }

      if (email.length >= 255) {
        alert("Email must be less than 255 characters");
        return false;
      }

      if (email.length < 6) {
        alert("Email must be at least 6 characters");
        return false;
      }

      return true;
    };

    const handleSubmit = (event: any) => {
      event.preventDefault();

      if (!signinValidation()) {
        return;
      }

      const fd = new FormData();
      fd.append("email", email);
      fd.append("password", password);

      const target = event.target.action;

      fetch(target, {
        method: "POST",
        body: fd,
      }).then(async (data) => {
        const res = await data.json();
        console.log(res);
        if (res.error) {
          alert(res.error);
        } else {
          window.location.reload();
        }
      });
    };

    return (
      <>
        <form
          method="POST"
          action={!isRegistering ? `/api/auth/login` : `/api/auth/signup`}
          className="space-y-4"
          onSubmit={handleSubmit}
          id="login"
        >
          <Input
            type="username"
            name="username"
            placeholder="Email"
            className="text-accent"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            className="text-accent"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <Button
            className="text-accent hover:bg-accent hover:text-background transition duration-300 border border-accent"
            type="submit"
          >
            {!isRegistering ? "Sign In" : "Register"}
          </Button>
        </form>
        {/* provider login google etc */}

        {/* <div className="flex flex-col space-y-4">
            <Button
              className="text-accent w-full hover:bg-accent hover:text-background transition duration-300 border  border-accent"
              onClick={() => handleLoginWithProvider("google")}
            >
              Sign in with Google
            </Button>
            <Button
              className="text-accent w-full hover:bg-accent hover:text-background transition duration-300 border  border-accent"
              onClick={() => handleLoginWithProvider("github")}
            >
              Sign in with Github
            </Button>
          </div> */}

        {!isRegistering && (
          <p className="text-center text-sm m-2 text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => setIsRegistering(true)}
              className="underline"
            >
              Sign up
            </button>
          </p>
        )}
        {isRegistering && (
          <p className="text-center text-sm m-2 text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={() => setIsRegistering(false)}
              className="underline"
            >
              Sign in
            </button>
          </p>
        )}
      </>
    );
  };

  const MockupLoader = (title, body) => {
    return (
      <div className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
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
                <p className="text-accent text-2xl mt-4">{title}</p>
                <p className="text-accent text-center text-sm mt-2">{body}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const NeedAccountLoader = () => (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
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
              <h1 className="text-accent text-lg m-4">
                Sign in or create an account to continue
              </h1>
              <Login />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
            <MockupLoader
              title="Creating your mockup..."
              body="This may take a minute or two. Future updates will improve this process."
            />
          )}

          {needAccount && <NeedAccountLoader />}

          {!viewingMocks && (
            <div className="flex flex-row mx-8 m-4 justify-between items-center">
              <VariantSelection
                chosen={selectedVariant}
                variants={selectedProduct?.variants}
                setSelectedVariant={() => setSelectedVariant}
              />
              <ProductSelection
                product={selectedProduct}
                setSelectedProduct={onSelect}
              />
            </div>
          )}
          {viewingMocks ? (
            <Mockup />
          ) : (
            <>
              <div className="md:flex w-[1000px] ">
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
                <div className="grid grid-cols-2 mx-8 pt-4 px-4 overflow-y-auto max-w-1xl max-h-[650px] md:grid-cols-1 gap-4">
                  {Object.values(products).map((option, index) => (
                    <ProductOption
                      key={index}
                      image={userImage}
                      product={option}
                      isSelected={
                        selectedVariant?.product_id === option.product.id
                      }
                      onSelect={onSelect}
                    />
                  ))}{" "}
                </div>
              </div>
              <div className="flex mx-8 mt-1 justify-between">
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
              <ImageSlider
                userImages={userImages}
                selectedImage={userImage}
                setSelectedImage={setSelectedImage}
              />
            </>
          )}
        </>
      </Suspense>
    </>
  );
};

export default ImagePlacementEditor;
