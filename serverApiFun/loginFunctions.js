import { openCloseLScreen, openClosePopup } from "../tools/popups.js"
import {setPointerClickable, apiOpt, checkIfTokenSaved} from "../tools/tools.js"
import {APIURL, sessionStorageName, webSocketURL} from "../constants/constants.js"
import main from "../main/main.js"

const toRegisterElements = document.querySelectorAll(".toreg")
const toLoginElements = document.querySelectorAll(".tologin")
const container = document.querySelector(".login-container")

// input fields
const usernameInp = document.getElementById("usernameInp")
const passwordInp = document.getElementById("passwordInp")
const confirmpass = document.getElementById("confirmpass")
// Login Or Register Btn
const loginBtn = document.getElementById("loginBtn")
const registerBtn = document.getElementById("registerBtn")
const continueBtn = document.getElementById("continueBtn")
// Toggle Login Or Register
const toggleBtns = document.querySelectorAll(".toggleBtns")

const hasToken = checkIfTokenSaved()
if(hasToken) continueBtn.style.display="block"
async function loginFunctions(){
    const log = console.log
 
    let isLogin = true;
    function openCloseElements(_arrayOfElements, visibility){
        _arrayOfElements.forEach(elem => elem.style.display =visibility)
    }
    function clearTextOnInputFields(_arrayOfElements){
        _arrayOfElements.forEach(elem => elem.value = "")
    }
    function toggleLoginRegister(){
        clearTextOnInputFields([usernameInp, passwordInp, confirmpass]);
        openCloseElements(isLogin ? toLoginElements : toRegisterElements, "none")
        openCloseElements(isLogin ? toRegisterElements : toLoginElements , "block")
        isLogin = !isLogin
    }
    async function loginRegister(isLogin){
        setPointerClickable(container, "none")
        let smallErrorCap = undefined
        openClosePopup("Loading ...", true)
        if(!usernameInp.value || !passwordInp.value) smallErrorCap = "Fillup form"
        if(!isLogin){
            if(passwordInp.value !== confirmpass.value) smallErrorCap = 'Password did not match'
        }
        if(smallErrorCap !== undefined) return openClosePopup(smallErrorCap, true, 1500, ()=>setPointerClickable(container, "visible"))
        
        let toFetchUrl = `${APIURL}/users/login`
        if(!isLogin) toFetchUrl = `${APIURL}/users/register`
        const toPOST = {
            username: usernameInp.value, 
            password: passwordInp.value
        }
        try {
            const response = await fetch(toFetchUrl, apiOpt("POST", toPOST))
            if(!response) return openPopUp("Server Connection Error")
            const data = await response.json()
            if(data === "norecord" || data === "exist" || data === "Username Exist"){
                setPointerClickable(container, "none", 500)
                return openClosePopup(`Error: ${data}`, true, 2000)
            }
            // if(data.details.isAdmin) return initAdminPage()
            success(data)
        } catch (error) {
            setPointerClickable(container, "none", 500)
            openClosePopup(`Error: ${error}`, true, 2000)
            log(error)
        }
    }
    async function success(_dataForSessionStorage){
        sessionStorage.clear()
        sessionStorage.setItem(sessionStorageName, JSON.stringify(_dataForSessionStorage))
        
        openClosePopup("Loading ...", false)
        setPointerClickable(container, "none")
        setTimeout(async () => {
            const nextScene = await main.checkIfHeroCreated(_dataForSessionStorage)
            main.changeScene(nextScene)
        }, 500)
    }
    // FOR SWITCHING Login or Register
    toggleBtns && toggleBtns.forEach(btn => btn.addEventListener("click",()=>toggleLoginRegister()))
    // LOGIN REGISTER
    loginBtn.addEventListener("click", () => loginRegister(true))
    registerBtn.addEventListener("click", ()=> loginRegister(false))
    // CONTINUE
    continueBtn.addEventListener("click", async ()=>{
        console.log(hasToken)
        const nextScene = await main.checkIfHeroCreated(hasToken)
        main.changeScene(nextScene)
    })
}
export default loginFunctions;