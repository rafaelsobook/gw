import { playAnim, stopAnim } from "../tools/tools.js"


export default function initPointerMovement(engine,scene,body,anims,charSpeed, BABYLON){
    const unableToClicks = ['wall', 'gate', 'box', 'sement', 'stand', 'tavern']//dapat sa mga pathways walang gantong name
    let isMoving = false
    let pickedPos = undefined
    const {Vector3} = BABYLON
    playAnim(anims, "Idle", true)
    function stop(){
        isMoving = false
        stopAnim(anims, "running")
    }
    function move(){
        const pickInfo = scene.pick(scene.pointerX, scene.pointerY)
        if(!pickInfo.hit) return stop()
        const clickedMeshName = pickInfo.pickedMesh.name.toLowerCase()
        let isUnableToclick = false
        console.log(clickedMeshName)
        unableToClicks.forEach(nme => {            
            if(clickedMeshName.includes(nme)) isUnableToclick=true
        })
        if(isUnableToclick) {
            stop()
            return console.log("Clicked mesh unable to click")
        }
        const {x,y,z} = pickInfo.pickedPoint
        pickedPos = pickInfo.pickedPoint
        body.lookAt(new Vector3(x, body.position.y, z), 0,0,0)
        const distance = Vector3.Distance(pickInfo.pickedPoint,{...body.position, y})
        
        if(distance < 1.2 || distance <= .1) return stop()
        playAnim(anims, "running", true)
        isMoving = true
    }
    function checkDistance(body){
        const distance = Vector3.Distance(pickedPos, {...body.position, y:pickedPos.y})
        if(distance < 1.2 || distance <= .1) return stop()
    }
    scene.onPointerDown = e => {
        if(e.buttons === 1)move()
    }
    
    scene.registerAfterRender(() => {
        const deltaTime = engine.getDeltaTime()/1000
        if(isMoving) {
            body.locallyTranslate(new Vector3(0,0, charSpeed * deltaTime))
            checkDistance(body)
        }
        
    })
}