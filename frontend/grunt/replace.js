module.exports = {
  run: {
    src: 'public/js/templates.js',
    overwrite: true,
    replacements: [
      {
        from: '"',
        to: "'"
      }, {
        from: /\['([a-z]+)'\]/g,
        to: '.$1'
      }
    ]
  }
};
