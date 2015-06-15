var path = require('path');

module.exports = {
    entry: {
        app: './app.ts'
    },
    resolve: {
        extensions: ['', '.ts', '.js']
    },
    devtool: 'source-map',
    module: {
        loaders: [{
            test: /\.ts$/,
            loader: 'awesome-typescript-loader'
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    }
};