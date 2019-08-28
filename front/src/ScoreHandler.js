import axios from 'axios';

class ScoreHandler {

    /**
     * Progress bar HTMLElement;
     * @var Element
     */
    scoresElement;

    /**
     * Progress bar HTMLElement;
     * @var []
     */
    scores;

    /**
     * 
     * @param {Element} scoresElement 
     */
    constructor(scoresElement) {
        this.scoresElement = scoresElement;
    }

    /**
     * Send score to server.
     * @param {number} score 
     */
    sendScore(score) {
        const date = new Date();
        axios({
            method: 'post',
            url: 'http://api.memo.olivierbarou.fr/api/games',
            data: {
                time: score,
                moment: date.toISOString(),
            }
        }).then(response => {
            this.getHighScores();
        });
    }

    /**
     * Get high scores from server.
     */
    getHighScores() {
        axios({
            method: 'get',
            url: 'http://api.memo.olivierbarou.fr/api/games?page=1&order%5Btime%5D=asc',
        }).then(response => {
            console.log(response);
            this.scores = response.data['hydra:member'];
            console.log(this.scores);
            this.printHighScores();
        });
    }

    /**
     * Get high scores from server.
     */
    printHighScores() {
        let scoreElement = this.scoresElement.lastElementChild;
        while (scoreElement) { 
            this.scoresElement.removeChild(scoreElement); 
            scoreElement = this.scoresElement.lastElementChild; 
        }
        this.scores.forEach(e => {
            let div = document.createElement("div");
            let timeElement = document.createElement("div");
            timeElement.classList.add('time');
            timeElement.innerHTML = e.time + ' secondes';
            div.appendChild(timeElement);
            let dateElement = document.createElement("div");
            dateElement.classList.add('date');
            let date = new Date(e.moment);
            dateElement.innerHTML = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            div.appendChild(dateElement);
            this.scoresElement.appendChild(div);
        });
       
    }
}

export default ScoreHandler;