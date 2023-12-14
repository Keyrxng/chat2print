import Image from "next/image";
import { X } from "lucide-react";

export const ImageSlider = ({
  userImages,
  setSelectedImage,
}: {
  userImages: string[];
  selectedImage: string;
  setSelectedImage: (image: string) => void;
}) => {
  const handleSelectImage = (image: string) => {
    setSelectedImage(image);
  };

  const handleDeleteImage = (image: string) => {
    for (const img of userImages) {
      if (img === image) {
        userImages.splice(userImages.indexOf(img), 1);
      }
    }
  };

  const ImageSlider = () => {
    return (
      <div className="flex flex-row justify-center items-center max-w-6xl">
        {userImages?.map((image, index) => (
          <div key={index} className="flex">
            <div className="relative hover:translate-y-2.5 transition duration-300 ease-in-out transform hover:scale">
              <button
                onClick={() => handleDeleteImage(image)}
                className="absolute top-0 left-0 mb-2 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none "
              >
                <X className="h-4 w-4 text-accent " />
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
              <></>
            </div>
          </div>
        ))}
        <div className="relative hover:translate-y-2.5 transition duration-300 ease-in-out transform hover:scale">
          <button className="m-1" onClick={() => {}}>
            <div className="bg-background rounded-full h-20 w-20 flex items-center justify-center">
              <p className="text-accent self-center text-5xl mb-1">+</p>
            </div>
          </button>
        </div>
      </div>
    );
  };

  return <ImageSlider />;
};
