const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// Removed CompressionPlugin and EventHooksPlugin

const path = require("path");

module.exports = (env, argv) => ({
    context: path.resolve(__dirname),

    entry: "./gui/js/index.js",

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: { minimize: true },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.(jpg|png|gif|svg)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 10000,
                            name: "img/[name].[ext]",
                            outputPath: "img/",
                            publicPath: "img/",
                        },
                    },
                    {
                        loader: "image-webpack-loader",
                        options: {
                            pngquant: {
                                quality: "20-40",
                            },
                        },
                    },
                ],
            },
        ],
    },

    optimization: {
        minimize: true,
    },

    resolve: {
        alias: {
            react: "preact/compat",
            "react-dom": "preact/compat",
        },
    },

    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "main.css",
        }),
        new HtmlWebPackPlugin({
            template: "./gui/index.html",
            filename: "index.html",
        }),
    ],
});
