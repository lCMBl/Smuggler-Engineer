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

	public bool isTurnedOn = true;// is the generator converting resources internally? (generating, consuming, or converting)
	public bool isPassing = true; // is the generator passing resources on?

	public float ticksPerSecond = 1.0f; // how often the resource should send their output amount per second.
	public float efficiencyPercent = 100.0f; // if there is any input lost before being used (either passed or consumed) 
	public float resourceConversionRate = 0.0f; // how fast input resources are turned into output resources. (still used when there are no input resources)
	public float outputModifier = 1.0f; 
		
	public float resourceOutputRate = 0.0f;
	public float maxResourceOutputRate = 0.0f; // this can function as a throttle, letting resources pile up in the input tank and restricting output.
	public float resourceInputRate = 0.0f;

	public float storedInputResource = 0.0f; // all resource objects have onboard storage. conduits just have less.
	public float maxInputStorage = 0.0f; // incoming resources is what is stored.

	public float storedOutputResource = 0.0f;
	public float maxOutputStorage = 0.0f;


	public float resourceInputThisTick = 0.0f; // used to make sure that multiple sources don't go above input rate

	public float componentOutputModifier = 1.0f; // how much the percentage should be multiplied by (i.e. what is 100 percent?)
	private float componentOutput = 0.0f; // passed to other components when generator is consuming (for example, to add evasion ability to an engine) is calculated with a percent value. (calculated from the outputRate)
	public bool isActive = false; // true when the resource component is actually working, and false when it is not.
	private bool workDone = false;


	public List<ResourceComponent> targetOutputs = new List<ResourceComponent>();


	private float stepTimer = 0.0f;
	// enforces bound checking for passed variables.
	float CheckUpperBound(float max, float param) {
		if (param > max) {
			param = max;
			Debug.Log("Had to clamp value in " + gameObject + " (too high)");
		}
		return param;
	}

	float CheckLowerBound(float min, float param) {
		if (param < min) {
			param = min;
			Debug.Log("Had to clamp value in " + gameObject + " (too low)");
		}
		return param;
	}

	void AddInputResource(float amount) {
		storedInputResource += amount;
		storedInputResource = CheckUpperBound (maxInputStorage, storedInputResource);
	}

	void RemoveInputResource(float amount) {
		storedInputResource -= amount;
		storedInputResource = CheckLowerBound (0.0f, storedInputResource);
	}

	void AddOutputResource(float amount) {
		storedOutputResource += amount;
		storedOutputResource = CheckUpperBound (maxOutputStorage, storedOutputResource);
	}

	void RemoveOutputResource(float amount) {
		storedOutputResource -= amount;
		storedOutputResource = CheckLowerBound (0.0f, storedOutputResource);
	}

	void ConvertResource(float amount) {
		// amount is determined by stepped / streamed / conversionRate / outputModifier
		// takes resources from input, and puts them into the output tank, minus those lost to efficiency
		float outputAmount = amount * (efficiencyPercent / 100.0f) * outputModifier;
		if (storedOutputResource + outputAmount <= maxOutputStorage && storedInputResource - amount >= 0) {
			RemoveInputResource (amount);
			AddOutputResource (outputAmount);
			workDone = true;
		} else if (storedOutputResource + outputAmount > maxOutputStorage) {
//			Debug.Log ("Output storage for " + gameObject + " is full, cannot convert.");
			workDone = false;
		} else {
//			Debug.Log ("Input storage for " + gameObject + " is too low, cannot convert.");
			workDone = false;
		}

	}

	void ConsumeResource() {
		// consumes resources from the output pool, using the outputrate 
		// instantiate as a "virtual" function, to be over-ridden by a specific consumption class (i.e. a computer)?
		// needs to make sure that there is enough input resource to execute (call convert resources, then do custom code) -- done in control loop
		if (storedOutputResource >= resourceOutputRate) {
			RemoveOutputResource(resourceOutputRate);
			componentOutput = (resourceOutputRate / maxResourceOutputRate) * componentOutputModifier;
			workDone = true;
		} else {
			componentOutput = 0.0f;
//			Debug.Log ("Cannot Consume resources, amount of stored output resource too low.");
			workDone = false;
		}
	}

	void GenerateResource() {
		AddOutputResource (resourceConversionRate * outputModifier);
	}
	

	float SendResource(float amount, ResourceComponent target) {

		if (target.inputResourceType == outputResourceType) {
			if (target.resourceInputThisTick < target.resourceInputRate) {
				float remainingInput = target.resourceInputRate - target.resourceInputThisTick; 
				if(remainingInput < amount) {
					float overflow = amount - remainingInput;
					RemoveOutputResource (remainingInput);
					target.AddInputResource (remainingInput);
					target.resourceInputThisTick += remainingInput;
					return overflow;
				} else {
					RemoveOutputResource (amount);
					target.AddInputResource (amount);
					target.resourceInputThisTick += amount;
				}

			} else {
				Debug.Log (target.gameObject + "has recieved their full alotment of resources already this tick. cannot push any more");
			}
		} else {
			Debug.Log (gameObject + " Send Resource Failed. Target input resource: " + target.inputResourceType + " does not equal own output resource: " + outputResourceType);
		}
		return 0.0f;

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
					resourceOverflow += SendResource(toSend, outputsThisTick[i]);
					
					outputsThisTick.RemoveAt(i);
					outputNeedsThisTick.RemoveAt(i);
					
					// pass remainder to overflow
					resourceOverflow += newStoredAmount;
					
				} else {
					
					toSend = Mathf.Min(outputPortion, outputsThisTick[i].resourceInputRate);
					
					// call send resources function, passing toSend
					resourceOverflow += SendResource(toSend, outputsThisTick[i]);
					
					// pass remainder to overflow //TODO redundant?
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


	public void AddOutput(GameObject other) {
		ResourceComponent component = other.GetComponent<ResourceComponent>();
		if (component != null) {
			targetOutputs.Add (component);
		}

	}

	public void RemoveOutput(GameObject other) {
		ResourceComponent component = other.GetComponent<ResourceComponent>();
		if (component != null) {
			targetOutputs.Remove (component);
		}
	}

	public void IncreaseOutputRate(float amount) {
		resourceOutputRate += amount;
		resourceOutputRate = CheckUpperBound (maxResourceOutputRate, resourceOutputRate);
	}

	public void DecreaseOutputRate(float amount) {
		resourceOutputRate -= amount;
		resourceOutputRate = CheckLowerBound (0.0f, resourceOutputRate);
	}

	public void SetOutputRate(float amount) {
		resourceOutputRate = amount;
		resourceOutputRate = CheckUpperBound (maxResourceOutputRate, resourceOutputRate);
		resourceOutputRate = CheckLowerBound (0.0f, resourceOutputRate);
	}

	public void SetOutputPercent(float percent) {
		//take a number between zero and one, and set the output as that percentage of the maxoutput
		percent = CheckUpperBound (1.0f, percent);
		percent = CheckLowerBound (0.0f, percent);
		SetOutputRate (percent * maxResourceOutputRate);
	}

	public float GetComponentOutput() { // used to set values for things like evasion chance
		if (isActive) {
			return componentOutput;
		} else {
			return 0.0f;
		}
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
				// reset resource this tick
				resourceInputThisTick = 0.0f;
				// perform step operations here
				if (isTurnedOn) {
					if (inputResourceType == ResourceType.none) {
						GenerateResource();
					} else { // even if input and output resources are the same, it's still the same convertion process that happens
						ConvertResource(resourceConversionRate);
						if(outputResourceType == ResourceType.none) {
							ConsumeResource();
						}
					}
				}

				if (isTurnedOn && workDone) {
					isActive = true;
				} else if (isTurnedOn && inputResourceType == ResourceType.none) {
					isActive = true;
				} else {
					isActive = false;
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















