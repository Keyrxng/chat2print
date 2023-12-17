import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "./ui/button";

const carouselImages = [
  {
    title: "Custom Canvas Prints",
    description:
      "Turn your ChatGPT art into stunning wall decor with our high-quality canvas prints.",
    imageUrl: "/staticMocks/framed-canvas-(in)-black-24x36-front.png",
    alt: "Canvas print of AI-generated artwork",
  },
  {
    title: "Custom Metal Prints",
    description:
      "Experience a modern touch with durable metal prints for a sleek, industrial look.",
    imageUrl: "/staticMocks/gaming-mouse-pad-white-18x16-front.png",
    alt: "Sleek metal print of AI-created design",
  },
  {
    title: "Custom Phone Cases",
    description:
      "Design your unique phone case, showcasing your style with our custom design options.",
    imageUrl: "/staticMocks/framed-canvas-(in)-brown-24x36-front.png",
    alt: "Customized phone case with unique design elements",
  },
  {
    title: "Custom Framed Canvas Prints",
    description:
      "Elevate your space with custom framed canvas prints, blending art and elegance seamlessly.",
    imageUrl:
      "/staticMocks/snap-case-for-samsung-glossy-samsung-galaxy-s20-fe-front.png",
    alt: "Elegant framed canvas print in a modern setting",
  },
  {
    title: "Custom Design Benefits",
    description:
      "Discover the advantages of custom design, from personalized aesthetics to creative freedom.",
    imageUrl: "/staticMocks/mouse-pad-white-front.png",
    alt: "Showcasing the benefits of custom design on everyday items",
  },
  {
    title: "Best Custom",
    description:
      "Explore our top-rated custom products, where quality meets personalized design.",
    imageUrl: "",
    alt: "Highlight of the best custom-designed items",
  },
  {
    title: "Large Custom Mouse Pad",
    description:
      "Enhance your gaming experience with our large custom mouse pads, tailored for comfort and style.",
    imageUrl: "",
    alt: "Spacious and stylish custom mouse pad for gaming",
  },
  {
    title: "AI Product Design",
    description:
      "Futuristic AI product designs that redefine innovation and functionality in everyday items.",
    imageUrl: "",
    alt: "Innovative AI-driven product design showcase",
  },
  {
    title: "Best Custom Mouse Pad",
    description:
      "Discover the finest custom mouse pads, combining ergonomic design with your personal flair.",
    imageUrl: "",
    alt: "Top-rated custom mouse pad with unique design",
  },
  {
    title: "Custom Metal Prints Wall Art",
    description:
      "Transform your walls with our custom metal prints, a perfect blend of durability and artistry.",
    imageUrl: "",
    alt: "Elegant and durable custom metal print for wall decoration",
  },
  {
    title: "AI Print on Demand",
    description:
      "Revolutionary AI print on demand service, offering unmatched customization and quality.",
    imageUrl: "",
    alt: "Advanced AI technology in print on demand services",
  },
  {
    title: "Best Print on Demand Site",
    description:
      "Rated the best print on demand site for our exceptional quality and diverse product range.",
    imageUrl: "",
    alt: "Showcasing the excellence of the best print on demand site",
  },
  {
    title: "Custom Wall Art",
    description:
      "Personalize your space with our custom wall art, tailored to reflect your unique taste and style.",
    imageUrl: "",
    alt: "Unique and personalized custom wall art piece",
  },
  {
    title: "Design your own phone case",
    description:
      "Unleash your creativity by designing your own phone case, a perfect blend of protection and personality.",
    imageUrl: "",
    alt: "Creatively designed custom phone case by a user",
  },
  {
    title: "Design your own mouse pad",
    description:
      "Customize your workspace with a mouse pad designed by you, for both comfort and style.",
    imageUrl: "",
    alt: "User-designed custom mouse pad adding a personal touch to workspaces",
  },
  {
    title: "Metal Prints Custom",
    description:
      "Our custom metal prints offer a modern aesthetic, perfect for both home and office decor.",
    imageUrl: "",
    alt: "Stylish and modern custom metal print",
  },
  {
    title: "large custom metal prints",
    description:
      "Make a bold statement with our large custom metal prints, ideal for making any room stand out.",
    imageUrl: "",
    alt: "Impressive large custom metal print for impactful decor",
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
          className="text-center self-center rounded-lg p-6 shadow-lg"
        >
          <div className="h-[130px] md:hidden"></div>
          <div className="relative flex justify-between">
            <Image
              src={carouselImages[imageIndex].imageUrl}
              alt={carouselImages[imageIndex].alt}
              aria-details={carouselImages[imageIndex].description}
              width={300}
              height={300}
              className="rounded-lg mb-5"
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
              className="rounded-lg hidden mb-5 md:block"
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
