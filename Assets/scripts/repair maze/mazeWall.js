﻿#pragma strict

function OnTriggerEnter(other : Collider) {
	Debug.Log("Object entered: " + other.gameObject);
	if (gameObject.GetComponent(MeshRenderer).enabled == true) {
		if (other.gameObject.tag == "RepairCursor") {
			Debug.Log("Repair cursor hit box: " + gameObject);
			Debug.Log("Restarting Maze!");
			transform.parent.SendMessage("ResetMaze");
			
		} else {
//			Debug.Log("Other Collision: " + other.gameObject);
		}
	}
}

function OnTriggerExit(other : Collider) {
	if (gameObject.GetComponent(MeshRenderer).enabled == false) {
		if (other.gameObject.tag == "RepairCursor") {
			Debug.Log("Tile Complete!");
			// send message to check maze completion
			transform.parent.SendMessage("ReduceCounter");
			transform.parent.SendMessage("CheckMazeCompletion");
			gameObject.GetComponent(MeshRenderer).enabled = true;
			
		} 
	}
}