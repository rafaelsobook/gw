import loginFunctions from "../serverApiFun/loginFunctions.js"
loginFunctions();

export default async function loginRegisterScene(_engine, BABYLON){
    const scene = new BABYLON.Scene(_engine)
    scene.createDefaultCamera()

    return scene
}