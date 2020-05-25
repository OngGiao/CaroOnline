var path = require("path");
var pathToPhaser = path.join(__dirname, "/node_modules/phaser/");
var phaser = path.join(pathToPhaser, "dist/phaser.js");
const WriteFilePlugin = require('write-file-webpack-plugin');

module.exports = {
    entry: "./client/app.ts",
    output: {
        path: path.resolve(__dirname, "public/dist"),
        filename: "app.js"
    },
    module: {
        rules: [{
                test: /\.ts$/,
                loader: "ts-loader",
                exclude: "/node_modules/"
            },
            {
                test: /phaser\.js$/,
                loader: "expose-loader?Phaser"
            }
        ]
    },
    plugins: [
        new WriteFilePlugin()
    ],
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            phaser: phaser
        }
    }
};