/**
 * Created by dan on 2014-05-13.
 */

Whatsdue.Router.map(function(){
    this.resource('dashboard', {path: '/'});
    this.resource('courses', function() {
        this.resource('course', { path: '/:course_adminID/:course_courseId' });
    });
});



Whatsdue.CoursesRoute = Ember.Route.extend({
    model: function() {
        return this.store.find('Courses');
    }
});



/** Theme Scripts that have to be run after ember templates load **/


Whatsdue.CoursesView = Ember.View.extend({
    didInsertElement: function() {
        Ember.run.schedule('afterRender', this, 'processChildElements');
    },
    processChildElements: function() {
        // do here what you want with the DOM
        toggle();
    }
});




function toggle(){
    $( ".panel-heading" ).click(function() {
        if ($( this).next().css( "display")=="block"){
            $(this).next().toggle('fast');
        }
        else{
            $( ".panel-collapse").hide('fast');
            $(this).next().toggle('fast');
        }
    });
}