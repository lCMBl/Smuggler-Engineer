#pragma strict
// sticks and unsticks the mouse from the center of the screen when the "l" key is pressed
var locked : boolean = false;

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