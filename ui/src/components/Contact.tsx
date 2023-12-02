export const ContactInfo = () => {
  return (
    <section id="contact" className="py-12 md:py-24">
      <h2 className="text-3xl font-bold text-center mb-6">Get In Touch</h2>
      <div className="flex flex-col md:flex-row justify-around items-start">
        <form className="w-full md:w-1/2 px-4 mb-6 md:mb-0">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-primary text-sm font-bold mb-2"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-primary text-sm font-bold mb-2"
            >
              Your Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="message"
              className="block text-primary text-sm font-bold mb-2"
            >
              Your Message
            </label>
            <textarea
              id="message"
              rows="4"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Send Message
          </button>
        </form>
        <div className="w-full md:w-1/2 px-4">
          <p className="text-lg">You can also reach us at:</p>
          <p className="text-lg mt-2">Email: support@chat2print.com</p>
          <p className="text-lg mt-2">Phone: (123) 456-7890</p>
          {/* Add more contact details if necessary */}
        </div>
      </div>
    </section>
  );
};
