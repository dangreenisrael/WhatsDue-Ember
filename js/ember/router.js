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

    this.route('assignments', {path: '/'}, function(){
        this.resource('assignments', {path: '/:assignment_assignmentID'});
    })
});

App.UnenrolledRoute = Ember.Route.extend({
    model: function() {
        var headers = {
            };
        getUpdates("/all/courses", this, 'course', headers);
        return this.store.find('course', {'enrolled': false});
    }
});

App.EnrolledRoute = Ember.Route.extend({
    model: function() {
        return this.store.find('course', {'enrolled': true});
    }
});

App.AssignmentsRoute = Ember.Route.extend({
    model: function() {
        updateAssignments(this)
        return this.store.find('assignment', {'enrolled': true});
    }
});


Handlebars.registerHelper("debug", function(optionalValue) {
    console.log("Current Context");
    console.log("====================");
    console.log(this);
    if (optionalValue) {
        console.log("Value");
        console.log("====================");
        console.log(optionalValue);
    }
});