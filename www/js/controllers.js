angular.module('starter.controllers', ['firebase'])

.controller('LoginCtrl', function ($scope, $ionicModal, $state, $firebaseAuth, $ionicLoading, $rootScope) {
    console.log('Signup Controller Initialized');

    var ref = new Firebase("https://financelogin.firebaseio.com/");
    var auth = $firebaseAuth(ref);

    $scope.loginUser = function (user) {

        if (user && user.email && user.passlogin) {
            $ionicLoading.hide();

                auth.$authWithPassword({
                email: user.email,
                password: user.passlogin
            }).then(function (authData) {

                ref.child("users").child(authData.uid).once('value', function (snapshot) {
                    var val = snapshot.val();
                    localStorage.uid = authData.uid;

                $scope.$apply(function () {
                    $rootScope.email  = val;
                    
                });
            });
                $ionicLoading.hide();
                $state.go('instruction');
            }).catch(function (error) {
                alert("Authentication failed:" + error.message);
                $ionicLoading.hide();
            });
        }   else
        alert("Please enter email and password both");
    }
})


.controller('SignupCtrl', function ($scope, $ionicModal, $state, $firebaseAuth, $ionicLoading, $rootScope) {
    console.log('Signup Controller Initialized');

    var ref = new Firebase("https://financelogin.firebaseio.com/");
    var auth = $firebaseAuth(ref);

    $scope.createUser = function (user) {
        console.log("Create User Function called");
        if (user && user.email && user.password) {
            $ionicLoading.hide();

            auth.$createUser({
                email: user.email,
                password: user.password
            }).then(function (userData) {
                alert("User created successfully!");
                ref.child("users").child(userData.uid).set({
                    email: user.email,
                    password: user.password
                });
                $ionicLoading.hide();
                $state.go('instruction');
            }).catch(function (error) {
                alert("Error: " + error);
                $ionicLoading.hide();
            });
        } else
        alert("Please fill all details");
    }

    $scope.login = function (user) {


        if (user && user.email && user.passlogin) {
            $ionicLoading.hide();

            auth.$authWithPassword({
                email: user.email,
                password: user.passlogin
            }).then(function (authData) {

                console.log("Logged in as:" + authData.uid);
                ref.child("users").child(authData.uid).once('value', function (snapshot) {
                    var val = snapshot.val();
                // To Update AngularJS $scope either use $apply or $timeout
                $scope.$apply(function () {
                    $rootScope.email  = val;
                    
                });
            });
                $ionicLoading.hide();
                $state.go('instruction');
            }).catch(function (error) {
                alert("Authentication failed:" + error.message);
                $ionicLoading.hide();
            });
        } else
        alert("Please enter email and password both");

}
        $scope.loginFacebook = function() {



    var ref = new Firebase("https://financelogin.firebaseio.com/")
    var authObject = $firebaseAuth(ref);

    authObject.$authWithOAuthPopup('facebook').then(function(withData){
      
      console.log(authData);

    }).catch(function(error){
      console.log('error' + error);
       $state.go('instruction');
    })
}

})


.controller('AppCtrl', function($scope, $ionicModal, $state, $firebaseAuth, $ionicLoading, $rootScope) {

})

.controller('ocrCtrl', function ($scope, $state, $cordovaCamera, $ionicActionSheet, $ionicPlatform, $cordovaImagePicker, $ionicPopup, $ionicLoading) {
    $ionicPlatform.ready(function() {
    $scope.showAnalyzeButton = false;
    var self = this;
    this.showLoading = function() {
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>'
      });
    };
    this.hideLoading = function(){
      $ionicLoading.hide();
    };
    this.getPicture = function(index)   {
        var sourceType = index === 0 ? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA;
        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: sourceType,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation:true
        };
      $cordovaCamera.getPicture(options).then(function(imageData) {
        var image = document.getElementById('pic');
        image.src = "data:image/jpeg;base64," + imageData;
        $scope.showAnalyzeButton = true;
      }, function(err) {
          console.log(err);
      });
    };
    
  });
  $scope.showActionSheet = function(){
    var hideSheet = $ionicActionSheet.show({
      buttons: [
       { text: 'Choose Photo' },
       { text: 'Take Photo' }
      ],
      cancelText: 'Cancel',
      cancel: function() {
        console.log('cancel');
      },
      buttonClicked: function(index) {
        getPicture(index);
       return true;
      }
    });
  };
  $scope.showActionSheet();
  $scope.testOcrad = function(){
    self.showLoading();
    OCRAD(document.getElementById("pic"), function(text){
      self.hideLoading();
      alert(text);
      localStorage.ocrText = text;
      $state.go('app.ocr-save');
    });
  } ; 
})
.controller('saveocrCtrl', function ($scope, $firebaseArray, $filter, $ionicPopup, $state) {
    $scope.ocr = {text: localStorage.ocrText};
    $scope.date = $filter('date')(new Date(), 'MM/dd/yyyy');
    $scope.item = {};
    var year = $filter('date')(new Date(), 'yyyy');
    var month = $filter('date')(new Date(), 'MMMM');
    var day = $filter('date')(new Date(), 'dd');
    var totalExpense = new Firebase("https://financelogin.firebaseio.com/totalExpense/" + localStorage.uid + "/" + year);
    var totalExpenseArray = $firebaseArray(new Firebase("https://financelogin.firebaseio.com/totalExpense/" + localStorage.uid + "/" + year));
    var expenseRef = new Firebase("https://financelogin.firebaseio.com/expense/" + localStorage.uid + "/" + year + "/" + month + "/" + day);
    $scope.expense = $firebaseArray(expenseRef);
    $scope.addExpense = function(e) {
        if ($scope.item.label == "" || $scope.item.price == 0 || $scope.item.price == null) {  
            var errorPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'Please fill in all details !'
            });
            return errorPopup;
        }
        var cost = $scope.item.price * $scope.item.quantity;
        cost = cost.toFixed(2);
        $scope.expense.$add({
            tarikh: $scope.date,
            label: $scope.ocr.text,
            price: $scope.item.price,
            quantity: 1,
            cost: $scope.item.price
        });
        if (totalExpenseArray.length == 0)   {
            totalExpense.child(month).set({
                    total: cost
            });
        } else  {
            beforeTotal = totalExpenseArray[0].total;
            afterTotal = Number(beforeTotal) + Number(cost);
            totalExpense.child(month).set({
                    total: afterTotal
            })
        }
        $scope.item.label = '';
        $scope.item.price = '';
        
        localStorage.ocrText = "";
        alert('Success !');
        $state.go('app.expense');
    };
    $scope.send = function()    {
        console.log($scope.ocr.text);
    }
    $scope.goBack = function () {
        $state.go('app.expense');
    }
})

.controller('expenseCtrl', function ($scope, $firebaseArray, $filter, $ionicPopup) {

    $scope.date = $filter('date')(new Date(), 'MM/dd/yyyy');
    $scope.item = {};
    var year = $filter('date')(new Date(), 'yyyy');
    var month = $filter('date')(new Date(), 'MMMM');
    var day = $filter('date')(new Date(), 'dd');

    var totalExpense = new Firebase("https://financelogin.firebaseio.com/totalExpense/" + localStorage.uid + "/" + year);
    var totalExpenseArray = $firebaseArray(new Firebase("https://financelogin.firebaseio.com/totalExpense/" + localStorage.uid + "/" + year));
    var expenseRef = new Firebase("https://financelogin.firebaseio.com/expense/" + localStorage.uid + "/" + year + "/" + month + "/" + day);
    $scope.expense = $firebaseArray(expenseRef);

    $scope.addExpense = function(e) {

        if ($scope.item.label == null || $scope.item.price == 0 || $scope.item.quantity == 0) {  
            var errorPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'Please fill in all details !'
            });
            return errorPopup;
        }

        var cost = $scope.item.price * $scope.item.quantity;
        cost = cost.toFixed(2);

        $scope.expense.$add({
            tarikh: $scope.date,
            label: $scope.item.label,
            price: $scope.item.price,
            quantity: $scope.item.quantity,
            cost: cost
        });

        if (totalExpenseArray.length == 0)   {
            totalExpense.child(month).set({
                    total: cost
            });
        } else  {
            beforeTotal = totalExpenseArray[0].total;
            afterTotal = Number(beforeTotal) + Number(cost);
            totalExpense.child(month).set({
                    total: afterTotal
            })
        }

        $scope.item.label = '';
        $scope.item.price = '';
        $scope.item.quantity = '';

    };

    $scope.removeExpense = function(item)   {
        $scope.expense.$remove(item)
            .then(function(expenseRef)  {
                if (expenseRef.key() == item.$id)   {
                    beforeTotal = totalExpenseArray[0].total;
                    afterTotal = Number(beforeTotal) - Number(item.cost);
                    totalExpense.child(month).set({
                            total: afterTotal
                    })
                    var errorPopup = $ionicPopup.alert({
                        title: 'Successfull',
                        template: 'Item removed form expenses !'
                    });
                    return errorPopup;
                }
            })
    }

    $scope.getTotal = function() {

        var rtnTotal = 0.00;
        for (var i = 0; i < $scope.expense.length; i++) {
            rtnTotal += Number($scope.expense[i].cost);
        }

        return rtnTotal.toFixed(2);
    };

})

.controller('reportCtrl', function ($scope, $firebaseArray, $filter, $ionicPopup) {
    
    $scope.report = [];
    $scope.form = {};

    $scope.getReport = function ()  {
        if ($scope.form.date == null) {
            
            var errorPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'Please specify the date !'
            });

            return errorPopup;
        }

        var year = $filter('date')($scope.form.date, "yyyy");
        var month = $filter('date')($scope.form.date, "MMMM");
        var day = $filter('date')($scope.form.date, "dd");

        $scope.report = [];
        var reportRef = new Firebase("https://financelogin.firebaseio.com/expense/" + localStorage.uid + "/" + year + "/" + month + "/" + day);

        $scope.report = $firebaseArray(reportRef);

    };

})

.controller('budgetCtrl', function ($scope, $firebaseObject, $filter, $ionicPopup, $firebaseArray) {
    
    $scope.year = $filter('date')(new Date(), 'yyyy');
    var month = $filter('date')(new Date(), 'MMMM');
    $scope.curBudgetStatus;

    var budgetRef = new Firebase("https://financelogin.firebaseio.com/budget/" + localStorage.uid + "/" + $scope.year);
    var currentBudgetRef = new Firebase("https://financelogin.firebaseio.com/budget/" + localStorage.uid + "/" + $scope.year + "/" + month);
    var allBudgetRef = new Firebase("https://financelogin.firebaseio.com/budget/" + localStorage.uid);

    $scope.currentBudget = $firebaseObject(currentBudgetRef);
    $scope.allBudget = $firebaseArray(allBudgetRef);

    $scope.currentBudget.$loaded().then (function() {
        $scope.curBudgetStatus = $scope.currentBudget.$value !== null;
    });


    $scope.saveBudget = function () {
        budgetRef.child(month).set({
                budget: $scope.item.budget,
                timestamp: Firebase.ServerValue.TIMESTAMP
        });
        $scope.curBudgetStatus = true;
    }

})

.controller('statisticCtrl', function ($scope, $firebaseObject, $filter, $ionicPopup, $firebaseArray, $timeout) {
    
    var year = $filter('date')(new Date(), 'yyyy');
    $scope.labelsA = [];
    $scope.seriesA = ['Budget over Month'];
    $scope.dataA = [];
    var budgetObjectA = [];
    var valueA = [];

    $scope.labelsB = [];
    $scope.seriesB = ['Expense over Month'];
    $scope.dataB = [];
    var expenseObjectB = [];
    var valueB = [];

    $scope.onePresent = false;
    $scope.budgetMonthPresent = false;
    $scope.expenseMonthPresent = false;

    var allBudgetRef = new Firebase("https://financelogin.firebaseio.com/budget/" + localStorage.uid + "/" + year);
    var allExpenseRef = new Firebase("https://financelogin.firebaseio.com/totalExpense/" + localStorage.uid + "/" + year);

    $scope.budgetMonth = function()   {
        $scope.dataA = [];
        valueA = [];
        for (var i=0; i < budgetObjectA.length; i++)    {
            console.log(budgetObjectA[i].budget);
            valueA.push(budgetObjectA[i].budget.toFixed(2));
        }

        $scope.dataA.push(valueA);
        $scope.onePresent = true;
        $scope.budgetMonthPresent = true;
        $scope.expenseMonthPresent = false;

    };
    
    allBudgetRef.once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key();
            $scope.labelsA.push(key);
            budgetObjectA.push(childSnapshot.val());

        });
    });

    $scope.expenseMonth = function()   {
        $scope.dataB = [];
        valueB = [];
        for (var i=0; i < expenseObjectB.length; i++)    {
            console.log(expenseObjectB[i].total);
            valueB.push(expenseObjectB[i].total.toFixed(2));
        }

        $scope.dataB.push(valueB);
        $scope.onePresent = true;
        $scope.budgetMonthPresent = false;
        $scope.expenseMonthPresent = true;
    };
    
    allExpenseRef.once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key();
            console.log(key);
            $scope.labelsB.push(key);
            expenseObjectB.push(childSnapshot.val());

        });
    });



    $scope.onClick = function (points, evt) {};

})