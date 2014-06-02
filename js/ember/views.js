/**
 * Created by dan on 2014-05-14.
 */

App.EnrolledView = Ember.View.extend({
    didInsertElement: function() {
        filter('search');
        toggleRight();
    }
});

App.UnenrolledView = Ember.View.extend({
    didInsertElement: function() {
        filter('search');
        toggleRight();
    }
});


App.AssignmentsView = Ember.View.extend({
    didInsertElement: function() {
        filter('search');
        toggleRight();
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
    });
}