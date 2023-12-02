export const HowItWorksSection = () => {
  const steps = [
    {
      title: "Generate and Import",
      description:
        "Import directly from the chat interface using the browser extension.",
    },
    {
      title: "Preview",
      description:
        "Take a look at your design on a variety of the highest quality products.",
    },
    {
      title: "Order",
      description:
        "Place your order and we handle the rest, from printing to shipping.",
    },
  ];

  return (
    <section id="how-it-works" className="py-6 md:py-18 rounded-md">
      <div className="max-w-[120rem] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {steps.map((step, index) => (
            <div
              key={index}
              className="step-card p-6 bg-background rounded-lg transition-shadow hover:shadow-xl"
            >
              <div className="step-icon text-4xl mb-4">👉</div>
              <h3 className="text-xl text-accent font-semibold mb-3">
                {step.title}
              </h3>
              <p className="text-white">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
