const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const CopyPlugin = require('copy-webpack-plugin');
const { port } = require("./package.json");

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || port;


module.exports = merge(common("development"), {
  mode: "development",
  devtool: "eval-source-map",
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "../../config/config.js", to: "config.js" },
      ],
    }),
  ],
  output: {
    publicPath: (false && isProd && remoteSuffix)
      ? `http://debeziumui${remoteSuffix}/`
      : `http://localhost:${PORT}/`
  },
  devServer: {
    contentBase: "./dist",
    host: HOST,
    port: PORT,
    compress: true,
    inline: true,
    historyApiFallback: true,
    hot: true,
    overlay: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  }
});