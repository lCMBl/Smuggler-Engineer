#pragma strict
// keeps track of the mission details, and is responsible for "attacking" and causing damage to the ship
// also displays mission time, mission complete notification, and play again button.
var missionTime : float = 0.0;
var missionComplete : boolean = false;

function CompleteMission () {
	missionComplete = true;
}

function Update () {
	if (!missionComplete) {
		missionTime = Time.timeSinceLevelLoad;
	}
}

function OnGUI() {
	GUILayout.BeginArea (Rect (10,10,100,100));
	GUILayout.Label ("Mission Time: " + missionTime);
	if (missionComplete) {
		GUILayout.Label("Mission Complete!");
		if (GUILayout.Button ("Play again")) {
			Debug.Log("loading level: " + Application.loadedLevelName);
			Application.LoadLevel(Application.loadedLevelName);
		}
	}
	
	GUILayout.EndArea ();
}