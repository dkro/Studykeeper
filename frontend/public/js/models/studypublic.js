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
    labels: DS.hasMany('label', { async: true }),
    template: DS.belongsTo('template', { async: true }),
    templateValues: DS.attr('array')
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
        labels: [1, 2],
        template: 1,
        templateValues: ['Studie0_A1_Value', 'Studie0_A2_Value']
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
        labels: [2],
        template: 1,
        templateValues: ['StudieA_A1_Value', 'StudieA_A2_Value']
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
        labels: [],
        template: 1,
        templateValues: ['StudieB_A1_Value', 'StudieB_A2_Value']
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
        labels: [1, 2, 3],
        template: 2,
        templateValues: ['StudieC_B1_Value', 'StudieC_B2_Value']
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
        labels: [4],
        template: 2,
        templateValues: ['StudieD_B1_Value', 'StudieD_B2_Value']
    }
];