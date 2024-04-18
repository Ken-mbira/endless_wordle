const KEYS = [
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

export class Keyboard {
    #container;
    #observers = [];

    constructor(containerElement) {
        this.#container = containerElement;
        this.#observers = [];
        
        this.renderKeyboard();
        this.listenForActualKeyboard();
    }

    renderKeyboard() {
        for(let i=0; i<KEYS.length; i++) {
            const buttonElement = document.createElement("button");
            buttonElement.textContent = KEYS[i];

            this.#container.appendChild(buttonElement);

            buttonElement.addEventListener('click', () => {
                if(KEYS[i] === "«") {
                    this.submitKey("BACKSPACE")
                }else{
                    this.submitKey(KEYS[i])
                }
            })
        }
    }

    listenForActualKeyboard() {
        document.addEventListener('keydown', (event) =>{
            const pressedKey = event.key.toUpperCase();

            if(KEYS.includes(pressedKey) || pressedKey === "BACKSPACE"){
                if(pressedKey === '«') {
                    this.submitKey('BACKSPACE');
                }else{
                    this.submitKey(pressedKey);
                }
            }
        })
    }

    subscribe(observerFunction) {
        this.#observers.push(observerFunction);
    }

    submitKey(letter) {
        this.#observers.forEach(observer => observer(letter));
    }
}