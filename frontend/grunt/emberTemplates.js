module.exports = {
  run: {
    options: {
      templateBasePath: /public\/js\/templates\//
    },
    files: {
      'public/js/templates.js': 'public/js/templates/*.hbs'
    }
  }
};
