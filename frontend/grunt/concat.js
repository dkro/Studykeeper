module.exports = {
  options: {
    banner: ";(function() {\n'use strict';\n",
    footer: "}).call(this);"
  },
  js: {
    files: {
      'public/<%= package.name %>-ember.js': [
        'public/js/application.js',
        'public/js/router.js',
        //'public/js/adapter.js',
        'public/js/serializer.js',
        'public/js/controllers/**/*.js',
        'public/js/models/**/*.js',
        'public/js/components/**/*.js',
        'public/js/transforms/**/*.js'
      ]
    }
  }
};
