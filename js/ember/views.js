/**
 * Created by dan on 2014-05-14.
 */

/** Theme Scripts that have to be run after ember templates load **/


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




function toggle(){
    $( ".panel-heading" ).click(function() {
        if ($( this).next().css( "display")=="block"){
            $(this).next().toggle('fast');
            $(this).find('button').fadeOut('fast');
        }
        else{
            $( ".panel-collapse").hide('fast');
            $(this).next().toggle('fast');
            $(this).find('button').fadeIn('fast');

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
