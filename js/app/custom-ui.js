

$(document).ready(function (){
    readyFunction();
});


/* Start Moment */
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

/* End Moment */

/* Start Global Variables */
var pageWidth = $(window).width();
var currentPage = 1
var page = {
    0 : - 0,
    1 : - pageWidth,
    2 : - pageWidth * 2
};


/* End Global Variables */


/* Start Helper Functions */


function closest (event, selector){
    return $(event.target).closest(selector)
}

function animate(element){
    element.addClass('animate');
    setTimeout(function(){element.removeClass('animate')}, 300);
}

function fastAnimate(element){
    element.addClass('fastAnimate');
    setTimeout(function(){element.removeClass('fastAnimate')}, 100);
}



function toggleMenu(){
    var element = $('#contentContainer');
    fastAnimate(element);
    document.getElementById('contentContainer').scrollTop = 0;
    if (currentPage >= 1){
        element.css({"-webkit-transform": "translate3d(0,0,0) scale3d(1,1,1)", "overflow":"hidden"});
        currentPage = 0;
    } else{
        currentPage = 1;
        element.css({"-webkit-transform": "translate3d(-33.333%,0,0) scale3d(1,1,1)", "overflow":"auto"});
    }
    if(cordovaLoaded==true){
        cordova.plugins.Keyboard.close();
    }
}

function goHome(){
    var element = $('#contentContainer');
    animate(element);
    element.css({"-webkit-transform": "translate3d(-33.33%,0,0) scale3d(1,1,1)", "overflow":"auto"});
    currentPage = 1;
}

function sliderSize(){
    setTimeout(function(){
        var assignmentWidth;
        assignmentWidth = $(document).width() - $('.time').width()-80;
        $('<style type="text/css">.slider .info { width:'+assignmentWidth+'px; }</style>').appendTo('head');
    }, 5)

}

/* End Helper Functions */
function readyFunction(){
    /*
     * Main Page Control
     */
    // Set dimensions relative to page

    var headerHeight = $('#appHeader').outerHeight()
    var pageHeight = $(window).height() - headerHeight;
    $('div#content, div#content > div > div ').css({'width':pageWidth});
    $('div#contentContainer').css('height', pageHeight);
    $('div#content > div').css({'width': pageWidth*3, 'margin-top':headerHeight});
    sliderSize();
    $( window ).resize(function() {
        var pageWidth = $(window).width();
        var headerHeight = $('#appHeader').outerHeight()
        var pageHeight = $(window).height() - headerHeight;
        $('div#content, div#content > div > div ').css('width',pageWidth);
        $('div#contentContainer').css('height', pageHeight);
        $('div#content > div').css({'width': pageWidth*3, 'margin-top':headerHeight});
        sliderSize();
    });

    /*
     * Helper Functions
     */



    /* Toggles */

    $('#menuToggle, #left').off('click').on('click', function(){
        toggleMenu()
    });

    $('header#appHeader h1').off('click').on('click', function(){
        goHome();
    });


    /* Filtering Courses */

    $(function() {
        FastClick.attach(document.body);
    });


    $('body').on({
        'touchmove': function(e) {
            $('.removable').css({
                "-webkit-transform":"translate3d(0,0,0) scale3d(1,1,1)",
                "opacity":1
            });
            if(cordovaLoaded==true){
                cordova.plugins.Keyboard.close();
            }
        }
    });
}


function putBackable(){
    /* Click Events */

    setTimeout(function(){
        var removeButton = $('.putBackable img');
        var putBackable = $('.putBackable');
        removeButton.off('click');
        putBackable.siblings('.reveal').off();
        putBackable.not('.keep').siblings('.reveal').click(function(){
            $(this).parent('.slider');
            var context = this;
            setTimeout(function(){
                $(context).parent('.slider').detach();
            }, 1);
        });


        removeButton.on('click', function(event){
            event.stopPropagation();
            var parent = $(this).closest('.putBackable');
            if (parent.hasClass('open')){
                parent.css("-webkit-transform", "translate3d(0,0,0) scale3d(1,1,1)");
                parent.removeClass('open');
            } else{
                putBackable.removeClass('open');
                putBackable.css("-webkit-transform", "translate3d(0,0,0) scale3d(1,1,1)");
                parent.css("-webkit-transform", "translate3d(63px,0,0) scale3d(1,1,1)");
                parent.addClass('open');
            }
        });

        putBackable.on('click', function(){
            if ( ($(this).hasClass('open')) ){
                $(this).removeClass('open');
                $(this).css("-webkit-transform", "translate3d(0,0,0) scale3d(1,1,1)");
            }
        });

        $('.search').fastLiveFilter('.searchable').on('change', function(){
            var search = $(this).val();
            if (search.length >2 ){
                $('ul.searchable').removeClass('hidden');
            } else{
                $('ul.searchable').addClass('hidden');
            }

        });
        sliderSize();


    }, 1)
}

function complete(element){
    element.parent('.slider').addClass('animate').css('opacity','0');
    setTimeout(function(){
        element.siblings('.reveal').click();
    }, 1)
}


function swipeRemove(){

    setTimeout(function() {
        /*
         * Swipe to Delete
         */
        var removable = document.getElementsByClassName("removable");
        var removableOptions = {};
        var removeHammer = [];
        for (var i = 0; i < removable.length; ++i) {
            removeHammer[i] = new Hammer(removable[i], removableOptions);
            // Drag
            removeHammer[i].off('pan').on('pan', function (event) {
                event.srcEvent.cancelBubble = true
                timestamp = Date.now();
                var deltaX = event.deltaX
                var percent = 1 - Math.abs(deltaX / pageWidth);
                var element = closest(event, '.removable');
                element.css({
                    "-webkit-transform": "translate3d(" + deltaX + "px,0,0) scale3d(1,1,1)",
                    "opacity": percent
                });
            });

            // Release
            removeHammer[i].off('panend').on('panend', function (event) {
                event.srcEvent.cancelBubble = true;
                var element = closest(event, '.removable');

                var deltaX = event.deltaX;
                var width = element.width();
                var limit = (width / 3);
                animate(element);


                if (Math.abs(deltaX) >= width) {
                    complete(element)
                } else if (Math.abs(deltaX) > limit) {
                    element.css({
                        "-webkit-transform": "translate3d(101%,0,0) scale3d(1,1,1)",
                        "opacity": 0
                    });
                    complete(element);
                }
                else {
                    element.css({
                        "-webkit-transform": "translate3d(0,0,0) scale3d(1,1,1)",
                        "opacity": 1
                    });
                }
            });
        }

        $('nav > .due').on('click', function () {
            $('#assignments-due').show();
            $('#assignments-overdue').hide();

        });
        $('nav > .overdue').on('click', function () {
            $('#assignments-due').hide();
            $('#assignments-overdue').show();
        });

        /* Display day dividers */


    }, 500);

    setTimeout(function(){
        var dup = {};
        $('.day-divider').each(function() {
            var txt = $(this).text();
            if (dup[txt])
                $(this).remove();
            else
                dup[txt] = true;
        })
    },1 )
    ;
}
