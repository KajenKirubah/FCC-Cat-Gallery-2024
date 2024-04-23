const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const path = require('path');
const currentTask = process.env.npm_lifecycle_event;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

//need htmlwebpackplugin, minicssextractplugin, cssminimizer, 
//need postcss plugins- autoprefixer, postcss-nested, postcss-import, postcss-mixins

let postCSSPlugins = [
    require('autoprefixer'),
    require('postcss-nested'),
    require('postcss-import'),
    require('postcss-mixins')
]

let cssConfig = {
    test: /\.css$/i,
    use: ['css-loader']
}

let config = {
    entry: {
        app: './assets/scripts/app.js'
    },
    plugins: [new HtmlWebpackPlugin({ filename: 'index.html', template: './assets/index.html' })],
    module: {
        rules: [
            cssConfig
        ]
    }
}

if (currentTask == "build") {
    config.mode = "production";
    cssConfig.use.unshift(MiniCssExtractPlugin.loader);
    config.output = {
        path: path.resolve(__dirname, "dist"),
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js',
        clean: true
    }
    config.optimization = {
        splitChunks: {
            chunks: 'all',
            minSize: 3000
        },
        minimize: true,
        minimizer: [`...`, new CssMinimizerPlugin()]
    }
    config.plugins.push(new MiniCssExtractPlugin({ filename: 'styles.[contenthash].css' })) 
}

if (currentTask == "dev") {
    config.mode = "development";
    cssConfig.use.unshift("style-loader");
    cssConfig.use.push({
        loader: 'postcss-loader',
        options: {
            postcssOptions: {
                plugins: postCSSPlugins
            }
        }
    });
    config.output = {
        path: path.resolve(__dirname, 'assets')
    }
    config.devServer = {
        watchFiles: ["./assets/**/*.html"],
        static: {
            directory: path.resolve(__dirname, "assets")
        },
        port: 3000,
        hot: true,
        host: '0.0.0.0'
    }
}

module.exports = config;