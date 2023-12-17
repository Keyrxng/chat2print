import { useState } from "react";

const faqs = [
  {
    question: "What is Chat2Print?",
    answer: `Chat2Print is a generative art print-on-demand service. We provide the convenience of direct integration with ChatGPT, allowing you to upload your art directly from the ChatGPT UI, have the image enhanced to ensure the highest quality print, and have mockups generated from prompt to print in less than 2 minutes.`,
  },
  {
    question: "What does it mean to be in beta?",
    answer: `Being in beta means we are currently refining our service and are not charging for our services; all costs are covered out of pocket. Although we are limited in terms of storage space and other resources, we are offering our services to the public and welcome any feedback you can provide.`,
  },
  {
    question: "So products are free?",
    answer: `No, products are not free but they are priced at cost, meaning we do not profit from their sale while in beta. We cover all associated costs, such as hosting, storage, third-party APIs, and image enhancement.`,
  },
  {
    question: "How do I get started?",
    answer: `To get started, sign up for an account. Once registered, you can upload your ChatGPT art, design your product, view mockups, and have it printed on a variety of items. Manual upload is required until the extension is released.`,
  },
  {
    question: "What is the difference between AI Enhance and AI Upscale?",
    answer: `AI Enhance improves the quality of your image by reducing noise, sharpening details, and correcting colors. AI Upscale increases your image's resolution. These combined ensure that your design is printed in the highest quality possible.`,
  },
  {
    question: "What is the difference between a design and a product?",
    answer: `A design is an image you upload to Chat2Print. A product is a tangible item that features your design, which you can purchase. Visit the studio to upload your design and create your product.`,
  },
  {
    question: "How does the extension work?",
    answer: `Once available, you can install the extension to upload your ChatGPT-generated art into your Chat2Print account directly from the official ChatGPT UI. The extension adds a convenient upload button under each new image.`,
  },
  {
    question: "How does the studio work?",
    answer: `The studio enables you to adjust your design on the product with drag, pinch, pan, and zoom functions. We utilize advanced image processing technology to ensure your design is printed in the highest quality.`,
  },
  {
    question: "What products do you offer?",
    answer: `During our beta phase, we offer a limited selection of popular products from our print-on-demand partner, Printful. These include Metal Prints, Posters, Canvas Prints, Phone Cases, Laptop Sleeves, Mouse Pads, and various types of Stickers.`,
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
            <h2 className="text-3xl font-extrabold text-accent">
              Frequently asked questions
            </h2>
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
