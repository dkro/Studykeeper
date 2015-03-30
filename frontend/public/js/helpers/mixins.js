/**
 * Providing global and reusable helper functions for filtering.
 */
StudyManager.TableFilterMixin = Ember.Mixin.create({
    firstContainsSecondString: function(first, second) {
        return first.toLowerCase().indexOf(second.toLowerCase()) > -1;
    },

    objectsAreEqual: function(object1, object2) {
        return object1 === object2;
    },

    parseDate: function(input) {
        var parts = input.match(/(\d+)/g);
        return new Date(parts[2], parts[1]-1, parts[0], 12, 0, 0, 0);
    },

    compareDates: function(date1, date2) {
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        return (
            isFinite(date1=this.parseDate(date1).valueOf()) &&
            isFinite(date2=this.parseDate(date2).valueOf()) ?
            (date1>date2)-(date1<date2) :
                NaN
        );
    },

    dateIsInRange:function(date, startRange, endRange) {
        return (
            isFinite(date=this.parseDate(date).valueOf()) &&
            isFinite(startRange=this.parseDate(startRange).valueOf()) &&
            isFinite(endRange=this.parseDate(endRange).valueOf()) ?
            startRange <= date && date <= endRange :
                NaN
        );
    }
});