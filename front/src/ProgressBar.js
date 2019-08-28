class ProgressBar {

    /**
     * Main element container;
     * @var Element
     */
    container;

    /**
     * Progress bar HTMLElement;
     * @var Element
     */
    bar;

    constructor(container) {
        this.container = container;
        this.bar = this.container.querySelector('.progress-bar');
    }

    /**
     * Set the progress bar value (0 - 100)
     * @param {number} value
     */
    updateValue(value) {
        if (value > 100) {
            value = 100;
        }
        if (value < 0) {
            value = 0;
        }

        this.bar.style = 'width: ' + value + '%';
    }

    /**
     * Test to animate progressBar in full CSS.
     * It works but it lacks of control.
     * @param {number} duration
     */
    launch(duration) {
        this.reset();
        this.bar.style = 'transition: all '+ duration +'s linear;width: 100%';
    }

    reset() {
        this.bar.style = 'width: 0%';
    }
}

export default ProgressBar;