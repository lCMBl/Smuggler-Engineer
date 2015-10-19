using UnityEngine;
using System.Collections;

public class MainMenu : MonoBehaviour {

	void PlayGame () {
		Application.LoadLevel ("Level1");
	}

	void ExitGame () {
		Application.Quit ();
	}
}
