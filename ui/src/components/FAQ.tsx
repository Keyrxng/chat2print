import { formatTextToHTML } from "@/utils/formatToHtml";
import { motion } from "framer-motion";
import { useState } from "react";

const faqs = [
  {
    question: "What is Chat2Print?",
    answer:
      "Chat2Print, founded in Q4 of 2023, is a pioneering print-on-demand service, seamlessly integrating with ChatGPT to transform AI-generated art into printed masterpieces. Our browser extension streamlines the process from digital to physical, offering a swift journey from prompt to print.",
  },
  {
    question: "What does 'early release' mean for Chat2Print?",
    answer:
      "Our 'early release' status means active refinement and growth. During this phase products are offered at a reduced cost, with a limited selection. User account storage is also very limited with a < 500MB cap which may be reduced at any time until release. We are keenly seeking your input to enhance our services before then.",
  },
  {
    question: "Are products free during early release?",
    answer:
      "Products are offered at a reduced cost but are not free. You will pay only for product production and shipping (if applicable) while we covering the cost of storage and processing.",
  },
  {
    question: "How do I get started with Chat2Print?",
    answer:
      "Getting started is simple: sign up, upload your ChatGPT art, and let our intuitive studio guide you through the creative process. Currently, manual uploads are required, with extension functionality coming soon.",
  },
  {
    question: "What distinguishes AI Enhance from AI Upscale?",
    answer:
      "AI Enhance meticulously refines your art's quality, while AI Upscale amplifies the resolution, both ensuring your design's print excellence. We combine these into a single step for your convenience.",
  },
  {
    question: "What's the difference between a design and a product?",
    answer:
      "A design is your artistic blueprint, while a product is the design's physical manifestation. Visit our studio to bring your designs to life.",
  },
  {
    question: "How will the Chat2Print extension work?",
    answer:
      "Our upcoming extension will add a direct upload button to the ChatGPT UI, facilitating effortless art transfers to your Chat2Print account.",
  },
  {
    question: "Can you explain how the studio functions?",
    answer:
      "The studio offers a suite of tools for you to fine-tune your design on products, featuring drag-and-zoom capabilities. Before enhancement your design is displayed in low resolution due to the way ChatGPT generates art. After enhancement, your design is displayed in high resolution, ready for printing.",
  },
  {
    question: "Which products can I create with Chat2Print?",
    answer:
      "During early release, we offer a curated selection including Metal Prints, Posters, Framed Canvas and more. A broader range is on the horizon, ultimately shaped by our customer's needs and preferences, so please share your feedback with us.",
  },
  {
    question: "How do I place an order?",
    answer:
      "Once you've completed your design, you can place an order directly from the studio while viewing your mockup.",
  },
  {
    question: "How long will it take to receive my order?",
    answer:
      "Production and shipping times vary by product and location. You can view estimated delivery times during checkout. We'll also send you a confirmation email with tracking information once your order ships.",
  },
  {
    question: "What upcoming features can I expect?",
    answer: formatTextToHTML(
      "We're working on a variety of exciting features, including: • Chat2Print's Custom LLM, trained specifically on creating POD designs. • Possible integrations with popular print on demand marketplaces • With many more ideas in the pipeline!"
    ),
  },
];

export const FaqSection = ({ id }: { id: string }) => {
  const faqStates = () => faqs.map((faq) => false);
  const [openFaqs, setOpenFaqs] = useState(faqStates());

  const toggleFaq = (index: any) => {
    setOpenFaqs((currentOpenFaqs) =>
      currentOpenFaqs.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  };
  // <section className="bg-gradient-to-b from-background to-accent text-white py-12 md:py-18">

  return (
    <div id={id} className="gradientBG rounded-lg">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div>
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl text-accent font-bold mb-6"
            >
              Frequently Asked Questions
            </motion.h2>
            <p className="mt-4 text-lg text-gray-300">
              Can’t find the answer you’re looking for? Reach out to us{" "}
              <a
                href="mailto:support@chat2print.xyz"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                here
              </a>
              .
            </p>
          </div>
          <div className="mt-2 lg:mt-0 lg:col-span-2">
            <dl className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={faq.question}
                  onClick={() => toggleFaq(index)}
                  className="cursor-pointer w-full border border-gray-700 rounded-lg shadow-lg p-6"
                >
                  <dt className="text-lg leading-6 font-medium text-accent">
                    {faq.question}
                  </dt>
                  {openFaqs[index] && (
                    <dd
                      className="mt-2 text-base text-gray-300"
                      aria-expanded={openFaqs[index]}
                    >
                      {faq.answer}
                    </dd>
                  )}
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};
