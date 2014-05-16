/**
 * Created by dan on 2014-05-15.
 */


var site = "http://whats.due/app_dev.php";

/** Bringing In Data from the server **/


// This is for getting assignment info
function updateAssignments(parent){
   parent.store.find('enrolled').then(
        function(currentRecord) {
            var idList = [];
            // Get list of Courses - WORKING
            currentRecord.toArray().forEach(function(currentRecord){
                // We need to make each value an array - .push() interferes with Ember
                var each = [currentRecord.get('courseId')];
                idList = $.merge(idList, each);
            });


            getUpdates('/assignments', parent, 'assignment', {
                'courses': "["+idList+"]"
            });
        }
   );
}

/** This gets ALL different types of updates **/
function getUpdates(url, parent, model, headers){
    var store = parent.store;

    $.ajax({
        url: site+url,
        type: 'GET',
        dataType: 'json',
        headers: headers,
        success: function (resp) {
            var response = resp[model];
            $.each(response, function(i, record) {
                var currentRecord;
                if (record.created_at == record.last_modified){
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

function deleteAssignments(parent, course_id){
    parent.store.find('assignment',{"course_id":course_id}).then(function(record){
        record.content.forEach(function(rec) {
            Ember.run.once(this, function() {
                rec.deleteRecord();
                rec.save();
            });
        }, this);
    });
}

function deleteRecord(parent, model, id){
    parent.store.find(model, id).then(function(record){
        record.deleteRecord();
        record.save();
    });
}

function recordExists(parent, model, id){
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