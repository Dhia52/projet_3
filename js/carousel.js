$(function (){

	//Global variables needed for the script
	let slideIndex = 0;
	let sliding;
	//--------------------------------------

	//Functions of the script-----------------------------------------------

	//Defines carousel behaviour along with CSS
	function slide() {

		//Condition to avoid going "out of bounds"
		if (slideIndex === 4 || slideIndex === -1) {
			slideIndex = 0;
		}

		//Animation plays
		let step = slideIndex * (-100);
		$('#slideshow > div').css('transform', 'translateX(' + step + '%)');
	}

	//Displaying the next slide of the carousel
	function nextSlide() {
		slideIndex ++;
		slide();
	}

	//Displaying the previous slide of the carousel
	function prevSlide() {
		slideIndex --;
		slide();
	}

	//Sets automatic slides on
	function autoCarouselOn() {

		sliding = setInterval(nextSlide, 5000); //Auto slides

		$('#on_off').html('<i class="fas fa-pause-circle"></i>') //"Play" button becomes "pause" button
			.on('click', autoCarouselOff)
			.off('click', autoCarouselOn);

		$('body').on('keyup', autoCarouselOff);
		$('#slideshow, #next, #prev').on('click', autoCarouselOff);
	}

	//Sets automatic slides off
	function autoCarouselOff() {

		clearInterval(sliding); //Stops auto slides

		$('#on_off').html('<i class="fas fa-play-circle"></i>') //"Pause" button becomes "play" button
			.on('click', autoCarouselOn)
			.off('click', autoCarouselOff);

		$('body').off('keyup', autoCarouselOff);
		$('#slideshow, #next, #prev').off('click', autoCarouselOff);
	}
	//--------------------------------------------------------------------------------------------

	//Main events of the DOM elements------------------------------------------------------------------

	//Changing slides through keypresses
	$('body').on('keyup', function(event) {

		let key = event.which; //Gets code of the pressed key

		if (key === 37) { //If "arrow left" is pressed..
			prevSlide();
		} else if (key === 39) { //If "arrow right" is pressed...
			nextSlide();
		}

	});

	$('#slideshow, #next').on('click', nextSlide); //On click on the carousel or next button, next slide
	$('#prev').on('click', prevSlide); //On click on the prev button, previous slide
	//------------------------------------------------------------------------------------------------

	autoCarouselOn(); //Default state of the carousel section

});