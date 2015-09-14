#pragma strict

// code taken from : http://answers.unity3d.com/questions/406636/3d-object-attach-to-mouse-1.html
 
public var distance : float = 5;
 // need to change distance so that sphere doesn't move in an arc around the camera
 

function Update() 
{
    ObjectFollowCursor();
}

function ObjectFollowCursor() 
{
//	 var ray : Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
//	 var point : Vector3 = ray.origin + Vector3(0,0,distance);//(ray.direction * distance);
	 //Debug.Log( "World point " + point );
	 var point : Vector3 = Camera.main.ScreenToWorldPoint(Input.mousePosition + Vector3(0,0,distance)); 
	 
	 transform.position = point;
}