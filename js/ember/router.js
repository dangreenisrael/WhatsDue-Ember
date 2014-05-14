/**
 * Created by dan on 2014-05-13.
 */

App.Router.map(function(){
    this.route('dashboard', {path: '/'});
    this.route('enrolled', {path: '/courses/enrolled'});
    this.resource('courses', {path:'/courses/all'}, function() {
        this.resource('course', { path: '/:course_adminID/:course_courseId' });
    });
});



App.CoursesRoute = Ember.Route.extend({
    model: function() {
        return this.store.find('course');
    }
});


App.EnrolledRoute=Ember.Route.extend({
    model: function() {
        return this.store.find('enrolled');
    }
})






