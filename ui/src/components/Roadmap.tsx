import { motion } from "framer-motion";
import React, { useState } from "react";

const milestones = [
  {
    title: "2023: Quarter 4",
    content: `<ul class="list-disc list-inside">
    <li>Chat2Print is founded.</li>
    <li>Early Access is Released.</li>
    </ul>`,
    shipped: true,
  },
  {
    title: "2024: Quarter 1",
    content: `<ul class="list-disc list-inside"> 
    <li>Browser extension is launched.</li>
    <li>Studio gets an upgrade.</li>
    <li>Product trained AI agents.</li>
    </ul>`,
    shipped: false,
  },
  {
    title: "2024: Quarter 2",
    content: `<ul class="list-disc list-inside">
    <li>Full release of Chat2Print.</li>
    <li>Affiliate and creator programs launched.</li>
    <li>POD and E-comm marketplace integrations.</li>
    </ul>`,
    shipped: false,
  },
];

const Roadmap = () => {
  const [selected, setSelected] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="container mx-auto p-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="flex flex-col items-center space-y-10">
        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.title}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelected(selected === index ? null : index)}
            className="w-full max-w-lg p-4 bg-background text-accent shadow-lg rounded-lg cursor-pointer"
          >
            <motion.h4
              layoutId={`title-${index}`}
              className="text-lg font-bold flex justify-between items-center"
            >
              {milestone.title}{" "}
              <span>{milestone.shipped ? "[✅]" : "[🚧]"}</span>
            </motion.h4>
            <motion.div layout initial={{ borderRadius: 10 }}>
              {selected === index && (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 text-lg"
                  dangerouslySetInnerHTML={{ __html: milestone.content }}
                />
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Roadmap;
