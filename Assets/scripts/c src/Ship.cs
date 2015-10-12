using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class Ship : MonoBehaviour {

	public float evasionChance = 0.0f;
	public float calculationTimeRemaining = 60.0f;
	public GameObject computer;
	public GameObject currentMission;
	public List<GameObject> components = new List<GameObject>();
	public List<GameObject> damageableComponents = new List<GameObject>();
	public List<GameObject> criticalComponents = new List<GameObject>(); // both are arrays of components. critical components must be intact to jump.

	// Use this for initialization
	void Start () {
		currentMission = GameObject.FindGameObjectWithTag("Mission");
	}
	
	// Update is called once per frame
	void Update () {
		//TODO Refactor this!
		if (calculationTimeRemaining > 0 && computer.GetComponent<ResourceComponent>().isActive) {
			calculationTimeRemaining -= Time.deltaTime;
			if (calculationTimeRemaining < 0) {
				calculationTimeRemaining = 0;
				currentMission.SendMessage("ReadyToJump");
			}
		}
	}

	void HyperspaceJump () {
		if (calculationTimeRemaining <= 0) {
			bool allCriticalSystemsWorking = true;
			foreach (GameObject component in criticalComponents) {
				if (!component.GetComponent<ResourceComponent>().isActive) {
					allCriticalSystemsWorking = false;
					break;
				}
			}
			if (allCriticalSystemsWorking) {
				Debug.Log("Jumped to Hyperspace!");
				// complete mission here.
				currentMission.SendMessage("CompleteMission");
			}
		} 
	}

	void IncomingDamage() {
		// performs calculations to see if ship dodges event (called from mission object)
		Debug.Log("Damage Called, attempting to dodge");
		float hitRoll = Random.Range(0.0f, 100.0f);
		if (hitRoll > evasionChance) {
			// then the ship is hit, call take Damage
			TakeDamage();
		} else {
			Debug.Log("Damage Avoided!");
		}
	}
	
	// pick room, then check children, and randomly select conduit for damage
	void TakeDamage() {
		int damagedUnit = Random.Range(0, damageableComponents.Count);
		float damage = Random.Range(10.0f, 100.0f);
		damageableComponents[damagedUnit].SendMessage("TakeDamage", damage);
		Debug.Log("component damaged: " + damageableComponents[damagedUnit] + ", for " + damage + " damage.");
		//	for (var component : GameObject in components) {
		//		//TODO damage multiple components at once
		//	}
	}

	void AddShipComponent(GameObject component) {
		components.Add(component);
		// add special components to slots.
		ShipComponent shipComponent = component.GetComponent<ShipComponent>();
		DamageableComponent damageable = component.GetComponent<DamageableComponent>();

		if (shipComponent.isComputer) {
			computer = component;
		} 
		
		if (damageable != null) {
			damageableComponents.Add(component); // TODO should the damageable component itself be added here instead?
			Debug.Log("added damageableComponent: " + component);
		}
		
		//	Debug.Log("adding component: " + component);
	}

	void AddShipCriticalComponent(GameObject component) {
		AddShipComponent(component);
		criticalComponents.Add(component);
	}


	void AddEvasion(float amount) {
		evasionChance += amount;
		evasionChance = CheckBounds(evasionChance, 0.0f, 100.0f);
		Debug.Log ("Adding evasion: " + amount);
	}
	
	void RemoveEvasion(float amount) {
		evasionChance -= amount;
		evasionChance = CheckBounds(evasionChance, 0.0f, 100.0f);
	}
	
	float CheckBounds(float param, float min, float max) {
		if (param < min) {
			param = min;
		} else if (param > max) {
			param = max;
		}
		
		return param;
	}


}
