/** @type {import('next').NextConfig} */
module.exports = {
  async headers() {
    return [
      {
        source: "/src/api/pod", // Replace with your API route path
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://chat.openai.com", // Allow requests from this origin
          },
          // Add other necessary headers here if needed
        ],
      },
      // Define headers for other routes if necessary
    ];
  },
};
