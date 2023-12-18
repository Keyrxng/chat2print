import React, { useState } from "react";

const tipsAndTricks = [
  {
    title: "Getting Started with the Editor",
    content: "Here are some quick tips to get you started with our editor: ...",
    subsections: [
      {
        title: "Tip 1: Shortcut Keys",
        detail: "Use CTRL + S to quickly save your work...",
      },
      // ... more subsections ...
    ],
  },
  // ... more tips and tricks ...
];

export const TipsAndTricksModal = ({ isOpen, onClose }) => {
  const [openSections, setOpenSections] = useState(
    tipsAndTricks.map(() => false)
  );

  const toggleSection = (index) => {
    setOpenSections((current) =>
      current.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-4xl">
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-900 absolute top-4 right-4 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-3xl text-gray-800 font-bold mb-6">
          Editor Tips & Tricks
        </h2>
        <div>
          {tipsAndTricks.map((tip, index) => (
            <div key={index} className="border-b border-gray-200 py-4">
              <h3
                onClick={() => toggleSection(index)}
                className="text-lg font-semibold cursor-pointer hover:text-blue-600"
              >
                {tip.title}
              </h3>
              {openSections[index] && (
                <div className="mt-2 space-y-2">
                  {tip.content}
                  {tip.subsections &&
                    tip.subsections.map((sub, subIndex) => (
                      <div key={subIndex} className="pl-4">
                        <h4 className="font-medium">{sub.title}</h4>
                        <p className="text-sm">{sub.detail}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
