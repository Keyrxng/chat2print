import { motion } from "framer-motion";

const FeaturedProductsGallery = () => {
  return (
    <section className="relative text-center text-accent ">
      <div className="grid relative grid-cols-1 ">
        <motion.h2
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold text-center "
        >
          Where our imagination ends, yours can begin.
        </motion.h2>
      </div>
    </section>
  );
};

export default FeaturedProductsGallery;
