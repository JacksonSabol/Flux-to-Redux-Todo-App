const path = require('path');
module.exports = {
    mode: 'development',
    module: {
        rules: [
            {
                loader: "babel-loader",

                include: [
                    path.resolve(__dirname, "src"),
                ],

                test: /\.js?$/,

                // Options to configure babel with
                options: {
                    presets: ['@babel/env'],
                }
            },
        ]
    },
    entry: {
        "cpanel": ["./src/control-panel.js"]
    },
    output: {
        path: path.resolve(__dirname, "public"),
        publicPath: "/assets/",
        filename: "[name].bundle.js"
    },
    devServer: { inline: true },
    devtool: 'source-map',
}