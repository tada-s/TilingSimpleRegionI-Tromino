
function initDraw(){
	var elementCanvas = document.getElementById("canvasMain");
	cameraCoord.x = elementCanvas.width / 2;
	cameraCoord.y = elementCanvas.height / 2;
	ctx = elementCanvas.getContext("2d");

	ctx.lineJoin = "round";
	ctx.lineCap = "round";
}

/* Main drawing function */

function draw(){
	clearCanvas();
	
	if(editMode){
		// draw grid
		ctx.strokeStyle = "rgb(240, 240, 240)";
		ctx.lineWidth = 1;
		drawGrid();

		// draw region boundary
		ctx.lineWidth = 5;
		if(existTiling){
			ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
		}else{
			ctx.strokeStyle = "rgba(255, 0, 0, 0.3)";
		}
		drawBoundary();
		
		// draw movable boundary last point
		ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
		drawEndPoint();
		
		// draw height
		ctx.fillStyle = "rgba(0, 150, 150, 1)";
		ctx.font = "15px Arial";
		drawHeight();
	}else{
		if(existTiling){
			// draw grid
			ctx.strokeStyle = "rgb(240, 240, 240)";
			ctx.lineWidth = 1;
			drawGrid();

			// draw trominoes
			ctx.fillStyle = "rgba(230, 230, 230, 1)";
			ctx.strokeStyle = "rgb(100, 100, 100)";
			ctx.lineWidth = 3;
			drawTrominoes();
			
			if(showBoundaryInfo){
				// draw height
				ctx.fillStyle = "rgba(0, 150, 150, 1)";
				ctx.font = "15px Arial";
				drawHeight();
				
				// draw boundary color
				drawCurrentBoundary();
			}else{
				// draw region boundary
				ctx.strokeStyle = "rgb(0, 0, 0)";
				ctx.lineWidth = 3;
				drawBoundary();
			}
		}else{
			// draw grid
			ctx.strokeStyle = "rgb(240, 240, 240)";
			ctx.lineWidth = 1;
			drawGrid();
			
			// draw region boundary
			ctx.strokeStyle = "rgb(255, 0, 0)";
			ctx.lineWidth = 3;
			drawBoundary();
			
			// draw text
			ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
			drawRectangle({x:-4, y:1}, {x:4, y:0});
			ctx.fillStyle = "rgba(150, 0, 0, 1)";
			ctx.font = "30px Arial";
			ctx.fillText(errorString, cameraCoord.x - 195, cameraCoord.y - 15);
		}
	}
}

/* Primitive drawing function */

function clearCanvas(){
	ctx.fillStyle = "rgba(255, 255, 255, 1)";
	ctx.fillRect(0, 0, elementCanvas.width, elementCanvas.height);
}

function drawLine(p0, p1){
	ctx.beginPath();
	ctx.moveTo(p0.x * unitSize + cameraCoord.x, -p0.y * unitSize + cameraCoord.y);
	ctx.lineTo(p1.x * unitSize + cameraCoord.x, -p1.y * unitSize + cameraCoord.y);
	ctx.stroke();
}

function drawGradientLine(p0, p1, c1, c2){
	var x0 = p0.x * unitSize + cameraCoord.x;
	var y0 = -p0.y * unitSize + cameraCoord.y;
	var x1 = p1.x * unitSize + cameraCoord.x;
	var y1 = -p1.y * unitSize + cameraCoord.y;
	var grad = ctx.createLinearGradient(x0, y0, x1, y1);
	grad.addColorStop(0, c1);
	grad.addColorStop(1, c2);
	ctx.strokeStyle = grad;
	ctx.beginPath();
	ctx.moveTo(x0, y0);
	ctx.lineTo(x1, y1);
	ctx.stroke();
}

function drawText(p, text){
	var offX = 3;
	var offY = -3;
	ctx.fillText(text, p.x * unitSize + cameraCoord.x + offX, -p.y * unitSize + cameraCoord.y + offY);
}

function drawCircle(p, radius){
	ctx.beginPath();
	ctx.arc(p.x * unitSize + cameraCoord.x, -p.y * unitSize + cameraCoord.y, radius, 0, 2 * Math.PI, false);
	ctx.fill();
}

function drawRectangle(p1, p2){
	var x1 = p1.x * unitSize + cameraCoord.x;
	var x2 = p2.x * unitSize + cameraCoord.x;
	var y1 = -p1.y * unitSize + cameraCoord.y;
	var y2 = -p2.y * unitSize + cameraCoord.y;
	ctx.fillRect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x1 - x2), Math.abs(y1 - y2));
}

/**/
function drawGrid(){
	var lbX = Math.round((-cameraCoord.x) / unitSize) - 1;
	var ubX = Math.round((-cameraCoord.x + elementCanvas.width ) / unitSize) + 1;
	var lbY = Math.round((cameraCoord.y - elementCanvas.height) / unitSize) - 1;
	var ubY = Math.round((cameraCoord.y) / unitSize) + 1;
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

function drawEndPoint(){
	var p = getBoundaryLastPoint();
	if(bR.length != 0){
		var lastChar = bR.charAt(bR.length - 1);
		
		var p1;
		var p2;
		switch(lastChar){
		case "e":
			p1 = {x:-0.3, y: 0.2};
			p2 = {x:-0.3, y:-0.2};
			break;
		case "w":
			p1 = {x: 0.3, y: 0.2};
			p2 = {x: 0.3, y:-0.2};
			break;
		case "n":
			p1 = {x:-0.2, y:-0.3};
			p2 = {x: 0.2, y:-0.3};
			break;
		case "s":
			p1 = {x:-0.2, y: 0.3};
			p2 = {x: 0.2, y: 0.3};
			break;
		}
		p1.x += p.x;
		p1.y += p.y;
		p2.x += p.x;
		p2.y += p.y;
		drawLine(p1, p);
		drawLine(p, p2);
	}
	drawCircle(p, 10);
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
		ctx.moveTo(p.x * unitSize + cameraCoord.x, -p.y * unitSize + cameraCoord.y);
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
			ctx.lineTo(p.x * unitSize + cameraCoord.x, -p.y * unitSize + cameraCoord.y);
		}
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
}

function drawCurrentBoundary(){
	if(bR.length == 0) return;
	
	var maxHeight = 0;
	for(var i = 0; i < point.length; i++){
		if(isBoundaryPoint[i]){
			maxHeight = Math.max(maxHeight, point[i].height);
		}
	}
	for(var i = 0; i < point.length; i++){
		if(isBoundaryPoint[i]){
			var p1 = point[i];
			var p2 = point[i].next;
			var color1 = "rgb(0, 100, 0)";
			var color2 = "rgb(0, 100, 0)";
			if(p1.height == maxHeight){
				color1 = "rgb(0, 255, 0)";
			}
			if(p2.height == maxHeight){
				color2 = "rgb(0, 255, 0)";
			}
			drawGradientLine(p1, p2, color1, color2);
		}
	}
}

