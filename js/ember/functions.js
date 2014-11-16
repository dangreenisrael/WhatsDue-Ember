/**
 * Created by dan on 2014-05-15.
 */

var test = false;

if (test == true){
    var site = "http://admin.whatsdueapp.com/app_dev.php/student";
    //var site="http://192.168.1.61/app_dev.php/student";
}else{
    var site="http://teachers.whatsdueapp.com/student";
}
/*
    Analytics
 */

function trackEvent(event, firstOption, firstValue, secondOption, secondValue, thirdOption, thirdValue){

    if (cordovaLoaded == true) {
        firstOption = firstOption || null;
        firstValue = firstValue || null;
        secondOption = secondOption || null;
        secondValue = secondValue || null;
        thirdOption = thirdOption || null;
        thirdValue = thirdValue || null;

        var options = {};
        if (firstOption != null) {
            options[firstOption] = firstValue;
            if (secondOption != null) {
                options[secondOption] = secondValue;
                if (thirdOption != null) {
                    options[thirdOption] = thirdValue;
                }
            }
        }

        //Localytics.tagEvent(event, options, 0);
        console.log('tracked' + event);
    } else{
        console.log(event +" "+options);
    }
}


/** Bringing In Data from the server **/

// This is for getting assignment info
function updateAssignments(context){
    var courses = localStorage.getItem('courses')
    getUpdates('/assignments', context, 'assignment', {
        'courses': "["+courses+"]"
    });
}

function updateCourses(context){
    var headers = {
    };
    if (!localStorage.getItem('timestamp_course')){
        headers.sendAll = true;
    }
    getUpdates("/all/courses", context, 'course', headers);
}

function addNotification(title, message, date){
    for (i = 0; i < 20; i++) {
        if (cordovaLoaded == true){
            window.plugin.notification.local.add({
                title:   title,
                message: message,
                date:    date
            });
            break;
        }else{
        }
    }
}

/** This gets ALL different types of updates - DON'T fucking touch this **/
function getUpdates(url, context, model, headers){
    var store = context.store;
    headers.timestamp = localStorage.getItem('timestamp_'+model);
    $.ajax({
        url: site+url,
        type: 'GET',
        headers: headers,
        success: function (resp) {
            var response = resp[model];
            var newTimestamp = resp['meta']['timestamp'];
            var oldTimestamp = localStorage.getItem("timestamp_"+model);
            localStorage.setItem("timestamp_"+model, newTimestamp-60);
            $.each(response, function(i, record) {
                // First see if it exists and try to update it
                if (context.store.hasRecordForId(model,record.id)){

                    context.store.find(model, record.id).then(
                        function(thisRecord){
                            if (thisRecord.get('last_modified')!=record.last_modified) {
                                if (model == 'assignment') {
                                    thisRecord.set('assignment_name', record.assignment_name);
                                    thisRecord.set('archived', record.archived);
                                    thisRecord.set('due_date', record.due_date);
                                    thisRecord.set('description', record.description);
                                    thisRecord.set('last_modified', record.last_modified);
                                    console.log(record);

                                } else if (model == 'course') {
                                    console.log(model);
                                    console.log(thisRecord);
                                    thisRecord.set('course_name', record.course_name);
                                    thisRecord.set('course_description', record.course_description);
                                    thisRecord.set('archived', record.archived);
                                    thisRecord.set('last_modified', record.last_modified);

                                }
                                thisRecord.save().then(function () {
                                    console.log('saved')
                                    var hash = window.location.hash.substr(1);
                                    var controller = App.__container__.lookup("controller:assignments");
                                    if (hash == "/") {
                                        controller.send('getLatest');
                                    }
                                });
                            }
                        });
                }else{
                // If its new, add it
                    if (model == 'assignment'){
                        context.store.find('course',record.course_id).then(function(course){
                            record.course_id = course;
                            var newRecord = context.store.createRecord(model,record);
                            newRecord.save().then(function(){
                                swipeRemove();
                                assignmentCount();
                            })
                        });
                    }else{
                        var newRecord = context.store.createRecord(model,record);
                        newRecord.save();
                    }
                }
            });
        }
    });
}


/** Start editing again **/


function setTitle(title){
    $('#page-title').html(title);
}
