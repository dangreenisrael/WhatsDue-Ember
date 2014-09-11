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
        console.log('start')

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
                    console.log('poll');
                    updateAssignments(context);
                }
            }));
        }
        this.get('pollster').start();

        //This updates record on push notifications
        window.addEventListener('updatedAssignment', function () {
            updateAssignments(context);
        })
    }
});

App.AssignmentsController = Ember.ArrayController.extend({
    filteredData: (function() {
        return this.get('content').filterBy('completed',false).sortBy('due_date');
    }).property('content.@each'),
    actions: {
        removeAssignment: function(assignment) {

            assignment.set('completed', true);
            assignment.set('date_completed', Date.now())
            assignment.save();


        }
    }

});

App.CompletedAssignmentsController = Ember.ArrayController.extend({
    sortProperties: ['date_completed'],
    sortAscending:  false,
    actions: {
        unRemoveAssignment: function(assignment) {
            assignment.set('completed', false);
            assignment.set('date_completed', null)
            assignment.save();
           // this.transitionToRoute('assignments').then(function(){});
        }
    }
});

App.EnrolledController = Ember.ArrayController.extend({
    content:[],
    filteredData: (function() {
        return this.get('content').filterBy('enrolled', true)
    }).property('content.@each'),
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
                    context.store.find('assignment',{'course_id':course.get('id')}).then(function(record){
                        record.content.forEach(function(rec) {
                            Ember.run.once(context, function() {
                                rec.deleteRecord();
                                rec.save();
                            });
                        }, context);
                    });

                    // Remove Course from local storage
                    var courses = localStorage.getItem('courses');

                    courses = courses.split(',');
                    console.log(courses.length);

                    if (courses.length <= 1) {
                        localStorage.removeItem('courses');
                    } else{
                        // Find and remove courseId from array
                        console.log(this)
                        var i = courses.indexOf(course.get('id'));
                        if(i != -1) {
                            courses.splice(i, 1);
                        }
                        var serialized = courses.toString();
                        localStorage.setItem('courses', serialized);
                    }

                    context.transitionToRoute('unenrolled').then(function(){
                        $('.app').removeClass('move-right off-canvas');
                    });
                },
                error: function(){
                    alert("Please check your internet connection and try again :)")
                }
            });

        }
    }
});

App.UnenrolledController = Ember.ArrayController.extend({
    content:[],
    filteredData: (function() {
        return this.get('content').filterBy('enrolled', false)
    }).property('content.@each'),
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
                    context.transitionToRoute('enrolled').then(function(){
                        $('.app').removeClass('move-right off-canvas');
                    });
                },
                error: function(){
                    alert("Please check your internet connection and try again :)")
                }
            });
        }
    }
});




