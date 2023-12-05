"use client";
import { useEffect, useState } from "react";
import { ProductOption } from "@/components/ProductOption";
import { MainProduct } from "@/components/MainProduct";
import { Design } from "@/types/all";
import Image from "next/image";
import { X } from "lucide-react";

const images = [
  "/wfm.webp",
  "/unitornado.webp",
  "/unicorn.webp",
  "/staghead.webp",
  "/smolgaming.webp",
  "/redeagle.webp",
  "/penguinbadge.webp",
  "/musclecar.webp",
  "/mid-00-gaming.webp",
  "/metalspiral.webp",
  "/metaloptical.webp",
  "/kingsloth.webp",
  "/impact.webp",
  "/horsecar.webp",
  "/fantasyart.webp",
  "/darkroads.webp",
  "/cosmicbirds.webp",
  "/c2pdigital.webp",
  "/bullettip.webp",
  "/betty.webp",
  "/badge.webp",
  "/atomdna.webp",
  "/bullettime.webp",
  "/animalcinema.webp",
  "/90-00-gaming.webp",
  "/10-20-gaming.webp",
  "/00-10-gaming.webp",
  "/00-10-gaming-retro.webp",
];

const userDesigns = [
  {
    id: 1,
    name: "T-Shirt",
    description: "The official T-Shirt",
    price: 19.99,
    imageUrl: "",
  },
  {
    id: 2,
    name: "Hoodie",
    description: "The official Hoodie",
    price: 29.99,
    imageUrl: "",
  },
  {
    id: 3,
    name: "Poster",
    description: "The official poster",
    price: 10.99,
    imageUrl: "",
  },
  {
    id: 4,
    name: "Sticker",
    description: "The official Sticker",
    price: 1.99,
    imageUrl: "",
  },
  {
    id: 5,
    name: "Mug",
    description: "The official Mug",
    price: 9.99,
    imageUrl: "",
  },
  {
    id: 6,
    name: "Mousemat",
    description: "The official Mousemat",
    price: 15.99,
    imageUrl: "",
  },
];

export default function Page() {
  const [designs, setDesigns] = useState<Design[]>(userDesigns); // Load initial designs
  const [selectedDesign, setSelectedDesign] = useState<Design>(userDesigns[0]); // Set initial selected design
  const [userImages, setUserImages] = useState<string[]>([]); // Load initial user images

  useEffect(() => {
    async function isLoggedIn() {
      const accessT = sessionStorage.getItem("accessT");
      const refreshT = sessionStorage.getItem("refreshT");
      if (!accessT || !refreshT) {
        window.location.href = "/";
      }
    }

    isLoggedIn();

    setUserImages(images);
    setDesigns((prev) => {
      for (const design of prev) {
        design.imageUrl = images[0];
      }
      return prev;
    });

    setSelectedDesign((prevDesign) => ({
      ...prevDesign,
      imageUrl: images[0],
    }));
  }, []);

  const handleSelectDesign = (design: Design) => {
    setSelectedDesign(design);
  };

  const handleSelectImage = (image: string) => {
    setSelectedDesign((prevDesign) => ({
      ...prevDesign,
      imageUrl: image,
    }));
    for (const design of userDesigns) {
      design.imageUrl = image;
    }
    setDesigns(userDesigns);
  };

  const handleDeleteImage = (image: string) => {
    for (const img of images) {
      if (img === image) {
        images.splice(images.indexOf(img), 1);
      }
    }

    setUserImages((prev) => prev.filter((img) => img !== image));
  };

  const ImageSlider = () => {
    return (
      <div className="flex flex-row justify-center items-center max-w-6xl">
        {userImages.map((image, index) => (
          <div key={index} className="flex">
            <div className="relative hover:translate-y-2.5 transition duration-300 ease-in-out transform hover:scale">
              <button onClick={() => handleSelectImage(image)} className="m-1">
                <Image
                  src={image}
                  alt="design"
                  width={100}
                  height={100}
                  objectFit="cover"
                  className="rounded-full"
                />
              </button>
              <button
                onClick={() => handleDeleteImage(image)}
                className="absolute bottom-0 left-0 mt-2 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none "
              >
                <X className="h-4 w-4 text-accent " />
              </button>
            </div>
          </div>
        ))}
        <div className="relative hover:translate-y-2.5 transition duration-300 ease-in-out transform hover:scale">
          <button
            className="m-1"
            onClick={() => alert("Upgrade for more storage space!")}
          >
            <div className="bg-background rounded-full h-20 w-20 flex items-center justify-center">
              <p className="text-accent self-center text-5xl mb-1">+</p>
            </div>
          </button>
          <button className="absolute bottom-0 left-0 mt-2 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none "></button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="max-h-[120px]">
        <ImageSlider />
      </div>
      <div className="gradientBG text-white m-14 flex flex-col ">
        <div className="container  mx-auto p-4">
          <div className="grid  grid-cols-1 max-h-min md:grid-cols-3 gap-8">
            <div className="col-span-2  max-h-min">
              <MainProduct design={selectedDesign} />
            </div>
            <div className="grid grid-cols-2 mx-8 pt-4 px-4 overflow-y-auto max-w-3xl max-h-[770px] md:grid-cols-1 gap-4">
              {designs.map((option) => (
                <ProductOption
                  key={option.id}
                  design={option}
                  isSelected={selectedDesign.id === option.id}
                  onSelect={handleSelectDesign}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center mt-8 p-4 rounded-lg bg-background text-accent">
            <div>
              <h2 className="text-2xl font-bold ">{selectedDesign.name}</h2>
              <p className="text-lg">{selectedDesign.description}</p>
              <p className="text-xl font-bold">${selectedDesign.price}</p>
            </div>
            <button
              className="mt-4 md:mt-0 hover:bg-background gradientBG text-accent font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1"
              onClick={() => (window.location.href = "/checkout")}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
