/* 
 * This javascript handles the input from web browser events.
 */

window.onload = eventInitialize;
// Textbox
var elementInputText;
// Canvas
var elementCanvas;
// Mouse Corrdinates
var mouse = {
	x: 0,
	y: 0,
	lastX: 0,
	lastX: 0,
	clickPressed: false
};

var baseSelected = false;
var selectedObjectNumber = 0;

/** Event Initialize **/

function eventInitialize(){
	elementInputText = document.getElementById("inputText");

	var elementButtonCompute = document.getElementById("buttonCompute");
	elementButtonCompute.addEventListener("click", eventButtonComputePress);
	var elementButtonInitialize = document.getElementById("buttonInitialize");
	elementButtonInitialize.addEventListener("click", eventButtonInitializePress);
	var elementButtonStep = document.getElementById("buttonStep");
	elementButtonStep.addEventListener("click", eventButtonStepPress);

	elementCanvas = document.getElementById("canvasMain");
	elementCanvas.addEventListener("mousedown", eventMouseDown);
	elementCanvas.addEventListener("mouseup", eventMouseUp);
	elementCanvas.addEventListener("mousemove", eventMouseMove);

	initDraw();
	bR = elementInputText.value;
	computeTiling();
	draw();
}

/** Button Press **/
function eventButtonComputePress(evt){
	bR = elementInputText.value;
	computeTiling();
	draw();
}

function eventButtonInitializePress(evt){
	bR = elementInputText.value;
	initializeBoundary();
	draw();
}

function eventButtonStepPress(evt){
	iterationStep();
	draw();
}

/** Event Mouse Down **/

function eventMouseDown(evt){
	updateMouseCoord(evt);
}

/** Event Mouse Up **/

function eventMouseUp(evt){
	updateMouseCoord(evt);
}

/** Event Mouse Move **/

function eventMouseMove(evt){
	updateMouseCoord(evt);
	if(mouse.clickPressed){
		coordBoardScreenOffX += mouse.x - mouse.lastX;
		coordBoardScreenOffY += mouse.y - mouse.lastY;
		draw();
	}
}

/** Mouse **/

function updateMouseCoord(evt){
	var m = {x:-1, y:-1};

	m.lastX = mouse.x;
	m.lastY = mouse.y;

	var clientCanvasRect = elementCanvas.getBoundingClientRect();
	scaleX = elementCanvas.width / clientCanvasRect.width,
	scaleY = elementCanvas.height / clientCanvasRect.height;
	m.x = Math.round((evt.clientX - clientCanvasRect.left) * scaleX);
	m.y = Math.round((evt.clientY - clientCanvasRect.top) * scaleY);

	if(evt.buttons == 0){
		m.clickPressed = false;
	}else{
		m.clickPressed = true;
	}
	
	mouse = m;
}

