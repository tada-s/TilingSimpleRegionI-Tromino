var coordBoardScreenOffX = 200;
var coordBoardScreenOffY = 200;

var unitSize = 50;

function initDraw(){
	inputText = document.getElementById("inputText");
	
	elementCanvas = document.getElementById("canvasMain");
	coordBoardScreenOffX = elementCanvas.width / 2 - 50;
	coordBoardScreenOffY = elementCanvas.height / 2 + 200;
	ctx = elementCanvas.getContext("2d");

	ctx.lineJoin = "round";
	ctx.lineCap = "round";
}

function clearCanvas(){
	ctx.fillStyle = "rgba(255, 255, 255, 1)";
	ctx.fillRect(0, 0, elementCanvas.width, elementCanvas.height);
}

function drawLine(p0, p1){
	ctx.beginPath();
	ctx.moveTo(p0.x * unitSize + coordBoardScreenOffX, -p0.y * unitSize + coordBoardScreenOffY);
	ctx.lineTo(p1.x * unitSize + coordBoardScreenOffX, -p1.y * unitSize + coordBoardScreenOffY);
	ctx.stroke();
}

function drawText(p, text){
	var offX = 3;
	var offY = -3;
	ctx.fillText(text, p.x * unitSize + coordBoardScreenOffX + offX, -p.y * unitSize + coordBoardScreenOffY + offY);
}

function draw(){
	clearCanvas();
	if(!existTiling){
		// draw region boundary
		ctx.strokeStyle = "rgb(255, 0, 0)";
		ctx.lineWidth = 3;
		drawBoundary();

		// draw text
		ctx.fillStyle = "rgba(150, 0, 0, 1)";
		ctx.font = "30px Arial";
		ctx.fillText("Invalid polygon or not tilable", coordBoardScreenOffX-200, coordBoardScreenOffY);
	}else{
		// draw grid
		ctx.strokeStyle = "rgb(220, 220, 220)";
		ctx.lineWidth = 1;
		drawGrid();

		// draw trominoes
		ctx.fillStyle = "rgba(230, 230, 230, 1)";
		ctx.strokeStyle = "rgb(100, 100, 100)";
		ctx.lineWidth = 3;
		drawTrominoes();

		// draw region boundary
		ctx.strokeStyle = "rgb(0, 0, 0)";
		ctx.lineWidth = 3;
		drawBoundary();

		// draw height
		ctx.fillStyle = "rgba(0, 150, 150, 1)";
		ctx.font = "15px Arial";
		drawHeight();
	}
}

function drawGrid(){
	var lbX = Math.round((-coordBoardScreenOffX) / unitSize) - 1;
	var ubX = Math.round((-coordBoardScreenOffX + elementCanvas.width ) / unitSize) + 1;
	var lbY = Math.round((coordBoardScreenOffY - elementCanvas.height) / unitSize) - 1;
	var ubY = Math.round((coordBoardScreenOffY) / unitSize) + 1;
	for(var x = lbX; x <= ubX; x++){
		drawLine({x:x, y:lbY}, {x:x, y:ubY});
	}
	for(var y = lbY; y <= ubY; y++){
		drawLine({x:lbX, y:y}, {x:ubX, y:y});
	}
}

function drawBoundary(){
	var p = {x: 0, y:0};
	for(var j = 0; j < bR.length; j++){
		var lastP = {x: p.x, y:p.y};
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
		drawLine(lastP, p);
	}
}

function drawHeight(){
	for(var i = 0; i < point.length; i++){
		var p = point[i];
		drawText(p, "" + p.height);
	}
}

function drawTrominoes(){
	for(var i = 0; i < tile.length; i++){
		var t = tile[i];
		var tileWord = "";
		switch(t.direction){
			case "s":
				tileWord = "sennnwss";
				break;
			case "n":
				tileWord = "nwsssenn";
				break;
			case "e":
				tileWord = "enwwwsee";
				break;
			case "w":
				tileWord = "wseeenww";
				break;
		}
		var p = {x: t.origin.x, y:t.origin.y};
		ctx.beginPath();
		ctx.moveTo(p.x * unitSize + coordBoardScreenOffX, -p.y * unitSize + coordBoardScreenOffY);
		for(var j = 0; j < 8; j++){
			var lastP = {x: p.x, y:p.y};
			var c = tileWord.charAt(j);
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
			ctx.lineTo(p.x * unitSize + coordBoardScreenOffX, -p.y * unitSize + coordBoardScreenOffY);
		}
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
}
