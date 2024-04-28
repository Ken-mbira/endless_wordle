import { GameBoard } from "./gameBoard.js";
import { Keyboard } from "./keyboard.js"

const tileContainer = document.querySelector('.tile-container');
const keyboardContainer = document.querySelector('.key-container');
const helpButton = document.querySelector('#help-link');
const dialogContainer = document.querySelector('#dynamic-dialog');

const gameBoard = new GameBoard(tileContainer);

const keyBoard = new Keyboard(keyboardContainer);

keyBoard.subscribe(key => gameBoard.handleKey(key))

helpButton.addEventListener('click', async () => {
    showDialog(dialogContainer);
})

function showDialog(dialogContainer) {
    fetch('help/help.html')
        .then(response => response.text())
        .then(data => {
            dialogContainer.innerHTML = data;

            dialogContainer.showModal();

            document.addEventListener('click', () => {
                dialogContainer.close();
            })
        })
        .catch(error => {
            console.error(`Error fetching the html ${error}`);
        })

}