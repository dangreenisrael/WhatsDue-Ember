$(document).ready(function (){
    readyFunction();
    console.log('ready');
});

readyFunction();
function changeRoute(){
    var delay=300;//1 seconds
    setTimeout(function(){
        readyFunction();
    },delay);
}
moment.locale('en', {
    calendar : {
        lastDay : '[Yesterday] ',
        sameDay : '[Today] ',
        nextDay : '[Tomorrow]',
        nextWeek : '[This] dddd',
        sameElse : 'dddd MMM Do'
    },
    relativeTime : {
        future: "%s ",
        past:   "%s",
        s:  "seconds",
        m:  "a minute",
        mm: "%d minutes",
        h:  "an hour",
        hh: "%d hours",
        d:  "a day",
        dd: "%d days",
        M:  "a month",
        MM: "%d months",
        y:  "a year",
        yy: "%d years"
    }

});

function readyFunction(){
    /*
     * Main Page Control
     */

    // Set dimensions relative to page
    var pageWidth = $(window).width();
    var headerHeight = $('#appHeader').outerHeight()
    var pageHeight = $(window).height() - headerHeight;
    $('div#content, div#content > div > div ').css('width',pageWidth);
    $('div#left').css('height', pageHeight);
    $('div#content > div').css({'width': pageWidth*3, 'margin-top':headerHeight});

    $( window ).resize(function() {
        var pageWidth = $(window).width();
        var headerHeight = $('#appHeader').outerHeight()
        var pageHeight = $(window).height() - headerHeight;

        $('div#content, div#content > div > div ').css('width',pageWidth);
        $('div#content > div > div').css('height', pageHeight);
        $('div#content > div').css({'width': pageWidth*3, 'margin-top':headerHeight});

    });

    function closest (event, selector){
        return $(event.target).closest(selector)
    }

    function animate(element){
        element.addClass('animate');
        setTimeout(function(){element.removeClass('animate')}, 300);
    }

    var currentPage = 1
    var page = {
        0 : - 0,
        1 : - pageWidth,
        2 : - pageWidth * 2
    };

    /*
     * Swipe to Delete
     */

    var removable = document.getElementsByClassName("removable");
    var removableOptions = { };
    var removeHammer = [];
    for (var i = 0; i < removable.length; ++i) {
        removeHammer[i] = new Hammer(removable[i], removableOptions);
        // Drag
        removeHammer[i].on('pan', function(event) {
            event.srcEvent.cancelBubble = true
            timestamp = Date.now();
            var deltaX = event.deltaX
            var percent =1-Math.abs(deltaX/pageWidth);
            var element = closest(event, '.removable');
            element.css({
                "-webkit-transform":"translate3d("+deltaX+"px,0,0) scale3d(1,1,1)",
                "opacity":percent
            });
        });

        // Release
        removeHammer[i].on('panend', function(event) {
            event.srcEvent.cancelBubble = true;
            var element = closest(event, '.removable');
            if($(element).hasClass('animate')==true){
                return;
            }
            console.log('ran');
            var deltaX = event.deltaX;
            var width = element.width();
            var limit = (width/4);
            animate(element);
            if (Math.abs(deltaX) >= width){
                swipeRemove(element)
            } else if (Math.abs(deltaX) > limit){
                element.css({
                    "-webkit-transform": "translate3d(101%,0,0) scale3d(1,1,1)",
                    "opacity":1
                });
                swipeRemove(element);
            }
            else{
                element.css({
                    "-webkit-transform": "translate3d(0,0,0) scale3d(1,1,1)",
                    "opacity":1
                });
            }

        });
    }



    /*
     * Helper Functions
     */

    function toggleMenu(){

        var element = $('#content > div');
        animate(element);
        if (currentPage >= 1){
            element.css("-webkit-transform", "translate3d(0,0,0) scale3d(1,1,1)");
            currentPage = 0;
            window.scrollTo(0,0);
        } else{
            currentPage = 1;
            element.css("-webkit-transform", "translate3d(-33.333%,0,0) scale3d(1,1,1)");
        }


    }

    // Make Left Menu un-scrollable
    $('#left').on('touchmove', function(e){
        //prevent native touch activity like scrolling
        e.preventDefault();
    });

    function goHome(){
        var element = $('#contentContainer');
        animate(element);
        element.css("-webkit-transform", "translate3d(-33.33%,0,0) scale3d(1,1,1)");
        currentPage = 1;
    }

    function swipeRemove(element){
        element.parent('.slider').addClass('animate').css('opacity','0');
        setTimeout(function(){
            element.siblings('.reveal').click();
            assignmentCount();
        }, 350)
    }


    /* Toggles */
    $('#menuToggle, #left').on('click', function(){
        toggleMenu()
    });

    $('header#appHeader h1').on('click', function(){
        goHome();
    });

    $('nav > .due').on('click', function () {
        $('#assignments-due').show();
        $('#assignments-overdue').hide();

    });
    $('nav > .overdue').on('click', function () {
        $('#assignments-due').hide();
        $('#assignments-overdue').show();

    });


    /* Display day dividers */

    var dup = {};
    $('.day-divider').each(function() {
        var txt = $(this).text();
        if (dup[txt])
            $(this).remove();
        else
            dup[txt] = true;
    });

    /* Header Stuff */
    function assignmentCount(){
        var numberDue = $('#assignments-due').find('.slider').length;
        $('.due .badge, .whatsdue.count').text(numberDue);

        var numberOverdue = $('#assignments-overdue').find('.slider').length;
        $('.overdue .badge').text(numberOverdue);
    }

    assignmentCount();
    /* Filtering Courses */

    $(function() {
        FastClick.attach(document.body);
    });
    $('.search').fastLiveFilter('.searchable');

}


function putBackable(){
    /* Click Events */
    setTimeout(function(){

        var putBackable = $('.putBackable');
        putBackable.off();
        putBackable.siblings('.reveal').off();
        putBackable.not('.keep').siblings('.reveal').click(function(){
            $(this).parent('.slider');
            var context = this;
            setTimeout(function(){
                $(context).parent('.slider').detach();
                changeRoute();
            }, 100);
        });

        putBackable.on('click', function(){
            if ($(this).hasClass('open')){
                console.log($(this).hasClass('open'))
                $(this).css("-webkit-transform", "translate3d(0,0,0) scale3d(1,1,1)");
                $(this).removeClass('open');
            } else{
                $(this).css("-webkit-transform", "translate3d(80px,0,0) scale3d(1,1,1)");
                $(this).addClass('open');
            }
        });
    }, 500)

}



/*
 var x = page[currentPage];
 // Actual Swiping
 var main = document.getElementById('content');
 var mainOptions = {
 preventDefault: true
 };
 var mainHammer = new Hammer(main, mainOptions);

 var transitionTime = 100;

 // Helper Functions


 /* Horizontal Drag

 mainHammer.on('pan', function(event) {
 if (currentPage >= 1) { return };
 var deltaX = event.deltaX
 event.srcEvent.cancelBubble = true;
 X = event.deltaX + page[currentPage];
 var element = $('#content > div');
 if ( 0 <= X || X <= -pageWidth*2){ return };

 element.css("-webkit-transform", "translate3d("+X+"px,0,0) scale3d(1,1,1)");

 });

 //Release
 mainHammer.on('panend', function(event) {
 event.srcEvent.cancelBubble = true
 if (currentPage >=1) { return };

 if ( (Date.now()-timestamp) < 10){
 X = page[currentPage]
 return
 };
 var element = $('#content > div');
 var deltaX = event.deltaX
 if ( 0 <= X || X <= -pageWidth*2){ return };

 var limit = (pageWidth/4)

 if (Math.abs(deltaX) > limit){
 if (deltaX < 0){
 // Slide Right
 ++currentPage;
 }else{
 // Slide Left
 --currentPage;
 }
 }
 animate(element);
 element.css("-webkit-transform", "translate3d("+page[currentPage]+"px,0,0) scale3d(1,1,1)");
 });

 */