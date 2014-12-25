StudyManager.DashboardData = DS.Model.extend({
    registeredStudies: DS.hasMany('study', { async: true }),
    createdStudies: DS.hasMany('study', { async: true })
});

StudyManager.DashboardData.FIXTURES = [
    {
        id: 1,
        registeredStudies: [0, 1, 2],
        createdStudies: [3, 4]
    }
];
