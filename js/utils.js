//GLOBAL VARIABLES

//helps to determine z index level of opened/clicked windows
let zLevel = 4;

function ShowNoteHints(isShown) {

  //select all note hints
  const notes = document.querySelectorAll(".note-hint");
  //tooltip text for show note hints checkbox
  const tooltipText = document.querySelectorAll(".tooltip-text")[0];

  if (isShown) {//show note hints
    for (const note of notes) {
      note.classList.remove("hidden");
    }
    tooltipText.innerText = "hide notes"
    tooltipText.style = "left: -40%"

  } else if (!isShown) { //hide notes hints
    for (const note of notes) {
      note.classList.add("hidden");
    }

    tooltipText.innerText = "show notes"
    tooltipText.style = "left: -45%"
  }

}

function NoteHints() {

  const noteHintsChkBox = document.getElementById("note-hints");
  let isShown = localStorage.getItem("show-note-hints");

  if (isShown === null) { // user first time visits the page
    noteHintsChkBox.checked = true;
  } else {  //user visited site before

    if (isShown === "true") {
      noteHintsChkBox.checked = true;
      ShowNoteHints(true)
    } else if (isShown === "false") {
      noteHintsChkBox.checked = false;
      ShowNoteHints(false)
    }

  }

  //checkbox "show note hints" changes the value 
  noteHintsChkBox.addEventListener("change", function () {

    isShown = noteHintsChkBox.checked;
    ShowNoteHints(isShown);
    localStorage.setItem("show-note-hints", isShown);

  })

}

function ShowNoteSheets(isShown) {

  const noteSheets = document.querySelectorAll(".sheet-table");
  const tooltipText = document.querySelectorAll(".tooltip-text")[1];

  if (isShown) {
    for (const sheet of noteSheets) {
      sheet.classList.remove("hidden");
      sheet.style.zIndex = zLevel;
    }

    tooltipText.innerText = "hide sheets";
    tooltipText.style = "left: -40%"
    zLevel++;

  } else if (!isShown) {
    for (const sheet of noteSheets) {
      sheet.classList.add("hidden");
    }

    tooltipText.innerText = "show sheets";
    tooltipText.style = "left: -45%"

  }

}

function NoteSheets() {

  const noteSheetsChkBox = document.getElementById("note-sheets");
  let isShown = localStorage.getItem("show-note-sheets");

  if (isShown === "true") { //show note sheets
    noteSheetsChkBox.checked = true;
    ShowNoteSheets(true);
  } else if (isShown === "false") {
    noteSheetsChkBox.checked = false;
  }

  noteSheetsChkBox.addEventListener("change", function () {
    isShown = noteSheetsChkBox.checked;
    localStorage.setItem("show-note-sheets", isShown);
    ShowNoteSheets(isShown);
  })
}



function ApplyDragEvent() {

  const windowHeadings = document.querySelectorAll(".window-container>.window-heading");
  const windowClones = document.querySelectorAll(".window-container-clone")
  const target = document.querySelector(".body-container")

  windowHeadings.forEach((windowHead, idx) => {
    windowHead.addEventListener("dragstart", function (e) {

      const parentId = e.target.parentNode.id;

      const data = {
        id: parentId,
        offsetX: e.offsetX,
        offsetY: e.offsetY,
      }

      const selectedWindow = document.getElementById(parentId);
      selectedWindow.style.opacity = 0;

      selectedWindow.style.zIndex = zLevel;
      zLevel++;

      e.dataTransfer.setDragImage(windowClones[idx], e.offsetX, e.offsetY)

      e.dataTransfer.setData("application/my-app", JSON.stringify(data));
      e.dataTransfer.effectAllowed = "move";


    })
  })

  target.addEventListener("dragover", function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  })

  target.addEventListener("drop", function (e) {
    e.preventDefault();
    const rawData = e.dataTransfer.getData("application/my-app");
    const data = JSON.parse(rawData);


    document.getElementById(data.id).style.removeProperty("opacity")
    document.getElementById(data.id).style.left = `${e.clientX - data.offsetX}px`;
    document.getElementById(data.id).style.top = `${e.clientY - data.offsetY}px`;

  })

}


function CloseSheetWindow(id) {

  const table = document.getElementById(id);
  table.classList.add("hidden");

  //update "show note sheets" checkbox
  const hiddenTables = document.querySelectorAll(".sheet-table.hidden");
  const allTables = document.querySelectorAll(".sheet-table");

  if (hiddenTables.length === allTables.length) {
    const sheetsChkBx = document.getElementById("note-sheets");
    sheetsChkBx.checked = false;

    const tooltipText = document.querySelectorAll(".tooltip-text")[1];
    tooltipText.innerText = "show sheets"

    localStorage.setItem("show-note-sheets", false)

  }

}

function ShowInformationWindow() {

  const informationChkBox = document.getElementById("information");
  const informationWindow = document.getElementById("information-window");
  let isShown = localStorage.getItem("show-information");


  if (isShown === "true") {
    informationChkBox.checked = true;
    informationWindow.classList.remove("hidden")
    informationWindow.style.zIndex = zLevel;
    zLevel++;
  }

  informationChkBox.addEventListener("change", function () {
    isShown = informationChkBox.checked;
    localStorage.setItem("show-information", isShown);

    if (isShown) {
      informationWindow.classList.remove("hidden")
      informationWindow.style.zIndex = zLevel;
      zLevel++;

      console.log("DKFJ")
      if (this.innerWidth < 650 || window.innerHeight < 500) {
        window.scrollTo(0, document.body.scrollHeight);
        console.log("DJKF")
      }

    } else if (!isShown) {
      informationWindow.classList.add("hidden")
    }
  })

}

function CloseInformationWindow() {

  const informationWindow = document.getElementById("information-window")
  const informationChkBx = document.getElementById("information")

  informationWindow.classList.add("hidden");
  informationChkBx.checked = false;
  localStorage.setItem("show-information", false)

}

function ShowPianoMode(isChecked) {

  const interactiveSections = document.querySelectorAll(".interactive-section");
  const preparedSections = document.querySelectorAll(".prepared-section")
  const pianoWindowHeading = document.getElementById("piano-window-heading");
  const pianoWindowHeadingCln = document.getElementById("piano-window-heading-clone");
  const pianoModeWindow = document.getElementById("piano-mode-window")

  if (!isChecked) {//interactive section

    for (let i = 0; i < interactiveSections.length; i++) {
      interactiveSections[i].style.display = "block"
      preparedSections[i].style.display = "none"
    }

    pianoWindowHeading.innerText = "interactive mode"
    pianoWindowHeadingCln.innerText = "interactive mode"

  } else if (isChecked) {//prepared section

    for (let i = 0; i < interactiveSections.length; i++) {
      interactiveSections[i].style.display = "none"
      preparedSections[i].style.display = "block"
    }

    pianoWindowHeading.innerText = "prepared mode"
    pianoWindowHeadingCln.innerText = "prepared mode"

  }


  if (window.innerWidth < 650) {
    CloseInformationWindow()
  }

  pianoModeWindow.style.zIndex = zLevel;
  zLevel++;


}


function PianoModeToggle() {

  const interactive = document.getElementById("interactive-mode");
  const prepared = document.getElementById("prepared-mode");
  let selectedMode = localStorage.getItem("piano-mode")


  if (selectedMode === null) {
    localStorage.setItem("piano-mode", "prepared");
    selectedMode = localStorage.getItem("piano-mode")
  }

  if (selectedMode === "interactive") { //interactive mode 
    ShowPianoMode(false)
    interactive.checked = true;
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

  const pianoModeWindow = document.getElementById("piano-mode-window")
  const closePianoModeBttn = pianoModeWindow.querySelector(".close-button");
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


function WindowZLevel() {
  const windows = document.querySelectorAll(".window-container")

  for (const selectedWindow of windows) {
    selectedWindow.addEventListener("click", function () {
      selectedWindow.style.zIndex = zLevel;
      zLevel++;
    })
  }
}


function KeyListeners() {

  const whiteKeys = document.querySelectorAll(".white-key");
  const blackKeys = document.querySelectorAll(".black-key");

  const whiteKeysContainer = document.querySelector(".piano-white-keys");
  const blackKeysContainer = document.querySelector(".piano-black-keys");

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

  whiteKeys.forEach((whiteKey) => {
    whiteKey.addEventListener("click", function () {
      playNote()
    })
  })

  blackKeys.forEach((blackKey) => {
    blackKey.addEventListener("click", function () {
      playNote()
    })
  })

  document.addEventListener("keypress", function (pressedKey) {
    if (blackKeysMap.get(pressedKey.code)) {
      const blackKey = blackKeysContainer.querySelector(blackKeysMap.get(pressedKey.code));
      blackKey.classList.add("active-black")
      playNote();

    } else if (whiteKeysMap.get(pressedKey.code)) {
      const whiteKey = whiteKeysContainer.querySelector(whiteKeysMap.get(pressedKey.code));
      whiteKey.classList.add("active-white")
    }
  })


  document.addEventListener("keyup", function (pressedKey) {
    if (blackKeysMap.get(pressedKey.code)) {
      const blackKey = blackKeysContainer.querySelector(blackKeysMap.get(pressedKey.code));
      blackKey.classList.remove("active-black")

    } else if (whiteKeysMap.get(pressedKey.code)) {
      const whiteKey = whiteKeysContainer.querySelector(whiteKeysMap.get(pressedKey.code));
      whiteKey.classList.remove("active-white")
    }
  })
}


const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playNote() {
  let oscillator = audioCtx.createOscillator();

  //Select a waveform type (sine, triangle,...)
  oscillator.type = "sine";

  //Select a frequency
  oscillator.frequency.value = 440;

  //Create volume
  const gainNode = audioCtx.createGain();
  //Set the duration
  gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 1);

  //Connect our audiosource(oscillator) with the volume
  oscillator.connect(gainNode);
  //Connect inputgain with the output (Speakers)
  gainNode.connect(audioCtx.destination);

  oscillator.start(0);
}

export {
  KeyListeners,
  NoteHints,
  NoteSheets,
  ApplyDragEvent,
  CloseSheetWindow,
  ShowInformationWindow,
  CloseInformationWindow,
  PianoModeToggle,
  ClosePianoModeWindow,
  WindowZLevel
};
