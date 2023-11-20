const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.tsx',
    devtools: './src/devtools.js',
    background: './src/background.ts',
  },
  devtool: 'source-map',
  mode: 'production',
  resolve: {
    fallback: {
      process: require.resolve('process/browser'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: { noEmit: false },
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'manifest.json', to: '../manifest.json' },
        { from: 'src/images', to: '../images' },
      ],
    }),
    new HTMLPlugin({
      title: 'React Extension Popup',
      filename: 'popup.html',
      chunks: ['index'],
    }),
    new HTMLPlugin({
      title: 'React Extension DevTools',
      filename: 'devtools.html',
      chunks: ['devtools'],
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.join(__dirname, 'dist/js'),
    filename: '[name].js',
  },
};
