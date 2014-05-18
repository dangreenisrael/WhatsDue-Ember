/**
 * Created by dan on 2014-05-14.
 */


App.CoursesView = Ember.View.extend({
    didInsertElement: function() {
        Ember.run.schedule('afterRender', this, 'processChildElements');
    },
    processChildElements: function() {
        // do here what you want with the DOM
        courses();
        filter('search');
    }
});

App.EnrolledView = Ember.View.extend({
    didInsertElement: function() {
        Ember.run.schedule('afterRender', this, 'processChildElements');
    },
    processChildElements: function() {
        // do here what you want with the DOM
        courses();
        filter('search');
    }
});

App.AssignmentsView = Ember.View.extend({
    didInsertElement: function() {
        Ember.run.schedule('afterRender', this, 'processChildElements');
    },
    processChildElements: function() {
        // do here what you want with the DOM

    }
});


/** My Functions for fanciness**/


/* Toggle for the courses page (Phone Gap Friendly) */
function courses(){
    var hidden = {'height': '0px', 'opacity':'0' };
    var visible = {'height': '75px', 'opacity':'1'}
    $( ".panel-heading" ).click(function() {

        if ($( this).next().css( "height")<"50px"){

            $( ".panel-collapse").css(hidden);
            $( "button").css('opacity', '0' );

            $(this).find('button.opacity-zero').css('opacity', '1' );
            $(this).next().css(visible);
        }
        else{
            $(this).next().css( hidden);
            $(this).find('button').css('opacity','0' );
        }
    });

    $(".remove").click(function(){
       $(this).parents(".panel.list").css( hidden);
    });
}


function filter(textArea){
    $('#'+textArea).keyup(function(){
        var search = $(this).val().toLowerCase();
        $('.list').each(function(){
            var text = $(this).find('a').text().toLowerCase();
            if(text.indexOf(search) < 0){
                $(this).hide();
            }
            else{
                $(this).show();
            }
        });
    });
}
