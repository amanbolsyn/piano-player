import { KeyListeners } from "./utils.js"
import { NoteHints } from "./utils.js";
import { NoteSheets } from "./utils.js";
import { ApplyDragEvent } from "./utils.js";
import { CloseSheetWindow } from "./utils.js";
import { ShowInformationWindow } from "./utils.js";
import { CloseInformationWindow } from "./utils.js";
import { PianoModeToggle } from "./utils.js";

const closeWindowBttns = document.querySelectorAll(".sheet-table .close-button");
const infoCloseBttn = document.querySelector(".close-button.information");
const sheetTables = document.querySelectorAll(".window-container.sheet-table");
const windowHeadings = document.querySelector(".window-container>.window-heading")




document.addEventListener("DOMContentLoaded", function () {

    //handels event listenners to each black and white key 
    KeyListeners();

    //note hints logic
    NoteHints();

    PianoModeToggle();

    ApplyDragEvent();


    //note sheets window logic
    NoteSheets();
    closeWindowBttns.forEach((closeBttn) => {
        closeBttn.addEventListener("click", function (e) {
            CloseSheetWindow(e.target.closest("div[id]").id);
        })
    });


    //adding drag event to windows

    //information window logic
    ShowInformationWindow();
    infoCloseBttn.addEventListener("click", function () {
        CloseInformationWindow();
    })


    // close all windows when resizing
    window.addEventListener("resize", function () {

        for (const sheetTable of sheetTables) {
            CloseSheetWindow(sheetTable.id);
        }

        CloseInformationWindow();
    })
});

