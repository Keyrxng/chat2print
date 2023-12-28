import { motion } from "framer-motion";

const Journey = () => {
  const steps = [
    {
      title: "Words With AI",
      description:
        "A few simple words with AI and you can create stunning artwork. Our platform allows you to import your ChatGPT art directly from the chat interface using our browser extension or by uploading your design.",
      imageUrl: "/images/craft-your-vision.jpg",
      altText: "Digital artwork creation with ChatGPT",
    },
    {
      title: "AI Print On Demand",
      description:
        "Leverage our AI Print on Demand technology to refine every detail, guaranteeing a fourfold improvement in print quality. Our platform enhances your art to ensure the highest quality for each custom-designed product.",
      imageUrl: "/images/enhance-art-ai.jpg",
      altText: "AI-enhanced artwork for print",
    },
    {
      title: "Ease Of Use",
      description:
        "Our editor simplifies the personalization process, allowing you complete control over your design. Creating mockups is as easy as drag, pinch, pan, and zoom.",
      imageUrl: "/images/chat2print-editor.jpg",
      altText: "Customizing artwork in Chat2Print Editor",
    },
    {
      title: "Mockups For Perfection",
      description:
        "Our platform generates detailed mockups of your design on a variety of products, allowing you to make adjustments and ensure perfection before ordering. We will continue to expand the product line on a per request basis.",
      imageUrl: "/images/preview-perfection.jpg",
      altText: "Previewing the design on different products",
    },
    {
      title: "Fast And Reliable Delivery",
      description:
        "Once you're satisfied with your design, submit your order and we'll take care of the rest. Payments are safely and securely processed through Stripe, while our best-in-class print-on-demand partner, manages the printing and shipping.",
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
              key={step.title}
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
            className="mb-4 inline-block bg-background hover:text-background hover:border-background hover:border-2 hover:bg-accent text-accent font-bold py-3 px-6 rounded-lg text-2xl transition duration-300"
          >
            Start Creating
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default Journey;
