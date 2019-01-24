$(function() {
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
			this.displayOnMap();
			console.log(this);
		}

		displayOnMap() {
			let latLng = [this.lat, this.lng];
			let stationMarker = L.marker(latLng, {riseOnHover : true}).addTo(map);
			stationMarker.bindPopup("<h4>" + this.name + "</h4><p>" + this.address + "</p>");
		}
	}
	$.getJSON('https://api.jcdecaux.com/vls/v1/stations?contract=Nancy&apiKey=' + apiKey, function (stationsData) {
		for(let i = 0 ; i < stationsData.length ; i++) {
			let station = new Station(stationsData[i].status, stationsData[i].name, stationsData[i].address, stationsData[i].bike_stands, stationsData[i].available_bikes, stationsData[i].position.lat, stationsData[i].position.lng, stationsData[i].banking);
		}
	});
});
