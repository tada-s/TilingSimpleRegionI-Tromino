var bR = "";
var tile = [];
var point = [];
var existTiling = false;

var pointIndex;
var isTilable;
var INF = 99999;

 
function newPointFrom(p, c){
	var newPoint = {};
	switch(c){
	case "e":
		newPoint.x = p.x + 1;
		newPoint.y = p.y;
		newPoint.w = p.w + "e";
		newPoint.ww = p.ww + "a";
		break;
	case "w":
		newPoint.x = p.x - 1;
		newPoint.y = p.y;
		newPoint.w = p.w + "w";
		newPoint.ww = p.ww + "aa";
		break;
	case "n":
		newPoint.x = p.x;
		newPoint.y = p.y + 1;
		newPoint.w = p.w + "n";
		newPoint.ww = p.ww + "b";
		break;
	case "s":
		newPoint.x = p.x;
		newPoint.y = p.y - 1;
		newPoint.w = p.w + "s";
		newPoint.ww = p.ww + "bb";
		break;
	}
	var ww = newPoint.ww;
	if(ww.length >= 3 && (ww.substr(ww.length - 3, 3) === "aaa" || ww.substr(ww.length - 3, 3) === "bbb")){
		ww = ww.substr(0, ww.length - 3);
	}
	newPoint.ww = ww;
	newPoint.lastChar = c;
	newPoint.height = height(newPoint.ww);
	return newPoint;
}

function initializeBoundary(){
	tile = [];
	point = [];
	point.push({});
	point[0].x = 0;
	point[0].y = 0;
	point[0].height = 0;
	point[0].w = "";
	point[0].ww = "";
	point[0].lastChar = bR.charAt(bR.length - 1);
	for(var i = 0; i < bR.length; i++){
		var c = bR.charAt(i);
		point.push(newPointFrom(point[i], c));
		point[i].next = i + 1;
		point[i + 1].prev = i;
	}
	
	if(!(point[0].x == point[bR.length].x && point[0].y == point[bR.length].y) || point[bR.length].height != 0){
		existTiling = false;
	}else{
		existTiling = true;
		point[0].prev = bR.length - 1;
		point[bR.length - 1].next = 0;
		
		pointIndex = 0;
		
		
		isTilable = true;
	}
}

function iterationStep(){
		if(!isTilable) return;
	
		var maxPointIndex = -1;
		var maxPoint = null;
		var maxHeight = -INF;
		var initialPointIndex = pointIndex;
		do{
			var p = point[pointIndex];
			if(maxHeight <= p.height){
				maxHeight = p.height;
				if(point[p.prev].height == maxHeight){
					maxPointIndex = pointIndex;
					maxPoint = p;
				}
			}
			pointIndex = p.next;
		}while(pointIndex != initialPointIndex);
		
		var tileDirection = point[maxPoint.prev].lastChar;

		tile.push({direction:tileDirection, origin:{x:maxPoint.x, y:maxPoint.y}});

		var inverseWord = "";
		switch(tileDirection){
		case "s":
			inverseTileWord = "sswnnnes";
			tileWord = "nnessswn";
			break;
		case "n":
			inverseTileWord = "nnessswn";
			tileWord = "sswnnnes";
			break;
		case "e":
			inverseTileWord = "eeswwwne";
			tileWord = "wwneeesw";
			break;
		case "w":
			inverseTileWord = "wwneeesw";
			tileWord = "eeswwwne";
			break;
		}
		
		var inverseTileWordIndex1 = 0;
		var cutIndex1 = maxPointIndex;
		var inverseTileWordIndex2 = 7;
		var cutIndex2 = maxPointIndex;

		while(point[cutIndex1].lastChar === inverseTileWord.charAt(inverseTileWordIndex1)){
			cutIndex1 = point[cutIndex1].prev;
			inverseTileWordIndex1++;
		}

		while(point[point[cutIndex2].next].lastChar === inverseTileWord.charAt(inverseTileWordIndex2)){
			cutIndex2 = point[cutIndex2].next;
			inverseTileWordIndex2--;
		}

		var lastPointIndex = cutIndex1;
		for(var i = inverseTileWordIndex1; i < inverseTileWordIndex2; i++){
			var c = tileWord[i];

			var newPointIndex = point.length;
			point.push(newPointFrom(point[lastPointIndex], c));
			point[newPointIndex].prev = lastPointIndex
			point[lastPointIndex].next = newPointIndex;

			lastPointIndex = newPointIndex;
		}
		point[lastPointIndex].next = cutIndex2;
		point[cutIndex2].prev = lastPointIndex;
		point[cutIndex2].lastChar = tileWord[inverseTileWordIndex2];

		pointIndex = cutIndex2;
		
		if(cutIndex1 == cutIndex2){
			
			isTilable = false;
		}
}

function computeTiling(){
	initializeBoundary();
	var kk = 100;
	while(isTilable){
		/*console.log("----------------");
		for(var i = 0; i < point.length; i++){
			console.log("" + i + "\tPrev: " + point[i].prev + " \tNext: " + point[i].next + " \tHeight: " + point[i].height + "\tWord: " + point[i].w + "\tWWord: " + point[i].ww);
		}
		console.log("----------------");*/
		iterationStep();
		kk--; if(kk == 0) break;
	}

	/*console.log("----------------");
	for(var i = 0; i < point.length; i++){
		console.log("" + i + "\tPrev: " + point[i].prev + " \tNext: " + point[i].next + " \tHeight: " + point[i].height + "\tWord: " + point[i].w + "\tWWord: " + point[i].ww);
	}
	console.log("----------------");*/
}

function height(w){
	var n = 0;
	for(; n < w.length; n++){
		var c = w.charAt(n);
		if(!((n % 2 == 0 && c === "a") || (n % 2 == 1 && c === "b"))){
			break;
		}
	}
	
	var sign = 1;
	var a = 0;
	var expectedChar = "-";
	if(n == 0 && w.length > 0 && w.charAt(0) === "b"){
		sign = 1;
	}
	for(var i = n; i < w.length; i++){
		var c = w.charAt(i);
		if(c !== expectedChar){
			expectedChar = c;
			a++;
		}
	}
	return -n + sign * a;
}


