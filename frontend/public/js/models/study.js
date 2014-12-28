StudyManager.Study = DS.Model.extend({
    name: DS.attr('string'),
    executor: DS.attr('string'),
    from: DS.attr('string'),
    to: DS.attr('string'),
    location: DS.attr('string'),
    amazon: DS.attr('number'),
    mmi: DS.attr('number'),
    expired: DS.attr('boolean')
});

StudyManager.Study.FIXTURES = [
    {
        id: 0,
        name: 'Studie 0',
        executor: 'Person 0',
        from: '20.09.2011',
        to: '21.09.2011',
        location: 'Hauptgebäude, Raum 045',
        amazon: 5,
        mmi: 2,
        expired: true
    },
    {
        id: 1,
        name: 'Studie A',
        executor: 'Person A',
        from: '20.09.2015',
        to: '21.09.2015',
        location: 'Hauptgebäude, Raum 045',
        amazon: 10,
        mmi: 3,
        expired: false
    },
    {
        id: 2,
        name: 'Studie B',
        executor: 'Person B',
        from: '10.03.2012',
        to: '21.09.2012',
        location: 'Amalienstraße, Raum 5',
        amazon: 5,
        mmi: 1,
        expired: false
    },
    {
        id: 3,
        name: 'Studie C',
        executor: 'Person C',
        from: '02.02.2010',
        to: '15.02.2010',
        location: 'Schellingstraße 3, Raum 012',
        amazon: 20,
        mmi: 4,
        expired: true
    },
    {
        id: 4,
        name: 'Studie D',
        executor: 'Person D',
        from: '08.09.2015',
        to: '27.09.2015',
        location: 'Hauptgebäude, Raum B145',
        amazon: 5,
        mmi: 2,
        expired: false
    }
];