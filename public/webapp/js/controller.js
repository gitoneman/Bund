
angular.module('controllers', ['tabSlideBox'])


.controller("mainController", function($scope, $ionicModal, $timeout ,$http, localstorage, formDataObject){

  // Form data for the login modal
  $scope.loginData = {};
  $scope.checkLogin = function () {
    if (Object.getOwnPropertyNames(localstorage.getObject('userinfo')).length > 0) return true;
    else return false;
  }

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.loginModal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.loginModal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.loginModal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    var postLoginData = {
      no:($scope.loginData.phonenumber?$scope.loginData.phonenumber:""),
      pwd:($scope.loginData.password?$scope.loginData.password:"")
    }
    postLoginData.pwd = pwdEncode(postLoginData.pwd);
    $http.get("http://www.bundpic.com/app-login?no="+postLoginData.no+"&pwd="+postLoginData.pwd)
      .success(function(data){
        if (data == 0) {
          alert('用户名或密码为空');
        } else if (data == 1) {
          alert('密码已经连续错误3次，5分钟内不允许登陆');
        } else if (data == 2) {
          alert('密码错误');
        } else if (data == 3) {
          alert('用户不存在');
        } else if (data == 4) {
          alert('服务器错误');
        } else {
          localstorage.setObject('userinfo',data);
          // var userinfo = localstorage.getObject('userinfo');
          // $scope.username = userinfo.username;
          // $scope.userToken = userinfo.userToken;
          $timeout(function() {
            $scope.closeLogin();
          }, 1000);
        }
      });
  };
  $scope.logout = function(){
    //emove/clean all the values from local storage than use
    // localStorage.clear();
    // remove the specific item from local storage than use the following code
    localStorage.removeItem('userinfo');
    // $scope.username = '';
  };
  $scope.checkLogout = function () {
    if (Object.getOwnPropertyNames(localstorage.getObject('userinfo')).length == 0) return true;
    else return false;
  }

// registration

  $scope.registrationData = {};

  // Create the registration modal that we will use later
  $ionicModal.fromTemplateUrl('templates/registration.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.registrationModal = modal;
  });

  // Triggered in the registration modal to close it
  $scope.closeRegistration = function() {
    $scope.registrationModal.hide();
  };

  // Open the registration modal
  $scope.registration = function() {
    $scope.registrationModal.show();
  };

  $scope.doRegistration = function() {

      var postRegistrationData = {
        no:($scope.registrationData.phonenumber?$scope.registrationData.phonenumber:""),
        uname:($scope.registrationData.username?$scope.registrationData.username:""),
        pwd:($scope.registrationData.password?$scope.registrationData.password:""),
        vcode:($scope.registrationData.vcode?$scope.registrationData.vcode:"")
      };
      postRegistrationData.pwd = pwdEncode(postRegistrationData.pwd);
      $http({
        method: 'POST',
        url: 'http://www.bundpic.com/app-join',
        headers: {
          'Content-Type': undefined
        },
        data:postRegistrationData,
        transformRequest: formDataObject
      }).success(function(data) {
        if (data == 1) {
          alert('输入信息不完整');
        } else if (data == 2) {
          alert('此手机号已被注册');
        } else if (data == 3) {
          alert('验证码不正确');
        } else if (data == 4) {
          alert('注册用户失败');
        } else if (data == 5) {
          alert('还没有获取验证码');
        } else {
          alert(data);
        }
      });
  };

  $scope.getVcode = function(){
    if($scope.registrationData.phonenumber == null || $scope.registrationData.phonenumber == undefined) return;

    $http.get("http://www.bundpic.com/app-vcode?no="+$scope.registrationData.phonenumber)
      .success(function(data){
        //console.log(data)
      });
  }

  function pwdEncode(s) {
    var pw = "TheBund2014"
    var a=0;
    var myString='';
    var textLen=s.length;
    var pwLen=pw.length;
    for (i=0;i<textLen;i++) 
    {
        a=parseInt(s.charCodeAt(i));
        a=a^(pw.charCodeAt(i%pwLen));
        a=a+"";
        while (a.length<3)
        a='0'+a;
        myString+=a;
    }
    return myString;
  };

})


.controller('detailModal', function($scope,$http,$ionicModal,localstorage,formDataObject,printComment) {

// // detail content 
//     // Triggered in the detail modal to close it
//     $scope.closeDetail = function() {
//       $scope.detailModal.hide();
//       $scope.detailModal.remove();
//     };

//     // Open the detail modal
//     $scope.showDetail = function(cLink,cid) {
//       $scope.cid = cid;
//       $scope.viewLink = '';
//       $ionicModal.fromTemplateUrl('templates/detail.html', {
//         scope: $scope,
//         animation: 'slide-in-up'
//       }).then(function(modal) {
//         $scope.detailModal = modal;
//         $scope.detailModal.show();
//         setTimeout(function(){
//           $scope.viewLink = decodeURIComponent(cLink);
//         }, 200);
//         detailModalController.getCommentCount();
//       });
//     };

//weixin image show
    var viewLink= document.getElementsByClassName('viewLink');
    var loadSpinner= document.getElementsByClassName('loadSpinner');
    $scope.getWXImage = function(){
      // setTimeout(function(){
      //   var ptag = angular.element(viewLink).contents().find('div');
      //   console.log(angular.element(ptag).html());
      // }, 2000);
      
      var imgs = angular.element(viewLink).contents().find('img');
      var csm = 'http://read.html5.qq.com/image?src=forum&q=5&r=0&imgflag=7&imageUrl=';
      for(var i=0;i<imgs.length;i++) {
        if(angular.element(imgs[i]).attr("data-src") != undefined){
           var dataSrc = angular.element(imgs[i]).attr("data-src");
           angular.element(imgs[i]).attr('src', csm+dataSrc);
        }
      }
      angular.element(loadSpinner).css('display', 'none');
      angular.element(viewLink).css('display', 'block');
    };


//getCommentCount 
    $scope.getCommentCount = function(){
      $http.get("http://www.bundpic.com/comment-count?id="+$scope.cid)
        .success(function(data) {
          $scope.commentCount = data;
        });
    };
    $scope.getCommentCount();

// add to favorite 
    var favorite = false;
    // var userToken;
    // var userToken = localstorage.getObject('userinfo').userToken;
    // var username = localstorage.getObject('userinfo').username;
    // if (localstorage.getObject('userinfo') != null || Object.getOwnPropertyNames(localstorage.getObject('userinfo')).length > 0){
    //   var userinfo = localstorage.getObject('userinfo');
    // }
    $scope.toggleFavorite = function(){
      var addFav = document.getElementsByClassName('addFav');
      if(localstorage.getObject('userinfo').userToken == null || localstorage.getObject('userinfo').userToken == undefined){
        alert('登陆后收藏');
        return
      }
      if(!favorite){
        angular.element(addFav).css('color', '#ef473a');
        $http.get("http://www.bundpic.com/app-addfav?p="+$scope.cid+"&c="+localstorage.getObject('userinfo').userToken)
          .success(function(data) {
            if (data == 0) {
              console.log('收藏成功');
            } else if (data == 1) {
              console.log('缺少key');
            } else if (data == 2) {
              console.log('缺少文章id');
            } else if (data == 3) {
              console.log('服务器处理失败');
            } else if (data == 4) {
              console.log('key无效');
            } else if (data == 5) {
              console.log('已经收藏过');
            }
          });
        favorite = true;
      }else if(favorite){
        angular.element(addFav).css('color', 'white');
        $http.get("http://www.bundpic.com/app-delfav?p="+$scope.cid+"&c="+localstorage.getObject('userinfo').userToken)
          .success(function(data) {
            if (data == 0) {
              console.log('删除成功');
            } else if (data == 1) {
              console.log('缺少key');
            } else if (data == 2) {
              console.log('缺少文章id');
            } else if (data == 3) {
              console.log('服务器处理失败');
            } else if (data == 4) {
              console.log('key无效');
            } else if (data == 5) {
              console.log('没有收藏过');
            }
          });
        favorite = false;
      }
    };

//showCommentDetail modal
    $scope.showCommentDetail = function() {
      $ionicModal.fromTemplateUrl('templates/commentDetail.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        $scope.commentDetailModal = modal;
        $scope.commentDetailModal.show();
        $scope.getComment();
      });
    };

    $scope.closeCommentDetail = function() {
      commentp = 1;
      $scope.commentDetailModal.hide();
      $scope.commentDetailModal.remove();
    };

// doComment 
    $scope.comment = {};
    $scope.doComment = function() {

      if(localstorage.getObject('userinfo').userToken == null || localstorage.getObject('userinfo').userToken == undefined){
        alert('登陆后评论');
        return
      }

      var postComment = {
        c:localstorage.getObject('userinfo').userToken,
        p:$scope.cid,
        content:($scope.comment.data?$scope.comment.data:"")
      };

      function appendComment(postComment){
        var commentList = document.getElementsByClassName('commentList');
        var html = '';
        html = "<a class='item item-avatar itemMargin'>"
        var imglink = './img/user.png';
        html+= "<img src="+imglink+">";
        html+= "<h2>"+localstorage.getObject('userinfo').username+"</h2>"
        html+= "<p class='showAllComment'>"+$scope.comment.data+"</p></a>"
        angular.element(commentList).prepend(html);
      }

      $http({
        method: 'POST',
        url: 'http://www.bundpic.com/app-comment',
        headers: {
          'Content-Type': undefined
        },
        data:postComment,
        transformRequest: formDataObject
      }).success(function(data) {
        if (data == 0) {
          console.log('成功');
          appendComment();
        } else if (data == 1) {
          console.log('key格式不正确');
        } else if (data == 2) {
          console.log('文章id不正确');
        } else if (data == 3) {
          console.log('提交不成功');
        } else if (data == 4) {
          console.log('key无效');
        }
        $scope.comment.data = '';
      });
    }

//  insert comments to commentList
    var commentList = document.getElementsByClassName('commentList');
    var spinner = document.getElementsByClassName('spinner');
    var commentp=1;
    $scope.getComment = function(){
      $http.get("http://www.bundpic.com/comment?id="+$scope.cid+"&p="+commentp+"&n=10")
        .success(function(data) {
          // $scope.noMoreData = true;
          if(data != ''){
            var html = '';
            for (var i = 0; i < data.length ; i++) {
              html += printComment(data[i]);
            };
            commentp++;
            angular.element(commentList).append(html);
            // angular.element(spinner).css('display', 'none');
            // $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        });
    };

// share 
    $scope.share = function(){
      var shareTitle = encodeURIComponent(angular.element(viewLink).contents().find('p').html());
      var getShareImage = angular.element(viewLink).contents().find('img');
      var shareImage = encodeURIComponent(angular.element(getShareImage[0]).attr('src'));
      var shareLink = encodeURIComponent($scope.viewLink);


      if( window.webkit && window.webkit.messageHandlers.share ) {
        
        // var url = 'doFavorite?title='+shareTitle+'&image='+shareImage+'&link='+shareLink;
        var url = {
          title:shareTitle,
          image:shareImage,
          link:shareLink
        }
        window.webkit.messageHandlers.share.postMessage(url)
      }else if(Android){
        Android.androidShare(shareTitle,shareImage,shareLink);
      }

    }
})

.controller('news', function($scope,$q,$controller,$http,$window,$ionicSlideBoxDelegate,$compile,$stateParams,$ionicModal,localstorage,printAbstract,printAbstractBig) {

// detail content 
    // Triggered in the detail modal to close it
    $scope.closeDetail = function() {
      $scope.detailModal.hide();
      $scope.detailModal.remove();
    };

    // Open the detail modal
    $scope.showDetail = function(cLink,cid) {
      $scope.cid = cid;
      $scope.viewLink = '';
      $ionicModal.fromTemplateUrl('templates/detail.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        $scope.detailModal = modal;
        $scope.detailModal.show();
        setTimeout(function(){
          $scope.viewLink = decodeURIComponent(cLink);
        }, 200);
      });
    };

// pull to refresh
    // $scope.doRefresh = function() {
    //   $http.get('')
    //    .success(function(data) {
    //      $scope.items = data;
    //    })
    //    .finally(function() {
    //      // Stop the ion-refresher from spinning
    //      $scope.$broadcast('scroll.refreshComplete');
    //    });
    // };

// get cagegories and news
    var newsP = new Array();
    for(var j=0; j < 16; j++){
      newsP[j] = 1;
    }


    var tab = 0;
    $scope.data = {};
    $scope.data.categories = [];
    $scope.data.cateName = [];
    $scope.data.carousels = [];
    $scope.data.carousels[0] = [];
    $scope.data.carouselsLink = [];
    var posts = document.getElementsByClassName('posts');



    $scope.getCarousel = function(){
      $http.get("http://www.bundpic.com/app-carousel")
        .success(function(data){

          for (var i = 0; i < data.length; i++) {
            $scope.data.carousels[0][i] = {
              image: 'http://www.bundpic.com/upload/'+ data[i]['文件']['filename'],
              link: encodeURIComponent(data[i]['链接']),
              postId: data[i]['_id']
            };

          };
        });
    };
    $scope.getCarousel();

    var loadPost = document.getElementsByClassName('loadPost');
    $scope.loadMore = function(cTabs){
      if($scope.data.cateName.length==0) return;
      if(cTabs != tab) return;
      $http.get("http://www.bundpic.com/app-post?p="+newsP[cTabs]+"&n=16&c="+$scope.data.cateName[cTabs])
        .success(function(data,$document){
          var html = '';
          for (var i = 1; i <= data.length ; i++) {
            if(i%4 != 0){
              html += printAbstract(data[i-1]);
            }else{
              html += printAbstractBig(data[i-1]);
            }
          };
          newsP[cTabs]++;
          var compiledHtml = $compile(html)($scope);
          angular.element(posts[cTabs]).append(compiledHtml);
          angular.element(loadPost[cTabs]).css('display', 'none');
          // $scope.$broadcast('scroll.infiniteScrollComplete');
        })
    };

    var localCategories = localstorage.getObject('localCategories');
    $scope.getCategories = function(){

      function checkCategory(){
        $http.get("http://www.bundpic.com/app-category")
          .success(function(data){
            if(Object.getOwnPropertyNames(localCategories).length == 0){
              setCategories(data);
              $scope.loadMore(0);
            }
            try{
              localstorage.setObject('localCategories',data);
            }catch (e) { 
              alert("您处于无痕浏览，无法为您保存数据"); 
            }           
          });
      }

      if(Object.getOwnPropertyNames(localCategories).length > 0){
        setCategories(localCategories);
        $scope.loadMore(0);
        checkCategory();
      } else{
        checkCategory();
      }

      function setCategories (cata){
        $scope.data.categories.unshift('推荐');
        $scope.data.cateName.unshift('');
        // var categoryHtml = "<a href='javascript:;' class='tsb-icons' on-finish-render>推荐</a>";
        // var ionSlideHtml = '';
        for (var i = 0; i < cata.length; i++) {
          $scope.data.categories[i+1] = cata[i]['名称'];
          $scope.data.cateName[i+1]= cata[i]['标识'];

          $scope.data.carousels[i+1] = [];
          $scope.data.carousels[i+1][0] ={
            image:"http://www.bundpic.com/upload/" + cata[i]['焦点图']['filename'],
            link:''
          }
          // categoryHtml += "<a href='javascript:;' class='tsb-icons' on-finish-render>"+$scope.data.categories[i+1]+"</a>";
          // ionSlideHtml += "<ion-slide> <ion-content overflow-scroll='true' scrolly='loadMore(0)'> <ion-spinner class='loadSpinner loadPost'></ion-spinner> <div class='posts' touchess></div> </ion-content> </ion-slide>";
        };

        // var tsbHscroll = document.querySelector(".tsb-hscroll > div");
        // angular.element(tsbHscroll).append(categoryHtml);

        // var ionSlide = document.querySelector(".ionSlide");

        // angular.element(ionSlide).append(ionSlideHtml);

        // setTimeout(function() {
        //     angular.element(ionSlide).append(ionSlideHtml);

        //     $ionicSlideBoxDelegate.update();
        //     $scope.loadMore(0);
        //   }, 2000);
              
      }
    };
    $scope.getCategories();

    $scope.onSlideMove = function(data) {
      tab = data.index;
      // if($ionicSlideBoxDelegate.currentIndex() == $scope.data.categories.length - 1){
      //   $ionicSlideBoxDelegate.slide(0,0);
      //   return;
      // }
      if(angular.element(posts[data.index]).html() === ''){
        $scope.loadMore(data.index);
      }

    };

})

.controller('favorite', function($scope, $http,$controller, $compile, $ionicModal, localstorage, printAbstract) {
  // var userinfo = localstorage.getObject('userinfo');
  // $scope.username = userinfo.username;
  // var userToken = userinfo.userToken;
  var favList = document.getElementsByClassName('favList');

  // Triggered in the detail modal to close it
  $scope.closeDetail = function() {
    $scope.detailModal.hide();
    $scope.detailModal.remove();
  };

  // Open the detail modal
  $scope.showDetail = function(cLink,cid) {
    $scope.cid = cid;
    $scope.viewLink = '';
    $ionicModal.fromTemplateUrl('templates/detail.html', {
      scope: $scope,
      animation: 'slide-in-right'
    }).then(function(modal) {
      $scope.detailModal = modal;
      $scope.detailModal.show();
      setTimeout(function(){
        $scope.viewLink = decodeURIComponent(cLink);
      }, 200);
    });
  };

  $scope.getFavorite = function() {
    if(localstorage.getObject('userinfo').userToken == null || localstorage.getObject('userinfo').userToken == undefined){
      alert('登陆后查看收藏');
      return
    }
    $http.get("http://www.bundpic.com/app-favlist?&c="+localstorage.getObject('userinfo').userToken)
      .success(function(data) {
        if (data == 1) {
          console.log('服务器处理错误');
        } else if (data == 2) {
          // console.log('用户key无效');
          alert('登录后查看收藏');
        } else {
          var html = '';
          for (var i = data.length - 1; 0 <= i ; i--) {
            html += printAbstract(data[i]);
          };
          var compiledHtml = $compile(html)($scope);
          angular.element(favList).append(compiledHtml);
          // $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      });
  }
  $scope.getFavorite();

})


// .controller('detail', function($scope, $stateParams, $http, $timeout, $ionicPopover, localstorage, formDataObject) {
//   // allow ng-include load different page from below by id
  
//   $scope.getCommentCount = function(){
//     $http.get("http://www.bundpic.com/comment-count?id="+$stateParams.id)
//       .success(function(data) {
//         $scope.commentCount = data;
//       });
//   };
//   $scope.getCommentCount();

// })

// .controller('outlink', function($scope, $stateParams, $state, $ionicViewSwitcher) {

//   $scope.goBack = function(){
//     console.log('1');
//     $ionicViewSwitcher.nextTransition('none');
//     $state.go('app.news');
//   }

// })

.factory('localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.factory('formDataObject', function() {
  return function(data) {
    var fd = new FormData();
    angular.forEach(data, function(value, key) {
      fd.append(key, value);
    });
    return fd;
  };
})

.factory('printAbstract', function() {
  return function(post) {
    html = "<div class='post' >";
    var imglink = post['图片链接'] ? post['图片链接'] : ((post['缩略图'] && post['缩略图'].filename) ? 'http://www.bundpic.com/upload/' + post['缩略图'].filename : '/images/test.png');
    var link = post['链接'] ? encodeURIComponent(post['链接']): encodeURIComponent("http://www.bundpic.com/mpost/"+post['_id']);

    if( post['链接']){
      var postLink = post['链接'];

      html += "<div class='detail_recommend'><div class='re_con'>";
      if( window.webkit) {
        html += "<a href=\"javascript:window.webkit.messageHandlers.inappbrowser.postMessage(\'"+postLink+"\');\">"
      } else {
        html += "<a href='"+postLink+"'>"
      }
      
    }else{
      // link = "http://www.bundpic.com/mpost/"+post['_id'];
      html += "<div class='detail_recommend'><div class='re_con'>";
      html += "<a ng-click=\"showDetail(\'"+link+"\',\'"+post['_id']+"\');\">"
    }
    html += "<div class='re_con_left'><div class='imgbox'><img src='" + imglink + "'><div class='blackCover'></div></div></div>"
    html += "<div class='re_con_right'><div class='ellipsis'>" + post['标题'] + "</div>"
    html += "<div class='re_brief'>" + post['标题'] + "</div>"
    html += "<div class='re_from'>" + (post['来源'] ? post['来源']['名称'] : '') + "</div>"
    // var ctime = new Date(post['发布时间']);
    // html += "<span class='publish_time'>" + ctime.getFullYear() + "-" + (ctime.getMonth() + 1) + "-" + ctime.getDate() + "</span>"
    html += "</div></a></div></div></div>"
    return html;
  };
})

.factory('printAbstractBig', function() {
  return function(post) {
    html = "<div class='postBig' >";
    var imglink = post['图片链接'] ? post['图片链接'] : ((post['缩略图'] && post['缩略图'].filename) ? 'http://www.bundpic.com/upload/' + post['缩略图'].filename : '/images/test.png');
    var link = post['链接'] ? encodeURIComponent(post['链接']): encodeURIComponent("http://www.bundpic.com/mpost/"+post['_id']);
    if( post['链接']){
      var postLink = post['链接'];
      html += "<div class='postBig_bgimg'>";
      if(window.webkit) {
        html += "<a href=\"javascript:window.webkit.messageHandlers.inappbrowser.postMessage(\'"+postLink+"\');\">"

      } else {
        html += "<a href='"+postLink+"'>"
      }

    }else {
      // link = "http://www.bundpic.com/mpost/"+post['_id'];
      html += "<div class='postBig_bgimg'>";
      html += "<a ng-click=\"showDetail(\'"+link+"\',\'"+post['_id']+"\');\">"
    }

    html += "<div class='postBig_bgimg'>"
    html += "<img src='" + imglink + "' /><div class='blackCover'></div>"
    html += "<div class='postBig_content'><div class='postBig_title'>" + post['标题'] + "</div>"
    html += "<span class='postBig_icon'>" + (post['来源'] ? post['来源']['名称'] : '') + "</span>"
    html += "<div class='postBig_brief'>"+post['标题']+"</div>"
    html += "</div></div></a></div></div>"
    return html;
  };
})

.factory('printComment', function(){
  return function(post){
    html = "<a class='item item-avatar itemMargin'>"
    var imglink = './img/user.png';
    html+= "<img src="+imglink+" class='avaterComment'>";
    html+= "<h2>"+post['作者']['username']+"</h2>"
    html+= "<p class='showAllComment'>"+post['内容']['md']+"</p></a>"
    return html;
  };
})




