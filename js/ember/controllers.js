/**
 * Created by dan on 2014-05-13.
 */

App.CoursesController = Ember.ObjectController.extend({
    actions: {
        addCourse: function(course) {
            var store = this.store.createRecord('enrolled', {
                courseName: course.get('courseName'),
                courseDescription: course.get('courseDescription'),
                adminId: course.get('adminId'),
                courseId: course.get('courseId')
            });
            store.save();
        }
    }
});



App.EnrolledController = Ember.ObjectController.extend({
    actions: {
        removeCourse: function(course) {
            course.destroyRecord();
        }
    }
});

