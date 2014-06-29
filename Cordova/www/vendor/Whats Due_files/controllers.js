/**
 * Created by dan on 2014-05-13.
 */

App.CoursesController = Ember.ObjectController.extend({
    actions: {
        addCourse: function(action) {
            var course = action;
            console.log(course)
            course.set('enrolled', true);
            course.save();
            course.deleteRecord();
            course.rollback();
        }
    }
});



App.EnrolledController = Ember.ObjectController.extend({
    actions: {
        removeCourse: function(course) {
            console.log(1)
            course.set('enrolled', false);
            course.save();
        }
    }
});

