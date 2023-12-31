const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

const dist = path.resolve(__dirname, "dist");

module.exports = {
  mode: "production",
  entry: {
    main: "./js/main.js",
  },
  output: {
    path: dist,
    filename: "[name].js",
  },
  devServer: {
    contentBase: dist,
  },
  plugins: [
    new CopyPlugin([path.resolve(__dirname, "src")]),

    // new WasmPackPlugin({
    //   crateDirectory: path.resolve(__dirname, "crates/math-operations"),
    //   extraArgs: "--target web"
    // }),
    // new WasmPackPlugin({
    //   crateDirectory: path.resolve(__dirname, "crates/fibonacci"),
    //   extraArgs: "--target web"
    // }),
  ],
};
