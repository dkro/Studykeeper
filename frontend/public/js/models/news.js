StudyManager.News = DS.Model.extend({
    title: DS.attr('string'),
    date: DS.attr('isodate'),
    description: DS.attr('string'),
    link: DS.attr('string')
});

StudyManager.News.FIXTURES = [
    {
        id: 1,
        title: 'News 1',
        date: '04.11.2014',
        description: 'This news is very interesting. Come on, take a look!',
        link: 'http://www.amazon.com'
    },
    {
        id: 2,
        title: 'Super Crazy Mega News',
        date: '09.08.2014',
        description: 'This news is not so interesting.',
        link: 'http://www.google.com'
    },
    {
        id: 3,
        title: 'NewsNews',
        date: '07.08.2013',
        description: 'Strange news here. It is better to avoid looking at it.',
        link: 'http://www.sueddeutsche.de'
    }
];