//#pragma strict
// upon being instantiated, creates the maze, unlocks the mouse, and freezes player rotation (for this version)
// closes maze if player moves away
// vr version will need to not interfere with movement.

var player : GameObject;
var wallPrefab : GameObject;
var repairPointer : GameObject;

var mazeSteps : int = 20;
var edgeSize : int = 4;
var zOffset : float = 5;

var leftMost : Vector2 = Vector2.zero;
var rightMost : Vector2 = Vector2.zero;
var topMost : Vector2 = Vector2.zero;
var bottomMost : Vector2 = Vector2.zero;
var currentPosition : Vector2 = Vector2.zero;
var path : Vector2[] = new Vector2[mazeSteps];

function Start () {
	player = GameObject.FindGameObjectWithTag("Player");
	
	// unlock cursor
	Screen.lockCursor = false;
	
	// freeze rotation
	player.GetComponent("FirstPersonController").enabled = false;
	
	// generate maze
	GenerateMaze(mazeSteps);
}

function GenerateMaze ( steps : int) {
	
	path[0] = currentPosition;
	
	for (var k = 1; k < steps; k++) {
		if (!TakeStep(k,0)) {break;}
	}
	
	// after creation of the path, create the visual representation of it.
	// for maze to be complete, all path squares must be filled.
	var width : int = Vector2.Distance(leftMost, rightMost) + edgeSize;
	var height : int = Vector2.Distance(bottomMost, topMost) + edgeSize;
	Debug.Log("Making maze of width: " + width + " and height: " + height);
	
	for (var i : int = leftMost.x - (edgeSize/2); i < width + leftMost.x; i++) {
		for (var j : int = bottomMost.y - (edgeSize/2); j < height + bottomMost.y; j++) {
			var newWall : GameObject = Instantiate(wallPrefab, Vector3.zero, transform.rotation);
			newWall.transform.parent = transform;
			newWall.transform.localPosition = Vector3(i,j,zOffset);
			
			if (ArrayUtility.Contains(path, Vector2(i,j))) {
				newWall.GetComponent(MeshRenderer).enabled = false;
			}
			
		}
	}
}

function CheckRelativePosition (position : Vector2) {
	if (position.x < leftMost.x) {leftMost = position;}
	if (position.y < bottomMost.y) {bottomMost = position;}
	if (position.x > rightMost.x) {rightMost = position;}
	if (position.y > topMost.y) {topMost = position;}
}


function RandomVector () {
	var result : Vector2;
	var rand = Random.Range(1, 4);
	switch(rand) {
		case 1:
			// go north
			result = Vector2(0,1);
			break;
		case 2:
			// go east
			result = Vector2(1,0);
			break;
		case 3:
			// go south
			result = Vector2(0,-1);
			break;
		case 4:
			// go west
			result = Vector2(-1,0);
			break;
	}
	
	return result;
}

function TakeStep (step : int, counter : int) : boolean {
	// take the current position and add a random vector to it.
	var nextPosition = currentPosition + RandomVector();
	if (counter > 30) {
		// if there are no more positions nearby (tried 30 times and no progess) end the maze here
		return false;
	}
	
	if (!ArrayUtility.Contains(path, nextPosition)) {
		CheckRelativePosition(nextPosition);
		path[step] = nextPosition;
		currentPosition = nextPosition;
		
	} else {
		// if the position is already in the path, try again
		TakeStep(step, counter + 1);
	}
	
	return true;
}
