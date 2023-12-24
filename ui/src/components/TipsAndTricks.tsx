import React, { useState } from "react";

const tipsAndTricks = [
  {
    title: "Essential Pre-Start Information",
    content: "",
    subsections: [
      {
        title: "Results and Quality",
        detail:
          "We guarantee print quality 173% higher than industry minimums and are actively working to further increase this capacity.",
      },
      {
        title: "Basic Usage",
        detail:
          "Select a product, upload a design, and generate a mockup. We upscale the image before generating the mockup and save both to your account.",
      },
      {
        title: "Ai-Assist",
        detail:
          "Ai-Assist, automatically positioning and scaling your design, is enabled by default. You can disable it for full control over placement and dimensions, although manual adjustment is not recommended.",
      },
      {
        title: "Limitation Overview",
        detail:
          "We have implemented restrictions on storage, upscaling, and the rate of mockup creation. Efforts to expand these capacities are ongoing.",
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
          "For optimal results, keep 'Ai-Assist' enabled. This feature automatically optimizes your design's placement and dimensions for the product's print area. You may disable it for greater control over these aspects.",
      },
      {
        title: "Familiarizing Yourself",
        detail:
          "With 'Ai-Assist' enabled, your design is positioned automatically. Be mindful of template areas that might be affected during printing, such as the camera hole or template edges.",
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
          "Our AI technology precisely upscales your images to enhance resolution without sacrificing quality. Select an image, choose 'Generate Mockup', and we will save both the upscaled image and the mockup to your account. This feature is currently available for free during early access.",
      },
      {
        title: "Daily Upscaling Cap",
        detail:
          "Early access users can upscale up to 10 images per day. We recommend focusing on designs that you are most eager to see brought to life. Post-launch, this feature may transition to a premium offering.",
      },
      {
        title: "Maximizing Upscaling Quality",
        detail:
          "Opt for a transparent background whenever possible, unless it is an integral part of your design. Our upscaling process aims to achieve a minimum print quality 173% higher than industry standards.",
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
          "Begin by identifying the product shape and specifying your desired orientation. Request 'no borders' for a cleaner appearance and consider a 'transparent background' for seamless product integration. Let your creativity flourish in your designs!",
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
