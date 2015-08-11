#pragma strict

// Whenever a door is clicked on, doorRoomChange will fade to black, move the player to the destination room,
// place them in the same position they were relative to the original room, and fade in.

var destinationRoom : GameObject;

function Start () {
	// prevent the script from activating if no destination room exists
	if (destinationRoom == null) {this.enabled = false;}
	
}

function OnMouseOver() {
	if (Input.GetMouseButtonUp(0)){
		// if the door has been clicked on, and the mouse is over the door, change room.
		Debug.Log("going to the next room: " + destinationRoom);
		var player = GameObject.FindGameObjectWithTag("Player");
		// play fade-out animation here
		ChangeRoom(player, destinationRoom);
		// play fade-in animation here
		// disable this room
//		transform.parent.gameObject.SetActive(false);
	}
}

function ChangeRoom(player : GameObject, destination : GameObject) {
	
	var relativePosition = RelativePosition(transform.parent.gameObject, player);
	
	Debug.Log("relative position is: " + relativePosition);
//	destination.SetActive(true);
	player.transform.position = destination.transform.position + relativePosition;
//	player.transform.position.y += 1; // TODO find better way to fix player falling through floor
}

function RelativePosition(ObjA : GameObject, ObjB : GameObject) {
	var distance = ObjB.transform.position - ObjA.transform.position;
	var relativePosition = Vector3.zero;
	relativePosition.x = Vector3.Dot(distance, ObjA.transform.right.normalized);
    relativePosition.y = Vector3.Dot(distance, ObjA.transform.up.normalized);
    relativePosition.z = Vector3.Dot(distance, ObjA.transform.forward.normalized);
    
    return relativePosition;
}