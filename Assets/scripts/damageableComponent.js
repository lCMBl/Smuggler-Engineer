#pragma strict
// allows an object to be damaged. Works with resource passing modules on the object if there are any.
var health : float = 100;
var maxHealth : float = 100;
//var destroyOnZero : boolean = false; // set to true to have the object destroyed when it reaches 0 hp.
var resourceScript : resourcePasser;
function Start () {
	resourceScript = gameObject.GetComponent("resourcePasser");
}


function TakeDamage (amount : float) {
	health -= amount;
	health = CheckBounds(health, 0, maxHealth);
	SetResourceRate();
	SetColor();
}

function SetHealth(amount : float) {
	health = amount;
	
	health = CheckBounds(health, 0, maxHealth);
	SetResourceRate();
	SetColor();
}

function Repair (amount : float) {
	health += amount;
	health = CheckBounds(health, 0, maxHealth);
	SetResourceRate();
	SetColor();
}

function SetResourceRate () {
	// could also use sendmessage here
	var ratePercentage = resourceScript.maxRate * (health / maxHealth);
	resourceScript.SetRate(ratePercentage);
}

function SetColor () {
	var healthPercentage = health / maxHealth;
	gameObject.GetComponent.<Renderer>().material.SetColor("_Color", Color(1,healthPercentage,healthPercentage,1));
	
}

function CheckBounds(param : float, min : float, max : float) {
	if (param < min) {
		param = min;
	} else if (health > max) {
		param = max;
	}
	
	return param;
}