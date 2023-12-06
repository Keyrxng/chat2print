"use client"
import { FeaturesSection } from "@/components/Features"
import { HowItWorksSection } from "@/components/HowItWorks"
import { PricingPlans } from "@/components/Pricing"
import { ProductGallery } from "@/components/ProductGallery"
import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Link } from "react-scroll"
export default function Home() {
  const images = [
    "/wfm.webp",
    "/unitornado.webp",
    "/unicorn.webp",
    "/staghead.webp",
    "/smolgaming.webp",
    "/redeagle.webp",
    "/penguinbadge.webp",
    "/musclecar.webp",
    "/mid-00-gaming.webp",
    "/metalspiral.webp",
    "/metaloptical.webp",
    "/kingsloth.webp",
    "/impact.webp",
    "/horsecar.webp",
    "/fantasyart.webp",
    "/darkroads.webp",
    "/cosmicbirds.webp",
    "/c2pdigital.webp",
    "/bullettip.webp",
    "/betty.webp",
    "/badge.webp",
    "/atomdna.webp",
    "/bullettime.webp",
    "/animalcinema.webp",
    "/90-00-gaming.webp",
    "/10-20-gaming.webp",
    "/00-10-gaming.webp",
    "/00-10-gaming-retro.webp",
  ]
  const [currentX, setCurrentX] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const ref2 = useRef(null)
  const isInView2 = useInView(ref2, { once: true })

  const translateSliderX = (index: any) => {
    const translateY = "rotateY(9deg) scale(0.6)"
    const translateX = `translateX(${index * currentX}px)`
    return `${translateY} ${translateX}`
  }

  const SlidingBackground = () => {
    const imageRows = [images]
    const returnRows = () => {
      return imageRows.map(row => {
        const randomImages = []
        for (let i = 0; i < images.length; i++) {
          const randomIndex = Math.floor(Math.random() * row.length) + 1
          randomImages.push(row[randomIndex])
        }
        const set = new Set(randomImages)
        const arr = Array.from(set)
        return arr
      })
    }

    return (
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.5,
        }}
        style={{ position: "relative" }}
      >
        <div id="sliding-background">
          {returnRows().map((row, index) => (
            <div key={index} className="grid grid-flow-row py-8">
              <div className="image-row">
                {row.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`shadow-md rounded-lg overflow-hidden m-2`}
                    style={{
                      backgroundImage: `url(${imageUrl})`,
                      transform: translateSliderX(index),
                      animation: "slide 25s infinite linear reverse",
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      width: "250px",
                      height: "250px",
                    }}
                  >
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <h3 className="text-white text-xl font-bold">
                        {index + 1}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>

              {returnRows().map((row, index) => (
                <div key={index} className="image-row">
                  {row.map((imageUrl, index) => (
                    <div
                      key={index}
                      className={`shadow-md rounded-lg overflow-hidden m-2`}
                      style={{
                        backgroundImage: `url(${imageUrl})`,
                        transform: translateSliderX(index),
                        animation: "slide 20s infinite linear reverse",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        width: "250px",
                        height: "250px",
                      }}
                    >
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <h3 className="text-white text-xl font-bold">
                          {index + 1}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {returnRows().map((row, index) => (
                <div key={index} className="image-row">
                  {row.map((imageUrl, index) => (
                    <div
                      key={index}
                      className={`shadow-md rounded-lg overflow-hidden m-2`}
                      style={{
                        backgroundImage: `url(${imageUrl})`,
                        transform: translateSliderX(index),
                        animation: "slide 20s infinite linear reverse",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        width: "250px",
                        height: "250px",
                      }}
                    >
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <h3 className="text-white text-xl font-bold">
                          {index + 1}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {returnRows().map((row, index) => (
                <div key={index} className="image-row">
                  {row.map((imageUrl, index) => (
                    <div
                      key={index}
                      className={`shadow-md rounded-lg overflow-hidden m-2`}
                      style={{
                        backgroundImage: `url(${imageUrl})`,
                        transform: translateSliderX(index),
                        animation: "slide 20s infinite linear reverse",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        width: "250px",
                        height: "250px",
                      }}
                    >
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <h3 className="text-white text-xl font-bold">
                          {index + 1}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {returnRows().map((row, index) => (
                <div key={index} className="image-row">
                  {row.map((imageUrl, index) => (
                    <div
                      key={index}
                      className={`shadow-md rounded-lg overflow-hidden m-2`}
                      style={{
                        backgroundImage: `url(${imageUrl})`,
                        transform: translateSliderX(index),
                        animation: "slide 20s infinite linear reverse",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        width: "250px",
                        height: "250px",
                      }}
                    >
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <h3 className="text-white text-xl font-bold">
                          {index + 1}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
        <section className="text-center md:py-24">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.5,
            }}
          >
            <h1 className="text-4xl text-accent md:text-6xl font-bold  mb-4">
              Chat2Print
            </h1>
            <p className="text-xl text-white md:text-2xl  mb-8">
              Transform your ChatGPT art into physical products.
            </p>
            <a
              href="/download"
              className="bg-background text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-accent hover:text-background  transition duration-300"
            >
              Download Extension
            </a>
          </motion.div>
        </section>
      </motion.div>
    )
  }

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

        <ProductGallery images={images} />
      </div>
    </div>
  )
}
