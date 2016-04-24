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
		_url = ENDPOINT+"users"+"?id="+value;
		var createPromise = $.ajax({
			url: _url,
			method: "GET",
			dataType: "JSON"
		}).then(function(response){
			console.log(response[0].fname);
			$("#logged-username").text(response[0].fname);
		});
		
		_urlCat = ENDPOINT+"categories?user_id="+value;
		var createPromise = $.ajax({
			url: _urlCat,
			method: "GET",
			dataType: "JSON"
		}).then(function(response){			
			showCategories(response);
		});
	}
	
	function showCategories(response){
		numberCat = response.length;
		$('.existing-categories').html('');
		for(i = 0; i < numberCat; i++) {
			iconNum = response[i].icon_num;
			catName = response[i].cat_name;
			iconBack = response[i].icon_back;
			catId = response[i].id;
			category = '<div class="col-sm-4 portfolio-item" style="background-color='+iconBack+'">\
                	<a href="#portfolioModal2" class="portfolio-link category-link" data-toggle="modal">\
			            <div class="caption">\
			                <div class="caption-content" id="'+catId+'">\
			                    <h1>'+catName+'</h1>\
			                </div>\
			            </div>\
			            <div class="category" style="background-color:'+iconBack+'"><img src="img/categories/icon-'+iconNum+'.png" class="img-responsive img-centered" alt="" /></div>\
			        </a>\
			    </div>';
			$('.existing-categories').append(category);
		}		
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
		window.location.href = 'index.html';
	}

	function isUsernameTaken(){
		var user = $("input#username").val();
		
		_url = ENDPOINT+"users"+"?username="+user;
		var createPromise = $.ajax({
			url: _url,
			method: "GET",
			dataType: "JSON"
		}).then(function(response){
			if (response == ""){
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
		}).then(function(response){
			console.log(response);
		});
	}
	
	function saveCategory() {
		var cat_name = $("#category").val();
		var icon_num = $(".chosen-icon .icon").attr( "id" );
		var icon_back = $(".chosen-icon .show-icon").css("background-color");
		console.log(icon_back);
		var user_id = ReadCookie();
		
		data = {
			"cat_name": cat_name,
			"icon_num": icon_num,
			"user_id": user_id,
			"icon_back": icon_back,
			"total_money": 0
		}
		_url = ENDPOINT + "categories";
		console.log(_url);
		var createPromise = $.ajax({
			url: _url,
			method: "POST",
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(data),
			dataType: "json"
		}).then(function(response){
			console.log(response);
		});
		
		return 0;
	}

	function loginUser(){
		var name = $("#username-login").val();
		var pass = $("#password-login").val();
	
		_url = ENDPOINT+"users"+"?username="+name+"&password="+pass;
		var createPromise = $.ajax({
			url: _url,
			method: "GET",
			dataType: "JSON"
		}).then(function(response){
			if (response == ""){
				alert("Wrong username or password!");
			} else {
				userID = response[0].id;
				document.cookie="moneyLogged="+userID;
				loggedUser(userID);
			}
		});		
	}
	
	function increaseTotalMoney(productPrice, response) {	
		
		catId = response[0].id;
		catName = response[0].cat_name;
		iconNum = response[0].icon_num;
		userId = response[0].user_id;
		iconBack = response[0].icon_back;
		
		totalMoney = response[0].total_money;
		totalMoney = parseInt(totalMoney);
		totalMoney += productPrice;
		
		_url = ENDPOINT+"categories/"+catId;
		
		var catInfo = {
				cat_name: catName,
				icon_num: iconNum,
				user_id: userId,
				icon_back: iconBack,
				total_money: totalMoney,
				id: catId
		};
		$.ajax( _url, {
			method: "PUT",
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(catInfo),
			dataType: "json"
		}).then(function(response) {
			console.log(response);
		});
	}
	
	function addElementToCat() {
		var product_name = $("#add-element-name").val();
		var user_id = ReadCookie();
		var cat_id = $(".show-category-name").attr("id");
		var product_price = $("#add-element-price").val();
		
		
		_url = ENDPOINT+"categories"+"?id="+cat_id;
		var createPromise = $.ajax({
			url: _url,
			method: "GET",
			dataType: "JSON"
		}).then(function(response){
			if (response == ""){
				alert("You sure you buy something like this?");
			} else {
				
				totalMoneySpent = parseInt(response[0].total_money);
				console.log(totalMoneySpent);
				product_price = parseInt(product_price);
				if (product_price) {
					increaseTotalMoney(product_price, response);
				}
			}
		});	
		
		data = {
			"product_name": product_name,
			"product_price": product_price,
			"user_id": user_id,
			"cat_id": cat_id
		}
		_url = ENDPOINT + "products";
		console.log(_url);
		var createPromise = $.ajax({
			url: _url,
			method: "POST",
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(data),
			dataType: "json"
		}).then(function(response){
			showCatProducts(cat_id);
		});
	}
	
	function showCatProducts(catId){
		var user_id = ReadCookie();

		_url = ENDPOINT+"products"+"?user_id="+user_id+"&cat_id="+catId;
		var createPromise = $.ajax({
			url: _url,
			method: "GET",
			dataType: "JSON"
		}).then(function(response){
			if (response == ""){
				$('.all-products').html("No categories to show");
			} else {
				productList = '';
				_.forEach(response, function(product) {
					productList += '<div class="form-group col-xs-12 floating-label-form-group controls">\
						<div class="element" id="'+product.id+'">\
							<div class="remove-element"><img src="img/portfolio/remove.png" class="img-responsive img-centered" alt=""></div>\
							<div class="element-name">'+ product.product_name +'</div>\
							<div class="element-price">'+ product.product_price +'$</div>\
						</div>\
					</div>';
				    
				});
				$('.all-products').html(productList);
			}
		});	
		
	}
	
	$(function(){
		if($('body').attr('class') == 'stats'){
//			countCategoryCost();
			//Better to construct options first and then pass it as a parameter
			var options = {
				title: {
					text: "'The act of giving is the soul of living.'  -Loreen Arbus"
				},
		                animationEnabled: true,
				data: [
				{
					type: "column", //change it to line, area, bar, pie, etc
					dataPoints: [
						{ y: 10, label: "Food" },
						{ y: 20, label: "School" },
						{ y: 30, label: "Magazine" },
						{ y: 40, label: "Coffe" },
						{ y: 50, label: "Drinks" },
						{ y: 60, label: "Furniture" },
						{ y: 70, label: "Chocolate" },
						{ y: 80, label: "Beer" }
					]
				}
				]
			};
				
			$("#chartContainer").CanvasJSChart(options);
		
	
			//Better to construct options first and then pass it as a parameter
			var totalSpentOptions = {
				title: {
					text: "How much money did you spent the past days?"
				},
		                animationEnabled: true,
				data: [
				{
					type: "spline", //change it to line, area, column, pie, etc
					dataPoints: [
						{ x: new Date(2016,4,18 ), y: 10 },
						{ x: new Date(2016,4,19 ), y: 12 },
						{ x: new Date(2016,4,20 ), y: 8 },
						{ x: new Date(2016,4,21 ), y: 14 },
						{ x: new Date(2016,4,22 ), y: 6 },
						{ x: new Date(2016,4,23 ), y: 24 },
						{ x: new Date(2016,4,24 ), y: -4 },
						{ x: new Date(2016,4,25 ), y: 10 }
					]
				}
				]
			};
	
			$("#totalSpent").CanvasJSChart(totalSpentOptions);
		}
	});

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
			window.location.href = 'index.html';
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
		
		$(".add-element-db").on("click", function(){
			addElementToCat();
		});
		
		
		for (i = 1; i <= 46; i++) {
			icon = '<div class="col-xs-1">\
		    	<img id="'+i+'" src="img/categories/icon-'+i+'.png" class="img-responsive img-centered icon" alt="" >\
		    </div>';	
			$( ".icons" ).append(icon);
		}
		for(i = 1; i <= 12; i++) {
			categoryColor = '<div class="col-xs-1 color" id="color'+i+'"></div>';
			$( ".colors" ).append(categoryColor);
		}
		
		$(".icon").on("click", function(){
			iconNum = $(this).attr( "id" );
			icon = '<div class="col-xs-3 show-icon">\
		    	<img id="'+iconNum+'" src="img/categories/icon-'+iconNum+'.png" class="img-responsive img-centered icon" alt="" >\
		    </div>';
			$(".chosen-icon").html(icon);
		});
		
		$(".color").on("click", function(){
			color = $(this).css("background-color");
			$(".show-icon").css('background-color', color);
		});
		
		$("#saveCat").on("click", function(){
			saveCategory();
			setTimeout(function(){ location.reload(); }, 1000);		
		});
		
		$(document).on("click",".category-link", function(){
			catId = $(this).find('.caption-content').attr("id");
			$(".show-category-name").attr("id", catId);
			
			_url = ENDPOINT+"categories"+"?id="+catId;

			var createPromise = $.ajax({
				url: _url,
				method: "GET",
				dataType: "JSON"
			}).then(function(response){
				if (response == ""){
					alert("Error!");
				} else {
					catName = response[0].cat_name;
					$(".show-category-name").html(catName);
				}
			});	
			showCatProducts(catId);
		});
		
		$(document).on("click",".remove-element", function(){
			productId = $(this).parent(".element").attr("id");
			catId = $('.show-category-name').attr("id");		
			
			_url = ENDPOINT+"products/"+productId;
			
			$.ajax({
				url: _url,
				method: "DELETE"
			}).then(function(response) {
				showCatProducts(catId);
			});
		});
		
		$(document).on("click", ".remove-cat", function(){
			catId = $('.show-category-name').attr("id");
			
			_url = ENDPOINT+"categories/"+catId;
			
			$.ajax({
				url: _url,
				method: "DELETE"
			}).then(function(response) {
				location.reload();
			});
		});
		
	}

	attachHandlers();

})