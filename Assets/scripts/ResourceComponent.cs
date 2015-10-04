using UnityEngine;
using System.Collections;
using System.Collections.Generic; // include so that generic lists can be used.

public class ResourceComponent : MonoBehaviour {

	public enum ResourceType { none, electricity, fuel, coolant };
	public enum ProductionType {stepped, streamed }; // if stepped, must have the full amount of input to produce the output.
											  // if streamed, will put out proportionally to what is put in, up to the maximum rate.


	// manages resources for all uses.
	// resource movement starts at the bottom. the consumer sends a message to its source(s) 
	// This is done so that a resource object passing on resources doesn't need to know who else is passing to the same object
	// (A resource consumer spreads its consumption requests out equally through all sources)
	// e.g. a consumer taking from 3 sources makes three pull requests for the amount of flow / 3
	// TODO How would I handle a gas generator? (functions like a converter, so pass in fuel, then pass out electricity times some conversion factor)

	// Resource specs : 
	// can handle being a generator (take in fuel, put out electricity at a modified rate)
	// can function as a conduit, source, or consumer
	// can take in resources from a multitude of sources
	// can put out resources to a multitude of sources
	// can output a property instead of a resource (a number that gets read by another script, i.e. "evasion chance"
	// can adjust flow to maintain output if multipule other components are sending resources, and one goes offline but
		// the remaining inputs can still cover the input resource requirements
	// takes until storage is full, and then stops.
	// only takes necessary resources from inputs (if remaining storage capacity is less than pull rate, only takes what it needs to be full)
	// before outputing, take the maxStorage - current storage. 

	// TODO decide if load should be split evenly among inputs, taken in order of least to greatest flow capacity, or greatest to least flow capacity.
		// case of one massive input, and one small input
		// case of two equally sized inputs, capable of meeting requirements individually.
		// case of two outputs pulling at different rates, but combined are more than can be supplied.
	// TODO should object send resources out or ask for them to be delivered? consider voltage model? GOAL IS TO NOT HAVE TO REFERENCE WHAT OTHER COMPONENTS ARE DOING
	// wait till resources get to end of their circuit, then put overflow back into their container?

	
//	make sure below are public

	public ProductionType productionType = ProductionType.stepped;
	public ResourceType inputResourceType;
	public ResourceType outputResourceType;

	public bool isWorking = true;// is the generator converting resources internally? (generating, consuming, or converting)
	public bool isPassing = true; // is the generator passing resources on?

	public float ticksPerSecond = 1.0f; // how often the resource should send their output amount per second.
	public float efficiencyPercent = 100.0f; // if there is any input lost before being used (either passed or consumed) 
	public float outputModifier = 1.0f; 

	public float storedInputResource = 0.0f; // all resource objects have onboard storage. conduits just have less.
	public float maxInputStorage = 0.0f; // incoming resources is what is stored.

	public float storedOutputResource = 0.0f;
	public float maxOutputStorage = 0.0f;

	public float resourceInputRate = 0.0f;
	public float resourceConversionRate = 0.0f; // how fast input resources are turned into output resources. (still used when there are no input resources)

	public float resourceOutputRate = 0.0f;
	public float maxResourceOutputRate = 0.0f; // this can function as a throttle, letting resources pile up in the input tank and restricting output.

	public List<ResourceComponent> targetOutputs = new List<ResourceComponent>();


	private float stepTimer = 0.0f;
	// enforces bound checking for passed variables.
	void CheckUpperBound(float max, float param) {
		if (param > max) {
			param = max;
			Debug.Log("Had to clamp value in " + gameObject + " (too high)");
		}
	}

	void CheckLowerBound(float min, float param) {
		if (param < min) {
			param = min;
			Debug.Log("Had to clamp value in " + gameObject + " (too low)");
		}
	}

	void AddInputResource(float amount) {
		storedInputResource += amount;
		CheckUpperBound (maxInputStorage, storedInputResource);
	}

	void RemoveInputResource(float amount) {
		storedInputResource -= amount;
		CheckLowerBound (0.0f, storedInputResource);
	}

	void AddOutputResource(float amount) {
		storedOutputResource += amount;
		CheckUpperBound (maxOutputStorage, storedOutputResource);
	}

	void RemoveOutputResource(float amount) {
		storedOutputResource -= amount;
		CheckLowerBound (0.0f, storedOutputResource);
	}

	void ConvertResource(float amount) {
		// amount is determined by stepped / streamed / conversionRate / outputModifier
		// takes resources from input, and puts them into the output tank, minus those lost to efficiency
		float outputAmount = amount * (efficiencyPercent / 100.0f) * outputModifier;
		if (storedOutputResource + outputAmount <= maxOutputStorage && storedInputResource - amount >= 0) {
			RemoveInputResource (amount);
			AddOutputResource (outputAmount);
		} else if (storedOutputResource + outputAmount > maxOutputStorage) {
			Debug.Log ("Output storage for " + gameObject + " is full, cannot convert.");
		} else {
			Debug.Log ("Input storage for " + gameObject + " is too low, cannot convert.");
		}

	}

	void ConsumeResource() {
		// consumes resources from the output pool, using the outputrate 
		// instantiate as a "virtual" function, to be over-ridden by a specific consumption class (i.e. a computer)?
		// needs to make sure that there is enough input resource to execute (call convert resources, then do custom code) -- done in control loop
	}

	void GenerateResource() {
		AddOutputResource (resourceConversionRate);
	}
	

	void SendResource(float amount, ResourceComponent target) {
		if (target.inputResourceType == outputResourceType) {
			RemoveOutputResource (amount);
			target.AddInputResource (amount);
		} else {
			Debug.Log (gameObject + " Send Resource Failed. Target input resource: " + target.inputResourceType + " does not equal own output resource: " + outputResourceType);
		}


	}

	// responsible for passing out resources to all output targets
	void PassResources() {

		
		// turn the following into a dedicated function for use with the streamed production mode
		List<ResourceComponent> outputsThisTick = new List<ResourceComponent>();
		List<float> outputNeedsThisTick = new List<float>();
		
		foreach(ResourceComponent output in targetOutputs) {
			outputsThisTick.Add(output);
			outputNeedsThisTick.Add(output.storedInputResource - output.maxInputStorage);
		}
		
		float resourceOverflow = 0.0f;
		// TODO possibly use getter method with output rate to calculate both streamed / stepped value
		float outputPortion = Mathf.Min(resourceOutputRate, storedOutputResource) / outputsThisTick.Count;
		
		
		do {
			//					Debug.Log ("Number of outputs: " + outputsThisTick.Count);
			//					Debug.Log ("outputs this tick: " + outputsThisTick[0]);
			//					Debug.Log ("output Needs this tick: " + outputNeedsThisTick[0]);
			
			//					Debug.Log ("Continue loop? " + (outputsThisTick.Count != 0 && resourceOverflow !=0));
			
			resourceOverflow = 0.0f;
			
			for(int i = outputsThisTick.Count - 1; i >= 0 ; i--) {
				// replace script component with null instead of removing outright, then clear after the foreach loop.
				float newStoredAmount = outputPortion + outputNeedsThisTick[i];
				float toSend = 0.0f;
				
				if (newStoredAmount > 0.0f) { // then there is excess, and remainder should be added to overflow
					toSend = Mathf.Min (Mathf.Abs (outputNeedsThisTick[i]), outputsThisTick[i].resourceInputRate);
					
					// call send resources function, passing toSend
					SendResource(toSend, outputsThisTick[i]);
					
					outputsThisTick.RemoveAt(i);
					outputNeedsThisTick.RemoveAt(i);
					
					// pass remainder to overflow
					resourceOverflow += newStoredAmount;
					
				} else {
					
					toSend = Mathf.Min(outputPortion, outputsThisTick[i].resourceInputRate);
					
					// call send resources function, passing toSend
					SendResource(toSend, outputsThisTick[i]);
					
					// pass remainder to overflow
					resourceOverflow += ( outputPortion - toSend);
					
					// remove output from this tick list or modify the need to reflect input rate cap.
					if (outputsThisTick[i].resourceInputRate <= outputPortion) {
						outputsThisTick.RemoveAt(i);
						outputNeedsThisTick.RemoveAt(i);
					} else {
						outputNeedsThisTick[i] = outputPortion - outputsThisTick[i].resourceInputRate;
					}
				}
				
			}// end of for loop
			
			
			// calculate the available portion to go around
			outputPortion = resourceOverflow / outputsThisTick.Count;
			
		} while(outputsThisTick.Count != 0 && resourceOverflow !=0);
		//				Debug.Log ("exited while loop");
	}


	void AddOutput(GameObject other) {

	}
	

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
		if (productionType == ProductionType.stepped) {
			// set timer
			if (stepTimer < Time.time) {
				stepTimer = Time.time + 1.0f / ticksPerSecond;
				// perform step operations here
				if (isWorking) {
					if (inputResourceType == ResourceType.none) {
						GenerateResource();
					} else { // even if input and output resources are the same, it's still the same convertion process that happens
						ConvertResource(resourceConversionRate);
						if(outputResourceType == ResourceType.none) {
							ConsumeResource();
						}
					}
				}

				if (isPassing) {
					PassResources();
				}


				// TODO TODO do logic here for endless source, consumption, below is function for passing



			} // end timer
		} else {
			// production type is streamed, make sure to multiply rates by ticks per second and time.deltatime
		}

	}


}















