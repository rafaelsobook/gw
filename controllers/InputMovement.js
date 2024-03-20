let moveNums = {
    straight: 0,
    leftRight: 0
}

export function inputMovement(){
    document.addEventListener("keydown", e => {
        const keyPressed = e.key.toLowerCase()
        switch(keyPressed){
            case "w":
                moveFunc()
                moveNums.straight = 0
                moveNums.straight = 1
                this.btf.locallyTranslate(new Vector3(moveNums.leftRight * btfRadius,0,moveNums.straight * btfRadius))
                this.myChar._moving = true
                sendToSocket()
            break
            case "a":
                moveFunc()

                moveNums.leftRight = 0
                moveNums.leftRight = -1
                this.btf.locallyTranslate(new Vector3(moveNums.leftRight * btfRadius,0,moveNums.straight *btfRadius))
                this.myChar._moving = true
                sendToSocket()
            break
            case "d":
                moveFunc()

                moveNums.leftRight = 0
                moveNums.leftRight = 1
                this.btf.locallyTranslate(new Vector3(moveNums.leftRight * btfRadius,0,moveNums.straight * btfRadius))
                this.myChar._moving = true
                sendToSocket()
            break
            case "s":
                moveFunc()
                moveNums.straight = 0
                moveNums.straight = -1
                this.btf.locallyTranslate(new Vector3(moveNums.leftRight * btfRadius,0,moveNums.straight * btfRadius))
                this.myChar._moving = true
                sendToSocket()
            break
            case "alt":
                log("clicking the alt")
                this.disableMoving()
            break
            case "shift":
                const leapSkill = this.det.skills.find(skll => skll.name === "leap")
                if(!leapSkill) return this.showTransaction("No Leap Skill", 1000)
                skillCont.childNodes.forEach(chld => {
                    if(!chld.className) return
                    if(chld.className.split(" ")[1] === "leap"){
                        chld.click();
                    }
                }) 
            break;
        }
    })
    document.addEventListener("keyup", e => {
        const keyPressed = e.key.toLowerCase()
        switch(keyPressed){
            case "w":
                moveNums.straight = 0
                
                if(moveNums.leftRight === 0) {this.stopMoving()}else{
                    resetBtfLookAndPos()
                    this.btf.locallyTranslate(new Vector3(moveNums.leftRight * btfRadius,0,moveNums.straight * btfRadius))
                    this.socketAvailable && this.socket.emit("redirectTarg", {_id: this.det._id, dirTarg: { x: this.btf.position.x, z: this.btf.position.z}})
                }
            break
            case "a":
                moveNums.leftRight = 0
                
                if(moveNums.straight === 0) {this.stopMoving()}else{
                    resetBtfLookAndPos()
                    this.btf.locallyTranslate(new Vector3(moveNums.leftRight * btfRadius,0,moveNums.straight * btfRadius))
                    this.socketAvailable && this.socket.emit("redirectTarg", {_id: this.det._id, dirTarg: { x: this.btf.position.x, z: this.btf.position.z}})
                }
            break;
            case "d":
                moveNums.leftRight = 0
                
                if(moveNums.straight === 0) {this.stopMoving()}else{
                    resetBtfLookAndPos()
                    this.btf.locallyTranslate(new Vector3(moveNums.leftRight * btfRadius,0,moveNums.straight * btfRadius))
                    this.socketAvailable && this.socket.emit("redirectTarg", {_id: this.det._id, dirTarg: { x: this.btf.position.x, z: this.btf.position.z}})
                }
            break;
            case "s":
                moveNums.straight = 0   
               
                if(moveNums.leftRight === 0) {this.stopMoving()}else{
                    resetBtfLookAndPos()
                    this.btf.locallyTranslate(new Vector3(moveNums.leftRight * btfRadius,0,moveNums.straight * btfRadius))
                    this.socketAvailable && this.socket.emit("redirectTarg", {_id: this.det._id, dirTarg: { x: this.btf.position.x, z: this.btf.position.z}})
                }
            break
    
        }
    })

}