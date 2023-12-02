export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <section className="text-center py-12 md:py-24">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
          Chat2Print
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          Print your GPT creations on phone cases, mousepads, hoodies, and more!
        </p>
        <a
          href="/download"
          className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-blue-600 transition duration-300"
        >
          Download Extension
        </a>
      </section>

      <section className="py-8 md:py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Quick and Easy Shift from ChatGPT to Print-on-Demand Designs
        </h2>
        <p className="text-gray-600 text-lg md:text-xl text-center mx-auto leading-relaxed max-w-2xl">
          Transform your creative ChatGPT images into unique physical products
          with just a few clicks. Our seamless integration with print-on-demand
          services lets you bring your virtual creations to life, effortlessly.
        </p>
      </section>

      {/* Add additional sections with more features, testimonials, etc., as needed */}
    </div>
  );
}
