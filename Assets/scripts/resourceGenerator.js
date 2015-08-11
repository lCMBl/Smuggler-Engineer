#pragma strict


var resourceType : ResourceType = ResourceType.electricity;
var rate = 5.0;
var target : GameObject;
var on : boolean = true;
// TODO provide option to pull from storage (resource consumer)
var timer : float = 0.0;
function Update() {
	if ( on && timer < Time.time) {
		timer = Time.time + 1;
		target.SendMessage("PassResource", rate);
	}
}

