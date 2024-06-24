// Nos permite acceder a donde estámos en las carpetas. Ya sea en local o en la nube.
const path = require("path");

// Archivo necesario para trabajar con HTML.
const HtmlWebpackPlugin = require("html-webpack-plugin");

// Archivo necesario para trabajar con archivos estáticos.
const CopyWebpackPlugin = require("copy-webpack-plugin");

// Archivo necesario para limpiar la carpeta dist cada vez que se haga un cambio.
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const webpack = require("webpack");

//Aquí se encuentra toda la configuración de lo que va a suceder. Modulo para exportar.
module.exports = {
  // Punto de entrada con su dirección.Aquí vive el código inicial y de aquí parte al desarrollo.
  entry: "./src/index.js",
  // Donde se envía el proyecto estructurado y compilado listo para producción.
  output: {
    // Creamos el lugar dónde se exportará el proyecto.
    path: path.resolve(__dirname, "dist"),
    // Este es el nombre del archivo final para producción.
    filename: "bundle.js",
  },
  //Extensiones que vamos a utilizar.
  resolve: {
    extensions: [".js"],
  },
  experiments: {
    syncWebAssembly: true,
  },
  // Se crea un modulo con las reglas necesarias que vamos a utilizar.
  module: {
    //Reglas
    rules: [
      // Estructura de Babel
      {
        // Nos permite identificar los archivos según se encuentran en nuestro entorno.
        test: /\.m?js$/,
        // Excluimos la carpeta de node modules
        exclude: /node_modules/,
        // Utilizar un loader como configuración establecida.
        use: {
          loader: "babel-loader",
        },
      },
      // Estructura de HTML
      {
        // Identificación de archivos HTML
        test: /\.html$/,
        // Utilizar un loader como configuración establecida.
        use: [
          {
            loader: "html-loader",
            options: { minimize: true },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|mp4)$/i,
        type: "asset/resource",
      },
      // no process wasm files with webpack
      // {
      //   test: /\.wasm$/,
      //   type: "asset/resource",
      //   generator: {
      //     filename: "wasm/[base]",
      //   },
      // },
    ],
  },
  // Establecemos los plugins que vamos a utilizar
  plugins: [
    // Limpia la carpeta dist
    new CleanWebpackPlugin(),
    // Permite trabajar con los archivos HTML
    new HtmlWebpackPlugin({
      // Cómo vamos a inyectar un valor a un archivo HTML.
      inject: true,
      // Dirección donde se encuentra el template principal
      template: "./src/index.html",
      // El nombre que tendrá el archivo
      filename: "./index.html",
    }),
    new CopyWebpackPlugin({
      // Configuración de los archivos estáticos que vamos a utilizar, colocandolo en la raiz de la carpeta dist.
      patterns: [
        { from: "src/assets", to: "assets" },
        { from: "libs", to: "libs" },
      ],
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /\.js$/,
      contextRegExp: /algorithms$/,
    })
  ],
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
  },
};
