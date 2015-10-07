using UnityEngine;
using System.Collections;

public class testSender : MonoBehaviour {

	IEnumerator DelayedSend () {
		yield return new WaitForSeconds (2);
		gameObject.SendMessage ("EnableLight");
	}

	// Use this for initialization
	void Start () {
		StartCoroutine (DelayedSend ());
	}
	
	// Update is called once per frame
	void Update () {

	}
}
