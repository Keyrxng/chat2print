"use client";
import { FeaturesSection } from "@/components/Features";
import { HowItWorksSection } from "@/components/HowItWorks";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SlidingBackground from "@/components/SlidingBackground";
import { Link } from "react-scroll";
import Journey from "@/components/Journey";
import FeaturedProductsGallery from "@/components/FeaturedProduct";
import { ProductsDisplay } from "@/components/ProductsDisplay";

export default function Home() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const ref2 = useRef(null);
  const isInView2 = useInView(ref2, { once: true });

  return (
    <div className="mx-auto">
      <div className="grid grid-cols-1 gap-8">
        <SlidingBackground />
        <div className="justify-evenly gradientBG2 items-start">
          <FeaturesSection />
          <div className="flex bottom-2 w-full justify-center items-center relative">
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
            initial={{ opacity: 0, y: 0 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <section className="py-2 rounded-md md:py-">
              <h2 className="text-accent text-5xl font-bold text-center mb-6">
                Prompt to Print in 3 Steps
              </h2>
            </section>{" "}
            <HowItWorksSection />
            <div ref={ref} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={isInView2 ? { opacity: 1, y: 0 } : { opacity: 0, y: -60 }}
          transition={{ duration: 0.5 }}
          className="-z-100"
        >
          <ProductsDisplay />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={isInView2 ? { opacity: 1, y: 0 } : { opacity: 0, y: -60 }}
          transition={{ duration: 0.5 }}
          className="-z-100"
        >
          <div>
            <FeaturedProductsGallery />
          </div>

          {/* <Tiers /> */}
          <div ref={ref2} />
        </motion.div>
        <br />
        <Journey />

        {/* https://billing.stripe.com/p/login/test_9AQ7uUejW4eM288288 */}
        {/* <script async src="https://js.stripe.com/v3/pricing-table.js"></script> */}
        {/* @ts-ignore */}
        {/* <stripe-pricing-table
          pricing-table-id="prctbl_1OPBJXJ8INwD5Vuc0dwAI2DR"
          publishable-key="pk_test_51OIcuCJ8INwD5VucXOT3hww245XJiYrEpbnw3jHf0jboTJhrMix1TH4jf3oqGR4uChV4TyoH2iSL284KOFbAxTJJ00MDub5FdJ"
        /> */}
      </div>
    </div>
  );
}
