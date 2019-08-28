
import ProgressBar from './ProgressBar.js';
import ScoreHandler from './ScoreHandler.js';

class Game {
    /**
     * Array storing cards found.
     * @var array
     */
    cardsFound = [];

    /**
     * Number of different pairs.
     * @var int
     */
    cardsCount = 14;

    /**
     * Are cards clickable?
     * @var boolean
     */
    gameLocked = true;

    /**
     * Currently returned pair.
     * @var array
     */
    unmaskedCards = [];

    /**
     * array representing all cards in the boards.
     * A pair is identified by a number.
     * Exemple with 3 different pairs : 1-1, 2-2 and 3-3
     * [1, 3, 2,
     *  2, 1, 3]
     * @var array
     */
    cards = [];

    /**
     * Game duration in second
     * @var number
     */
    gameDuration = 120;

    /**
     * Timestamp of game start.
     * @var number
     */
    startTime;

    /**
     * Timestamp of the end of the game.
     * @var number
     */
    endTime;

    /**
     * ID use to identify interval, the function called to update progressbar
     * and check if time is not over.
     * @var IntervalID
     */
    intervalId = null;

    /**
     * Object representing progress bar.
     * @var ProgressBar
     */
    progressBar;

    /**
     * Object managing score.
     * @var ScoreHandler
     */
    scoreHandler;

    /**
     * Play button HTMLElement;
     * @var Element
     */
    playButton;
    
    /**
     * Retry button HTMLElement;
     * @var Element
     */
    retryButton;

    /**
     * Constructor.
     */
    constructor() {
        this.progressBar = new ProgressBar(
            document.querySelector('.progress-bar-container'));
        this.scoreHandler = new ScoreHandler(
            document.querySelector('.scores'));
        this.scoreHandler.getHighScores();
        this.playButton = document.querySelector('.buttons .play');
        this.retryButton = document.querySelector('.buttons .retry');
    }

    /**
     * Initialize all game components.
     */
    initialize() {
        this.cardsFound = [];
        this.unmaskedCards = [];
        this.cards = [];
        this.lock();
        this.generateCardsList();
        this.createBoard();
        this.handleButtons();
    }

    
    /**
     * Define random card list.
     */
    generateCardsList() {
        for (let index = 1; index <= this.cardsCount; index++) {
            this.cards.push(index);
            this.cards.push(index);
        }
        this.cards = this.shuffle(this.cards);
    }

    /**
     * Set cards DOM elements.
     */
    createBoard() {
        let canvas = document.querySelector('.canvas');
        let card = canvas.lastElementChild;
        while (card) { 
            canvas.removeChild(card); 
            card = canvas.lastElementChild; 
        } 
        for (let index = 0; index < (this.cardsCount * 2); index++) {
            let div = document.createElement("div");
            div.classList.add('masked');
            div.classList.add('card');
            div.setAttribute('data-card', this.cards[index]);
            div.setAttribute('data-id', index);
            div.onclick = this.cardCallback.bind(this);
            document.querySelector('.canvas').appendChild(div);
        }
    }

    /**
     * Set play buttons callback.
     */
    handleButtons() {
        this.playButton.onclick = this.start.bind(this);
        this.retryButton.onclick = this.reset.bind(this);
    }

    /**
     * Start game.
     */
    start() {
        if (this.isInProgress()) {
            return;
        }
        this.playButton.classList.add('masked');
        this.retryButton.classList.remove('masked');
        document.querySelectorAll('.result .announce').forEach(e => {
            e.style = 'display: none';
        })
        this.startTime = Date.now();
        this.endTime = this.startTime + this.gameDuration * 1000;
        this.intervalId = window.setInterval(this.frame.bind(this), 500);
        this.unlock();
    }

    /**
     * Stop game.
     */
    stop() {
        if (this.intervalId !== null) {
            window.clearInterval(this.intervalId);
        }
        this.lock();
        this.intervalId = null;
    }

    /**
     * Stop, re-initialize and launch game.
     */
    reset() {
        this.stop();
        this.initialize();
        this.start();
    }

    /**
     * Callback called every 500ms during game to check time remining and progress bar.
     */
    frame() {
        let percent = ((Date.now() - this.startTime) / (this.gameDuration * 1000)) * 100;
        this.progressBar.updateValue(percent);
        if (Date.now() >= this.endTime) {
            this.stop();
            this.handleFail();
        }
    }

    /**
     * Function called in case of victory conditions are fullfilled.
     */
    handleVictory() {
        let score =  parseInt((Date.now() - this.startTime) / 1000, 10);
        let victoryElement = document.querySelector('.result .victory');
        victoryElement.querySelector('.victory-time').innerHTML = score;
        document.querySelector('.result .victory').style = 'display: block';
        this.scoreHandler.sendScore(score);
    }

    /**
     * Function called in case of fail.
     */
    handleFail() {
        document.querySelector('.result .fail').style = 'display: block';
    }

    /**
     * Called when user click on a card.
     */
    cardCallback(e) {
        let domElement = e.target;
        if (!domElement.classList.contains('masked') || this.gameLocked) {
            return;
        }
        this.lock();
        domElement.classList.remove('masked');

        this.unmaskedCards.push(domElement);

        if (this.unmaskedCards.length >= 2) {
            this.checkUnmaskedCardsEquality();
        } else {
            this.unlock();
        }
    };


    /**
     * Check if the 2 unmasked cards are identiqual.
     */
    checkUnmaskedCardsEquality() {
        if (this.unmaskedCards.length != 2) {
            return;
        }
        if (this.unmaskedCards[0].getAttribute('data-card') !== this.unmaskedCards[1].getAttribute('data-card')) {
            // The 2 unmasked cards are differents.
            window.setTimeout(() => {
                // Let them displayed for 1 second and hide them.
                this.unmaskedCards.forEach((elem) => {
                    elem.classList.add('masked')
                });
                this.unmaskedCards = [];
                this.unlock();
            }, 1000);
        } else {
            // The 2 unmasked cards are identical.
            this.cardsFound.push(this.unmaskedCards[0].getAttribute('data-card'));
            if (this.cardsFound.length === this.cardsCount) {
                // All cards had been found.
                this.stop();
                this.handleVictory();
            } else {
                this.unlock();
            }
            this.unmaskedCards = [];
        }
    }

    /**
     * Set game as locked. to prevent multiple clicks.
     */
    lock() {
        this.gameLocked = true;
    }

    /**
     * Set game as unlocked.
     */
    unlock() {
        this.gameLocked = false;
    }

    /**
     * Check if game is running by checking if Interval function is running.
     */
    isInProgress() {
        return this.intervalId !== null;
    }

    /**
     * Tool function to randomize an array.
     */
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