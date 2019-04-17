var bR = "";
var tile = [];
var point = [];
var existTiling = false;

var isBoundaryPoint = [];
var basePointIndex = -1;
var basePoint = -1;
var isTilable = false;

function newPointFrom(p, c){
	var newPoint = {};

	var trieNode = p.trieNode;

	switch(c){
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
	newPoint.lastChar = c;
	newPoint.height = trieNode.alternating;
	return newPoint;
}

function initializeBoundary(){
	tile = [];
	point = [];
	
	isBoundaryPoint = [];
	
	initTrie();
	initPriorityQueue(bR.length);
	
	
	// Create a base point
	basePoint = {};
	basePoint.x = 0;
	basePoint.y = 0;
	basePoint.height = 0;
	//basePoint.ww = "";
	basePoint.trieNode = trie[0];
	basePoint.lastChar = bR.charAt(bR.length - 1);
	basePoint.id = 0;
	point.push(basePoint);
	isBoundaryPoint.push(true);

	// Create points of the boundary
	for(var i = 0; i < bR.length; i++){
		var c = bR.charAt(i);
		point.push(newPointFrom(point[i], c));
		point[i + 1].id = i + 1;
		isBoundaryPoint.push(true);

		point[i].next = point[i + 1].id;
		point[i + 1].prev = point[i].id;
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

		point[0].prev = bR.length - 1;
		point[bR.length - 1].next = 0;
		isBoundaryPoint[bR.length] = false;
		
		for(var i = 0; i < bR.length; i++){
			var i2 = (i + 1) % bR.length;
			if(point[i].height == point[i2].height){
				pushPriorityQueue(point[i2]);
			}
		}
	}
}

function iterationStep(){
	if(!isTilable) return;
	
	// Get the maximum height point
	/*var travelingPoint = basePoint;
	var maxPoint = null;
	var maxHeight = travelingPoint.height;
	do{
		var p = travelingPoint;
		if(maxHeight <= travelingPoint.height){
			maxHeight = travelingPoint.height;
			if(point[travelingPoint.prev].height == maxHeight){
				maxPoint = travelingPoint;
			}
		}
		travelingPoint = point[travelingPoint.next];
	}while(travelingPoint.id != basePoint.id);*/
	var maxPoint = null;
	maxPoint = popPriorityQueue();
	while(true){
		if(isBoundaryPoint[maxPoint.id]){
			var p0 = point[maxPoint.next];
			var p1 = point[p0.prev];
			var p2 = point[p1.prev];
			if(p0.lastChar === p1.lastChar && p1.lastChar === p2.lastChar){
				break;
			}
		}
		maxPoint = popPriorityQueue();
	}
	
	// Get the I-tromino direction
	var tileDirection = point[maxPoint.prev].lastChar;
	
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
		cutPoint1 = point[cutPoint1.prev];
		inverseTileWordIndex1++;
	}

	var inverseTileWordIndex2 = 7;
	var cutPoint2 = maxPoint;
	while(point[cutPoint2.next].lastChar === inverseTileWord.charAt(inverseTileWordIndex2) && inverseTileWordIndex1 < inverseTileWordIndex2){
		isBoundaryPoint[cutPoint2.id] = false;
		cutPoint2 = point[cutPoint2.next];
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
		newPoint.prev = travelingPoint2.id
		travelingPoint2.next = newPoint.id;
		
		if(travelingPoint2.height == newPoint.height){
			pushPriorityQueue(newPoint);
		}
		
		travelingPoint2 = newPoint;
	}
	travelingPoint2.next = cutPoint2.id;
	cutPoint2.prev = travelingPoint2.id;
	cutPoint2.lastChar = tileWord[inverseTileWordIndex2];

	if(travelingPoint2.height == cutPoint2.height){
		pushPriorityQueue(cutPoint2);
	}

	// Update the base point of the boundary to prepare for the next iteration
	basePoint = cutPoint2;
	
	// If the cutPoint meets, the region is a tromino and stop the iteration.
	if(cutPoint1.id == cutPoint2.id){
		isTilable = false;
	}
}

function computeTiling(){
	initializeBoundary();
	var maxIteration = 100;
	while(isTilable){
		iterationStep();
		maxIteration--; if(maxIteration < 0) break;
	}
}

// Height function replaced by trie data structure
/*function height(w){
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
}*/

// The original height function of kenyon
/*function height2(w){
	var n = 0;
	for(; n < w.length; n++){
		var c = w.charAt(n);
		if(!((n % 2 == 0 && c === "a") || (n % 2 == 1 && c === "b"))){
			break;
		}
	}
	
	var a = 0;
	var expectedChar = "-";
	for(var i = n; i < w.length; i++){
		var c = w.charAt(i);
		if(c !== expectedChar){
			expectedChar = c;
			a++;
		}
	}
	return -n + sign * a;
}*/


