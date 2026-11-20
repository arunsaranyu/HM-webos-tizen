const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const PATHS = {
  JS: path.resolve(__dirname)
}



const copyResources = (platform) => {
  const platforms = {
    webOS: [
      {
        from: './webOS',
        to: './'
      }
    ],
    tizenOS: [
      {
        from: './tizenOS',
        to: './'
      }
    ]
  };
  return platforms[platform];
};



module.exports = (env) => {
  console.log("Target Platform: ", env.platform);
  let platform = env.platform;

  typeof (platform) === 'undefined' ? platform = 'webOS' : platform;

  return {
    resolve: {
      fallback: {
        "fs": false
      },
    },

    entry: {
      polyfill: ["@babel/polyfill", path.join(PATHS.JS, '/src/index.js')]
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/, // .js and .jsx files
          exclude: /node_modules/, // excluding the node_modules folder
          use: {
            loader: "babel-loader"
          },
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: ["style-loader", "css-loader", "sass-loader"]
        },
        {
          test: /\.(jpeg|jgg|gif|png|woff|woff2|eot|ttf|svg|mp4)$/,
          loader: "url-loader"
        },
      ],
    },
    output: {
      path: path.join(__dirname, "/dist"),
      filename: "app.bundle.js"
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
        }),
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: `./src/index.html`
      }),

      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({ 'patterns': copyResources(platform) })
    ],
    devServer: {
      client: {
        overlay: {
          errors: false,
          warnings: false,
          runtimeErrors: false
        }
      },
      port: 4000,
      historyApiFallback: true
    }
  }
};

