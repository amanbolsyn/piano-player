function KeyListeners() {

    const whiteKeys = document.querySelectorAll(".white-key");
    const blackKeys = document.querySelectorAll(".black-key");

    const blackKeysMap = new Map([
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

    const pressedKeys = new Set();
    const pianoKeys = [...whiteKeys, ...blackKeys];

    //mouse events on piano keys
    pianoKeys.forEach((pianoKey) => {
        pianoKey.addEventListener("mousedown", function (e) {
            playNote(pianoKey.getAttribute("data-note"));
        })
    })

    //keyboard event on piano keys
    function HandleKeayboarKeys(e, action) {
        const keyCode = e.code

        if (blackKeysMap.has(keyCode)) {
            const blackKey = document.querySelector(blackKeysMap.get(keyCode));
            if (blackKey) {
                blackKey.classList[action]("active-black");

                //play a note if action is "add"
                if (action === "add" && !pressedKeys.has(keyCode)) {
                    playNote(blackKey.getAttribute("data-note"));
                    //prevents calling the same playNote function several times when the key is pressed
                    //recrods each keyCode of pressed key in set until user stops pressing that key
                    pressedKeys.add(keyCode)
                } else if (action === "remove") {
                    pressedKeys.delete(keyCode);
                }

            }
        } else if (whiteKeysMap.has(keyCode)) {
            const whiteKey = document.querySelector(whiteKeysMap.get(keyCode));
            if (whiteKey) {
                whiteKey.classList[action]("active-white");

                //play a note if action is "add"
                if (action === "add" && !pressedKeys.has(keyCode)) {
                    playNote(whiteKey.getAttribute("data-note"))
                    //prevents calling the same playNote function several times when the key is pressed
                    //recrods each keyCode of pressed key in set until user stops pressing that key
                    pressedKeys.add(keyCode)
                } else if (action === "remove") {
                    pressedKeys.delete(keyCode);
                }
            }
        }

    }

    document.addEventListener("keypress", (e) => HandleKeayboarKeys(event, "add"))
    document.addEventListener("keyup", (e) => HandleKeayboarKeys(event, "remove"))

}

//max 5 audio elements 
//max 5 keys can be pressed simultenously 

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const MAX_KEYS_ACTIVE = 6;
const audioElements = [];

for (let i = 0; i < MAX_KEYS_ACTIVE; i++) {

    const audio = new Audio;
    audio.preload = "auto"
    audioElements.push(audio);

    const source = audioCtx.createMediaElementSource(audio);
    source.connect(audioCtx.destination);
}

let currentIndex = 0;
// let isConnected = false;


function playNote(note) {

    const audio = audioElements[currentIndex];

    audio.src = `./assets/notes/${note}.mp3`;

    // Resume context first
    audioCtx.resume().then(() => {
        audio.currentTime = 0;
        audio.play().catch(err => console.warn("Play failed", err));
    });

    currentIndex = (currentIndex + 1) % MAX_KEYS_ACTIVE;

}

export {
    KeyListeners
}