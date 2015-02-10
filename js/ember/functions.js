/**
 * Created by dan on 2014-05-15.
 */

var test = false;

if (test == true){
    //var site = "http://stage.whatsdueapp.com/student";
    var site="http://admin.whatsdueapp.com/app_dev.php/student";
}else{
    var site="http://admin.whatsdueapp.com/student";
}
/*
    Analytics
 */

function trackEvent(event, firstOption, firstValue, secondOption, secondValue, thirdOption, thirdValue){

    firstOption = firstOption || null;
    firstValue = firstValue || null;
    secondOption = secondOption || null;
    secondValue = secondValue || null;
    thirdOption = thirdOption || null;
    thirdValue = thirdValue || null;

    var options = {};
    options['School']=getSchool();
    if (firstOption != null) {
        options[firstOption] = firstValue;
        if (secondOption != null) {
            options[secondOption] = secondValue;
            if (thirdOption != null) {
                options[thirdOption] = thirdValue;
            }
        }
    }
    if (cordovaLoaded == true) {
        Localytics.tagEvent(event, options, 0);
        console.log('tracked' + event);
    } else{
        //console.log(event);
        //console.log(options);
    }
}


/** Bringing In Data from the server **/

// This is for getting assignment info
function updateAssignments(context){
    var courses = localStorage.getItem('courses');
    getUpdates('/assignments', context, 'assignment', {
        'courses': "["+courses+"]"
    });

    getUpdates('/messages', context, 'message', {
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
                                    var assignment = record;
                                    thisRecord.set('assignment_name', assignment.assignment_name);
                                    thisRecord.set('archived', assignment.archived);
                                    thisRecord.set('due_date', assignment.due_date);
                                    thisRecord.set('description', assignment.description);
                                    thisRecord.set('last_modified', assignment.last_modified);

                                } else if (model == 'course') {
                                    thisRecord.set('course_name', record.course_name);
                                    thisRecord.set('course_description', record.course_description);
                                    thisRecord.set('archived', record.archived);
                                    thisRecord.set('last_modified', record.last_modified);

                                }
                                thisRecord.save().then(function (record) {
                                    var hash = window.location.hash.substr(1);
                                    var controller = App.__container__.lookup("controller:assignments");
                                    if (hash == "/") {
                                        controller.send('getLatest');
                                    }
                                    swipeRemove();
                                    sliderSize();
                                    if (model == 'assignment'){
                                        /* Remove Old Reminders */
                                        context.store.find('setReminder',{'assignment': record.get('id')}).then(function(setReminders){
                                            removeSetReminders(setReminders);
                                            /* Set New Reminders */
                                            context.store.find('reminder').then( function(reminders) {
                                                reminders.get('content').forEach(function(reminder){
                                                    setReminder(record, reminder, context);
                                                });
                                            });
                                        });


                                    }
                                });
                            }
                        });
                } else{
                // If its new, add it
                    if (model == 'assignment'){
                        context.store.find('course',record.course_id).then(function(course){
                            record.course_id = course;
                            var assignment = context.store.createRecord(model,record);
                            assignment.save().then(function(assignment){

                                /* Set reminders */
                                context.store.find('reminder').then( function(reminders) {
                                    reminders.get('content').forEach(function(reminder){
                                        setReminder(assignment, reminder, context);
                                    });
                                });
                                swipeRemove();
                                sliderSize();
                            });
                        });
                    }
                    else{
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

function setReminder(assignment, reminder, context){
    var duedate_seconds = moment(assignment.get('due_date')).format('X');
    var seconds_before = reminder.get('seconds_before');
    var alarm_date = new Date((duedate_seconds - seconds_before)*1000);
    var reminder_id = primaryKey('setReminders');

    /* If the reminder is going to be set in the future, set it*/
    if (! (moment(alarm_date).isBefore(new Date())) ){
        var message = assignment.get('assignment_name') + " is due in " + reminder.get('time_before');

        if (cordovaLoaded == true){
            assignment.get('course_id').then(function(course){
                window.plugin.notification.local.add({
                    id:      reminder_id,
                    title:   course.get('course_name'),
                    message: message,
                    repeat:  'weekly',
                    date:    alarm_date
                });
            });

        } else{
            console.log(reminder_id+": "+message);
        }

        /* Record the reminder so that we can unset it if it's removed*/
        var reminderRecord = context.store.createRecord('setReminder', {
            id: reminder_id,
            alarm_date: alarm_date,
            assignment: assignment,
            reminder: reminder
        });
        reminderRecord.save().then(
        );
    }
}

function removeSetReminders(setReminders){
    setReminders.forEach(function(setReminder){
        var reminderId = setReminder.get('id');
        if (cordovaLoaded == true){
            window.plugin.notification.local.cancel(reminderId, function () {
                // The notification has been canceled
            });
        } else{
           // console.log("Canceled ID# "+reminderId);
        }
        setReminder.destroyRecord();
    });
}

function primaryKey(name){
    localStorage.setItem(name, Number(localStorage.getItem(name)) +1 );
    return localStorage.getItem(name);
}


/* Location Info Class */
function LocationInfo (data) {
    this.city = data.city;
    this.country = data.country;
    this.region = data.region;
}



$.ajax({
    url: 'http://ipinfo.io/json',
    type: 'GET',
    context: this,
    success: function (data) {
        var locationInfo = new LocationInfo(data);
        trackEvent('App Opened', "City", locationInfo.city, "Region", locationInfo.region, "Country", locationInfo.country);
    }
});

function getSchool(){
    return localStorage.getItem('schoolName');
}

function setSchool(schoolName){
    localStorage.setItem('schoolName', schoolName);
}


function countInArray(haystack, needle) {
    var count = 0;
    for (var i = 0; i < haystack.length; i++) {
        if (haystack[i] === needle) {
            count++;
        }
    }
    return count;
}


