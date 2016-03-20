$(document).ready(function(){
	"uses strict";
	var ENDPOINT = "http://localhost:3000/";

	var userID = 0;

	function isEmptyRegister(){
			var user = $("#username").val();
			var pass = $("#password").val();

			if (user == ""){
				return false;
			}

			if (pass == ""){
				return false;
			}

			return true;
	}

	function isEmptyLogin(){
			var user = $("#username-login").val();
			var pass = $("#password-login").val();
			if (user == ""){
				return false;
			}

			if (pass == ""){
				return false;
			}

			return true;
	}

	function loggedUser(value){
		$("#login-form").hide();
		$("#register-form").hide();
		$("#portfolio").show();
		$("#profile-dropdown").show();
//		console.log(responce);
		_url = ENDPOINT+"users"+"?id="+value;
		console.log(_url);
		var createPromise = $.ajax({
			url: _url,
			method: "GET",
			dataType: "JSON"
		}).then(function(responce){
			console.log(responce[0].fname);
			$("#logged-username").text(responce[0].fname);
		});
//		userId = responce[0].id;
//		console.log("UserID: " + userID);
	}
	
	function ReadCookie() {
       var allcookies = document.cookie;
       // Get all the cookies pairs in an array
       cookiearray = allcookies.split(';');
       cookiearray = allcookies.split(' ');
       // Now take key value pair out of this array
       for(var i = 0; i < cookiearray.length; i++){
          name = cookiearray[i].split('=')[0];
          if( name == "moneyLogged" ) {
        	  value = cookiearray[i].split('=')[1];
        	  value = value.split(';')[0];
        	  console.log("Cookie value: " + value);
        	  loggedUser(value);
        	  
        	  return value;
          }
       }
    }
	
	function logOut(){
		document.cookie = "moneyLogged=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
		location.reload();
		$("#profile-dropdown").hide();
	}

	function isUsernameTaken(){
		var user = $("input#username").val();
		
		_url = ENDPOINT+"users"+"?username="+user;
		var createPromise = $.ajax({
			url: _url,
			method: "GET",
			dataType: "JSON"
		}).then(function(responce){
			if (responce == ""){
				registerUser();
			} else {
				alert("Username is already taken!");
			}
		});
	}
	
	function registerUser(){
		$("#register-form").hide();
		$("#login-form").show();
		var fname = $("#fname").val();
		var lname = $("#lname").val();
		var email = $("#email").val();
		var user = $("#username").val();
		var pass = $("#password").val();
		data = {
			"fname": fname,
			"lname": lname,
			"email": email,
			"username": user,
			"password": pass,
		}
		_url = ENDPOINT + "users";
		var createPromise = $.ajax({
			url: _url,
			method: "POST",
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(data),
			dataType: "json"
		}).then(function(responce){
			console.log(responce);
		});
	}
	
	function saveCategory(user_id) {
		var cat_name = $("#category").val();
		var icon_num = $(".chosen-icon .icon").attr( "id" );
		var user_id = ReadCookie();
		console.log(user_id);
		data = {
			"cat_name": cat_name,
			"icon_num": icon_num,
			"user_id": user_id,
		}
		_url = ENDPOINT + "categories";
		var createPromise = $.ajax({
			url: _url,
			method: "POST",
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(data),
			dataType: "json"
		}).then(function(responce){
			console.log(responce);
		});
	}

	function loginUser(){
		var name = $("#username-login").val();
		var pass = $("#password-login").val();
	
		_url = ENDPOINT+"users"+"?username="+name+"&password="+pass;
		var createPromise = $.ajax({
			url: _url,
			method: "GET",
			dataType: "JSON"
		}).then(function(responce){
			if (responce == ""){
				alert("Wrong username or password!");
			} else {
				console.log(responce);
				userID = responce[0].id;
				document.cookie="moneyLogged="+userID;
				loggedUser(userID);
			}
		});
	}

	function attachHandlers(){		
		$("#profile-dropdown").hide();
		
		$( document ).ready(function() {
			ReadCookie();
		});
		
		$("#portfolio").hide();
		$("#register-form").hide();
		$("#register").on("click", function(){
			if ( isEmptyRegister() ){
				isUsernameTaken();
			}
		});
		
		$("#login").on("click", function(){
			if ( isEmptyLogin() ) {
				loginUser();
			}
		});
		
		$("#log-out").on("click", function(){
			logOut();
		});
		
		$("#show-login-form").on("click", function(){
			$("#login-form").show();
			$("#register-form").hide();
		});
		
		$("#show-register-form").on("click", function(){
			$("#login-form").hide();
			$("#register-form").show();
		});
		
		
		for (i = 1; i <= 46; i++) {
			icon = '<div class="col-xs-1">\
		    	<img id="'+i+'" src="img/categories/icon-'+i+'.png" class="img-responsive img-centered icon" alt="" >\
		    </div>';	
			$( ".icons" ).append(icon);
		}
		
		$(".icon").on("click", function(){
			iconNum = $(this).attr( "id" );
			icon = '<div class="col-xs-3">\
		    	<img id="'+iconNum+'" src="img/categories/icon-'+iconNum+'.png" class="img-responsive img-centered icon" alt="" >\
		    </div>';
			$(".chosen-icon").html(icon);
		});
		
		$("#saveCat").on("click", function(){
			saveCategory();
		});
		
	}

	attachHandlers();

})