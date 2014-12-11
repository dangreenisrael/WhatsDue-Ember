/**
 * Created by dan on 2014-05-13.
 */

App.ApplicationController = Ember.Controller.extend({
    actions: {
        reset: function() {
            localStorage.removeItem('courses');
            localStorage.removeItem("timestamp_assignment");
            localStorage.removeItem("timestamp_course");
            deleteAll(this, 'assignment');
            deleteAll(this, 'course');
        }
    },
    init: function() {

        if (localStorage.getItem('timestamp_course')==null){
            localStorage.setItem('timestamp_course',0);
        }
        if (localStorage.getItem('timestamp_assignment')==null){
            localStorage.setItem('timestamp_assignment',0);
        }

        var context = this;
        if (Ember.isNone(this.get('pollster')) ){
            this.set('pollster', App.Pollster.create({
                onPoll: function() {
                    updateAssignments(context);
                    updateCourses(context);
                }
            }));
        }
        this.get('pollster').start();

        //This updates record on push notifications
        window.addEventListener('updatedAssignment', function () {
            updateAssignments(context);
        });

        if (localStorage.getItem('courses') == null){
            this.transitionToRoute('enrolled').then(function(){})
        }
    }
});

App.AssignmentsController = Ember.ArrayController.extend({
    due:(function() {
        var context = this;
        setTimeout(function(){
            var total = context.get('model').filterBy('archived',false).filterBy('completed',false).length;
            if(total == 0){
                $('.nothing-due').removeClass('hidden');
                $('.day-divider').addClass('hidden');

            }else{
                $('.nothing-due').addClass('hidden');
                $('.day-divider').removeClass('hidden');

            }
        }, 5);
        return this.get('model').filterBy('completed',false).filterBy('archived',false).filterBy('overdue',false).sortBy('due_date');
    }).property('model.@each.due_date', 'model.@each.archived'),

    totalDue: function() {
        return this.get('due.length');
    }.property('model.@each.due_date', 'model.@each.archived'),
    totalOverdue: function() {
        return this.get('overdue.length');
    }.property('model.@each.due_date', 'model.@each.archived'),
    overdue:(function() {
        return this.get('model').filterBy('completed',false).filterBy('archived',false).filterBy('overdue',true).filterBy('hidden',false).sortBy('due_date');
    }).property('model.@each.due_date', 'model.@each.archived'),
    actions: {
        removeAssignment: function(assignment) {
            var context = this;
            trackEvent('Assignment Completed');
            this.store.find('setReminder',{'assignment': assignment.get('id')}).then(function(setReminders){
                removeSetReminders(setReminders);
                assignment.set('completed', true);
                assignment.set('date_completed', Date.now());
                assignment.save();
                context.send('invalidateModel');
            });
        },
        getLatest: function() {
            this.send('invalidateModel');
        }
    }
});

App.CompletedAssignmentsController = Ember.ArrayController.extend({
    filteredData: (function() {
        return this.get('model').filterBy('completed',true).sortBy('date_completed')
    }).property('model.@each.archived'),
    sortAscending:  false,
    actions: {
        unRemoveAssignment: function(assignment) {
            var context = this;
            this.store.find('reminder').then( function(reminders) {
                reminders.get('content').forEach(function(reminder){
                    setReminder(assignment, reminder, context);
                });
                assignment.set('completed', false);
                assignment.set('date_completed', null);
                assignment.set('times_changed',assignment.get('times_changed')+1);
                assignment.save();
            });
        }
    }
});

App.EnrolledController = Ember.ArrayController.extend({
    model:[],
    filteredData: (function() {
        this.set('sortProperties', 'admin_id');
        return this.get('model').filterBy('enrolled', true).sortBy('admin_id', 'course_name');
    }).property('model.@each.enrolled'),
    actions: {
        removeCourse: function(course) {
            var context = this;
            $.ajax({
                url: site+"/courses/"+course.get('id') +"/unenrolls",
                type: 'POST',
                data: {"primaryKey":localStorage.getItem('primaryKey')},
                success: function (response) {
                    course.set('enrolled', false);
                    course.save();
                    context.store.find('assignment',{'course_id':course.get('id')}).then(function(assignments){
                        assignments.content.forEach(function(assignment) {
                            Ember.run.once(context, function() {
                                this.store.find('setReminder',{'assignment': assignment.get('id')}).then(function(setReminders){
                                    removeSetReminders(setReminders);
                                    assignment.destroyRecord();
                                });
                            });
                        }, context);
                    });
                    trackEvent('Course Removed', 'Course Name', course.get('course_name'))
                    // Remove Course from local storage
                    var courses = localStorage.getItem('courses');

                    courses = courses.split(',');

                    if (courses.length <= 1) {
                        localStorage.removeItem('courses');
                    } else{
                        // Find and remove courseId from array
                        var i = courses.indexOf(course.get('id'));
                        if(i != -1) {
                            courses.splice(i, 1);
                        }
                        var serialized = courses.toString();
                        localStorage.setItem('courses', serialized);
                    }

                },
                error: function(){
                }
            });

        }
    }
});

App.UnenrolledController = Ember.ArrayController.extend({
    model:[],
    filteredData: (function() {
        return this.get('model').filterBy('enrolled', false).sortBy('admin_id', 'course_name');
    }).property('model.@each.enrolled'),
    actions: {
        addCourse: function(course) {
            var context = this;
            $.ajax({
                url: site+"/courses/"+course.get('id')+"/enrolls",
                type: 'POST',
                data: {"primaryKey":localStorage.getItem('primaryKey')},
                success: function (response) {
                    course.set('enrolled', true);
                    course.save();

                    getUpdates('/assignments', context, 'assignment', {
                        'courses': "[" + course.get('id') + "]",
                        'sendAll': true
                    }, true);

                    // Add course to local storage;
                    var courses = localStorage.getItem('courses');
                    if (courses !== null) {
                        courses = courses + "," + course.get('id');
                        localStorage.setItem('courses', courses);
                    } else{
                        localStorage.setItem('courses', course.get('id'));
                    }
                    //
                    context.transitionToRoute('enrolled').then(function(){
                        trackEvent('Course Added', 'Course Name', course.get('course_name'), 'Username', course.get('admin_id'));
                    });
                },
                error: function(){
                    alert("Are you connected to the Internet?");
                    trackEvent('Course Adding Failed');
                }
            });
        }
    }
});


App.MessagesController = Ember.ArrayController.extend({
    sortProperties: ['updated_at'],
    sortAscending: false
});

App.RemindersController = Ember.ObjectController.extend({
    actions: {
        add: function () {
            var newReminders = $('#new-reminder');
            var time = parseInt(newReminders.find('.time').val());
            var context = this;
            if(( time >0) && (this.get('model.length') <3) ) {
                var timeFrame = newReminders.find('.time-frame').val();
                var seconds = 0;
                if (timeFrame == "days") {
                    seconds = time * 86400;
                } else if (timeFrame = "hours") {
                    seconds = time * 3600;
                }

                /* Prevent Duplicates */
                this.store.find('reminder', {seconds_before: seconds}).then(function(total){
                   if (total.get('length') == 0){
                       var reminder = context.store.createRecord('reminder', {
                           id: primaryKey('reminders'),
                           seconds_before: seconds
                       });
                       reminder.save().then(
                           putBackable()
                       );
                       $('input').val("");
                       context.store.find('assignment',{completed:false}).then( function(assignments) {
                           assignments.get('content').forEach(function(assignment){
                               setReminder(assignment, reminder, context);
                           });
                       });
                   }
                });
            }

            /* Fix Keyboard */
            if(cordovaLoaded==true){
                setTimeout(function(){
                    cordova.plugins.Keyboard.close();
                }, 1)

            }

        },
        remove: function(reminder){
            this.store.find('setReminder',{'reminder': reminder.get('id')}).then(function(setReminders){
                removeSetReminders(setReminders);
                reminder.destroyRecord();
            });
        }
    },
    total: function() {
        return this.get('model.length');
    }.property('[]')
});
