import start from "../main/main.js"

//tools
import {setArcCam} from "../tools/cameraTools.js"
import {randomNum, playAnim, setDisplayElem, checkIfTokenSaved} from "../tools/tools.js"
import {createGUIbtn, createPanel, createTextBlock, inputField} from "../tools/GUITools.js"
import wisemanVillage from "./wisemanVillage.js"

import createStartGame from "../serverApiFun/createAndStart.js"
import { openCloseLScreen, openClosePopup } from "../tools/popups.js"

export default async function setupScene(_engine, BABYLON, GUI, accountDetail){
    setDisplayElem("login-page", "none")
    openCloseLScreen("normal", true)
    const log = console.log
    const {Scene, MeshBuilder, Vector3, SceneLoader, Color3, StandardMaterial, Texture, ArcRotateCamera, HemisphericLight, DirectionalLight, ShadowGenerator } = BABYLON
    let clothes = []
    let hairs = []
    let pants = []
    let boots = []

    const scene = new Scene(_engine)
    const cam = new ArcRotateCamera("arcCam", Math.PI/2, -1, 5, new Vector3(0,0,0), scene)
    cam.attachControl(true)
 
    scene.clearColor = new BABYLON.Color4(0.1, 0.2, 0.3, 1); // Dark blue    

    const hemLight = new HemisphericLight("HemiLight", new Vector3(0, 1, 0), scene);
    hemLight.intensity = .5

    const dirLight = new DirectionalLight("dirlight", new Vector3(-1,-1,-1), scene)
    dirLight.intensity = .3
    let shadowGen = new ShadowGenerator(1028, dirLight)
    // await this.createInstances("grass2",500, -20, 60, scene)
    const hairMat = new StandardMaterial('hairmat', scene)
    hairMat.backFaceCulling = false;
    hairMat.specularColor = new BABYLON.Color3(0,0,0)
    const clothMat = new StandardMaterial('clothMat', scene)
    clothMat.backFaceCulling = false;
    clothMat.specularColor = new BABYLON.Color3(0,0,0)
    const pantsMat = new StandardMaterial('pantsMat', scene)
    pantsMat.backFaceCulling = false;
    pantsMat.specularColor = new BABYLON.Color3(0,0,0)
    
    // import character 
    const {meshes, animationGroups} = await SceneLoader.ImportMeshAsync("", "./models/", "gameCharacter.glb");
    let headBone 
    meshes[0].getChildren()[0].getChildren().forEach(bne => {
        if(bne.name === "pelvis"){
            headBone = bne.getChildren()[0].getChildren()[0].getChildren()[0].getChildren()[0]
        }
    })
    // Import hair
    const HairModel = await SceneLoader.ImportMeshAsync("", "./models/", "hairModels.glb", scene)
    HairModel.meshes.forEach(hairMsh => {
        if(hairMsh.name.includes("root")) return hairMsh.parent = headBone
        hairMsh.material = hairMat
        hairMsh.parent = headBone
        hairMsh.rotationQuaternion = null
        hairMsh.position = new Vector3(0,.45,-.1)
        hairMsh.scaling = new Vector3(8,8,8)
        hairs.push(hairMsh)
    })
    HairModel.meshes[0].dispose()
    meshes.forEach(mesh => {
        const meshPartName = mesh.name.toLowerCase()
        if(meshPartName.includes("ref")) return mesh.dispose();
        if(meshPartName.includes("hiddenbody")) return mesh.dispose();
        if(meshPartName.includes("scalp")) return mesh.material = hairMat
        const toPush = mesh.name.split(".")[1]
        if(toPush === undefined) return
        
        if(meshPartName.includes("cloth")) {
            mesh.material = clothMat
            clothes.push(mesh)
            meshPartName.includes("style2") ? mesh.isVisible = true : mesh.isVisible = false
        }
        if(meshPartName.includes("hair")){
            mesh.material = hairMat
            meshPartName.includes("aegon") ? mesh.isVisible = true : mesh.isVisible = false
        } 
        if(meshPartName.includes("pants")){
            mesh.material = pantsMat
            pants.push(mesh)
            meshPartName.includes("style2") ? mesh.isVisible = true : mesh.isVisible = false
        } 
        if(meshPartName.includes("boots")){
            boots.push(mesh)
            meshPartName.includes("classic") ? mesh.isVisible = true : mesh.isVisible = false
        } 
        shadowGen.addShadowCaster(mesh)
        if(meshPartName.includes("armor")) mesh.dispose()
        if(meshPartName.includes("gear")) mesh.dispose()
        // light.excludedMeshes.push(mesh)
    })
    playAnim(animationGroups, "Idle", true)

    let toSave = {
        owner: accountDetail.details._id,
        name: "",
        stats: {weapon: 1, accuracy: 2, critical: 1, meelee: 1, dex: 1, strength: 1, magic: 1},
        cloth: 'style1',
        pants: 'style1',
        hair: 'style1',
        boots: 'none',
        hairColor: {r: 0, g: 0, b: 0},
        clothColor: {r: 0, g: 0, b: 0},
        pantsColor: {r: 0, g: 0, b: 0},
        items: [],
        titles: ['newbie'],
        clearedQuests: 0,
        currentPlace: 'wisemanVillage',
        regens: {sp: 1, hp: .3, mana: .3}, // buy books to increase
        z: -30,
        // aptitude: getAptitudes(),
        storyQue: ['firstTest'],
        skills: [{
            name: "flexaura",
            lvl: 1,
            pointsToClaim: 1,
            pointsForUpgrade: 1,
            element: "normal",
            requireMode: "any",
            skillType: "na", // buff // attack // passive // na
            animationLoop: false,
            displayName: "Flex aura",
            castDuration: 10,
            returnModeDura: 900,
            skillCoolDown: 1000 * 2,
            demand: {name:"mp", minCost: 1, cost: .3}, // percent of mana and min cost
            effects: { effectType: "buff", dmgPm: 0, plusDmg: 0, chance: 10, bashPower: 10},
            tier: "common",  
            upgradePlus: 60,      
            desc: "Show and Unleash the force within you"
        },],
        race: "human"
    }
    // GUI
    var UITexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    let categoryName
    const rightPanel = createPanel(GUI, {
        width: "26%",
        height: "45%",
        background: "#252525FF",
        pt: "50px",
        panelName: "list"
    }, false, UITexture)
    rightPanel.top = "-100px"
    const btnDet = {
        width: "200px" ,
        height: "37px",
        color: "gray",
        pt: "15px",
        btnName: "",
        label: "",
        background: "#3D3D3DFF",
    }
    const leftPanel = createPanel(GUI, {
        width: "30%", height: "44%", background: "#252525FF", pt: "50px"
    }, true, UITexture)

    var colorPanel = createPanel(GUI, {width: "200px", panelName: "ColorPanel",
    pt: "40px"}, false, UITexture)
    colorPanel.isVertical = true;
    colorPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
    colorPanel.top = "-120px"
    colorPanel.left = "-12%"

    var textBlock = createTextBlock(GUI, { text: "Cloth Color", color: "White", height: "30px"}, colorPanel)

    var picker = new GUI.ColorPicker();
    picker.value = hairMat.diffuseColor;
    picker.height = "150px";
    picker.width = "150px";
    picker.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;

    picker.onValueChangedObservable.add(function(value) { // value is a color3
        if(categoryName === "boots") return
        let mat
        const {r,g,b} = picker.value
        switch(categoryName){
            case "hair":
                mat = hairMat
                toSave = {...toSave, hairColor: {r,g,b}}
            break
            case "clothes":
                mat = clothMat
                toSave = {...toSave, clothColor: {r,g,b}}
            break
            case "pants":
                mat = pantsMat
                toSave = {...toSave, pantsColor: {r,g,b}}
            break;
        }
        if(categoryName === "hair"){
            mat.emissiveColor.copyFrom(value);
        }else{
            mat.diffuseColor.copyFrom(value);
        }
    });
    colorPanel.addControl(picker);  
    
    var categories = ["Hair", "Clothes", "Pants", "Boots"];
    categories.forEach(function (category) {
        const categBtn = createGUIbtn(GUI, {...btnDet, btnName: category, label: category})
        categBtn.onPointerUpObservable.add(function () {
            updateList(category);
        });
        if(category === "Clothes") updateList(category);
        leftPanel.addControl(categBtn);
    })
    function updateList(_categName){
        rightPanel.clearControls()
        categoryName = _categName.toLowerCase();
        let categLists
        textBlock.text = `${_categName} Color`;
        switch(categoryName){
            case "hair":
                colorPanel.isVisible = true
                categLists = hairs
            break
            case "clothes":
                colorPanel.isVisible = true
                categLists = clothes
            break
            case "pants":
                colorPanel.isVisible = true
                categLists = pants
            break;
            case "boots":
                colorPanel.isVisible = false
                categLists = boots
            break;
        }
        if(!categLists) return log("NO Categ List for this")
        categLists.forEach(mesh => {
            if(!mesh) return log("No Style for this")
            const theMeshName = mesh.name.split(".")[1]
            if(!theMeshName) return log("No Mesh With Style")
            const choiceBtn = createGUIbtn(GUI, {...btnDet, btnName: theMeshName, label: theMeshName})
            rightPanel.addControl(choiceBtn)

            choiceBtn.onPointerUpObservable.add(function () {
                categLists.forEach(msh => {
                    msh.isVisible = msh.name === mesh.name
                    switch(categoryName){
                        case "hair":
                            toSave = {...toSave, hair: theMeshName}
                        break
                        case "clothes":
                            toSave = {...toSave, cloth: theMeshName}
                        break
                        case "pants":
                            toSave = {...toSave, pants: theMeshName}
                        break;
                        case "boots":
                            toSave = {...toSave, boots: theMeshName}
                        break;
                    }
                })
            });
        })
    }
    const inpName = inputField(GUI, {
        width: "250px",
        height: "25px",
        background: "#252525FF",
        color: "white",
        label: "Enter Character Name"
    }, UITexture)

    const startBtn = createGUIbtn(GUI, {...btnDet, btnName: "startBtn", label:"Start Game"})
    startBtn.onPointerUpObservable.add( async () => {
        startBtn.isVisible = false
        if(!inpName.text) return openClosePopup("Invalid Text Field", true, 1500, ()=>startBtn.isVisible = true)
 
        const playerDet = {...toSave, name: inpName.text }
        const result = await createStartGame(playerDet, accountDetail)
        if(result === "exist") return openClosePopup("Name Already Taken", true, 1000, ()=>startBtn.isVisible = true)
        setTimeout( async () =>{
            console.log(result)
            const newScene = await wisemanVillage(_engine, BABYLON)
            start.changeScene(newScene)
        }, 500)
    })
    inpName.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
    startBtn.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
    inpName.top="-14%"
    startBtn.top="-10%"

    UITexture.addControl(startBtn)

    await scene.whenReadyAsync()
    openCloseLScreen("normal", false)
    setArcCam(cam,new Vector3(0,.7,0))
    return scene
}