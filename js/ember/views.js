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


/** My Functions for fanciness**/



/* Toggle for the courses page (Phone Gap Friendly) */
function toggle(){
    $( ".panel-heading" ).click(function() {
        console.log($( this).next().css( "max-height"));
        if ($( this).next().css( "height")<"50px"){
            $( ".panel-collapse").transition({ height: '0' }, 0, 'snap');
            $( "button.invisible").transition({ 'opacity': '0' }, 500, 'linear');

            $(this).find('button.opacity-zero').transition({ 'opacity': '1' }, 500, 'snap');
            $(this).next().transition({ height: '75px' }, 500, 'linear');
        }
        else{
            $(this).next().transition({ height: '0px' }, 500, 'linear');
            $(this).find('button').transition({ 'opacity': '0' }, 500, 'snap');
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
