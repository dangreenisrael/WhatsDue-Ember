/**
 * Created by dan on 2014-05-13.
 */

App.Course = DS.Model.extend({
    courseId:           DS.attr('string'),
    courseDescription:  DS.attr('string'),
    adminID:            DS.attr('string')

});

App.CourseAdapter = DS.RESTAdapter.extend({
    host: 'http://admin.whatsdueapp.com',
    namespace: 'all'
});

App.Enrolled = DS.Model.extend({
    courseId:           DS.attr('string'),
    courseDescription:  DS.attr('string'),
    adminID:            DS.attr('string')

});

App.EnrolledAdapter = DS.LSAdapter.extend({
    namespace: 'whatsdue-enrolled'
});
