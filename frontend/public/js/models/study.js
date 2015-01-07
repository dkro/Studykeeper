StudyManager.Study = DS.Model.extend({
    name: DS.attr('string'),
    tutor: DS.attr('string'),
    executor: DS.attr('string'),
    description: DS.attr('string'),
    from: DS.attr('isodate'),
    to: DS.attr('isodate'),
    location: DS.attr('string'),
    doodle: DS.attr('string'),
    amazon: DS.attr('number'),
    mmi: DS.attr('number'),
    expired: DS.attr('boolean')
});

StudyManager.Study.FIXTURES = [
    {
        id: 0,
        name: 'Studie 0',
        tutor: 'Tutor 0',
        executor: 'Person 0',
        description: 'This study is totally awesome. I really like it. I loooooooooooooooveeeeee it.',
        from: '20.09.2011',
        to: '21.09.2011',
        location: 'Hauptgebäude, Raum 045',
        doodle: 'http://www.google.com',
        amazon: 5,
        mmi: 2,
        expired: true
    },
    {
        id: 1,
        name: 'Studie A ist super etc und es macht keinen Sinn, was ich hier schreibe',
        tutor: 'Tutor A',
        executor: 'Person A',
        description: 'Short description.',
        from: '20.09.2015',
        to: '21.09.2015',
        location: 'Hauptgebäude, Raum 045',
        doodle: 'http://www.google.com',
        amazon: 10,
        mmi: 3,
        expired: false
    },
    {
        id: 2,
        name: 'Studie B',
        tutor: 'Tutor B',
        executor: 'Person B',
        description: 'Description. Description. Description. Description. Description. Description. Description. Description. ' +
                     'Description. Description. Description. Description. Description. Description. Description. Description. Description. ' +
                     'Description. Description. Description. Description. Description. Description. Description. Description. Description. ',
        from: '10.03.2012',
        to: '21.09.2012',
        location: 'Amalienstraße, Raum 5',
        doodle: 'http://www.ifi.lmu.de',
        amazon: 5,
        mmi: 1,
        expired: false
    },
    {
        id: 3,
        name: 'Studie C',
        tutor: 'Tutor C',
        executor: 'Person C',
        description: 'TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST' +
                     'TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST' +
                     'TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST' +
                     'TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST' +
                     'TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST',
        from: '02.02.2010',
        to: '15.02.2010',
        location: 'Schellingstraße 3, Raum 012',
        doodle: 'http://www.lmu.de',
        amazon: 20,
        mmi: 4,
        expired: true
    },
    {
        id: 4,
        name: 'Studie D',
        tutor: 'Tutor D',
        executor: 'Person D',
        description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut ' +
                     'labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ' +
                     'ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor ' +
                     'sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, ' +
                     'sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus ' +
                     'est Lorem ipsum dolor sit amet.',
        from: '08.09.2015',
        to: '27.09.2015',
        location: 'Hauptgebäude, Raum B145',
        doodle: 'http://www.sueddeutsche.de',
        amazon: 5,
        mmi: 2,
        expired: false
    }
];