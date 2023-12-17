"use client";
import { FeaturesSection } from "@/components/Features";
import { HowItWorksSection } from "@/components/HowItWorks";
import { ProductGallery } from "@/components/ProductGallery";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SlidingBackground from "@/components/SlidingBackground";
import { Button } from "@/components/ui/button";
import { Link } from "react-scroll";
import { FaqSection } from "@/components/FAQ";
import Journey from "@/components/Journey";
import FeaturedProductsGallery from "@/components/FeaturedProduct";

export default function Home() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const ref2 = useRef(null);
  const isInView2 = useInView(ref2, { once: true });

  const Tiers = () => {
    const paymentTierOpts = [
      {
        name: "Basic",
        price: 5.99,
        features: [
          { label: "Storage:", value: "10 designs (p/w)" },
          { label: "Storage Limit:", value: "1GB (p/m)" },
          { label: "AI Enhance & Upscale:", value: "5 (p/d)" },
          { label: "Mockup Generation:", value: "2 (p/d)" },
          { label: "Basic Support", value: "" },
        ],
        isPopular: false,
      },
      {
        name: "Pro",
        price: 19.99,
        features: [
          { label: "Storage:", value: "500 designs (p/w)" },
          { label: "Storage Limit:", value: "5GB (p/m)" },
          { label: "AI Enhance & Upscale:", value: "250 (p/d)" },
          { label: "Mockup Generation:", value: "250 (p/d)" },
          { label: "Priority Support", value: "" },
          { label: "Product Requests", value: "" },
          { label: "New feature Early-Access", value: "" },
        ],
        isPopular: true,
      },
      {
        name: "Business",
        price: 50,
        features: [
          { label: "Storage:", value: "2500 designs (p/w)" },
          { label: "Storage Limit:", value: "50GB (p/m)" },
          { label: "AI Enhance & Upscale:", value: "1250 (p/d)" },
          { label: "Mockup Generation:", value: "1250 (p/d)" },
          { label: "Priority Support", value: "" },
          { label: "Product Requests", value: "" },
          { label: "New feature Early-Access", value: "" },
        ],
        isPopular: false,
      },
    ];

    return (
      <div className="text-accent opacity-90 bg-background rounded-md overflow-ellipsis mb-2 w-full flex-wrap">
        <div className="grid md:grid-cols-3 justify-between mx-auto gap-4 p-4">
          {paymentTierOpts.map((tier) => (
            <div
              key={tier.name}
              className="flex flex-col justify-between p-4 rounded-md "
            >
              <div className="flex flex-col items-center">
                <h3 className="text-3xl font-bold">{tier.name}</h3>
                <h4 className="text-xl font-bold">${tier.price}</h4>
                <p className="text-sm text-center">Per Month</p>
              </div>
              <div className="flex flex-col items-center">
                {tier.isPopular && (
                  <div className="text-xs font-bold bg-accent text-background p-1 rounded-md">
                    Popular
                  </div>
                )}
                <Button
                  className="mt-4"
                  onClick={() => {
                    window.location.href = "/";
                  }}
                >
                  Select
                </Button>
              </div>
              <div className="flex flex-col items-center">
                {tier.features.map((feature) => (
                  <div
                    key={feature.value}
                    className="flex justify-between w-full"
                  >
                    <p className="text-lg">{feature.label}</p>
                    <p className="text-lg">{feature.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
          <FeaturedProductsGallery />

          {/* <Tiers /> */}
          <div ref={ref2} />
          {/* <ProductGallery /> */}
          {/* <FaqSection id="about" /> */}
        </motion.div>
        <Journey />
      </div>
    </div>
  );
}
