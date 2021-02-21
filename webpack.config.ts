import path from 'path';
import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const config: webpack.Configuration = {
    entry: {
        app: `${path.join(__dirname, 'src')}/index.ts`
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    module: {
        rules: [{
            test: /\.ts/,
            exclude: /node_modules/,
            use: {
                loader: 'ts-loader',
            }
        }, {
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader'
            }
        }]
    },
    mode: 'development',
    devtool: 'inline-source-map',
    target: 'web',
    devServer: {
        hot: true,
        historyApiFallback: true
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@': path.join(__dirname, 'src')
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: `${path.join(__dirname, 'public')}/index.html`
        })
    ]
};

export default config;
