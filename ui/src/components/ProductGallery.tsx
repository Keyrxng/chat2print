"use client"
import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"

export const ProductGallery = ({ images }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <section id="product-gallery" className="py-12 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" ref={ref}>
          {images.map((image, index) => (
            <div key={index} className="gallery-item p-4">
              <div className="image-wrapper overflow-hidden rounded shadow">
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-auto"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  )
}
