"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

export const ProductGallery = ({ images }: { images: string[] }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <section id="product-gallery" className="py-12 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" ref={ref}>
          {images.map((image: string, index: number) => (
            <div key={index} className="gallery-item p-4">
              <div className="image-wrapper overflow-hidden rounded shadow">
                <Image
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-auto"
                  width={500}
                  height={500}
                  style={{
                    maxWidth: "100%",
                    height: "auto"
                  }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};
