let selectedMode = localStorage.getItem("piano-mode");
if (selectedMode === null) {
    selectedMode = "prepared";
}

let isRecording = false;
let recordedSong = [], playedNotes = [];
let recordStartTime, recordDuration, recordName;
const audioFiles = ["A3.mp3", "A4.mp3", "Ab3.mp3", "Ab4.mp3", "B3.mp3", "B4.mp3", "Bb3.mp3", "Bb4.mp3", "C3.mp3",
    "C4.mp3", "C5.mp3", "D3.mp3", "D4.mp3", "D5.mp3", "Db3.mp3", "Db4.mp3", "Db5.mp3", "E3.mp3", "E4.mp3", "E5.mp3",
    "Eb3.mp3", "Eb4.mp3", "Eb5.mp3", "F3.mp3", "F4.mp3", "G3.mp3", "G4.mp3", "Gb3.mp3", "Gb4.mp3"
]

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const bufferFiles = [];

const rootEl = document.querySelector(":root");

//interactive mode vars
const recordBttns = document.querySelectorAll(".record-button");
const stopRecordBttns = document.querySelectorAll(".stop-record-button");
const downloadRecordBttns = document.querySelectorAll(".download-record-button");

const songLink = document.getElementById("song-link");

const songNameWindow = document.getElementById("song-name-window");
const songNameForm = document.getElementById("song-name-form");
const songNameInput = document.getElementById("song-name-input");
const errorMessage = document.querySelector(".error");
let uploadedSongData;

//prepared mode vars
const uploadSongInput = document.getElementById("upload-song-file");
let parsedSong;



async function LoadAudioFiles() {
    for (const file of audioFiles) {
        const response = await fetch(`./assets/notes/${file}`);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        bufferFiles[file] = audioBuffer;
    }
}

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
            let file = `${pianoKey.getAttribute("data-note")}.mp3`
            playNote(file);
        })
    })

    //keyboard event on piano keys
    function HandleKeayboarKeys(e, action) {

        if (e.target.tagName === "INPUT") {
            return
        }
        const keyCode = e.code

        if (blackKeysMap.has(keyCode)) {
            const blackKey = document.querySelector(blackKeysMap.get(keyCode));
            if (blackKey) {
                blackKey.classList[action]("active-black");

                //play a note if action is "add"
                if (action === "add" && !pressedKeys.has(keyCode)) {
                    let file = `${blackKey.getAttribute("data-note")}.mp3`
                    playNote(file);
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
                    let file = `${whiteKey.getAttribute("data-note")}.mp3`
                    playNote(file)
                    //prevents calling the same playNote function several times when the key is pressed
                    //recrods each keyCode of pressed key in set until user stops pressing that key
                    pressedKeys.add(keyCode)
                } else if (action === "remove") {
                    pressedKeys.delete(keyCode);
                }
            }
        }

    }

    document.addEventListener("keypress", () => HandleKeayboarKeys(event, "add"))
    document.addEventListener("keyup", () => HandleKeayboarKeys(event, "remove"))


}

//note recroting functionlity 
function RecordNote(note, time, duration) {

    let playedNote = {
        "key": note,
        "startTime": time,
        "duration": duration,
    }

    playedNotes.push(playedNote);
}


function playNote(file) {

    const source = audioCtx.createBufferSource();
    source.buffer = bufferFiles[file];

    if (isRecording) {
        let keyPressTime = Date.now() - recordStartTime;
        RecordNote(file.slice(0, -4), keyPressTime, bufferFiles[file].duration);
    }

    source.connect(audioCtx.destination);
    source.start();

}

async function GetSongName() {

    songNameWindow.classList.remove("hidden");

    await new Promise((resolve) => {

        function ValidateName(e) {
            e.preventDefault();

            recordName = songNameInput.value.trim();

            if (recordName !== "") {
                songNameForm.removeEventListener("submit", ValidateName)
                songNameWindow.classList.add("hidden");
                songNameInput.value = "";
                errorMessage.innerText = "";
                resolve();
            } else {
                errorMessage.innerText = "input valid song name";
            }

        }
        songNameForm.addEventListener("submit", ValidateName);

    });
}


//only changes isRecording boolean var to true i GUESS?
recordBttns[0].addEventListener("click", function () {

    for (let i = 0; i < 2; i++) {
        recordBttns[i].classList.add("none");
        stopRecordBttns[i].classList.remove("none");
        stopRecordBttns[i].classList.add("flex");

    }

    recordStartTime = Date.now();
    isRecording = true;
})

//changes isReacording boolean var back to false and than stores recorded array of objects(played notes) into a file
stopRecordBttns[0].addEventListener("click", async function () {

    recordDuration = Date.now() - recordStartTime;
    rootEl.style.setProperty('--animation-state', 'paused');//stops animation for stop button
    await GetSongName();

    for (let i = 0; i < 2; i++) {
        stopRecordBttns[i].classList.add("none");
        downloadRecordBttns[i].classList.remove("none");
        downloadRecordBttns[i].classList.add("flex");
    }

    recordedSong = {
        "name": recordName,
        "duration": recordDuration,
        "notes": playedNotes,
    }

    isRecording = false;
    exportJSONFile(recordedSong.name, recordedSong)
})


//can download only once and changes it state to recrod again
downloadRecordBttns[0].addEventListener("click", function () {

    for (let i = 0; i < 2; i++) {
        downloadRecordBttns[i].classList.add("none");
        recordBttns[i].classList.remove("none")
        recordBttns[i].classList.add("flex");
    }

    songLink.click();
    URL.revokeObjectURL(songLink.url);
    recordedSong = [];

})

function exportJSONFile(filename, data) {
    // Step 1: Convert the JavaScript object to a JSON string
    const jsonString = JSON.stringify(data, null, 2);

    // Step 2: Create a Blob (binary large object) with the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Step 3: Create a temporary URL pointing to that blob
    const url = URL.createObjectURL(blob);

    // Step 4: Create a temporary <a> element to trigger the download
    songLink.href = url;
    songLink.download = filename; // e.g. "data.json"
}


function CheckJSON(song) {

    //cannot pars song data to json format
    try {
        parsedSong = JSON.parse(song);
    } catch (e) {
        console.log(e);
        return false;
    }

    //json doesn't have "name", "duration", "notes" properties
    if (!( parsedSong.hasOwnProperty("name") &&  parsedSong.hasOwnProperty("duration") &&  parsedSong.hasOwnProperty("notes"))) {
        console.log("Invalid json format")
        return false;
    }

    console.log(parsedSong.notes)
    console.log(parsedSong.notes.length)

    if( parsedSong.notes.length === 0){
        console.log("Song doesn't contain any notes")
        return false;
    }
    

    return true;
}


function PlaySong(){

    for(let i =0; i<parsedSong.notes.length; i++){
       setTimeout(() => {playNote(`${parsedSong.notes[i].key}.mp3`)}, parsedSong.notes[i].startTime)
    }
}

//uploading files into prepared section
uploadSongInput.addEventListener("cancel", function () {
    console.log("you selected the same file")
})


uploadSongInput.addEventListener("change", function () {

    var reader = new FileReader();
    reader.readAsText(uploadSongInput.files[0], "UTF-8");

    reader.onerror = function (e) {
        console.log("error reading the data")
    }

    //successfully reads file 
    reader.onload = function (e) {
        uploadedSongData = e.target.result;


       if(CheckJSON(uploadedSongData)){
             PlaySong();
       }
    

    }

})


export {
    KeyListeners,
    LoadAudioFiles
}