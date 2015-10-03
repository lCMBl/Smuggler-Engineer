#pragma strict
// slowly blicks the attacked light on and off
// only use with point lights

var blinksPerSecond : float = 0.75;
var rangePercentage : float = 0.8;
private var lightOn : boolean = false;
private var attachedLight : Light;
private var maxRange : float;
private var rangeAmplitude : float;


function Start () {
	attachedLight = gameObject.GetComponentInChildren(Light);
	
	if (attachedLight == null) {
		this.enabled = false;
	} else {
		maxRange = attachedLight.range;
		rangeAmplitude = maxRange * rangePercentage;
		DisableLight();
	}
}

function Update () {
	if (lightOn) {
		attachedLight.range = maxRange - Mathf.Abs( rangeAmplitude * Mathf.Sin(blinksPerSecond * Time.time));
	}
}


function DisableLight() {
	lightOn = false;
	attachedLight.enabled = false;
}

function EnableLight() {
	lightOn = true;
	attachedLight.enabled = true;
}