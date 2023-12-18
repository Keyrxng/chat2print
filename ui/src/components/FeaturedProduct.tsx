import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "./ui/button";
import { carouselImages } from "@/data/statics";

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

const FeaturedProductsGallery = () => {
  const [[page, direction], setPage] = useState([0, 0]);

  const imageIndex = wrap(0, carouselImages.length, page);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <section className="relative text-center text-accent ">
      <div className="grid relative grid-cols-1 ">
        <motion.h2
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold text-center "
        >
          Where our imagination ends, yours can begin.
        </motion.h2>
      </div>
    </section>
  );
};

const wrap = (min, max, val) => {
  const range = max - min;
  return ((((val - min) % range) + range) % range) + min;
};

export default FeaturedProductsGallery;
