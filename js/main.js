import { KeyListeners} from "./piano.js"
import {LoadAudioFiles } from "./piano.js"
import { NoteHints } from "./utils.js";
import { NoteSheets } from "./utils.js";
import { ApplyDragEvent } from "./utils.js";
import { CloseSheetWindow } from "./utils.js";
import { ShowInformationWindow } from "./utils.js";
import { CloseInformationWindow } from "./utils.js";
import { PianoModeToggle } from "./utils.js";
import { ClosePianoModeWindow } from "./utils.js";
import { WindowZLevel } from "./utils.js";


const closeWindowBttns = document.querySelectorAll(".sheet-table .close-button");
const infoCloseBttn = document.querySelector(".close-button.information");
const sheetTables = document.querySelectorAll(".window-container.sheet-table");
const windowContainers = document.querySelectorAll(".window-container")
const pianoModeWindow = document.getElementById("piano-mode-window")
const songNameWindow = document.getElementById("song-name-window")



document.addEventListener("DOMContentLoaded", async function () {

    //handels event listenners to each black and white key 
    KeyListeners();

    //controls z index level of window containers when clicked 
    //makes window container to move forward whenc clicked
    WindowZLevel();

    //note hints logic
    NoteHints();

    PianoModeToggle();
    ClosePianoModeWindow();

     await LoadAudioFiles()

    //note sheets window logic
    NoteSheets();
    closeWindowBttns.forEach((closeBttn) => {
        closeBttn.addEventListener("click", function (e) {
            CloseSheetWindow(e.target.closest("div[id]").id);
        })
    });


    //adding drag event to windows
    if (window.innerWidth > 649) {
        ApplyDragEvent();
    }

    //information window logic
    ShowInformationWindow();
    infoCloseBttn.addEventListener("click", function () {
        CloseInformationWindow();
    })

    window.addEventListener("resize", function () {


        // close all windows when resizing
        for (const sheetTable of sheetTables) {
            CloseSheetWindow(sheetTable.id);
        }

        //close window containers only for tablets and desktop screens
        if (this.innerWidth > 649 && this.innerHeight > 499) {
            CloseInformationWindow();
        }

        //remove all inline styles of window containers if screen width is less then 600 pixels
        if (this.innerWidth < 600) {
            for (const windowContainer of windowContainers) {
                windowContainer.removeAttribute("style");
                console.log(windowContainer)
            }
        }

        //remove all inline styles of piano mode window and song name window every time when screen resizes
        pianoModeWindow.removeAttribute("style");
        songNameWindow.removeAttribute("style");

    })
});

