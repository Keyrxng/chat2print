/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.cdn.printful.com",
      },
      {
        protocol: "https",
        hostname: "ywaeexoevxxjquwlhfjx.supabase.co",
      },
      {
        protocol: "https",
        hostname: "printful.com",
      },
      {
        protocol: "https",
        hostname: "printful-upload.s3-accelerate.amazonaws.com",
      },
    ],
  },
  // async headers() {
  //   return [
  //     {
  //       source: "/src/api/pod", // Replace with your API route path
  //       headers: [
  //         {
  //           key: "Access-Control-Allow-Origin",
  //           value: "https://chat.openai.com", // Allow requests from this origin
  //         },
  //         // Add other necessary headers here if needed
  //       ],
  //     },
  //     // Define headers for other routes if necessary
  //   ];
  // },
};
