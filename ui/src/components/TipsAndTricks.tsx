import React, { useState } from "react";

const tipsAndTricks = [
  {
    title: "Essential Pre-Start Information",
    content: "",
    subsections: [
      {
        title: "Design Storage Tips",
        detail:
          "Your custom designs and upscaled images are securely stored on our servers. To manage your storage capacity, feel free to delete old designs and make room for new creations.",
      },
      {
        title: "Future of Image Upscaling",
        detail:
          "Image upscaling is currently complimentary during our early access phase; however, this will evolve into a premium feature in the future.",
      },
      {
        title: "Mockup Availability",
        detail:
          "Please note that during the early access period, mockups will be automatically deleted after 72 hours to optimize server efficiency.",
      },
    ],
  },
  {
    title: "Mastering the Editor",
    content: "",
    subsections: [
      {
        title: "Understanding Output Sizes",
        detail:
          "ChatGPT generates images in three sizes: Square (1024x1024, default), Landscape (1792x1024), and Portrait (1024x1792). Despite appearing small in the editor for ease of positioning, the overlay image maintains full size.",
      },
      {
        title: "Optimize with Dimension Controls",
        detail:
          "It's advisable to utilize the 'Width' and 'Height' controls for initial image sizing according to the print area, using zoom sparingly for fine-tuning. We suggest keeping scaling under 130% to maintain quality.",
      },
      {
        title: "Familiarizing Yourself",
        detail:
          "The user-friendly interface may require some practice to perfect. We recommend starting with basic placements and progressing to more intricate designs. See the 'Tips for Custom Designs' section below for further guidance.",
      },
    ],
  },
  {
    title: "Understanding Image Upscaling",
    content: "",
    subsections: [
      {
        title: "Advanced AI Upscaling",
        detail:
          "We utilize best-in-class AI to upscale your images with precision, enhancing size without compromising quality. Enjoy this feature for free during early access.",
      },
      {
        title: "Daily Upscaling Cap",
        detail:
          "Take advantage of upscaling up to 5 images daily during our early access. Future updates will provide more options.",
      },
      {
        title: "Maximizing Upscaling Quality",
        detail:
          "The final quality post-upscaling is proportional to the original image size. Post-enhancement, images are available in high-resolution formats: Square (4096x4096), Landscape (7168x4096), Portrait (4096x7168).",
      },
    ],
  },
  {
    title: "Addressing Current Limitations",
    content: "",
    subsections: [
      {
        title: "Optimal Order for Image Upscaling",
        detail:
          "For landscape and portrait formats, upscale your image prior to making adjustments to fit within the optimal dimensions for enhancement. Altering the size first may exceed the maximum allowable dimensions for upscaling during early access.",
      },
      {
        title: "Managing Mockup Generation Traffic",
        detail:
          "Currently, we maintain a two-per-minute mockup generation limit shared amongst all users. Depending on the current user traffic, you may experience a short wait for your mockup. We are working to increase this capacity soon.",
      },
    ],
  },
  {
    title: "Creative Tips for Custom Designs",
    content: "",
    subsections: [
      {
        title: "Achieving Perfect Design Placement",
        detail:
          "If exact print area alignment is challenging, try starting with a larger design and reducing its size after previewing the mockup. If the initial mockup doesn't meet your expectations, simply readjust and regenerate.",
      },
      {
        title: "Optimizing Design Quality",
        detail:
          "For superior print quality, opt for high-resolution PNG images with transparent backgrounds. This ensures crisp, clear designs unless the background is a deliberate part of your creative vision or blends seamlessly with the product's color.",
      },
      {
        title: "Tailoring Designs for Custom Products",
        detail:
          "Start by identifying the shape of the product to tailor your design accordingly, specifying the desired orientation in your prompt. Include a 'no borders' request to maintain a clean aesthetic, as borders are usually unnecessary. Designs with excessive text can become cluttered, so aim for simplicity for better legibility. Consider requesting a 'transparent background' if you prefer a seamless integration with the product. Above all, let your creativity flow, enjoy the process, and craft a design that's worth sharing!",
      },
    ],
  },
];

export const TipsAndTricksModal = ({ isOpen, onClose }) => {
  const [openSections, setOpenSections] = useState(
    tipsAndTricks.map(() => false)
  );

  const toggleSection = (index) => {
    setOpenSections((current) =>
      current.map((open, i) => (i === index ? !open : open))
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <style>
        {`
          .overflow-y-scroll::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div className="fixed z-50 inset-0 overflow-y-scroll bg-black bg-opacity-50 flex justify-center items-center p-4">
        <div className="bg-background overflow-y-scroll rounded-lg shadow-2xl p-6 w-full max-w-4xl">
          <div>
            <button
              onClick={onClose}
              className="relative text-gray-600 hover:text-gray-900 top-0 right-4 text-2xl"
            >
              &times;
            </button>
            {tipsAndTricks.map((tip, index) => (
              <div key={tip.title} className="border-b border-gray-200 py-4">
                <h3
                  onClick={() => toggleSection(index)}
                  className="text-lg font-semibold cursor-pointer"
                >
                  {tip.title}
                </h3>
                {openSections[index] && (
                  <div className="mt-2 space-y-2">
                    {tip.content}
                    {tip.subsections &&
                      tip.subsections.map((sub, subIndex) => (
                        <div key={sub.title} className="pl-4">
                          <h4 className="font-medium ">{sub.title}</h4>
                          <p className="text-sm text-white">{sub.detail}</p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
