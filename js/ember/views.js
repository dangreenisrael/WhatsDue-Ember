/**
 * Created by dan on 2014-05-14.
 */

App.EnrolledView = Ember.View.extend({
    contentDidChange: function() {
        changeRoute();
        putBackable();
    }.observes('controller.filteredData')
});

App.UnenrolledView = Ember.View.extend({
    contentDidChange: function() {
        changeRoute();
        putBackable();
    }.observes('controller.filteredData')
});


App.AssignmentsView = Ember.View.extend({
    contentDidChange: function() {
        changeRoute();
    }.observes('controller.filteredData')
});

App.CompletedAssignmentsView = Ember.View.extend({
    contentDidChange: function() {
        putBackable();
    }.observes('controller.filteredData')
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