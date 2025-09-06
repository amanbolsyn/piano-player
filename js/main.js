import {KeyListeners} from "./utils.js"
import { NoteHints} from "./utils.js";
import { NoteSheets } from "./utils.js";


document.addEventListener("DOMContentLoaded", function(){

    //handels event listenners to each black and white key 
    KeyListeners();

    NoteHints();

    NoteSheets();
});