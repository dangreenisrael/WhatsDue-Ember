

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

function customAnimate(element, miliseconds){
    element.css('transition','all '+miliseconds+'ms linear');
    setTimeout(function(){
        element.css('transition','none');
    }, miliseconds+50);

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
        element.css({"-webkit-transform": "translate3d(-33.333%,0,0) scale3d(1,1,1)", "overflow":"visible"});
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

    var headerHeight = $('#appHeader').outerHeight();
    var pageHeight = $(window).height() - headerHeight;
    $('div#content, div#content > div > div ').css({'width':pageWidth});
    $('div#contentContainer').css({
        'height': pageHeight,
        "-webkit-transform":"translate3d(-33.3333%,0,0) scale3d(1,1,1)"
    });
    $('div#content > div').css({'width': pageWidth*3});
    sliderSize();
    $( window ).resize(function() {
        var pageWidth = $(window).width();
        var headerHeight = $('#appHeader').outerHeight();
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

function complete(element, ms){
    //customAnimate(element.parent('.slider'), ms);
    //element.parent('.slider').css('opacity','0');
    setTimeout(function(){
      element.siblings('.reveal').click();
    }, ms+100)
}


function swipeRemove(){
    setTimeout(function() {
        /*
         * Swipe to Delete
         */
        var removable = document.getElementsByClassName("removable");
        var removableOptions = {domEvents: true};
        var removeHammer = [];
        for (var i = 0; i < removable.length; ++i) {
            removeHammer[i] = new Hammer(removable[i], removableOptions);

            removeHammer[i].off('doubletap').on('doubletap', function (event) {
                event.srcEvent.cancelBubble = true;
                var element = closest(event, '.removable');
                var course = $.trim(element.find('.course').text());
                var assignment = $.trim(element.find('.title').text());
                var dueTime = $.trim(element.find('.time-due').text());
                var dueDate = $.trim(element.find('.date-due').val());
                var message = dueDate + " at " + dueTime + ":\n\n" + assignment + " is due for " + course;
                shareModal(assignment, course, message);
            });


            removeHammer[i].off('panend').on('panend', function (event) {
                $(document).unbind('touchmove');
                event.srcEvent.cancelBubble = true;
                var element = closest(event, '.removable');
                var deltaX = event.deltaX;
                var deltaY = event.deltaY;
                var width = element.width();
                var limit = (width / 3);
                var distanceRemaining = width-Math.abs(event.deltaX);
                var velocityX = Math.abs(event.velocityX);
                var transitionMs = distanceRemaining/velocityX;
                if ( (Math.abs(deltaX) >= width) && (Math.abs(deltaX) > Math.abs(deltaY)) ){
                    customAnimate(element,transitionMs);
                    complete(element, 1)
                } else if ( (Math.abs(deltaX) > limit) && (Math.abs(deltaX) > Math.abs(deltaY)) )  {
                    customAnimate(element,transitionMs);
                    if (deltaX > 0 ){
                        element.css({
                            "-webkit-transform": "translate3d(101%,0,0) scale3d(1,1,1)",
                            "opacity": 0
                        });
                    } else{
                        element.css({
                            "-webkit-transform": "translate3d(-101%,0,0) scale3d(1,1,1)",
                            "opacity": 0
                        });
                    }

                    complete(element, transitionMs);
                }
                else {
                    fastAnimate(element);
                    element.css({
                        "-webkit-transform": "translate3d(0,0,0) scale3d(1,1,1)",
                        "opacity": 1
                    });
                }


            });

            removeHammer[i].off('pan').on('pan', function (event) {
                event.srcEvent.cancelBubble = true;
                timestamp = Date.now();
                var deltaX = event.deltaX;
                var deltaY = event.deltaY;
                var percent = 1 - Math.abs(deltaX / pageWidth);
                var element = closest(event, '.removable');
                element.css({
                    "-webkit-transform": "translate3d(" + deltaX + "px,0,0) scale3d(1,1,1)",
                    "opacity": percent
                });
                /* Prevent wonky scrolling */
                if ( Math.abs(deltaY) > Math.abs(deltaX) ) {
                    fastAnimate(element);
                    element.css({
                        "-webkit-transform": "translate3d(0,0,0) scale3d(1,1,1)",
                        "opacity": 1
                    });
                } else{
                    $(document).bind('touchmove', function (e) {
                        e.preventDefault();
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

        $('.description').linkify();

        $( "a" ).each(function( index ) {
            var text = $( this ).text();
            $(this).on('click', function(evt){
                window.open(text, '_system');
                evt.preventDefault();
                return false;
            })
        });

    }, 1);
}

var swiperSet = false;
function showWelcome(){
    var welcome = $('#welcome');
    welcome.css('display','block');

    function initializeSlider(){
        var mySwiper = new Swiper('.swiper-container', {
            pagination: '.pagination',
            loop: false,
            grabCursor: true,
            paginationClickable: true,
            noSwiping: true
        });


        $('.content-slide.next, .my-school').on('click', function (e) {
            if ($('#school-name').text() != ""){
                mySwiper.swipeNext();
            }
        });

        $('.content-slide.finish').on('click', function (e) {
            mySwiper.swipeTo(0, 100, false);
            welcome.css('display', 'none');
        });

        $('#schoolName').scombobox({
            fullMatch: true,
            highlight: false

        });

        $('.scombobox-list').on('click',
            'p',
            function(){
                var school = $(this).text();
                $('#school-name').text($(this).text());
                if (school != ""){
                    setSchool(school);
                    $('.button').removeClass('hidden');
                    if (cordovaLoaded){
                        cordova.plugins.Keyboard.close();
                    }
                }
            });
        swiperSet = true;
        $('.scombobox-display').val('').focus();
        if (cordovaLoaded){
            cordova.plugins.Keyboard.show();
        }
        $('.swiper-slide').css('height', 'auto');

    }
    if (!swiperSet) {

        $.ajax( "http://whatsdueapp.com/live-content/welcome-slider.php" )
            .done(function(data) {
                welcome.html(data);
                initializeSlider();
            })
            .fail(function(){
                $.get( "live-content/welcome-slider.html", function( data ) {
                    welcome.html(data);
                    initializeSlider();
                });
            })
    }
}


function showSupport(){
    var content = $('#support');
    $.get( "http://whatsdueapp.com/live-content/support.php", function( data ) {
        content.html(data);
    });

    $.ajax( "http://whatsdueapp.com/live-content/support.php" )
        .done(function(data) {
            content.html(data);
        })
        .fail(function(){
            $.get( "live-content/support.html", function( data ) {
                welcome.html(data);
                initializeSlider();
            });
        })
}


function makeSpinnable(){
    setTimeout( function(){
        $('.add-something img, .reveal img').on('click', function(element){
            $(this).addClass('spin')
        })
    }, 50);
}

function reminderTips(){
    var reminders = $('#reminders');
    var time = $('input.time');
    if ( !reminders.find('.putBackable').length){

        var numberTip = time.qtip({
            content: {
                text: 'Tap to choose when to be reminded'
            },position: {
                my: 'bottom left',  // Position my top left...
                at: 'top right' // at the bottom right of...
            },
            show: true
        });
        var plusTip;

        reminders.find('.time').keypress(function(){
            plusTip = reminders.find('figure img').qtip({
                content: {
                    text: 'Tap the + sign'
                },position: {
                    my: 'top right',  // Position my top left...
                    at: 'bottom left' // at the bottom right of...
                },
                show: true
            });
            reminders.find('.time').off('click');
            $('#menuToggle').one('click', function(){
                plusTip.qtip('destroy', true);
            })
        });

        reminders.find('figure img').on('click', function(){
            plusTip.qtip('destroy', true);
        });


        time.on('click', function(){
            numberTip.qtip('destroy', true);
        });

        $('#menuToggle').one('click', function(){
            numberTip.qtip('destroy', true);
        })

    }

}


function share(message){
    if (cordovaLoaded){
        window.plugins.socialsharing.share(message + "\n\nSent via ",
            null,
            null, //'http://whatsdueapp.com/img/logo-text-white.png',
            'http://whatsdueapp.com')
    } else{
        console.log(message);
    }
}

function shareModal(assignment, course, message){
    $("#share-modal").modal({onShow: function (dialog) {
        // Access elements inside the dialog
        $(".assignment-name", dialog.data).text(assignment);

        /* Prevent accidental click*/
        setTimeout(function(){
            $(".button", dialog.data).hover(function() {
                $(this).css('opacity', '0.5')
            }, function() {
                    $(this).css('opacity', '1')
                }
            );

            $(".share", dialog.data).click(function () {
                share(message);
                setTimeout(function(){
                        $.modal.close()
                    },
                    20);
                trackEvent('Assignment Shared');
                return false;
            });
            $(".report", dialog.data).click(function () {
                var subject="WhatsDue%20Change%20Report";
                var body ="School:%20"+ getSchool() +"%0D%0ACourse:%20"+ course +"%0D%0AAssignment:%20" + assignment +"%0D%0A-------------------------------------------%0D%0APlease%20write%20your%20correction%20here:";
                window.location='mailto:aaron@whatsdueapp.com?subject='+subject+'&body='+body;
                $.modal.close();
                trackEvent('Assignment Reported');
            });
            $(".close", dialog.data).click(function () {
                $.modal.close();
                trackEvent('Assignment Reported');
            });
        }, 200)
    }});
}


function filter(textArea){
    $('#'+textArea).keyup(function(){
        var searchTerm = $(this).val();
        $('.list li').each(function(){
            var text = $(this).text().toLowerCase();
            if (searchTerm != "") {
                if(text.indexOf(searchTerm) > 0){
                    $(this).show();
                }
                else{
                    $(this).hide();
                }
            }
            else{
                $(this).show();
            }
        });
    });
}