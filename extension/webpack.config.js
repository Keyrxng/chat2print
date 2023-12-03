const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production", // Use 'production' when you're ready to deploy
  entry: {
    content: path.join(__dirname, "content.js"), // Your content script
    popup: path.join(__dirname, "popup.js"), // Your popup script
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!@supabase\/supabase-js)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "manifest.json", to: "manifest.json" },
        { from: "index.html", to: "index.html" }, // Copy the popup HTML
        { from: "popup.css", to: "popup.css" }, // Copy the popup CSS
        { from: "icons", to: "icons" }, // Copy the icons folder
      ],
    }),
  ],
};
