import {APIURL, sessionStorageName, heroLocalStorageName} from "../constants/constants.js"
import { useFetch, checkIfTokenSaved} from "../tools/tools.js"

export default async function createStartGame(_dataToSave, accountDetail){
    if(!accountDetail) return console.log("No account details")
    const data = await useFetch(`${APIURL}/characters/save`, 'POST', accountDetail.token, _dataToSave)
    if(data === "exist") return data
    // sessionStorage.setItem(heroLocalStorageName, JSON.stringify(data))
    return data
}