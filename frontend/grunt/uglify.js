module.exports = {
    options: {
        banner: '/*! <%= package.name %> <%= package.version %> */\n',
        report: 'min'
    },
    js: {
        files: {
            'public/<%= package.name %>-ember.min.js': 'public/<%= package.name %>-ember.js'
        }
    }
};