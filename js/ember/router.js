    /**
 * Created by dan on 2014-05-13.
 */

App.Router.map(function(){
    this.resource('enrolled', function(){
    });

    this.resource('unenrolled', function(){
    });

    this.resource('assignments', {path: '/'}, function(){
    });

    this.resource('completedAssignments', function(){
    });

    this.resource('support', function(){
    })
});


App.Route = Ember.Route.extend({

});

App.SupportRoute = Ember.Route.extend({
    model: function(){

        setTitle('Support');
    }
});

App.UnenrolledRoute = Ember.Route.extend({
    model: function() {
        updateCourses(this);
        setTitle('Add Courses');
        return this.store.find('course');
    }
});

App.EnrolledRoute = Ember.Route.extend({
    model: function() {
        setTitle('My Courses');
        return this.store.find('course');
    }
});

App.AssignmentsRoute = Ember.Route.extend({
    model: function() {
        updateAssignments(this);
        setTitle('Assignments Due');
        return this.store.find('assignment')
    },
    actions: {
        invalidateModel: function() {
            Ember.Logger.log('Route is now refreshing...');
            swipeRemove();
            assignmentCount();
            this.refresh();
        }
    },
    afterModel: function() {

    }
});

App.CompletedAssignmentsRoute = Ember.Route.extend({
    model: function() {
        updateAssignments(this);
        setTitle('Recently Completed');
        return this.store.find('assignment');
    },
    afterModel: function() {
        putBackable();
    }
});
