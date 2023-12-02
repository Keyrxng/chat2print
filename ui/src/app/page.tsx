"use client";
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

  // useEffect(() => {
  //   const slideTiles = () => {
  //     setCurrentX((prevCurrentX) => {
  //       const newX = prevCurrentX - 10; // 260 width + 10 margin

  //       return newX;
  //     });
  //   };

  //   const intervalId = setInterval(slideTiles, 3000); // Slide every 3 seconds

  //   return () => clearInterval(intervalId);
  // }, [images.length]);

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
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            Chat2Print
          </h1>
          <p className="text-xl md:text-2xl text-primary mb-8">
            Print your GPT creations on phone cases, mousepads, hoodies, and
            more!
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
    <div className="container mx-auto px-4">
      <SlidingBackground />

      <section className="py-8 md:py-16">
        <h2 className="text-3xl font-bold text-center text-primary mb-6">
          Quick and Easy Shift from ChatGPT to Print-on-Demand Designs
        </h2>
        <p className="text-primary text-lg md:text-xl text-center mx-auto leading-relaxed max-w-2xl">
          Transform your creative ChatGPT images into unique physical products
          with just a few clicks. Our seamless integration with print-on-demand
          services lets you bring your virtual creations to life, effortlessly.
        </p>
      </section>

      {/* Add additional sections with more features, testimonials, etc., as needed */}
    </div>
  );
}
