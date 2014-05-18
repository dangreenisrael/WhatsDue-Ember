/**
 * Created by dan on 2014-05-17.
 */

App.CourseInfoComponent = Ember.Component.extend({
    actions: {
        chooseCourse: function() {
            this.sendAction('chooseCourse', {
                course: this.get('course')
            });
        }
    }
});