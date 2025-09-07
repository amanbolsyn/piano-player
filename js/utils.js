//GLOBAL VARIABLES


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

  const noteSheets = document.querySelectorAll(".table-container");
  const tooltipText = document.querySelectorAll(".tooltip-text")[1];

  if (isShown) {
    for (const sheet of noteSheets) {
      sheet.classList.remove("hidden");
    }

    tooltipText.innerText = "hide sheets";
    tooltipText.style = "left: -40%"

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

  const sheetTables = document.querySelectorAll(".table-container>.table-heading");
  const sheetTableClones = document.querySelectorAll(".table-container-clone")
  const target = document.querySelector(".body-container")

  sheetTables.forEach((table, idx) => {
    table.addEventListener("dragstart", function (e) {

      const parentId = e.target.parentNode.id;

      const data = {
        id: parentId,
        offsetX: e.offsetX,
        offsetY: e.offsetY,
      }

      document.getElementById(parentId).style.opacity = 0;
      e.dataTransfer.setDragImage(sheetTableClones[idx], e.offsetX, e.offsetY)

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


function CloseWindow() {

  const closeWindowBttns = document.querySelectorAll(".close-button");

  closeWindowBttns.forEach((closeBttn) => {
    closeBttn.addEventListener("click", function (e) {
      const table = document.getElementById(e.target.closest("div[id]").id);
      table.classList.add("hidden");

      //update "show note sheets" checkbox
      const hiddenTables = document.querySelectorAll(".table-container.hidden");
      const allTables = document.querySelectorAll(".table-container");

      if (hiddenTables.length === allTables.length) {
        const sheetsChkBx = document.getElementById("note-sheets");
        sheetsChkBx.checked = false;

        const tooltipText = document.querySelectorAll(".tooltip-text")[1];
        tooltipText.innerText = "show sheets"

        localStorage.setItem("show-note-sheets", false)

      }
    })
  })

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
      playNote();
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

export { KeyListeners, NoteHints, NoteSheets, ApplyDragEvent, CloseWindow };
