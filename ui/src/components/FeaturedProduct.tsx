import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "./ui/button";

const carouselImages = [
  {
    title: "Canvas Prints",
    description:
      "Turn your ChatGPT art into stunning wall decor with our high-quality canvas prints.",
    imageUrl: "/badge.webp",
    alt: "Canvas print of AI-generated artwork",
  },
  {
    title: "Metal Prints",
    description:
      "Experience a modern touch with durable metal prints for a sleek, industrial look.",
    imageUrl: "/betty.webp",
    alt: "Sleek metal print of AI-created design",
  },
  {
    title: "Phone Cases",
    description:
      "Carry your art everywhere with custom-designed phone cases that make a statement.",
    imageUrl: "/fantasyArt.webp",
    alt: "Custom phone case with personalized AI art",
  },
];

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
    <section className="relative text-center text-accent mb-14 py-12 md:py-18">
      <motion.h2
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-5xl font-bold text-center mb-10"
      >
        Where our imagination ends, yours can begin.
      </motion.h2>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={carouselVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="text-center self-center  rounded-lg p-6 shadow-lg"
        >
          <div className=" relative flex justify-between">
            <Image
              src={carouselImages[imageIndex].imageUrl}
              alt={carouselImages[imageIndex].alt}
              width={300}
              height={300}
              className="rounded-lg"
            />
            <div className="absolute flex justify-between bottom-0 end-0 left-0 ">
              <Button
                className="bg-accent text-background font-bold py-3 px-6 rounded-lg text-2xl transition duration-300"
                onClick={() => paginate(-1)}
              >
                Previous
              </Button>
              <Button
                className="bg-accent text-background font-bold py-3 px-6 rounded-lg text-2xl transition duration-300"
                onClick={() => paginate(1)}
              >
                Next
              </Button>
            </div>
            <Image
              src={carouselImages[imageIndex].imageUrl}
              alt={carouselImages[imageIndex].alt}
              width={300}
              height={300}
              className="rounded-lg"
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

const wrap = (min, max, val) => {
  const range = max - min;
  return ((((val - min) % range) + range) % range) + min;
};

export default FeaturedProductsGallery;
