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
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'cordovaApp.receivedEvent(...);'
    onDeviceReady: function() {
        cordovaApp.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
        var pushNotification = window.plugins.pushNotification;
        pushNotification.register(cordovaApp.successHandler, cordovaApp.errorHandler,{"senderID":"642810142071","ecb":"cordovaApp.onNotificationGCM"});

        console.log('Received Event: ' + id);
    },
    
    successHandler: function(result) {
            console.log('Callback Success! Result = '+result)
     },
    errorHandler:function(error) {
        console.log(error);
    },
    onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    console.log("Regid " + e.regid);
                    console.log('registration id = '+e.regid);
                }
                break;

            case 'message':
                // this is the actual push notification. its format depends on the data model from the push server
                console.log('message = '+e.message+' msgcnt = '+e.msgcnt);
                function alertDismissed() {
                    // do something
                }

                navigator.notification.alert(
                    e.message,  // message
                    alertDismissed,         // callback
                    e.payload.title,            // title
                    'OK'                  // buttonName
                );

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
