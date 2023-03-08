const colors = ["red", "orange", "pink", "green", "blue", "purple"];
const colorwheel = document.querySelector('.colorwheel');
let currentIndex = 0;

setInterval(function() {
	colorwheel.style.backgroundColor = colors[currentIndex];
	currentIndex++;
	if (currentIndex == undefined || currentIndex >= colors.length) {
		currentIndex = 0;
	}
}, 5000);