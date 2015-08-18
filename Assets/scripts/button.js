#pragma strict
// when clicked on, calls the specified function in target object.

var targetObject : GameObject;
var functionName : String;
var functionParam;


function OnMouseOver() {
	if (Input.GetMouseButtonUp(0)){
		
		Debug.Log("button clicked! calling: " + functionName + " on " + targetObject);
		targetObject.SendMessage(functionName, functionParam);
		
	}
}