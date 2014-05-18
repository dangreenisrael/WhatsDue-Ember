/**
 * Created by dan on 2014-05-14.
 */


App.CoursesView = Ember.View.extend({
    didInsertElement: function() {
        Ember.run.schedule('afterRender', this, 'processChildElements');
    },
    processChildElements: function() {
        // do here what you want with the DOM
        toggle();
        filter('search');
    }
});

App.EnrolledView = Ember.View.extend({
    didInsertElement: function() {
        Ember.run.schedule('afterRender', this, 'processChildElements');
    },
    processChildElements: function() {
        // do here what you want with the DOM
        toggle();
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
function toggle(){
    $( ".panel-heading" ).click(function() {

        if ($( this).next().css( "height")<"50px"){

            $( ".panel-collapse").css('height', '0');
            $( "button").css('opacity', '0' );

            $(this).find('button.opacity-zero').css('opacity', '1' );
            $(this).next().css('height', '75px' );
        }
        else{
            $(this).next().css( 'height', '0px' );
            $(this).find('button').css('opacity','0' );
        }
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
