/**
 * Created by dan on 2014-05-13.
 */

var loaderObj = {

    templates : [
        'application.hbs',
        'assignments.hbs',
        'completedAssignments.hbs',
        'enrolled.hbs',
        'unenrolled.hbs'
    ]
};


loadTemplates(loaderObj.templates);
//This function loads all templates into the view
function loadTemplates(templates) {
    $(templates).each(function() {
        var tempObj = $('<script>');
        tempObj.attr('type', 'text/x-handlebars');
        var dataTemplateName = this.substring(0, this.indexOf('.'));
        tempObj.attr('data-template-name', dataTemplateName);
        $.ajax({
            async: false,
            type: 'GET',
            url: '/templates/' + this,
            success: function(resp) {
                tempObj.html(resp);
                $('body').append(tempObj);
            }
        });
    })
}

var helperObj = {

    templates : [
        'assignments_info.hbs',
        'components_course-profile.hbs'
    ]
};


loadHelpers(helperObj.templates);
//This function loads all templates into the view
function loadHelpers(templates) {
    $(templates).each(function() {
        var tempObj = $('<script>');
        tempObj.attr('type', 'text/x-handlebars');
        var name = this.substring(0, this.indexOf('.'));
        var firstHalf = name.substring(0, name.indexOf('_'));
        var secondHalf = name.substr(name.indexOf("_") + 1);
        var dataTemplateName = firstHalf+"/"+secondHalf;

        tempObj.attr('data-template-name', dataTemplateName);
        $.ajax({
            async: false,
            type: 'GET',
            url: '/templates/' + this,
            success: function(resp) {
                tempObj.html(resp);
                $('body').append(tempObj);
            }
        });
    })
}

var App = Ember.Application.create();



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

