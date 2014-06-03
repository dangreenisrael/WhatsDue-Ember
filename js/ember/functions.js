/**
 * Created by dan on 2014-05-15.
 */


var site = "http://admin.whatsdueapp.com";

/** Bringing In Data from the server **/

// This is for getting assignment info
function updateAssignments(parent){
   parent.store.find('course', {'enrolled':true}).then(
        function(currentRecord) {
            // Get list of Courses
            var idList = [];
            currentRecord = currentRecord.get('content');
            currentRecord.forEach(function(currentRecord){
                // We need to make each value an array - .push() interferes with Ember
                var temp = [currentRecord.id];
                idList = idList.concat(temp);
            });
            getUpdates('/assignments', parent, 'assignment', {
                'courses': "["+idList+"]"
            });
        }
   );
    var recentlyDeleted = getRecentlyDeletedCourses();
    var recentlyUnDeleted = getRecentlyUnDeletedCourses();

    if (recentlyDeleted != 'null' && recentlyDeleted != null){
        deleteAssignments(parent, recentlyDeleted);
    }

    if (recentlyUnDeleted != 'null' && recentlyUnDeleted != null){
        unDeleteAssignments(parent, recentlyUnDeleted);
    }
}

/** This gets ALL different types of updates - DON'T fucking touch this **/
function getUpdates(url, parent, model, headers){
    var store = parent.store;
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
                    record.owner = parent.get('content');
                    currentRecord = store.createRecord(model,record);
                    currentRecord.save();
                }
                else{
                    store.find(model, record.id).then(function(thisRecord){
                        deleteRecord(parent,model, record.id);
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


function deleteAssignments(parent, course_ids){
    var i = 0;
    for (len = course_ids.length; i < len; i++) {
        value = Number(course_ids[i]);
        parent.store.find('assignment',{"course_id":value}).then(function(record){
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

function unDeleteAssignments(parent, course_ids){
    var i = 0;
    for (len = course_ids.length; i < len; i++) {
        value = Number(course_ids[i]);
        parent.store.find('assignment',{"course_id":value}).then(function(record){
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

function deleteRecord(parent, model, id){
    parent.store.find(model, id).then(function(record){
        record.deleteRecord();
        record.save();
    });
}

function deleteAll(parent, model){
    parent.store.find(model).then(function(record){
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
//wipeRecentlyDeletedCourses();
//addRecentlyDeletedCourse(41)
//console.log(getRecentlyDeletedCourses())
