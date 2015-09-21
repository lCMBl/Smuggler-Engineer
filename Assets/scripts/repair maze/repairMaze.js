//#pragma strict
// upon being instantiated, creates the maze, unlocks the mouse, and freezes player rotation (for this version)
// closes maze if player moves away
// vr version will need to not interfere with movement.

var player : GameObject;
var wallPrefab : GameObject;
var repairPointer : GameObject;
var targetComponent : GameObject; // set when clicked

var mazeSteps : int = 20;
var edgeSize : int = 2;
var mazeSize : int = 10;
var mazeScale : float = 0.5;
var zOffset : float = 5;

var startingTile : GameObject;

var pathCounter : int = 0;
var maxPathCount : int = 0;

var currentPosition : Vector2 = Vector2.zero;
var path : Vector2[] = new Vector2[mazeSteps];

private var firstRun : boolean = true; // bad hack to get the maze position to run only once

function Start () {
	player = GameObject.FindGameObjectWithTag("Player");
	repairPointer = GameObject.FindGameObjectWithTag("RepairCursor");
	repairPointer.SetActive(false);
	
	
}

function StartMaze(target : GameObject) {
	// unlock cursor
	Screen.lockCursor = false;
	
	// freeze rotation
	player.GetComponent("FirstPersonController").enabled = false;
	
	// generate maze
	GenerateMaze(mazeSteps);
	
	if (firstRun) {
		// place maze in center of screen
		transform.localScale = Vector3(mazeScale, mazeScale, 0.1);//GetScale();
		transform.localPosition += GetScreenPositionOffset();
		firstRun = false;
	}
	
	repairPointer.SetActive(true);
	
	PlacePointer();
	
	targetComponent = target;
}

function PlacePointer() {
	repairPointer.transform.position = startingTile.transform.position;
	repairPointer.transform.rotation = startingTile.transform.rotation;
}

function ResetMaze () {
	PlacePointer();
	
	//  clear path, place the pointer, reset path counter
	for (var wall in GameObject.FindGameObjectsWithTag("MazePath")) {
		wall.GetComponent(MeshRenderer).enabled = false;
	}
	
	
	pathCounter = maxPathCount;
	
}

function ClearData() {
	targetComponent = null;
	startingTile = null;

	pathCounter = 0;
	maxPathCount = 0;

	currentPosition = Vector2.zero;
	path = new Vector2[mazeSteps];
}

function ReduceCounter() {
	pathCounter--;
}

function CheckMazeCompletion () {	
	if (pathCounter <= 1) {
		Debug.Log("Maze Complete!");
		CompleteMaze();
	}
}

function ExitMaze() {
	// lock cursor
	Screen.lockCursor = true;
	
	// unfreeze rotation
	player.GetComponent("FirstPersonController").enabled = true;
	
	// destroy all walls
	for (var wall in transform) {
		Destroy(wall.gameObject);
	}
	
	// disable repaircursor
	repairPointer.SetActive(false);
	
	// clear maze data
	ClearData();
}

function CompleteMaze() {
	
	// exit maze, and repair piece
	targetComponent.SendMessage("FullRepair");
	ExitMaze();
	
	
}

function GenerateMaze ( steps : int) {
	
	path[0] = currentPosition;
	
	for (var k = 1; k < steps; k++) {
		if (!TakeStep(k,0)) {break;}
	}
	
	// after creation of the path, create the visual representation of it.
	// for maze to be complete, all path squares must be filled.
	
	for (var i : int = -1; i < mazeSize + (edgeSize/2); i++) {
		for (var j : int = -1; j < mazeSize + (edgeSize/2); j++) {
			var newWall : GameObject = Instantiate(wallPrefab, Vector3.zero, transform.rotation);
			newWall.transform.parent = transform;
			newWall.transform.localPosition = Vector3(i,j,zOffset);
			newWall.layer = 5;
			newWall.transform.localScale = Vector3.one; // need to do because maze has scale 1 first time through, and 0.5 etc. scale every other time
			
			if (ArrayUtility.Contains(path, Vector2(i,j))) {
				newWall.GetComponent(MeshRenderer).enabled = false;
				newWall.tag = "MazePath";
				pathCounter++;
				maxPathCount++;
				if (startingTile == null && path[0] == Vector2(i,j)) {
					startingTile = newWall;
				}
			}
			
		}
	}
	
	
}

function PositionInBounds(position : Vector2) {
	if (position.x < 0) {return false;}
	if (position.y < 0) {return false;}
	if (position.x > mazeSize - (edgeSize/2)) {return false;}
	if (position.y > mazeSize - (edgeSize/2)) {return false;}
	return true;
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
	
	if (!ArrayUtility.Contains(path, nextPosition) && PositionInBounds(nextPosition)) {
//		CheckRelativePosition(nextPosition);
		path[step] = nextPosition;
		currentPosition = nextPosition;
		
	} else {
		// if the position is already in the path, try again
		TakeStep(step, counter + 1);
	}
	
	return true;
}

function GetScale () {
	// math from: http://answers.unity3d.com/questions/491826/how-to-scale-a-plane-fit-it-screen.html
	var distance = Vector3.Distance(transform.parent.transform.position, transform.position);
	var height = 2.0 * Mathf.Tan(0.5 * Camera.main.fieldOfView * Mathf.Deg2Rad) * (zOffset/10);
	var width = height * Screen.width / Screen.height;
	return Vector3(width,height,1);
}

function GetScreenPositionOffset() {
	var xOffset : float = ((mazeSize + 1) / 2) - edgeSize;
	var yOffset : float = ((mazeSize + 1) / 2) - (edgeSize/2);
	return Vector3(-xOffset * transform.localScale.x, -yOffset  * transform.localScale.y, 0);
}
