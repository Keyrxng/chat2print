"use client";
import { FeaturesSection } from "@/components/Features";
import { HowItWorksSection } from "@/components/HowItWorks";
import { PricingPlans } from "@/components/Pricing";
import { ProductGallery } from "@/components/ProductGallery";
import { useState } from "react";

export default function Home() {
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
  const [currentX, setCurrentX] = useState(0);

  const translateSliderX = (index) => {
    const translateY = "rotateY(9deg) scale(0.6)";
    const translateX = `translateX(${index * currentX}px)`;
    return `${translateY} ${translateX}`;
  };

  const SlidingBackground = () => {
    const imageRows = [images];
    const returnRows = () => {
      return imageRows.map((row) => {
        const randomImages = [];
        for (let i = 0; i < images.length; i++) {
          const randomIndex = Math.floor(Math.random() * row.length) + 1;
          randomImages.push(row[randomIndex]);
        }
        const set = new Set(randomImages);
        const arr = Array.from(set);
        return arr;
      });
    };

    return (
      <div className="relative">
        <div id="sliding-background">
          {returnRows().map((row, index) => (
            <div key={index} className="grid grid-flow-row py-8">
              <div className="image-row">
                {row.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`shadow-md rounded-lg overflow-hidden m-2`}
                    style={{
                      backgroundImage: `url(${imageUrl})`,
                      transform: translateSliderX(index),
                      animation: "slide 25s infinite linear reverse",
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      width: "250px",
                      height: "250px",
                    }}
                  >
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <h3 className="text-white text-xl font-bold">
                        {index + 1}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>

              {returnRows().map((row, index) => (
                <div key={index} className="image-row">
                  {row.map((imageUrl, index) => (
                    <div
                      key={index}
                      className={`shadow-md rounded-lg overflow-hidden m-2`}
                      style={{
                        backgroundImage: `url(${imageUrl})`,
                        transform: translateSliderX(index),
                        animation: "slide 20s infinite linear reverse",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        width: "250px",
                        height: "250px",
                      }}
                    >
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <h3 className="text-white text-xl font-bold">
                          {index + 1}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {returnRows().map((row, index) => (
                <div key={index} className="image-row">
                  {row.map((imageUrl, index) => (
                    <div
                      key={index}
                      className={`shadow-md rounded-lg overflow-hidden m-2`}
                      style={{
                        backgroundImage: `url(${imageUrl})`,
                        transform: translateSliderX(index),
                        animation: "slide 20s infinite linear reverse",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        width: "250px",
                        height: "250px",
                      }}
                    >
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <h3 className="text-white text-xl font-bold">
                          {index + 1}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {returnRows().map((row, index) => (
                <div key={index} className="image-row">
                  {row.map((imageUrl, index) => (
                    <div
                      key={index}
                      className={`shadow-md rounded-lg overflow-hidden m-2`}
                      style={{
                        backgroundImage: `url(${imageUrl})`,
                        transform: translateSliderX(index),
                        animation: "slide 20s infinite linear reverse",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        width: "250px",
                        height: "250px",
                      }}
                    >
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <h3 className="text-white text-xl font-bold">
                          {index + 1}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {returnRows().map((row, index) => (
                <div key={index} className="image-row">
                  {row.map((imageUrl, index) => (
                    <div
                      key={index}
                      className={`shadow-md rounded-lg overflow-hidden m-2`}
                      style={{
                        backgroundImage: `url(${imageUrl})`,
                        transform: translateSliderX(index),
                        animation: "slide 20s infinite linear reverse",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        width: "250px",
                        height: "250px",
                      }}
                    >
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <h3 className="text-white text-xl font-bold">
                          {index + 1}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
        <section className="text-center md:py-24">
          <h1 className="text-4xl text-accent md:text-6xl font-bold  mb-4">
            Chat2Print
          </h1>
          <p className="text-xl text-white md:text-2xl  mb-8">
            Transform your ChatGPT art into physical products.
          </p>
          <a
            href="/download"
            className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-blue-600 transition duration-300"
          >
            Download Extension
          </a>
        </section>
      </div>
    );
  };

  return (
    <div className="mx-auto">
      <SlidingBackground />
      <div className="grid grid-cols-1 gap-8">
        <div className="justify-evenly gradientBG items-start">
          <FeaturesSection />
          <section className="py-8 rounded-md md:py-16">
            <h2 className="text-accent text-5xl font-bold text-center mb-6">
              Go from ChatGPT to Print in 3 Easy Steps
            </h2>
          </section>{" "}
          <HowItWorksSection />
        </div>
        <PricingPlans />
        <ProductGallery images={images} />
      </div>
    </div>
  );
}
