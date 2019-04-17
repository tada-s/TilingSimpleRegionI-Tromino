/* Trie data structure */
// O(1) to compute the values of height function
var trie = [];

function initTrie(){
	var root = {};
	root.char = '-';
	root.alternating = 0;
	root.chain = 0;
	root.parent = null;
	root.id = 0;

	trie = [root];
}

function addTrieNode(node, c){
	var newNode = {};
	newNode.char = c;
	if(node.char === c){
		newNode.chain = node.chain + 1;
		newNode.alternating = node.alternating
	}else{
		newNode.chain = 1;
		newNode.alternating = node.alternating + 1;
	}
	newNode.parent = node;
	newNode.id = trie.length;
	
	trie.push(newNode);
	
	return newNode;
}

/* Priority Queue data structure */
// Amortized O(1) to get the highest point
var priorityQueue = [];
var priorityQueueHeader = -1;
function initPriorityQueue(n){
	priorityQueue = [];
	for(var i = 0; i < n; i++){
		priorityQueue.push([]);
	}
	priorityQueueHeader = n - 1;
}

function pushPriorityQueue(p){
//console.log(p);
	var index = p.height;
	priorityQueue[index].push(p);
}

function popPriorityQueue(){
	priorityQueueHeader = Math.min(priorityQueueHeader + 4, priorityQueue.length - 1);
	while(priorityQueue[priorityQueueHeader].length == 0){
		priorityQueueHeader--;
		if(priorityQueueHeader < 0){
			return null;		
		}
	}
	//console.log(priorityQueueHeader);
	return priorityQueue[priorityQueueHeader].pop();
}

