/**
 * Created by dan on 2014-05-14.
 */


App.CoursesView = Ember.View.extend({
    didInsertElement: function() {
        Ember.run.schedule('afterRender', this, 'processChildElements');
        filter('search');
        toggleRight();
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


function toggleRight(){
    $('.toggle-right').click(function(){
       $('.app').addClass('move-right off-canvas');
    })
}