"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { carouselImages } from "@/data/statics";
import { Button } from "./ui/button";

export function ProductsDisplay() {
  const [[page, direction], setPage] = useState([0, 0]);
  const intervalRef = useRef();

  const [activeProd, setActiveProd] = useState<{
    title: string;
    description: string;
    image_url: string;
    alt: string;
  } | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      paginate(1);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(intervalRef.current);
  }, [page]);

  const paginate = (newDirection) => {
    let newPage = page + newDirection;
    if (newPage >= carouselImages.length) {
      newPage = 0;
    } else if (newPage < 0) {
      newPage = carouselImages.length - 1;
    }
    setPage([newPage, newDirection]);
    setActiveProd(carouselImages[newPage]);
  };

  return (
    <div className="space-y-8 overflow-x-hidden gap-4">
      <h2 className="text-accent text-5xl font-bold text-center">
        Imagine the Impossible, Print the Reality
      </h2>

      <div className="flex flex-col justify-center gap-4 items-center">
        <div
          key={activeProd?.title}
          className="flex flex-col sm:flex-row w-full h-full justify-center items-center rounded-lg p-2 m-2 transition-all duration-300"
          about="Close Product Display"
        >
          <Button
            className="text-accent font-bold"
            onClick={() => paginate(-1)}
          >
            &#8592;
          </Button>
          <Image
            priority={true}
            src={activeProd?.image_url}
            width={450}
            height={450}
            alt={activeProd?.alt}
            className="rounded-lg"
          />
          <Button className="text-accent font-bold" onClick={() => paginate(1)}>
            &#8594;
          </Button>
        </div>
      </div>
    </div>
  );
}
