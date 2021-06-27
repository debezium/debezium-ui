const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const webpack = require("webpack");
const ChunkMapper = require("@redhat-cloud-services/frontend-components-config/chunk-mapper");
const { dependencies, federatedModuleName } = require("./package.json");

// Try the environment variable, otherwise use root
const ASSET_PATH = process.env.ASSET_PATH || "/";
const COMMIT_HASH =
  process.env.COMMIT_HASH ||
  require("child_process")
    .execSync("git rev-parse --short HEAD")
    .toString()
    .trim();

module.exports = (env, argv) => {
  const isProduction = argv && argv.mode === "production";
  return {
    entry: {
      app: "./src/index.tsx",
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        favicon: "./src/favicon.ico",
      }),
      // This makes it possible for us to safely use env vars on our code
      new webpack.DefinePlugin({
        "process.env.ASSET_PATH": JSON.stringify(ASSET_PATH),
      }),
      new webpack.DefinePlugin({
        "process.env.COMMIT_HASH": JSON.stringify(COMMIT_HASH),
      }),
      new CopyPlugin({
        patterns: [{ from: "./src/locales", to: "locales" }],
      }),
      new ChunkMapper({
        modules: [federatedModuleName],
      }),
      new webpack.container.ModuleFederationPlugin({
        name: "debezium_ui",
        filename: "dbz-connector-configurator.remoteEntry.js",
        exposes: {
          "./config": "./src/app/pages/createConnector/federatedModule/config",
        },
        shared: {
          ...dependencies,
          react: {
            eager: true,
            singleton: true,
            requiredVersion: dependencies["react"],
          },
          "react-dom": {
            eager: true,
            singleton: true,
            requiredVersion: dependencies["react-dom"],
          },
        },
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(tsx|ts|js)?$/,
          include: path.resolve(__dirname, "src"),
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
                experimentalWatchApi: true,
              },
            },
          ],
        },
        {
          test: /\.(svg|ttf|eot|woff|woff2)$/,
          // only process modules with this loader
          // if they live under a 'fonts' or 'pficon' directory
          include: [
            path.resolve(__dirname, "node_modules/patternfly/dist/fonts"),
            path.resolve(
              __dirname,
              "node_modules/@patternfly/react-core/dist/styles/assets/fonts"
            ),
            path.resolve(
              __dirname,
              "node_modules/@patternfly/react-core/dist/styles/assets/pficon"
            ),
          ],
          use: {
            loader: "file-loader",
            options: {
              // Limit at 50k. larger files emited into separate files
              limit: 5000,
              outputPath: "fonts",
              name: "[name].[ext]",
            },
          },
        },
        {
          test: /\.svg$/,
          include: (input) => input.indexOf("background-filter.svg") > 1,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 5000,
                outputPath: "svgs",
                name: "[name].[ext]",
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          // only process SVG modules with this loader if they live under a 'bgimages' directory
          // this is primarily useful when applying a CSS background using an SVG
          include: (input) => input.indexOf("bgimages") > -1,
          use: {
            loader: "svg-url-loader",
            options: {},
          },
        },
        {
          test: /\.svg$/,
          // only process SVG modules with this loader when they don't live under a 'bgimages',
          // 'fonts', or 'pficon' directory, those are handled with other loaders
          include: (input) =>
            input.indexOf("bgimages") === -1 &&
            input.indexOf("fonts") === -1 &&
            input.indexOf("background-filter") === -1 &&
            input.indexOf("pficon") === -1,
          use: {
            loader: "raw-loader",
            options: {},
          },
        },
        {
          test: /\.(jpg|jpeg|png|gif)$/i,
          include: [
            path.resolve(__dirname, "assets"),
            path.resolve(__dirname, "src"),
            path.resolve(__dirname, "node_modules/patternfly"),
            path.resolve(
              __dirname,
              "node_modules/@patternfly/patternfly/assets"
            ),
            path.resolve(
              __dirname,
              "node_modules/@patternfly/react-core/dist/styles/assets/images"
            ),
            path.resolve(
              __dirname,
              "../../node_modules/@patternfly/react-table/node_modules/@patternfly/react-styles/css/assets/images"
            ),
            path.resolve(
              __dirname,
              "node_modules/@patternfly/react-styles/css/assets/images"
            ),
          ],
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 5000,
                outputPath: "images",
                name: "[name].[ext]",
              },
            },
          ],
        },
        {
          test: /\.(json)$/i,
          include: [path.resolve(__dirname, "src/locales")],
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 5000,
                outputPath: "locales",
                name: "[name].[ext]",
              },
            },
          ],
        },
      ],
    },
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "auto",
    },
    resolve: {
      alias: {
        shared: path.resolve(__dirname, "src/app/shared"),
        components: path.resolve(__dirname, "src/app/components"),
        assets: path.resolve(__dirname, "assets"),
        i18n: path.resolve(__dirname, "src/i18n"),
        layout: path.resolve(__dirname, "src/app/layout"),
      },
      extensions: [".ts", ".tsx", ".js"],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: path.resolve(__dirname, "./tsconfig.json"),
        }),
      ],
      symlinks: false,
      cacheWithContext: false,
    },
  };
};
