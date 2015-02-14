StudyManager.Studypublic = DS.Model.extend({
    title: DS.attr('string'),
    description: DS.attr('string'),
    fromDate: DS.attr('isodate'),
    untilDate: DS.attr('isodate'),
    executor: DS.attr('string'),
    tutor: DS.attr('string'),
    location: DS.attr('string'),
    link: DS.attr('string'),
    compensation: DS.attr('number'),
    mmi: DS.attr('number'),
    closed: DS.attr('boolean'),
    capacity: DS.attr('number'),
    freeSpace: DS.attr('number'),
    labels: DS.hasMany('label', { async: true }),
    template: DS.belongsTo('template', { async: true })
});

StudyManager.Studypublic.FIXTURES = [
    {
        id: 1,
        title: 'Studie 0',
        description: 'This study is totally awesome. I really like it. I loooooooooooooooveeeeee it.',
        fromDate: '20.09.2011',
        untilDate: '21.09.2011',
        executor: "Max Mustermann",
        tutor: "Max Mustermann",
        location: 'Hauptgebäude, Raum 045',
        link: 'http://www.google.com',
        compensation: 5,
        mmi: 2,
        closed: true,
        capacity: 30,
        freeSpace: 28,
        labels: [1, 2],
        template: 1
    },
    {
        id: 2,
        title: 'Studie A Studie A Studie A Studie A Studie A Studie A',
        description: 'Short description.',
        fromDate: '20.09.2015',
        untilDate: '21.09.2015',
        executor: "Max Mustermann",
        tutor: "Max Mustermann",
        location: 'Hauptgebäude, Raum 045',
        link: 'http://www.google.com',
        compensation: 10,
        mmi: 3,
        closed: false,
        capacity: 20,
        freeSpace: 18,
        labels: [2],
        template: 1
    },
    {
        id: 3,
        title: 'Studie B',
        description: 'Description. Description. Description. Description. Description. Description. Description. Description. ' +
        'Description. Description. Description. Description. Description. Description. Description. Description. Description. ' +
        'Description. Description. Description. Description. Description. Description. Description. Description. Description. ',
        fromDate: '10.03.2012',
        untilDate: '21.09.2012',
        executor: 'Max2 Mustermann2',
        tutor: 'Max2 Mustermann2',
        location: 'Amalienstraße, Raum 5',
        link: 'http://www.ifi.lmu.de',
        compensation: 5,
        mmi: 1,
        closed: true,
        capacity: 50,
        freeSpace: 49,
        labels: [],
        template: 1
    },
    {
        id: 4,
        title: 'Studie C',
        description: 'TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST' +
        'TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST' +
        'TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST' +
        'TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST' +
        'TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST',
        fromDate: '02.02.2010',
        untilDate: '15.02.2010',
        executor: 'Max2 Mustermann2',
        tutor: 'Max2 Mustermann2',
        location: 'Schellingstraße 3, Raum 012',
        link: 'http://www.lmu.de',
        compensation: 20,
        mmi: 4,
        closed: true,
        capacity: 10,
        freeSpace: 9,
        labels: [1, 2, 3],
        template: 2
    },
    {
        id: 5,
        title: 'Studie D',
        description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut ' +
        'labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ' +
        'ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor ' +
        'sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, ' +
        'sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus ' +
        'est Lorem ipsum dolor sit amet.',
        fromDate: '08.09.2015',
        untilDate: '27.09.2015',
        executor: 'Max2 Mustermann2',
        tutor: 'Max2 Mustermann2',
        location: 'Hauptgebäude, Raum B145',
        link: 'http://www.sueddeutsche.de',
        compensation: 5,
        mmi: 2,
        closed: false,
        capacity: 25,
        freeSpace: 25,
        labels: [4],
        template: 2
    }
];