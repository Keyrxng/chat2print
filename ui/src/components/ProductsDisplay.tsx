"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import Image from "next/image";
import { carouselImages } from "@/data/statics";
import { Button } from "./ui/button";

export function ProductsDisplay() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [activeProd, setActiveProd] = useState<{
    title: string;
    description: string;
    image_url: string;
    alt: string;
  } | null>(null);

  const carouselVariants = {
    enter: {
      x: 1000,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    center: {
      x: 0,
      opacity: 1,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: {
      x: -1000,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
  };
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
    setActiveProd(carouselImages[page + newDirection]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <section className="justify-center">
        <h2 className="text-accent text-5xl font-bold text-center mb-6">
          Imagine the Possibilities, Print the Reality
        </h2>
        {!activeProd ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2" ref={ref}>
            {carouselImages.map((mock, index) => (
              <button
                key={mock.title}
                className="flex flex-col w-full h-full justify-center items-center border-2 border-accent rounded-lg p-2 m-2 hover:bg-accent hover:text-background transition-all duration-300"
                onClick={() => setActiveProd(mock)}
              >
                <h1 className="text-accent text-lg m-1">{mock.title}</h1>
                <Image
                  priority={true}
                  src={mock.image_url}
                  width={150}
                  height={150}
                  alt={mock.alt}
                  className="rounded-lg"
                />
              </button>
            ))}
          </div>
        ) : (
          <button
            key={activeProd.title}
            className="flex flex-col w-full h-full justify-center items-center border-2 border-accent rounded-lg p-2 m-2 hover:bg-black hover:text-background transition-all duration-300"
            onClick={() => setActiveProd(null)}
            about="Close Product Display"
          >
            <h1 className="text-accent text-lg m-1">{activeProd.title}</h1>
            <Image
              priority={true}
              src={activeProd.image_url}
              width={450}
              height={450}
              alt={activeProd.alt}
              className="rounded-lg"
            />
          </button>
        )}
      </section>
    </motion.div>
  );
}
