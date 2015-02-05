StudyManager.Field = DS.Model.extend({
    title: DS.attr('string'),
    value: DS.attr('string'),
    template: DS.belongsTo('template', { async: true })
});

StudyManager.Field.FIXTURES = [
    {
        id: 1,
        title: 'Feld A',
        value: 'Feld A Wert',
        template: 1
    },
    {
        id: 2,
        title: 'Feld B',
        value: 'Feld B Wert',
        template: 1
    },
    {
        id: 3,
        title: 'Feld C',
        value: 'Feld C Wert',
        template: 2
    },
    {
        id: 4,
        title: 'Feld D',
        value: 'Feld D Wert',
        template: 2
    }
];