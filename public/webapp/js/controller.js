
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
          var userinfo = localstorage.getObject('userinfo');

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
        console.log(data);
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
    $http.get("http://www.bundpic.com/app-vcode?no="+$scope.registrationData.phonenumber)
      .success(function(data){
        console.log(data)
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

.controller('news', function($scope,$http,$ionicSlideBoxDelegate,$stateParams,localstorage,printAbstract) {

    $scope.doRefresh = function() {
      $http.get('')
       .success(function(data) {
         $scope.items = data;
       })
       .finally(function() {
         // Stop the ion-refresher from spinning
         $scope.$broadcast('scroll.refreshComplete');
       });
    };

    var p = 1;
    var tab = 0;
    $scope.data = {};
    $scope.data.categories = [];
    $scope.data.cateName = [];
    $scope.data.carousels = [];

    var posts = document.getElementsByClassName('posts');

    $scope.getCarousel = function(){
      $http.get("http://www.bundpic.com/app-carousel")
        .success(function(data){
          $scope.data.carousels[0] = [];
          for (var i = 0; i < data.length; i++) {
            $scope.data.carousels[0][i] = data[i]['文件']['filename'];
          };
          $ionicSlideBoxDelegate.update();
        });
    };
    $scope.getCarousel();

    $scope.loadMore = function(cTabs){
      if($scope.data.cateName.length==0) return;
      if(cTabs != tab) return;
      $http.get("http://www.bundpic.com/app-post?p="+p+"&n=8&c="+$scope.data.cateName[cTabs])
        .success(function(data,$document){
          var html = '';
          for (var i = 0; i < data.length ; i++) {
            html += printAbstract(data[i]);
          };
          p++;
          angular.element(posts[cTabs]).append(html);
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
    };

    var localCategories = localstorage.getObject('localCategories');
    $scope.getCategories = function(){

      if(Object.getOwnPropertyNames(localCategories).length > 0){
        setCategories(localCategories);
      }else{
        $http.get("http://www.bundpic.com/app-category")
          .success(function(data){
            try{
              localstorage.setObject('localCategories',data);
            }catch (e) { 
              alert("您处于无痕浏览，无法为您保存数据"); 
            }
            setCategories(data);
          });
      }
      function setCategories (cata){
        for (var i = 0; i < cata.length; i++) {
          $scope.data.categories[i] = cata[i]['名称'];
          $scope.data.cateName[i]= cata[i]['标识'];
          $scope.data.carousels[i+1] = [];
          $scope.data.carousels[i+1][0] = cata[i]['焦点图']['filename'];
        };
        $scope.data.categories.unshift('推荐');
        $scope.data.cateName.unshift('');
        $ionicSlideBoxDelegate.update();
        $scope.loadMore(0);
      }
    };
    $scope.getCategories();

    $scope.onSlideMove = function(data) {
      tab = data.index;
      if(angular.element(posts[data.index]).html() === ''){
        p = 1;
        $scope.loadMore(data.index);
      }
    };
})

.controller('detail', function($scope, $stateParams, $http, $timeout, $ionicPopover, localstorage, formDataObject) {
  // allow ng-include load different page from below by id
  $scope.viewDetail = "http://www.bundpic.com/mpost/"+$stateParams.id;

  $scope.showDetail = function(){
    var viewDetail= document.getElementsByClassName('viewDetail');
    angular.element(viewDetail).css('display', 'block');
  };

  $scope.detailId = $stateParams.id;

  $scope.comment = {};
  var userinfo = localstorage.getObject('userinfo');
  var userToken = userinfo.userToken;
  // .fromTemplateUrl() method
  $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope,
    focusFirstInput: true
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.doComment = function() {
    var postComment = {
      c:userToken,
      p:$stateParams.id,
      content:($scope.comment.data?$scope.comment.data:"")
    };
    
    $http({
      method: 'POST',
      url: 'http://www.bundpic.com/app-comment',
      headers: {
        'Content-Type': undefined
      },
      data:postComment,
      transformRequest: formDataObject
    }).success(function(data) {
      console.log(data);
      if (data == 0) {
        console.log('成功');
      } else if (data == 1) {
        console.log('key格式不正确');
      } else if (data == 2) {
        console.log('文章id不正确');
      } else if (data == 3) {
        console.log('提交不成功');
      } else if (data == 4) {
        console.log('key无效');
      }
    });

    $timeout(function() {
      $scope.popover.hide();
    }, 1000);
  };

  var commentList = document.getElementsByClassName('commentList');
  var p=1;
  $scope.getComment = function(){
    $http.get("http://www.bundpic.com/comment?id="+$stateParams.id+"&p="+p+"&n=5")
      .success(function(data) {
        var html = '';
        for (var i = 0; i < data.length ; i++) {
          html += printComment(data[i]);
        };
        p++;
        angular.element(commentList).append(html);
        
        function printComment(post){
          html = "<a class='item item-avatar' ng-click='getComment();'>"
          var imglink = 'http://ionicframework.com/img/docs/venkman.jpg';
          html+= "<img src="+imglink+">";
          html+= "<h2>"+post['作者']['username']+"</h2>"
          html+= "<p class='showAllComment'>"+post['内容']['md']+"</p></a>"
          return html;
        }     
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
  };


  $scope.getCommentCount = function(){
    $http.get("http://www.bundpic.com/comment-count?id="+$stateParams.id)
      .success(function(data) {
        $scope.commentCount = data;
      });
  };
  $scope.getCommentCount();


  var favorite = false;
  $scope.toggleFavorite = function(){
    var addFav = document.getElementsByClassName('addFav');
    if(!favorite){
      angular.element(addFav).css('color', '#ef473a');;
      $http.get("http://www.bundpic.com/app-addfav?p="+$stateParams.id+"&c="+userToken)
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
      angular.element(addFav).css('color', 'hsl(0, 0%, 27%)');;
      $http.get("http://www.bundpic.com/app-delfav?p="+$stateParams.id+"&c="+userToken)
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
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });

})

.controller('outlink', function($scope, $stateParams) {
  // allow ng-include load different page from below by id
  // $stateParams.id has been encodeURIComponent for twice, so should decodeURIComponent it here
  $scope.viewOutlink = decodeURIComponent($stateParams.id);;
  var viewOutlink= document.getElementsByClassName('viewOutlink');
  
  $scope.getWXImage = function(){
    var imgs = angular.element(viewOutlink).contents().find('img');
    var csm = 'http://read.html5.qq.com/image?src=forum&q=5&r=0&imgflag=7&imageUrl=';

    for(var i=0;i<imgs.length;i++) {
      if(angular.element(imgs[i]).attr("data-src") != undefined){
         var dataSrc = angular.element(imgs[i]).attr("data-src");
         angular.element(imgs[i]).attr('src', csm+dataSrc);
      }
    }

    angular.element(viewOutlink).css('display', 'block');
  };
})

.controller('favorite', function($scope, $http, localstorage, printAbstract) {
  var userinfo = localstorage.getObject('userinfo');
  $scope.username = userinfo.username;
  var userToken = userinfo.userToken;
  var favList = document.getElementsByClassName('favList');

  $scope.getFavorite = function() {
    $http.get("http://www.bundpic.com/app-favlist?&c="+userToken)
      .success(function(data) {
        if (data == 1) {
          console.log('服务器处理错误');
        } else if (data == 2) {
          console.log('用户key无效');
        } else {
          var html = '';
          for (var i = 0; i < data.length ; i++) {
            html += printAbstract(data[i]);
          };
          angular.element(favList).append(html);
          // $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      });
  }
  $scope.getFavorite();
})

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
    var link = post['链接'] ? "#/app/news/outlink/"+encodeURIComponent(encodeURIComponent(post['链接'])): "#/app/news/detail/" + post['_id'];
    html += "<div class='detail_recommend'><div class='re_con'>";
    html += "<a href=" + link + ">"
    html += "<div class='re_con_left'><div class='ellipsis'>" + post['标题'] + "</div>"
    html += "<span class='re_from'>" + (post['来源'] ? post['来源']['名称'] : '') + "</span>"
    var ctime = new Date(post['发布时间']);
    html += "<span class='publish_time'>" + ctime.getFullYear() + "-" + (ctime.getMonth() + 1) + "-" + ctime.getDate() + "</span></div>"
    html += "<div class='re_con_right'><div class='imgbox'><img src='" + imglink + "'></div></div>"
    html += "</a></div></div></div>"
    return html;
  };
})






