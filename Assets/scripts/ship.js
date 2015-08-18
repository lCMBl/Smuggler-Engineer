//#pragma strict
// Stores the state of ship systems, and the progress with hyperspace calculations.
// Ship can continue calculations as long as the computer is working, but if the critical systems,
// (for now, the engine and computer) aren't working, then the ship won't jump until they are fixed)
// jumping requires pressing the "jump to lightspeed button" (does not automatically jump)


// for now, keeps track of engine and computer explicitly as the critical systems.
var evasionChance : int = 0;
var calculationTimeRemaining : float = 60.0;
var engine : GameObject; 
var computer : GameObject; 
var currentMission : GameObject;
var components;
var criticalComponents; // both are arrays of components. critical components must be intact to jump.

function Start() {
	components = new Array();
	criticalComponents = new Array();
	currentMission = GameObject.FindGameObjectWithTag("Mission");
}


function Update () {
	//TODO Refactor this!
	if (computer.GetComponent("resourceConsumer").working) {
		calculationTimeRemaining -= Time.deltaTime;
		if (calculationTimeRemaining < 0) {
			calculationTimeRemaining = 0;
			currentMission.SendMessage("ReadyToJump");
		}
	}
}

function HyperspaceJump () {
	if (calculationTimeRemaining <= 0) {
		var engineWorking = engine.GetComponent("resourceConsumer").working;
		var computerWorking = computer.GetComponent("resourceConsumer").working;
		if (engineWorking && computerWorking) {
			Debug.Log("Jumped to Hyperspace!");
			// complete mission here.
			currentMission.SendMessage("CompleteMission");
		}
	} 
}

// pick room, then check children, and randomly select conduit for damage
function TakeDamage() {

}

function AddShipComponent(component : GameObject) {
	components.Push(component);
	// add special components to slots.
	var type :ComponentType = component.GetComponent("shipComponent").componentType;
	if (type == ComponentType.engine) {
		engine = component;
	} else if (type == ComponentType.computer) {
		computer = component;
	}
	
	Debug.Log("adding component: " + component);
}

function AddShipCriticalComponent(component : GameObject) {
	AddShipComponent(component);
	criticalComponents.Push(component);
}