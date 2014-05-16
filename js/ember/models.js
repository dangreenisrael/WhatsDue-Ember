/**
 * Created by dan on 2014-05-13.
 */

App.Course = DS.Model.extend({
    courseName:         DS.attr('string'),
    courseDescription:  DS.attr('string'),
    adminId:            DS.attr('string'),
    courseId:           DS.attr('number'),
    enrolled:           DS.attr('boolean')

});

App.CourseAdapter = DS.RESTAdapter.extend({
    host: 'http://whats.due/app_dev.php',
    namespace: 'all'
});

App.Enrolled = DS.Model.extend({
    courseName:         DS.attr('string'),
    courseDescription:  DS.attr('string'),
    adminId:            DS.attr('string'),
    courseId:           DS.attr('number'),
    assignment:         DS.hasMany('assignment')

});

App.EnrolledAdapter = DS.LSAdapter.extend({
    namespace: 'whatsdue-enrolled'
});

App.Assignment = DS.Model.extend({
    assignment_name:    DS.attr('string'),
    course_id:          DS.attr('number'),
    created_at:         DS.attr('number'),
    description:        DS.attr('string'),
    due_date:           DS.attr('string'),
    last_modified:      DS.attr('number'),
    last_updated:       DS.attr('number'),
    dueDate: function() {
      return moment(this.get('due_date')).fromNow()
    }.property('due_date'),
    enrolled:           DS.belongsTo('enrolled')
});

App.AssignmentAdapter = DS.LSAdapter.extend({
    namespace: 'whatsdue-assignment'
});

