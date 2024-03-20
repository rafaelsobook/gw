import getHeroDetail from "../serverApiFun/getHeroDetail.js"

//tools
import { startingVillageWallPos, startingVillageWallStand,startingVillageHousePos } from "../staticRecources/localData.js"
import {createClone, createContainer, createGround,createOriginal,createMainShadow, putFakeShadow, createMaterial,createWallStand} from "../createFunctions/creationTools.js"
import {randomNum, checkIfTokenSaved} from "../tools/tools.js"
import {setArcCam} from "../tools/cameraTools.js"
import createCharacter from "../createFunctions/createCharacter.js"
import { importSkeletalMesh, importModel,importGroundContainer } from "../SceneLoaders/tools.js"

import initPointerMovement from "../controllers/pointerMovement.js"

import {APIURL, sessionStorageName, webSocketURL} from "../constants/constants.js"
import { useFetch } from "../tools/tools.js"
export default async function wisemanVillage(_engine, BABYLON){
    const areaSize = 100;
    const log = console.log
    const { Scene, Scalar, MeshBuilder, Texture, Vector3, StandardMaterial, ArcRotateCamera, SceneLoader } = BABYLON
    // const myHeroDatabase = await getHeroDetail(checkIfTokenSaved())
    const hDet = checkIfTokenSaved()
    const myHeroDatabase = await useFetch(`${APIURL}/characters/${hDet.details._id}`, "GET", hDet.token, false)
    const scene = new Scene(_engine)
    // scene.debugLayer.show()
    scene.createDefaultLight()
    const cam = new ArcRotateCamera("cam", 1,1,5, new Vector3(0,0,0), scene)
    cam.attachControl()

    const mainShadow = createMainShadow(scene)
    const Grnd = await importModel(scene, "villageGround", SceneLoader, true, {x:0,z:0})
    
    createGround(scene, {width: 200, height: 200}, 
    [
        {name: "pathway", posY: 0, tex:"stonefloor", uScale: 30},
        {name: "ground", tex:"tile3", uScale: 15},
        {name: "sement", posY: 0, tex:"sement1", uScale: 15},
    ], Grnd.meshes)

    const starterGate = await createOriginal(scene, {x:0,z:68}, -Math.PI/2, [
        {name: "gateBottom", tex:"tile8", uScale: 10, lighten: 1.5},
        {name: "gateIron", tex:"iron2", normal: "iron1diffuse", isMetal: true, uScale: 3, lighten: 1.5},
        {name: "gateWood", tex:"gate1", uScale: 2, lighten: 1.5},
        {name: "gateSement", tex:"wall1", uScale: 3, lighten: 1.5},
        {name: "villageGate", tex:"stonefloor", uScale: 10, lighten: 1.5},
    ], "starterGate")
    createClone(starterGate, {x: 0, z: -67}, Math.PI)

    const wallL = await createOriginal(scene, {x: 40,z: 70 }, 0,
    [
        {name: "wallsement1", tex:"stonefloor", uScale: 7, lighten: 1.5},
        {name: "wallsement2", tex:"sement2", uScale: 10, lighten: 1.5},
        {name: "wallBottom", posY: 0, tex:"tile3", uScale: 10, lighten: 1.5},
    ], "wall")

    const wallStandL = await createWallStand(scene, {x: 11,z: 61 }, 0,
    {name:"wall3", uvScale: 2}, "wallStand")

    startingVillageWallPos.forEach(wallPosDet => {
        const wallClone = createClone(wallL, {x: wallPosDet.x,z:wallPosDet.z}, wallPosDet.rotatY)
    })
    
    startingVillageWallStand.forEach(posdet => {
        createClone(wallStandL, {x: posdet.x,z:posdet.z}, posdet.rotatY)
    })
    const groundContRoot = await importGroundContainer(scene, "groundContainer", SceneLoader, {name:"tile7", scale: 16},{name:"sement1", scale: 11}, {x: -17, z: 23})
    const MedeivalHouse = await importModel(scene, "hl_club", SceneLoader, false, {x: -17, z: 23}, Math.PI/2)

    startingVillageHousePos.forEach(posdet => {
        createContainer(scene, groundContRoot, {x: posdet.x,z:posdet.z }, posdet.rotatY, 1, MedeivalHouse)
    })

    // fake shadow
    for(var i = 0;i <= 20; i++){
        // const shadowXpos = Scalar.RandomRange(-areaSize,areaSize)
        // const shadowZpos = Scalar.RandomRange(-areaSize,areaSize)
        // putFakeShadow({x:shadowXpos,z: shadowZpos}, mainShadow, Scalar.RandomRange(20, 35), .08, .1)
    }
    // Characters creations is always last because characters are spawning everytime
    const HairModel = await importModel(scene, "hairModels", SceneLoader, true)
    const characterRoot = await importSkeletalMesh(scene, "gameCharacter", SceneLoader)
    const hero = createCharacter(BABYLON,myHeroDatabase, characterRoot, scene, HairModel.meshes, mainShadow)
    setArcCam(cam,hero.body, true)

    // // creating fog
    // scene.fogColor = new BABYLON.Color3(0.9, 0.9, 0.85);
    // scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    // scene.fogDensity = 0.01;
    initPointerMovement(_engine, scene, hero.body, hero.anims, 3.5, BABYLON)

    hero.body.position.z = 0    
    document.addEventListener("keyup", e => e.key === " " && log(hero.body.position))
    return scene
}