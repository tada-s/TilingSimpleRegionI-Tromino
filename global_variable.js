/*** Constant ***/
var unitSize = 50;

/*** Variables ***/

// events.js, draw.js
var editMode = false;
var cameraCoord = {x: 200, y:200};
var showBoundaryInfo = false;

var isLastPointSelected = false;
var selectedObjectNumber = 0;

var errorString = "";

// events.js, draw.js, tiling.js
var bR = "";
var tile = [];
var point = [];
var existTiling = false;
var isTilable = false;

/*** Functions ***/

function getBoundaryLastPoint(){
	var p = {x: 0, y:0};
	for(var j = 0; j < bR.length; j++){
		var c = bR.charAt(j);
		switch(c){
		case "e":
			p.x = p.x + 1;
			break;
		case "w":
			p.x = p.x - 1;
			break;
		case "n":
			p.y = p.y + 1;
			break;
		case "s":
			p.y = p.y - 1;
			break;
		}
	}
	return p;
}


