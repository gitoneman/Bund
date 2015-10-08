

angular.module('app', ['ionic', 'controllers'])

.run(function($rootScope, $http, $ionicModal, $timeout, $location, $window, localstorage){
  

  ionic.Platform.ready(function(){
    //will execute when device is ready, or immediately if the device is already ready.

    function isNativeApp() {
        return /app/.test(window.location.search);
        return /bundapp/.test(navigator.userAgent);
    }

    var bundWebApp = document.getElementById('bundWebApp');
    if(isNativeApp()){
      angular.element(bundWebApp).addClass('platform-webview platform-cordova');

    }
    if (ionic.Platform.isIOS()) {
      angular.element(bundWebApp).addClass('platform-ios');

    }else if(ionic.Platform.isAndroid()){
      angular.element(bundWebApp).addClass('platform-android');
    }
  });

  var url = $location.url();
  var bootScreenTime = '';
  var adTime = '';

  if(url == "/app/news"){
    $http.get("/app-launch")
      .success(function(data){
        if(data == null){
          return;
        }else{
          // $rootScope.frameUrl = 'http://www.qunar.com';
          $rootScope.frameUrl =data['宽带链接'];
          adTime = data['显示时长']+'000';
        }

        $ionicModal.fromTemplateUrl('templates/bootScreen.html', {
          scope: $rootScope,
          animation: 'superScaleIn'
        }).then(function(modal) {
          $rootScope.bootScreenModal = modal;
          modal.show();
        });

        $rootScope.closeBootScreen = function() {
          $rootScope.bootScreenModal.hide();
        };

        $window.afterLoad = function(){
          document.getElementById('useAd').style.display = 'block';
          bootScreenTime = adTime;

          $timeout(function() {
           $rootScope.bootScreenModal.hide();
          }, bootScreenTime);
        };
      });
  }
})

.config(function($stateProvider, $urlRouterProvider ,$sceDelegateProvider, $sceProvider, $ionicConfigProvider) {

  // if(!ionic.Platform.isIOS())$ionicConfigProvider.scrolling.jsScrolling(false);

  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'mainController'
  })

  .state('app.news', {
    url: '/news',
    views:{
      'menuContent': {
        templateUrl: "templates/news.html",
        controller: 'news'
      }
    }
  })

  .state('app.detail', {
    url: '/news/detail/:id',
    views:{
      'menuContent': {
        templateUrl: "templates/detail.html",
        controller: 'detail'
      }
    }
  })

  .state('app.commentDetail', {
    url: '/news/commentDetail',
    views:{
      'menuContent': {
        templateUrl: "templates/commentDetail.html",
        controller: 'detail'
      }
    }
  })

  // .state('app.outlink', {
  //   url: '/news/outlink/:id',
  //   views:{
  //     'menuContent': {
  //       templateUrl: "templates/outlink.html",
  //       controller: 'outlink'
  //     }
  //   }
  // })

  .state('app.favorite', {
    url: '/favorite',
    views:{
      'menuContent': {
        templateUrl: "templates/favorite.html",
        controller: 'favorite'
      }
    }
  });

  $urlRouterProvider.otherwise("/app/news");

  $sceProvider.enabled(false);

  // $sceDelegateProvider.resourceUrlWhitelist([
  //   // Allow same origin resource loads.
  //   'self',
  //   // Allow loading from outer templates domain.
  //   '/**',
  //   // 'http://www.baidu.com/**',
  //   'http://mp.weixin.qq.com/**'
  // ]); 
});




