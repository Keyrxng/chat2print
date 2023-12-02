const testimonials = [
  {
    name: "John Doe",
    quote:
      "I love Chat2Print! It's so easy to use and I can't wait to order more products!",
  },
  {
    name: "Jane Doe",
    quote:
      "I love Chat2Print! It's so easy to use and I can't wait to order more products!",
  },
  {
    name: "John Doe",
    quote:
      "I love Chat2Print! It's so easy to use and I can't wait to order more products!",
  },
  {
    name: "Jane Doe",
    quote:
      "I love Chat2Print! It's so easy to use and I can't wait to order more products!",
  },
];

export const CustomerTestimonials = () => {
  return (
    <section id="testimonials" className="py-12 md:py-24 bg-blue-100">
      <h2 className="text-3xl font-bold text-center mb-6">
        What Our Customers Say
      </h2>
      <div className="flex flex-col md:flex-row justify-center items-center space-x-4">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="testimonial-card p-4 border rounded shadow-lg mx-2"
          >
            <blockquote className="italic">"{testimonial.quote}"</blockquote>
            <div className="customer-name font-semibold mt-2">
              {testimonial.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
