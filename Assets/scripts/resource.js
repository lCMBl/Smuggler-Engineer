#pragma strict

enum ResourceType { electricity, fuel, coolant };


// manages resources for all uses.
// resource movement starts at the bottom. the consumer sends a message to its source(s) 
// This is done so that a resource object passing on resources doesn't need to know who else is passing to the same object
// (A resource consumer spreads its consumption requests out equally through all sources)
// e.g. a consumer taking from 3 sources makes three pull requests for the amount of flow / 3

var resourceType : ResourceType;
var storedResource : float = 0.0; // all resource objects have onboard storage. conduits just have less.
var maxStorage : float = 100.0;
var resourcePullRate : float = 0.0; // amount of resource that this object is attempting to pull.
