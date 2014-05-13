! function ($) {
    "use strict";

    var canvasDirection, w = $(window), delay = 300;


    function closeOffCanvas(delay) {
        var container = $(".app");
        setTimeout(function(){
          container.removeClass("off-canvas");
          canvasDirection = undefined;
        }, delay);
    }

    $(".main-content").append('<div class="site-overlay"></div>');


    $(document).on("click", "[data-toggle=off-canvas]", function (e) {
        var container = $(".app");

        e.preventDefault();

        if (w.width() >= 767 ) {
            delay = 0;
        }

        if ($(this).data("move") === canvasDirection) {
            closeOffCanvas(delay);
        }

        if ($(this).data("move") !== undefined && $(this).data("move") === "rtl") {
            container.toggleClass("move-right").removeClass("move-left");
            canvasDirection = "rtl";
        } else {
            container.toggleClass("move-left").removeClass("move-right");
            canvasDirection = "ltr";

        }

        if (container.hasClass("move-right") || container.hasClass("move-left")) {
            container.addClass("off-canvas");

        }

    });

    $(document).on("click", ".site-overlay, .main-navigation ul li", function (e) {
        var container = $(".app");
        e.preventDefault();

        if (w.width() >= 767) {
            delay = 0;
        }

        if (container.hasClass("move-right") || container.hasClass("move-left")) {
            closeOffCanvas(delay);
        }

        if (container.hasClass("move-right")) {
            container.toggleClass("move-right");
        }

        if (container.hasClass("move-left")) {
            container.toggleClass("move-left");
        }
    });

}(window.jQuery);
