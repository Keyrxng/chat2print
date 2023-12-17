"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { staticImages } from "@/data/statics";

export function ProductGallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <section id="" className="ml-12">
        <div className="grid grid-cols-2 gap-4 m-12 md:grid-cols-5" ref={ref}>
          {staticImages.map(({ image_url, alt }, index) => (
            <div
              key={index}
              className={`shadow-md rounded-lg overflow-hidden m-2`}
            >
              <Image src={`/${image_url}`} alt={alt} width={250} height={250} />
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
