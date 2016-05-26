$('document').ready(function () {

    setTimeout(function () {
        $('html, body').animate({
            scrollTop: $("#app-section").offset().top
        }, 800);
    },5000)

});