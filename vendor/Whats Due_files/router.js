/**
 * Created by dan on 2014-05-13.
 */

App.Router.map(function(){
    this.route('enrolled', {path: '/courses/enrolled'});
    this.resource('courses', {path:'/courses/all'}, function() {
        this.resource('course', { path: '/:course_adminID/:course_courseId' });
    });
    this.route('assignments', {path: '/'}, function(){
        this.resource('assignments', {path: '/:assignment_assignmentID'});
    })
});

App.ApplicationRoute = Ember.Route.extend({
    model: function() {
    }
});

App.CoursesRoute = Ember.Route.extend({
    model: function() {
        var headers = {
            "timestamp":"1"
            };
        getUpdates("/all/courses", this, 'course', headers)
        return this.store.find('course',{'enrolled':false});
    }
});

App.EnrolledRoute=Ember.Route.extend({
    model: function() {
        return this.store.find('course',{'enrolled':true});
    }
});

App.AssignmentsRoute = Ember.Route.extend({
    model: function() {
        //deleteAll(this, 'assignment')
        updateAssignments(this)
        return this.store.find('assignment');
    }
});
