/**
 * Created by dan on 2014-05-13.
 */

window.App = Ember.Application.create();

App.ApplicationAdapter = DS.LSAdapter.extend({
    namespace: 'whatsdue'
});

App.Store = DS.Store.extend({

});

App.Pollster = Ember.Object.extend({
    start: function(){
        this.timer = setInterval(this.onPoll, 15000);
    },
    stop: function(){
        clearInterval(this.timer);
    },
    onPoll: function(){
        // This gets defined when its called
    }
});


/// *** Debugging - Remove from production ***///
/*
App.__container__.lookup('store:main').push('Course', {
        id: 100,
        course_name: 'dummy course',
        course_description: 'some Course',
        admin_id: 123,
        enrolled: false,
        assignments: 'ass'
    });

 App.__container__.lookup('store:main').push('Assignment', {
     id: 123,
     assignment_name:    "dummy assignment",
     created_at:         1400347327,
     description:        "demo content",
     due_date:           "2014-05-06 09:45",
     last_modified:      1400347327,
     last_updated:       "",
     course_id:          2,
     date_completed:     "",
     enrolled:           true,
     completed:          false,
     owner:              2
 });

 */

