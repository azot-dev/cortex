const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.tsx', // Point d'entrée pour votre popup
    devtools: './src/devtools.js', // Ajoutez un point d'entrée pour la page DevTools
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
        { from: 'src/images', to: '../images' }, // Ajoutez si vous avez des images à copier
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
