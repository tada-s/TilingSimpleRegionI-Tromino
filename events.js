/* 
 * This javascript handles the input from web browser events.
 */

window.onload = eventInitialize;

// Mouse Corrdinates
var mouse = {
	x: 0,
	y: 0,
	lastX: 0,
	lastX: 0,
	boardX: 0,
	boardY: 0,
	clickPressed: false
};
// Textbox
var elementInputText;
// Canvas
var elementCanvas;

/*** Event Initialize ***/
function eventInitialize(){
	elementInputText = document.getElementById("inputText");
	elementInputText.addEventListener("input", eventInputText);

	var elementButtonCompute = document.getElementById("buttonCompute");
	elementButtonCompute.addEventListener("click", eventButtonComputePress);
	var elementButtonInitialize = document.getElementById("buttonInitialize");
	elementButtonInitialize.addEventListener("click", eventButtonInitializePress);
	var elementButtonStep = document.getElementById("buttonStep");
	elementButtonStep.addEventListener("click", eventButtonStepPress);
	var elementButtonEdit = document.getElementById("buttonEdit");
	elementButtonEdit.addEventListener("click", eventButtonEditPress);
	var elementButtonShowBoundary = document.getElementById("buttonShowBoundary");
	elementButtonShowBoundary.addEventListener("click", eventButtonShowBoundaryPress);

	elementCanvas = document.getElementById("canvasMain");
	elementCanvas.addEventListener("mousedown", eventMouseDown);
	elementCanvas.addEventListener("mouseup", eventMouseUp);
	elementCanvas.addEventListener("mousemove", eventMouseMove);
	
	initDraw();
	bR = elementInputText.value;
	initializeBoundary();
	draw();
}

/*** Input text ***/
function eventInputText(evt){
	bR = elementInputText.value;
	initializeBoundary();
	draw();
}

/*** Button Press ***/
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

function eventButtonEditPress(evt){
	initializeBoundary();
	if(editMode){
		editMode = false;
	}else{
		editMode = true;
	}
	draw();
}

function eventButtonShowBoundaryPress(evt){
	showBoundaryInfo = !showBoundaryInfo;
	draw();
}

/*** Event Mouse Down ***/

function eventMouseDown(evt){
	updateMouseCoord(evt);
	
	if(editMode){
		var clickRadio = 0.5;
		var p = getBoundaryLastPoint();
		var dx = p.x - mouse.boardX;
		var dy = p.y - mouse.boardY;
		if(dx * dx + dy * dy <= clickRadio * clickRadio){
			isLastPointSelected = true;
		}
	}
	draw();
}

/*** Event Mouse Up ***/

function eventMouseUp(evt){
	updateMouseCoord(evt);
	
	isLastPointSelected = false;
	draw();
}

/*** Event Mouse Move ***/

function eventMouseMove(evt){
	updateMouseCoord(evt);
	
	if(mouse.clickPressed){
		if(isLastPointSelected){
			var p = getBoundaryLastPoint();
			var targetP = {x:Math.round(mouse.boardX), y:Math.round(mouse.boardY)};
			
			var stepX = Math.sign(targetP.x - p.x);
			var stepY = Math.sign(targetP.y - p.y);
			for(var x = p.x; Math.abs(targetP.x - x) > 0; x += stepX){
				if(stepX > 0){
					bR += "e";
				}else{
					bR += "w";
				}
				var lastWords = bR.substr(bR.length - 2, 2);
				if(lastWords === "ew" || lastWords === "we"){
					bR = bR.substr(0, bR.length - 2);
				}
			}
			for(var y = p.y; Math.abs(targetP.y - y) > 0; y += stepY){
				if(stepY > 0){
					bR += "n";
				}else{
					bR += "s";
				}
				var lastWords = bR.substr(bR.length - 2, 2);
				if(lastWords === "ns" || lastWords === "sn"){
					bR = bR.substr(0, bR.length - 2);
				}
			}
			elementInputText.value = bR;
			if(Math.abs(targetP.x - p.x) > 0 || Math.abs(targetP.y - p.y) > 0){
				initializeBoundary();
			}
		}
		if(editMode){
			
		}else{
			cameraCoord.x += mouse.x - mouse.lastX;
			cameraCoord.y += mouse.y - mouse.lastY;
		}
		draw();
	}
}

/*** Mouse ***/

function updateMouseCoord(evt){
	var m = {x:-1, y:-1};

	m.lastX = mouse.x;
	m.lastY = mouse.y;

	var clientCanvasRect = elementCanvas.getBoundingClientRect();
	scaleX = elementCanvas.width / clientCanvasRect.width,
	scaleY = elementCanvas.height / clientCanvasRect.height;
	m.x = Math.round((evt.clientX - clientCanvasRect.left) * scaleX);
	m.y = Math.round((evt.clientY - clientCanvasRect.top) * scaleY);

	m.boardX = (mouse.x - cameraCoord.x) / unitSize;
	m.boardY = -(mouse.y - cameraCoord.y) / unitSize;

	if(evt.buttons == 0){
		m.clickPressed = false;
	}else{
		m.clickPressed = true;
	}
	
	mouse = m;
}

