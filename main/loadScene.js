import * as GUI from "babylonjs-gui"
//Scenes
import wisemanVillage from "../scenes/wisemanVillage.js";
import setupScene from "../scenes/setupScene.js";
import loginRegisterScene from "../scenes/loginRegister.js"

export default async function loadScene(engine, currentStage, BABYLON, accountDetail){
    let scene;
    switch(currentStage){
        case "loginRegister":
            scene = await loginRegisterScene(engine, BABYLON)
        break
        case "setupScene":
            scene = await setupScene(engine, BABYLON, GUI, accountDetail)
        break
        case "wisemanVillage":
            scene = await wisemanVillage(engine, BABYLON)
        break
    }
    console.log(`We are in ${currentStage}`)
    return scene;
}