#pragma strict

// Whenever a door is clicked on, doorRoomChange will fade to black, move the player to the destination room,
// place them in the same position they were relative to the original room, and fade in.

var destinationDoor : GameObject;
//var currentDoor : GameObject;
var activationDistace : float = 3.0;
private var player : GameObject;

function Start () {
	// prevent the script from activating if no destination room exists
	if (destinationDoor == null) {this.enabled = false;}
	player = GameObject.FindGameObjectWithTag("Player");
	
}

function OnMouseOver() {
	if (Input.GetMouseButtonUp(0) && Vector3.Distance(transform.position, player.transform.position) <= activationDistace){
		// if the door has been clicked on, and the mouse is over the door, change room.
		Debug.Log("going to the next room: " + destinationDoor);
//		var player = GameObject.FindGameObjectWithTag("Player");
		// play fade-out animation here
		ChangeRoom(player, destinationDoor);
		// play fade-in animation here
		// disable this room
//		transform.parent.gameObject.SetActive(false);
	}
}

function ChangeRoom(player : GameObject, destination : GameObject) {
	
	var relativePosition = RelativePosition(gameObject, player);
	var relativeRotation = RelativeRotation(destination, gameObject);
	
	Debug.Log("relative position is: " + relativePosition);
	Debug.Log("relative rotation is: " + relativeRotation);
	Debug.Log("difference in angle between destinationDoor and currentDoor is: " + (destination.transform.eulerAngles - transform.eulerAngles));
	player.transform.position = destination.transform.TransformPoint(relativePosition);
//	player.transform.RotateAround(player.transform.position,player.transform.up,  relativeRotation.y);
	player.transform.eulerAngles += Vector3(0, relativeRotation.y, 0);

}

function RelativePosition(ObjA : GameObject, ObjB : GameObject) {
//	var distance = ObjA.transform.TransformPoint(ObjB.transform.position) - ObjA.transform.localPosition;
	var relativePosition = ObjA.transform.InverseTransformPoint(ObjB.transform.position);
//	relativePosition.x = Vector3.Dot(distance, ObjA.transform.right.normalized);
//    relativePosition.y = Vector3.Dot(distance, ObjA.transform.up.normalized);
//    relativePosition.z = Vector3.Dot(distance, ObjA.transform.forward.normalized);

    return relativePosition;
//    return distance;
}

function RelativeRotation(ObjA : GameObject, ObjB : GameObject) {
//	var relativeRotation : Quaternion = Quaternion.Inverse(ObjA.transform.rotation) ;//* ObjB.transform.rotation;
	var relativeRotation =  (ObjA.transform.eulerAngles - ObjB.transform.eulerAngles);
	
	return relativeRotation;
}