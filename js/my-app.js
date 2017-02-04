// Initialize your app
var myApp = new Framework7({

	cache: false, /* disable caching */

	onAjaxStart: function (xhr) { 
		myApp.showIndicator();
	},
	onAjaxComplete: function (xhr) { 
		myApp.hideIndicator();
	}


});


var $$ = Dom7;

// Init main view
var mainView = myApp.addView('.view-main');


// Init slider and store its instance in mySwiper variable
var mySwiper = myApp.swiper('.swiper-container', {
	pagination:'.swiper-pagination'
});




// Nav bar Left panel script ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


$$('.open-left-panel').on('click', function (e) {
 	// 'left' position to open Left panel
	myApp.openPanel('left');
});

$$('.panel-close').on('click', function (e) {
	myApp.closePanel();
});


$$('.content-block p').on('click', function(){
    $$('p.active-nav').removeClass('active-nav');
    $$(this).addClass('active-nav');
});



// Function to store JSONP in local storage --------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function jsonCallback (data) {
	// local storage requires you to store strings of information. To store a JSON object in local storage you will need to convert it into a JSON-formatted string, using the JSON.stringify() function.
	var dataToStore = JSON.stringify(data);
	// storing the new JSON-formatted string in local storage
	localStorage.setItem('dealcheckerData', dataToStore);
}

// Call json function 
jsonCallback();


myApp.showIndicator() // show modal with Indicator



setTimeout(function() {
	$$('.preloader-indicator-modal').addClass('black');
	 myApp.hideIndicator();
    $$('.splash-screen-container').addClass('splash-finished');
}, 1800); // <-- time in milliseconds



setTimeout(function() {
	$('.nanobreaks-logo-container').fadeIn( "slow" );
}, 100); 



function userLoginCallback(data) { 

	if ( data == '123578') { 
		console.log('valid email');
		$$('#email-login').addClass('valid');
		$$('#email-fail').removeClass('invalidEmail');

		emailVal = $$('#email-login').val()
		$$('#user-email').html(emailVal);

	} 
	else { 
		$$('#email-fail').addClass('invalidEmail');
	}

}





/* login-page --------------------------------------------------------------------------------------------------------- */ 
myApp.onPageInit('login', function (page) {

// fade in login page 
setTimeout(function() {
	$('.centered-content').fadeIn( "slow" );
}, 100); 

	
// Account validation ---------------------------------------------------------

$$('input#email-login').on('blur',  function() { 

	var emailInput = $$('input#email-login').val();

	var my_script = document.createElement('script');
	my_script.setAttribute('src','https://www.dealchecker.co.uk/user/user-exists/' + emailInput + '-jsonp.html?callback=userLoginCallback');
	document.head.appendChild(my_script);

	userLoginCallback();

}); 


$('#login-button').on('click', function() { 
	if ( $('#email-login').hasClass('valid') && $('#password-login') != "") { 
		$$("#login-button").attr("href", "home.html");
	}
});




});











/* home-page --------------------------------------------------------------------------------------------------------- */ 
myApp.onPageInit('home', function (page) {

	$$(".content-block p").removeClass("active");
	$$('.content-block p').eq(0).addClass('active-nav');

});















/* Search-page --------------------------------------------------------------------------------------------------------- */ 
myApp.onPageInit('search', function (page) {


// Make search page left panel navigation have active highlight in panel menu - remove it from home 
$$(".content-block p").removeClass("active");
$$('.content-block p').eq(1).addClass('active-nav');


// Init slider and store its instance in mySwiper variable , slider is the search info popup shown on page load
var mySwiper = myApp.swiper('.swiper-container', {
	pagination:'.swiper-pagination'
});


$$('.bottom-skip-bar').on('click', function(){ 
	$$(this).parent().parent().hide();
});



// local data variable now containes all of dealchecker data pulled from API using JSONP
//  Reverse the effects of the stringify function to allow access to the data within the object
var localData = JSON.parse(localStorage.getItem('dealcheckerData'));

   

// Autocomplete drop downs for departing destination -------------------------------------------------------------------------------------------------

var autocompleteDropdownAjax = myApp.autocomplete({

  input: '#autocomplete-departing-dropdown-ajax',
  openIn: 'dropdown',
  preloader: true, //enable preloader
  valueProperty: 'value', //object's "value" property name
  textProperty: 'text', //object's "text" property name
  limit: 300, //limit to 300 results
  dropdownPlaceholderText: 'Search avaliable departure airports...',
  expandInput: true, // expand input
  source: function(autocomplete, query, render) {
    var results = [];
    var returned = [];
    if (query.length === 0) {
      render(results);
      return;
    }


    // Show Preloader
    autocomplete.showPreloader();

    // Create empty array that will hold all departure airports and departure airport codes 
	var departureWithAirportCode = [];

	// loop through local data and add all depature airport and departure airport codes to empty array 
	for ( var i = 0 ; i < localData.length; i ++ ) { 
		departureWithAirportCode.push(localData[i].departure + " " + localData[i].depAir );
	}

	// Create empty array to hold only unique depature airport and departure airport code values 
	var uniqueDepartureAirportNames = [];

	for(var i in departureWithAirportCode){
	    if(uniqueDepartureAirportNames.indexOf(departureWithAirportCode[i]) === -1){
	        uniqueDepartureAirportNames.push(departureWithAirportCode[i]);
	    }
	}
 

    // loop through unique depature airport and departure airport code values and push to results array (show in input dropdown) if users inputed text matches array values 
    for (var i = 0; i < uniqueDepartureAirportNames.length; i++) {
       
       	if (uniqueDepartureAirportNames[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(uniqueDepartureAirportNames[i]);
    
    }

    // Hide Preoloader
    autocomplete.hidePreloader();
   
    // Render items by passing array with result items
    render(results);


  }

});




// Autocomplete drop down for destination --------------------------------------------------------------------------------------------------------------------------------------------------------

var autocompleteDropdownAjax = myApp.autocomplete ({
  input: '#autocomplete-destination-dropdown-ajax',
  openIn: 'dropdown',
  preloader: true, //enable preloader
  valueProperty: 'value', //object's "value" property name
  textProperty: 'text', //object's "text" property name
  limit: 300, //limit to 20 results
  dropdownPlaceholderText: 'Search avaliable destinations...',
  expandInput: true, // expand input

  source: function(autocomplete, query, render) {
    var results = [];
    var returned = [];
    if (query.length === 0) {
      render(results);
      return;
    }

    // Show Preloader
    autocomplete.showPreloader();


    // Create empty array that will hold all destination airports and destination airport codes 
    var destinationOnly = [];

    // loop through local data and add all depature airport and departure airport codes to empty array 
    for ( var i = 0 ; i < localData.length; i ++ ) { 
    	destinationOnly.push(localData[i].destination);
    }



    // Create empty array to hold only unique depature airport and departure airport code values 
    var uniqueDestinationNames = [];


	for(var i in destinationOnly){
        if( uniqueDestinationNames.indexOf(destinationOnly[i]) === -1){
            uniqueDestinationNames.push(destinationOnly[i]);
        }
    }



    // loop through unique destination values and push to results array (show in input dropdown) if users inputed text matches array values 
    for (var i = 0; i <  uniqueDestinationNames.length; i++) {
       
       	if ( uniqueDestinationNames[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push( uniqueDestinationNames[i]);
    
    }


    // Hide Preoloader
    autocomplete.hidePreloader();
   
    // Render items by passing array with result items
    render(results);

	
  }
});



// Show hide drop down on click , remove place holder text ------------------------------------------------------------------------------------------

$$('input,textarea').focus(function(){
	$$(this).parent().addClass('active');
    $$(this).data('placeholder',$$(this).attr('placeholder'))
          .attr('placeholder','');
	}).blur(function(){
	   $$(this).attr('placeholder',$$(this).data('placeholder'));
});




// Add dropdown values to input on click ---------------------------------------------------------------------------------------------------------

$$('li').on('click', function() { 
	var value = $$(this).text();
	var input = $$(this).parent().prev().prev();
    input.val(value);
    $$(this).parents().eq(1).removeClass('active');	
    return false;
});

			

// Script for calender --------------------------------------------------------------------------------------------------------------------------

var today = new Date();
var calendarDefault = myApp.calendar({
    input: '#calendar-default',
    dateFormat: 'dd/mm/yyyy',
    closeOnSelect: true,
    events: {
  		from: today
	},
	rangesClasses: [
    //Add "day-october' class for all october dates
    {
        // string CSS class name for this range in "cssClass" property
        cssClass: 'day-october', //string CSS class          
    },
],
});       






// Remove user departure search input if invalid 
function invalidDeparture() { 
	
	for (i=0; i < localData.length; i++ ) { 
	 
	 	if( $$('#autocomplete-departing-dropdown-ajax').val() != localData[i].departure + " " + localData[i].depAir ) { 
	 		$$('#autocomplete-departing-dropdown-ajax').val("");	
	 	}

	}

}


// Remove user destination search input if invalid 
function invalidDestination () { 

	for (i=0; i < localData.length; i++ ) { 
	 
	 	if( $$('autocomplete-destination-dropdown-ajax').val() != localData[i].destination ) { 
	 		$$('#autocomplete-destination-dropdown-ajax').val("");	
	 	}

	}

}

$$('input#autocomplete-departing-dropdown-ajax').on('blur', invalidDeparture);
$$('input#autocomplete-destination-dropdown-ajax').on('blur', invalidDestination);


$$('.compare-button').on('click', function () { 
	
	var departingVal = $$('#autocomplete-departing-dropdown-ajax').val();
	var destinationVal = $$('#autocomplete-destination-dropdown-ajax').val();
	var dateVal = $$('#calendar-default').val();

	// If no values are inputted 
	if ( departingVal  == "" &&  destinationVal == "" && dateVal == "" ) { 
		$$(".compare-button").removeAttr('href');
	} 

	// If one of the search requirments are meet add href 
	if ( departingVal != "" || destinationVal != "" || dateVal != "" ) { 
		$$(".compare-button").attr("href", "deal-landing.html");
	}


});



// Script for form submit  ----------------------------------------------------------------------------------------------------------------------


var pageContainer = $$('.page');

pageContainer.find('.save-storage-data').on('click', function (e) {
	
	e.preventDefault();

	var departure = $$(page.container).find("#autocomplete-departing-dropdown-ajax" ).val();
	var destination = $$(page.container).find("#autocomplete-destination-dropdown-ajax").val();
	var date = $$(page.container).find("#calendar-default").val();
	var deals = $$(page.container).find("#best-deals").val();
	var adults = $$(page.container).find("#adults").val();
	var children = $$(page.container).find("#children").val();
	var infants = $$(page.container).find("#infants-input").val();


//	If you want to save more values just get more from the form
	
	var content = {'dep':departure,'dest':destination, 'date': date , 'deal': deals, 'adults': adults, 'children': children, 'infants': infants };//add more values if needed...
	localStorage.setItem("storedData",JSON.stringify(content));
   
});




// End of search page --------------------------------------------------------------------------------------------------------------------------------------------------------
});




// Deal landing page -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


myApp.onPageInit('deal-landing', function (page) {


$$(".content-block p").removeClass("active");



var pageContainer = $$('.page');
var readcontent  = JSON.parse(localStorage.getItem("storedData"));
var departure = readcontent["dep"]; 
var destination = readcontent["dest"];
var date = readcontent["date"];
var deals = readcontent["deal"]; 
var adults = readcontent["adults"];
var children = readcontent["children"];
var infants = readcontent["infants"];




// Append form values to deal landing top nav bar 
$$('.destination').html(destination);
$$('.date').html(date);
$$('.adults').html(adults);
$$('.children').html(children);
$$('.infants').html(infants);


if ($$('.destination').text() == '' ) { 
	$$('.destination').html('Any Destination');
}

if ($$('.date').text() == '' ) { 
	$$('.date').html('Any Date');
}


if ($$('.adults').text() == '' ) { 
	$$('.adults').html('0');
}


if ($$('.children').text() == '' ) { 
	$$('.children').html('0');
}


if ($$('.infants').text() == '' ) { 
	$$('.infants').html('0');
}


if ($$('.infants').text() == '' ) { 
	$$('.infants').html('0');
}


// local data variable now containes all of dealchecker data pulled from API using JSONP
//  Reverse the effects of the stringify function to allow access to the data within the object
var localData = JSON.parse(localStorage.getItem('dealcheckerData'));


// Code to create unique departure and departure airport codes -----------------------------------------------------------------------------------------------------------------------------------------------------------------

// Create empty array that will hold all departure airports and departure airport codes 
var departureWithAirportCode = [];

// loop through local data and add all depature airport and departure airport codes to empty array 
for ( var i = 0 ; i < localData.length; i ++ ) { 
	departureWithAirportCode.push(localData[i].departure + " " + localData[i].depAir );
}

// Create empty array to hold only unique departure airport and departure airport code values 
var uniqueDepartureNames = [];


for(var i in departureWithAirportCode){
    if(uniqueDepartureNames.indexOf(departureWithAirportCode[i]) === -1){
        uniqueDepartureNames.push(departureWithAirportCode[i]);
    }
}



// Code to create unique destination values  ------------------------------------------------------------------------------------------------------------------

// Create empty array that will hold all destination airports 
var destinationOnly = [];

// loop through local data and add all destination airport to empty array 
for ( var i = 0 ; i < localData.length; i ++ ) { 
	destinationOnly.push(localData[i].destination);
}


// Create empty array to hold only unique destination values
var uniqueDestinationNames = [];

for(var i in destinationOnly)  {

    if( uniqueDestinationNames.indexOf(destinationOnly[i]) === -1){
        uniqueDestinationNames.push(destinationOnly[i]);
    }

}






function appendInputedDataToDeal() { 
	
		$$('#deals-container').append(


		    '<div class="deal-wrappr">' + 
		      '<div class="deal-info-container">' +  
		         
		         '<div class="result-price-container">' + 
		            '<span class="result-price">' + "fr" + " " + 
		              '<span class="pnd">' + "£" + '</span>' + 
		              '<span class="price-inner">'  + localData[i].price + '</span>' + " " 
		               + 'pp' + 
		            '</span>' + 
		          '</div>' + 

		          '<div class="deal-logo">' + 
		            '<img src="https://static2.dealchecker.co.uk/10.7-6' + localData[i].clientImage + '" alt="' + '" />' + 
		          '</div>' + 

		          '<div class="inner-deal-summary-container">' + 
		            '<span class="accomodation">' +  localData[i].accommodation + '</span>'  + 
		            '<span class="destination">' +  localData[i].destination  + '</span>' + 
		            '<span class="star-rating-container">' +  
		              '<span class="star-rating">' + localData[i].rating  +  '</span>' + 
	            '</span>' +
	          '</div>' +

	      '</div>' + 

	      '<div class="result-bottom">' + 
	        '<div class="result-flight">' + 
	          
	          '<div class="result-outbound">' +
	            '<span class="result-dep-airport">' +  localData[i].depAir   + '</span>' +
	            '<div class="result-dep-dates-container">' + 
	              '<span class="dep-date">' +  localData[i].departureDate  + '</span>' +
	              '<span class="dep-time">' +  localData[i].departureTime + '</span>' +
	            '</div>' +
	          '</div>' +
	          
	          '<div class="result-return">' + 
	            '<span class="result-return-airport">' + localData[i].destAir + '</span>' + 
	            '<div class="result-return-dates-container">' + 
	              '<span class="return-date">' + localData[i].returnDate + '</span>' + 
	              '<span class="return-time">' +  localData[i].returnTime  + '</span>' +
	            '</div>' +
	          '</div>' +

	        '</div>' + 

	        '<div class="result-price-and-button-container">' + 
	         '<span class="result-price">' +  "fr" + " " +
	            '<span class="pnd">' + "£"  + '</span>' + 
	            '<span class="price-inner">' + localData[i].price + '</span>' + " " + 
	              "pp" +  
	          '</span>' + 
	          '<a href="">' + 
	            '<span class="view-deal-button">' + "View deal" +  '</span>' + 
	          '</a>' + 
	        '</div>' + 
	      
	      '</div>' +

	    '</div>'

	);


		
}


//  For loop containing conditions to display deals depending on user input   ------------------------------------------------------------------------------------------------------------------------------------------------------------------

// loop through each object in returned data array 
for( var i=0;  i < localData.length;  i++)  {
	
	// Departure and destination and date search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    

	if ( ( localData[i].departure + " " + localData[i].depAir == departure ) && ( localData[i].destination == destination ) && ( localData[i].departureDate == date ) ) {  
		console.log("departure and destination and date, full housee ");
		appendInputedDataToDeal();     
	}

	// Departure and destination only search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    

	else if ( (  localData[i].departure + " " + localData[i].depAir == departure ) && (  localData[i].destination == destination ) && (date == "") ) {
    	console.log("departure and destination no date");
 		appendInputedDataToDeal();
	}

	// Date and departure airport search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    
	
	else if ( (localData[i].departureDate == date) && ( localData[i].departure + " " + localData[i].depAir == departure ) && (destination == "") ) { 
		console.log("date and departure, destination empty");
 		appendInputedDataToDeal();
	}

	// Departure only search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    
	
	else if( (  localData[i].departure + " " + localData[i].depAir == departure  ) && (date == "") && (destination == "") ){ 	
		console.log('departure only other fields are empty');
     	appendInputedDataToDeal();

    }

	// Destination only search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    

	else if( (localData[i].destination == destination ) && (date == "") && (departure == "") ) { 
		console.log('destination only, other fields are empty');
		appendInputedDataToDeal();
	}
// End of if else statement 

	 $('.deal-wrappr').fadeIn( "slow" );

// code to manipulate deals ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

 	// add star rating class depending on deals rating 
    $$('.star-rating').each(function(i,e) {
        var rating = $$(this).text();
        if( rating == 1 ) {
           $$(elem).addClass('rating-1').html('');
        } else if (rating == 2) {
           $$(e).addClass('rating-2').html('');
        } else if(rating == 3) {
            $$(e).addClass('rating-3').html('');
        } else if( rating == 4) {
           $$(e).addClass('rating-4').html('');
        } else if( rating == 5) {
            $$(e).addClass('rating-5').html('');
        }
    });

    // add dynamic price to the cheapest deal in the preloader 
    $$('.pnd-preloader').html('£' + localData[0].price );

    // Add deal count to preloder 
    $$('.holiday-count').html(localData.length);

      
    // Add deal count to preloder 
    $$('.searchCompletedCount').html(localData.length);

    $$('.dynamicloadmessage').removeClass('deal-landing-only');

      // Fade preloader our after 
	setTimeout(function() {
	    $$('.dynamicloadmessage').hide();
	    $$('.loading').hide();
	    $$('.section-title.deal-landing-search').addClass('show');
	    $$('.section-title').addClass('finished-loading');
	    
	}, 10000); // <-- time in milliseconds



	if (destination === "") { 
		 $$("#search-destination").html("");
	}
	else {  
	 	$$("#search-destination").html("in" + " " + destination);
	}

	var DealCounter = $$('.deal-wrappr').length;

	$$("#deal-count").html(DealCounter);
}
// Closing bracket for for loop 




// closing brackets for deal landing scripts -------------------------------------------------------------------------------------------------------------------------------------------------------
});
















// Best deals page --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

myApp.onPageInit('best-deals', function (page) {


	// local data variable now containes all of dealchecker data pulled from API using JSONP
	//  Reverse the effects of the stringify function to allow access to the data within the object
	var localData = JSON.parse(localStorage.getItem('dealcheckerData'));


	// Make best deals page have active highlight in panel menu - remove it from home 
	$$(".content-block p").removeClass("active");
	$$('.content-block p').eq(2).addClass('active-nav');

		
	// Sort by Price - return best deals 
    localData.sort(function(a, b) {
	    var a1= a.price, b1= b.price;
	    if(a1== b1) return 0;
	    return a1> b1? 1: -1;
	   
	});



	// loop through each object in returned data array 
    for( var i=0;  i < localData.length;  i++) {
  	
    		
       	$('#deals-container').append(

		    '<div class="deal-wrappr">' + 
		      '<div class="deal-info-container">' +  
		         
		         '<div class="result-price-container">' + 
		            '<span class="result-price">' + "fr" + " " + 
		              '<span class="pnd">' + "£" + '</span>' + 
		              '<span class="price-inner">'  + localData[i].price + '</span>' + " " 
		               + 'pp' + 
		            '</span>' + 
		          '</div>' + 

		          '<div class="deal-logo">' + 
		            '<img src="https://static2.dealchecker.co.uk/10.7-6' + localData[i].clientImage + '" alt="' + '" />' + 
		          '</div>' + 

		          '<div class="inner-deal-summary-container">' + 
		            '<span class="accomodation">' +  localData[i].accommodation + '</span>'  + 
		            '<span class="destination">' +  localData[i].destination  + '</span>' + 
		            '<span class="star-rating-container">' +  
		              '<span class="star-rating">' + localData[i].rating  +  '</span>' + 
		            '</span>' +
		          '</div>' +

		      '</div>' + 

		      '<div class="result-bottom">' + 
		        '<div class="result-flight">' + 
		          
		          '<div class="result-outbound">' +
		            '<span class="result-dep-airport">' +  localData[i].depAir   + '</span>' +
		            '<div class="result-dep-dates-container">' + 
		              '<span class="dep-date">' +  localData[i].departureDate  + '</span>' +
		              '<span class="dep-time">' +  localData[i].departureTime + '</span>' +
		            '</div>' +
		          '</div>' +
		          
		          '<div class="result-return">' + 
		            '<span class="result-return-airport">' + localData[i].destAir + '</span>' + 
		            '<div class="result-return-dates-container">' + 
		              '<span class="return-date">' + localData[i].returnDate + '</span>' + 
		              '<span class="return-time">' +  localData[i].returnTime  + '</span>' +
		            '</div>' +
		          '</div>' +

		        '</div>' + 

		        '<div class="result-price-and-button-container">' + 
		         '<span class="result-price">' +  "fr" + " " +
		            '<span class="pnd">' + "£"  + '</span>' + 
		            '<span class="price-inner">' + localData[i].price + '</span>' + " " + 
		              "pp" +  
		          '</span>' + 
		          '<a href="">' + 
		            '<span class="view-deal-button">' + "View deal" +  '</span>' + 
		          '</a>' + 
		        '</div>' + 
		      
		      '</div>' +

		    '</div>'

			);



    }	

    $('.best-result-label').fadeIn( "slow" );
   	$('.deal-wrappr').fadeIn( "slow" );




   // add star rating class depending on deals rating 
    $$('.star-rating').each(function(i,e) {
        var rating = $$(this).text();
        if( rating == 1 ) {
           $$(elem).addClass('rating-1').html('');
        } else if (rating == 2) {
           $$(e).addClass('rating-2').html('');
        } else if(rating == 3) {
            $$(e).addClass('rating-3').html('');
        } else if( rating == 4) {
           $$(e).addClass('rating-4').html('');
        } else if( rating == 5) {
            $$(e).addClass('rating-5').html('');
        }
    });



    // add dynamic price to the cheapest deal in the preloader 
    $$('.pnd-preloader').html('£' + localData[0].price );

    // Add deal count to preloder 
    $$('.holiday-count').html(localData.length);

   	$$('.inner-text-deal').html(localData.length + ' '+ 'found so far');

    // add class to remove margin from top deal 
    $$('.deal-wrappr').eq(0).addClass('best');
   
 
    // Add client name to best deal header 
   	$$('.best-price-supplier').html(localData[0].clientName);
      
    // Add deal count to preloder 
    $$('.searchCompletedCount').html(localData.length);

		   
	
    // Fade preloader our after 
	setTimeout(function() {
	    $$('.dynamicloadmessage').hide();
	    $$('.loading').hide();
	    $$('.section-title.deal-landing-search').addClass('show');
	    $$('.section-title').addClass('finished-loading');
	    
	}, 10000); // <-- time in milliseconds



// Init slider and store its instance in mySwiper variable , slider is the search info popup shown on page load
var mySwiper = myApp.swiper('.swiper-container', {
	pagination:'.swiper-pagination'
});


$$('.bottom-skip-bar').on('click', function(){ 
	$$(this).parent().parent().hide();
});






// End of Best deals page -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
});






// Start of about page -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

myApp.onPageInit('about', function (page) {

	$$(".content-block p").removeClass("active");

});




// Start of discover page -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

myApp.onPageInit('discover', function (page) {

	$$(".content-block p").removeClass("active");
	$$('.content-block p').eq(3).addClass('active-nav');


	$.ajax({
	  type: 'GET',
	  url:'https://maps.googleapis.com/maps/api/place/textsearch/json?query=new+york+city+point+of+interest&language=en&key=AIzaSyCtWtsBKcbfPil7FhIoZsvSqba5A2KMB6A',
	  dataType: 'json',
	  data: {
	  	
	   },

	    success: function(hotel){
	    console.log(hotel);
	 }
	});


});

