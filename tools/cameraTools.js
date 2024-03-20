export function setArcCam(cam, vecOrMeshTarget, isSetBetaLimit){

    cam.alpha = 4.5
    cam.beta = 1.15
    cam.radius = 10
    cam.minZ = .01
    cam.lowerRadiusLimit = 2.5; //3
    cam.upperRadiusLimit = 18 // 3
    if(isSetBetaLimit){
        cam.lowerBetaLimit = .6 //.2 ;
        cam.upperBetaLimit = 1.2//1.15 // taasan mo to kung gusto mo pa ng mas kita yung front
    }
   
    if(vecOrMeshTarget) cam.setTarget(vecOrMeshTarget)
}