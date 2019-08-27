class Game {
    cardsFound = [];
    cardsCount = 14;
    gameLocked = false;
    unmaskedCards = [];
    cards = [];

    constructor() {
    }

    initialize() {
        this.cardsFound = [];
        this.unmaskedCards = [];
        this.gameLocked = false;
        this.generateCardsList();
        this.createBoard();
        
    }

    generateCardsList() {
        for (let index = 1; index <= this.cardsCount; index++) {
            this.cards.push(index);
            this.cards.push(index);
        }
        this.cards = this.shuffle(this.cards);
    }

    createBoard() {
        for (let index = 0; index < (this.cardsCount * 2); index++) {
            let div = document.createElement("div");
            div.className = 'card masked';
            div.setAttribute('data-card', this.cards[index]);
            div.setAttribute('data-id', index);
            div.onclick = this.cardCallback.bind(this);
            document.querySelector('.canvas').appendChild(div);
        }
    }

    cardCallback(e) {
        let domElement = e.target;
        if (!domElement.classList.contains('masked') || this.gameLocked) {
            return;
        }
        this.gameLocked = true;
        domElement.classList.remove('masked')
    
        this.unmaskedCards.push(domElement);
    
        if (this.unmaskedCards.length >= 2) {
            this.checkUnmaskedCardsEquality();
        } else {
            this.gameLocked = false;
        }
    };

    checkUnmaskedCardsEquality() {
        if (this.unmaskedCards.length != 2) {
            return;
        }
        if (this.unmaskedCards[0].getAttribute('data-card') !== this.unmaskedCards[1].getAttribute('data-card')) {
            window.setTimeout(() => {
                this.unmaskedCards.forEach((elem) => {
                    elem.classList.add('masked')
                });
                this.unmaskedCards = [];
                this.gameLocked = false;
            }, 1000);
        } else {
            this.gameLocked = false;
            this.cardsFound.push(this.unmaskedCards[0].getAttribute('data-card'));
            this.unmaskedCards = [];
        }
    }
    
    shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

}

export default Game;