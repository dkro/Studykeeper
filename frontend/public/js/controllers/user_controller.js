StudyManager.UserController = Ember.Controller.extend({
    allOptions: ["ABC", "BCDEFGH", "C", "DEFGHIJKL"],

    registeredStudies: [
        {
            name: "Studie A",
            date: "20.09.2015",
            location: "Hauptgebäude, Raum 045"
        },
        {
            name: "Studie B",
            date: "25.06.2015",
            location: "Amalienstraße, Raum 5"
        },
        {
            name: "Studie C",
            date: "11.03.2015",
            location: "Schellingstraße 3, Raum 012"
        },
        {
            name: "Studie D",
            date: "06.07.2015",
            location: "Hauptgebäude, Raum B145"
        }
    ]
});


