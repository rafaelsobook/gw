import Bmodules from "../main/BabylonModule.js";
import { importModel } from "../SceneLoaders/tools.js";
const {BABYLON} = Bmodules
const { MeshBuilder, SceneLoader, Color3, Vector3, StandardMaterial, Texture} = BABYLON

export function createMaterial(scene, textureFileName, colorTexture, uVscaleTex){
    
    const material = new StandardMaterial(textureFileName, scene)
    material.specularColor = new Color3(0,0,0)
    if(!colorTexture || colorTexture === undefined){
        const matTex = new Texture(`./images/modeltex/${textureFileName}.jpg`, scene, false, false)
        material.diffuseTexture = matTex
        if(uVscaleTex){
            matTex.uScale = uVscaleTex
            matTex.vScale = uVscaleTex
        }
        
        return material
    }
    if(textureFileName.includes("hair")){
        material.emissiveColor = new Color3(colorTexture.r,colorTexture.g,colorTexture.b)
    }else{
        material.diffuseColor = new Color3(colorTexture.r,colorTexture.g,colorTexture.b)
    }    
    return material
}
export function createClone(toClone, pos, rotatY, cloneName){
    const cloned = toClone.clone(cloneName ? cloneName : toClone.name)
    cloned.position = new Vector3(pos.x,cloned.position.y, pos.z)
    if(rotatY) cloned.addRotation(0,rotatY,0)
}
export function putFakeShadow(parentOrPos, fakeShadowRoot, sizeShadow, posY, visibility){
    const newFakeShadow = fakeShadowRoot.createInstance('shadow')
    newFakeShadow.parent = null
    newFakeShadow.rotationQuaternion = null;
    newFakeShadow.visibility = visibility ? visibility : 1
    if(!parentOrPos.x) newFakeShadow.parent = parentOrPos
  
    if(posY) newFakeShadow.position = new Vector3(0,posY,0)
    if(sizeShadow) {
        newFakeShadow.scaling = new Vector3(sizeShadow,.1,sizeShadow)
    }
    if(parentOrPos.x){
        newFakeShadow.position.x = parentOrPos.x
        newFakeShadow.position.z = parentOrPos.z
    }
    return newFakeShadow
}
export function createMainShadow(scene){

    const fakeShadow = MeshBuilder.CreateGround("fakeShadow", {width: .9, height: .9}, scene)
    const fakeShadowMat = new StandardMaterial("fakeShadowMat", scene);
    fakeShadowMat.diffuseTexture = new Texture("./images/modeltex/fakeShadow.png", scene)
    
    fakeShadow.material = fakeShadowMat
    fakeShadowMat.specularColor = new Color3(0,0,0)
    fakeShadowMat.diffuseTexture.hasAlpha = true;
    fakeShadowMat.useAlphaFromDiffuseTexture = true;
    fakeShadow.position.y = 100

    return fakeShadow
}
export async function createWallStand(scene, pos, rotationY, tex, glbFileName){
    const stand = await importModel(scene, glbFileName, SceneLoader, false, pos)
    const wallMat = createMaterial(scene, tex.name, false, tex.uvScale)
    stand.material = wallMat
    return stand
}
export async function createOriginal(scene, pos, rotationY, textureDets, glbFileName){
    const wallRoot = await importModel(scene, glbFileName, SceneLoader, true)

    const wallR = wallRoot.meshes[0]
    wallR.position = new Vector3(pos.x,0,pos.z)
    if(rotationY) wallR.addRotation(0,rotationY,0)
    wallRoot.meshes.forEach(wallmsh => {
        const wallDet = textureDets.find(det => det.name === wallmsh.name)
        if(wallDet){
            let wallMat
            if(wallDet.emissive){
                wallMat = createMaterial(scene, wallDet.tex, wallDet.emissive, wallDet.uScale)
            }else{
                wallMat = createMaterial(scene, wallDet.tex, false, wallDet.uScale)
            }
            
            if(wallDet.isMetal) wallMat.metallic = 1
            if(wallDet.normal){                
                const normalTex = new Texture(`./images/modeltex/${wallDet.normal}.jpg`, scene, false, true)
                normalTex.uScale = wallDet.uScale
                normalTex.vScale = wallDet.uScale
                wallMat.bumpTexture = normalTex
                console.log(wallMat.bumpTexture)
            }
            wallMat.diffuseColor.level = wallDet.lighten ? wallDet.lighten : 1
            wallmsh.material = wallMat
        }
    })
    return wallR
}
export function createGround(scene, widthHeight, textureFileName, groundMeshes){
    const texturingType = typeof textureFileName
    if(texturingType === "object") {
        groundMeshes.forEach(grnd => {
            const groundPart = textureFileName.find(det => det.name === grnd.name)
          
            if(groundPart){
                const gMat = createMaterial(scene, groundPart.tex, false, groundPart.uScale)
                grnd.material = gMat
                grnd.position.y = groundPart.posY ? groundPart.posY : 0
            }
        })
    }

    // const ground = new MeshBuilder.CreateGround("ground", widthHeight, scene)
    // const groundMat = new StandardMaterial("groundMat", scene)
    // const groundTex = new Texture(`./images/modeltex/${textureFileName}.jpg`, scene)
    // groundMat.diffuseTexture = groundTex
    // groundMat.specularColor = new Color3(0,0,0)

    // groundTex.uScale = Math.floor(widthHeight.height * .3)
    // groundTex.vScale = Math.floor(widthHeight.height * .3)
    // ground.material = groundMat
    // return ground
}
export function createContainer(scene, toClone, pos, rotatY, scale, houseRoot){
    const houseContainer = toClone.clone("groundContainer")
    houseContainer.position = new Vector3(pos.x, houseContainer.position.y,pos.z)
    if(rotatY) houseContainer.addRotation(0,rotatY,0)
    if(scale) houseContainer.scaling = new Vector3(scale,houseContainer.scaling.y,scale)

    if(houseRoot){
        const houseClone = houseRoot.clone("wall")
        houseClone.position = new Vector3(pos.x, houseContainer.position.y,pos.z)
        if(rotatY) houseClone.addRotation(0,rotatY,0)
    }
}