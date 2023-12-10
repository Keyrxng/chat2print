"use client";
import { FeaturesSection } from "@/components/Features";
import { HowItWorksSection } from "@/components/HowItWorks";
import { PricingPlans } from "@/components/Pricing";
import { ProductGallery } from "@/components/ProductGallery";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-scroll";
import SlidingBackground from "@/components/SlidingBackground";

export default function Home() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const ref2 = useRef(null);
  const isInView2 = useInView(ref2, { once: true });

  return (
    <div className="mx-auto">
      <SlidingBackground />

      <div className="grid grid-cols-1 gap-8">
        <div className="justify-evenly gradientBG2 items-start">
          <FeaturesSection />
          <div className="  flex    bottom-10 w-full   justify-center items-center  relative">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: 2,
              }}
            >
              <Link to="about" smooth duration={1000}>
                <div className="w-[35px] h-[64px] rounded-3xl  scale-75 border-4 border-secondary flex justify-center items-start p-2">
                  <motion.div
                    animate={{
                      y: [0, 24, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                    className="w-3 h-3 rounded-full bg-secondary mb-1"
                  />
                </div>
              </Link>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <section className="py-8 rounded-md md:py-16" id="about">
              <h2 className="text-accent text-5xl font-bold text-center mb-6">
                Go from ChatGPT to Print in 3 Easy Steps
              </h2>
            </section>{" "}
            <HowItWorksSection />
            <div ref={ref} />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <PricingPlans />
          <div ref={ref2} />
        </motion.div>

        <ProductGallery />
      </div>
    </div>
  );
}
