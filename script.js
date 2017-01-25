'use strict';

var app = angular.module('assign',['ngRoute','angular.morris-chart']);

app.config(function($routeProvider) {
    $routeProvider
    .when("/home", {
        templateUrl : "main.html",
        controller : "mainControl"
    })
    .when("/reports", {
        templateUrl : "report.html",
        controller : "reportControl"
    })
    .otherwise({
        redirectTo: '/home'
    });
});

app.controller("HeaderController",["$scope","$location",function($scope,$location) {
  $scope.getClass = function (path) {
    return ($location.path().substr(0, path.length) === path) ? 'active' : '';
  };
}]);

app.controller("mainControl",["$scope","commonService",function($scope,commonService){
  var date_cur = new Date();
  $scope.activeTab = "home";
  $scope.example = {
    plan_name : "xxxx",
    values : 50,
    from_date : new Date(),
    to_date : new Date(new Date().getTime() + 7*24*60*60*1000)
  };
  $scope.checkErr = function(startDate,endDate) {
        $scope.errMessage = '';
        //var curDate = new Date();
        
        if(new Date(startDate) > new Date(endDate)){
          $scope.errMessage = 'End Date should be greater than start date';
          return false;
        }
        // if(new Date(startDate) < curDate){
        //   $scope.errMessage = 'Start date should not be before today.';
        //   return false;
        // }
    };
    
    $scope.save_data = function(userData){
      $scope.setInfo = commonService.setInfo(userData);
      window.location = "#/reports";
      // $scope.info = commonService.getInfo();
      // console.log($scope.info); 
    }
}]);

app.controller("reportControl",["$scope","commonService",function($scope,commonService){
  $scope.info = commonService.getInfo();
}]);

 app.service('commonService', function ($http) {

        var info = [];

        return {
            getInfo: getInfo,
            setInfo: setInfo
        };

        // .................

        function getInfo() {
            return info;
        }

        function setInfo(value) {
            info.push(value);
        }
});

app.directive("chartModule",function(){
  return{
    restrict:'E',
    replace: false,
    transclude: true,
    scope : {
      values : '@'
    },
    template : '<div donut-chart="" ng-transclude donut-data="chartData" donut-colors="chartColors" donut-formatter="myFormatter"></div>',
    link : function(scope, element, attrs){
      //scope.labels = "Used Value";
       scope.chartData = [
        {label: "Used", value: scope.values},
        {label: "Un-Used", value: (100 - scope.values)}
      ];
      scope.chartColors = ["#31C0BE","#fff"];
      scope.myFormatter = function(input) {
        return input + '%';
      };
      
    }
  }
});
