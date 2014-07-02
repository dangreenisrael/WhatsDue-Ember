/**
 * Created by dan on 2014-05-13.
 */

App.ApplicationController = Ember.Controller.extend({
    actions: {
        reset: function() {
            deleteAll(this, 'assignment');
            deleteAll(this, 'course');
            localStorage.setItem("timestamp_assignment", 0);
            localStorage.setItem("timestamp_course", 0);
            var headers = {
                sendAll:true
            };
            getUpdates("/all/courses", this, 'course', headers);
        }
    }
});


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

App.EnrolledController = Ember.ArrayController.extend({
    content:[],
    filteredData: (function() {
        return this.get('content').filterBy('enrolled', true)
    }).property('content.@each.enrolled')
});

App.UnenrolledController = Ember.ArrayController.extend({
    content:[],
    filteredData: (function() {
        return this.get('content').filterBy('enrolled', false)
    }).property('content.@each.enrolled')
});


App.AssignmentsInfoController = Ember.ObjectController.extend({
    actions: {
        removeAssignment: function() {
            var assignment = this.get('model');
            assignment.set('completed', true);
            assignment.set('date_completed', Date.now())
            assignment.save();
            this.transitionToRoute('completedAssignments').then(function(){
                $('.app').removeClass('move-right off-canvas');
            });
        }
    }
});

App.CompletedAssignmentsController = Ember.ObjectController.extend({

});

App.AssignmentController = Ember.ObjectController.extend({

});

App.AssignmentsController = Ember.ArrayController.extend({
    sortProperties: ['due_date'],
    filteredData: (function() {
        return this.get('content').filterBy('completed',false)
    }).property('content.@each.completed')
});

App.CompletedAssignmentsController = Ember.ArrayController.extend({
    sortProperties: ['date_completed'],
    sortAscending:  false,
    actions: {
        unRemoveAssignment: function(assignment) {
            assignment.set('completed', false);
            assignment.set('date_completed', null)
            assignment.save();
            this.transitionToRoute('assignments').then(function(){
            });
        }
    }
});


