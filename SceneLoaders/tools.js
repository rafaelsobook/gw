import { createMaterial } from "../createFunctions/creationTools.js";

export async function importSkeletalMesh(scene,glbName, SceneLoader){
    return await SceneLoader.LoadAssetContainerAsync("./models/", `${glbName}.glb`, scene);
}
export async function importModel(scene,glbName, SceneLoader, hasManyMeshes, pos, rotatY){
    const Mesh = await SceneLoader.ImportMeshAsync("", "./models/", `${glbName}.glb`, scene);

    if(hasManyMeshes) return Mesh
    
    const mainMesh = Mesh.meshes[1]
    mainMesh.parent = null
    Mesh.meshes[0].dispose()
    mainMesh.rotationQuaternion = null
    if(pos){
        mainMesh.position.x = pos.x
        mainMesh.position.z = pos.z
    }
    if(rotatY) mainMesh.addRotation(0,rotatY,0)
    return mainMesh
}
export async function importGroundContainer(scene,glbName, SceneLoader, insideDet, outsideDet, pos){
    const GroundCont = await SceneLoader.ImportMeshAsync("", "./models/", `${glbName}.glb`, scene);
 
    const insideMat = createMaterial(scene, insideDet.name, false, insideDet.scale)
    const outsideMat = createMaterial(scene, outsideDet.name, false, outsideDet.scale)
    outsideMat.level = 1.2
    GroundCont.meshes.forEach(mesh => {
        if(mesh.name === "tile") mesh.material = outsideMat
        if(mesh.name === "insideTile") mesh.material = insideMat
    })
    if(pos){
        GroundCont.meshes[0].position.x = pos.x
        GroundCont.meshes[0].position.z = pos.z
    }
    return GroundCont.meshes[0]
}