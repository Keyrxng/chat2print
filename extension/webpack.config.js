const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development", // Use 'production' when you're ready to deploy
  entry: {
    background: path.join(__dirname, "background", "background.js"), // Your background script
    popup: path.join(__dirname, "popup.js"), // Your popup script
    content: path.join(__dirname, "content.js"), // Your content script
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      // If you have a Babel config and want to use it, uncomment this
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: 'babel-loader'
      //   }
      // },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "manifest.json", to: "manifest.json" },
        // { from: "icons", to: "icons" }, // Copy the icons folder
        { from: "index.html", to: "index.html" }, // Copy the popup HTML
        { from: "popup.css", to: "popup.css" }, // Copy the popup CSS
        { from: "icons", to: "icons" }, // Copy the icons folder
      ],
    }),
  ],
};
