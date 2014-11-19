$(function() {
    var nextPage = 1;
    var loading = false;
    var lastTime;
    var c = $('#posts').attr('c');
    function getNextPage() {
        $.ajax({
            type:"GET",
            url:'/postpage?n=12&p='+nextPage+'&c='+c,
            dataType:'json',
            beforeSend:function(){
                $('.loading').show() //显示加载时候的提示
            },
            success:function(res){
                if(res.length==0) return;
                var html = '';
                for(var i=0; i<res.length; ++i) {
                    html += printAbstract(res[i]);
                }
                $('#posts').append(html);
                nextPage++;
                $('#posts').imagesLoaded( function() {
                    placePosts();
                    $('.loading').hide() //请求成功,隐藏加载提示
                });
            },
            complete:function(jqXHR, textStatus) {
                loading = false;
            }
        })
//        $.getJSON('postpage?n=12&p='+nextPage,function(res){
//            var html = '';
//            for(var i=0; i<res.length; ++i) {
//                html += printAbstract(res[i]);
//            }
//            $('#posts').append(html);
////        var imgLoad = imagesLoaded( document.querySelector('#posts') );
////        imgLoad.on( 'always', onAlways );
//            $('#posts').imagesLoaded( function() {
//                placePosts();
//            });
//        });
    }
    getNextPage();

    function showMore() {
        if($(document).scrollTop()>=$(document).height()-$(window).height()-117){
            if(loading) return;
            var thisTime = new Date().getTime();
            if(lastTime&&thisTime-lastTime<1000)return;
            loading = true;
            lastTime = thisTime;
            getNextPage();
        }
    }

    $(window).scroll(showMore);
    $(window).resize(placePosts);

});

function placePosts() {
    $('.abstract').show();
    var col = 3;
    var width = $(window).width();
//    console.log(width+':'+$('#posts').width());
    if(width>976) {
        col = 3;
    } else if(width>752) {
        col = 2;
    } else {
        col = 1;
    }
    var postWidth = $('#posts').width()/col;
    var heightArr = new Array(col);
    for(var i=0;i<col;++i) {
        heightArr[i] = 0;
    }
    var posts = $('.post');
    for(var i=0;i<posts.length;++i) {
        var post = posts[i];
        var height = $(post).height();
        $(post).css("left", (i%col)*postWidth);
        var icol = i%col;
        $(post).css("top", heightArr[icol]);
        heightArr[icol] += height;
//            $(post).attr("left", (i%col)*100);
//            console.log(post);
    }
    var maxHeight = 0;
    for(var i=0;i<col;++i) {
        maxHeight = maxHeight>heightArr[i]?maxHeight:heightArr[i];
    }
    $('#posts').css('height', maxHeight);
}

function printAbstract(post) {
//    console.log(post);
    var html = "<div class='col-sm-6 col-md-4 post'>"; //
    var imglink = post['图片链接']?post['图片链接']:((post['图片']&&post['图片'].url) ? post['图片'].url : '/images/test.png');
    var link = post['链接']? post['链接']: "/posts/post/"+post['_id']
    html += "<div class='abstract' style='display:none'><a href='"+link+"'>";
    html += "<img class='img-responsive' src='"+imglink+"'/>";
    html += "<div class='gradient'><div class='gradient-title'>";
    html += "<h3><small><font class='abstract-title'>"+post['标题']+"</font></small></h3>"
    html += "<h4><small><span class='glyphicon glyphicon-share glyphicon-inverse'></span>";
    html += "<font class='abstract-text'>"+post['分享数']+"</font><span class='glyphicon glyphicon-thumbs-up glyphicon-inverse'></span>";
    html += "<font class='abstract-text'>"+post['赞数']+"</font></small></h4>"
    html += "</div></div></a></div></div>";
    return html;
}