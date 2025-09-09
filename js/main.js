import {KeyListeners} from "./utils.js"
import { NoteHints} from "./utils.js";
import { NoteSheets } from "./utils.js";
import { ApplyDragEvent } from "./utils.js";
import { CloseSheetWindow } from "./utils.js";
import { ShowInformationWindow } from "./utils.js";
import { CloseInformationWindow } from "./utils.js";


document.addEventListener("DOMContentLoaded", function(){

    //handels event listenners to each black and white key 
    KeyListeners();

    NoteHints();

    NoteSheets();
    CloseSheetWindow();

    ShowInformationWindow();
    CloseInformationWindow();

    ApplyDragEvent();
});