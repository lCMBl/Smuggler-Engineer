#pragma strict

// code taken from : http://forum.unity3d.com/threads/solved-move-object-with-mouse.45399/
 
var distance : float = 5;
var offset : Vector3;
var movedownY = 0.0;
var movedownX = 0.0;
var sensitivityY = 0.5;
var sensitivityX = 0.5;
 // need to change distance so that sphere doesn't move in an arc around the camera
 

function Update() 
{
//    ObjectFollowCursor();
	moveObj();
}

//function SetOffset(scale : float) {
//	offset =  transform.position - Camera.main.ScreenToWorldPoint(Input.mousePosition + Vector3(0,0,distance));
//	offset *= scale;
//}
//
//function ObjectFollowCursor() 
//{
////	 var ray : Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
////	 var point : Vector3 = ray.origin + Vector3(0,0,distance);//(ray.direction * distance);
//	 //Debug.Log( "World point " + point );
//	 var pos = Input.mousePosition;
//	 pos.z = distance;
//	 var point : Vector3 = Camera.main.ScreenToWorldPoint(pos) + offset; 
//	 
//	 transform.position = point;
//}


function moveObj() {
    movedownY += Input.GetAxis("Mouse Y") * sensitivityY;
    movedownX += Input.GetAxis("Mouse X") * sensitivityX;
    if (Input.GetAxis("Mouse Y") != 0){
        transform.Translate(Vector3.up * movedownY);
    }
    if (Input.GetAxis("Mouse X") != 0){
        transform.Translate(Vector3.right * movedownX);
    }
    movedownY = 0.0;
    movedownX = 0.0;
}