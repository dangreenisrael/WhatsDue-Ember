

var gcm = require('node-gcm');
var message = new gcm.Message();
 
//API Server Key
var sender = new gcm.Sender('AIzaSyBYoGvX_ciWo2V8_1UE2ts_s3vKC890bjc');
var registrationIds = ['APA91bFFYNymoQ1cqv9gr21hr8yF500KHlbgFFuekuiGg5mc758VPo9wE4z7RH5vdLPDp4dPoNX2nixAlDXr0p3_u1SSQa9B7Lq08UtcvG_33F6KtYcWw9ObGS6mSxTYcT_hxA6VpCjwIUJYcn70Bu3TeLbw4nEpCQ', 'APA91bFCanXoNhV1HnfaNGv124pCAe92X-NH9t1ruDCbw_6m294N1fFK4su0HsOM1_G4Hq8Oq1sAR_JOslwzUbLuYnmgiNDTkqlslNiZlIGyciNSzDXBjOxWh2brSHO1RX5eRUHlZVIVY8FrUOXoepA3kzcntpAYAA'];
 
// Value the payload data to send...
message.addData('title',"Hi Elle" );
message.addData('message',"I'm going to be here till the 20th!!!! \n\n(probably) \n\n- Dan");
//message.addData('msgcnt','3'); // Shows up in the notification in the status bar
//message.addData('soundname','beep.wav'); //Sound to play upon notification receipt - put in the www folder in app
//message.collapseKey = 'demo';
//message.delayWhileIdle = true; //Default is false
message.timeToLive = 3000;// Duration in seconds to hold in GCM and retry before timing out. Default 4 weeks (2,419,200 seconds) if not specified.
 
// At least one reg id required
registrationIds.push();
 
/**
 * Parameters: message-literal, registrationIds-array, No. of retries, callback-function
 */
sender.send(message, registrationIds, 4, function (result) {
    console.log(result);
});