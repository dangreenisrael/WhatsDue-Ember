/**
 * Created by dan on 2014-05-15.
 */

var test = false;

if (test == true){
    //var site = "http://admin.whatsdueapp.com.192.168.2.28.xip.io/app_dev.php/student";
    var site="http://admin.whatsdueapp.com/app_dev.php/student";
}else{
    var site="http://admin.whatsdueapp.com/student";
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
            localStorage.setItem("timestamp_"+model, newTimestamp);
            $.each(response, function(i, record) {
                // First see if it exists and try to update it
                if (record.created_at < oldTimestamp && !headers.sendAll){
                    context.store.find(model, record.id).then(
                        function(thisRecord){
                            if (model == 'assignment'){
                                console.log(record);
                                thisRecord.set('assignment_name', record.assignment_name);
                                thisRecord.set('description', record.description);
                                thisRecord.set('due_date', record.due_date);

                            }else if(model == 'course'){
                                thisRecord.set('course_name', record.course_name);
                                thisRecord.set('course_description', record.course_description);
                            }

                            thisRecord.save();
                            console.log('Updated Record '+record.id)
                        });
                }else{
                // If its new, add it
                    if (model == 'assignment'){
                        context.store.find('course',record.course_id).then(function(course){
                            record.course_id = course;
                            var newRecord = context.store.createRecord(model,record);
                            newRecord.save();
                            //setInterval(elementLoaded(), 500);
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


function deleteAssignments(context, course_ids){
    var i = 0;
    for (len = course_ids.length; i < len; i++) {
        value = Number(course_ids[i]);
        context.store.find('assignment',{"course_id":value}).then(function(record){
            record.content.forEach(function(rec) {
                Ember.run.once(this, function() {
                    rec.set('enrolled',false);
                    rec.save();
                });
            }, this);
        });
    }
    wipeRecentlyDeletedCourses();
}

function unDeleteAssignments(context, course_ids){
    var i = 0;
    for (len = course_ids.length; i < len; i++) {
        value = Number(course_ids[i]);
        context.store.find('assignment',{"course_id":value}).then(function(record){
            record.content.forEach(function(rec) {
                Ember.run.once(this, function() {
                    rec.set('enrolled',true);
                    rec.save();
                });
            }, this);
        });
    }
    wipeRecentlyUnDeletedCourses();
}

function deleteRecord(context, model, id){
    context.store.find(model, id).then(function(record){
        record.deleteRecord();
        record.save();
    });
}

function deleteAll(context, model){
    context.store.find(model).then(function(record){
        record.content.forEach(function(rec) {
            Ember.run.once(this, function() {
                rec.deleteRecord();
                rec.save();
            });
        }, this);
    });
}


function addRecentlyRemovedCourse(courseId){
    var serialized = localStorage.getItem('whatsdue-recentlyDeletedCourses');
    var list = [courseId];
    if (serialized != 'null' && serialized != null){
        var unSerialized = serialized.split(',');
        list = list.concat(serialized);
    }
    serialized = list.toString();
    localStorage.setItem('whatsdue-recentlyDeletedCourses', serialized);
}

function addRecentlyUnRemovedCourse(courseId){
    var serialized = localStorage.getItem('whatsdue-recentlyUnRemovedCourses');
    var list = [courseId];
    if (serialized != 'null' && serialized != null){
        list = list.concat(serialized);
    }
    serialized = list.toString();
    localStorage.setItem('whatsdue-recentlyUnRemovedCourses', serialized);
}

function getRecentlyDeletedCourses(){
    var serialized = localStorage.getItem('whatsdue-recentlyDeletedCourses');
    var unSerialized = null;
    if (serialized != 'null' && serialized != null){
        unSerialized = serialized.split(',')
    }
    return unSerialized;
}

function getRecentlyUnDeletedCourses(){
    var serialized = localStorage.getItem('whatsdue-recentlyUnRemovedCourses');
    var unSerialized = null;
    if (serialized != 'null' && serialized != null){
        unSerialized = serialized.split(',')
    }
    return unSerialized;
}

function wipeRecentlyDeletedCourses(){
    localStorage.setItem('whatsdue-recentlyDeletedCourses', null);
}

function wipeRecentlyUnDeletedCourses(){
    localStorage.setItem('whatsdue-recentlyUnRemovedCourses', null);
}

function setTitle(title){
    $('#page-title').html(title);
}
