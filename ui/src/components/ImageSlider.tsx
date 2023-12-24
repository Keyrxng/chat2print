import Image from "next/image";
import { ToggleLeft, ToggleRight, Upload, X } from "lucide-react";
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

  const { toast } = useToast();
  useEffect(() => {
    setUserImages(userImages);
    setUpscaled(upscaledImages);
    if (viewingUpscaled) {
      setSelectedImage(upscaledImages[0]);
    } else {
      setSelectedImage(userImages[0]);
    }
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

      const updated = upscaled.filter((img) => img !== image);
      setUpscaled(updated);
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

      const updated = userImages.filter((img) => img !== image);
      console.log("data: ", data);
      setUserImages(updated);
    }

    toast({
      title: "It's gone!",
      description: "Your image has been deleted.",
      duration: 5000,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        const updatedImages = [...userImages, reader.result];
        setUserImages(updatedImages);
        setSelectedImage(reader.result);
      }
    };

    reader.onerror = (error) => {
      console.log("Error: ", error);
    };

    if (file) {
      reader.readAsDataURL(file);
    }

    // const { error } = await supabase.storage
    //   .from("user_uploads")
    //   .upload(`${userDetails.id}/${file?.name}`, file!);

    // const updateActionCount = async (action: string) => {
    //   const { data, error } = await supabase.from("user_actions").insert({
    //     user_id: userDetails.id,
    //     action_type: action,
    //   });
    // };

    // console.log("uploaded: ", file?.name);

    // updateActionCount("import");

    // if (error) {
    //   toast({
    //     title: "Something went wrong.",
    //     description:
    //       "Your upload was not successfully uploaded to your account, it will disappear when you refresh the page.",
    //     duration: 5000,
    //   });
    // }
  };

  return (
    <>
      <div className="justify-center">
        <div className="shadow-lg rounded-lg bg-background">
          <p className="font-bold text-sm text-center text-accent -mb-56 mt-2">
            {viewingUpscaled ? "Viewing Enhanced" : "Viewing Originals"}
          </p>
        </div>
      </div>
      <div className="flex flex-row justify-center items-center max-w-6xl">
        <div className="relative hover:translate-y-2.5 transition duration-300 ease-in-out transform hover:scale">
          <div className="bg-background rounded-full h-24 w-24 flex items-center justify-center">
            <Button
              onClick={() => setViewingUpscaled(!viewingUpscaled)}
              className="flex text-accent items-center space-x-4 px-2 py-1 hover:bg-background hover:text-accent rounded-lg"
            >
              {!viewingUpscaled ? (
                <ToggleLeft className="h-8 w-8" />
              ) : (
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
                        maxWidth: "100%",
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
                        maxWidth: "100%",
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
        <div className="relative hover:translate-y-2.5 transition duration-300 ease-in-out transform hover:scale">
          <label htmlFor="imageUpload" className="m-1 cursor-pointer">
            <div className="bg-background rounded-full h-24 w-24 flex items-center justify-center">
              <div className="flex text-accent items-center space-x-4 px-2 py-1 hover:bg-background hover:text-accent rounded-lg">
                <Upload className="h-8 w-8" />
              </div>
            </div>
            <input
              type="file"
              id="imageUpload"
              accept="image/png"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>
      </div>
    </>
  );
};
