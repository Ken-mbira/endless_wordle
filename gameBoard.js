import { ALL_WORDS } from "./allWords.js";
import { POSSIBLE_WORDS } from "./allWords.js";

const NUMBER_OF_LETTERS_PER_WORD = 5;
const INITIAL_NUMBER_OF_ROWS = 5;

export class GameBoard {
    #container;
    #cursor = [0,0]; // [rowPosition, tilePosition]
    #chosenWord = "";

    constructor(
        containerElement
    ) {
        this.currentTile = 0;
        this.currentRow = 0;
        this.rowCount = 0;

        this.#container = containerElement;

        this.#chosenWord = this.chooseWord();

        this.regenerateBoard(INITIAL_NUMBER_OF_ROWS);
    }

    chooseWord() {
        let randomIndex = Math.floor(Math.random() * (POSSIBLE_WORDS.length - 1));
        return POSSIBLE_WORDS[randomIndex];
    }

    clearBoard() {
        while(this.#container.firstChild) {
            this.#container.removeChild(this.#container.firstChild);
        }
    }

    regenerateBoard(noOfRows) {
        this.clearBoard();
        this.generateTiles(noOfRows);
        this.rowCount = noOfRows;
    }

    generateTiles(newTilesCount) {
        for(let i=0; i<=newTilesCount; i++) {
            const rowElement = document.createElement("div");
            rowElement.setAttribute("id", `guessRow-${i}`);

            for(let j=0; j<NUMBER_OF_LETTERS_PER_WORD; j++) {
                const tileElement = document.createElement("div");
                tileElement.setAttribute("id", `guessRow-${i}-tile-${j}`);
                tileElement.classList.add("tile");
                rowElement.append(tileElement);
            }

            this.#container.append(rowElement);
        }
    }

    newLetter(letter) {
        const rowPosition = this.#cursor[0];
        const tilePosition = this.#cursor[1];
        console.log(rowPosition, tilePosition)


        if(tilePosition < NUMBER_OF_LETTERS_PER_WORD) {
            const tileElement = document.getElementById(`guessRow-${rowPosition}-tile-${tilePosition}`);
            tileElement.innerText = letter;
            this.#cursor[1]+=1;
        }

    }

    deleteLetter() {
        const rowPosition = this.#cursor[0];
        const tilePosition = this.#cursor[1];

        if(tilePosition > 0) {
            const tileElement = document.getElementById(`guessRow-${rowPosition}-tile-${tilePosition-1}`);
            tileElement.innerText = '';
            this.#cursor[1]-=1;
        }
    }

    checkWord() {
        const rowPosition = this.#cursor[0];

        const letters = Array.from(new Array(5)).map((_, index) => {
            let tileElement = document.getElementById(`guessRow-${rowPosition}-tile-${index}`)
            return tileElement.innerText;
        })

        const word = letters.join("").toLowerCase();

        if(ALL_WORDS.includes(word)) {
            // word found
            this.checkCells(word, this.#chosenWord, rowPosition);

            this.#cursor = [rowPosition + 1, 0];
        }else{
            // word not found
            let messageDisplay = document.getElementById("message-display");
            messageDisplay.style.display = "flex";

            setTimeout(() => {
                messageDisplay.style.display = "none";
            }, 1000)
        }
    }

    checkCells(checkWord, actualWord, rowPosition) {
        for(let i=0; i<checkWord.length; i++){
            let cellValue = checkWord[i];
            let shouldBeCellValue = actualWord[i];

            let tileElement = document.getElementById(`guessRow-${rowPosition}-tile-${i}`);
            
            setTimeout(() => {
                if(cellValue === shouldBeCellValue){
                    tileElement.classList.add('green-overlay');
                }else if(actualWord.includes(cellValue)){
                    tileElement.classList.add('yellow-overlay');
                }else{
                    tileElement.classList.add('grey-overlay');
                }

                tileElement.classList.add('flip');
            }, 500 * i)
        }
    }

    handleKey(key){
        if(key.length === 1) {
            this.newLetter(key);
        }else if(key === 'BACKSPACE'){
            this.deleteLetter();
        }else if(key === 'ENTER') {
            this.checkWord();
        }
    }
}