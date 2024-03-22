import BabylonModules from "./BabylonModule.js"
import "babylonjs-loaders"

import loadScene from "./loadScene.js"
import {setDisplayElem} from "../tools/tools.js"
import getHeroDetail from "../serverApiFun/getHeroDetail.js"
import { activateBtnOnce } from "../characterSystem/characterState.js"

const {BABYLON} = BabylonModules
let engine = new BABYLON.Engine(document.querySelector("canvas"), true)
let scene = new BABYLON.Scene(engine);
scene.createDefaultCamera()

function changeScene(newScene){
    console.log("Changing Scene")
    scene.dispose()
    scene = newScene
}
async function checkIfHeroCreated(accountDetail){
    setDisplayElem("login-page", "none")
    const heroDetail = await getHeroDetail(accountDetail)
    console.log(heroDetail)
    if(!heroDetail.owner){
        console.log("wala pang owner kaya bago lang")
        const setUpScene = await loadScene(engine, "setupScene", BABYLON, accountDetail)
        return setUpScene
    }else{
        console.log("meron ng owner")
        // sessionStorage.setItem(heroLocalStorageName, JSON.stringify(heroDetail))
        const heroLastPlaceScene = await loadScene(engine, heroDetail.currentPlace, BABYLON)
        return heroLastPlaceScene
    }
}
async function main(){

    scene = await loadScene(engine, "loginRegister", BABYLON)
    
    engine.runRenderLoop(() => {
        scene.render()
    })
    window.addEventListener("resize", () => engine.resize())
    activateBtnOnce()
}
export default { main, scene,engine, changeScene, checkIfHeroCreated }