/**
 * Created by dan on 2014-05-13.
 */

App.Router.map(function(){

    this.resource('courses', function(){
        this.route('profile', { path: "/:id" });
        this.route('all', {path: "/all"})
    });
    /*this.resource('courses', function(){
        this.route('enrolled', {path: '/enrolled'});
        this.route('new', {path: '/new'});
    })
    */
    /*
    this.resource('course', { path: '/course/:course_id' }, function() {
        this.route('edit');
        this.resource('comments', function() {
            this.route('new');
        });
    });
    */

    this.route('assignments', {path: '/'}, function(){
        this.resource('assignments', {path: '/:assignment_assignmentID'});
    })
});


App.CoursesRoute = Ember.Route.extend({
    model: function() {
        var headers = {
            };
        getUpdates("/all/courses", this, 'course', headers);
        return this.store.find('course');
    }
});



App.CoursesAllRoute = Ember.Route.extend({
    model: function(){
        return this.store.find('course')
    }
});

App.AssignmentsRoute = Ember.Route.extend({
    model: function() {
        //deleteAll(this, 'assignment')
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