$(document).ready(function () {



    function redrawLine () {
        setTimeout(function(){
          line.redraw();
        }, 100);
    }

    $(document).on("click", ".toggle-sidebar", function () {
        redrawLine();
    });

    $(document).on("click", ".site-overlay", function () {
        $(".app").removeClass("small-sidebar");
        redrawLine();
    });

 
});
