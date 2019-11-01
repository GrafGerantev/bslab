$(document).ready(function(){
    $('.promo-aside__item-first').on('click', function (e) {
        e.preventDefault();
        $(this).toggleClass('active');
        $('.promo-aside__inner').toggleClass('promo-aside__inner-active');
    });
    //Modal
    $('.promo-play__circle-play').on('click', function (e) {
        e.preventDefault();
        $('.overlay').fadeIn('slow');
    })
    $('.modal__close').on('click', function () {
        $('.overlay').fadeOut('slow');
    });
    //Hover
    /*$('.doing-item').hover(function () {
        $('.doing-item .text-arrow__text').toggleClass('text-arrow__text_none');
        $('.doing-item .text-arrow__arrow').toggleClass('text-arrow__arrow_blue');
        $('.doing-item .text-arrow__arrow').toggleClass('text-arrow__arrow_white');
    });*/
    $('.doing-item').each(function () {
        $(this).hover(function () {
            $(this).find('.text-arrow__text').toggleClass('text-arrow__text_none');
            $(this).find('.text-arrow__arrow').toggleClass('text-arrow__arrow_blue');
            $(this).find('.text-arrow__arrow').toggleClass('text-arrow__arrow_white');
        });
    });
});