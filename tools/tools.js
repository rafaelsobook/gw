import { sessionStorageName, heroLocalStorageName } from "../constants/constants.js"
export const apiOpt = (meth, toPost, token) => {
    if(!toPost){
        return {
            method: meth, // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
            'authori': token ? `fawad ${token}` : '',
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        }
    }else{
        return {
            method: meth, // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
            'authori': token ? `fawad ${token}` : '',
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: toPost ? JSON.stringify(toPost) : ''
        }
    }    
}
export async function useFetch(address, meth, tok, theBody){
    try{
        const response = await fetch(address, apiOpt(meth, theBody, tok))
        if(!response) return "response error"
        const data = await response.json()
        return data
    }catch(err){
        return  log(err)
    }
}
export function checkIfTokenSaved(){
    const details = JSON.parse(sessionStorage.getItem(sessionStorageName))
    if(!details) return false
    return details
}
export function checkIfHeroDataSaved(){
    const details = JSON.parse(sessionStorage.getItem(heroLocalStorageName))
    if(!details) return false
    return details
}
export function setDisplayElem(className, displayName){
    document.querySelector(`.${className}`).style.display=displayName
}
export function randomNum(){
    return `${Math.random().toLocaleString().split(".")[1]}${Math.random().toLocaleString().split(".")[1]}`
}
export function setPointerClickable(_element, pointerEvent, timeout){
    _element.style.pointerEvents = pointerEvent

    timeout && setTimeout(() => _element.style.pointerEvents="visible" ,timeout)
}
export function setAnimSpeed(anims, animName, spd){
    anims.forEach(anim => {
        if(anim.name === animName) anim.speedRatio = spd
    })
}
export function playAnim(anims, animName, isLooping, scene){
    let currentAnimation
    let newAnimation
    anims.forEach(anim => {
        if(anim.isPlaying) currentAnimation = anim
        if(anim.name === animName) newAnimation = anim
    })
    // if(scene){
    //     if(currentAnimation || newAnimation){
    //         BABYLON.Animation.TransitionTo(
    //             currentAnimation,
    //             newAnimation,
    //             .5,
    //             scene,
    //             1
    //         )
    //     }
    // }
    currentAnimation && console.log(currentAnimation.name)
    anims.forEach(anim => anim.name === animName && anim.play(isLooping))
}
export function stopAnim(anims, animName, isStopAll){
    anims.forEach(anim => isStopAll ? anim.stop() : anim.name === animName && anim.stop())
}
