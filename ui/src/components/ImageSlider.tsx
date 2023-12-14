import Image from "next/image";
import { Upload, X } from "lucide-react";
import { useEffect, useState } from "react";

export const ImageSlider = ({
  userImages,
  setSelectedImage,
}: {
  userImages: string[];
  setSelectedImage: (image: string) => void;
}) => {
  const handleSelectImage = (image: string) => {
    setSelectedImage(image);
  };

  const handleDeleteImage = (image: string) => {
    const updatedImages = userImages.filter((img) => img !== image);
    setSelectedImage("");
    setUserImages(updatedImages);
  };

  const [images, setUserImages] = useState<string[]>([]);

  useEffect(() => {
    setUserImages(userImages);
  }, [userImages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  return (
    <div className="flex flex-row justify-center items-center max-w-6xl">
      {images.map((image, index) => (
        <div key={index} className="flex">
          <div className="relative hover:translate-y-2.5 transition duration-300 ease-in-out transform hover:scale">
            <button
              onClick={() => handleDeleteImage(image)}
              className="absolute top-0 left-0 mb-2 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            >
              <X className="h-4 w-4 text-accent" />
            </button>
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
          </div>
        </div>
      ))}
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
  );
};
