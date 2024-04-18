import { GameBoard } from "./gameBoard.js";
import { Keyboard } from "./keyboard.js"

const tileContainer = document.querySelector('.tile-container');
const keyboardContainer = document.querySelector('.key-container');

const gameBoard = new GameBoard(tileContainer);

const keyBoard = new Keyboard(keyboardContainer);
keyBoard.subscribe((key) => {
    console.log('heres the key', key)
})