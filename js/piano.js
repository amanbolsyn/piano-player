import { CloseInformationWindow } from "./utils.js";

let selectedMode = localStorage.getItem("piano-mode");
if (selectedMode === null) {
    selectedMode = "prepared";
}

let isRecording = false; //program knows does it have to record or not
let recordedSong = [] //stores song name, duration and notes
let playedNotes = []; //stores only played notes
let playTimeoutIds = [];

let recordStartTime, recordDuration, recordName;

const audioFiles = ["A3.mp3", "A4.mp3", "Ab3.mp3", "Ab4.mp3", "B3.mp3", "B4.mp3", "Bb3.mp3", "Bb4.mp3", "C3.mp3",
    "C4.mp3", "C5.mp3", "D3.mp3", "D4.mp3", "D5.mp3", "Db3.mp3", "Db4.mp3", "Db5.mp3", "E3.mp3", "E4.mp3", "E5.mp3",
    "Eb3.mp3", "Eb4.mp3", "Eb5.mp3", "F3.mp3", "F4.mp3", "G3.mp3", "G4.mp3", "Gb3.mp3", "Gb4.mp3"
] //what files to fetch

const bufferFiles = [];

const rootEl = document.querySelector(":root");

//interactive mode vars
const recordBttns = document.querySelectorAll(".record-button");
const stopRecordBttns = document.querySelectorAll(".interactive-section>.stop-record-button");
const downloadRecordBttns = document.querySelectorAll(".download-record-button");

const songLink = document.getElementById("song-link");

const songNameWindow = document.getElementById("song-name-window");
const songNameForm = document.getElementById("song-name-form");
const songNameInput = document.getElementById("song-name-input");
const errorName = document.querySelectorAll(".name-error");
let uploadedSongData;

//prepared mode vars
const prepared = document.getElementById("prepared-mode");
const uploadSection = document.querySelectorAll(".upload-section");
const uploadSongInput = document.getElementById("upload-song-file");
const uploadError = document.querySelectorAll(".upload-error");
let parsedSong;

const uploadRecordBttns = document.querySelectorAll("label>.upload-record-button");
const playRecordBttns = document.querySelectorAll(".play-record-button");
const pauseRecordBttns = document.querySelectorAll(".pause-record-button");

const playbackSection = document.querySelectorAll(".playback-section");
const playbackUpload = document.querySelectorAll(".play-controls>.upload-record-button");
const playbackStop = document.querySelectorAll(".play-controls>.stop-record-button");
const playbackVolume = document.getElementById("volume");
const playbackSpeed = document.getElementById("speed")
let recordSpeed = playbackSpeed.value;
let startNoteIdx = 0;

const closePianoModeBttn = document.querySelector("#piano-mode-window .close-button");

// song name window vars 
const closeSongWindowBttn = document.getElementById("song-name-close");
const closeSongWindowIcon = document.querySelector("#song-name-window .close-button")
const saveSongNameBttn = document.getElementById("song-name-save");

async function LoadAudioFiles() {
    for (const file of audioFiles) {
        const response = await fetch(`./assets/notes/${file}`);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        bufferFiles[file] = audioBuffer;
    }
}

function ShowPianoMode(isChecked) {

    const interactiveSections = document.querySelectorAll(".interactive-section");
    const preparedSections = document.querySelectorAll(".prepared-section")
    const pianoWindowHeadings = document.querySelectorAll(".piano-window-heading");

    if (!isChecked) {//interactive section

        for (let i = 0; i < 2; i++) {
            preparedSections[i].style.display = "none";
            interactiveSections[i].style.display = "flex";
            pianoWindowHeadings[i].innerText = "record";
        }

        ResetPreparedMode();

    } else if (isChecked) {//prepared section

        for (let i = 0; i < 2; i++) {
            interactiveSections[i].style.display = "none"
            preparedSections[i].style.display = "flex"
            pianoWindowHeadings[i].innerText = "play record";


        }
        ResetInteractiveMode();
    }

    //automatically close info window during mode switch on mobile phones
    if (window.innerWidth < 650 || window.innerHeight < 500) {
        CloseInformationWindow();
    }

    // pianoModeWindow.style.zIndex = zLevel.index;
    // zLevel.index++;


}


function PianoModeToggle() {

    const interactive = document.getElementById("interactive-mode");
    let selectedMode = localStorage.getItem("piano-mode")


    if (selectedMode === null) {
        localStorage.setItem("piano-mode", "prepared");
        selectedMode = localStorage.getItem("piano-mode")
    }

    if (selectedMode === "interactive") { //interactive mode 
        ShowPianoMode(false)
        interactive.checked = true;
        ResetInteractiveMode();

    } else if (selectedMode === "prepared") { //prepared mode
        ShowPianoMode(true)
        prepared.checked = true;
    }

    interactive.addEventListener("change", function () {
        localStorage.setItem("piano-mode", "interactive");
        ShowPianoMode(false);
    })

    prepared.addEventListener("change", function () {
        localStorage.setItem("piano-mode", "prepared");
        ShowPianoMode(true);
    })

}


//close button functionality on piano mode window
function ClosePianoModeWindow() {

    const interactive = document.getElementById("interactive-mode");
    const prepared = document.getElementById("prepared-mode");

    closePianoModeBttn.addEventListener("click", function () {
        let selectedMode = localStorage.getItem("piano-mode");

        //swich window modes based on a current selected mode
        if (selectedMode === "interactive") {
            ShowPianoMode(true);
            localStorage.setItem("piano-mode", "prepared")
            prepared.checked = true
        } else if (selectedMode === "prepared") {
            ShowPianoMode(false);
            localStorage.setItem("piano-mode", "interactive")
            interactive.checked = true
        }

    })
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

//resets interactive mode to its default state
function ResetInteractiveMode() {

    for (let i = 0; i < 2; i++) {
        recordBttns[i].classList.remove("none")
        stopRecordBttns[i].classList.add("none")
        downloadRecordBttns[i].classList.add("none")
    }

    isRecording = false;
    playedNotes = [];
    recordedSong = [];
}

//resets prepared mode to its default state 
function ResetPreparedMode() {
    for (let i = 0; i < 2; i++) {

        uploadSection[i].classList.remove("none")
        playbackSection[i].classList.add("none");

        playRecordBttns[i].classList.remove("none")
        pauseRecordBttns[i].classList.add("none");

        uploadError[i].innerText = ""
    }

    //stop recording
    StopRecord();
    playbackStop[0].removeEventListener("click", StopRecord)
    uploadSongInput.value = "";
    playTimeoutIds = [];
    globalGainNode.gain.value = 0.5;
    playbackVolume.value = 50;

}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const globalGainNode = audioCtx.createGain();
globalGainNode.gain.value = playbackVolume.value / 100; // initial volume
globalGainNode.connect(audioCtx.destination);

// Setup volume control ONCE
playbackVolume.addEventListener("input", function () {
    globalGainNode.gain.value = playbackVolume.value / 100;
});

playbackSpeed.addEventListener("change", function () {
    recordSpeed = playbackSpeed.value;
    StopRecord();
})

function playNote(file) {

    const source = audioCtx.createBufferSource();
    source.buffer = bufferFiles[file];
    source.playbackRate.value = recordSpeed;

    // Create a GainNode
    source.connect(globalGainNode);

    if (isRecording) {
        let keyPressTime = Date.now() - recordStartTime;
        RecordNote(file.slice(0, -4), keyPressTime, bufferFiles[file].duration);
    }

    source.start();

}

async function GetSongName() {

    songNameWindow.classList.remove("hidden");

    await new Promise((resolve, reject) => {

        function ValidateName(e) {
            e.preventDefault();

            recordName = songNameInput.value.trim();

            if (recordName !== "") {

                CleanUp();
                resolve();

            } else {
                //main and clone error texts
                errorName[0].innerText = "invalid song name";
                errorName[1].innerText = "invalid song name";
            }

        }

        function CleanUp() {

            songNameWindow.classList.add("hidden");
            songNameInput.value = "";

            errorName[0].innerText = "";
            errorName[1].innerText = "";

            songNameForm.removeEventListener("submit", ValidateName);
            saveSongNameBttn.removeEventListener("click", ValidateName);
            closeSongWindowBttn.removeEventListener("click", () => { CancelPromise(); ResetInteractiveMode() })
            closeSongWindowIcon.removeEventListener("click", () => { CancelPromise(); ResetInteractiveMode() })
            closePianoModeBttn.removeEventListener("click", CancelPromise);
            prepared.removeEventListener("change", CancelPromise);

        }

        function CancelPromise() {

            CleanUp();
            reject(new Error("song name was not taken"))
        }

        songNameForm.addEventListener("submit", ValidateName);
        saveSongNameBttn.addEventListener("click", ValidateName);
        closeSongWindowBttn.addEventListener("click", () => { CancelPromise(); ResetInteractiveMode() })
        closeSongWindowIcon.addEventListener("click", () => { CancelPromise(); ResetInteractiveMode() })
        closePianoModeBttn.addEventListener("click", CancelPromise);
        prepared.addEventListener("change", CancelPromise);


    });
}


//only changes isRecording boolean var to true i GUESS?
recordBttns[0].addEventListener("click", function () {

    rootEl.style.setProperty('--animation-state', 'running');//starts animation for record button

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
    isRecording = false;

    try {
        await GetSongName();
    } catch (err) {
        console.log(err)
        return;
    }

    for (let i = 0; i < 2; i++) {
        stopRecordBttns[i].classList.add("none");
        downloadRecordBttns[i].classList.remove("none");
    }

    recordedSong = {
        "name": recordName,
        "duration": recordDuration,
        "notes": playedNotes,
    }

    exportJSONFile(recordedSong.name, recordedSong)

})


//can download only once and changes it state to recrod again
downloadRecordBttns[0].addEventListener("click", function () {

    songLink.click();
    URL.revokeObjectURL(songLink.url);
    ResetInteractiveMode();
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

    //reset text for error message
    uploadError.innerText = "";

    //cannot parse the song data to json format
    try {
        parsedSong = JSON.parse(song);
    } catch (e) {
        console.error(e);
        uploadError[0].innerText = "couldn't parse the file";
        uploadError[1].innerText = "couldn't parse the file";
        return false;
    }

    //json doesn't have "name", "duration", "notes" properties
    if (!(parsedSong.hasOwnProperty("name") && parsedSong.hasOwnProperty("duration") && parsedSong.hasOwnProperty("notes"))) {
        console.error("invalid json format")
        uploadError[0].innerText = "invalid json format";
        uploadError[1].innerText = "invalid json format";
        return false;
    }

    //notes array doesn't have any "key" elements to play
    if (parsedSong.notes.length === 0) {
        console.error("song doesn't have any notes");
        uploadError[0].innerText = "song doesn't have any notes";
        uploadError[1].innerText = "song doesn't have any notes";
        return false;
    }

    return true;
}


function PlaySong() {

    let pausedBaseNote = 0;
    if (startNoteIdx > 0) {
        pausedBaseNote = parsedSong.notes[startNoteIdx-1].startTime;
    }

    for (let i = startNoteIdx; i < parsedSong.notes.length; i++) {

        let key = parsedSong.notes[i].key;
        let startTime = (parsedSong.notes[i].startTime - pausedBaseNote)/ recordSpeed ;
        const playedElement = document.querySelector(`[data-note="${key}"]`)


        let timeoutId = setTimeout(() => {

            playNote(`${key}.mp3`)
            if (playedElement.classList.contains("white-key")) {
                playedElement.classList.add("active-white")
                setTimeout(() => { playedElement.classList.remove("active-white") }, 500);
            } else if (playedElement.classList.contains("black-key")) {
                playedElement.classList.add("active-black");
                setTimeout(() => { playedElement.classList.remove("active-black") }, 500);
            }


            playTimeoutIds.shift()


        }, startTime)

        playTimeoutIds.push(timeoutId);

    }

    let timeoutId = setTimeout(() => {
        for (let i = 0; i < 2; i++) {
            pauseRecordBttns[i].classList.add("none")
            playRecordBttns[i].classList.remove("none");
            startNoteIdx = 0;
        }
    }, (parsedSong.duration - pausedBaseNote)/ playbackSpeed.value)

    playTimeoutIds.push(timeoutId);
}

// uploading files into prepared section
uploadSongInput.addEventListener("cancel", function () {
    console.info("The same file was selected")
})


uploadSongInput.addEventListener("change", function () {

    var reader = new FileReader();
    reader.readAsText(uploadSongInput.files[0], "UTF-8");

    reader.onerror = function () {
        console.error("error reading the file")
    }

    //successfully reads file 
    reader.onload = function (e) {
        uploadedSongData = e.target.result;

        if (CheckJSON(uploadedSongData)) {

            for (let i = 0; i < 2; i++) {

                uploadSection[i].classList.add("none");
                playbackSection[i].classList.remove("none");

            }

        }

    }

})

function StopRecord() {

    for (let i = 0; i < playTimeoutIds.length; i++) {
        clearTimeout(playTimeoutIds[i]);
    }

    for (let i = 0; i < 2; i++) {
        pauseRecordBttns[i].classList.add("none")
        playRecordBttns[i].classList.remove("none");
    }

    startNoteIdx = 0;
    playTimeoutIds = []
    playbackStop[0].removeEventListener("click", StopRecord);
}

playRecordBttns[0].addEventListener("click", function () {

    PlaySong();

    //display pause buttons
    for (let i = 0; i < 2; i++) {
        pauseRecordBttns[i].classList.remove("none");
        playRecordBttns[i].classList.add("none")
    }


    playbackStop[0].addEventListener("click", StopRecord);

})

pauseRecordBttns[0].addEventListener("click", function () {


    for (let i = 0; i < playTimeoutIds.length; i++) {
        clearTimeout(playTimeoutIds[i]);
    }

    startNoteIdx = parsedSong.notes.length  - playTimeoutIds.length+1;
    playTimeoutIds = []

    //display play button
    for (let i = 0; i < 2; i++) {
        pauseRecordBttns[i].classList.add("none")
        playRecordBttns[i].classList.remove("none");
    }

})

playbackUpload[0].addEventListener("click", function () {
    ResetPreparedMode();
})




export {
    LoadAudioFiles,
    PianoModeToggle,
    ClosePianoModeWindow,
    KeyListeners,
    ResetInteractiveMode,
    ResetPreparedMode
}