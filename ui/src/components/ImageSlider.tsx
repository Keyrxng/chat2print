import Image from "next/image";
import {
  Plus,
  ToggleLeft,
  ToggleRight,
  Upload,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "./ui/use-toast";

const supabase = createClientComponentClient();

export const ImageSlider = ({
  upscaledImages,
  userImages,
  userDetails,
  viewingUpscaled,
  setSelectedImage,
  setViewingUpscaled,
}: {
  upscaledImages: string[];
  userImages: string[];
  userDetails: any;
  viewingUpscaled: boolean;
  setSelectedImage: (image: string) => void;
  setViewingUpscaled: (value: boolean) => void;
}) => {
  const [images, setUserImages] = useState<string[]>([]);
  const [upscaled, setUpscaled] = useState<string[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { toast } = useToast();
  useEffect(() => {
    setUserImages(userImages);
    setUpscaled(upscaledImages);
    if (viewingUpscaled) {
      setSelectedImage(upscaledImages[0]);
    } else {
      setSelectedImage(userImages[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userImages, upscaledImages]);

  const handleSelectImage = (image: string) => {
    setSelectedImage(image);
  };

  const handleDeleteImage = async (image: string) => {
    if (viewingUpscaled) {
      const name = image.split("/")[image.split("/").length - 1];
      const { data, error } = await supabase.storage
        .from("user_uploads")
        .remove([`${userDetails.id}/upscaled/${name}`]);

      if (error) {
        toast({
          title: "Something went wrong.",
          description:
            "There was an error deleting your upscaled design, please try again.",
          duration: 5000,
        });
      }

      const updated = upscaled.findIndex((img) => img === image);
      upscaled.splice(updated, 1);

      setUpscaled(upscaled);
    } else {
      const name = image.split("/")[image.split("/").length - 1];
      const { data, error } = await supabase.storage
        .from("user_uploads")
        .remove([`${userDetails.id}/${name}`]);

      if (error) {
        toast({
          title: "Something went wrong.",
          description:
            "There was an error deleting your design, please try again.",
          duration: 5000,
        });
      }

      const index = userImages.findIndex((img) => img === image);
      userImages.splice(index, 1);

      console.log("data: ", data);
      setUserImages(userImages);
    }

    toast({
      title: "It's gone!",
      description: "Your image has been deleted.",
      duration: 5000,
    });
  };

  const UpgradeModal = () => {
    return (
      <>
        <div className="fixed z-50 inset-0 grid grid-cols-1 justify-center items-center p-4">
          <div className="bg-background rounded-lg shadow-2xl p-6 w-full">
            <div>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="relative text-gray-600 hover:text-gray-900 top-0 right-4 text-2xl"
              >
                &times;
              </button>

              <h2 className="text-4xl font-bold text-center mb-6">
                Subscribe Now!
              </h2>

              <script
                async
                src="https://js.stripe.com/v3/pricing-table.js"
              ></script>
              {/* @ts-ignore */}
              <stripe-pricing-table
                pricing-table-id="prctbl_1OZXVmJ8INwD5VucGC60357c"
                publishable-key="pk_test_51OIcuCJ8INwD5VucXOT3hww245XJiYrEpbnw3jHf0jboTJhrMix1TH4jf3oqGR4uChV4TyoH2iSL284KOFbAxTJJ00MDub5FdJ"
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  const handleViewUpscaled = () => {
    const tier = userDetails?.tier;

    if (tier === "free") {
      setShowUpgradeModal(true);
    } else {
      setViewingUpscaled(true);
    }
  };

  return (
    <>
      {userDetails && (
        <div className="mx-4 py-4 h-min flex items-center justify-center">
          {showUpgradeModal && <UpgradeModal />}
          {userDetails?.tier && userDetails?.tier === "free" && (
            <div className="flex flex-row justify-center h-min  items-center max-w-6xl">
              <div className="hover:-translate-y-2.5 transition duration-300 ease-in-out transform hover:scale">
                <div className="bg-background rounded-full h-24 w-24 flex items-center justify-center">
                  <Button
                    onClick={() => setShowUpgradeModal(true)}
                    className="flex text-accent items-center space-x-4 px-2 py-1 hover:bg-background hover:text-accent rounded-lg"
                  >
                    <Plus className="h-8 w-8 border rounded-full border-accent" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          {userDetails?.tier && userDetails?.tier !== "free" && (
            <>
              <div className="justify-center mx-2 h-min border border-transparent ">
                <div className="shadow-lg rounded-lg bg-background">
                  <p className="font-bold text-sm text-center text-accent -mb-56 mt-2">
                    {viewingUpscaled ? "Viewing Enhanced" : "Viewing Originals"}
                  </p>
                </div>
              </div>
              <div className="flex flex-row justify-center h-min  items-center max-w-6xl">
                <div className="hover:-translate-y-2.5 transition duration-300 ease-in-out transform hover:scale">
                  <div className="bg-background rounded-full h-24 w-24 flex items-center justify-center">
                    <Button
                      onClick={() => handleViewUpscaled()}
                      className="flex text-accent items-center space-x-4 px-2 py-1 hover:bg-background hover:text-accent rounded-lg"
                    >
                      {!viewingUpscaled ? (
                        <ToggleLeft className="h-8 w-8" />
                      ) : (
                        // userDetails && userDetails.tier != "free" &&
                        <ToggleRight className="h-8 w-8" />
                      )}
                    </Button>
                  </div>
                </div>
                {!viewingUpscaled ? (
                  <>
                    {images.map((image, index) => (
                      <div key={index} className="flex">
                        <div className="relative hover:translate-y-2.5 transition duration-300 ease-in-out transform hover:scale">
                          <button
                            onClick={() => handleDeleteImage(image)}
                            className="absolute top-0 left-0 mb-2 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                          >
                            <X className="h-4 w-4 text-accent" />
                          </button>
                          <button
                            onClick={() => handleSelectImage(image)}
                            className="m-1"
                          >
                            <Image
                              src={image}
                              alt="design"
                              width={60}
                              height={60}
                              className="rounded-full"
                              style={{
                                maxWidth: "60px",
                                height: "auto",
                                width: "auto",
                                objectFit: "cover",
                              }}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {upscaled?.map((image) => (
                      <div key={image} className="flex">
                        <div className="relative hover:-translate-y-2.5 transition duration-300 ease-in-out transform hover:scale">
                          <button
                            onClick={() => handleDeleteImage(image)}
                            className="absolute top-0 left-0 mb-2 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                          >
                            <X className="h-4 w-4 text-accent" />
                          </button>
                          <button
                            onClick={() => handleSelectImage(image)}
                            className="m-1"
                          >
                            <Image
                              src={image}
                              alt="design"
                              width={60}
                              height={60}
                              className="rounded-full"
                              style={{
                                maxWidth: "60px",
                                height: "auto",
                                width: "auto",
                                objectFit: "cover",
                              }}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
