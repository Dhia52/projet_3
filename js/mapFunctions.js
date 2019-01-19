//Countdown--------------------------------------------------------------------------

function displayRemainingTime(time, maxTime, element1, element2, element3) {
	displayTime(time, element1);
	progressionBar(time, maxTime, element3);
	progressionBarColor(time, maxTime, element2, element3);
}

function displayTime(number, element) {

	let minutes = Math.floor(number/60);
	let seconds = number%60;

	if(minutes < 10) {
		minutes = '0' + minutes;
	}

	if(seconds < 10) {
		seconds = '0' + seconds;
	}

	element.html(minutes + ":" + seconds);
}

function progressionBar(time, maxTime, element) {

	let percent = (time/maxTime)*100;
	element.css('width', percent + '%');

}

function progressionBarColor(time, maxTime, element1, element2) {
	if(time <= maxTime/4) {
		element1.css('borderColor', 'red');
		element2.css('backgroundColor', 'red');
	} else if(time <= maxTime/2) {
		element1.css('borderColor', 'orange');
		element2.css('backgroundColor', 'orange');
	} else {
		element1.css('borderColor', 'green');
		element2.css('backgroundColor', 'green');
	}
}

//-----------------------------------------------------------

//Canvas section---------------------------------------------------------

function getCoordinates(element, event){ //Gets pointer coordinates inside DOM element

	let rect = element.getBoundingClientRect();
	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
	};
}