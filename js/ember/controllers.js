/**
 * Created by dan on 2014-05-13.
 */

App.CoursesController = Ember.ObjectController.extend({
    actions: {
        addCourse: function(course) {
            var store = this.store.createRecord('enrolled', {
                courseId: course.get('courseId'),
                courseDescription: course.get('courseDescription'),
                adminID: course.get('adminID')
            });
            store.save();
            course.deleteRecord();



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



