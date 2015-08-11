//#pragma strict
// Stores the state of ship systems, and the progress with hyperspace calculations.
// Ship can continue calculations as long as the computer is working, but if the critical systems,
// (for now, the engine and computer) aren't working, then the ship won't jump until they are fixed)
// jumping requires pressing the "jump to lightspeed button" (does not automatically jump)


// for now, keeps track of engine and computer explicitly as the critical systems.
var evasionChance : int = 0;
var calculationTimeRemaining : float = 60.0;
var engine : GameObject;
var computer : GameObject; //TODO make the components add themselves to the appropriate variable

function Update () {
	//TODO Refactor this!
	if (computer.GetComponent("resourceConsumer").working) {
		calculationTimeRemaining -= Time.deltaTime;
		if (calculationTimeRemaining < 0) {
			calculationTimeRemaining = 0;
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
		}
	} 
}

// pick room, then check children, and randomly select conduit for damage
function TakeDamage() {

}