$(function() {
	//Classes and objects used in the program--------------------------
	
	//generates and displays station based on API data
	class Station {
		constructor(status, name, address, stands, available, lat, lng, banking) {
			this.status = status;
			this.name = name;
			this.address = address;
			this.stands = stands;
			this.availableBikes = available;
			this.lat = lat;
			this.lng = lng;
			this.banking = banking;

			this.displayOnMap(status, name, address, stands, available, lat, lng, banking);
		}

		displayOnMap(status, name, address, stands, available, lat, lng, banking) {
			let latLng = [lat, lng];
			let stationMarker = L.marker(latLng, {riseOnHover : true}).addTo(map);//adds marker to map

			stationMarker.bindPopup("<h4>" + name + "</h4><p>" + address + "</p>");
			stationMarker.on("click", function() {
				map.flyTo(latLng, 16); //Zoom on station
				form.displayStationInfo(status, name, address, stands, available, banking);//updates form
			});
		}
	}

	let dataManager = {
		getStationsData() {
			$.getJSON('https://api.jcdecaux.com/vls/v1/stations?contract=Nancy&apiKey=' + apiKey, function (stationsData) {
				stationsData.forEach(stationData => {
					let station = new Station(stationData.status, stationData.name, stationData.address, stationData.bike_stands, stationData.available_bikes, stationData.position.lat, stationData.position.lng, stationData.banking);

					console.log(station.name + " : " + station.availableBikes);
				});
			});
		},

		refreshStationsData() {
			$('.leaflet-marker-icon, .leaflet-marker-shadow').remove();
			dataManager.getStationsData();
		}
	};

	//events on form
	let form = {
		
		displayInfo() {
			$('form > *').hide();
			$('#stationInfo').css('display', 'flex');
		},
		
		displaySignature(firstName, surname) {
			$('form > *').hide();
			$('#signature').css('display', 'flex');

			$('#customerInfo').html($('#firstName').val() + ' ' + $('#surname').val());
		},

		displayStationInfo(status, name, address, stands, availableBikes, banking) {
			form.displayInfo();

			$('#stationName').html(name);
			$('#stationAddress').html(address);

			if(status === "CLOSED") {
				$('#closed').show();
				$('#open').hide();
			} else {
				$('#open').show();
				$('#closed').hide();

				$('#nbStands').html(stands);
				$('#nbBikes').html(availableBikes);

				//change color depending on available bikes
				if (availableBikes <= (stands/4)) {
					$('#nbBikes').css('color', 'red');
			  	} else if (availableBikes <= (stands/2)) {
					$('#nbBikes').css('color', 'orange');
				} else {
					$('#nbBikes').css('color', 'green');
				}

				if(banking) {
					$('#banking').show();
				} else {
					$('#banking').hide();
				}

				if(availableBikes > 0) {
					$('#identity').show();
					$('#noBike').hide();
				} else {
					$('#noBike').show();
					$('#identity').hide();
				}
			}
		},

	};

	//form element events
	class FormEvent {
		constructor(DOMelement, inputType, action) {
			this.element = DOMelement;
			this.inputType = inputType;
			this.action = action;

			this.setEvent();
		}

		setEvent() {
			this.element.on(this.inputType, this.action);
		}
	}

	let canvas = {

		element: document.getElementById('canvas'),

		createCanvas() {
			canvas.context = canvas.element.getContext('2d');
			canvas.rect =  canvas.element.getBoundingClientRect();
		},

		setCanvasDimensions() {
			canvas.element.width = canvas.element.clientWidth;
			canvas.element.height = canvas.element.clientHeight;
		},

		getPointerCoordinates(event) {
			return {
				x: event.clientX - canvas.rect.left,
				y: event.clientY - canvas.rect.top
			};
		},

		draw(event) {
			let position = canvas.getPointerCoordinates(event);

			canvas.context.fillStyle = "black";
			canvas.context.fillRect(position.x, position.y, 5, 5);
		},

		clear() {
			canvas.context.fillStyle = "white";
			canvas.context.fillRect(0, 0, 2000, 2000);
		}
	};

	let storage = {
		storeData() {
			localStorage.setItem('firstName', $('#firstName').val());
			localStorage.setItem('surname', $('#surname').val());

			sessionStorage.setItem('station', $('#stationName').text());
			sessionStorage.setItem('timeLeft', timer.start);
		},

		formAutoFill() {
			$('#firstName').val(localStorage.getItem('firstName'));
			$('#surname').val(localStorage.getItem('surname'));
			$('#book').removeAttr('disabled');
		},

		displayCountdown() {
			$('#bookedBike').show();

			timer.timeLeft = sessionStorage.getItem('timeLeft');
		}
	};

	let timer = {
		start: 1200,
		timeLeft: 0,

		startCountdown() {
			$('#bookedBike').show();
			$('#bookingInfo > span:eq(0)').text(localStorage.getItem('firstName') + ' ' + localStorage.getItem('surname'));
			$('#bookingInfo > span:eq(1)').text(sessionStorage.getItem('station'));
			timer.timeLeft = sessionStorage.getItem('timeLeft');
			countdown = setInterval(timer.displayRemainingTime, 1000);
		},

		stopCountdown() {
			clearInterval(countdown);
			$('#countdown').html('Réservation expirée');
			sessionStorage.removeItem('station');
			sessionStorage.removeItem('timeLeft');
		},

		displayTime() {
			let minutes = Math.floor(timer.timeLeft/60);
			let seconds = timer.timeLeft%60;

			if(minutes < 10) {
				minutes = '0' + minutes;
			}

			if(seconds < 10) {
				seconds = '0' + seconds;
			}

			$('#countdown > span').html(minutes + ':' + seconds);
		},

		progressionBar() {

			let percent = (timer.timeLeft/timer.start)*100;
			$('#remainingTime').css('width', percent + '%');

			if(timer.timeLeft <= timer.start/4) {
				$('#totalTime').css('borderColor', 'red');
				$('#remainingTime').css('backgroundColor', 'red');
			} else if (timer.timeLeft <= timer.start/2) {
				$('#totalTime').css('borderColor', 'orange');
				$('#remainingTime').css('backgroundColor', 'orange');
			} else {
				$('#totalTime').css('borderColor', 'green');
				$('#remainingTime').css('backgroundColor', 'green');
			}
		},

		displayRemainingTime() {
			if(timer.timeLeft >= 0) {
				timer.displayTime();
				timer.progressionBar();

				timer.timeLeft --;
				sessionStorage.setItem('timeLeft', timer.timeLeft);
			} else {
				timer.stopCountdown();
			}
		}
	};

	//-------------------------------------------------------------
	let apiKey = 'd06ae2c4943a8203f4691ecaa5ce85ab8337fc8f'; //JCDecaux API Key

	let countdown;

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

	//gets stations info and displays them on map
	dataManager.getStationsData();

	if(localStorage.getItem('firstName')) {
		storage.formAutoFill();
	}

	if(sessionStorage.getItem('station')) {
		timer.startCountdown();
	}

	let identityInputs = new FormEvent($('#surname, #firstName'), "blur", function() {
		if ($('#firstName').val() && $('#surname').val()) {
			$('#book').removeAttr('disabled');
		} else {
			$('#book').attr('disabled', 'disabled');
		}
	});
	let bookButton = new FormEvent($('#book'), "click", function(event) {
		event.preventDefault();
		form.displaySignature($('#firstName').val(), $('#surname').val());
		canvas.createCanvas();
		canvas.setCanvasDimensions();
	});
	let canvasColoring = new FormEvent($('#canvas'), "mousemove", function(event) {
		canvas.draw(event);
		$('#confirm').removeAttr('disabled');
	});
	let clearButton = new FormEvent($('#clearCanvas'), "click", function(event) {
		event.preventDefault();
		canvas.clear();
		$('#confirm').attr('disabled', 'disabled');
	});
	let cancelButton = new FormEvent($('#cancel'), "click", function(event) {
		event.preventDefault();
		form.displayInfo();
	});
	let confirmButton = new FormEvent($('#confirm'), "click", storage.storeData);
	
	let refresher = setInterval(function() {
		let now = new Date();
		sec = now.getSeconds();
		
		if(sec === 0) {
			clearInterval(refresher);
			dataManager.refreshStationsData();
			setInterval(dataManager.refreshStationsData, 60000);
		}
	}, 1000);
});
