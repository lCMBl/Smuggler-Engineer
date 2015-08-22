#pragma strict

var rate : float = 15; // rate healed per second

function Update () {
	var hit : RaycastHit; 
	if (Input.GetMouseButton(0)){
		if(Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), hit)) {
			var damageComponent : damageableComponent = hit.transform.gameObject.GetComponent("damageableComponent");
			if (damageComponent) {
				damageComponent.Repair(rate * Time.deltaTime);
				Debug.Log("Repairing: " + hit.transform.gameObject);
			}
		}
	}
}