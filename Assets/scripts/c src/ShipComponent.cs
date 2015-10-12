using UnityEngine;
using System.Collections;

public class ShipComponent : MonoBehaviour {

//	public enum ShipComponentType {system, conduit};
	

	public bool isCritical = false;
	public bool isComputer = false;
	public float evasionContribution = 0.0f;
	GameObject ship;
	ResourceComponent resourceScript;
	float lastOutputContributed = 0.0f;



	// Use this for initialization
	void Start () {
		ship = GameObject.FindGameObjectWithTag ("Ship");
		resourceScript = gameObject.GetComponent<ResourceComponent> ();

		if (isCritical) {
			//		Debug.Log("Ship is: " + ship);
			ship.SendMessage("AddShipCriticalComponent", gameObject);
		} else {
			//		Debug.Log("This gameObject is: " + this.gameObject);
			//		ship.SendMessage("AddShipComponent", this.gameObject);
			ship.SendMessage("AddShipComponent", gameObject);
		}
	}

	void Update () {
		if (evasionContribution > 0.0f) {
			float evasionThisTick = GetEvasionContribution();
			if ( evasionThisTick != lastOutputContributed) {
				ship.SendMessage("RemoveEvasion", lastOutputContributed);
				ship.SendMessage("AddEvasion", evasionThisTick);
				lastOutputContributed = evasionThisTick;
			}
		}
	}

//	function ChangeMade( working : boolean) {
//		debugCounter++;
//		//	Debug.Log("Change has been made in Resource consumer working status. This method has been called " + debugCounter + " times.");
//		//	Debug.Log("The component has working status: " + working);
//		isWorking = working;
//		if (evasionContribution > 0) {
//			if (working) {
//				ship.SendMessage("AddEvasion", evasionContribution);
//			} else {
//				ship.SendMessage("RemoveEvasion", evasionContribution);
//			}
//		}
//	}
	
	public float GetEvasionContribution () {
		return evasionContribution * resourceScript.GetComponentOutput ();
	}
}
