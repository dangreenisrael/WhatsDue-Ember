/**
 * Created by dan on 2014-05-13.
 */

window.App = Ember.Application.create();

App.ApplicationAdapter = DS.LSAdapter.extend({
    namespace: 'whatsdue'
});

App.Store = DS.Store.extend({

});

App.inject('controller', 'store', 'store:main')