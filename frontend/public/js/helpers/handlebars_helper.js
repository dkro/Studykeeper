Ember.Handlebars.helper('validation-input', validationInput);

Ember.Handlebars.helper('germanDate', function(date, options) {
    return moment(date).format('DD.MM.YYYY');
});

Ember.Handlebars.helper('typeOutput', function(item, type, options) {
    var res = '';

    if (type === 'NEWS_TYPE') {
        res = item.get('title') + ' (' + item.get('date') + ')';
    } else if (type === 'LABELS_TYPE') {
        res = item.get('title');
    } else if (type === 'STUDY_TYPE') {
        res = item.get('title');
    } else if (type === 'TEMPLATE_TYPE') {
        res = item.get('title');
    } else if (type === 'USER_TYPE') {
        res = item.get('username') + ' (' + item.get('firstname') + ' ' + item.get('lastname') + ')';
    }

    return res;
});

Ember.Handlebars.helper('searchTypeOutput', function(item, type, options) {
    var res = '';

    if (type === 'NEWS_TYPE') {
        res = item.get('title') + ' (' + item.get('date') + ')';
    } else if (type === 'STUDY_TYPE') {
        res = item.get('title');
    } else if (type === 'USER_TYPE') {
        res = item.get('username');
    }

    return res;
});

Ember.Handlebars.helper('searchTableTypeHeader', function(type, options) {
    var res = '';

    if (type === 'NEWS_TYPE') {
        res = 'Zugehörige News';
    } else if (type === 'STUDY_TYPE') {
        res = 'Vorausgesetzte Studien'
    } else if (type === 'USER_TYPE') {
        res = 'Angemeldete Nutzer';
    }

    return res;
});

Ember.Handlebars.helper('searchTableTypeEmpty', function(type, options) {
    var res = '';

    if (type === 'NEWS_TYPE') {
        res = 'Keine News angegeben';
    } else if (type === 'STUDY_TYPE') {
        res = 'Keine Studien vorausgesetzt'
    } else if (type === 'USER_TYPE') {
        res = 'Keine Nutzer angemeldet';
    }

    return res;
});

Ember.Handlebars.helper('notFoundRecordType', function(type, options) {
    var res = '';

    if (type === 'NEWS_TYPE') {
        res = 'keine News';
    } else if (type === 'LABELS_TYPE') {
        res = 'kein Label';
    } else if (type === 'STUDY_TYPE') {
        res = 'keine Studie';
    } else if (type === 'TEMPLATE_TYPE') {
        res = 'kein Template';
    } else if (type === 'USER_TYPE') {
        res = 'kein Nutzer';
    }

    return res;
});

Ember.Handlebars.helper('toGermanRole', function(role, options) {
    var res = 'Teilnehmer';

    if (role === 'executor') {
        res = 'Ausführend';
    } else if (role === 'tutor') {
        res = 'Tutor';
    }

    return res;
});