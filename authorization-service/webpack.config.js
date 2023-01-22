const path = require('path');
const serverlessWebpack = require('serverless-webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    mode: serverlessWebpack.lib.webpack.isLocal ? 'development' : 'production',
    entry: serverlessWebpack.lib.entries,
    resolve: {
        plugins: [new TsconfigPathsPlugin({})],
        extensions: ['.ts', '.js', '.json']
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: [
                    [
                        path.resolve(__dirname, 'node_modules'),
                        path.resolve(__dirname, '.serverless'),
                        path.resolve(__dirname, '.webpack'),
                    ],
                ],
            },
        ],
    },
};
