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
	}
}

function ChangeRoom(player : GameObject, destination : GameObject) {
	var relativePosition = player.transform.position - transform.position;
}