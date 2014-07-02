    /**
 * Created by dan on 2014-05-13.
 */

App.Router.map(function(){
    this.resource('enrolled', function(){
        this.route('profile', { path: "/:id" });
    });

    this.resource('unenrolled', function(){
        this.route('profile', { path: "/:id" });
    });

    this.resource('assignments', {path: '/'}, function(){
        this.route('info', {path: '/:id'});
    });

    this.resource('completedAssignments', function(){
        this.route('info', {path: '/:id'});
    });
});

App.UnenrolledRoute = Ember.Route.extend({
    model: function() {
        var headers = {
            };
        getUpdates("/all/courses", this, 'course', headers);
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
        return this.store.find('assignment');
    }
});

App.CompletedAssignmentsRoute = Ember.Route.extend({
    model: function() {
        updateAssignments(this);
        setTitle('Recently Completed');
        return this.store.find('assignment', {'enrolled': true, 'completed':true});
    }
});
