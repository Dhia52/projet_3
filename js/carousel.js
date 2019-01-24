$(function (){

	//Global variables needed for the script
	let sliding;
	let autoControls = []; //array of DOM elements that stop auto sliding
	//--------------------------------------
	
	let diapo = {
		index: 0,
		auto: "",

		//Defines carousel behaviour along with CSS
		slide() {
			//Condition to avoid going "out of bounds"
			if (diapo.index === 4 || diapo.index === -1) {
				diapo.index = 0;
			}
			//Animation plays
			let step = diapo.index * (-100);
			$('#slideshow > div').css('transform', 'translateX(' + step + '%)');
		},

		nextSlide () {
			diapo.index ++;
			diapo.slide();
		},

		prevSlide () {
			diapo.index --;
			diapo.slide();
		},

		setAutoCarouselOn () {
			diapo.auto = true;
			sliding = setInterval(diapo.nextSlide, 5000);

			$('#on').hide();
			$('#off').show();

			autoControls.forEach(control => {
				control.setAutoControl();
			});
		},

		setAutoCarouselOff () {
			diapo.auto = false;
			clearInterval(sliding);

			$('#off').hide();
			$('#on').show();

			autoControls.forEach(control => {
				control.setAutoControl();
			});
		}
	}

	//Carousel controls class-------------------------
	class CarouselControl {
		constructor(element, inputType, action, autoOff) {
			this.element = element; //gets DOM element
			this.inputType = inputType; //gets input type for event
			this.action = action; //DOM element event
			this.autoOff = autoOff; //boolean for elements that will stop auto scrolling
			this.createControl();
		}
		
		//creates DOM element event
		createControl() {
			this.element.on(this.inputType, this.action);
			if (this.autoOff) {
				autoControls.push(this);
			}
		}

		setAutoControl() {
			if (diapo.auto) {
				this.element.on(this.inputType, diapo.setAutoCarouselOff);
			} else {
				this.element.off(this.inputType, diapo.setAutoCarouselOff);
			}
		}
	}
	//------------------------------------------------
	
	//Sets events for the control buttons
	let pauseButton = new CarouselControl($('#off'), "click", diapo.setAutoCarouselOff, false);
	let playButton = new CarouselControl($('#on'), "click", diapo.setAutoCarouselOn, false);
	let nextButton = new CarouselControl($('#next'), "click", diapo.nextSlide, true);
	let prevButton = new CarouselControl($('#prev'), "click", diapo.prevSlide, true);
	let keypresses = new CarouselControl($('body'), "keyup", function(event) {
		let key = event.which; //gets code of pressed key

		if (key === 37) { //if left arrow is pressed
			diapo.prevSlide();
			console.log("Pressed the arrow left button.");
		} else if (key === 39) { //if right arrow is pressed
			diapo.nextSlide();
			console.log("Pressed the arrow right button.");
		}
	}, true);
	let carouselClick = new CarouselControl($('#slideshow'), "click", diapo.nextSlide, true);
	
	console.log(autoControls);

	diapo.setAutoCarouselOn();
});
