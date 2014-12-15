StudyManager.DashboardStudy = DS.Model.extend({
    name: DS.attr('string'),
    date: DS.attr('string'),
    location: DS.attr('string'),
    dashboard: DS.belongsTo('dashboardData')
});

StudyManager.DashboardStudy.FIXTURES = [
    {
        id: 1,
        name: "Studie A",
        date: "20.09.2015",
        location: "Hauptgebäude, Raum 045",
        dashboard: 1
    },
    {
        id: 2,
        name: "Studie B",
        date: "25.06.2015",
        location: "Amalienstraße, Raum 5",
        dashboard: 1
    },
    {
        id: 3,
        name: "Studie C",
        date: "11.03.2015",
        location: "Schellingstraße 3, Raum 012",
        dashboard: 1
    },
    {
        id: 4,
        name: "Studie D",
        date: "06.07.2015",
        location: "Hauptgebäude, Raum B145",
        dashboard: 1
    },
    {
        id: 5,
        name: "Studie X",
        date: "20.09.2015",
        location: "Hauptgebäude, Raum 045",
        dashboard: 1
    },
    {
        id: 6,
        name: "Studie Y",
        date: "25.06.2015",
        location: "Amalienstraße, Raum 5",
        dashboard: 1
    }
];