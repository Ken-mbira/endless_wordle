const NUMBER_OF_LETTERS_PER_WORD = 5;
const INITIAL_NUMBER_OF_ROWS = 5;

export class GameBoard {
    #container;

    constructor(
        containerElement
    ) {
        this.currentTile = 0;
        this.currentRow = 0;
        this.rowCount = 0;

        this.#container = containerElement;

        this.regenerateBoard(INITIAL_NUMBER_OF_ROWS);
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
                tileElement.setAttribute("id", `guessRow-${this.rowCount}-tile-${j}`);
                tileElement.classList.add("tile");
                rowElement.append(tileElement);
            }

            this.#container.append(rowElement);
        }
    }
}