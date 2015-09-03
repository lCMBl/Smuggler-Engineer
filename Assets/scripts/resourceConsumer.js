#pragma strict


//var ship : GameObject;
var resourceType : ResourceType = ResourceType.electricity;
var rate = 5.0; // consumption of resources per second
var storage = 0.0;
var maxStorage = 100.0;
// TODO make it blow up if too much or not the right type of resource
// TODO make it able to toggle between vulnerable to overstorage or not.
// TODO make resource types actually DO something!

var working : boolean = false;
var timer : float = 0.0;

//function Start () {
//	// get and store ship object.
//	ship = GameObject.FindGameObjectWithTag("Ship");
//}

function Update() {
	if (storage > 0 ) {
		if ( timer < Time.time) {
			if (!working) {
				// if the consumer currently isn't working, then a change has been made.
				// calls the change made function on the shipComponent script attached to this object.
				gameObject.SendMessage("ChangeMade", !working);
			}
			
			storage -= rate;
			timer = Time.time + 1;
			working = true;
		}
	} else {
		if (working) { 
			gameObject.SendMessage("ChangeMade", !working);
		}
		working = false;
	}
}

function PassResource(amount : float) {
	StoreResource(amount);	
}

function StoreResource(amount : float) {
	storage += amount;
	if (storage > maxStorage) {
		storage = maxStorage;
	}
}