//#pragma strict
// keeps track of the mission details, and is responsible for "attacking" and causing damage to the ship
// also displays mission time, mission complete notification, and play again button.
var missionTime : float = 0.0;
var missionComplete : boolean = false;
var readyToJump : boolean = false;
var ship : GameObject;
private var shipScript;

function Start() {
	ship = GameObject.FindGameObjectWithTag("Ship");
	shipScript = ship.GetComponent("ship");
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
	}
}

function OnGUI() {
	GUILayout.BeginArea (Rect (10,10,400,400));
	GUILayout.Label ("Mission Time: " + missionTime);
	GUILayout.Label ("Time remaining to calculate Hyperspace Jump: " + shipScript.calculationTimeRemaining);
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