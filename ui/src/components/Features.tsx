"use client";
import Image from "next/image";
import { motion } from "framer-motion";
export const FeaturesSection = () => {
  const features = [
    {
      title: "Highest Quality Prints",
      description: "We use the highest quality materials for our prints.",
      icon: "/prints.png",
    },
    {
      title: "Fast Shipping",
      description: "Reliable fulfillment and shipping options worldwide.",
      icon: "/shipping.png",
    },
    {
      title: "Easy to Use",
      description: "Import designs from ChatGPT with just a few clicks.",
      icon: "/easyToUse.png",
    },
  ];

  return (
    <section id="features" className="py-12 md:py-18 rounded-md ">
      <div className="max-w-[100rem] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: 1.0,
              }}
            >
              <article className="flex flex-col items-center">
                <div className="feature-card text-center py-8 px-8 bg-background rounded-lg transition-shadow hover:shadow-md hover:border-[1px] border-[1px] hover:border-accent border-background hover:shadow-accent">
                  <Image
                    priority
                    src={feature.icon}
                    width={80}
                    height={80}
                    alt={feature.title}
                    className="mx-auto"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                  <h3 className="text-xl text-accent font-semibold mt-5 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white text-xl">{feature.description}</p>
                </div>
              </article>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
