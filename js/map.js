$(function (){

  //Functions---------------------------------------

  //------------------------------------------------------

  let expireTime = 1200; //20 minutes equals 1200 seconds
  let countdown; //Prevents a glitch

  function getSetStorageValue () {

    let remainingTime = sessionStorage.getItem('timeLeft'); //Gets saved time left
    
    if (remainingTime >= 0) {
		displayRemainingTime(remainingTime, expireTime, $('#countdown > span'), $('#totalTime'), $('#remainingTime')); //Displays time
		remainingTime --;
		sessionStorage.setItem('timeLeft', remainingTime); //Sets new value after decrease
	} else {
		clearInterval(countdown);
		$('#countdown').html('Réservation expirée');
		sessionStorage.removeItem('station');
		sessionStorage.removeItem('timeLeft');
	}
  }

  //If sessionStorage data exists, add text after the form
  if (sessionStorage.getItem('station')) {

  	$('#bookedBike').show();
	$('#bookingInfo > span:eq(0)').html(localStorage.getItem('firstName') + ' ' + localStorage.getItem('surname')); //Displays first name and surname
	$('#bookingInfo > span:eq(1)').html(sessionStorage.getItem('station')); //Displays station name

	countdown = setInterval(getSetStorageValue, 1000);
  }

  //If stored data, then fill in the form
  if (localStorage.getItem('firstName')) {
	$('#firstName').val(localStorage.getItem('firstName'));
	$('#surname').val(localStorage.getItem('surname'));
	$('#book').removeAttr('disabled');
  }

  let apiKey = 'd06ae2c4943a8203f4691ecaa5ce85ab8337fc8f'; //JCDecaux API Key

  //Creates map
  //Set view and zoom on Nancy on load
  let map = L.map('map');
  map.setView([48.692054, 6.184417], 13);

  //Get tile layer
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	id: 'mapbox.streets',
	accessToken: 'pk.eyJ1IjoiZGhpYSIsImEiOiJjanB0b21uYnowN24yNDhwOGpzNmFnamdnIn0.zm0G5rHvWAULZUSAna3lDg'
  }).addTo(map);

  //Get data from JCDecaux API and updates form--------------------------------------------------------------------------------
  $.getJSON('https://api.jcdecaux.com/vls/v1/stations?contract=Nancy&apiKey=' + apiKey, function(stationsData) {
	for (let i = 0; i < stationsData.length; i++) {

	  let latlng = [stationsData[i].position.lat, stationsData[i].position.lng]; //latlng gets station coordinates
	  let station = L.marker(latlng, {riseOnHover : true}).addTo(map); //Adds marker on station position
	  //Adds popup on click on marker
	  station.bindPopup("<h4>" + stationsData[i].name + "</h4>" //Station name
		+ "<p>" + stationsData[i].address + "</p>"); //Station address

	  station.on('click', function(){

		map.flyTo(latlng, 17); //Zooms on the station

		$('#booking > form').css('height', $('.map').css('height'));
		$('#booking > form > *, #noBike, #closed, #open').hide(); //Hides all form contents

		let stationName = stationsData[i].name; //Name of the station
		let address = stationsData[i].address; //Address of the station
		let bikeStands = stationsData[i].bike_stands; //Number of bike stands
		let availableBikes = stationsData[i].available_bikes; //Number of available bikes
		let stationStatus = stationsData[i].status; //Gets "OPEN" or "CLOSED" (almost a boolean)
		let banking = stationsData[i].banking; //Boolean

		$('#stationInfo').css('display', 'flex'); //Displays station info
 		$('#stationName').html(stationName); //Adds station name
		$('#stationAddress').html(address); //Adds station address

		if (stationStatus === "CLOSED") { //If station is closed
		  $('#closed').show(); //Display closed station message
		} else { //If station is open

			$('#open').show();

			$('#nbStands').html(bikeStands); //Adds number of bike stands
			$('#nbBikes').html(availableBikes); //Adds number of available bikes

			if (availableBikes <= (bikeStands/4)) {
				$('#nbBikes').css('color', 'red');
		  	} else if (availableBikes <= (bikeStands/2)) {
				$('#nbBikes').css('color', 'orange');
			} else {
				$('#nbBikes').css('color', 'green');
			}

			if (availableBikes > 0) {

			  $('#identity').css('display', 'flex'); //Displays form
			  $('#surname').focus(); //Focus on first input
			
			} else { //If no bikes are available
		  		$('#noBike').show();
			}
		}
	  });
	}
  });
  //---------------------------------------------------------------------------------------------

  //Checking if inputs are filled to activate booking button
  $('#identity input').on('blur', function(){
	if ($('#firstName').val() && $('#surname').val()) {
	  $('#book').removeAttr('disabled');
	} else {
	  $('#book').attr('disabled', 'disabled');
	}
  });

  //Canvas element
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  $('#book').on('click', function(event) { //Changes <form> on click

	event.preventDefault();

	$('#stationInfo, #identity').hide();
	$('#signature').css('display', 'flex');

	$('#signature span').html($('#firstName').val() + ' ' + $('#surname').val());

	//Defines canvas dimensions
	canvas.width = canvas.clientWidth;
  	canvas.height = canvas.clientHeight;
  });

  function draw(event){

	let position = getCoordinates(canvas, event);

	context.fillStyle = "black";
	context.fillRect(position.x, position.y, 5, 5);
	
  }

  canvas.addEventListener('mousemove', function(event){
	draw(event);
  });

  canvas.addEventListener('mouseover', function(){
	$('#confirm').removeAttr('disabled');
  });

  $('#clearCanvas').on('click', function(e){ //Clears canvas area
	e.preventDefault();

	context.fillStyle = "white";
	context.fillRect(0, 0, 200, 200);

	$('#confirm').attr('disabled', 'disabled');
  });

  $('#confirm').on('click', function(){ //Confirm button events: 
	
	let firstName = $('#firstName').val();
	let surname = $('#surname').val();
	let station = $('#stationName').text();

	//Saves indentity and station data
	localStorage.setItem('firstName', firstName);
	localStorage.setItem('surname', surname);

	sessionStorage.setItem('station', station); //Saves station name
	sessionStorage.setItem('timeLeft', expireTime); //Resets countdown

  });

  $('#cancel').on('click', function(e){ 

	e.preventDefault();
	$('#signature').hide();
	$('#stationInfo, #identity').css('display', 'flex');

  });
});