$(function() {

    // Nav
    // ------------------------------
    $('#site-nav-toggle').click(function () {
        $(this).toggleClass('open');
        $('#site-nav').toggleClass('open');
        $('body').toggleClass('no-touch-scrolling');

        // Disable hardware scrolling on mobile
        if ($('body').is('.no-touch-scrolling')) {
            document.ontouchmove = function(e){ e.preventDefault(); }
        } else {
            document.ontouchmove = function(e){ return true; }
        };
    });





    // Generic confirms
    // ------------------------------

    $('.js-confirm').click(function(e) {
        if ( !confirm( $(this).data('confirm') || 'Are you sure? This cannot be undone.') )
            return e.preventDefault();
    });




    // UI Reveal
    // ------------------------------

    $('.ui-reveal__trigger').click( function() {
        container = $(this).closest('.ui-reveal');

        container.addClass('is-revealed');

        //- click ensures browse is envoked on file fields
        container.find('input[type!=hidden],textarea').eq(0).click().focus();
    });

    $('.ui-reveal__hide').click( function() {
        container = $(this).closest('.ui-reveal');

        container.removeClass('is-revealed');
    });



    // Signin / Join Modal
    // ------------------------------

    // init
    var $authmodal = $('#modal-auth');
    var authmodalPanes = $authmodal.find('.auth-box');

    // start on the right pane
    // defaults to "join"
    // options "signin" | "join" | "password"
    $("[href='#modal-auth'], [data-modal='auth'], .js-auth-trigger").click( function(e) {

        e.preventDefault();

        var initial = $(this).data("initial") || 'join';
        var initialPane = $authmodal.find('.modal-pane-' + initial);
        var from = $(this).data("from");

        $authmodal.modal('show');

        authmodalPanes.addClass('hidden');
        initialPane.removeClass('hidden');

        // only focus the first field on large devices where showing
        // the keyboard isn't a jarring experience
        if ($(window).width() >= 768) {
            initialPane.find('input[type!=hidden],textarea').eq(0).click().focus();
        }

        if (from) {
            $authmodal.find('[name="from"]').val(from);
        }
    });

    // move between panes
    $("[rel='modal-pane']").click( function() {

        var switchTo = $authmodal.find('.modal-pane-' + $(this).data("modal-pane"));

        authmodalPanes.addClass('hidden');
        switchTo.removeClass('hidden');


        // only focus the first field on large devices where showing
        // the keyboard isn't a jarring experience
        if ($(window).width() >= 768) {
            switchTo.find('input[type!=hidden],textarea').eq(0).click().focus();
        }

    });



    // Handle attendence
    // ------------------------------

    var $nextMeetup = $('#next-meetup');
    if ($nextMeetup.length) {

        if (!$('.meetup-toggle').length) return;

        var meetup = $nextMeetup.data();

        var $attending = $('.js-rsvp-attending'),
            $decline = $('.js-rsvp-decline');

        var toggleRSVP = function(attending) {
            $.ajax({
                url: '/api/me/meetup',
                type: 'POST',
                data: {
                    meetup: meetup.id,
                    attending: attending
                }
            });
        }

        $attending.click(function() {
            $attending.addClass('btn-success').closest('.meetup-toggle')
                .find('.js-rsvp-decline')
                .removeClass('btn-danger')
                .removeClass('active')
                .addClass('btn-default');
            if (!$attending.hasClass('active')) {
                $attending.addClass('active');
                toggleRSVP(true);
            }
        });

        $decline.click(function() {
            $decline.addClass('btn-danger').closest('.meetup-toggle')
                .find('.js-rsvp-attending')
                .removeClass('btn-success')
                .removeClass('active')
                .addClass('btn-default');
            if (!$decline.hasClass('active')) {
                $decline.addClass('active');
                toggleRSVP(false);
            }
        });

        $.ajax({
            url: '/api/me/meetup',
            type: 'POST',
            data: {
                statusOnly: true,
                meetup: meetup.id
            },
            success: function(data) {
                if (data.rsvped) {
                    data.attending ? $attending.addClass('btn-success active') : $decline.addClass('btn-danger active')
                } else {
                    $attending.addClass('btn-success');
                    $decline.addClass('btn-danger');
                }
            }
        });
    }

    // Clean up URL if signed in via Facebook, see - https://github.com/jaredhanson/passport-facebook/issues/12
    if (window.location.hash && window.location.hash === "#_=_") {

        if (window.history && history.pushState) {
            window.history.pushState("", document.title, window.location.pathname);
        } else {
            var scroll = {
                top: document.body.scrollTop,
                left: document.body.scrollLeft
            };
            window.location.hash = "";
            document.body.scrollTop = scroll.top;
            document.body.scrollLeft = scroll.left;
        }
    }

    if($("#myCarousel").length > 0) {
        $.getJSON('get-carousel',function(res){
            var carousel = $('<div/>',{ 'class': 'carousel-inner'});
            var indicator = $('<ol/>',{ 'class': 'carousel-indicators floor-2'});
            $.each(res, function(i, data) {
                var item,ind;
                if (i==0) {
                    item = $('<div/>',{ 'class': 'item active'});
                    ind = $('<li/>',{ 'class': 'active', 'data-target':'#myCarousel', 'data-slide-to':i});
                } else {
                    item = $('<div/>',{ 'class': 'item'});
                    ind = $('<li/>',{'data-target':'#myCarousel', 'data-slide-to':i});
                }
                var link = res[i]['链接']?res[i]['链接']:'#';
                $('<a href=\"'+link+'\"><img src="/upload/'+res[i]['文件'].filename+'"/></a>').appendTo(item );
//                    $('<div class="span2">'+res[i].My Image+'</div>').appendTo(item );
                item.appendTo(carousel);
                ind.appendTo(indicator);
            })
            indicator.appendTo('#myCarousel');
            carousel.appendTo('#myCarousel');
        });
    }

    //    $('#thumbbtn').click( function() {
//        if(this.text()=='点赞') {
//            $('#thumb').attr('value', 'thumb-down')();
//            $('#thumbcount').val($('#thumbcount').val() + 1);
//            this.removeClass('btn-success');
//            this.addClass('btn-info');
//            this.text('取消赞');
//        } else {
//            $('#thumb').attr('value', 'thumb-up')();
//            $('#thumbcount').val($('#thumbcount').val() - 1);
//            this.removeClass('btn-info');
//            this.addClass('btn-success');
//            this.text('点赞');
//        }
//    });

    $('.sharebtn').click( function() {
        var path = window.location.pathname;
        var paths = path.split('/');
        var post = paths[paths.length-1];
        $.ajax({
            url: '/share',
            type: 'POST',
            data: {
                post: post
            },
            success: function(data) {
                console.log(data);
            }
        });
    });

    $('[data-toggle=offcanvas]').click(function () {
        $('.row-offcanvas').toggleClass('active')
    });

    $('.image_with_info').each(function () {
        $(this).next('p').css("font-size", "14px");
    });

});
