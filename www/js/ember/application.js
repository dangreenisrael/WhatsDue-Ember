/**
 * Created by dan on 2014-05-13.
 */

window.App = Ember.Application.create();

App.ApplicationAdapter = DS.LSAdapter.extend({
    namespace: 'whatsdue'
});

App.Store = DS.Store.extend({

});

Ember.onLoad('Ember.Application', function (Application) {
    Application.initializer({
        name: "initializerOne",
        after: "store",

        initialize: function (container, application) {
            var store = container.lookup('store:main');
            // Now you can inject store to component outside of Ember
        }
    });
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

 */

