//#pragma strict
// each ship component (system) registers itself with the ship object on start, and changes status as long as it's working

enum ComponentType {system, conduit, engine, computer}

var critical : boolean = false;
var evasionContribution : int = 0;
var componentType : ComponentType = ComponentType.system;
var isWorking : boolean = false;
var ship : GameObject;

private var debugCounter : int = 0;

function Start () {
	ship = GameObject.FindGameObjectWithTag("Ship");
//	Debug.Log("Ship is: " + ship + ", current object is: " + gameObject);
	if (critical) {
//		Debug.Log("Ship is: " + ship);
		ship.SendMessage("AddShipCriticalComponent", gameObject);
	} else {
//		Debug.Log("This gameObject is: " + this.gameObject);
//		ship.SendMessage("AddShipComponent", this.gameObject);
		ship.SendMessage("AddShipComponent", gameObject);
	}
}

function Update () {

}

function ChangeMade( working : boolean) {
	debugCounter++;
	Debug.Log("Change has been made in Resource consumer working status. This method has been called " + debugCounter + " times.");
	Debug.Log("The component has working status: " + working);
	isWorking = working;
	if (evasionContribution > 0) {
		if (working) {
			ship.SendMessage("AddEvasion", evasionContribution);
		} else {
			ship.SendMessage("RemoveEvasion", evasionContribution);
		}
	}
}