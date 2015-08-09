module.exports = {
  entry: {
    js: './src/scripts/main.js', 
    jade: './src/index.jade',
    stylus: './src/styles/main.styl'
  },
  out: (watch) =>
    watch ? './instance' : './dist/'
};
