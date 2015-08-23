// thanks to DaveA (http://answers.unity3d.com/questions/44811/tooltip-when-mousing-over-a-game-object.html)

var toolTipText = ""; // set this in the Inspector

private var currentToolTipText = ""; private var guiStyleFore : GUIStyle; private var guiStyleBack : GUIStyle;

function Start() { guiStyleFore = new GUIStyle(); guiStyleFore.normal.textColor = Color.white;
guiStyleFore.alignment = TextAnchor.UpperCenter ; guiStyleFore.wordWrap = true; guiStyleBack = new GUIStyle(); guiStyleBack.normal.textColor = Color.black;
guiStyleBack.alignment = TextAnchor.UpperCenter ; guiStyleBack.wordWrap = true; }

function OnMouseEnter () {

 currentToolTipText = toolTipText;
}

function OnMouseExit () { currentToolTipText = ""; }

function OnGUI() { 
	if (currentToolTipText != "") {
		var x = Event.current.mousePosition.x;
		var y = Event.current.mousePosition.y;
		GUI.Label (Rect (x-149,y+21,300,60), currentToolTipText, guiStyleBack);
		GUI.Label (Rect (x-150,y+20,300,60), currentToolTipText, guiStyleFore);
	}
}