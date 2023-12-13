import { motion } from "framer-motion";

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

export default function SlidingBackground() {
  const translateSliderX = (index: any) => {
    const translateY = "rotateY(9deg) scale(0.6)";
    const translateX = `translateX(${index}px)`;
    return `${translateY} ${translateX}`;
  };

  const returnRows = () => {
    return [images].map((row) => {
      const randomImages = [];
      for (let i = 0; i < images.length; i++) {
        const randomIndex =
          Math.floor(Math.random() * row!.length) % row!.length;
        randomImages.push(row![randomIndex]);
      }
      const set = new Set(randomImages);
      const arr = Array.from(set);

      arr.filter((image) => image !== undefined && image !== null);
      return arr;
    });
  };

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
                  {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <h3 className="text-white text-xl font-bold">
                      {index + 1}
                    </h3>
                  </div> */}
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
                    {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <h3 className="text-white text-xl font-bold">
                        {index + 1}
                      </h3>
                    </div> */}
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
                    {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <h3 className="text-white text-xl font-bold">
                        {index + 1}
                      </h3>
                    </div> */}
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
                    {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <h3 className="text-white text-xl font-bold">
                        {index + 1}
                      </h3>
                    </div> */}
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
                    {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <h3 className="text-white text-xl font-bold">
                        {index + 1}
                      </h3>
                    </div> */}
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
          <div className="relative inline-block mb-4">
            <h1 className="text-4xl text-accent md:text-6xl font-bold">
              Chat2Print
            </h1>
            <span className="absolute top-0 -right-3 md:-right-6 bg-red-600 text-white text-xs md:text-sm px-2 py-1 rounded-full transform translate-x-1/2 -translate-y-1/2">
              <a href="/#about">Beta</a>
            </span>
          </div>
          <p className="text-xl text-white md:text-2xl  mb-8">
            Transform your ChatGPT art into physical products.
          </p>
          <a
            href="/#about"
            className="bg-background text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-accent hover:text-background  transition duration-300"
          >
            Download Extension
          </a>
        </motion.div>
      </section>
    </motion.div>
  );
}
