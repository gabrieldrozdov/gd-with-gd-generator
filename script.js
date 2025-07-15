const colors = ['pink', 'green', 'blue', 'yellow', 'purple', 'red'];

// Header logo animation
function initHeader() {
	let headerTitle = document.querySelector('.header-title a');
	let temp = '';
	let colorIndex = 0;
	for (let letter of headerTitle.innerText) {
		if (letter == " ") {
			temp += "&nbsp;";
		} else {
			temp += `<span style="color: var(--${colors[colorIndex]});" data-index="${colorIndex}">${letter}</span>`;
			colorIndex++;
			if (colorIndex >= colors.length) {
				colorIndex = 0;
			}
		}
	}
	headerTitle.innerHTML = temp;
	setInterval(() => {
		for (let letter of headerTitle.querySelectorAll('span')) {
			let index = parseInt(letter.dataset.index);
			index++;
			if (index >= colors.length) {
				index = 0;
			}
			letter.dataset.index = index;
			letter.style.color = `var(--${colors[index]})`;
		}
	}, 250)
}
initHeader();

// Toggle controls
let showControls = true;
function toggleControls() {
	showControls = !showControls;
	const container = document.querySelector('.container');
	container.dataset.controls = showControls;
}

// Fullscreen
function activateFullscreen() {
	const body = document.querySelector('body');
	body.dataset.fullscreen = 1;
	setTimeout(() => {
		body.addEventListener('click', deactivateFullscreen);
	}, 50)
}
function deactivateFullscreen() {
	const body = document.querySelector('body');
	body.dataset.fullscreen = 0;
	body.removeEventListener('click', deactivateFullscreen);
}

// Bubble generator
let colorIndex = 0;
let bubbleSize = 5;
let bubbleDrift = 250;
let bubbleRotation = 180;
let bubbleRatio = "square";
function generateBubble() {
	let newBubble = document.createElement('div');
	newBubble.classList.add('output-bubble');
	newBubble.style.backgroundColor = `var(--${colors[colorIndex]})`;
	newBubble.style.left = Math.round(Math.random()*100) + "%";
	newBubble.style.top = Math.round(Math.random()*100) + "%";
	if (bubbleRatio == "square") {
		let size = Math.round(Math.random()*(bubbleSize*1.5)+bubbleSize*1.5) + "vmin"
		newBubble.style.width = size;
		newBubble.style.height = size;
	} else {
		newBubble.style.width = Math.round(Math.random()*(bubbleSize*3)+bubbleSize*1.5) + "vmin";
		newBubble.style.height = Math.round(Math.random()*(bubbleSize*3)+bubbleSize*1.5) + "vmin";
	}
	newBubble.style.zIndex = Math.round(Math.random()*2);
	newBubble.style.transform = `translate(${Math.random()*bubbleDrift*2-bubbleDrift-50}%, ${Math.random()*bubbleDrift*2-bubbleDrift-50}%) rotate(${Math.random()*bubbleRotation}deg)`;

	const homeTitle = document.querySelector('.output');
	homeTitle.appendChild(newBubble);
	setTimeout(() => {
		newBubble.style.opacity = 1;
		newBubble.style.transform = `translate(${Math.random()*bubbleDrift*2-bubbleDrift-50}%, ${Math.random()*bubbleDrift*2-bubbleDrift-50}%) rotate(${Math.random()*bubbleRotation}deg)`;
	}, 50)
	setTimeout(() => {
		newBubble.style.opacity = 0;
		setTimeout(() => {
			newBubble.remove();
		}, 1000)
	}, Math.random()*5000+2500)
	colorIndex++;
	if (colorIndex >= colors.length) {
		colorIndex = 0;
	}
}
let bubbleDelay = 100;
let bubbleTimeout;
function bubbleLoop() {
	generateBubble();
	bubbleTimeout = setTimeout(bubbleLoop, bubbleDelay);
}
bubbleLoop();
function clearBubbles() {
	for (let bubble of document.querySelectorAll('.output-bubble')) {
		bubble.remove();
	}
}

// Text
function updateText() {
	const controlsInput = document.querySelector('#input');
	let words = controlsInput.value.split(" ");

	let temp = "";
	let wordIndex = 0;
	for (let word of words) {
		temp += `<span class="output-text-word" data-index="${wordIndex}">`;
		for (let letter of word) {
			temp += `<span class="output-text-letter">${letter}</span>`;
		}
		temp += `</span><span>&nbsp;</span>`;
		wordIndex++;
	}

	for (let outputText of document.querySelectorAll('.output-text')) {
		outputText.innerHTML = temp;
	}

	initializeDraggableWords();
}
function initializeDraggableWords() {
	// Draggable words
	for (let outputTextWord of document.querySelectorAll('.output-text-fill .output-text-word')) {
		const textOutline = document.querySelector(`.output-text-outline .output-text-word[data-index="${outputTextWord.dataset.index}"]`);

		outputTextWord.addEventListener('mousedown', (e) => {dragElement(e, outputTextWord)});

		let activeDragElement;
		let prevPos = [0, 0];
		let deltaPos = [0, 0];
		function dragElement(e, elmnt) {
			prevPos = [e.clientX, e.clientY];
			activeDragElement = elmnt;
			document.addEventListener('mousemove', updateDragElement);
			document.addEventListener('mouseup', endDragElement);
		}
		function updateDragElement(e) {
			let newPos = [e.clientX, e.clientY];
			let delta = [(newPos[0] - prevPos[0])/canvasScale, (newPos[1] - prevPos[1])/canvasScale];
			deltaPos = [deltaPos[0] + delta[0], deltaPos[1] + delta[1]];
			activeDragElement.style.left = deltaPos[0] + "px";
			activeDragElement.style.top = deltaPos[1] + "px";
			textOutline.style.left = deltaPos[0] + "px";
			textOutline.style.top = deltaPos[1] + "px";
			prevPos = [e.clientX, e.clientY];
		}
		function endDragElement() {
			document.removeEventListener('mousemove', updateDragElement);
			document.removeEventListener('mouseup', endDragElement);
		}
	}
}
initializeDraggableWords();
function setTextFillColor(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--text-fill-color', val);
	root.style.setProperty('--text-outline-color', val);

	// Update active btn
	for (let btn of document.querySelectorAll('[data-text-fill]')) {
		btn.dataset.active = 0;
	}
	let activeBtn = document.querySelector(`[data-text-fill="${val}"]`);
	activeBtn.dataset.active = 1;
}
// function setTextOutlineColor(val) {
// 	const root = document.querySelector('html');
// 	root.style.setProperty('--text-outline-color', val);

// 	// Update active btn
// 	for (let btn of document.querySelectorAll('[data-text-outline-color]')) {
// 		btn.dataset.active = 0;
// 	}
// 	let activeBtn = document.querySelector(`[data-text-outline-color="${val}"]`);
// 	activeBtn.dataset.active = 1;
// }
// function setTextOutlineSize(val) {
// 	const root = document.querySelector('html');
// 	root.style.setProperty('--text-outline-size', val/200 + "em");

// 	// Update label
// 	const label = document.querySelector('[for="text-outline-size"]');
// 	label.innerText = val;

// 	// Update slider
// 	const slider = document.querySelector('[name="text-outline-size"]');
// 	slider.value = val;
// }
// function resetTextOutlineSize() {
// 	const root = document.querySelector('html');
// 	root.style.setProperty('--text-outline-size', ".02em");

// 	const slider = document.querySelector('[name="text-outline-size"]');
// 	slider.value = 2;
// 	const label = document.querySelector('[for="text-outline-size"]');
// 	label.innerText = 2;
// }
function setFontSize(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--font-size', val + "vmin");

	// Update label
	const label = document.querySelector('[for="font-size"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="font-size"]');
	slider.value = val;
}
function resetFontSize() {
	const root = document.querySelector('html');
	root.style.setProperty('--font-size', "15vmin");
	const slider = document.querySelector('[name="font-size"]');
	slider.value = 15;
	const label = document.querySelector('[for="font-size"]');
	label.innerText = 15;
}
function setFontWeight(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--font-weight', val);

	// Update label
	const label = document.querySelector('[for="font-weight"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="font-weight"]');
	slider.value = val;
}
function resetFontWeight() {
	const root = document.querySelector('html');
	root.style.setProperty('--font-weight', "700");
	const slider = document.querySelector('[name="font-weight"]');
	slider.value = 700;
	const label = document.querySelector('[for="font-weight"]');
	label.innerText = 700;
}
function setFontSerif(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--font-serif', val);

	// Update label
	const label = document.querySelector('[for="font-serif"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="font-serif"]');
	slider.value = val;
}
function resetFontSerif() {
	const root = document.querySelector('html');
	root.style.setProperty('--font-serif', "0");
	const slider = document.querySelector('[name="font-serif"]');
	slider.value = 0;
	const label = document.querySelector('[for="font-serif"]');
	label.innerText = 0;
}
function toggleTextAnimation(val) {
	const output = document.querySelector('.output');
	output.dataset.textMove = val;

	// Update active btn
	for (let btn of document.querySelectorAll('[data-text-animation]')) {
		btn.dataset.active = 0;
	}
	let activeBtn = document.querySelector(`[data-text-animation="${val}"]`);
	activeBtn.dataset.active = 1;
}
function setFontDrift(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--font-drift', val + "rem");

	// Update label
	const label = document.querySelector('[for="font-drift"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="font-drift"]');
	slider.value = val;
}
function resetFontDrift() {
	const root = document.querySelector('html');
	root.style.setProperty('--font-drift', "-.2rem");
	const slider = document.querySelector('[name="font-drift"]');
	slider.value = -.2;
	const label = document.querySelector('[for="font-drift"]');
	label.innerText = "-0.2";
}
function setFontRotation(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--font-rotation', val + "deg");

	// Update label
	const label = document.querySelector('[for="font-rotation"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="font-rotation"]');
	slider.value = val;
}
function resetFontRotation() {
	const root = document.querySelector('html');
	root.style.setProperty('--font-rotation', "-2deg");
	const slider = document.querySelector('[name="font-rotation"]');
	slider.value = -2;
	const label = document.querySelector('[for="font-rotation"]');
	label.innerText = -2;
}
function setFontSpeed(val) {
	let newVal = 5.5-val;

	const root = document.querySelector('html');
	root.style.setProperty('--font-speed', newVal + "s");

	// Update label
	const label = document.querySelector('[for="font-speed"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="font-speed"]');
	slider.value = val;
}
function resetFontSpeed() {
	const root = document.querySelector('html');
	root.style.setProperty('--font-speed', "1s");
	const slider = document.querySelector('[name="font-speed"]');
	slider.value = 2.5;
	const label = document.querySelector('[for="font-speed"]');
	label.innerText = 2.5;
}
function toggleText(val) {
	const output = document.querySelector('.output');
	const toggle = document.querySelector('#main-text .controls-section-hide');

	if (val != undefined) {
		output.dataset.text = val;
		toggle.dataset.active = val;
	} else {
		if (output.dataset.text == 'true') {
			output.dataset.text = false;
			toggle.dataset.active = false;
		} else {
			output.dataset.text = true;
			toggle.dataset.active = true;
		}
	}
}
function randomizeTextSettings() {
	const textColors = ['var(--pink)', 'var(--green)', 'var(--blue)', 'var(--yellow)', 'var(--purple)', 'var(--red)', 'var(--off-white)', 'var(--light-gray)', 'var(--dark-gray)', 'var(--off-black)'];
	setTextFillColor(textColors[Math.floor(Math.random()*textColors.length)]);
	// setTextOutlineColor(textColors[Math.floor(Math.random()*textColors.length)]);

	// setTextOutlineSize((Math.random()*5).toFixed(1));
	setFontSize((Math.random()*29+1).toFixed(1));
	setFontWeight(Math.round(Math.random()*800+100));
	setFontSerif(Math.round(Math.random()*100));
	setFontDrift((Math.random()*4-2).toFixed(1));
	setFontRotation(Math.round(Math.random()*180-90));
	setFontSpeed((Math.random()*5).toFixed(1));

	updateText();
}
function resetTextSettings() {
	setTextFillColor('var(--off-black)');
	// setTextOutlineColor('var(--off-black)');
	// resetTextOutlineSize();
	resetFontSize();
	resetFontWeight();
	resetFontSerif();
	toggleTextAnimation(true);
	resetFontDrift();
	resetFontRotation();
	resetFontSpeed();
	toggleText(true);
	updateText();
}

// Background
function setBackgroundPrimaryColor(val) {
	const root = document.querySelector('html');
	const output = document.querySelector('.output');
	if (val == "gradient") {
		output.dataset.backgroundGradient = 1;
	} else {
		output.dataset.backgroundGradient = 0;
		root.style.setProperty('--background-primary-color', val);
	}

	// Update active btn
	for (let btn of document.querySelectorAll('[data-background-primary]')) {
		btn.dataset.active = 0;
	}
	let activeBtn = document.querySelector(`[data-background-primary="${val}"]`);
	activeBtn.dataset.active = 1;
}
function setBackgroundSecondaryColor(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--background-secondary-color', val);

	// Update active btn
	for (let btn of document.querySelectorAll('[data-background-secondary]')) {
		btn.dataset.active = 0;
	}
	let activeBtn = document.querySelector(`[data-background-secondary="${val}"]`);
	activeBtn.dataset.active = 1;
}
function setBackgroundSize(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--background-size', val + "vmin");

	// Update label
	const label = document.querySelector('[for="background-size"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="background-size"]');
	slider.value = val;
}
function resetBackgroundSize() {
	const root = document.querySelector('html');
	root.style.setProperty('--background-size', "2vmin");
	const slider = document.querySelector('[name="background-size"]');
	slider.value = 2;
	const label = document.querySelector('[for="background-size"]');
	label.innerText = 2;
}
function setBackgroundMoveSpeed(val) {
	let newVal = 5.5-val;

	const root = document.querySelector('html');
	root.style.setProperty('--background-move-speed', newVal + "s");

	// Update label
	const label = document.querySelector('[for="background-move-speed"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="background-move-speed"]');
	slider.value = val;
}
function resetBackgroundMoveSpeed() {
	const root = document.querySelector('html');
	root.style.setProperty('--background-move-speed', "2s");
	const slider = document.querySelector('[name="background-move-speed"]');
	slider.value = 2.5;
	const label = document.querySelector('[for="background-move-speed"]');
	label.innerText = 2.5;
}
function resetBackgroundSettings() {
	setBackgroundPrimaryColor('var(--light-gray)');
	setBackgroundSecondaryColor('transparent');
	resetBackgroundSize();
	resetBackgroundMoveSpeed();
}
function randomizeBackgroundSettings() {
	const primaryColors = ['var(--pink)', 'var(--green)', 'var(--blue)', 'var(--yellow)', 'var(--purple)', 'var(--red)', 'var(--off-white)', 'var(--light-gray)', 'var(--dark-gray)', 'var(--off-black)', 'gradient'];
	setBackgroundPrimaryColor(primaryColors[Math.floor(Math.random()*primaryColors.length)]);

	const secondaryColors = ['var(--pink)', 'var(--green)', 'var(--blue)', 'var(--yellow)', 'var(--purple)', 'var(--red)', 'var(--off-white)', 'var(--light-gray)', 'var(--dark-gray)', 'var(--off-black)', 'transparent'];
	setBackgroundSecondaryColor(secondaryColors[Math.floor(Math.random()*secondaryColors.length)]);

	setBackgroundSize((Math.random()*4+1).toFixed(1));

	setBackgroundMoveSpeed((Math.random()*4.5+.5).toFixed(1));
}

// Bubbles
function toggleBubbles(val) {
	const output = document.querySelector('.output');
	const toggle = document.querySelector('#bubbles .controls-section-hide');

	if (val != undefined) {
		output.dataset.bubbles = val;
		toggle.dataset.active = val;
	} else {
		if (output.dataset.bubbles == 'true') {
			output.dataset.bubbles = false;
			toggle.dataset.active = false;
		} else {
			output.dataset.bubbles = true;
			toggle.dataset.active = true;
		}
	}
}
function setBubbleFillColor(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--bubble-fill-color', val);
	const output = document.querySelector('.output');
	if (val != "unset") {
		output.dataset.bubbleColor = 1;
	} else {
		output.dataset.bubbleColor = 0;
	}

	// Update active btn
	for (let btn of document.querySelectorAll('[data-bubble-fill]')) {
		btn.dataset.active = 0;
	}
	let activeBtn = document.querySelector(`[data-bubble-fill="${val}"]`);
	activeBtn.dataset.active = 1;
}
function setBubbleOutlineColor(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--bubble-outline-color', val);

	// Update active btn
	for (let btn of document.querySelectorAll('[data-bubble-outline]')) {
		btn.dataset.active = 0;
	}
	let activeBtn = document.querySelector(`[data-bubble-outline="${val}"]`);
	activeBtn.dataset.active = 1;
}
function setBubbleRadius(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--bubble-shape', val);
}
function setBubbleRatio(val) {
	clearTimeout(bubbleTimeout);
	clearBubbles();
	bubbleRatio = val;
	bubbleLoop();
}
function setBubbleShape(shape) {
	for (let elmnt of document.querySelectorAll('[data-shape]')) {
		elmnt.dataset.active = 0;
	}
	let activeElmnt = document.querySelector(`[data-shape="${shape}"]`);
	activeElmnt.dataset.active = 1;
}
function setBubbleOutlineSize(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--bubble-outline-size', val + "px");

	// Update label
	const label = document.querySelector('[for="bubble-outline-size"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="bubble-outline-size"]');
	slider.value = val;
}
function resetBubbleOutlineSize() {
	const root = document.querySelector('html');
	root.style.setProperty('--bubble-outline-size', "4px");

	const slider = document.querySelector('[name="bubble-outline-size"]');
	slider.value = 4;
	const label = document.querySelector('[for="bubble-outline-size"]');
	label.innerText = 4;
}
function setBubbleQuantity(val) {
	clearTimeout(bubbleTimeout);
	clearBubbles();
	bubbleDelay = 1350 - val*5;
	bubbleLoop();

	// Update label
	const label = document.querySelector('[for="bubble-quantity"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="bubble-quantity"]');
	slider.value = val;
}
function resetBubbleQuantity() {
	clearTimeout(bubbleTimeout);
	clearBubbles();
	bubbleDelay = 100;
	bubbleLoop();

	const slider = document.querySelector('[name="bubble-quantity"]');
	slider.value = 250;
	const label = document.querySelector('[for="bubble-quantity"]');
	label.innerText = 250;
}
function setBubbleSize(val) {
	clearTimeout(bubbleTimeout);
	clearBubbles();
	bubbleSize = val;
	bubbleLoop();

	// Update label
	const label = document.querySelector('[for="bubble-size"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="bubble-size"]');
	slider.value = val;
}
function resetBubbleSize() {
	clearTimeout(bubbleTimeout);
	clearBubbles();
	bubbleSize = 5;
	bubbleLoop();

	const slider = document.querySelector('[name="bubble-size"]');
	slider.value = 5;
	const label = document.querySelector('[for="bubble-size"]');
	label.innerText = 5;
}
function setBubbleDrift(val) {
	clearTimeout(bubbleTimeout);
	clearBubbles();
	bubbleDrift = val;
	bubbleLoop();

	// Update label
	const label = document.querySelector('[for="bubble-drift"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="bubble-drift"]');
	slider.value = val;
}
function resetBubbleDrift() {
	clearTimeout(bubbleTimeout);
	clearBubbles();
	bubbleDrift = 250;
	bubbleLoop();

	const slider = document.querySelector('[name="bubble-drift"]');
	slider.value = 250;
	const label = document.querySelector('[for="bubble-drift"]');
	label.innerText = 250;
}
function resetBubbleSettings() {
	setBubbleFillColor('unset');
	setBubbleOutlineColor('transparent');
	resetBubbleOutlineSize();
	setBubbleRadius('50%');
	setBubbleRatio("square");
	setBubbleShape('circles');
	toggleBubbles(true);
	resetBubbleQuantity();
	resetBubbleSize();
	resetBubbleDrift();
}
function randomizeBubbleSettings() {
	const fillColors = ['var(--pink)', 'var(--green)', 'var(--blue)', 'var(--yellow)', 'var(--purple)', 'var(--red)', 'var(--off-white)', 'var(--light-gray)', 'var(--dark-gray)', 'var(--off-black)', 'transparent', 'unset'];
	setBubbleFillColor(`${fillColors[Math.floor(Math.random()*fillColors.length)]}`);

	const outlineColors = ['var(--pink)', 'var(--green)', 'var(--blue)', 'var(--yellow)', 'var(--purple)', 'var(--red)', 'var(--off-white)', 'var(--light-gray)', 'var(--dark-gray)', 'var(--off-black)', 'transparent'];
	setBubbleOutlineColor(`${outlineColors[Math.floor(Math.random()*outlineColors.length)]}`);

	setBubbleOutlineSize(Math.round(Math.random()*25));

	let radius = Math.random() < .5 ? '50%' : '0%';
	let shape = Math.random() < .5 ? 'square' : 'rect';
	setBubbleRadius(radius);
	setBubbleRatio(shape);
	if (radius == '50%' && shape == 'square') {
		setBubbleShape('circles');
	} else if (radius == '50%' && shape == 'rect') {
		setBubbleShape('ovals');
	} else if (radius == '0%' && shape == 'square') {
		setBubbleShape('squares');
	} else {
		setBubbleShape('rectangles');
	}

	setBubbleQuantity(Math.round(Math.random()*399+1));

	setBubbleSize(Math.round(Math.random()*24+1));

	setBubbleDrift(Math.round(Math.random()*1000));
}

// Annotation top
function updateAnnotationTopText() {
	const input = document.querySelector('#annotation-input-top');
	const annotationTop = document.querySelector('.output-annotation-top span');
	annotationTop.innerText = input.value;
}
function initializeDraggableAnnotationTop() {
	const annotation = document.querySelector('.output-annotation-top');
	annotation.addEventListener('mousedown', (e) => {dragElement(e, annotation)});

	let activeDragElement;
	let prevPos = [0, 0];
	let deltaPos = [window.innerHeight*.2, window.innerHeight*.25];
	function dragElement(e, elmnt) {
		prevPos = [e.clientX, e.clientY];
		activeDragElement = elmnt;
		document.addEventListener('mousemove', updateDragElement);
		document.addEventListener('mouseup', endDragElement);
	}
	function updateDragElement(e) {
		let newPos = [e.clientX, e.clientY];
		let delta = [(newPos[0] - prevPos[0])/canvasScale, (newPos[1] - prevPos[1])/canvasScale];
		deltaPos = [deltaPos[0] + delta[0], deltaPos[1] + delta[1]];
		activeDragElement.style.left = deltaPos[0] + "px";
		activeDragElement.style.top = deltaPos[1] + "px";
		prevPos = [e.clientX, e.clientY];
	}
	function endDragElement() {
		document.removeEventListener('mousemove', updateDragElement);
		document.removeEventListener('mouseup', endDragElement);
	}
}
initializeDraggableAnnotationTop();
function setAnnotationTopBackgroundColor(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--annotation-top-background-color', val);

	// Update active btn
	for (let btn of document.querySelectorAll('[data-top-background]')) {
		btn.dataset.active = 0;
	}
	let activeBtn = document.querySelector(`[data-top-background="${val}"]`);
	activeBtn.dataset.active = 1;
}
function setAnnotationTopFontColor(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--annotation-top-font-color', val);

	// Update active btn
	for (let btn of document.querySelectorAll('[data-top-text]')) {
		btn.dataset.active = 0;
	}
	let activeBtn = document.querySelector(`[data-top-text="${val}"]`);
	activeBtn.dataset.active = 1;
}
function setAnnotationTopFontSize(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--annotation-top-font-size', val + "vmin");

	// Update label
	const label = document.querySelector('[for="annotation-top-font-size"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="annotation-top-font-size"]');
	slider.value = val;
}
function resetAnnotationTopFontSize() {
	const root = document.querySelector('html');
	root.style.setProperty('--annotation-top-font-size', "2vmin");
	const slider = document.querySelector('[name="annotation-top-font-size"]');
	slider.value = 2;
	const label = document.querySelector('[for="annotation-top-font-size"]');
	label.innerText = 2;
}
function setAnnotationTopFontWeight(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--annotation-top-font-weight', val);

	// Update label
	const label = document.querySelector('[for="annotation-top-font-weight"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="annotation-top-font-weight"]');
	slider.value = val;
}
function resetAnnotationTopFontWeight() {
	const root = document.querySelector('html');
	root.style.setProperty('--annotation-top-font-weight', "700");
	const slider = document.querySelector('[name="annotation-top-font-weight"]');
	slider.value = 700;
	const label = document.querySelector('[for="annotation-top-font-weight"]');
	label.innerText = 700;
}
function setAnnotationTopFontSerif(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--annotation-top-font-serif', val);

	// Update label
	const label = document.querySelector('[for="annotation-top-font-serif"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="annotation-top-font-serif"]');
	slider.value = val;
}
function resetAnnotationTopFontSerif() {
	const root = document.querySelector('html');
	root.style.setProperty('--annotation-top-font-serif', "0");
	const slider = document.querySelector('[name="annotation-top-font-serif"]');
	slider.value = 0;
	const label = document.querySelector('[for="annotation-top-font-serif"]');
	label.innerText = 0;
}
function toggleAnnotationTopAnimation(val) {
	const output = document.querySelector('.output');
	output.dataset.annotationTopAnimation = val;

	// Update active btn
	for (let btn of document.querySelectorAll('[data-top-animation]')) {
		btn.dataset.active = 0;
	}
	let activeBtn = document.querySelector(`[data-top-animation="${val}"]`);
	activeBtn.dataset.active = 1;
}
function setAnnotationTopFontDrift(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--annotation-top-font-drift', val);

	// Update label
	const label = document.querySelector('[for="annotation-top-font-drift"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="annotation-top-font-drift"]');
	slider.value = val;
}
function resetAnnotationTopFontDrift() {
	const root = document.querySelector('html');
	root.style.setProperty('--annotation-top-font-drift', 1);
	const slider = document.querySelector('[name="annotation-top-font-drift"]');
	slider.value = 1;
	const label = document.querySelector('[for="annotation-top-font-drift"]');
	label.innerText = 1;
}
function setAnnotationTopFontRotation(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--annotation-top-font-rotation', val + "deg");

	// Update label
	const label = document.querySelector('[for="annotation-top-font-rotation"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="annotation-top-font-rotation"]');
	slider.value = val;
}
function resetAnnotationTopFontRotation() {
	const root = document.querySelector('html');
	root.style.setProperty('--annotation-top-font-rotation', "-5deg");
	const slider = document.querySelector('[name="annotation-top-font-rotation"]');
	slider.value = -5;
	const label = document.querySelector('[for="annotation-top-font-rotation"]');
	label.innerText = -5;
}
function setAnnotationTopFontSpeed(val) {
	let newVal = 5.1-val;

	const root = document.querySelector('html');
	root.style.setProperty('--annotation-top-font-speed', newVal + "s");

	// Update label
	const label = document.querySelector('[for="annotation-top-font-speed"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="annotation-top-font-speed"]');
	slider.value = val;
}
function resetAnnotationTopFontSpeed() {
	const root = document.querySelector('html');
	root.style.setProperty('--annotation-top-font-speed', "1.1s");
	const slider = document.querySelector('[name="annotation-top-font-speed"]');
	slider.value = 4;
	const label = document.querySelector('[for="annotation-top-font-speed"]');
	label.innerText = 4;
}
function toggleAnnotationTop(val) {
	const output = document.querySelector('.output');
	const toggle = document.querySelector('#top-text .controls-section-hide');

	if (val != undefined) {
		output.dataset.annotationTop = val;
		toggle.dataset.active = val;
	} else {
		if (output.dataset.annotationTop == 'true') {
			output.dataset.annotationTop = false;
			toggle.dataset.active = false;
		} else {
			output.dataset.annotationTop = true;
			toggle.dataset.active = true;
		}
	}
}
function resetAnnotationTopPosition() {
	const annotation = document.querySelector('.output-annotation-top');
	annotation.style.top = "26vmin";
	annotation.style.left = "20vmin";
}
function randomizeAnnotationTopSettings() {
	const fillColors = ['var(--pink)', 'var(--green)', 'var(--blue)', 'var(--yellow)', 'var(--purple)', 'var(--red)', 'var(--off-white)', 'var(--light-gray)', 'var(--dark-gray)', 'var(--off-black)'];
	setAnnotationTopBackgroundColor(fillColors[Math.floor(Math.random()*fillColors.length)]);
	setAnnotationTopFontColor(fillColors[Math.floor(Math.random()*fillColors.length)]);

	setAnnotationTopFontSize((Math.random()*4+1).toFixed(1));
	setAnnotationTopFontWeight(Math.round(Math.random()*800+100));
	setAnnotationTopFontSerif(Math.round(Math.random()*100));
	setAnnotationTopFontDrift((Math.random()*5).toFixed(1));
	setAnnotationTopFontRotation(Math.round(Math.random()*180-90));
	setAnnotationTopFontSpeed((Math.random()*4.5+.5).toFixed(1));
	resetAnnotationTopPosition();
}
function resetAnnotationTopSettings() {
	setAnnotationTopBackgroundColor('var(--off-white)');
	setAnnotationTopFontColor('var(--off-black)');
	resetAnnotationTopFontSize();
	resetAnnotationTopFontWeight();
	resetAnnotationTopFontSerif();
	toggleAnnotationTopAnimation(true);
	resetAnnotationTopFontDrift();
	resetAnnotationTopFontRotation();
	resetAnnotationTopFontSpeed();
	toggleAnnotationTop(true);
}

// Annotation bottom
function updateAnnotationBottomText() {
	const input = document.querySelector('#annotation-input-bottom');
	const annotationBottom = document.querySelector('.output-annotation-bottom span');
	annotationBottom.innerText = input.value;
}
function initializeDraggableAnnotationBottom() {
	const annotation = document.querySelector('.output-annotation-bottom');
	annotation.addEventListener('mousedown', (e) => {dragElement(e, annotation)});

	let activeDragElement;
	let prevPos = [0, 0];
	let deltaPos = [window.innerHeight*.2, window.innerHeight*.25];
	function dragElement(e, elmnt) {
		prevPos = [e.clientX, e.clientY];
		activeDragElement = elmnt;
		document.addEventListener('mousemove', updateDragElement);
		document.addEventListener('mouseup', endDragElement);
	}
	function updateDragElement(e) {
		let newPos = [e.clientX, e.clientY];
		let delta = [(newPos[0] - prevPos[0])/canvasScale, (newPos[1] - prevPos[1])/canvasScale];
		deltaPos = [deltaPos[0] - delta[0], deltaPos[1] - delta[1]];
		activeDragElement.style.right = deltaPos[0] + "px";
		activeDragElement.style.bottom = deltaPos[1] + "px";
		prevPos = [e.clientX, e.clientY];
	}
	function endDragElement() {
		document.removeEventListener('mousemove', updateDragElement);
		document.removeEventListener('mouseup', endDragElement);
	}
}
initializeDraggableAnnotationBottom();
function setAnnotationBottomBackgroundColor(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--annotation-bottom-background-color', val);

	// Update active btn
	for (let btn of document.querySelectorAll('[data-bottom-background]')) {
		btn.dataset.active = 0;
	}
	let activeBtn = document.querySelector(`[data-bottom-background="${val}"]`);
	activeBtn.dataset.active = 1;
}
function setAnnotationBottomFontColor(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--annotation-bottom-font-color', val);

	// Update active btn
	for (let btn of document.querySelectorAll('[data-bottom-text]')) {
		btn.dataset.active = 0;
	}
	let activeBtn = document.querySelector(`[data-bottom-text="${val}"]`);
	activeBtn.dataset.active = 1;
}
function setAnnotationBottomFontSize(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--annotation-bottom-font-size', val + "vmin");

	// Update label
	const label = document.querySelector('[for="annotation-bottom-font-size"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="annotation-bottom-font-size"]');
	slider.value = val;
}
function resetAnnotationBottomFontSize() {
	const root = document.querySelector('html');
	root.style.setProperty('--annotation-bottom-font-size', "2vmin");
	const slider = document.querySelector('[name="annotation-bottom-font-size"]');
	slider.value = 2;
	const label = document.querySelector('[for="annotation-bottom-font-size"]');
	label.innerText = 2;
}
function setAnnotationBottomFontWeight(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--annotation-bottom-font-weight', val);

	// Update label
	const label = document.querySelector('[for="annotation-bottom-font-weight"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="annotation-bottom-font-weight"]');
	slider.value = val;
}
function resetAnnotationBottomFontWeight() {
	const root = document.querySelector('html');
	root.style.setProperty('--annotation-bottom-font-weight', "700");
	const slider = document.querySelector('[name="annotation-bottom-font-weight"]');
	slider.value = 700;
	const label = document.querySelector('[for="annotation-bottom-font-weight"]');
	label.innerText = 700;
}
function setAnnotationBottomFontSerif(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--annotation-bottom-font-serif', val);

	// Update label
	const label = document.querySelector('[for="annotation-bottom-font-serif"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="annotation-bottom-font-serif"]');
	slider.value = val;
}
function resetAnnotationBottomFontSerif() {
	const root = document.querySelector('html');
	root.style.setProperty('--annotation-bottom-font-serif', "0");
	const slider = document.querySelector('[name="annotation-bottom-font-serif"]');
	slider.value = 0;
	const label = document.querySelector('[for="annotation-bottom-font-serif"]');
	label.innerText = 0;
}
function toggleAnnotationBottomAnimation(val) {
	const output = document.querySelector('.output');
	output.dataset.annotationBottomAnimation = val;

	// Update active btn
	for (let btn of document.querySelectorAll('[data-bottom-animation]')) {
		btn.dataset.active = 0;
	}
	let activeBtn = document.querySelector(`[data-bottom-animation="${val}"]`);
	activeBtn.dataset.active = 1;
}
function setAnnotationBottomFontDrift(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--annotation-bottom-font-drift', val);

	// Update label
	const label = document.querySelector('[for="annotation-bottom-font-drift"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="annotation-bottom-font-drift"]');
	slider.value = val;
}
function resetAnnotationBottomFontDrift() {
	const root = document.querySelector('html');
	root.style.setProperty('--annotation-bottom-font-drift', 1);
	const slider = document.querySelector('[name="annotation-bottom-font-drift"]');
	slider.value = 1;
	const label = document.querySelector('[for="annotation-bottom-font-drift"]');
	label.innerText = 1;
}
function setAnnotationBottomFontRotation(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--annotation-bottom-font-rotation', val + "deg");

	// Update label
	const label = document.querySelector('[for="annotation-bottom-font-rotation"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="annotation-bottom-font-rotation"]');
	slider.value = val;
}
function resetAnnotationBottomFontRotation() {
	const root = document.querySelector('html');
	root.style.setProperty('--annotation-bottom-font-rotation', "5deg");
	const slider = document.querySelector('[name="annotation-bottom-font-rotation"]');
	slider.value = 5;
	const label = document.querySelector('[for="annotation-bottom-font-rotation"]');
	label.innerText = 5;
}
function setAnnotationBottomFontSpeed(val) {
	let newVal = 5.1-val;

	const root = document.querySelector('html');
	root.style.setProperty('--annotation-bottom-font-speed', newVal + "s");

	// Update label
	const label = document.querySelector('[for="annotation-bottom-font-speed"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="annotation-bottom-font-speed"]');
	slider.value = val;
}
function resetAnnotationBottomFontSpeed() {
	const root = document.querySelector('html');
	root.style.setProperty('--annotation-bottom-font-speed', "1.1s");
	const slider = document.querySelector('[name="annotation-bottom-font-speed"]');
	slider.value = 4;
	const label = document.querySelector('[for="annotation-bottom-font-speed"]');
	label.innerText = 4;
}
function toggleAnnotationBottom(val) {
	const output = document.querySelector('.output');
	const toggle = document.querySelector('#bottom-text .controls-section-hide');

	if (val != undefined) {
		output.dataset.annotationBottom = val;
		toggle.dataset.active = val;
	} else {
		if (output.dataset.annotationBottom == 'true') {
			output.dataset.annotationBottom = false;
			toggle.dataset.active = false;
		} else {
			output.dataset.annotationBottom = true;
			toggle.dataset.active = true;
		}
	}
}
function resetAnnotationBottomPosition() {
	const annotation = document.querySelector('.output-annotation-bottom');
	annotation.style.bottom = "24vmin";
	annotation.style.right = "20vmin";
}
function randomizeAnnotationBottomSettings() {
	const fillColors = ['var(--pink)', 'var(--green)', 'var(--blue)', 'var(--yellow)', 'var(--purple)', 'var(--red)', 'var(--off-white)', 'var(--light-gray)', 'var(--dark-gray)', 'var(--off-black)'];
	setAnnotationBottomBackgroundColor(fillColors[Math.floor(Math.random()*fillColors.length)]);
	setAnnotationBottomFontColor(fillColors[Math.floor(Math.random()*fillColors.length)]);

	setAnnotationBottomFontSize((Math.random()*4+1).toFixed(1));
	setAnnotationBottomFontWeight(Math.round(Math.random()*800+100));
	setAnnotationBottomFontSerif(Math.round(Math.random()*100));
	setAnnotationBottomFontDrift((Math.random()*5).toFixed(1));
	setAnnotationBottomFontRotation(Math.round(Math.random()*180-90));
	setAnnotationBottomFontSpeed((Math.random()*4.5+.5).toFixed(1));
	resetAnnotationBottomPosition();
}
function resetAnnotationBottomSettings() {
	setAnnotationBottomBackgroundColor('var(--off-white)');
	setAnnotationBottomFontColor('var(--off-black)');
	resetAnnotationBottomFontSize();
	resetAnnotationBottomFontWeight();
	resetAnnotationBottomFontSerif();
	toggleAnnotationBottomAnimation(true);
	resetAnnotationBottomFontDrift();
	resetAnnotationBottomFontRotation();
	resetAnnotationBottomFontSpeed();
	toggleAnnotationBottom(true);
}

// Canvas
function setAspectRatio(val1, val2) {
	const root = document.querySelector('html');
	root.style.setProperty('--output-width', val1 + "vmin");
	root.style.setProperty('--output-height', val2 + "vmin");
}
function setAspectBtn(val) {
	for (let btn of document.querySelectorAll('[data-aspect-ratio]')) {
		btn.dataset.active = 0;
	}
	let activeBtn = document.querySelector(`[data-aspect-ratio="${val}"]`);
	activeBtn.dataset.active = 1;
}
function resetCanvasAspectRatio() {
	const root = document.querySelector('html');
	root.style.setProperty('--output-width', "100vmin");
	root.style.setProperty('--output-height', "75vmin");
	setAspectBtn('4:3');
}

let canvasXPosition = 0;
function setCanvasXPosition(val) {
	canvasXPosition = val;
	const root = document.querySelector('html');
	root.style.setProperty('--canvas-x-position', val + "%");

	// Update label
	const label = document.querySelector('[for="canvas-x-position"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="canvas-x-position"]');
	slider.value = val;
}
function overrideCanvasXPosition(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--canvas-x-position', val + "%");
	const slider = document.querySelector('[name="canvas-x-position"]');
	slider.value = val;
	const label = document.querySelector('[for="canvas-x-position"]');
	label.innerText = val;
}
function resetCanvasXPosition() {
	canvasXPosition = 0;
	const root = document.querySelector('html');
	root.style.setProperty('--canvas-x-position', "0%");
	const slider = document.querySelector('[name="canvas-x-position"]');
	slider.value = 0;
	const label = document.querySelector('[for="canvas-x-position"]');
	label.innerText = 0;
}

let canvasYPosition = 0;
function setCanvasYPosition(val) {
	canvasYPosition = val;
	const root = document.querySelector('html');
	root.style.setProperty('--canvas-y-position', val + "%");

	// Update label
	const label = document.querySelector('[for="canvas-y-position"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="canvas-y-position"]');
	slider.value = val;
}
function overrideCanvasYPosition(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--canvas-y-position', val + "%");
	const slider = document.querySelector('[name="canvas-y-position"]');
	slider.value = val;
	const label = document.querySelector('[for="canvas-y-position"]');
	label.innerText = val;
}
function resetCanvasYPosition() {
	canvasYPosition = 0;
	const root = document.querySelector('html');
	root.style.setProperty('--canvas-y-position', "0%");
	const slider = document.querySelector('[name="canvas-y-position"]');
	slider.value = 0;
	const label = document.querySelector('[for="canvas-y-position"]');
	label.innerText = 0;
}

let canvasScale = 1;
function setCanvasScale(val) {
	canvasScale = val;
	const root = document.querySelector('html');
	root.style.setProperty('--canvas-scale', val);

	// Update label
	const label = document.querySelector('[for="canvas-scale"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="canvas-scale"]');
	slider.value = val;
}
function overrideCanvasScale(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--canvas-scale', val);
	const slider = document.querySelector('[name="canvas-scale"]');
	slider.value = val;
	const label = document.querySelector('[for="canvas-scale"]');
	label.innerText = val;
}
function resetCanvasScale() {
	canvasScale = 1;
	const root = document.querySelector('html');
	root.style.setProperty('--canvas-scale', "1");
	const slider = document.querySelector('[name="canvas-scale"]');
	slider.value = 1;
	const label = document.querySelector('[for="canvas-scale"]');
	label.innerText = 1;
}

let canvasRadius = 12;
let canvasRadiusUnits = 'px';
function setCanvasRadius(val) {
	canvasRadius = val;
	const root = document.querySelector('html');
	root.style.setProperty('--canvas-radius', val + canvasRadiusUnits);

	// Update label
	const label = document.querySelector('[for="canvas-radius"]');
	label.innerText = val;

	// Update slider
	const slider = document.querySelector('[name="canvas-radius"]');
	slider.value = val;
}
function setCanvasRadiusUnits(val) {
	canvasRadiusUnits = val;
	const root = document.querySelector('html');
	root.style.setProperty('--canvas-radius', canvasRadius + canvasRadiusUnits);

	// Active btn
	for (let btn of document.querySelectorAll('[data-corner-radius-units]')) {
		btn.dataset.active = 0;
	}
	let activeBtn = document.querySelector(`[data-corner-radius-units="${val}"]`);
	activeBtn.dataset.active = 1;
}
function overrideCanvasRadius(val) {
	const root = document.querySelector('html');
	root.style.setProperty('--canvas-radius', val + canvasRadiusUnits);
	const slider = document.querySelector('[name="canvas-radius"]');
	slider.value = val;
	const label = document.querySelector('[for="canvas-radius"]');
	label.innerText = val;
}
function resetCanvasRadius() {
	setCanvasRadius(12);
	setCanvasRadiusUnits('px');
}
function resetCanvasPosition() {
	resetCanvasXPosition();
	resetCanvasYPosition();
	resetCanvasScale();
}
function resetCanvasSettings() {
	resetCanvasAspectRatio();
	resetCanvasXPosition();
	resetCanvasYPosition();
	resetCanvasScale();
	resetCanvasRadius();
}

// Mouse controls for canvas
document.querySelector('.output-container').addEventListener('wheel', (e) => {
	e.preventDefault();
	if (e.ctrlKey) {
		canvasScale -= e.deltaY/100;
		if (canvasScale > 3) {
			canvasScale = 3;
		} else if (canvasScale < .25) {
			canvasScale = .25;
		}
		overrideCanvasScale(canvasScale.toFixed(2));
	} else {
		canvasXPosition -= e.deltaX/10;
		canvasYPosition -= e.deltaY/10;
		if (canvasXPosition > 100) {
			canvasXPosition = 100;
		} else if (canvasXPosition < -100) {
			canvasXPosition = -100;
		}
		if (canvasYPosition > 100) {
			canvasYPosition = 100;
		} else if (canvasYPosition < -100) {
			canvasYPosition = -100;
		}
		overrideCanvasXPosition(canvasXPosition.toFixed(1));
		overrideCanvasYPosition(canvasYPosition.toFixed(1));
	}
}, {passive: false})

// Collapse sections
function collapseSection(section) {
	let elmnt = document.querySelector(`#${section}`);
	if (parseInt(elmnt.dataset.collapsed) == 1) {
		elmnt.dataset.collapsed = 0;
	} else {
		elmnt.dataset.collapsed = 1;
	}
}
function collapseAll() {
	for (let controlsSection of document.querySelectorAll('.controls-section')) {
		if (controlsSection.id == 'header') {
			continue
		}
		controlsSection.dataset.collapsed = 1;
	}
}
function expandAll() {
	for (let controlsSection of document.querySelectorAll('.controls-section')) {
		controlsSection.dataset.collapsed = 0;
	}
}

// All settings
function resetAll() {
	resetBackgroundSettings();
	resetBubbleSettings();
	resetTextSettings();
	resetAnnotationTopSettings();
	resetAnnotationBottomSettings();
	resetCanvasSettings();
}
function randomizeAll() {
	randomizeBackgroundSettings();
	randomizeBubbleSettings();
	randomizeTextSettings();
	randomizeAnnotationTopSettings();
	randomizeAnnotationBottomSettings();
}