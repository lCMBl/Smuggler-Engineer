#pragma strict

var rate : float = 15; // rate healed per second
var repairMazeGenerator : GameObject;

function Start() {
	repairMazeGenerator = GameObject.FindGameObjectWithTag("RepairMazeGenerator");
}


function Update () {
	var hit : RaycastHit; 
	if (Input.GetMouseButtonUp(0)){
		if(Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), hit)) {
			var damageComponent : damageableComponent = hit.transform.gameObject.GetComponent("damageableComponent");
			if (damageComponent) {
				repairMazeGenerator.SendMessage("StartMaze", hit.transform.gameObject);
//				damageComponent.Repair(rate * Time.deltaTime);
//				Debug.Log("Repairing: " + hit.transform.gameObject);
			}
		}
	}
}