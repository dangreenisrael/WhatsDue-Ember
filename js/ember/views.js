/**
 * Created by dan on 2014-05-14.
 */

App.EnrolledView = Ember.View.extend({
    contentDidChange: function() {
        putBackable();
    }.observes('controller.filteredData'),
    afterRender: function(){
        makeSpinnable();
    }
});

App.UnenrolledView = Ember.View.extend({
    contentDidChange: function() {
        putBackable();
    }.observes('controller.filteredData'),
    afterRender: function(){
        if (cordovaLoaded == true){
            setTimeout(function(){
                cordova.plugins.Keyboard.show();
                $('#search').focus();
            }, 500)
        }
        makeSpinnable();

    }
});


App.AssignmentsView = Ember.View.extend({
    contentDidChange: function() {
        swipeRemove();
    }.observes('controller.filteredData'),
    afterRender: function(){
        sliderSize();
    }
});

App.CompletedAssignmentsView = Ember.View.extend({
    contentDidChange: function() {
        putBackable();
    }.observes('controller.filteredData')
});

App.RemindersView = Ember.View.extend({
    contentDidChange: function() {
        putBackable();
    }.observes('controller.model'),
    afterRender: function(){
    setTimeout(function(){
            reminderTips();
        }, 50
    );
}

});

App.SupportView = Ember.View.extend({
    afterRender: function(){
        sliderSize();
        setTimeout(function(){
                showSupport();
            }, 50
        );
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