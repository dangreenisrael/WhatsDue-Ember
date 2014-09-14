$(document).ready(function (){
	var timestamp;
    readyFunction();
});

function goTo(page, name){
	$('#middle > div').css('display','none');
	$(page).css('display', 'block');
	$('#appHeader h1').text(name);
}

function changeRoute(){

    var delay=500;//1 seconds
    setTimeout(function(){
        readyFunction();
    },delay);
}
moment.locale('en', {
    calendar : {
        lastDay : '[Yesterday] ',
        sameDay : '[Today] ',
        nextDay : '[Tomorrow] hh',
        nextWeek : 'dddd',
        sameElse : 'dddd L'
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
    $('div#content > div > div').css('height', pageHeight);
    $('div#content > div').css({'width': pageWidth*3, 'margin-top':headerHeight});

    $( window ).resize(function() {
        var pageWidth = $(window).width();
        var headerHeight = $('#appHeader').outerHeight()
        var pageHeight = $(window).height() - headerHeight;

        $('div#content, div#content > div > div ').css('width',pageWidth);
        $('div#content > div > div').css('height', pageHeight);
        $('div#content > div').css({'width': pageWidth*3, 'margin-top':headerHeight});

    });



    // Actual Swiping
    var main = document.getElementById('content');
    var mainOptions = {
        preventDefault: true
    };
    var mainHammer = new Hammer(main, mainOptions);
    var currentPage = 1
    var page = {
        0 : - 0,
        1 : - pageWidth,
        2 : - pageWidth * 2
    };
    var x = page[currentPage];
    var transitionTime = 100;

    /* Helper Functions */
    function closest (event, selector){
        return $(event.target).closest(selector)
    }

    function animate(element){
        element.addClass('animate');
        setTimeout(function(){element.removeClass('animate')}, 300);
    }

    /* Horizontal Drag */

    mainHammer.on('pan', function(event) {
        if (currentPage >= 1) { return };
        var deltaX = event.deltaX
        event.srcEvent.cancelBubble = true;
        X = event.deltaX + page[currentPage];
        var element = $('#content > div');
        if ( 0 <= X || X <= -pageWidth*2){ return };

        element.css("-webkit-transform", "translate3d("+X+"px,0,0) scale3d(1,1,1)");

    });

    /* Release */
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
            event.srcEvent.cancelBubble = true

            var element = closest(event, '.removable')
            var deltaX = event.deltaX
            var width = element.width()
            var limit = (width/4)
            animate(element);
            if (Math.abs(deltaX) >= width){
                instantRemove(element)
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




    /* Put back Completed Course */

    var putBackable = document.getElementsByClassName("putBackable");
    var putBackableOptions = { };
    var putBackHammer = [];
    var putBackOpen = [];
    var putBackLimit = ((pageWidth/5)*3);
    var putBackLowerLimit = (putBackLimit - pageWidth)
    var currentX = [];
    for (var i = 0; i < putBackable.length; ++i) {

        putBackHammer[i] = new Hammer(putBackable[i], putBackableOptions);
        // Drag
        putBackHammer[i].on('pan', function(event) {
            event.srcEvent.cancelBubble = true;
            var element = closest(event, '.putBackable');
            var index = closest(event, '.assignment').index();
            timestamp = Date.now();
            var deltaX = event.deltaX;


            if (putBackOpen[index] == true){
                newX = (deltaX + putBackLimit);
                startX = putBackLimit - pageWidth;
            }else{
                newX = (deltaX);
                startX = 0;
            }
            currentX[index] =startX + deltaX;
            if 	( currentX[index] <  putBackLowerLimit ){
                element.css("-webkit-transform", "translate3d("+putBackLowerLimit+"px,0,0) scale3d(1,1,1)");
                return;
            }else if (0 < currentX[index]){
                element.css("-webkit-transform", "translate3d(0,0,0) scale3d(1,1,1)");
                return;
            }

            element.css("-webkit-transform", "translate3d("+currentX[index]+"px,0,0) scale3d(1,1,1)");

        });

        // Release
        putBackHammer[i].on('panend', function(event) {
            event.srcEvent.cancelBubble = true
            var element = closest(event, '.putBackable')
            var index = closest(event, '.assignment').index();
            var deltaX = event.deltaX

            animate(element);
            if (deltaX < 0){
                element.css("-webkit-transform", "translate3d("+ putBackLowerLimit +"px,0,0) scale3d(1,1,1)");
                putBackOpen[index] = true;
                $( window ).scroll(function(event) {
                    animate(element);
                    element.css("-webkit-transform", "translate3d(0,0,0) scale3d(1,1,1)");
                    putBackOpen[index] = false;
                    $(this).off(event)
                });
            }
            else{
                element.css("-webkit-transform", "translate3d(0,0,0) scale3d(1,1,1)");
                putBackOpen[index] = false;

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
        } else{
            currentPage = 1;
            element.css("-webkit-transform", "translate3d(-33.333%,0,0) scale3d(1,1,1)");
        }
    }

    function goHome(){
        var element = $('#content > div');
        animate(element);
        element.css("-webkit-transform", "translate3d(-33.33%,0,0) scale3d(1,1,1)");
        currentPage = 1;
    }

    function swipeRemove(element){
        setTimeout(function(){
            element.siblings('.reveal').click();
            element.hide();
        }, 0);
    }

    function instantRemove(element){
        element.siblings('.reveal').click();
        element.hide();
    }
    /* Click Events */

    $('.putBackable').siblings('.reveal').click(function(){
        $(this).parent('.slider');
        var context = this;
        setTimeout(function(){
            $(context).parent('.slider').detach();
            changeRoute();
        }, 100);
    });

    /* Toggles */
    $('#menuToggle, #leftMenu li').on('click', function(){
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
    var numberDue = $('#assignments-due').find('.slider').length;
    $('.due .badge').text(numberDue);
    var numberOverdue = $('#assignments-overdue').find('.slider').length;
    $('.overdue .badge').text(numberOverdue);

    /* Filtering Courses */
    $('.search').fastLiveFilter('.searchable');
}
