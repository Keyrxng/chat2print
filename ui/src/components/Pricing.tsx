export const PricingPlans = () => {
  return (
    <section className="py-12 px-4 bg-background">
      <div className="text-center mb-12">
        <h2 className="text-4xl text-accent font-bold">Choose Your Plan</h2>
        <p className="mt-2 text-lg text-gray-600">
          Select the best plan that fits your needs.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="flex flex-col p-6 gradientBG shadow-md rounded-lg">
          <h3 className="text-3xl font-bold mb-4 text-gray-400">Free Users</h3>
          <div className="flex">
            <ul className="flex-1">
              <li className="mb-2 text-xl text-gray-400">
                Store up to 2 designs
              </li>
              <li className="mb-2 text-xl text-gray-400">
                One-time purchase at retail price
              </li>
              <li className="mb-2 text-xl text-gray-400">Standard support</li>
              <li className="text-xl text-gray-400">
                Access to basic product catalog
              </li>
            </ul>
          </div>
          <div className="mt-4">
            <button className="w-full bg-background text-gray-400 font-bold py-2 px-4 rounded hover:bg-gray-100 transition duration-300">
              Sign Up for Free
            </button>
          </div>
        </div>
        <div className="flex flex-col p-6 gradientBG text-white shadow-md rounded-lg">
          <h3 className="text-3xl font-bold mb-4">Paid Users</h3>
          <div className="flex justify-betweenflex-shrink-0">
            <ul className="shrink-0">
              <li className="mb-2 text-md">Store 100-500 designs</li>
              <li className="mb-2 text-md">Bulk discounts available</li>
              <li className="mb-2 text-md">Free shipping on all orders</li>
              <li className="mb-2 text-md">Priority customer support</li>
              <li className="text-md">Request new products</li>
            </ul>
            <div className="flex-1"></div>
            <div className="flex-col mr-2 items-end hidden min-[400px]:flex">
              <div className="m-2 px-4 rounded text-center">
                <p className="text-md">Gold:</p>
                <p className="text-lg font-bold">$20/mo</p>
              </div>
              <div className="m-2 px-4 rounded text-center">
                <p className="text-md">Silver:</p>
                <p className="text-lg font-bold">$10/mo</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button className="w-full bg-background text-accent font-bold py-2 px-4 rounded hover:bg-gray-100 transition duration-300">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
