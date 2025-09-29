//Helps to determine z index level of opened/clicked windows
let zLevel = 4;


/**
 * @param {boolean} isShown
 */
function ShowNoteHints(isShown) {

  //Select all note hints
  const notes = document.querySelectorAll(".note-hint");
  //Tooltip text for show note hints checkbox
  const tooltipText = document.querySelectorAll(".tooltip-text")[0];

  if (isShown) {//Show note hints
    for (const note of notes) {
      note.classList.remove("hidden");
    }
    tooltipText.innerText = "hide notes"
    tooltipText.style = "left: -40%"

  } else if (!isShown) { //Hide notes hints
    for (const note of notes) {
      note.classList.add("hidden");
    }

    tooltipText.innerText = "show notes"
    tooltipText.style = "left: -45%"
  }

}

/**
 * Show note hints according to local storage or user interactions
 */
function NoteHints() {

  const noteHintsChkBox = document.getElementById("note-hints");
  let isShown = localStorage.getItem("show-note-hints");

  if (isShown === null) { //User first time visits the page
    noteHintsChkBox.checked = true;
  } else {  //User visited site before

    if (isShown === "true") {
      noteHintsChkBox.checked = true;
      ShowNoteHints(true)
    } else if (isShown === "false") {
      noteHintsChkBox.checked = false;
      ShowNoteHints(false)
    }

  }

  //Checkbox "show note hints" changes the value 
  noteHintsChkBox.addEventListener("change", function () {

    isShown = noteHintsChkBox.checked;
    ShowNoteHints(isShown);
    localStorage.setItem("show-note-hints", isShown);

  })

}

/**
 * @param {boolean} isShown
 */
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

/**
 * Show note sheet windows according to local storage or user interactions
 */
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

/**
 * Handles the closing logic of each "note sheet" window
 * @param {string} id
 */
function CloseSheetWindow(id) {

  const table = document.getElementById(id);
  table.classList.add("hidden");

  const hiddenTables = document.querySelectorAll(".sheet-table.hidden");
  const allTables = document.querySelectorAll(".sheet-table");

  //Update "show note sheets" checkbox if all note sheet windows are closed
  if (hiddenTables.length === allTables.length) {
    const sheetsChkBx = document.getElementById("note-sheets");
    sheetsChkBx.checked = false;

    const tooltipText = document.querySelectorAll(".tooltip-text")[1];
    tooltipText.innerText = "show sheets"

    localStorage.setItem("show-note-sheets", false)

  }
}


/**
 * Attaching Drag/Drop to each window container
 */
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

      //Hide the actual window during drag/drop
      const selectedWindow = document.getElementById(parentId);
      selectedWindow.style.opacity = 0;

      //Adjusting z index level of each window 
      selectedWindow.style.zIndex = zLevel;
      zLevel++;

      //Sets the window clone during drag/drop 
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

    //Show the actual window after dropping it
    document.getElementById(data.id).style.removeProperty("opacity")
    document.getElementById(data.id).style.left = `${e.clientX - data.offsetX}px`;
    document.getElementById(data.id).style.top = `${e.clientY - data.offsetY}px`;

  })

}


function ShowInformationWindow() {

  const informationChkBox = document.getElementById("information");
  const informationWindow = document.getElementById("information-window");
  let isShown = localStorage.getItem("show-information");

  //By default is visiable
  if (isShown === null) {
    isShown = "true";
  }

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


/**
 * Updates z index level(brings forward) of each window container when clicked
 */
function WindowZLevel() {
  const windows = document.querySelectorAll(".window-container")

  for (const selectedWindow of windows) {
    selectedWindow.addEventListener("click", function () {
      selectedWindow.style.zIndex = zLevel;
      zLevel++;
    })
  }
}


export {
  NoteHints,
  NoteSheets,
  ApplyDragEvent,
  CloseSheetWindow,
  ShowInformationWindow,
  CloseInformationWindow,
  WindowZLevel,
};
