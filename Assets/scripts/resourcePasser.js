#pragma strict



var resourceType : ResourceType = ResourceType.electricity;
var maxRate = 5.0;
var rate = 5.0;
var target : GameObject;
var open : boolean = true;
// TODO add ability to pass resource with a delay
function PassResource(amount : float) {
	if (open) {
		if (amount > rate) {
			amount = rate;
		}
		
		target.SendMessage("PassResource", amount);
	}
}

function SetRate (newRate : float) {
	rate = newRate; 
	if (rate > maxRate) {
		rate = maxRate;
	}
}