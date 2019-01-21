$(function (){

	//Global variables needed for the script
	let slideIndex = 0;
	let sliding;
	let controls = [];
	//--------------------------------------
	
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

	let nextSlide = function () {
		slideIndex ++;
		slide();
	}

	//Carousel controls class-------------------------
	class CarouselControl {
		constructor(element, inputType) {
			this.element = element;
			this.inputType = inputType;
		}
		
		//Adds instance to controls array (needed for a special method)
		addToControls() {
			controls.push(this)
		}

		setControl() {
			this.element.on('"' + this.inputType + '"', nextSlide);
		}
	}
	//------------------------------------------------
	
	let nextButton = new CarouselControl($('#next'), "click");
	nextButton.setControl();
	nextButton.addToControls();
	console.log(controls);
});
