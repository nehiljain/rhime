var path = require('path');
var webpack = require('webpack');
var AssetsPlugin = require('assets-webpack-plugin')


module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        './app/index.jsx'
    ],
    output: {
        path: path.join(__dirname, 'public/js'),
        publicPath: '/js/',
        filename: '[hash].bundle.js'
    },
    devServer: {
        inline: true,
        port: 7777
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
	new AssetsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'react']
                }
            }
        ]
    }
};
