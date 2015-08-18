#pragma strict
// each ship component (system) registers itself with the ship object on start, and changes status as long as it's working

enum ComponentType {system, conduit, engine, computer}

var critical : boolean = false;
var componentType : ComponentType = ComponentType.system;
var isWorking : boolean = false;
var ship : GameObject;

function Start () {
	ship = GameObject.FindGameObjectWithTag("Ship");
	Debug.Log("Ship is: " + ship);
	if (critical) {
		Debug.Log("Ship is: " + ship);
		ship.SendMessage("AddShipCriticalComponent", gameObject);
	} else {
		ship.SendMessage("AddShipComponent", gameObject);
	}
}

function Update () {

}