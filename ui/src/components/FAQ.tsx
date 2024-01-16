import { motion } from "framer-motion";
import { useState } from "react";

const faqs = [
  {
    question: "What is Chat2Print?",
    answer:
      "Chat2Print, founded in December of 2023, is a pioneering print-on-demand service, seamlessly integrating with ChatGPT to transform AI-generated art into printed masterpieces. Our browser extension streamlines the process from digital to physical, offering a swift journey from prompt to print.",
  },
  {
    question: "What does 'early access' mean for Chat2Print?",
    answer:
      "Our 'early access' status means active refinement and growth. During this phase we are keenly seeking your input to enhance our services.",
  },
  {
    question: "How do I get started with Chat2Print?",
    answer:
      "Getting started is simple: sign up, import or upload your ChatGPT art, and let our intuitive studio guide you through the creative process. Once you're satisfied with your design, you can place an order directly from the studio.",
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
      "Our upcoming browser extension will add a direct upload button to the ChatGPT UI, facilitating effortless art transfers to your Chat2Print account.",
  },
  {
    question: "Can you explain how the studio functions?",
    answer:
      "The studio offers an 'AI-assist' feature that optimizes your design for placement and final print quality. Before enhancement your design would likely be in the range of 60 - 140 DPI, which would result in poor print quality. Our AI-enhance feature will increases the DPI to achieve a minimum of 270 up to the maximum of 300. This ensures your design is print-ready, and will look great on any product you choose.",
  },
  {
    question: "Which products can I create with Chat2Print?",
    answer:
      "Initially we will be offering only phone cases for the most popular iPhone and Samsung devices although more products may be added in the near future.",
  },
  {
    question: "How do I place an order?",
    answer:
      "Once you've completed your design and generated a mockup, you can place an order directly from the mockup preview screen.",
  },
  {
    question: "How long will it take to receive my order?",
    answer:
      "Production and shipping times vary by product and location. You can view estimated delivery times during checkout. We'll also send you a confirmation email with tracking information once your order ships.",
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

  return (
    <div id={id} className="gradientBG max-w-7xl rounded-lg">
      <div className="py-6 px-4 mx-4">
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
                      <p>{faq.answer}</p>
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
