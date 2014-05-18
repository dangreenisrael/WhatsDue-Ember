/**
 * Created by dan on 2014-05-13.
 */

App.CoursesController = Ember.ObjectController.extend({
    actions: {
        addCourse: function(course) {
            course = course.course;
            addRecentlyUnRemovedCourse(course.id)
            course.set('enrolled', true);
            course.save();
        }
    }
});


App.EnrolledController = Ember.ObjectController.extend({
    actions: {
        removeCourse: function(course) {
            course = course.course;
            addRecentlyRemovedCourse(course.id);
            course.set('enrolled', false);
            course.save();
        }
    }
});

