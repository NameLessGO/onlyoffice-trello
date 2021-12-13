require('dotenv').config({path: `${__dirname}/.env`});
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const dev = process.env.NODE_ENV !== 'production';
const analyzer = parseInt(process.env.ENABLE_BUNDLE_ANALYZER) === 1;
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

module.exports = (env) => {
    return ({
        output: {
            path: resolveApp('dist'),
            filename: '[name]-[contenthash].js',
            library: 'react',
            clean: true
        },
        entry: {
            global: resolveApp(path.join('src', 'global.ts')),
            index: resolveApp(path.join('src', 'index.tsx'))
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'babel-loader',
                    exclude: [
                        /(node_modules)/
                    ],
                    options: {
                        cacheDirectory: true,
                    },
                },
                {
                    test: /\.js$/,
                    use: ['source-map-loader'],
                    enforce: 'pre',
                    exclude: /(node_modules)/
                },
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader']
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        'sass-loader'
                    ],
                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                    },
                },
            ],
        },
        devtool: !env.WEBPACK_BUILD ? 'source-map' : undefined,
        plugins: [
            new webpack.EnvironmentPlugin([
                'NODE_ENV',
                'PORT',
                'BACKEND_HOST',
                'POWERUP_NAME',
                'POWERUP_APP_KEY',
                'CONTEXT_PATH',
            ]),
            new MiniCssExtractPlugin(),
            analyzer && new BundleAnalyzerPlugin(),
            new HtmlWebpackPlugin({
                chunks: ['global', 'index'],
                template: 'public/index.html',
                favicon: 'public/favicon.png',
                filename: 'index.html',
            }),
            !env.WEBPACK_BUILD && new webpack.HotModuleReplacementPlugin(),
            !env.WEBPACK_BUILD && new ReactRefreshWebpackPlugin(),
        ].filter(Boolean),
        optimization: !env.WEBPACK_BUILD ? {
            minimize: true,
            usedExports: 'global',
            splitChunks: {
                chunks: 'async',
                minSize: 50000,
                maxSize: 244000,
                minChunks: 1,
                maxAsyncRequests: 30,
                maxInitialRequests: 30,
                cacheGroups: {
                    defaultVendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                        reuseExistingChunk: true
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true
                    }
                }
            }
        } : undefined,
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.css'],
            alias: {
                Components: path.resolve(__dirname, 'src/components'),
                Types: path.resolve(__dirname, 'src/types'),
                Root: path.resolve(__dirname, 'src/'),
                Public: path.resolve(__dirname, "public/"),
            }
        },
        mode: env.WEBPACK_BUILD ? 'production' : 'development'
    });
};
