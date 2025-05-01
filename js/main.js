
const whiteKeys = document.querySelectorAll(".white-key");
const blackKeys = document.querySelectorAll(".black-key");

const whiteKeysContainer = document.querySelector(".piano-white-keys");
const blackKeysContainer = document.querySelector(".piano-black-keys");

const blackKeysMap  = new Map([
   ["Digit2", ".black-key-1"],
   ["Digit3", ".black-key-2"],
   ["Digit5", ".black-key-3"],
   ["Digit6", ".black-key-4"],
   ["Digit7", ".black-key-5"],
   ["Digit9", ".black-key-6"],
   ["Digit0", ".black-key-7"],
   ["KeyS", ".black-key-8"],
   ["KeyD", ".black-key-9"],
   ["KeyF", ".black-key-10"],
   ["KeyH", ".black-key-11"],
   ["KeyJ", ".black-key-12"]
])

const whiteKeysMap = new Map([
   ["KeyQ", ".white-key-1"],
   ["KeyW", ".white-key-2"],
   ["KeyE", ".white-key-3"],
   ["KeyR", ".white-key-4"],
   ["KeyT", ".white-key-5"],
   ["KeyY", ".white-key-6"],
   ["KeyU", ".white-key-7"],
   ["KeyI", ".white-key-8"],
   ["KeyO", ".white-key-9"],
   ["KeyP", ".white-key-10"],
   ["KeyZ", ".white-key-11"],
   ["KeyX", ".white-key-12"],
   ["KeyC", ".white-key-13"],
   ["KeyV", ".white-key-14"],
   ["KeyB", ".white-key-15"],
   ["KeyN", ".white-key-16"],
   ["KeyM", ".white-key-17"]
])

whiteKeys.forEach((whiteKey) => {
    whiteKey.addEventListener("click", function(){
        console.log(whiteKey)
    })
})

blackKeys.forEach((blackKey)=>{
    blackKey.addEventListener("click", function(){
        console.log(blackKey)
    })
})

document.addEventListener("keypress", function(pressedKey) {
     if(blackKeysMap.get(pressedKey.code)) {
       const blackKey = blackKeysContainer.querySelector(blackKeysMap.get(pressedKey.code));
       blackKey.classList.add("active-black")
       console.log(blackKey)

    } 

    if(whiteKeysMap.get(pressedKey.code)){
        const whiteKey = whiteKeysContainer.querySelector(whiteKeysMap.get(pressedKey.code));
        whiteKey.classList.add("active-white")
        console.log(whiteKey)
    }
})


document.addEventListener("keyup", function(pressedKey) {
     if(blackKeysMap.get(pressedKey.code)) {
       const blackKey = blackKeysContainer.querySelector(blackKeysMap.get(pressedKey.code));
       blackKey.classList.remove("active-black")
    } 

    if(whiteKeysMap.get(pressedKey.code)){
        const whiteKey = whiteKeysContainer.querySelector(whiteKeysMap.get(pressedKey.code));
        whiteKey.classList.remove("active-white")
    }
})