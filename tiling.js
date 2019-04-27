//eeeneeeneeeneeeneeenwwwswwwswwwswwwneeeneeeneeenwwwswwwswwwswwwseeeswwws
var isBoundaryPoint = [];
var basePointIndex = -1;
var basePoint = {};

var iterationCounter = 0;
var maximumIterationCounter = 0;

// Main algorithm loop
function computeTiling(){
	initializeBoundary();
	var maxIteration = 500;
	while(isTilable){
		iterationStep();
		if(maxIteration-- < 0) break;
	}
	
	// Check if there is two different height in one point
	// This is done in O(n log n). I couldn't figure out how to do it in O(n).
	point.sort(function (p1, p2) {
		if(p1.x - p2.x == 0){
			if(p1.y - p2.y == 0){
				return p1.heigth - p2.heigth;
			}
			return p1.y - p2.y;
		}
		return p1.x - p2.x;
	});
	for(var i = 0; i + 1 < point.length; i++){
		if(point[i].x == point[i + 1].x && point[i].y == point[i + 1].y && point[i].height != point[i + 1].height){
			existTiling = false;
			isTilable = false;
		}
	}
}

// Algorithm initialization
function initializeBoundary(){
	tile = [];
	point = [];
	
	initTrie();
	isBoundaryPoint = [];
	
	initPriorityQueue(bR.length);
	
	
	// Create a base point
	basePoint = {};
	basePoint.x = 0;
	basePoint.y = 0;
	basePoint.height = 0;
	basePoint.trieNode = trie[0];
	basePoint.lastChar = bR.charAt(bR.length - 1);
	basePoint.id = 0;
	point.push(basePoint);
	isBoundaryPoint.push(true);
	
	if(bR.length == 0){
		existTiling = true;
		isTilable = false;
		return;
	}
	
	// Create points of the boundary
	for(var i = 0; i < bR.length; i++){
		var c = bR.charAt(i);
		point.push(newPointFrom(point[i], c));
		point[i + 1].id = i + 1;
		isBoundaryPoint.push(true);

		point[i].next = point[i + 1];
		point[i + 1].prev = point[i];
	}
	
	// If the boundary cannot close into a loop
	if(!(point[0].x == point[bR.length].x && point[0].y == point[bR.length].y) || point[bR.length].height != 0){
		// Then, there is no tiling for the region
		existTiling = false;
		isTilable = false;
	}else{
		// Otherwise, close the loop and prepare for the iteration
		existTiling = true;
		isTilable = true;

		iterationCounter = 0;
		maximumIterationCounter = getArea() / 3;
		
		point[0].prev = point[bR.length - 1];
		point[bR.length - 1].next = point[0];
		isBoundaryPoint[bR.length] = false;
		
		for(var i = 0; i < bR.length; i++){
			var i2 = (i + 1) % bR.length;
			if(point[i].height == point[i2].height){
				pushPriorityQueue(point[i2]);
			}
		}
	}
}

// Algorithm iteration
function iterationStep(){
	if(!isTilable) return;
	
	// Get the maximum height point
	var maxPoint = null;
	maxPoint = popPriorityQueue();
	while(true){
		if(isBoundaryPoint[maxPoint.id]){
			var p0 = maxPoint.next;
			var p1 = p0.prev;
			var p2 = p1.prev;
			if(p0.lastChar === p1.lastChar && p1.lastChar === p2.lastChar){
				break;
			}
		}
		maxPoint = popPriorityQueue();
	}
	
	// Get the I-tromino direction
	var tileDirection = maxPoint.prev.lastChar;
	
	// Save the I-tromino information
	tile.push({direction:tileDirection, origin:{x:maxPoint.x, y:maxPoint.y}});
	
	// Update the boundary

	// Boundary cutting information:
	var inverseTileWord = "";
	var tileWord = "";
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
	
	// Get two points of the boundary {cutIndex1, cutIndex2} to cut and insert a new path.
	var inverseTileWordIndex1 = 0;
	var cutPoint1 = maxPoint;
	while(cutPoint1.lastChar === inverseTileWord.charAt(inverseTileWordIndex1) && inverseTileWordIndex1 < 8){
		isBoundaryPoint[cutPoint1.id] = false;
		cutPoint1 = cutPoint1.prev;
		inverseTileWordIndex1++;
	}

	var inverseTileWordIndex2 = 7;
	var cutPoint2 = maxPoint;
	while(cutPoint2.next.lastChar === inverseTileWord.charAt(inverseTileWordIndex2) && inverseTileWordIndex1 < inverseTileWordIndex2){
		isBoundaryPoint[cutPoint2.id] = false;
		cutPoint2 = cutPoint2.next;
		inverseTileWordIndex2--;
	}
	
	// Cut and insert a new path.
	var travelingPoint2 = cutPoint1;
	for(var i = inverseTileWordIndex1; i < inverseTileWordIndex2; i++){
		var c = tileWord[i];

		// Create a new point from travelingPoint2 in direction of c
		var newPoint = newPointFrom(travelingPoint2, c)
		newPoint.id = point.length;
		point.push(newPoint);
		isBoundaryPoint.push(true);
		
		// Link the new point to travelingPoint2
		newPoint.prev = travelingPoint2;
		travelingPoint2.next = newPoint;
		
		if(travelingPoint2.height == newPoint.height){
			pushPriorityQueue(newPoint);
		}
		
		travelingPoint2 = newPoint;
	}
	travelingPoint2.next = cutPoint2;
	cutPoint2.prev = travelingPoint2;
	cutPoint2.lastChar = tileWord[inverseTileWordIndex2];

	if(travelingPoint2.height == cutPoint2.height){
		pushPriorityQueue(cutPoint2);
	}
	
	// Remove degenerated boundary
	var degeneratedBoundary;
	do{
		degeneratedBoundary = false;
		var pairChar = cutPoint2.lastChar + cutPoint2.next.lastChar;
		if(pairChar === "ns" || pairChar === "sn" || pairChar === "ew" || pairChar === "we"){
			var p0 = cutPoint2.prev;
			var p1 = p0.next;
			var p2 = p1.next;
			var p3 = p2.next;
			isBoundaryPoint[p1.id] = false;
			isBoundaryPoint[p2.id] = false;
			p0.next = p3;
			p3.prev = p0;
			cutPoint2 = p0;
			degeneratedBoundary = true;
		}
	}while(degeneratedBoundary);

	// Update the base point of the boundary to prepare for the next iteration
	basePoint = cutPoint2;

	// Iteration halts if is added a sufficient number of trominoes.
	iterationCounter++;
	if(!(iterationCounter < maximumIterationCounter)){
		isTilable = false;
		return;
	}
}

// Create a new point from point "p" in the direction "dir"
function newPointFrom(p, dir){
	var newPoint = {};


	var trieNode = p.trieNode;

	switch(dir){
	case "e":
		newPoint.x = p.x + 1;
		newPoint.y = p.y;
		trieNode = addTrieNode(trieNode, "a");
		//newPoint.ww = p.ww + "a";
		break;
	case "w":
		newPoint.x = p.x - 1;
		newPoint.y = p.y;
		trieNode = addTrieNode(trieNode, "a");
		trieNode = addTrieNode(trieNode, "a");
		break;
	case "n":
		newPoint.x = p.x;
		newPoint.y = p.y + 1;
		trieNode = addTrieNode(trieNode, "b");
		break;
	case "s":
		newPoint.x = p.x;
		newPoint.y = p.y - 1;
		trieNode = addTrieNode(trieNode, "b");
		trieNode = addTrieNode(trieNode, "b");
		break;
	}
	
	if(trieNode.chain >= 3){
		for(var i = 0; i < 3; i++){
			trieNode = trieNode.parent;
		}
	}
	newPoint.trieNode = trieNode;
	
	newPoint.lastChar = dir;
	newPoint.height = trieNode.alternating;
	return newPoint;
}

// Height function
function height(w){
	var a = 0;
	var expectedChar = "-";
	for(var i = 0; i < w.length; i++){
		var c = w.charAt(i);
		if(c !== expectedChar){
			expectedChar = c;
			a++;
		}
	}
	return a;
}

// Area of the region
function getArea(){
	var lastP = {x: 0, y:0};
	var p = {x: 0, y:0};
	var area = 0;
	for(var j = 0; j < bR.length; j++){
		var c = bR.charAt(j);
		
		lastP.x = p.x;
		lastP.y = p.y;
		
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
		
		area += lastP.x * p.y - p.x * lastP.y;
	}
	return Math.abs(area / 2);
}

