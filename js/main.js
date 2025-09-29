import { KeyListeners } from "./piano.js"
import { LoadAudioFiles } from "./piano.js"
import { PianoModeToggle } from "./piano.js";
import { ClosePianoModeWindow } from "./piano.js";

import { NoteHints } from "./utils.js";
import { NoteSheets } from "./utils.js";
import { ApplyDragEvent } from "./utils.js";
import { CloseSheetWindow } from "./utils.js";
import { ShowInformationWindow } from "./utils.js";
import { CloseInformationWindow } from "./utils.js";
import { WindowZLevel } from "./utils.js";


const closeWindowBttns = document.querySelectorAll(".sheet-table .close-button");
const infoCloseBttn = document.querySelector(".close-button.information");
const sheetTables = document.querySelectorAll(".window-container.sheet-table");
const windowContainers = document.querySelectorAll(".window-container")
const pianoModeWindow = document.getElementById("piano-mode-window")
const songNameWindow = document.getElementById("song-name-window")



document.addEventListener("DOMContentLoaded", async function () {

    //Handels event listenners to each black and white key 
    KeyListeners();

    //Controls z index level of window containers when clicked 
    //Makes window container to move forward whenc clicked
    WindowZLevel();

    //Note hints logic
    NoteHints();

    PianoModeToggle();
    ClosePianoModeWindow();


    //Note sheets window logic
    NoteSheets();
    closeWindowBttns.forEach((closeBttn) => {
        closeBttn.addEventListener("click", function (e) {
            CloseSheetWindow(e.target.closest("div[id]").id);
        })
    });


    //Adding drag event to windows
    if (window.innerWidth > 649) {
        ApplyDragEvent();
    }

    //Information window logic
    ShowInformationWindow();
    infoCloseBttn.addEventListener("click", function () {
        CloseInformationWindow();
    })

    await LoadAudioFiles()

    window.addEventListener("resize", function () {


        //Close all windows when resizing
        for (const sheetTable of sheetTables) {
            CloseSheetWindow(sheetTable.id);
        }

        //Close window containers only for tablets and desktop screens
        if (this.innerWidth > 649 && this.innerHeight > 499) {
            CloseInformationWindow();
        }

        //Remove all inline styles of window containers if screen width is less then 600 pixels
        if (this.innerWidth < 600) {
            for (const windowContainer of windowContainers) {
                windowContainer.removeAttribute("style");
            }
        }

        //Remove all inline styles of piano mode window and song name window every time when screen resizes
        pianoModeWindow.removeAttribute("style");
        songNameWindow.removeAttribute("style");

    })
});

