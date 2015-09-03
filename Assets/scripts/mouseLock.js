#pragma strict
// sticks and unsticks the mouse from the center of the screen when the "l" key is pressed
var locked : boolean = true;

function Start () {
	Screen.lockCursor = true;
}

function Update () {
	if (Input.GetKeyUp("l")) {
		locked = !locked;
		if (locked) {
			Screen.lockCursor = true;
		} else {
			Screen.lockCursor = false;
		}
	}
	
	
}

function OnGUI () {
	if (locked) {
		GUI.Label(Rect((Screen.width/2) - 10, (Screen.height/2) - 40, 20, 20), "[+]");
	}
}