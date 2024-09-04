/* 
    NOTE: ChatGPT was utilized to generate most of the code. 
    some modifications were made by myself, it's been a long while
    since I've used Javascript, html, and css so I'm a bit rusty, and used my own
    comments to help me understand the code better.
*/

// Utility class for common helper functions
class Utils {
    // Generates a random color in hex
    static getRandomColor() {
        // Hex color code
        const letters = '0123456789ABCDEF';
        let color = '#';
        // Loop to generate a random color
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Validates input to ensure the number is between 3 and 7
    static validateInput(input) {
        // Check if the input is a number and within the range
        const n = parseInt(input);
        if (isNaN(n) || n < 3 || n > 7) {
            alert(messages.enterValidNumber);
            return false;
        }
        return true;
    }

    // Generates a random position within the browser window for a button
    static getRandomPosition(button) {
        const randomTop = Math.random() * (window.innerHeight - button.offsetHeight * 3);
        const randomLeft = Math.random() * (window.innerWidth - button.offsetWidth);
        return { top: `${randomTop}px`, left: `${randomLeft}px` };
    }
}

// Class to represent each button and its behavior
class Button {
    // The constructor for the button
    constructor(order, color, width = '10em', height = '5em') {
        this.order = order;
        this.element = document.createElement('button');
        this.element.style.width = width;
        this.element.style.height = height;
        // Sets the buttons relative so no overlapping initially
        this.element.style.position = 'relative';
        this.element.style.backgroundColor = color;
        this.element.innerText = `${order}`;
    }

    // Set position of the button
    setPosition(top, left) {
        // Uses absolute positioning to move the button so it doesn't affect other buttons
        this.element.style.position = 'absolute';
        this.element.style.top = top;
        this.element.style.left = left;
    }

    // Hide the button's number
    hideNumber() {
        this.element.innerText = '?';
    }

    // Show the button's number
    showNumber() {
        this.element.innerText = `${this.order}`;
    }

    // Add click event handler
    addClickListener(callback) {
        this.element.addEventListener('click', callback);
    }

    // Remove click event handler
    removeClickListener(callback) {
        this.element.removeEventListener('click', callback);
    }
}

// The main game class
class ButtonGame {
    constructor() {
        this.arrayButtons = [];
        this.currentOrder = [];
        this.userOrder = [];
        this.isGameInProgress = false;
        this.init();
    }

    init() {
        document.getElementById('startButton').addEventListener('click', () => this.startGame());
    }

    startGame() {
        const input = document.getElementById('numberInput').value;
        
        if (!Utils.validateInput(input)) return;

        if (this.isGameInProgress) {
            alert(messages.gameInProgress);
            return;
        }

        this.resetGame();
        this.createButtons(parseInt(input));
        
        setTimeout(() => {
            this.scrambleButtons(parseInt(input));
        }, parseInt(input) * 1000); // Wait n seconds
    }

    resetGame() {
        const buttonContainer = document.getElementById('buttonContainer');
        buttonContainer.innerHTML = ''; // Clear previous buttons
        this.arrayButtons = [];
        this.currentOrder = [];
        this.userOrder = [];
        this.isGameInProgress = true;
    }

    createButtons(n) {
        const buttonContainer = document.getElementById('buttonContainer');
        buttonContainer.style.position = 'relative'; // Ensure container is positioned for absolute buttons

        for (let i = 0; i < n; i++) {
            const button = new Button(i + 1, Utils.getRandomColor());
            buttonContainer.appendChild(button.element);
            this.arrayButtons.push(button);
            this.currentOrder.push(i + 1);
        }
    }

    scrambleButtons(times) {
        let scrambleCount = 0;
        const scrambleInterval = setInterval(() => {
            this.arrayButtons.forEach(button => {
                const { top, left } = Utils.getRandomPosition(button.element);
                button.setPosition(top, left);
            });
            scrambleCount++;

            if (scrambleCount >= times) {
                clearInterval(scrambleInterval);
                this.prepareForMemoryTest();
            }
        }, 2000);
    }

    prepareForMemoryTest() {
        this.arrayButtons.forEach(button => {
            button.hideNumber();
            button.addClickListener(() => this.handleButtonClick(button.order, button));
        });
        this.isGameInProgress = false;
    }

    handleButtonClick(buttonOrder, button) {
        if (this.isGameInProgress) return; // Prevent interaction during scrambling

        this.userOrder.push(buttonOrder);

        // Check if the current button click is correct
        if (this.userOrder[this.userOrder.length - 1] !== this.currentOrder[this.userOrder.length - 1]) {
            this.endGame(false);
            return;
        }

        // Reveal the correct number on the button
        button.showNumber();

        // Check if all buttons are clicked in correct order
        if (this.userOrder.length === this.currentOrder.length) {
            this.endGame(true);
        }
    }

    endGame(success) {
        if (success) {
            alert(messages.excellentMemory);
        } else {
            alert(messages.wrongOrder);
            this.revealCorrectOrder();
        }
        this.isGameInProgress = false;
    }

    revealCorrectOrder() {
        this.arrayButtons.forEach(button => {
            button.showNumber();
        });
    }
}

// Instantiate the game
const buttonGame = new ButtonGame();
