#pragma strict
// allows an object to be damaged. Works with resource passing modules on the object if there are any.
var health : int = 100;
var maxHealth : int = 100;
//var destroyOnZero : boolean = false; // set to true to have the object destroyed when it reaches 0 hp.
var resourceScript : resourcePasser;
function Start () {
	resourceScript = gameObject.GetComponent("resourcePasser");
}


function TakeDamage (amount : int) {
	health -= amount;
	CheckBounds(health, 0, maxHealth);
	SetResourceRate();
}

function SetHealth(amount : int) {
	health = amount;
	
	CheckBounds(health, 0, maxHealth);
	SetResourceRate();
}

function Repair (amount : int) {
	health += amount;
	CheckBounds(health, 0, maxHealth);
	SetResourceRate();
}

function SetResourceRate () {
	// could also use sendmessage here
	var ratePercentage = resourceScript.maxRate * (health / maxHealth);
	resourceScript.SetRate(ratePercentage);
}

function CheckBounds(param : int, min : int, max : int) {
	if (param < min) {
		param = min;
	} else if (health > max) {
		param = max;
	}
}