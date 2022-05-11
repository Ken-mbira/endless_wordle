const tileContainer = document.querySelector('.tile-container')
const keyboard = document.querySelector('.key-container')

let wordle

document.getElementById('help-icon').addEventListener('click', () => {
    document.getElementById('help-section').style.display = 'flex'
})

document.getElementById('close-help-tab').addEventListener('click', () => {
    document.getElementById('help-section').style.display = 'none'
})

document.getElementById('play-again').addEventListener('click', () => {
    window.location.reload();
    document.getElementById('finished-section').style.display = 'none'
})



const getWordle = () => {
    fetch(`https://random-word-api.herokuapp.com/word?length=5`)
        .then(response => response.json())
        .then(json => {
            wordle = json[0].toUpperCase()
        })
        .catch(err => console.log(err))
}
getWordle()

const confirmWord = (word) => {
    return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
}

const keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'ENTER',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    '«',
]

let appendableRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]

let guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]

let currentTile = 0
let currentRow = 0
let rowTracker = 0
let isGameOver = false

guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement('div')
    rowElement.setAttribute('id', `guessRow-${rowTracker}`)
    guessRow.forEach((guess, guessIndex) => {
        const tileElement = document.createElement('div')
        tileElement.setAttribute('id', `guessRow-${rowTracker}-tile${guessIndex}`)
        tileElement.classList.add("tile")
        rowElement.append(tileElement)
    })
    tileContainer.append(rowElement)
    rowTracker++
})

document.addEventListener("keydown", event => {
    if (event.key.toUpperCase() === "BACKSPACE") {
        handleClick(keys[keys.length - 1])
    } else if (keys.includes(event.key.toUpperCase())) {
        handleClick(event.key.toUpperCase())
    }
});

keys.forEach(key => {
    const buttonElement = document.createElement('button')
    buttonElement.textContent = key
    buttonElement.setAttribute('id', key)
    buttonElement.addEventListener('click', () => handleClick(key))
    keyboard.appendChild(buttonElement)
})

const handleClick = (key) => {
    if (key === "ENTER") {
        checkRow()
    } else if (key === "«") {
        deleteLetter()
    } else {
        addLetter(key)
    }
}

const addLetter = (letter) => {
    if (currentTile < 5) {
        const tile = document.getElementById(`guessRow-${currentRow}-tile${currentTile}`)
        tile.textContent = letter
        tile.setAttribute('data', letter)
        guessRows[currentRow][currentTile] = letter
        currentTile++
    }
}

const checkRow = () => {
    const guess = guessRows[currentRow].join('')
    if (currentTile === 5) {
        confirmWord(guess).then((response) => {
            if (response.status === 200) {
                flipTile()
                if (wordle === guess) {
                    setTimeout(() => document.getElementById('finished-section').style.display = 'flex', 3000)
                    isGameOver = true;
                } else {
                    if (currentRow < rowTracker - 1) {
                        currentRow++
                        currentTile = 0
                    } else {
                        extendRows()
                        currentRow++
                        currentTile = 0
                    }
                }
            } else if (response.status === 404) {
                const messageBoard = document.getElementById('message-display')
                messageBoard.style.display = "flex"
                setTimeout(() => messageBoard.style.display = "none", 3000)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

}

const deleteLetter = () => {
    if (currentTile > 0) {
        currentTile--
        const tile = document.getElementById(`guessRow-${currentRow}-tile${currentTile}`)
        tile.textContent = ""
        tile.setAttribute('data', "")
        guessRows[currentRow][currentTile] = ""
    }
}

const extendRows = () => {
    appendableRows.forEach((newRow, guessRowIndex) => {
        const rowElement = document.createElement('div')
        rowElement.setAttribute('id', `guessRow-${rowTracker}`)
        newRow.forEach((guess, guessIndex) => {
            const tileElement = document.createElement('div')
            tileElement.setAttribute('id', `guessRow-${rowTracker}-tile${guessIndex}`)
            tileElement.classList.add("tile")
            rowElement.append(tileElement)
        })
        rowTracker++
        tileContainer.append(rowElement)
        guessRows.push(newRow)
    })
    tileContainer.scroll({
        top: tileContainer.scrollTop += 350,
        behavior: "smooth"
    })
}

const flipTile = () => {
    const rowTiles = document.getElementById(`guessRow-${currentRow}`).childNodes
    let checkWordle = wordle
    const guess = []

    rowTiles.forEach(tile => {
        guess.push({ letter: tile.getAttribute('data'), color: 'grey-overlay' })
    })

    guess.forEach((guess, index) => {
        if (guess.letter === wordle[index]) {
            guess.color = 'green-overlay'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    })

    guess.forEach(guess => {
        if (checkWordle.includes(guess.letter)) {
            guess.color = 'yellow-overlay'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    })

    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip')
            tile.classList.add(guess[index].color)
            addColorToKey(guess[index].letter, guess[index].color)
        }, 500 * index)
    })
}

const addColorToKey = (keyLetter, color) => {
    const key = document.getElementById(keyLetter)
    key.classList.add(color)
}