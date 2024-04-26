import { ALL_WORDS } from "./allWords.js";
import { POSSIBLE_WORDS } from "./allWords.js";

const NUMBER_OF_LETTERS_PER_WORD = 5;
const INITIAL_NUMBER_OF_ROWS = 6;

export class GameBoard {
    #container;
    #cursor = [0,0]; // [rowPosition, tilePosition]
    #chosenWord = "";
    #disabledInput = false; // whether input can come in from user
    #rowCount = 0;

    constructor(
        containerElement
    ) {
        this.currentTile = 0;

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
        this.generateRows(noOfRows);
    }

    generateRows(newRowsCount) {
        for(let i=0; i<newRowsCount; i++) {
            const newRowPosition = this.#cursor[0] + i;

            const rowElement = document.createElement("div");
            rowElement.setAttribute("id", `guessRow-${newRowPosition}`);

            for(let j=0; j<NUMBER_OF_LETTERS_PER_WORD; j++) {
                const tileElement = document.createElement("div");
                tileElement.setAttribute("id", `guessRow-${newRowPosition}-tile-${j}`);
                tileElement.classList.add("tile");
                rowElement.append(tileElement);
            }

            this.#container.append(rowElement);
            this.#rowCount++;
        }

        this.scrollToView();
    }

    scrollToView() {
        const finalRow = document.getElementById(`guessRow-${this.#rowCount-1}`);
        const [left, bottom] = [finalRow.getBoundingClientRect().left, finalRow.getBoundingClientRect().bottom];

        const tileContainer = document.querySelector('.tile-container');
        tileContainer.scrollTo({
            top: bottom,
            left: left,
            behavior: "smooth"
        })
    }

    newLetter(letter) {
        const rowPosition = this.#cursor[0];
        const tilePosition = this.#cursor[1];

        if(tilePosition < NUMBER_OF_LETTERS_PER_WORD) {
            const tileElement = document.getElementById(`guessRow-${rowPosition}-tile-${tilePosition}`);
            tileElement.innerText = letter;
            this.#cursor[1]+=1;
        }

    }

    nextRow() {
        const rowPosition = this.#cursor[0];

        this.#cursor = [rowPosition + 1, 0];

        if(rowPosition == (this.#rowCount - 1)) {
            this.generateRows(INITIAL_NUMBER_OF_ROWS);
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

    async checkWord() {
        const rowPosition = this.#cursor[0];

        const letters = Array.from(new Array(5)).map((_, index) => {
            let tileElement = document.getElementById(`guessRow-${rowPosition}-tile-${index}`)
            return tileElement.innerText;
        })

        const word = letters.join("").toLowerCase();

        if(ALL_WORDS.includes(word)) {
            // word found
            this.#disabledInput = true; // we need to disable key input until the check cells function finishes going through all the cells

            for(let i=0; i<word.length; i++){
                let tileElement = document.getElementById(`guessRow-${rowPosition}-tile-${i}`);
                const overlayColor = word[i] === this.#chosenWord[i] ? 'green-overlay' : this.#chosenWord.includes(word[i]) ? 'yellow-overlay' : 'grey-overlay';
                await this.flipTile(tileElement, overlayColor);
            }

            this.#disabledInput = false;

            this.nextRow();
        }else{
            // word not found
            let messageDisplay = document.getElementById("message-display");
            messageDisplay.style.display = "flex";

            setTimeout(() => {
                messageDisplay.style.display = "none";
            }, 1000)
        }
    }

    flipTile(tileElement, overlayColor) {
        return new Promise((resolve) => {
            setTimeout(() => {
                tileElement.classList.add(overlayColor);
                tileElement.classList.add('flip');
                resolve()
            }, 500)
        })
    }

    handleKey(key){
        if(!this.#disabledInput) {
            if(key.length === 1) {
                this.newLetter(key);
            }else if(key === 'BACKSPACE'){
                this.deleteLetter();
            }else if(key === 'ENTER') {
                this.checkWord();
            }
        }
    }
}