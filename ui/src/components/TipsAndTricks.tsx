import React, { useState } from "react";

const tipsAndTricks = [
  {
    title: "Essential Pre-Start Information",
    content: "",
    subsections: [
      {
        title: "Results and Quality",
        detail:
          "The best quality prints are achieved with a DPI of 300, anything more does not improve the quality of the print. We guarantee print quality 173% higher than industry minimums, achieving a minimum of 270 DPI (dots per inch), with an average of 290 DPI.",
      },
      {
        title: "Basic Usage",
        detail:
          "Select a product, upload a design, and generate a mockup. The mockup will be saved to your account to view and/or purchase later. Premium users will have the upscaled image saved to their account as well.",
      },
      {
        title: "Ai-Assist",
        detail:
          "Ai-Assist, automatically positioning and scaling your design, is enabled by default. You can disable it for full control over placement and dimensions, although manual adjustment is not recommended. With an average of 290 DPI (dots per inch), Ai-Assist ensures optimal print quality. We recommend keeping Ai-Assist enabled for the best results.",
      },
      {
        title: "Limitation Overview",
        detail:
          "There are currently limitations placed on mockup generation rate limits and image upscaling daily usage limits. We are working to expand these limits as we grow.",
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
          "ChatGPT generates images in three sizes: Square (1024x1024), Landscape (1792x1024), and Portrait (1024x1792), with the default being Square. Although the overlay image appears small in the editor, it maintains its full size for ease of use.",
      },
      {
        title: "Customizing Your Design",
        detail:
          "For optimal results, keep 'Ai-Assist' enabled. This feature automatically optimizes your design's placement and dimensions for the product's print area. This means you can select an image and generate a mockup without any additional adjustments.",
      },
      {
        title: "Familiarizing Yourself",
        detail:
          "Through the extension you can import images straight from the ChatGPT interface or you can use the built-in AI Image Generator. This will require either a premium account or an OpenAI API key or you can upload you own images.",
      },
    ],
  },
  {
    title: "Image Upscaling",
    content: "",
    subsections: [
      {
        title: "Advanced AI Upscaling",
        detail:
          "With best-in-class trained LLM's we upscale your images to enhance resolution without sacrificing quality. We do this to achieve a minimum print quality 173% higher than industry standards.",
      },
      {
        title: "Daily Upscaling Cap",
        detail:
          "Early access users can upscale up to 10 images per day. We recommend focusing on designs that you are most eager to see brought to life.",
      },
      {
        title: "Maximizing Upscaling Quality",
        detail:
          "Opt for a transparent background whenever possible, unless it is an integral part of your design. ",
      },
    ],
  },
  {
    title: "Product Mockups",
    content: "",
    subsections: [
      {
        title: "Rate Limiting",
        detail:
          "Mockup generation is currently limited to 2 per minute to ensure equitable access for our rapidly growing user base. We apologize for any inconvenience and are actively working to increase this capacity.",
      },
      {
        title: "Quality Limitations",
        detail:
          "Generated mockups are of lower resolution compared to the final product, ensuring a fast and efficient generation process. Rest assured, the final product will be of significantly higher quality.",
      },
      {
        title: "Why is the Mockup 'Low Quality'?",
        detail:
          "Print quality is determined by DPI (dots per inch), not by pixels, which are visible on your screen. Generating mockups at the same resolution as the final product would significantly slow down the process and be resource-intensive. Instead, we generate a lower-resolution mockup that accurately represents placement and size, closely mirroring the print quality. The final product will reflect the high print quality, not the preview quality.",
      },
    ],
  },
  {
    title: "Current Limitations",
    content: "",
    subsections: [
      {
        title: "Mockups Per Minute",
        detail: "Mockup generation is currently limited to 2 per minute.",
      },
      {
        title: "Image Upscaling Per Day",
        detail: "Image upscaling is currently limited to 10 per day.",
      },
      {
        title: "Image Upscaling Quality",
        detail:
          "A ceiling has been placed on the achievable quality level through upscaling.",
      },
    ],
  },
  {
    title: "Tips for Custom Designs",
    content: "",
    subsections: [
      {
        title: "AI Custom Products",
        detail:
          "Pay attention to template areas likely to be removed during printing, such as the camera hole or edges. Avoid placing key design elements in these areas for the best results.",
      },
      {
        title: "Prompt Tips for Beginners",
        detail:
          "Begin by identifying the product shape and specifying your desired orientation (portrait producing the best results for all phone case sizes). We've found borders to be harder to work with, so we recommend explicitly avoiding them.",
      },
    ],
  },
];

export const TipsAndTricksModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [openSections, setOpenSections] = useState(
    tipsAndTricks.map(() => false)
  );

  const toggleSection = (index: number) => {
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
