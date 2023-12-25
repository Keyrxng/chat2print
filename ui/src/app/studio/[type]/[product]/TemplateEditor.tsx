"use client";

import { useState, useRef, useEffect, Suspense, useCallback } from "react";
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

import { loadStripe } from "@stripe/stripe-js";
import { ImageSlider } from "@/components/ImageSlider";
import { ProductSelection } from "@/components/ProductSelection";
import { VariantSelection } from "@/components/VariantSelection";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/lib/database.types";
import { staticMocks } from "@/data/statics";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsUpDown, ToggleLeftIcon, X } from "lucide-react";
import { TipsAndTricksModal } from "@/components/TipsAndTricks";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";

const stripePromise = loadStripe(
  "pk_test_51OIcuCJ8INwD5VucXOT3hww245XJiYrEpbnw3jHf0jboTJhrMix1TH4jf3oqGR4uChV4TyoH2iSL284KOFbAxTJJ00MDub5FdJ"
);

interface PFILE {
  printfile_id: number;
  width: number;
  height: number;
  dpi: number;
  fill_mode: string;
  can_rotate: boolean;
}

type Status =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | null
  | undefined;

interface ImagePlacementEditorProps {
  selectedTemplate: __Template | undefined;
  selectedVariant: __Variant | undefined;
  userImage: string;
  printFiles: PFILE | undefined;
  selectedProduct: __Prod | undefined;
  onSelect: (design: __Prod) => void;
  setViewingMock: (viewing: boolean) => void;
  setSelectedImage: (image: string) => void;
  setSelectedVariant: (variant: __Variant) => void;
}

const ImagePlacementEditor: React.FC<ImagePlacementEditorProps> = ({
  selectedTemplate,
  selectedVariant,
  userImage,
  printFiles,
  onSelect,
  setSelectedImage,
  selectedProduct,
  setSelectedVariant,
  setViewingMock,
}) => {
  const { toast } = useToast();
  const editorRef = useRef<HTMLDivElement>(null);
  const [imageSrc, setImageSrc] = useState<string>(
    selectedTemplate?.background_url ?? selectedTemplate?.image_url ?? ""
  );
  const [position, setPosition] = useState({ x: 0, y: 0, scale: 1 });
  const [enhancing, setEnhancing] = useState<boolean>(false);
  const [isMockingUp, setIsMockingUp] = useState<boolean>(false);
  const [mocks, setMocks] = useState<any[]>([]);
  const [viewingMocks, setViewingMocks] = useState<boolean>(false);
  const [needAccount, setNeedAccount] = useState<boolean>(false);
  const [userImages, setUserImages] = useState<string[]>([]);
  const [upscaledImages, setUpscaledImages] = useState<string[]>([]);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [viewingUpscaled, setViewingUpscaled] = useState<boolean>(false);
  const [dataStatic, setDataStatic] = useState<boolean>(false);
  const [pollForMockups, setPollForMockups] = useState<boolean>(false);
  const [tipsOpen, setTipsOpen] = useState<boolean>(false);

  const [transform, setTransform] = useState({
    scale: 1,
    positionX: 0,
    positionY: 0,
  });

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getSession();
      const uID = data.session?.user.id;
      const { data: user } = await supabase.from("users").select("*").match({
        id: uID,
      });

      const usr = {
        id: user?.[0].id,
        full_name: user?.[0].full_name,
        email: data.session?.user.email,
        billing_address: user?.[0].billing_address,
        tier: user?.[0].tier,
      };
      console.log("useEffect0 fired");

      setUserDetails((prev) => (prev = usr));
    }

    getUser();
  }, [setSelectedImage, supabase, userDetails?.id]);

  useEffect(() => {
    async function set() {
      if (!userDetails?.id) return;
      try {
        let imgs;
        let data;
        console.log("fired");

        if (userDetails.id) {
          imgs = await fetch("/api/designs/fetch");
          data = await imgs.json();
        }

        if (!data) {
        } else {
          let { designImages, upscaledImages } = data;
          designImages = designImages.filter((img: string) => img !== null);
          setUserImages(designImages);
          setSelectedImage(designImages[0]);
          upscaledImages = upscaledImages.filter((img: string) => img !== null);
          setUpscaledImages(upscaledImages);
        }
      } catch (err) {
        console.log(err);
      }
    }
    set();
    console.log("useEffect1 fired");
  }, [setSelectedImage, supabase, userDetails?.id]);

  useEffect(() => {
    if (supabase.changedAccessToken === undefined) {
      setUserImages([]);
      setUserDetails((prev) => (prev = null));
      return;
    }

    console.log("useEffect2 fired: ");
  }, [supabase.changedAccessToken]);

  useEffect(() => {
    const intitalPosition = {
      x: selectedTemplate?.print_area_left ?? 100,
      y: selectedTemplate?.print_area_top ?? 100,
      scale: 1,
    };
    setPosition((prev) => (prev = intitalPosition));
    console.log("useEffect3 fired: ", selectedTemplate);

    async function load() {
      const completed = await fetchMockups();
      setMocks((prev) => (prev = completed));

      setImageSrc(
        selectedTemplate?.background_url ?? selectedTemplate?.image_url ?? ""
      );
    }
    load();
  }, [selectedTemplate, setSelectedImage, supabase]);

  useEffect(() => {
    async function load() {
      if (!userDetails?.id) return;
      const { data: pendingReqs, error } = await supabase
        .from("mockup_requests")
        .select("*")
        .match({ user_id: userDetails.id, status: "pending" });

      if (error) {
        toast({
          title: "Something went wrong.",
          description: `There was an error fetching your mockups, error  ${error.message}. Please try again shortly.`,
          variant: "destructive",
          className: "bg-background text-accent border-accent",
        });
        console.log("useEffect4 error: ", error);
      }
      console.log("useEffect4 fired: ", pendingReqs);

      await processMockRequest(pendingReqs);
    }
    load();
  }, [pollForMockups, userDetails?.id, supabase]);

  useEffect(() => {
    async function load() {
      if (!userDetails?.id) return;

      const { data: processingReq, error: processError } = await supabase
        .from("mockup_requests")
        .select("*")
        .match({ user_id: userDetails?.id, status: "processing" });

      if (processError) {
        toast({
          title: "Something went wrong.",
          description: `There was an error fetching your mockups, error  ${processError.message}. Please try again shortly.`,
          variant: "destructive",
          className: "bg-background text-accent border-accent",
        });
        console.log("useEffect5 error: ", processError);
      }

      console.log("useEffect5 fired: ", processingReq);

      if (processingReq?.length === 0) return;
      if (!processingReq) return;

      for (const r of processingReq) {
        if (!r.task_key) return;
        try {
          const resp = await fetch("/api/pod/fetch-mocks", {
            method: "POST",
            body: JSON.stringify({ taskKey: r.task_key }),
          });

          const res = await resp.json();

          const { error: saveError } = await supabase.from("mockups").insert({
            task_key: r.task_key,
            user_id: userDetails.id,
            mockups: res.result.mockups,
            printFiles: res.result.printfiles,
            product: r.product,
            product_id: r.product_id,
            variant_id: r.variant_id,
            price: r.price,
          });

          if (saveError) {
            toast({
              title: "Something went wrong.",
              description: `There was an error fetching your mockups, error  ${saveError.message}. Please try again shortly.`,
              variant: "destructive",
              className: "bg-background text-accent border-accent",
            });
          }

          await updateRequestStatus(r.id, "completed");
        } catch (err) {
          console.log("err: ", err);
        }
      }
      console.log("useEffect5 fired: ", processingReq);

      setPollForMockups(false);
    }
    load();
  }, [userDetails?.id, pollForMockups, supabase]);

  /////// STATS \\\\\\\
  /////// STATS \\\\\\\

  const increaseUsage = async (action: string) => {
    const { data: increaseData, error } = await supabase
      .from("user_actions")
      .insert({ user_id: userDetails.id, action_type: action });

    if (error) {
      console.log("error: ", error);
    }

    console.log("increaseData: ", increaseData);
  };

  const handleUsage = async (action: string) => {
    let allowed = true;
    const { data: usage, error } = await supabase
      .from("user_actions")
      .select("*")
      .match({ user_id: userDetails.id })
      .gt(
        "timestamp",
        new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      );

    const mockups = usage?.filter((u) => u.action_type === "mockup").length;
    const enhancements = usage?.filter(
      (u) => u.action_type === "enhancement"
    ).length;
    const imports = usage?.filter((u) => u.action_type === "import").length;
    const dataSize = usage?.reduce((acc, curr) => {
      return acc + curr.data_size;
    }, 0);

    console.log("enhancements: ", enhancements);
    console.log("dataSize: ", dataSize);

    const { data: tierData, error: tierError } = await supabase
      .from("usage_tiers")
      .select("*");

    if (tierError) {
      console.log("error: ", tierError);
    }

    const user_tier = userDetails?.tier;

    const ttn =
      user_tier === "free"
        ? 0
        : user_tier === "crafter"
        ? 1
        : user_tier === "designer"
        ? 2
        : 3;

    const accTier = tierData?.[ttn];
    const activeTier = accTier[user_tier];

    if (!activeTier) {
      toast({
        title: "Oops!",
        description: `There was an error fetching your account information, please try again shortly.`,
        variant: "destructive",
        className: "bg-background text-accent border-accent",
      });
      return false;
    }

    if (
      (dataSize >= activeTier.data_size * (1024 * 1024) &&
        action === "mockup") ||
      action === "enhancement"
    ) {
      toast({
        title: "Oops!",
        description: `You've used up your free storage for the day, please try again tomorrow.`,
        variant: "destructive",
        className: "bg-background text-accent border-accent",
      });
      allowed = false;
    }

    if (imports >= activeTier.imports && action === "import") {
      toast({
        title: "Oops!",
        description: `You've used up your free imports for the day, please try again tomorrow.`,
        variant: "destructive",
        className: "bg-background text-accent border-accent",
      });
      allowed = false;
    }

    if (enhancements >= activeTier.enhancements && action === "enhancement") {
      toast({
        title: "Oops!",
        description: `You've used up your free enhancements for the day, please try again tomorrow.`,
        variant: "destructive",
        className: "bg-background text-accent border-accent",
      });
      allowed = false;
    }
    console.log(`mockups: ${mockups} activeTier.mockups: `, activeTier);

    if (mockups >= activeTier.mockups && action === "mockup") {
      toast({
        title: "Oops!",
        description: `You've used up your free mockups for the day, please try again tomorrow.`,
        variant: "destructive",
        className: "bg-background text-accent border-accent",
      });
      allowed = false;
    }

    if (allowed) {
      switch (action) {
        case "mockup":
          const moreThan80Percent = (mockups / activeTier.mockups) * 100 > 80;
          if (moreThan80Percent) {
            toast({
              title: "Head's up!",
              description: `You have used ${mockups} of your ${activeTier.mockups} free mockups for the day. You can increase your limit by upgrading your account.`,
            });
          }
          increaseUsage(action);
          break;
        case "enhancement":
          const moreThan80PercentEnhancements =
            (enhancements / activeTier.enhancements) * 100 > 80;
          if (moreThan80PercentEnhancements) {
            toast({
              title: "Head's up!",
              description: `You have used ${enhancements} of your ${activeTier.enhancements} free enhancements for the day. You can increase your limit by upgrading your account.`,
            });
          }

          increaseUsage(action);
          break;
        case "import":
          const moreThan80PercentImports =
            (imports / activeTier.imports) * 100 > 80;
          if (moreThan80PercentImports) {
            toast({
              title: "Head's up!",
              description: `You have used ${imports} of your ${activeTier.imports} free imports for the day. You can increase your limit by upgrading your account.`,
            });
          }
          increaseUsage(action);
          break;
        default:
          break;
      }
      return allowed;
    }

    return allowed;
  };

  const updateActionCount = async (action: string) => {
    const { error } = await supabase.from("user_actions").insert({
      user_id: userDetails.id,
      action_type: action,
    });

    if (error) {
      console.log("error: ", error);
    }
  };

  const updateRequestStatus = async (
    requestId: number,
    status: Status,
    taskKey = null
  ) => {
    const updateData: { status: Status; task_key?: string } = { status };
    if (taskKey) updateData.task_key = taskKey;

    const { error } = await supabase
      .from("mockup_requests")
      .update(updateData)
      .eq("id", requestId);

    toast({
      title: "Mockup request updated",
      description: `One of your mockup requests has been updated to status ${status}`,
      variant: "destructive",
      className: "bg-background text-accent border-accent",
    });

    if (error) {
      console.error(`Error updating status for request ${requestId}:`, error);
    } else {
      await fetchMockups();
    }
  };

  /////// STATS \\\\\\\
  /////// STATS \\\\\\\

  /////// UPSCA \\\\\\\
  /////// UPSCA \\\\\\\

  const handleGeneration = async () => {
    if (!userDetails?.id) {
      console.log("no user");
      setNeedAccount(true);
      return;
    }

    let allowed = true;

    if (viewingUpscaled) {
      // allowed = await handleUsage("mockup");
      console.log(`Mockup allowed: ${allowed}`);
      if (allowed) await handleCreateMockup(userImage);
    } else if (!viewingUpscaled) {
      // allowed = await handleUsage("enhancement");
      console.log(`Enhancement allowed: ${allowed}`);
      if (allowed) await handleEnhanceUpscale();
    }
  };

  const handleEnhanceUpscale = async () => {
    setEnhancing(true);
    if (!userImage) {
      alert("Please choose an image first");
      setEnhancing(false);
      return;
    }
    try {
      const res = await fetch("/api/upscale", {
        method: "POST",
        body: JSON.stringify({
          url: userImage,
        }),
      });

      const data = await res.json();
      if (data.error) {
        console.log("error: ", data.error);
        toast({
          title: "Something went wrong.",
          description: `There was an error enhancing your image, if you are trying to enhance a landscape or portrait design try it at a smaller scale.`,
          variant: "destructive",
          className: "bg-background text-accent border-accent",
        });

        setEnhancing(false);
        return;
      }
      updateActionCount("enhancement");
      await handleCreateMockup(data);
    } catch (err) {
      console.log(err);
      toast({
        title: "Something went wrong.",
        description: `There was an error enhancing your image, if you are trying to enhance a landscape or portrait design try it at a smaller scale.`,
        variant: "destructive",
        className: "bg-background text-accent border-accent",
      });
    }

    setEnhancing(false);
  };

  const wait = (ms: number) =>
    new Promise((resolve) => {
      toast({
        title: "Generating Mockup",
        description: `Please wait while we generate your mockup.`,
        variant: "destructive",
        className: "bg-background text-accent border-accent",
      });

      setTimeout(resolve, ms);
    });

  /////// UPSCA \\\\\\\
  /////// UPSCA \\\\\\\

  /////// MOCKS \\\\\\\
  /////// MOCKS \\\\\\\

  const Mockup = () => {
    const [activeMock, setActiveMock] = useState<any>(null);
    const [checkout, setCheckout] = useState<boolean>(false);
    const [quantity, setQuantity] = useState<number>(1);
    const [mockImg, setMockImg] = useState<string>("");
    const [itemPrice, setItemPrice] = useState<number>(0);

    const handleSet = (mock: any) => {
      setActiveMock(mock);
      console.log("mockkkkk: ", mock);
      setItemPrice(mock.price);
      setMockImg(mock.mockups?.[0].mockup_url);
    };

    const postDraftToSupa = async () => {
      console.log("posting to supa: ", activeMock.task_key);
      const { data: uploadData, error: uploadError } = await supabase
        .from("orders")
        .insert({
          task_key: activeMock.task_key,
          user_id: userDetails.id,
          items: [
            {
              variant_id: activeMock.variant_id,
              quantity,
              files: [
                {
                  url: activeMock.printFiles[0].url,
                },
              ],
            },
          ],
          retail_costs: {
            curreny: "GBP",
            subtotal: itemPrice * quantity,
            discount: userDetails.discount,
            shipping: "0",
            tax: "0",
          },
        });

      if (uploadError?.code === "23505") {
        // dupe draft in db
        setCheckout(true);
      } else if (uploadError) {
        console.log("uploadError: ", uploadError);
        toast({
          title: "Something went wrong.",
          description:
            "There was an error uploading your order, please try again.",
          variant: "destructive",
          className: "bg-background text-accent border-accent",
        });
      }
    };

    const postDraftToPrintful = async () => {
      const files = [
        {
          url: activeMock.printFiles[0].url,
        },
      ];

      const response = await fetch("/api/pod/create-order", {
        method: "POST",
        body: JSON.stringify({
          shipping: "STANDARD",
          recipient: {
            name: userDetails.full_name,
            address1: userDetails.billing_address.firstLine,
            address2: userDetails.billing_address.secondLine,
            city: userDetails.billing_address.city,
            state_code: userDetails.billing_address.state_code,
            country_code: userDetails.billing_address.country_code,
            zip: userDetails.billing_address.zip,
          },
          items: [
            {
              variant_id: activeMock.variant_id,
              quantity,
              files,
            },
          ],
          retail_costs: {
            curreny: "USD",
            subtotal: itemPrice * quantity,
            discount: "0",
            shipping: "0",
            tax: "0",
          },
        }),
      });
      const data = await response.json();

      if (typeof data == "string") {
        toast({
          title: "Something went wrong.",
          description: `${data}`,
          variant: "destructive",
          className: "bg-background text-accent border-accent",
        });
      }

      return data;
    };

    const handleCheckout = () => {
      if (!userDetails?.billing_address) {
        toast({
          title: "Before you continue",
          description:
            "Please enter your shipping address by clicking the 'Profile' button if you are considering making a purchase. This will be used to determine your shipping options.",
          variant: "destructive",
          className: "bg-background text-accent border-accent",
        });

        return;
      }

      postDraftToPrintful().then((res) => {
        if (res && typeof res === "string") {
          return;
        } else if (res) {
          postDraftToSupa();
          setCheckout(true);
        }
      });
    };

    const handleDelete = async (mock: any) => {
      const { error } = await supabase
        .from("mockups")
        .delete()
        .eq("task_key", mock.task_key);

      const { error: mockReqError } = await supabase
        .from("mockup_requests")
        .delete()
        .eq("task_key", mock.task_key);

      if (error || mockReqError) {
        toast({
          title: "Something went wrong.",
          description:
            "There was an error deleting your mockup, please try again.",
          variant: "destructive",
          className: "bg-background text-accent border-accent",
        });
      }

      const updated = mocks.filter((m) => m.task_key !== mock.task_key);

      setMocks(updated);

      toast({
        title: "It's gone!",
        description: "Your mockup has been deleted.",
        variant: "destructive",
        className: "bg-background text-accent border-accent",
      });
    };

    const carouselVariants = {
      enter: {
        x: 1000,
        opacity: 0,
        transition: {
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        },
      },
      center: {
        x: 0,
        opacity: 1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        transition: {
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        },
      },
      exit: {
        x: -1000,
        opacity: 0,
        transition: {
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        },
      },
    };
    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset, velocity) => {
      return Math.abs(offset) * velocity;
    };
    const [[page, direction], setPage] = useState([0, 0]);

    const paginate = (newDirection) => {
      setPage([page + newDirection, newDirection]);
      setActiveMock(mocks[page + newDirection]);
    };

    return (
      <div className="h-full">
        <motion.h1
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold text-center mb-10"
        >
          Where our imagination ends, yours can begin.
        </motion.h1>

        {!activeMock ? (
          <>
            <div className="grid grid-cols-3 gap-3 mx-4 justify-center items-center">
              {mocks.map((mock, index) => (
                <button
                  key={mock.task_key}
                  className="flex flex-col w-full h-full justify-center items-center border-2 border-accent rounded-lg p-2 m-2 hover:bg-accent hover:text-background transition-all duration-300"
                  onClick={() => handleSet(mock)}
                >
                  <h1 className="text-accent text-sm m-1">{mock.product}</h1>
                  <Image
                    priority={true}
                    src={mock.mockups?.[0].mockup_url}
                    width={500}
                    height={500}
                    alt={`Custom ${mock.product}`}
                    className="rounded-lg"
                  />
                </button>
              ))}
            </div>
            <div className="flex w-full mb-6 text-accent items-center bottom-0 space-x-4 px-2 py-4 hover:bg-background hover:text-accent rounded-lg">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => handleSetViewingMocks()}
                      className="relative w-full text-accent bg-background border-2 hover:bg-accent hover:text-background"
                    >
                      Back to Editor
                    </Button>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>
            </div>
          </>
        ) : (
          <div>
            {!checkout && (
              <>
                <section className="relative text-center text-accent mb-14 py-12 md:py-18">
                  <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                      key={page}
                      custom={direction}
                      variants={carouselVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                      }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={1}
                      onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -swipeConfidenceThreshold) {
                          paginate(1);
                        } else if (swipe > swipeConfidenceThreshold) {
                          paginate(-1);
                        }
                      }}
                      className="text-center self-center justify-center rounded-lg p-6 shadow-lg"
                    >
                      <div className="relative mt-8 flex text-center items-center self-center justify-between">
                        <div className="absolute z-10 flex mt-8 justify-between bottom-0 end-0 left-0 ">
                          <Button
                            className="bg-accent text-background font-bold py-3 px-6 rounded-lg text-2xl transition duration-300"
                            onClick={() => paginate(-1)}
                          >
                            Previous
                          </Button>
                          <div>
                            <p className="text-accent text-sm ">
                              {activeMock.product}
                            </p>
                            <button
                              className="flex-end right-0 w-full text-lg hover:bg-accent border border-accent hover:text-background text-accent font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                              onClick={() => handleCheckout()}
                            >
                              Buy Now
                            </button>
                          </div>
                          <Button
                            className="bg-accent text-background font-bold py-3 px-6 rounded-lg text-2xl transition duration-300"
                            onClick={() => paginate(1)}
                          >
                            Next
                          </Button>
                        </div>
                        <Image
                          priority={true}
                          src={activeMock.mockups?.[0].mockup_url}
                          width={2100}
                          height={2100}
                          alt="mockup"
                          style={{ willChange: "transform" }}
                          className="absolute justify-center bottom-0 right-0 pl-6 ml-4 top-0 -z-2 align-middle p-16 -my-12 max-w-[950px] w-auto h-auto rounded-lg"
                        />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  <div className="flex w-full mt-4 mx-6 px-10 h-full">
                    <div className="flex w-full text-accent items-center bottom-0 space-x-4 px-2 py-4 hover:bg-background hover:text-accent rounded-lg">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => setActiveMock(null)}
                              className="relative w-full text-accent bg-background border-2 hover:bg-accent hover:text-background"
                            >
                              Return to Mockups
                            </Button>
                          </TooltipTrigger>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex w-full text-accent items-center bottom-0 space-x-4 px-2 py-4 hover:bg-background hover:text-accent rounded-lg">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => handleDelete(activeMock)}
                              disabled={mocks.length === 0 && dataStatic}
                              className="relative w-full text-accent bg-background border-2 hover:bg-accent hover:text-background"
                            >
                              Delete Mockup
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="text-accent text-center justify-center opacity-90 bg-background rounded-md ">
                            <p className="text-accent text-sm">
                              This cannot be undone.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </section>
              </>
            )}

            {checkout && (
              <>
                <div className="flex">
                  <div className="relative justify-center w-[900px] h-[900px]">
                    <Image
                      priority={true}
                      src={mockImg}
                      width={4094}
                      height={4094}
                      alt="mockup"
                      style={{ willChange: "transform" }}
                      className="absolute top-0 left-0  pb-40 mb-40 max-4-xl w-auto h-auto rounded-lg m-8 "
                    />
                    <h1 className="text-xl font-bold">{activeMock.product}</h1>
                    <h2 id="delivery-date" className="text-xl"></h2>
                  </div>
                  <HandleSale
                    mockup={activeMock}
                    quantity={quantity}
                    itemPrice={itemPrice}
                  />
                </div>
                <div className="flex text-accent items-center bottom-0 space-x-4 px-2 py-4 hover:bg-background hover:text-accent rounded-lg">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => handleSetViewingMocks()}
                          className="relative w-full text-accent bg-background border-2 hover:bg-accent hover:text-background"
                        >
                          Return to Editor
                        </Button>
                      </TooltipTrigger>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const processMockRequest = async (req) => {
    let count = 0;
    const limit = 2;
    const backoff = 60000;

    for (const r of req) {
      const contentType = r.image_data.includes(".png") ? true : false;

      if (!contentType) {
        toast({
          title: "Oops!",
          description: `It looks like you're trying to use a file that isn't a PNG. Please try again with a PNG file.`,
          variant: "destructive",
          className: "bg-background text-accent border-accent",
        });
      }

      console.log("processMockRequest r: ", r);

      while (count < limit) {
        let data;
        if (aiAssist) {
          data = {
            productId: r.product_id,
            imageUrl: r.image_data,
            variantIDs: r.variant_id,
            scaledWidth: r.scaled_width,
            scaledHeight: r.scaled_height,
            offsetX: 0,
            offsetY: 0,
          };
        } else {
          data = {
            productId: r.product_id,
            imageUrl: r.image_data,
            variantIDs: r.variant_id,
            scaledWidth: r.scaled_width,
            scaledHeight: r.scaled_height,
            offsetX: r.offset_x,
            offsetY: r.offset_y,
          };
        }

        const response = await fetch("/api/pod/create-mocks", {
          method: "POST",
          body: JSON.stringify(data),
        });
        const res = await response.json();

        console.log("processMockRequest res: ", res);

        if (res.error) {
          console.log("processMockRequest error: ", res.error);
        }

        if (res.status === 429) {
          console.log("waiting for 60 seconds or status 429");
          await wait(60 * 1000);
        }

        if (!res.result?.task_key) {
          console.log("no task key");
          return;
        }

        await updateRequestStatus(r.id, "processing", res.result?.task_key);
        count++;

        count == limit && (await wait(backoff));
      }

      count = 0;
    }

    return;
  };

  const ele = document?.getElementById("user-image-source") as HTMLImageElement;

  console.log("ele h: ", ele?.naturalHeight);
  console.log("ele w: ", ele?.naturalWidth);

  const handleCreateMockup = async (imageData: string) => {
    if (!selectedTemplate || !selectedVariant) {
      console.error("Template or variant information is missing");
      return;
    }

    const { product_id: prodID, id: variantID, name, price } = selectedVariant;

    if (!prodID || !variantID) {
      console.error("No product or variant IDs found");
      return;
    }

    const ele = document.getElementById(
      "user-image-source"
    ) as HTMLImageElement;

    const { naturalWidth, naturalHeight } = ele;
    const desiredDpi = 300;

    const printFileWidthPixels = printFiles.width;
    const printFileHeightPixels = printFiles.height;

    const maxPrintWidthInches = printFileWidthPixels / desiredDpi;
    const maxPrintHeightInches = printFileHeightPixels / desiredDpi;

    let scaled_width;
    let scaled_height;

    if (
      naturalWidth / naturalHeight >
      printFileWidthPixels / printFileHeightPixels
    ) {
      scaled_width = Math.round(maxPrintWidthInches * desiredDpi);
      scaled_height = Math.round((scaled_width / naturalWidth) * naturalHeight);
    } else {
      scaled_height = Math.round(maxPrintHeightInches * desiredDpi);
      scaled_width = Math.round((scaled_height / naturalHeight) * naturalWidth);
    }

    setIsMockingUp(true);

    const mockupRequest: Database["public"]["Tables"]["mockup_requests"]["Insert"] =
      {
        product_id: prodID,
        variant_id: variantID,
        image_data: imageData,
        scaled_width: scaled_width,
        scaled_height: scaled_height,
        offset_x: 0,
        offset_y: 0,
        user_id: userDetails.id,
        status: "pending",
        product: name,
        price: Math.round(Number(price) * 1.8),
      };

    const { error } = await supabase
      .from("mockup_requests")
      .insert(mockupRequest);

    if (error) {
      console.error("Error inserting mockup request:", error);
      toast({
        title: "Something went wrong.",
        description: "Failed to queue your mockup request, please try again",
        variant: "destructive",
        className: "bg-background text-accent border-accent",
      });
      return;
    }

    toast({
      title: "Mockup request queued",
      description: "Your request is being processed.",
      variant: "destructive",
      className: "bg-background text-accent border-accent",
    });

    updateActionCount("mockup");
    setPollForMockups(true);
    setIsMockingUp(false);
  };

  const fetchMockups = async () => {
    const user_id = userDetails?.id;
    if (!user_id) {
      setDataStatic(true);
      return staticMocks;
    } else {
      setDataStatic(false);
    }

    const { data: mockups, error } = await supabase
      .from("mockups")
      .select("*")
      .eq("user_id", user_id);

    if (error) {
      toast({
        title: "Something went wrong.",
        description:
          "There was an error fetching your mockups, so examples have been provided. Please try again shortly.",
        variant: "destructive",
        className: "bg-background text-accent border-accent",
      });
      return [];
    }

    setMocks(mockups);

    return mockups;
  };

  const handleSetViewingMocks = () => {
    setViewingMock(!viewingMocks);
    setViewingMocks(!viewingMocks);

    if (!viewingMocks == true) {
      if (!userDetails?.billing_address) {
        toast({
          title: "Before you continue",
          description:
            "Please enter your billing address in your account settings if you are considering making a purchase.",
          variant: "destructive",
          className: "bg-background text-accent border-accent",
        }).dismiss();
      }
    }

    fetchMockups();
  };

  const MockupLoader = ({ title, body }: { title: string; body: string }) => {
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

  /////// MOCKS \\\\\\\
  /////// MOCKS \\\\\\\

  /////// ACCT \\\\\\\
  /////// ACCT \\\\\\\

  const HandleSale = async ({
    mockup,
    quantity,
    itemPrice,
  }: {
    mockup: any;
    quantity: number;
    itemPrice: number;
  }) => {
    const [clientSecret, setClientSecret] = useState<string>("");

    useEffect(() => {
      console.log("=====================================");
      const orderCost = async () => {
        const data = {
          recipient: {
            address1: userDetails.billing_address.firstLine,
            address2: userDetails.billing_address.secondLine,
            city: userDetails.billing_address.city,
            state_code: userDetails.billing_address.state_code,
            country_code: userDetails.billing_address.country_code,
            zip: userDetails.billing_address.zip,
            phone: "07485441905",
          },
          items: [
            {
              variant_id: mockup.variant_id,
              quantity,
              retail_price: itemPrice,
              name: mockup.product,
              product: {
                variant_id: mockup.variant_id,
                product_id: mockup.product_id,
                name: mockup.product,
                image: mockup.printFiles[0].url,
              },
              files: [
                {
                  type: "default",
                  url: mockup.printFiles[0].url,
                  filename: "immmage",
                },
              ],
            },
          ],
          retail_costs: {
            subtotal: itemPrice * quantity,
            discount: userDetails?.discount || "0",
            shipping: "0",
            tax: "0",
          },
        };

        const response = await fetch("/api/pod/estimate-costs", {
          method: "POST",
          body: JSON.stringify(data),
        });

        const result = await response.json();
        console.log("est order: ", result);

        const orderData = {
          currency: result.costs.currency,
          shipping: result.costs.shipping,
          subtotal: result.costs.subtotal,
          vat: result.costs.vat,
          total: result.costs.total,
        };

        return orderData;
      };

      const shippingCost = async () => {
        const data = {
          recipient: {
            address1: userDetails.billing_address.firstLine,
            address2: userDetails.billing_address.secondLine,
            city: userDetails.billing_address.city,
            state_code: userDetails.billing_address.state_code,
            country_code: userDetails.billing_address.country_code,
            zip: userDetails.billing_address.zip,
          },
          items: [
            {
              variant_id: mockup.variant_id,
              quantity,
              value: itemPrice.toString(),
            },
          ],
          retail_costs: {
            subtotal: itemPrice * quantity,
            discount: userDetails?.discount || "0",
            shipping: "0",
            tax: "0",
          },
        };

        const response = await fetch("/api/pod/shipping", {
          method: "POST",
          body: JSON.stringify(data),
        });

        const result = await response.json();

        console.log("est shipping: ", result);

        const shippingData = {
          currency: result[0].currency,
          id: result[0].id,
          maxDeliveryDate: result[0].maxDeliveryDate,
          maxDeliveryDays: result[0].maxDeliveryDays,
          minDeliveryDays: result[0].minDeliveryDays,
          name: result[0].name,
          rate: result[0].rate,
        };

        return shippingData;
      };

      async function load() {
        const estOrderCost = await orderCost();
        const estShippingCost = await shippingCost();
        console.log(`estOrderCost: `, estOrderCost);
        console.log(`estShippingCost: `, estShippingCost);

        const data = {
          ...estOrderCost,
          ...estShippingCost,
        };

        const ele = document.getElementById("delivery-date");
        if (ele) {
          ele.innerHTML = `Estimated delivery date: ${new Date(
            data.maxDeliveryDate
          ).toLocaleDateString()}`;
        }

        const { data: dbUpdate, error } = await supabase
          .from("orders")
          .update({
            final: data,
            product: mockup.product,
          })
          .eq("task_key", mockup.task_key);

        if (error) {
          console.log("dbUpdate error: ", error);
        }
      }

      load();
    });

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
          regions: selectedVariant?.availability_regions,
          stock: selectedVariant?.availability_status,
        }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
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
            <button
              onClick={() => setNeedAccount(false)}
              className="absolute top-0 right-0 m-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            >
              <X className="h-4 w-4 text-accent" />
            </button>
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

  /////// ACCT \\\\\\\
  /////// ACCT \\\\\\\

  /////// CTRLS \\\\\\\
  /////// CTRLS \\\\\\\

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
    setTransform({
      scale: zoomScale,
      positionX: positionX,
      positionY: positionY,
    });
  };

  /////// CTRLS \\\\\\\
  /////// CTRLS \\\\\\\

  const [aiAssist, setAiAssist] = useState(true);
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
            <>
              <div className="flex flex-row mx-8 m-4 gap-2 justify-between items-center">
                <VariantSelection
                  chosen={selectedVariant}
                  variants={selectedProduct?.variants}
                  setSelectedVariant={setSelectedVariant}
                />
                <ProductSelection
                  product={selectedProduct}
                  setSelectedProduct={onSelect}
                />

                <TipsAndTricksModal
                  onClose={() => setTipsOpen(false)}
                  isOpen={tipsOpen}
                />

                <Popover open={tipsOpen} onOpenChange={setTipsOpen}>
                  <PopoverTrigger asChild className="mr-2">
                    <Button
                      variant="outline"
                      className="w-min justify-between text-accent"
                    >
                      How To Use{" "}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                </Popover>
              </div>
            </>
          )}
          {viewingMocks ? (
            <Mockup />
          ) : (
            <>
              <div className="flex justify-center w-full h-min max-w-full">
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
                    <Suspense fallback={<div>Loading...</div>}>
                      <div
                        className="relative bg-center bg-no-repeat bg-cover h-[750px] w-[750px] fill"
                        style={{ backgroundImage: `url(${imageSrc})` }}
                      >
                        <TransformComponent wrapperClass="relative h-auto w-auto fill">
                          <div className="relative w-[700px] h-[700px]">
                            {userImage ? (
                              <Image
                                onDrag={handleDrag}
                                alt="user image"
                                width={viewingUpscaled ? 4094 : 1024}
                                id="user-image-source"
                                height={viewingUpscaled ? 7168 : 1024}
                                src={userImage || ""}
                                className="z-10"
                                style={{
                                  maxWidth: "100%",
                                  width: "50%",
                                  height: "70%",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  maxWidth: "100%",
                                  width: "15%",
                                  height: "15%",
                                }}
                              >
                                <p className="text-black text-md text-bold">
                                  Upload an image
                                </p>
                              </div>
                            )}
                          </div>
                        </TransformComponent>
                      </div>
                    </Suspense>
                  ) : (
                    <div
                      className="relative bg-center bg-no-repeat bg-cover h-[700px] w-[700px] fill"
                      ref={editorRef}
                    >
                      <TransformComponent wrapperClass="relative h-auto w-auto fill">
                        <div className="relative w-[700px] h-[700px]">
                          <Suspense fallback={<div>Loading...</div>}>
                            {userImage ? (
                              <Image
                                onDrag={handleDrag}
                                alt="user image"
                                width={viewingUpscaled ? 4094 : 1024}
                                id="userImage"
                                height={viewingUpscaled ? 4094 : 1024}
                                src={userImage || ""}
                                className="z-10"
                                style={{
                                  maxWidth: "100%",
                                  width: "35%",
                                  height: "35%",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  maxWidth: "100%",
                                  width: "15%",
                                  height: "15%",
                                }}
                              >
                                <p className="text-black text-md text-bold">
                                  Upload an image
                                </p>
                              </div>
                            )}
                          </Suspense>
                        </div>
                      </TransformComponent>
                    </div>
                  )}
                </TransformWrapper>
                {/* values */}
              </div>
              <div className="grid grid-cols-1">
                <div className="flex mx-8 mt-4 justify-between">
                  <div className="flex text-accent items-center space-x-4 px-2 py-1 hover:bg-background hover:text-accent rounded-lg">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <>
                            <div className="upscale-button">
                              <Button
                                onClick={() => handleGeneration()}
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
                            model to enhance your image. This results in 4x
                            print quality increase over the original ChatGPT
                            image.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex text-accent justify-center align-middle items-center space-x-4 px-2 py-1 hover:bg-background hover:text-accent rounded-lg">
                    <TooltipProvider>
                      <Tooltip>
                        <p className="mb-[4.5px]">Ai-Assist</p>
                        <TooltipTrigger>
                          <Switch
                            defaultChecked={aiAssist}
                            onChange={() => {
                              setAiAssist(!aiAssist);
                            }}
                            className="relative overflow-hidden w-full text-accent bg-background border-2 hover:bg-accent hover:text-background"
                          />
                        </TooltipTrigger>
                        <TooltipContent className="text-accent opacity-90 bg-background rounded-md overflow-ellipsis mb-2 max-w-xs flex-wrap">
                          <p className="text-accent text-sm">
                            This will apply the best solution for your image
                            automatically upon mockup generation regardless of
                            your current placement. We recommend leaving this
                            enabled.
                          </p>
                          <p className="text-accent text-sm"></p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex text-accent items-center space-x-4 px-2 py-1 hover:bg-background hover:text-accent rounded-lg">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => handleSetViewingMocks()}
                            className="relative w-full text-accent bg-background border-2 hover:bg-accent hover:text-background"
                          >
                            View Mockups
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="text-accent opacity-90 bg-background rounded-md overflow-ellipsis mb-2 max-w-xs flex-wrap">
                          <p className="text-accent text-sm">
                            View your generated mockups and place an order.
                          </p>
                          <p className="text-accent text-sm"></p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <ImageSlider
                  userDetails={userDetails}
                  userImages={userImages}
                  upscaledImages={upscaledImages}
                  setSelectedImage={setSelectedImage}
                  setViewingUpscaled={setViewingUpscaled}
                  viewingUpscaled={viewingUpscaled}
                />
              </div>
            </>
          )}
        </>
      </Suspense>
    </>
  );
};

export default ImagePlacementEditor;
