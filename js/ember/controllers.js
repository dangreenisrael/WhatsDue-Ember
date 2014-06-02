/**
 * Created by dan on 2014-05-13.
 */

App.EnrolledProfileController = Ember.ObjectController.extend({
    needs:   'assignment',
    actions: {
        removeCourse: function() {
            var courseId = Number(this.get('id'));
            var course = this.get('model');
            course.set('enrolled', false);
            course.save();
            this.get('controllers.assignment').store.find('assignment',{'course_id':courseId}).then(function(record){
               record.content.forEach(function(rec) {
                   Ember.run.once(this, function() {
                       rec.deleteRecord();
                       rec.save();
                   });
               }, this);
            });
            this.transitionToRoute('unenrolled').then(function(){
                $('.app').removeClass('move-right off-canvas');
            });
        }
    }
});

App.UnenrolledProfileController = Ember.ObjectController.extend({
    actions: {
        addCourse: function() {
            var course = this.get('model');
            course.set('enrolled', true);
            course.save();

            getUpdates('/assignments', this, 'assignment', {
                'courses': "[" + this.get('id') + "]",
                'sendAll': true
            });
            this.transitionToRoute('enrolled').then(function(){
                $('.app').removeClass('move-right off-canvas');
            });
        }
    }
});

App.AssignmentController = Ember.ArrayController.extend({
});

App.AssignmentInfoController = Ember.ObjectController.extend({

});


App.AssignmentsController = Ember.ArrayController.extend({
    sortProperties: ['due_date']
});

