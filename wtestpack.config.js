const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

let currentTask = process.env.npm_lifecycle_event;

let postCSSPlugins = [
    require('autoprefixer'),
    require('postcss-import'),
    require('postcss-nested'),
    require('postcss-mixins')
]

let cssConfig = {
    test: /\.css$/i,
    use: [
        'css-loader'
    ]
};

let config = {
    entry: {
        App: './assets/scripts/app.js'
    },
    plugins: [new HtmlWebpackPlugin({ filename: 'index.html', template: './app/assets/index.html' })],
    module: {
        rules: [
            cssConfig
        ]
    }
}

if (currentTask == 'build') {
    config.mode = 'production';
    config.output = {
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    }
    config.plugins.push(new MiniCssExtractPlugin({filename: 'styles.[contenthash].css'}))
    config.optimization = {
        splitChunks: {
            chunks: 'all',
            minSize: 1000
        },
        minimize: true,
        minimizer: [`...`, new CssMinimizerPlugin()]
    }
    cssConfig.use.unshift(MiniCssExtractPlugin.loader);
}

if (currentTask == 'dev') {
    config.mode = 'development';
    config.output = {
        path: path.resolve(__dirname, 'app/assets'),
        clean: true
    },
    cssConfig.use.unshift('style-loader');
    cssConfig.use.push({
        loader: 'postcss-loader',
        options: {
            postcssOptions: {
                plugins: postCSSPlugins
            }
        }
    })
    config.devServer = {
        watchFiles: ['./assets/**/*.html'],
        static: {
            directory: path.resolve(__dirname, 'assets')
        },
        hot: true,
        port: 3000,
        host: '0.0.0.0'
    }
}

module.exports = config;