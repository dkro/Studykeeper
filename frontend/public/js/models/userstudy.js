StudyManager.Userstudy = DS.Model.extend({
    title: DS.attr('string'),
    description: DS.attr('string'),
    fromDate: DS.attr('isodate'),
    untilDate: DS.attr('isodate'),
    location: DS.attr('string'),
    link: DS.attr('string'),
    compensation: DS.attr('number'),
    mmi: DS.attr('number'),
    closed: DS.attr('boolean'),
    executor: DS.belongsTo('user', { async: true, inverse: 'isExecutorFor' }),
    tutor: DS.belongsTo('user', { async: true, inverse: 'isTutorFor' }),
    isHistoryFor: DS.hasMany('user', { async: true, inverse: 'studyHistory' }),
    isFutureStudyFor: DS.hasMany('user', { async: true, inverse: 'futureRegisteredStudies' })
});

StudyManager.Userstudy.FIXTURES = [
    {
        id: 1,
        title: 'Studie 0',
        description: 'This study is totally awesome. I really like it. I loooooooooooooooveeeeee it.',
        fromDate: '20.09.2011',
        untilDate: '21.09.2011',
        location: 'Hauptgebäude, Raum 045',
        link: 'http://www.google.com',
        compensation: 5,
        mmi: 2,
        closed: true,
        executor: 1,
        tutor: 1,
        isHistoryFor: [2],
        isFutureStudyFor: []
    },
    {
        id: 2,
        title: 'Studie A Studie A Studie A Studie A Studie A Studie A',
        description: 'Short description.',
        fromDate: '20.09.2015',
        untilDate: '21.09.2015',
        location: 'Hauptgebäude, Raum 045',
        link: 'http://www.google.com',
        compensation: 10,
        mmi: 3,
        closed: false,
        executor: 1,
        tutor: 1,
        isHistoryFor: [2],
        isFutureStudyFor: []
    },
    {
        id: 3,
        title: 'Studie B',
        description: 'Description. Description. Description. Description. Description. Description. Description. Description. ' +
                     'Description. Description. Description. Description. Description. Description. Description. Description. Description. ' +
                     'Description. Description. Description. Description. Description. Description. Description. Description. Description. ',
        fromDate: '10.03.2012',
        untilDate: '21.09.2012',
        location: 'Amalienstraße, Raum 5',
        link: 'http://www.ifi.lmu.de',
        compensation: 5,
        mmi: 1,
        closed: true,
        executor: 2,
        tutor: 2,
        isHistoryFor: [1],
        isFutureStudyFor: []
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
        location: 'Schellingstraße 3, Raum 012',
        link: 'http://www.lmu.de',
        compensation: 20,
        mmi: 4,
        closed: true,
        executor: 2,
        tutor: 2,
        isHistoryFor: [1],
        isFutureStudyFor: []
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
        location: 'Hauptgebäude, Raum B145',
        link: 'http://www.sueddeutsche.de',
        compensation: 5,
        mmi: 2,
        closed: false,
        executor: 2,
        tutor: 2,
        isHistoryFor: [],
        isFutureStudyFor: [1, 2]
    }
];