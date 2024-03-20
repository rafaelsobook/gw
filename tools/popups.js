const popupStyle1 = document.querySelector(".popstyle1")

const mainLoadingScreen = document.querySelector(".loading-screen")
const loadingImg = document.querySelector(".lc-img")
const loadingPercent = document.querySelector(".ls-percent")
const loadingTipsLabel = document.querySelector(".ls-tips")

export function openClosePopup(_popMessage, willOpen, timeOut, cb){
    const label = popupStyle1.childNodes[0]
    label.innerHTML = _popMessage; 

    willOpen ? popupStyle1.classList.remove("popup-close") : popupStyle1.classList.add("popup-close")

    timeOut && setTimeout(() =>{
        popupStyle1.classList.add("popup-close")
        cb && cb()
    }, timeOut)
}
export function openCloseLScreen(loadType, willOpen, timeOut){
    if(willOpen){
        mainLoadingScreen.style.display="flex"
        mainLoadingScreen.classList.remove("screenFadeOff")
    }else{
        mainLoadingScreen.classList.add("screenFadeOff")
        setTimeout(()=> mainLoadingScreen.style.display="none",800)
    }
    timeOut && setTimeout(() =>{
        mainLoadingScreen.classList.add("screenFadeOff")
        setTimeout(()=> mainLoadingScreen.style.display="none",1000)
    }, timeOut)
}