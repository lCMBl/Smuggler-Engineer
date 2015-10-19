using UnityEngine;
using System.Collections;

public class DamageableComponent : MonoBehaviour {

	public float health = 100.0f;
	public float maxHealth = 100.0f;
	public int mazeDifficulty = 7;
	public int mazeSize = 5;

	private ResourceComponent resourceScript;

	// Use this for initialization
	void Start () {
		resourceScript = gameObject.GetComponent<ResourceComponent> ();
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	void TakeDamage (float amount) {
		health -= amount;
		health = CheckBounds( 0.0f, maxHealth, health);
		SetResourceRate();
		SetColor(gameObject);
	}

	void SetHealth(float amount) {
		health = amount;
		
		health = CheckBounds( 0.0f, maxHealth, health);
		SetResourceRate();
		SetColor(gameObject);
	}
	
	void Repair (float amount) {
		health += amount;
		health = CheckBounds( 0.0f, maxHealth, health);
		SetResourceRate();
		SetColor(gameObject);
	}

	void FullRepair() {
		health = maxHealth;
		SetResourceRate();
		SetColor(gameObject);
	}

	void SetResourceRate() {
		if (resourceScript != null) {
			resourceScript.SetOutputPercent(health / maxHealth);
		}

	}

	public int GetMazeDifficulty() {
		return mazeDifficulty;
	}

	public int GetMazeSize() {
		return mazeSize;
	}

	void SetColor(GameObject targetObject) {
		float healthPercentage = health / maxHealth;

		if (targetObject.GetComponent<Renderer>() == null) {
			// then game object is an empty parent, and the color of all of the children needs to be set.
			foreach (Transform child in targetObject.transform) {
				SetColor(child.gameObject);
			}
		} else {
			targetObject.GetComponent<Renderer>().material.SetColor("_Color", new Color(1,healthPercentage,healthPercentage,1));
		}
	}

	float CheckBounds(float min, float max, float param) {
		if (param < min) {
			param = min;
		} else if (param > max) {
			param = max;
		}
		
		return param;
	}

}
