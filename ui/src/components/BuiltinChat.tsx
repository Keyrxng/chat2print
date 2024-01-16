import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { __Prod, __Variant } from "@/types/all";
import { formatTextToHTML } from "@/utils/formatToHtml";
import { Info, Lock, MoveRight } from "lucide-react";
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
import { Button } from "./ui/button";
import { toast, useToast } from "./ui/use-toast";
import { Database } from "@/lib/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
const supabase = createClientComponentClient<Database>();

const premiumHowTo = [
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
      "Be as creative and as intentional as possible with your prompt. For safety reasons, your prompt is rewritten and optimized to help to provide a better final result so don't worry if it doesn't quite make sense or is too short.",
  },
];

const freeHowTo = [
  {
    title: "Quality",
    description: "Output quality is dependent on the prompt you provide.",
  },
  {
    title: "Dimensions",
    description:
      "The only dimension available is square, which is not optimal for phone case designs. Landscape and portrait dimensions are available for Premium and Pro users.",
  },
  {
    title: "Prompt",
    description:
      "Unlike DALLE-3, your prompt will not be optimized or 'beefed' up. This gives you a lot more granular control of the output but also means that you need to be more intentional and specific with your prompt to acheive a result similar to DALLE-3.",
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

const DescAndGen = ({
  selectedProduct,
  selectedVariant,
  setSelectedImage,
  userDetails,
  setImageUrl,
}: {
  selectedProduct: __Prod | undefined;
  selectedVariant: __Variant | undefined;
  setSelectedImage: (arg0: string) => void;
  userDetails: any;
  setImageUrl: (arg0: string) => void;
}) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [quality, setQuality] = useState("Standard");
  const [dimension, setDimension] = useState("Portrait");
  const [style, setStyle] = useState("Vivid");
  const [showInfo, setShowInfo] = useState(true);
  const [freeGen, setFreeGen] = useState(true);
  const [showGen, setShowGen] = useState(false);
  const [hover, setHover] = useState(false);
  const [blurred, setBlurred] = useState(true);

  const increaseUsage = async (action: string) => {
    // @ts-ignore
    const { data: increaseData, error } = await supabase
      .from("user_actions")
      .insert({ user_id: userDetails.id, action_type: action });

    if (error) {
      console.log("error: ", error);
      toast({
        title: "Oops!",
        description: `There was an error updating your usage, please report this issue.`,
        variant: "destructive",
        className: "bg-background text-accent border-accent",
      });
    }
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

    const generations = usage?.filter(
      (u: any) => u.action_type === "generate"
    ).length;

    const { data: tierData, error: tierError } = await supabase
      .from("usage_tiers")
      .select("*");

    if (tierError) {
      console.log("error: ", tierError);
    }

    const user_tier = userDetails?.tier;

    const ttn = user_tier === "free" ? 0 : user_tier === "premium" ? 1 : 2;

    const accTier = tierData?.[ttn];
    // @ts-ignore
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

    if (generations! >= activeTier.generations && action === "generate") {
      toast({
        title: "Oops!",
        description: `You've used up your free generations for the day, come back again tomorrow.`,
        variant: "destructive",
        className: "bg-background text-accent border-accent",
      });
      allowed = false;
    }

    if (allowed) {
      switch (action) {
        case "generate":
          const moreThan80PercentData =
            (generations! / activeTier.data_size) * 100 > 80;
          if (moreThan80PercentData) {
            toast({
              title: "Head's up!",
              description: `You have used ${generations} of your ${activeTier.data_size} free data for the day. You can increase your limit by upgrading your account.`,
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

  const handleSubmitPrompt = async () => {
    if (!prompt.trim()) return;
    if (!userDetails.id) {
      toast({
        title: "Not Logged In",
        description: "Please log in to continue.",
        duration: 5000,
      });
      return;
    }
    if (userDetails.tier === "free") {
      toast({
        title: "Premium Feature",
        description:
          "Please upgrade your account to use DALL-E-3 to generate images.",
        duration: 5000,
      });
      return;
    }
    await handleUsage("generate");
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

      if (response.error) {
        setSuccessMessage(response.error.message);
        toast({
          title: "Error",
          description: response.error.message,
          duration: 5000,
        });
        return;
      }

      const b64 = response.data[0].b64_json;
      const imageUrl = `data:image/png;base64,${b64}`;

      const image = new Image();
      image.src = imageUrl;

      const img = await fetch(imageUrl);

      const blob = await img.blob();

      if (userDetails.tier === "Pro") {
        const { data: uploadData, error } = await supabase.storage
          .from("user_uploads")
          .upload(`${userDetails.id}/${Date.now()}.png`, blob);

        if (error) {
          toast({
            title: "Error Saving Image",
            description: error.message,
            duration: 5000,
          });
        } else {
          toast({
            title: "Image Saved",
            description: "Your image has been saved to your account.",
            duration: 5000,
          });
        }
      }

      setSelectedImage(imageUrl);
      setSuccessMessage("Image generated successfully!");
    } catch (error: any) {
      setSuccessMessage(
        "An error occurred while generating the image. " + error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFreePrompt = async () => {
    if (!prompt.trim()) return;
    if (!userDetails.id) {
      toast({
        title: "Not Logged In",
        description: "Please log in to continue.",
        duration: 5000,
      });
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");

    const imageVars = `Style: ${style}\n Dimensions: ${dimension}\n`.trim();
    const imagePrompt =
      `Ensure that the image meets the following criteria:\n\n${imageVars}\n\n${prompt}`.trim();

    try {
      const resp = await fetch("/api/freeGen", {
        method: "POST",
        body: JSON.stringify({
          prompt: imagePrompt,
        }),
      });

      const blob = await resp.blob();

      const { data: uploadData, error } = await supabase.storage
        .from("freegen")
        .upload(`${userDetails?.id}/${Date.now()}.png`, blob);

      const publicUrl = await supabase.storage
        .from("freegen")
        .getPublicUrl(uploadData?.path ?? "");

      if (error) {
        toast({
          title: "Error Saving Image",
          description: error.message,
          duration: 5000,
        });
      } else {
        toast({
          title: "Image Saved",
          description: "Your image has been saved to your account.",
          duration: 5000,
        });
      }

      const imageUrl = URL.createObjectURL(blob);

      const image = new Image();
      image.src = imageUrl;

      setImageUrl(publicUrl.data.publicUrl);
      setSelectedImage(imageUrl);
      setSuccessMessage("Image generated successfully!");
    } catch (error: any) {
      setSuccessMessage(
        "An error occurred while generating the image. " + error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const BlurOverlay = () => {
    const [sks, sSkS] = useState(false);
    const [apiKey, setApiKey] = useState("");
    const [showOpts, setShowOpts] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async () => {
      const reg = /^sk-[A-Za-z0-9]{48}$/;
      const valid = reg.test(apiKey.trim());

      if (!valid) {
        toast({
          title: "Invalid API Key",
          description: "Please enter a valid API key.",
          duration: 5000,
        });
        return;
      }

      const key = apiKey.trim();
      const { error } = await supabase.from("uak").insert({ ak: key });

      if (error?.code === "23505") {
        const { data, error } = await supabase.from("uak").upsert({ ak: key });
      } else {
        console.log("error: ", error);
      }
    };

    const handleShowOpts = () => {
      if (!userDetails.id) {
        toast({
          title: "Not Logged In",
          description: "Please log in to continue.",
          duration: 5000,
        });
        return;
      }

      setShowOpts(!showOpts);
      sSkS(false);
    };

    const handleSks = () => {
      if (!userDetails.id) {
        toast({
          title: "Not Logged In",
          description: "Please log in to continue.",
          duration: 5000,
        });
        return;
      }

      sSkS(!sks);
    };

    useEffect(() => {
      async function check() {
        const { data } = await supabase.auth.getSession();

        if (userDetails.tier !== "free") return setBlurred(false);

        if (data.session?.user?.id) {
          const { data: uak, error } = await supabase
            .from("uak")
            .select("*")
            .eq("user_id", data.session.user.id);

          if (!uak?.length && error) {
            setBlurred(true);
          } else if (uak?.length > 0 && !error) {
            setBlurred(false);
          }
        }
      }
      check();
    }, []);

    return (
      <div className="absolute w-2/5 z-10 max-w-lg h-4/5 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
        {sks && (
          <div className="text-accent justify-between gap-2">
            <Lock className="h-12 w-12 mx-auto" />
            <p className="text-center mt-2">Enter your OpenAi API key</p>

            <div className="flex items-center gap-4">
              <input
                className="border w-auto text-sm border-accent bg-background rounded-lg p-2 mt-2"
                placeholder="API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />

              <Button
                onClick={handleSubmit}
                className="mt-2 hover:bg-accent hover:text-background"
              >
                Submit
              </Button>
            </div>
          </div>
        )}
        {!sks && !showOpts && (
          <div className="text-accent">
            <Lock className="h-12 w-12 mx-auto" />
            <p className="text-center mt-2">Premium Feature</p>
            <Button
              onClick={handleShowOpts}
              className="mt-2 hover:bg-accent hover:text-background"
            >
              Get Premium
            </Button>
            <Button
              onClick={handleSks}
              className="mt-2 hover:bg-accent hover:text-background"
            >
              I have an OpenAi API key
            </Button>
          </div>
        )}
        {showOpts && (
          <div className="fixed bg-background max-h-[500px] overflow-y-auto rounded-lg shadow-2xl p-6 flex-col flex ">
            <div>
              <button
                onClick={() => setShowOpts(false)}
                className="relative text-gray-600 hover:text-gray-900 top-0 right-4 text-2xl"
              >
                &times;
              </button>

              <h2 className="text-4xl font-bold text-center mb-6">
                Upgrade Once for Lifetime Benefits
              </h2>

              <div className="flex flex-col p-2  rounded-lg justify-between items-center">
                <script
                  async
                  src="https://js.stripe.com/v3/pricing-table.js"
                ></script>
                {/* @ts-ignore */}
                <stripe-pricing-table
                  style={{
                    padding: "2px",
                    margin: "2px",
                  }}
                  pricing-table-id="prctbl_1ORxi8J8INwD5VucpA1IVbuN"
                  publishable-key="pk_test_51OIcuCJ8INwD5VucXOT3hww245XJiYrEpbnw3jHf0jboTJhrMix1TH4jf3oqGR4uChV4TyoH2iSL284KOFbAxTJJ00MDub5FdJ"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

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
            onClick={() => {
              if (showGen || freeGen) {
                setShowGen(false);
                setFreeGen(false);
              } else {
                setFreeGen(true);
                setShowGen(false);
              }
            }}
          >
            {showGen || freeGen
              ? "View Product Description"
              : "Open AI Image Generator"}
          </button>
        </div>
      </div>
      <div className="flex flex-row max-w-lg self-center mb-4 max-[1780px]:max-w-4xl items-center rounded-lg bg-background text-accent">
        {freeGen && !showGen && (
          <div className="flex gradientBG flex-col items-center justify-center p-4 w-full max-w-2xl mx-auto rounded-lg shadow-md ">
            <div className="w-full flex justify-between align-middle ">
              <Button
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                className="px-4 py-2 bg-primary border flex justify-between border-accent m-2 rounded-lg text-white shadow-lg"
                onClick={() => {
                  setFreeGen(false);
                  setShowGen(true);
                }}
              >
                <p>DALLE-3</p>
                {"  "}
                <MoveRight
                  className={`w-4 h-4 ml-4 ${
                    hover ? "animate-nudge-right" : ""
                  }`}
                />{" "}
              </Button>
              <Info
                className="h-6 w-6 text-accent cursor-pointer"
                onClick={() => setShowInfo(!showInfo)}
              />
            </div>
            {showInfo && (
              <div className="bg-background p-4 max-w-md rounded-md text-accent shadow-lg mt-2">
                <ul>
                  {freeHowTo.map((item) => (
                    <li key={item.title} className="mb-2">
                      <h2 className="text-lg font-bold">{item.title}</h2>
                      <p className="text-sm">{item.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Textarea
              className="w-full h-44 p-2 bg-background rounded-lg mb-2 text-accent"
              placeholder="Enter your prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <motion.button
              className="px-6 py-2 bg-primary border border-accent m-2 rounded-lg text-white font-bold shadow-lg"
              onClick={handleFreePrompt}
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate Design"}
            </motion.button>

            <p className="text-sm">{successMessage}</p>
          </div>
        )}

        {showGen && !freeGen && (
          <>
            <div className="flex gradientBG flex-col items-center justify-center p-4 w-full max-w-2xl mx-auto rounded-lg shadow-md">
              {blurred && <BlurOverlay />}
              <div className="w-full flex justify-between align-middle">
                <Button
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                  className="px-4 py-2 bg-primary z-10 border flex justify-between border-accent m-2 rounded-lg text-white shadow-lg"
                  onClick={() => {
                    setFreeGen(true);
                    setShowGen(false);
                  }}
                >
                  <p>Stable Diffusion</p>
                  {"  "}
                  <MoveRight
                    className={`w-4 h-4 ml-4 ${
                      hover ? "animate-nudge-right" : ""
                    }`}
                  />{" "}
                </Button>
                <Info
                  className="h-6 w-6 text-accent cursor-pointer"
                  onClick={() => setShowInfo(!showInfo)}
                />
              </div>
              {showInfo && (
                <div className="bg-background p-4 max-w-md rounded-md text-accent shadow-lg mt-2">
                  <ul>
                    {premiumHowTo.map((item) => (
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

                <Select defaultValue="Vivid" onValueChange={(e) => setStyle(e)}>
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
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />

              <motion.button
                className="px-6 py-2 bg-primary border border-accent m-2 rounded-lg text-white font-bold shadow-lg"
                onClick={handleSubmitPrompt}
              >
                {isLoading ? "Generating..." : "Generate Design"}
              </motion.button>

              <p className="text-sm">{successMessage}</p>
            </div>
          </>
        )}

        {!showGen && !freeGen && (
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
