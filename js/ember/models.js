/**
 * Created by dan on 2014-05-13.
 */

App.Course = DS.Model.extend({
    course_name:         DS.attr('string'),
    course_description:  DS.attr('string'),
    admin_id:            DS.attr('string'),
    course_id:           DS.attr('number'),
    enrolled:            DS.attr('boolean', {defaultValue: false})
});

App.CourseAdapter = DS.LSAdapter.extend({
    namespace: 'whatsdue-courses'
});

App.Assignment = DS.Model.extend({
    assignment_name:    DS.attr('string'),
    course_id:          DS.attr('number'),
    created_at:         DS.attr('number'),
    description:        DS.attr('string'),
    due_date:           DS.attr('string'),
    last_modified:      DS.attr('number'),
    last_updated:       DS.attr('number'),
    enrolled:           DS.attr('boolean', {defaultValue: true}),
    completed:          DS.attr('boolean', {defaultValue: false}),
    dueDate: function() {
      return moment(this.get('due_date')).fromNow()
    }.property('due_date')
});

App.AssignmentAdapter = DS.LSAdapter.extend({
    namespace: 'whatsdue-assignment'
});