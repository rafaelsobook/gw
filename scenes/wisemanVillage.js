//tools
import * as CharacterSystem from "../characterSystem/characterState.js"
import { startingDecorGarden, startingLampPos, startingVillageWallPos, startingVillageWallStand,startingVillageHousePos } from "../staticRecources/localData.js"
import {createClone, createContainer, createGround,createOriginal,createMainShadow, putFakeShadow, createMaterial,createWallStand} from "../createFunctions/creationTools.js"
import {randomNum, checkIfTokenSaved} from "../tools/tools.js"
import {setArcCam} from "../tools/cameraTools.js"
import createCharacter from "../createFunctions/createCharacter.js"
import { importSkeletalMesh, importModel,importGroundContainer } from "../SceneLoaders/tools.js"
import { createIcon, createPanel } from "../tools/GUITools.js"
import initPointerMovement from "../controllers/pointerMovement.js"


export default async function wisemanVillage(_engine, BABYLON){
    const areaSize = 100;
    const log = console.log
    const { Scene,Color3, Scalar, MeshBuilder, Texture, Vector3, StandardMaterial, ArcRotateCamera, SceneLoader } = BABYLON
    const myHeroDatabase = await CharacterSystem.initiateCharacter(checkIfTokenSaved())
   
    const scene = new Scene(_engine)
    scene.clearColor = new Color3(0.21, 0.2, 0.23)
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

    const church = await createOriginal(scene, {x:0,z:-77}, 0, [
        {name: "church", tex:"sement2", uScale: 20, lighten: 1},
        {name: "churchbrick", tex:"tile5", uScale: 20, lighten: 1},
        {name: "churchblue", tex:"tile6", uScale: 1, lighten: 1},
        {name: "churchdoor", tex:"gate1", uScale: 2, lighten: 1},
        {name: "churchiron", tex:"iron1", uScale: 3, lighten: 1},
        {name: "churchlight", tex:"iron2", emissive: {r:1,g:1,b:1}, uScale: 1, lighten: 1},
        {name: "churchrock", tex:"wall1", uScale: 3, lighten: 1},
        {name: "churchroof", tex:"roof3", uScale: 5, lighten: 1},
    ], "church")

    const decorGarden = await createOriginal(scene, {x:18,z:62}, 0, [
        {name: "standbrick", tex:"tile4", uScale: 1, lighten: 1.5},
        {name: "standwhite", tex:"sement2", uScale: 7 , lighten: 1},
        {name: "standgrass", tex:"grass1", uScale: 1, lighten: 1.5},
        {name: "stand", tex:"sement1", uScale: 3, lighten: 1.5},
    ], "decorGarden")

    const biglampL = await createOriginal(scene, {x:6,z:60}, 0, [
        {name: "biglampwood", tex:"wood1", uScale: 3, lighten: 1.5},
        {name: "biglampiron1", tex:"iron2", uScale: 3, lighten: 1.1},
        {name: "biglampiron2", tex:"iron1", uScale: 3, lighten: 1.5},
    ], "biglamp")

    const starterGate = await createOriginal(scene, {x:0,z:68}, -Math.PI/2, [
        {name: "gateBottom", tex:"tile8", uScale: 10, lighten: 1.5},
        {name: "gateIron", tex:"iron2", normal: "iron1diffuse", isMetal: true, uScale: 3, lighten: 1.5},
        {name: "gateWood", tex:"gate1", uScale: 2, lighten: 1.5},
        {name: "gateSement", tex:"wall1", uScale: 3, lighten: 1.5},
        {name: "villageGate", tex:"stonefloor", uScale: 10, lighten: 1.5},
    ], "starterGate")


    const wallL = await createOriginal(scene, {x: 39,z: 70 }, 0,
    [
        {name: "wallsement1", tex:"stonefloor", uScale: 7, lighten: 1.5},
        {name: "wallsement2", tex:"sement2", uScale: 10, lighten: 1.5},
        {name: "wallBottom", posY: 0, tex:"tile3", uScale: 10, lighten: 1.5},
    ], "wall")

    const wallStandL = await createWallStand(scene, {x: 11,z: 61 }, 0,
    {name:"wall3", uvScale: 2}, "wallStand")

    const bigHouseRf = await createOriginal(scene, {x:15,z:40}, Math.PI/2, [
        {name: "sement", tex:"sement1", uScale: 1, lighten: 1.5},
    ], "bigHouse")
    const bighouseLB = createClone(bigHouseRf,  {x:-15,z:-45}, Math.PI, "house")

    startingVillageWallPos.forEach(wallPosDet => {
        const wallClone = createClone(wallL, {x: wallPosDet.x,z:wallPosDet.z}, wallPosDet.rotatY)
    })
    startingDecorGarden.forEach(posdet => {
        createClone(decorGarden, {x: posdet.x,z:posdet.z}, posdet.rotatY)
    })
    startingVillageWallStand.forEach(posdet => {
        createClone(wallStandL, {x: posdet.x,z:posdet.z}, posdet.rotatY)
    })
    const groundContRoot = await importGroundContainer(scene, "groundContainer", SceneLoader, {name:"tile7", scale: 16},{name:"sement1", scale: 9.4}, {x: 0, z: 0})
    const MedeivalHouse = await importModel(scene, "hl_club", SceneLoader, false, {x: -17, z: 23}, Math.PI/2)

    

    startingVillageHousePos.forEach(posdet => {
        createContainer(scene, groundContRoot, {x: posdet.x,z:posdet.z }, posdet.rotatY, 1, MedeivalHouse)
    })
    startingLampPos.forEach(posdet => {
        createClone(biglampL, {x: posdet.x,z:posdet.z}, posdet.rotatY)
        putFakeShadow({x:posdet.x,z: posdet.z}, mainShadow, 3, .05)
    })
    MedeivalHouse.dispose()
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

    await scene.whenReadyAsync()
    return scene
}