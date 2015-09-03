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
var damageableComponents;
var criticalComponents; // both are arrays of components. critical components must be intact to jump.
var rooms; // all rooms in ship 

function Start() {
	components = new Array();
	damageableComponents = new Array();
	criticalComponents = new Array();
	rooms = new Array();
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

function IncomingDamage() {
	// performs calculations to see if ship dodges event (called from mission object)
	Debug.Log("Damage Called, attempting to dodge");
	var hitRoll = Random.Range(0.0, 100.0);
	if (hitRoll > evasionChance) {
		// then the ship is hit, call take Damage
		TakeDamage();
	} else {
		Debug.Log("Damage Avoided!");
	}
}

// pick room, then check children, and randomly select conduit for damage
function TakeDamage() {
	var damagedUnit : int = Random.Range(0, damageableComponents.length - 1);
	var damage : int = Random.Range(10, 100);
	damageableComponents[damagedUnit].SendMessage("TakeDamage", damage);
	Debug.Log("component damaged: " + damageableComponents[damagedUnit] + ", for " + damage + " damage.");
//	for (var component : GameObject in components) {
//		
//	}
}

function AddShipComponent(component : GameObject) {
	components.Push(component);
	// add special components to slots.
	var type :ComponentType = component.GetComponent("shipComponent").componentType;
	var damageable : damageableComponent = component.GetComponent("damageableComponent");
	if (type == ComponentType.engine) {
		engine = component;
	} else if (type == ComponentType.computer) {
		computer = component;
	}
	
	if (damageable != null) {
		damageableComponents.Push(component);
		Debug.Log("added damageableComponent: " + component);
	}
	
//	Debug.Log("adding component: " + component);
}

function AddShipCriticalComponent(component : GameObject) {
	AddShipComponent(component);
	criticalComponents.Push(component);
}

function AddEvasion(ammount : int) {
	evasionChance += ammount;
	evasionChance = CheckBounds(evasionChance, 0, 100);
}

function RemoveEvasion(ammount : int) {
	evasionChance -= ammount;
	evasionChance = CheckBounds(evasionChance, 0, 100);
}

function CheckBounds(param : int, min : int, max : int) {
	if (param < min) {
		param = min;
	} else if (param > max) {
		param = max;
	}
	
	return param;
}
