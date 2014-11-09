/**
 * Created by dan on 2014-05-13.
 */

App.Course = DS.Model.extend({
    course_name:         DS.attr('string'),
    instructor_name:     DS.attr('string'),
    admin_id:            DS.attr('string'),
    last_modified:       DS.attr('number'),
    created_at:          DS.attr('number'),
    enrolled:            DS.attr('boolean', {defaultValue: false}),
    archived:            DS.attr('boolean', {defaultValue: false}),
    assignments:         DS.hasMany('assignment'),
    hidden: function(){
        if (this.get('archived') == true){
            return "hidden";
        }
        else{
            return " ";
        }
    }.property('archived')
});

App.CourseAdapter = DS.LSAdapter.extend({
    namespace: 'whatsdue-courses'
});


App.Assignment = DS.Model.extend({
    assignment_name:    DS.attr('string'),
    description:        DS.attr('string',{defaultValue: " "}),
    created_at:         DS.attr('number'),
    due_date:           DS.attr('string'),
    last_modified:      DS.attr('number'),
    archived:           DS.attr('boolean'),
    last_updated:       DS.attr('number', {defaultValue: null}),
    date_completed:     DS.attr('number', {defaultValue: null}),
    enrolled:           DS.attr('boolean', {defaultValue: true}),
    completed:          DS.attr('boolean', {defaultValue: false}),
    course_id:          DS.belongsTo('course', {async:true}),
    overdue: function(){
        return moment().isAfter(this.get('due_date'));
    }.property('due_date'),
    daysAway: function(){
        return moment(this.get('due_date')).calendar()
    }.property('due_date'),
    timeDue: function(){
        return moment(this.get('due_date')).format('h:mm A');
    }.property('due_date'),
    fromNow: function() {
      return moment(this.get('due_date')).fromNow()
    }.property('due_date'),
    urgencyLabel: function() {
        var now = moment();
        var gap = moment(this.get('due_date'));
        gap = gap.diff(now, 'hours')
        if((gap < 24) && (gap > 0)){
            return "red";
        }
        else if (gap <= 0){
            return "orange";
        }
        else{
            return "white";
        }
    }.property('due_date')
});

App.AssignmentAdapter = DS.LSAdapter.extend({
    namespace: 'whatsdue-assignment'
});