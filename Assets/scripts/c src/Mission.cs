using UnityEngine;
using System.Collections;

public class Mission : MonoBehaviour {

	public float missionTime = 0.0f;
	public bool missionComplete = false;
	public bool readyToJump = false;
	public GameObject ship;
	public float minEventTime = 15.0f; // sets a minimum amount of seconds between events
	public float maxEventVariation = 10.0f; // sets the range for seconds that could be added between events.
	public float eventTimer = 0.0f;
	private Ship shipScript;



	// Use this for initialization
	void Start () {
		ship = GameObject.FindGameObjectWithTag("Ship");
		shipScript = ship.GetComponent<Ship>();
		eventTimer = Time.time + minEventTime;
	}

	void CompleteMission () {
		missionComplete = true;
	}
	
	void ReadyToJump () {
		readyToJump = true;
	}
	
	// Update is called once per frame
	void Update () {
		if (!missionComplete) {
			missionTime = Time.timeSinceLevelLoad;
			// every frame, check to see if min even time has elapsed
			if (eventTimer < Time.time) {
				// attempt to damage the ship
				ship.SendMessage("IncomingDamage");
				eventTimer = Time.time + minEventTime + Random.Range(0.0f, maxEventVariation);
			}
		}
	}

	void OnGUI() {
		GUILayout.BeginArea (new Rect (10,10,400,400));
		GUI.Box (new Rect (0,0,400,400), "");
		GUILayout.Label ("Mission Time: " + missionTime);
		GUILayout.Label ("Time remaining to calculate Hyperspace Jump: " + shipScript.calculationTimeRemaining);
		
		GUILayout.Label ("Chance to avoid incoming damage: " + shipScript.evasionChance);
		
		GUILayout.Label ("critical systems status: ");
		
		foreach (GameObject system in shipScript.criticalComponents) {
			//		Debug.Log("System: " + system);
			string status = "";
			DamageableComponent damageScript = system.GetComponent<DamageableComponent>();
			ResourceComponent resourceScript = system.GetComponent<ResourceComponent>();
			if (!resourceScript.isActive) {
				status = "Offline";
			} else if (damageScript.health < damageScript.maxHealth) {
				status = "Damaged";
			} else {
				status = "OK";
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


}
