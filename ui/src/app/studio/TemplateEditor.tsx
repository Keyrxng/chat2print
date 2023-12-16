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
  setViewingMock: (viewing: boolean) => void;
}

import { loadStripe } from "@stripe/stripe-js";
import { ProductOption } from "@/components/ProductOption";
import products from "@/data/products";
import { ImageSlider } from "@/components/ImageSlider";
import { ProductSelection } from "@/components/ProductSelection";
import { VariantSelection } from "@/components/VariantSelection";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/lib/database.types";

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

  const [transform, setTransform] = useState({
    scale: 1,
    positionX: 0,
    positionY: 0,
  });

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    async function getUser() {
      const uID = (await supabase.auth.getSession()).data.session?.user.id;
      const { data } = await supabase.from("users").select("*").match({
        id: uID,
      });

      setUserDetails(data?.[0]);
    }

    getUser();
  }, []);

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
        let { designImages, upscaledImages } = data;
        designImages = designImages.filter((img: string) => img !== null);
        setUserImages(designImages);
        setSelectedImage(designImages[0]);
        upscaledImages = upscaledImages.filter((img: string) => img !== null);
        setUpscaledImages(upscaledImages);
      } catch (err) {
        console.log(err);
      }
    }
    set();
  }, [selectedTemplate, setSelectedImage]);

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

  const handleGeneration = async () => {
    if (!userDetails?.id) {
      console.log("no user");
      setNeedAccount(true);
      return;
    }

    console.log("handling generation");

    if (viewingUpscaled) {
      const mockupData = await handleCreateMockup(userImage);

      if (typeof mockupData === "number") {
        console.log("mockupData: ", mockupData);

        return;
      }
    } else if (!viewingUpscaled) {
      await handleEnhanceUpscale();
    }
  };

  const handleEnhanceUpscale = async () => {
    console.log("enhancing");
    setEnhancing(true);
    if (!userImage) {
      alert("Please choose an image first");
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

    await handleCreateMockup(data);

    setEnhancing(false);
  };

  const [mockReqs, setMockReqs] = useState<number[]>([]);
  // TODO - test this
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    async function fetchAndProcessRequests() {
      try {
        const { data: pendingReqs, error } = await supabase
          .from("mockup_requests")
          .select("*")
          .match({ user_id: userDetails.id, status: "pending" });

        console.log("fetching pending requests");
        if (error)
          throw new Error(`Error fetching pending requests: ${error.message}`);
        if (pendingReqs.length === 0) return;

        console.log("pendingReqs: ", pendingReqs);

        setMockReqs(pendingReqs.map((req) => req.id));

        for (let request of pendingReqs) {
          console.log("request of pendingReqs: ", request);

          try {
            const res = await fetch("/api/pod/create-mocks", {
              method: "POST",
              body: JSON.stringify({ ...request }),
            });

            const data = await res.json();
            if (data.error) {
              console.log(
                `Error processing request ${request.id}: `,
                data.error
              );
              const seconds = extractWaitTime(data.error.message);
              await wait(seconds * 1000);
              continue;
            }

            await updateRequestStatus(
              request.id,
              "completed",
              data.result.task_key
            );
          } catch (err) {
            console.error(`Error processing request ${request.id}:`, err);
            await updateRequestStatus(request.id, "failed");
          }
        }
      } catch (err) {
        console.error("Error in fetchAndProcessRequests:", err);
      }
    }

    intervalId = setInterval(fetchAndProcessRequests, 60000);
    return () => clearInterval(intervalId);
  }, [userDetails.id, supabase]);

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const extractWaitTime = (errorMessage: string) => {
    const match = errorMessage.match(/\d+/);
    return match ? parseInt(match[0], 10) : 60;
  };

  type Status =
    | "pending"
    | "processing"
    | "completed"
    | "failed"
    | null
    | undefined;

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

    if (error)
      console.error(`Error updating status for request ${requestId}:`, error);
  };

  const handleCreateMockup = async (imageData: string) => {
    console.log("Creating mockup");

    if (!selectedTemplate || !selectedVariant) {
      console.error("Template or variant information is missing");
      return;
    }

    const { product_id: prodID, id: variantID, name, price } = selectedVariant;
    const scaledWidth = selectedTemplate.print_area_width * transform.scale;
    const scaledHeight = selectedTemplate.print_area_height * transform.scale;

    if (!prodID || !variantID) {
      console.error("No product or variant IDs found");
      return;
    }

    setIsMockingUp(true);

    const mockupRequest: Database["public"]["Tables"]["mockup_requests"]["Insert"] =
      {
        product_id: prodID,
        variant_id: variantID,
        image_data: imageData,
        scaled_width: scaledWidth,
        scaled_height: scaledHeight,
        offset_x: transform.positionX,
        offset_y: transform.positionY,
        user_id: userDetails.id,
        status: "pending",
        product: name,
        cost: price,
        price: Math.round(Number(price) * 1.5),
      };

    try {
      const { data, error } = await supabase
        .from("mockup_requests")
        .insert([mockupRequest])
        .select("id")
        .single();

      if (error) throw error;

      toast({
        title: "Mockup request queued",
        description: "Your request is being processed.",
        variant: "destructive",
        className: "bg-background text-accent border-accent",
      });

      setMockReqs((prev) => [...prev, data.id]);
    } catch (error) {
      console.error("Failed to queue mockup request:", error);
      toast({
        title: "Something went wrong.",
        description: "Failed to queue your mockup request.",
        variant: "destructive",
        className: "bg-background text-accent border-accent",
      });
    } finally {
      setIsMockingUp(false);
    }
  };

  const fetchMockups = async () => {
    const user_id = userDetails?.id;

    const { data: mockups, error } = await supabase
      .from("mockup_requests")
      .select("*")
      .eq("user_id", user_id!);

    if (error) {
      toast({
        title: "Something went wrong.",
        description:
          "There was an error fetching your mockups, so examples have been provided. Please try again shortly.",
        variant: "destructive",
        className: "bg-background text-accent border-accent",
      });
      // TODO: provide static examples taken from supa [upscaled images and mockups]
      return [];
    }

    const completed = [];
    for (const mockup of mockups!) {
      if (mockup.status === "completed") {
        completed.push(mockup);
        continue;
      }

      if (mockup.status === "pending") {
        setMockReqs((prev) => [...prev, mockup.id]);
      }

      if (mockup.status === "processing") {
        console.log(`Request ${mockup.id} is still processing`);
      }

      if (mockup.status === "failed") {
        console.log(`Request ${mockup.id} failed`);
        toast({
          title: "Something went wrong.",
          description: `There was an error processing your mockup request for ${mockup.product}. You may need to create another.`,
          variant: "destructive",
          className: "bg-background text-accent border-accent",
        });
      }
    }
    setMocks(completed);

    return completed;
  };

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
        .then((data) => setClientSecret(data.clientSecret));
    }, []);

    /**
     * {
    "id": "cs_test_a1dfzc4tGze7dNgPSmWgzBMtZCSH3G6MyIEkTUhpgRlYrbUWlKq7c5OzNf",
    "object": "checkout.session",
    "after_expiration": null,
    "allow_promotion_codes": null,
    "amount_subtotal": 3600,
    "amount_total": 3600,
    "automatic_tax": {
        "enabled": false,
        "status": null
    },
    "billing_address_collection": null,
    "cancel_url": null,
    "client_reference_id": null,
    "client_secret": null,
    "consent": null,
    "consent_collection": null,
    "created": 1702671078,
    "currency": "usd",
    "currency_conversion": null,
    "custom_fields": [],
    "custom_text": {
        "after_submit": null,
        "shipping_address": null,
        "submit": null,
        "terms_of_service_acceptance": null
    },
    "customer": null,
    "customer_creation": "if_required",
    "customer_details": {
        "address": {
            "city": null,
            "country": "GB",
            "line1": null,
            "line2": null,
            "postal_code": "TE57 5TE",
            "state": null
        },
        "email": "kieranpatton@proton.me",
        "name": "mr testy test",
        "phone": null,
        "tax_exempt": "none",
        "tax_ids": []
    },
    "customer_email": null,
    "expires_at": 1702757478,
    "invoice": null,
    "invoice_creation": {
        "enabled": false,
        "invoice_data": {
            "account_tax_ids": null,
            "custom_fields": null,
            "description": null,
            "footer": null,
            "metadata": {},
            "rendering_options": null
        }
    },
    "livemode": false,
    "locale": null,
    "metadata": {},
    "mode": "payment",
    "payment_intent": "pi_3ONhjbJ8INwD5Vuc0YtDVDTg",
    "payment_link": null,
    "payment_method_collection": "if_required",
    "payment_method_configuration_details": null,
    "payment_method_options": {},
    "payment_method_types": [
        "card"
    ],
    "payment_status": "paid",
    "phone_number_collection": {
        "enabled": false
    },
    "recovered_from": null,
    "redirect_on_completion": "always",
    "return_url": "http://localhost:3000/return?session_id={CHECKOUT_SESSION_ID}",
    "setup_intent": null,
    "shipping_address_collection": null,
    "shipping_cost": null,
    "shipping_details": null,
    "shipping_options": [],
    "status": "complete",
    "submit_type": null,
    "subscription": null,
    "success_url": null,
    "total_details": {
        "amount_discount": 0,
        "amount_shipping": 0,
        "amount_tax": 0
    },
    "ui_mode": "embedded",
    "url": null
}
     */
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
    const itemPrice = activeMock?.price;

    useEffect(() => {
      const mock = activeMock?.mockups?.[0].mockup_url;
      console.log("activeMock: ", activeMock);
      setMockImg((prev) => (prev = mock));
      console.log("mock: ", mock);
    }, [activeMock, mockImg]);

    const handleSet = (mock: any) => {
      setActiveMock(mock);
      setMockImg(mock.mockups?.[0].mockup_url);
    };

    const estimateOrderCosts = async () => {
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
            variant_id: activeMock.variant_id,
            quantity,
            itemPrice,
          },
        ],
        currency: "USD",
        locale: "en_US",
      };

      const response = await fetch("/api/pod/estimate-costs", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const res = await response.json();

      console.log("estimate costs response: ", res);
    };

    const estimateShippingCosts = async () => {
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
            variant_id: activeMock.variant_ids[0],
            quantity,
            value: itemPrice,
          },
        ],
        currency: "USD",
        locale: "en_US",
      };

      const response = await fetch("/api/pod/estimate-shipping", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const res = await response.json();

      console.log("estimate shipping response: ", res);
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
            curreny: "USD",
            subtotal: itemPrice * quantity,
            discount: "0",
            shipping: "0",
            tax: "0",
          },
        });

      if (uploadError) {
        console.log("uploadError: ", uploadError);
        toast({
          title: "Something went wrong.",
          description:
            "There was an error uploading your order, please try again.",
          variant: "destructive",
          className: "bg-background text-accent border-accent",
        });
      } else {
        postDraftToPrintful();
      }
    };

    const postDraftToPrintful = async () => {
      console.log("posting to printful: ", activeMock.task_key);
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

      console.log("draft order response: ", data);
    };

    const handleCheckout = () => {
      //do it
      postDraftToSupa();

      setCheckout(true);
    };

    const handleDelete = async (mock: any) => {
      const { data, error } = await supabase
        .from("mockups")
        .delete()
        .eq("task_key", mock.task_key);

      console.log("mock: ", mock);
      if (error) {
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

      console.log("data: ", data);
    };

    return (
      <>
        <h1 className="text-accent text-2xl my-4">Your Mockups</h1>
        {!activeMock ? (
          <>
            <div className="grid grid-cols-3 gap-3 mx-4 justify-center items-center">
              {mocks.length === 0 && <h1> none yet</h1>}

              {mocks.map((mock, index) => (
                <button
                  key={mock.task_key}
                  className="flex flex-col w-full h-full justify-center items-center border-2 border-accent rounded-lg p-2 m-2 hover:bg-accent hover:text-background transition-all duration-300"
                  onClick={() => handleSet(mock)}
                >
                  <p className="text-accent text-sm mt-2">{mock.product}</p>
                  <Image
                    priority={true}
                    src={mockImg ?? mock.mockups[0].mockup_url}
                    width={500}
                    height={500}
                    alt="mockup"
                    className="rounded-lg"
                  />
                </button>
              ))}
            </div>
            <div className="flex w-full text-accent items-center bottom-0 space-x-4 px-2 py-4 hover:bg-background hover:text-accent rounded-lg">
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
                <p className="text-accent text-sm ">{activeMock.product}</p>
                <button
                  className="flex-end right-0 w-full text-lg hover:bg-accent border border-accent hover:text-background text-accent font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                  onClick={() => handleCheckout()}
                >
                  Buy Now
                </button>
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
                </div>
                <div className="flex w-full">
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

  const handleSetViewingMocks = () => {
    setViewingMock(!viewingMocks);
    setViewingMocks(!viewingMocks);

    if (!viewingMocks == true) {
      console.log("userDetails: ", userDetails);
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

  const snapImageToPrintArea = () => {
    let scaleFactor = 0.15; // the image is scaled to 15% of the parent container

    let imageWidth = viewingUpscaled ? 4094 * scaleFactor : 1024 * scaleFactor;
    let imageHeight = viewingUpscaled ? 4094 * scaleFactor : 1024 * scaleFactor;

    const {
      print_area_width,
      print_area_height,
      print_area_left,
      print_area_top,
    } = selectedTemplate;

    const imageAspectRatio = imageWidth / imageHeight;

    let scaledWidth, scaledHeight;

    // Calculate scaled dimensions based on aspect ratio
    if (imageAspectRatio > print_area_width / print_area_height) {
      scaledWidth = print_area_width;
      scaledHeight = print_area_width / imageAspectRatio;
    } else {
      scaledHeight = print_area_height;
      scaledWidth = print_area_height * imageAspectRatio;
    }

    // Calculate offsets to center the image within the print area
    let offsetX = print_area_left + (print_area_width - scaledWidth) / 2;
    let offsetY = print_area_top + (print_area_height - scaledHeight) / 2;

    // Apply the new styles and transformation to the image
    const ele = document.getElementById("userImage") as HTMLImageElement;
    ele.style.width = `${scaledWidth}px`;
    ele.style.height = `${scaledHeight}px`;
    ele.style.left = `${offsetX}px`;
    ele.style.top = `${offsetY}px`;

    // Determine the scale factor to apply based on the new dimensions
    let newScale = Math.min(
      scaledWidth / imageWidth,
      scaledHeight / imageHeight
    );

    onTransformChange(newScale, offsetX, offsetY);
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
                setSelectedVariant={setSelectedVariant}
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
              <div className="flex w-full h-min max-w-7xl">
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
                        className="relative bg-center bg-no-repeat bg-cover h-[700px] w-[700px] fill"
                        style={{ backgroundImage: `url(${imageSrc})` }}
                      >
                        <TransformComponent wrapperClass="relative h-auto w-auto fill">
                          <div className="relative w-[700px] h-[700px]">
                            <Image
                              onDrag={handleDrag}
                              alt="user image"
                              width={viewingUpscaled ? 4094 : 1024}
                              id="userImage"
                              height={viewingUpscaled ? 4094 : 1024}
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
                    </Suspense>
                  ) : (
                    <div
                      className="relative bg-center bg-no-repeat bg-cover h-[700px] w-[700px] fill"
                      ref={editorRef}
                    >
                      <TransformComponent wrapperClass="relative h-auto w-auto fill">
                        <div className="relative w-[700px] h-[700px]">
                          <Suspense fallback={<div>Loading...</div>}>
                            <Image
                              onDrag={handleDrag}
                              id="userImage"
                              alt="user image"
                              width={viewingUpscaled ? 4094 : 1024}
                              height={viewingUpscaled ? 4094 : 1024}
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
                <div className="grid grid-cols-2 mx-8 pt-4 px-4 overflow-y-auto max-w-xs max-h-[700px] md:grid-cols-1 gap-4">
                  {Object.values(products).map((option, index) => (
                    <ProductOption
                      key={index}
                      product={option}
                      isSelected={
                        selectedVariant?.product_id === option.product.id
                      }
                      onSelect={onSelect}
                    />
                  ))}
                </div>
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
                  <div className="flex text-accent items-center space-x-4 px-2 py-1 hover:bg-background hover:text-accent rounded-lg">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => snapImageToPrintArea()}
                            className="relative w-full text-accent bg-background border-2 hover:bg-accent hover:text-background"
                          >
                            Fit to Print Area
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="text-accent opacity-90 bg-background rounded-md overflow-ellipsis mb-2 max-w-xs flex-wrap">
                          <p className="text-accent text-sm">
                            Snap your image to the print area of the selected
                            product.
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
