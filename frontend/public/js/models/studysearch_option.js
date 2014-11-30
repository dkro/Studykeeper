StudyManager.SearchOption = DS.Model.extend({
    name: DS.attr('string')
});

StudyManager.SearchOption.FIXTURES = [
    {
        id: 1,
        name: 'Option A'
    },
    {
        id: 2,
        name: 'Option B'
    },
    {
        id: 3,
        title: 'Option C'
    },
    {
        id: 4,
        title: 'Option D'
    }
];