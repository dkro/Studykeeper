StudyManager.DashboardData = DS.Model.extend({
    registeredStudies: DS.hasMany('dashboardStudy', { async: true }),
    createdStudies: DS.hasMany('dashboardStudy', { async: true })
});

StudyManager.DashboardData.FIXTURES = [
    {
        id: 1,
        registeredStudies: [1, 2, 3, 4],
        createdStudies: [5, 6]
    }
];
