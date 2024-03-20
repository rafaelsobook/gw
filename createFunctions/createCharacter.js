
import {createMaterial, putFakeShadow} from "./creationTools.js"
const log= console.log
export default function createCharacter(BABYLON, det, theCharacterRoot, scene, hairsMain, fakeShadowRoot){
    const {hairColor, pantsColor, clothColor} = det
    let hairs = []
    let boots = []
    const yPos = .85
    const { MeshBuilder, Texture, Vector3, StandardMaterial, ArcRotateCamera, SceneLoader } = BABYLON
    const body = MeshBuilder.CreateBox(`box.${det._id}`, {size: .5, height: 1.7}, scene)
    body.position = new Vector3(det.x,yPos,det.z);
    body.visibility = 0
    putFakeShadow(body, fakeShadowRoot, 1.3, -yPos +.02)

    // material creation
    const hairMat = createMaterial(scene, "hairMat", hairColor)
    const clothMat = createMaterial(scene, "clothMat", clothColor)
    const pantsMat = createMaterial(scene, "clothMat", pantsColor)

    const entries = theCharacterRoot.instantiateModelsToScene();
    entries.animationGroups.map(ani => ani.name = ani.name.split(" ")[2])
    const mainBodyMeshes = entries.rootNodes[0]
    mainBodyMeshes.parent = body
    mainBodyMeshes.position.y -= yPos
    mainBodyMeshes.rotationQuaternion = null
    let headBone 
    mainBodyMeshes.getChildren()[0].getChildren().forEach(bne => {
        if(bne.name.includes("pelvis")){
            headBone = bne.getChildren()[0].getChildren()[0].getChildren()[0].getChildren()[0]
        }
    })
    mainBodyMeshes.getChildren().forEach(mes => {
        mes.name = mes.name.split(" ")[2].toLowerCase()
        if(mes.name.includes("ref")) return mes.dispose()
        if(mes.name==="hiddenbody") return mes.dispose()
        // log(mes.name)
        if(mes.name.includes("cloth")){
            mes.name.split(".")[1] !== det.cloth && mes.dispose()
            log(mes.material)
            mes.material = clothMat
        }
        if(mes.name.includes("pants")){
            mes.name.split(".")[1] !== det.pants && mes.dispose()
            mes.material = pantsMat
        }
        if(mes.name.includes("boots")){
            mes.name.split(".")[1] !== det.boots && mes.dispose()
        }
        if(mes.name.includes("scalp")){
            mes.material = hairMat
        }
    
    })
    hairsMain.forEach(hairMsh => {
        const hairStyleName = hairMsh.name.split(".")[1]
        if(hairMsh.name.includes("root") || !hairStyleName) return
        if(hairStyleName === det.hair){
            const characterHair = hairMsh.clone(det._id)
            characterHair.material = hairMat
            characterHair.parent = headBone
            characterHair.rotationQuaternion = null
            characterHair.position = new Vector3(0,.45,-.1)
            characterHair.scaling = new Vector3(8,8,8)
            hairs.push(characterHair)
        }
    })
    
    return {
        body,
        headBone,
        hairs,
        anims: entries.animationGroups
    }
    // body.onCollide = m => {
    //     log(m.name)
    //     if(m.name.includes("trees") || m.name.includes("wall")) log("walking on wall")
    // }
}