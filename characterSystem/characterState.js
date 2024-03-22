import getHeroDetail from "../serverApiFun/getHeroDetail.js"

// LIFE MANA STAMINA
const lifeManaStamCont = document.querySelector(".simple-details-gui")
const lvlAndName = document.querySelector(".lvl-name")
const lifeBar = document.querySelector(".life-ui")
const manaBar = document.querySelector(".mana-ui")
const lifeCap = document.querySelector(".lifeCap")
const manaCap = document.querySelector(".manaCap")
const stamBar = document.querySelector(".stamina-bar")
const stamCap = document.querySelector(".stamCap")

const hungStat = document.querySelector(".hungStat")
const restStat = document.querySelector(".restStat")
// negative stats
const negativeStatCont = document.querySelector(".negative-stats")
// Icons Right
const iconsContainer = document.querySelector(".icons-container")
const inventoryBtn = document.getElementById("inventoryBtn")
// Inventory
const inventoryCont = document.querySelector(".inventory-container")

const log = console.log
let characterState

let hpRegenInterval
let mpRegenInterval
let spRegenInterval

let hungerInterval
let restInterval

// ACTIVATIONS
export function activateLifeSystem(){
    const {name, lvl} = characterState
    lvlAndName.innerHTML = `lvl ${lvl} ${name}`

    clearIntervals()
    lifeManaStamCont.style.display = "block"
    // HP
    hpRegenInterval = setInterval( () => {
        if(characterState.hp <= 0) return clearIntervals()
        if(characterState.hp <= characterState.maxHp) characterState.hp += characterState.regens.hp
        if(characterState.hp > characterState.maxHp) characterState.hp = characterState.maxHp
        updateHP_UI()
        
    }, 700)
    // MANA
    mpRegenInterval = setInterval( () => {
        if(characterState.mp < characterState.maxMp) characterState.mp += characterState.regens.mana
        if(characterState.mp > characterState.maxMp) characterState.mp = characterState.maxMp
        updateMP_UI()
    }, 700)
    // STAMINA
    spRegenInterval = setInterval( () => {
        if(characterState.sp < characterState.maxSp) characterState.sp += characterState.regens.sp
        if(characterState.sp > characterState.maxSp) characterState.sp = characterState.maxSp
        updateSP_UI()
    }, 500)
    updateHunger()
    
    hungerInterval = setInterval(() => {
        updateHunger()
    }, 40.5 * 1000)
    // I PUT THE STATS DEDCUTION HERE
    restInterval = setInterval(() => {
        if(characterState.survival.sleep > 0) characterState.survival.sleep-=.2
        if(characterState.survival.sleep < 0.2) characterState.survival.sleep = 0
        updateSurvival_UI();
        if(characterState.survival.sleep < 10){
            restStat.parentElement.children[0].style.animation = "blinkingRed .5s infinite"
        }else{
            restStat.parentElement.children[0].style.animation = "none"
        }

        // FOR STATUS EFFECTS
        if(characterState.status.length){
            characterState.status.forEach(effect => {
                switch(effect.effectType){
                    case "poisoned":
                        characterState.hp -= effect.dmgPm
                        createBloodParticle("poisonTex",300, myChar.bx.position, "sphere", true, 1, true, undefined)
                        createTextMesh(makeRandNum(), `poisoned ${effect.dmgPm}`, "green", myChar.bx.position, 90, _scene, true, false)
                    break
                }
            })
            if(characterState.hp <= 0) initMyDeath()
        }
    }, 5.2 * 1000)
    log("successfully made the life") 
}
export async function initiateCharacter(_accountDet){
    characterState = await getHeroDetail(_accountDet)
    console.log(characterState)
    activateLifeSystem(characterState)
    return characterState
}

export function getCharState(){
    return characterState
}
export function clearIntervals(){
    clearInterval(hpRegenInterval)
    clearInterval(mpRegenInterval)
    clearInterval(spRegenInterval)
}
export function updateHunger(){
    const det = getCharState()
    if(characterState.survival.hunger > 0) characterState.survival.hunger-=1
    updateSurvival_UI();
    const toDeduct = characterState.maxHp*.1 // 10% of life

    if(characterState.hp > toDeduct && characterState.survival.hunger < 1){
        characterState.hp -= toDeduct
        _statPopUp(`- ${toDeduct}hp hunger`, 500, 'crimson');
        if(characterState.hp <= 0) return playerDeath(myChar)
    }
    if(characterState.survival.hunger < 13){
        _allSounds.hungryS?.play()
        hungStat.parentElement.children[0].style.animation = "blinkingRed .5s infinite"
    }else{
        hungStat.parentElement.children[0].style.animation = "none"
    }
}
export function deductHp(dmg){
    if(characterState.hp <= dmg) return gameOver();
    characterState.hp -= dmg
    characterState.hp = Math.floor(characterState.hp)
}
export function gameOver(){
    log("GAME OVER")
    clearIntervals()
    characterState.hp = 0
    characterState.mp = 0
    characterState.sp = 0

    characterState.survival.hunger = 0
    characterState.survival.sleep = 0
    updateHpMpSp_UI()
    updateSurvival_UI()
}
// UPDATING UI
export function updateHP_UI(){
    lifeBar.style.width = `${(characterState.hp/characterState.maxHp) * 100}%`
    lifeCap.innerHTML = `${Math.floor(characterState.hp)}/${characterState.maxHp}`
}
export function updateMP_UI(){
    manaBar.style.width = `${(characterState.mp/characterState.maxMp) * 100}%`
    manaCap.innerHTML = `${Math.floor(characterState.mp)}/${characterState.maxMp}`
}
export function updateSP_UI(){
    stamBar.style.width = `${(characterState.sp/characterState.maxSp) * 100}%`
    stamCap.innerHTML = `${characterState.sp}/${characterState.maxSp}`
}
export function updateSurvival_UI(){
    const {sleep, hunger} = characterState.survival
    hungStat.innerHTML = Math.floor(hunger)
    restStat.innerHTML = Math.floor(sleep)
}
export function updateHpMpSp_UI(){
    updateHP_UI()
    updateMP_UI()
    updateSP_UI()
}
// INVENTORY LOGIN
export function openUpdateInventory(){
    inventoryCont.style.display = "flex"
}
function closeInventory(){
    inventoryCont.style.display = "none"
}
export function activateBtnOnce(){
    inventoryBtn.addEventListener("click", () => {
        inventoryCont.style.display === "none" ? openUpdateInventory() : closeInventory()
    })  
    
    // all close buttons
    const closeBtns = document.querySelectorAll(".close-parent")
    closeBtns.forEach(btn => {
        btn.addEventListener("click", e=> e.target.parentElement.style.display="none")
    })
}