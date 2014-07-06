/**
 * Created by dan on 2014-05-15.
 */


var site = "http://admin.whatsdueapp.com";

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
            localStorage.setItem("timestamp_"+model, newTimestamp);
            $.each(response, function(i, record) {
                if (record.created_at == record.last_modified){
                    context.store.find('course',record.course_id).then(function(course){
                        record.course_id = course;
                        currentRecord = store.createRecord(model,record);
                        currentRecord.save();
                        setInterval(function(){
                                elementLoaded();
                            }
                            ,300
                        );
                    });
                }
                else{
                    store.find(model, record.id).then(function(thisRecord){
                        deleteRecord(context,model, record.id);
                        currentRecord = store.createRecord(model,thisrecord);
                        currentRecord.save();
                        console.log('Updated Record '+record.id)
                    });
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
        console.log(serialized)
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
//wipeRecentlyDeletedCourses();
//addRecentlyDeletedCourse(41)
//console.log(getRecentlyDeletedCourses())
