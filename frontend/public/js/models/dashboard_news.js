StudyManager.DashboardNews = DS.Model.extend({
    name: DS.attr('string'),
    date: DS.attr('date'),
    description: DS.attr('string'),
    link: DS.attr('string')
});

StudyManager.DashboardNews.FIXTURES = [
    {
        id: 1,
        name: "News 1",
        date: "04.11.2014",
        description: "This news is very interesting. Come on, take a look!",
        link: "www.amazon.com"
    },
    {
        id: 2,
        name: "Super Crazy Mega News",
        date: "09.08.2014",
        description: "This news is not so interesting.",
        link: "www.google.com"
    },
    {
        id: 3,
        name: "NewsNews",
        date: "07.08.2013",
        description: "Strange news here. It's better to avoid looking at it.",
        link: "www.sueddeutsche.de"
    }
];