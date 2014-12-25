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
        name: 'Option C'
    },
    {
        id: 4,
        name: 'Option D'
    }
];