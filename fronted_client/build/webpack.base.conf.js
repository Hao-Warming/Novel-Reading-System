module.exports = {
  // other configurations...
  module: {
    rules: [
      // ...
      {
        test: /\.scss$/,
        loaders: ['style','css','sass']
      }
    ]
  }
}