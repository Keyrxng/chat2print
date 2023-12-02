"use client";
import { FaqSection } from "@/components/FAQ";
import { FeaturesSection } from "@/components/Features";
import { HowItWorksSection } from "@/components/HowItWorks";
import { PricingPlans } from "@/components/Pricing";
import { ProductGallery } from "@/components/ProductGallery";
import { CustomerTestimonials } from "@/components/Testimonials";
import { useState, useEffect } from "react";

export default function Home() {
  const images = [
    "/next.svg",
    "/next.svg",
    "/next.svg",
    "/next.svg",
    "/next.svg",
    "/next.svg",
    "/next.svg",
    "/next.svg",
  ];
  const [currentX, setCurrentX] = useState(0);

  const getTransformStyle = (index) => {
    const translateY = "rotateY(45deg) scale(0.6)";
    const translateX = `translateX(${index * currentX}px)`;
    return `${translateY} ${translateX}`;
  };
  const SlidingBackground = () => {
    const imageRows = Array(8) // Create 3 rows
      .fill(null)
      .map(() => [...images, ...images]); // Duplicate the images for each row

    const returnRows = () => {
      const random = Math.floor(Math.random() * 10) + 1;

      return imageRows.slice(0, random);
    };

    return (
      <div className="relative">
        <div id="sliding-background">
          {returnRows().map((row, index) => (
            <div key={index} className="grid grid-flow-row">
              <div className="image-row">
                {row.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`shadow-md rounded-lg overflow-hidden m-4`}
                    style={{
                      backgroundImage: `url(${imageUrl})`,
                      transform: getTransformStyle(index),
                      animation: "slide 20s infinite linear reverse",
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      width: "120px",
                      height: "120px",
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
              <div className="image-row">
                {row.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`shadow-md rounded-lg overflow-hidden m-4`}
                    style={{
                      backgroundImage: `url(${imageUrl})`,
                      transform: getTransformStyle(index),
                      animation: "slide 20s infinite linear reverse",
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      width: "120px",
                      height: "120px",
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

              <div className="image-row">
                {row.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`shadow-md rounded-lg overflow-hidden m-4`}
                    style={{
                      backgroundImage: `url(${imageUrl})`,
                      transform: getTransformStyle(index),
                      animation: "slide 20s infinite linear reverse",
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      width: "240px",
                      height: "240px",
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
              <div className="image-row">
                {row.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`shadow-md rounded-lg overflow-hidden m-4`}
                    style={{
                      backgroundImage: `url(${imageUrl})`,
                      transform: getTransformStyle(index),
                      animation: "slide 20s infinite linear reverse",
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      width: "240px",
                      height: "240px",
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
