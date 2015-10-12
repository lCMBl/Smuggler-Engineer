using UnityEngine;
using System.Collections;

public class FixOnClick : MonoBehaviour {

	public GameObject repairMazeGenerator;

	// Use this for initialization
	void Start () {
		repairMazeGenerator = GameObject.FindGameObjectWithTag ("RepairMazeGenerator");
	}
	
	// Update is called once per frame
	void Update () {
		RaycastHit hit; 
		if (Input.GetMouseButtonUp(0)){
			if(Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out hit)) {
				DamageableComponent damageComponent = hit.transform.gameObject.GetComponent<DamageableComponent>();
				if (damageComponent) {
					repairMazeGenerator.SendMessage("StartMaze", hit.transform.gameObject);
					//				damageComponent.Repair(rate * Time.deltaTime);
					//				Debug.Log("Repairing: " + hit.transform.gameObject);
				}
			}
		}
	}
}
