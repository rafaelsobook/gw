import {APIURL, sessionStorageName, webSocketURL} from "../constants/constants.js"
import { useFetch } from "../tools/tools.js"

export default async function getHeroDetail(accountDet){
    console.log('session storage msor ',accountDet)
    if(!accountDet.details) return console.log("NO SessionStorage Msor(accounts)")
    const data = await useFetch(`${APIURL}/characters/${accountDet.details._id}`, "GET", accountDet.token, false)
    console.log(data)
    return data
}