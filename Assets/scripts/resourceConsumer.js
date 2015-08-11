#pragma strict



var resourceType : ResourceType = ResourceType.electricity;
var rate = 5.0; // consumption of resources per second
var storage = 0.0;
var maxStorage = 100.0;
// TODO make it blow up if too much or not the right type of resource
// TODO make it able to toggle between vulnerable to overstorage or not.

var working : boolean = false;
var timer : float = 0.0;
function Update() {
	if (storage > 0 ) {
		if ( timer < Time.time) {
			storage -= rate;
			timer = Time.time + 1;
			working = true;
		}
	} else {
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