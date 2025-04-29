const whiteKeys = document.querySelectorAll(".white-key");
const blackKeys = document.querySelectorAll(".black-key");

const whiteKeysContainer = document.querySelector(".piano-white-keys");
const blackKeysContainer = document.querySelector(".piano-black-keys");

const blackKeysMap  = new Map([
   ["2", ".black-key-1"],
   ["3", ".black-key-2"],
   ["5", ".black-key-3"],
   ["6", ".black-key-4"],
   ["9", ".black-key-5"],
   ["0", ".black-key-6"],
   ["s", ".black-key-7"],
   ["d", ".black-key-8"],
   ["f", ".black-key-9"],
   ["h", ".black-key-10"],
   ["j", ".black-key-11"]
])

const whiteKeysMap = new Map([
   ["q", ".white-key-1"],
   ["w", ".white-key-2"],
   ["e", ".white-key-3"],
   ["r", ".white-key-4"],
   ["t", ".white-key-5"],
   ["y", ".white-key-6"],
   ["u", ".white-key-7"],
   ["i", ".white-key-8"],
   ["o", ".white-key-9"],
   ["p", ".white-key-10"],
   ["z", ".white-key-11"],
   ["x", ".white-key-12"],
   ["c", ".white-key-13"],
   ["v", ".white-key-14"],
   ["b", ".white-key-15"],
   ["n", ".white-key-16"],
   ["m", ".white-key-17"]
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
    if(blackKeysMap.get(pressedKey.key)) {
       const blackKey = blackKeysContainer.querySelector(blackKeysMap.get(pressedKey.key));
       blackKey.classList.add("active-black")
    } 

    if(whiteKeysMap.get(pressedKey.key)){
        const whiteKey = whiteKeysContainer.querySelector(whiteKeysMap.get(pressedKey.key));
        whiteKey.classList.add("active-white")
    }
})


document.addEventListener("keyup", function(pressedKey) {
    if(blackKeysMap.get(pressedKey.key)) {
       const blackKey = blackKeysContainer.querySelector(blackKeysMap.get(pressedKey.key));
       blackKey.classList.remove("active-black")
    } 

    if(whiteKeysMap.get(pressedKey.key)){
        const whiteKey = whiteKeysContainer.querySelector(whiteKeysMap.get(pressedKey.key));
        whiteKey.classList.remove("active-white")
    }
})