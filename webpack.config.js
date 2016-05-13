module.exports = {
  entry: './react-views/app.js',
  output: {
    filename: 'public/bundle.js'
  },
  devServer: {
    inline: true,
    port: 7777
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
}