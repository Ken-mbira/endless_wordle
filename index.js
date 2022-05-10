const tileContainer = document.querySelector('.tile-container')
const keyboard = document.querySelector('.key-container')

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

const guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]

guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement('div')
    rowElement.setAttribute('id', `guessRow-${guessRowIndex}`)
    guessRow.forEach((guess, guessIndex) => {
        const tileElement = document.createElement('div')
        tileElement.setAttribute('id', `guessRow-${guessRow}-tile${guessIndex}`)
        tileElement.classList.add("tile")
        rowElement.append(tileElement)
    })
    tileContainer.append(rowElement)
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
    console.log(key)
}