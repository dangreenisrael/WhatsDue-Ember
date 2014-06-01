/**
 * Created by dan on 2014-05-13.
 */

App.CoursesProfileController = Ember.ObjectController.extend({
    needs:   'assignment',
    actions: {
        changeCourse: function() {
            var assignments = this.get('controllers.assignment').store.find('assignment',{'course_id':this.get('id') });
            var course = this.get('model');
            //addRecentlyUnRemovedCourse(course.store.find());
            course.set('enrolled', true);
            course.save();
            getUpdates('/assignments', parent, 'assignment', {'courses': "[" + this.get('id') + "]"});
            this.transitionToRoute('assignments');
            $('.app').removeClass('move-right off-canvas');
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

App.AssignmentController = Ember.ObjectController.extend({

});