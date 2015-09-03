//#pragma strict
// keeps track of the mission details, and is responsible for "attacking" and causing damage to the ship
// also displays mission time, mission complete notification, and play again button.
var missionTime : float = 0.0;
var missionComplete : boolean = false;
var readyToJump : boolean = false;
var ship : GameObject;
var minEventTime : float = 15; // sets a minimum amount of seconds between events
var maxEventVariation : float = 10; // sets the range for seconds that could be added between events.
var eventTimer : float = 0;
private var shipScript;

function Start() {
	ship = GameObject.FindGameObjectWithTag("Ship");
	shipScript = ship.GetComponent("ship");
	eventTimer = Time.time + minEventTime;
}

function CompleteMission () {
	missionComplete = true;
}

function ReadyToJump () {
	readyToJump = true;
}

function Update () {
	if (!missionComplete) {
		missionTime = Time.timeSinceLevelLoad;
		// every frame, check to see if min even time has elapsed
		if (eventTimer < Time.time) {
			// attempt to damage the ship
			ship.SendMessage("IncomingDamage");
			eventTimer = Time.time + minEventTime + Random.Range(0.0, maxEventVariation);
		}
	}
}

function OnGUI() {
	GUILayout.BeginArea (Rect (10,10,400,400));
	GUI.Box (Rect (0,0,400,400), "");
	GUILayout.Label ("Mission Time: " + missionTime);
	GUILayout.Label ("Time remaining to calculate Hyperspace Jump: " + shipScript.calculationTimeRemaining);
	
	GUILayout.Label ("Chance to avoid incoming damage: " + shipScript.evasionChance);
	
	GUILayout.Label ("critical systems status: ");
	
	for(var system : GameObject in shipScript.criticalComponents) {
//		Debug.Log("System: " + system);
		var status = "";
		if (system.GetComponent("resourceConsumer") && system.GetComponent("resourceConsumer").working) { // have all resource indicators register with the ship, so that there is one place where "active" is being tracked.
			status = "OK";
		} else {
			status = "Offline";
		}
		GUILayout.Label (system.name + ": " + status);
	}
	
	if (readyToJump) {
		GUILayout.Label ("Ready to Jump to Hyperspace!");
	}
	if (missionComplete) {
		GUILayout.Label("Mission Complete!");
		if (GUILayout.Button ("Play again")) {
			Debug.Log("loading level: " + Application.loadedLevelName);
			Application.LoadLevel(Application.loadedLevelName);
		}
	}
	
	GUILayout.EndArea ();
}