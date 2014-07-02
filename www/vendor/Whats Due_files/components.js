/**
 * Created by dan on 2014-05-17.
 */

App.CourseInfoComponent = Ember.Component.extend({
    click: function() {
        this.sendAction('action');
    }
});