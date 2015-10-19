#pragma strict

var menu : GameObject;
private var timeScale : float = 0.0;
private var mazeGenerator : repairMaze;
private var paused : boolean = false;
private var cursorStatus : boolean;

function Start () {
	timeScale = Time.timeScale;
	mazeGenerator = GameObject.FindGameObjectWithTag ("RepairMazeGenerator").GetComponent("repairMaze");
}

function Update () {
	if (Input.GetKeyUp(KeyCode.Escape)) {
		if (mazeGenerator.GetMazeRunning()) {
			mazeGenerator.ExitMaze();
		} else if (!paused) {
			PauseGame();
		}
	}
}

	function RestartGame() {
		ResumeGame();
		Application.LoadLevel(Application.loadedLevel);
	}
	
	function ReturnToMainMenu() {
		Unpause();
		Screen.lockCursor = false;
		Application.LoadLevel("Start-Menu");
	}

	function ExitGame () {
		Application.Quit ();
	}

	function PauseGame () {
		paused = true;
		Time.timeScale = 0.0;
		menu.SetActive(true);
		cursorStatus = Screen.lockCursor;
		Screen.lockCursor = false;
	}

	function ResumeGame () {
		Unpause();
		Screen.lockCursor = cursorStatus;	
	}
	
	private function Unpause () {
		paused = false;
		Time.timeScale = timeScale;
		menu.SetActive(false);
	}