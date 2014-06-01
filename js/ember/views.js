/**
 * Created by dan on 2014-05-14.
 */


App.CoursesView = Ember.View.extend({
    didInsertElement: function() {
        Ember.run.schedule('afterRender', this, 'processChildElements');
        filter('search');
        toggleRight();
    },

    processChildElements: function() {
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


function filter(textArea){
    $('#'+textArea).keyup(function(){
        var search = $(this).val().toLowerCase();
        $('.list').each(function(){
            var text = $(this).find('a').text().toLowerCase();
            console.log(text);
            if(text.indexOf(search) < 0){
                $(this).hide();
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
       //var html = $( ".right-sidebar-move").clone(true,true);
       //var sidebar = $('.right-sidebar-content');
       //sidebar.empty();
       //sidebar.html(html);
    })
}