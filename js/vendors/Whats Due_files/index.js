/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var cordovaApp = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'cordovaApp.receivedEvent(...);'
    onDeviceReady: function() {
        cordovaApp.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var pushNotification = window.plugins.pushNotification;
            pushNotification.register(cordovaApp.successHandler, cordovaApp.errorHandler,{"senderID":"577888563057","ecb":"cordovaApp.onNotificationGCM"});
        console.log('Cordova Loaded: ' + id);
    },
    successHandler: function(result) {
        console.log('Success Handler = '+result)
     },
    errorHandler:function(error) {
        console.log(error);
    },
    /* These are for Push Notifications*/
    onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                    var postData = {
                    "uuid":      device.uuid,
                    "platform":  device.platform,
                    "pushId":    e.regid
                    };
                    console.log(postData);
                    $.ajax({
                        url: site+"/students",
                        type: 'POST',
                        data: postData,
                        success: function (response) {
                            console.log(response);
                            localStorage.setItem("primaryKey", response.primaryKey)
                        }
                    });
                break;

            case 'message':
                console.log(e);
                var data = e.payload;
                if (data.assignmentId){
                    // This deals with updated assignments
                    var updatedAssignment = new CustomEvent('updatedAssignment');
                    window.dispatchEvent(updatedAssignment);
                    function alertDismissed() {
                        window.location.hash = '/'+data.assignmentId;
                        $('.app').addClass('move-right off-canvas');
                    }
                    navigator.notification.alert(
                        data.message,  // message
                        alertDismissed,         // callback
                        data.title,            // title
                        'OK'                  // buttonName
                    );
                }
                break;

            case 'error':
                console.log('GCM error = '+e.msg);
                break;

            default:
                console.log('An unknown GCM event has occurred');
                break;
        }
    }
    
};
cordovaApp.initialize();
