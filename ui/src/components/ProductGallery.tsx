"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const images = [
  "00-10-gaming-retro.webp",
  "00-10-gaming.webp",
  "10-20-gaming.webp",
  "90-00-gaming.webp",
  "alienanotomy.webp",
  "animalcinema.webp",
  "animedragon.webp",
  "atomdna.webp",
  "badge.webp",
  "betty.webp",
  "bullettime.webp",
  "bullettip.webp",
  "c2pdigital.webp",
  "c2pLogo.svg",
  "carrier.webp",
  "catcrown.webp",
  "cosmicbirds.webp",
  "crackedglass.webp",
  "darkroads.webp",
  "fantasyart.webp",
  "felineeye.webp",
  "ferce.webp",
  "futurebuilding.webp",
  "greenartifact.webp",
  "horsecar.webp",
  "impact.webp",
  "kilted.webp",
  "kingsloth.webp",
  "lll.webp",
  "mechfight.webp",
  "metaloptical.webp",
  "metalspiral.webp",
  "mid-00-gaming.webp",
  "mosaictimeline.webp",
  "musclecar.webp",
  "neutron.webp",
  "nightmusic.webp",
  "penguinbadge.webp",
  "psychadelic.webp",
  "redeagle.webp",
  "revolverblueprint.webp",
  "rifleblueprint.webp",
  "roboheart.webp",
  "robotbiker.webp",
  "smolgaming.webp",
  "spiderweb.webp",
  "staghead.webp",
  "timeline.webp",
  "timeline2.webp",
  "unicorn.webp",
  "unitornado.webp",
  "wfm.webp",
];

export function ProductGallery() {
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
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className={`shadow-md rounded-lg overflow-hidden m-2`}
            >
              <Image
                src={`/${imageUrl}`}
                alt="product"
                width={250}
                height={250}
              />
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
