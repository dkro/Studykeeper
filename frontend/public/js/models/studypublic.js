StudyManager.Studypublic = DS.Model.extend({
    title: DS.attr('string'),
    description: DS.attr('string'),
    fromDate: DS.attr('isodate'),
    untilDate: DS.attr('isodate'),
    tutorFirstname: DS.attr('string'),
    tutorLastname: DS.attr('string'),
    tutorEmail: DS.attr('string'),
    executorFirstname: DS.attr('string'),
    executorLastname: DS.attr('string'),
    executorEmail: DS.attr('string'),
    location: DS.attr('string'),
    link: DS.attr('string'),
    compensation: DS.attr('string'),
    mmi: DS.attr('number'),
    closed: DS.attr('boolean'),
    labels: DS.attr('array'),
    templateKeysToValues: DS.attr('array')
});

StudyManager.Studypublic.FIXTURES = [
    {
        id: 1,
        title: 'Studie 0',
        description: 'This study is totally awesome. I really like it. I loooooooooooooooveeeeee it.',
        fromDate: '20.09.2011',
        untilDate: '21.09.2011',
        tutorFirstname: 'Max',
        tutorLastname: 'Mustermann',
        tutorEmail: 'mustermann@campus.lmu.de',
        executorFirstname: 'Max',
        executorLastname: 'Mustermann',
        executorEmail: 'mustermann@campus.lmu.de',
        location: 'Hauptgebäude, Raum 045',
        link: 'http://www.google.com',
        compensation: "5€ Amazon-Gutschein",
        mmi: 2,
        closed: true,
        labels: ['Option A', 'Option B'],
        templateKeysToValues: [
            {title: 'A1', value: 'Studie0_A1_Value'},
            {title: 'A2', value: 'Studie0_A2_Value'}
        ]
    },
    {
        id: 2,
        title: 'Studie A Studie A Studie A Studie A Studie A Studie A',
        description: 'Short description.',
        fromDate: '20.09.2015',
        untilDate: '21.09.2015',
        tutorFirstname: 'Max',
        tutorLastname: 'Mustermann',
        tutorEmail: 'mustermann@campus.lmu.de',
        executorFirstname: 'Max',
        executorLastname: 'Mustermann',
        executorEmail: 'mustermann@campus.lmu.de',
        location: 'Hauptgebäude, Raum 045',
        link: 'http://www.google.com',
        compensation: "10€ Amazon-Gutschein",
        mmi: 3,
        closed: false,
        labels: ['Option B'],
        templateKeysToValues: [
            {title: 'A1', value: 'StudieA_A1_Value'},
            {title: 'A2', value: 'StudieA_A2_Value'}
        ]
    },
    {
        id: 3,
        title: 'Studie B',
        description: 'Description. Description. Description. Description. Description. Description. Description. Description. ' +
        'Description. Description. Description. Description. Description. Description. Description. Description. Description. ' +
        'Description. Description. Description. Description. Description. Description. Description. Description. Description. ',
        fromDate: '10.03.2012',
        untilDate: '21.09.2012',
        tutorFirstname: 'Max2',
        tutorLastname: 'Mustermann2',
        tutorEmail: 'mustermann2@campus.lmu.de',
        executorFirstname: 'Max2',
        executorLastname: 'Mustermann2',
        executorEmail: 'mustermann2@campus.lmu.de',
        location: 'Amalienstraße, Raum 5',
        link: 'http://www.ifi.lmu.de',
        compensation: "5€ Amazon-Gutschein",
        mmi: 1,
        closed: true,
        labels: [],
        templateKeysToValues: [
            {title: 'A1', value: 'StudieB_A1_Value'},
            {title: 'A2', value: 'StudieB_A2_Value'}
        ]
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
        tutorFirstname: 'Max2',
        tutorLastname: 'Mustermann2',
        tutorEmail: 'mustermann2@campus.lmu.de',
        executorFirstname: 'Max2',
        executorLastname: 'Mustermann2',
        executorEmail: 'mustermann2@campus.lmu.de',
        location: 'Schellingstraße 3, Raum 012',
        link: 'http://www.lmu.de',
        compensation: "20€ Amazon-Gutschein",
        mmi: 4,
        closed: true,
        labels: ['Option A', 'Option B', 'Option C'],
        templateKeysToValues: [
            {title: 'B1', value: 'StudieC_B1_Value'},
            {title: 'B2', value: 'StudieC_B2_Value'}
        ]
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
        tutorFirstname: 'Max2',
        tutorLastname: 'Mustermann2',
        tutorEmail: 'mustermann2@campus.lmu.de',
        executorFirstname: 'Max2',
        executorLastname: 'Mustermann2',
        executorEmail: 'mustermann2@campus.lmu.de',
        location: 'Hauptgebäude, Raum B145',
        link: 'http://www.sueddeutsche.de',
        compensation: "5€ Amazon-Gutschein",
        mmi: 2,
        closed: false,
        labels: ['Option D'],
        templateKeysToValues: [
            {title: 'B1', value: 'StudieD_B1_Value'},
            {title: 'B2', value: 'StudieD_B2_Value'}
        ]
    }
];