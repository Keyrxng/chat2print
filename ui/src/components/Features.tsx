export const FeaturesSection = () => {
  const features = [
    {
      title: "High Quality Prints",
      description: "We use the highest quality materials for our prints.",
      icon: "🖨️",
    },
    {
      title: "Fast Shipping",
      description: "We ship your products as fast as possible.",
      icon: "🚀",
    },
    {
      title: "Easy to Use",
      description: "Import designs from ChatGPT with just a few clicks.",
      icon: "🖱️",
    },
  ];

  return (
    <section id="features" className="py-12 md:py-18 rounded-md ">
      <div className="max-w-[100rem] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card text-center p-6 bg-background rounded-lg transition-shadow hover:shadow-xl"
            >
              <span className="text-4xl">{feature.icon}</span>
              <h3 className="text-xl text-accent font-semibold mt-5 mb-3">
                {feature.title}
              </h3>
              <p className="text-white">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
