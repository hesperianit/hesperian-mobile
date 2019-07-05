const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const getPageInfo = require('./webpack.preprocess');



function createConfig(spec) {
  const appConfig = spec.appConfig;
  const rootDir = spec.rootDir;

  let assets = [{
      from: 'img/**/*',
      to: '.'
    },
    {
      from: 'locales/**/*',
      to: '.'
    }
  ];

  if (spec.addtionalAssets) {
    assets = assets.concat(spec.addtionalAssets);
  }


  const copyWebpackPlugin = new CopyWebpackPlugin(assets, {});

  const config = {
    mode: 'development',
    context: path.resolve(rootDir, 'www'),
    entry: './js/app.js',
    plugins: [
      new webpack.DefinePlugin({
        __VERSION__: JSON.stringify(appConfig.version),
        __PREPROCESS__: JSON.stringify(getPageInfo())
      }),
      new HtmlWebpackPlugin({
        title: appConfig.description,
        template: 'index.html'
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
      copyWebpackPlugin
    ],
    module: {
      rules: [{
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env',
                  {
                    debug: false,
                    "useBuiltIns": "entry",
                    "corejs": {
                      "version": 3,
                      "proposals": true
                    },
                    "targets": {
                      "android": "4.4",
                      "ios": "9"
                    }
                  }
                ]
              ]
            }
          }
        },
        {
          test: /\.(s*)css$/,
          use: [{
            loader: MiniCssExtractPlugin.loader
          }, 'css-loader', {
            loader: "sass-loader",
            options: {
              includePaths: ['./www/css']
            }
          }]
        },
        {
          test: /\.(woff|woff2|eot|ttf)$/,
          loader: 'url-loader?limit=100000'
        }
      ]
    },
    output: {
      filename: 'main.js',
      path: path.resolve(rootDir, 'dist')
    }
  };

  return config;
}
module.exports = {
  createConfig: createConfig
};