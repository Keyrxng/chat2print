import { motion } from "framer-motion";

const Journey = () => {
  const steps = [
    {
      title: "Craft Your Vision With ChatGPT",
      description:
        "A few simple words with AI and you can create stunning artwork. Our platform allows you to import your ChatGPT art directly from the chat interface using our browser extension or by uploading your design.",
      imageUrl: "/images/craft-your-vision.jpg",
      altText: "Digital artwork creation with ChatGPT",
    },
    {
      title: "AI-Enhanced Artwork For Print",
      description:
        "Leverage our AI Print on Demand technology to refine every detail, guaranteeing a fourfold improvement in quality. Our platform enhances your art to ensure the highest quality for each custom-designed product.",
      imageUrl: "/images/enhance-art-ai.jpg",
      altText: "AI-enhanced artwork for print",
    },
    {
      title: "Design With The Chat2Print Editor",
      description:
        "Our editor simplifies the personalization process, allowing you complete control over your design. Creating mockups is as easy as drag, pinch, pan, and zoom. We handle the rest, from printing to shipping.",
      imageUrl: "/images/chat2print-editor.jpg",
      altText: "Customizing artwork in Chat2Print Editor",
    },
    {
      title: "Detailed Mockups For Preview Perfection",
      description:
        "Our platform generates detailed mockups of your design on a variety of products, allowing you to make adjustments and ensure perfection before ordering. During our early access, our product range is limited to Metal Prints, Posters, Canvas Prints, Phone Cases, Laptop Sleeves, and Mouse Pads, with more to come.",
      imageUrl: "/images/preview-perfection.jpg",
      altText: "Previewing the design on different products",
    },
    {
      title: "Seamless Integration With Printful",
      description:
        "A seamless integration with Printful, a leading print on demand service, allows us to offer a wide variety of high-quality products while ensuring the highest quality printing process and fast, reliable delivery.",
      imageUrl: "/images/printful-partnership.jpg",
      altText: "Printful's high-quality printing process",
    },
    {
      title: "Fast And Reliable Delivery",
      description:
        "Once you're satisfied with your design, submit your order and we'll take care of the rest. Payments are safely and securely processed through Stripe, while our fulfillment partner, Printful, manages the printing and shipping.",
      imageUrl: "/images/delivered-to-doorstep.jpg",
      altText: "Custom art product delivery",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-background to-accent my-8 text-white py-12 md:py-18">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex flex-col space-y-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-accent border border-background rounded-lg p-6 shadow-lg"
            >
              <article className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
                <h3 className="text-xl text-background md:text-2xl font-semibold mb-3">
                  {step.title}
                </h3>
                <p className="text-lg text-background md:text-xl">
                  {step.description}
                </p>
              </article>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <motion.a
            href="/studio"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 * steps.length }}
            className="inline-block bg-background hover:text-background hover:border-background hover:border-2 hover:bg-accent text-accent font-bold py-3 px-6 rounded-lg text-2xl transition duration-300"
          >
            Say less and take my money already!
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default Journey;
