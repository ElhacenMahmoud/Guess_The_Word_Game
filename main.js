// Config
const GAME_NAME = "Guess The Word";
const NUM_TRIES = 6;
const NUM_LETTERS = 6;
let NUM_HINTS = 2;

// DOM elements
const titleElement = document.querySelector("title");
const headerElement = document.querySelector("h1");
const footerElement = document.querySelector(".footer");
const messageArea = document.querySelector(".message");
const hintButton = document.querySelector(".hint");
const guessButton = document.querySelector(".check");
const inputsContainer = document.querySelector(".inputs");

// Game state
let currentTry = 1;
let wordToGuess = "";
let triesLeft = NUM_TRIES;
document.querySelector(".hint span").innerHTML = NUM_HINTS;

// Word list
const words = [
  "Create",
  "Update",
  "Delete",
  "Master",
  "Branch",
  "Mainly",
  "Elzero",
  "School",
];

// Initialize game
function initGame() {
  titleElement.textContent = GAME_NAME;
  headerElement.textContent = GAME_NAME;
  footerElement.textContent = `${GAME_NAME} Game Created By El Hacen Mahmoud`;

  // Randomly select a word to guess
  wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();

  // Generate input fields
  generateInputs();
}

// Generate input fields
function generateInputs() {
  for (let i = 1; i <= NUM_TRIES; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}</span>`;

    if (i !== 1) tryDiv.classList.add("disabled-inputs");

    for (let j = 1; j <= NUM_LETTERS; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}-letter-${j}`;
      input.setAttribute("maxlength", "1");
      tryDiv.appendChild(input);
    }

    inputsContainer.appendChild(tryDiv);
  }

  // Focus on first input in first try element
  inputsContainer.children[0].children[1].focus();

  // Disable all inputs except first one
  function disableInputs() {
    const inputs = document.querySelectorAll(".disabled-inputs input");
    inputs.forEach((input) => (input.disabled = true));
  }
  disableInputs();

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    // Convert Input To Uppercase
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      const nextInput = inputs[index + 1];
      if (nextInput) nextInput.focus();
    });

    input.addEventListener("keydown", function (event) {
      const currentIndex = Array.from(inputs).indexOf(event.target);
      if (event.key === "ArrowRight") {
        const nextInput = currentIndex + 1;
        if (nextInput < inputs.length) inputs[nextInput].focus();
      }
      if (event.key === "ArrowLeft") {
        const prevInput = currentIndex - 1;
        if (prevInput >= 0) inputs[prevInput].focus();
      }
    });
  });
}

// Handle guess
function handleGuess() {
  let successGuess = true;
  for (let i = 1; i <= NUM_LETTERS; i++) {
    const inputField = document.querySelector(
      `#guess-${currentTry}-letter-${i}`
    );
    const letter = inputField.value.toLowerCase();
    const actualLetter = wordToGuess[i - 1];

    // Game logic
    if (letter === actualLetter) {
      // Letter is correct and in place
      inputField.classList.add("yes-in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      // Letter is correct and not in place
      inputField.classList.add("not-in-place");
      successGuess = false;
    } else {
      inputField.classList.add("no");
      successGuess = false;
    }
  }

  // Check if user wins or loses
  if (successGuess) {
    messageArea.innerHTML = `You win! The word is <span>${wordToGuess}</span>`;
    if (NUM_HINTS === 2) {
      messageArea.innerHTML = `<p>Congratz you didn't use hints!</p>`;
    }

    // Disable all try divs
    const allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));

    // Disable guess button
    guessButton.disabled = true;
    hintButton.disabled = true;
  } else {
    document
      .querySelector(`.try-${currentTry}`)
      .classList.add("disabled-inputs");
    const currentTryInputs = document.querySelectorAll(
      `.try-${currentTry} input`
    );
    currentTryInputs.forEach((input) => (input.disabled = true));

    currentTry++;

    const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
    nextTryInputs.forEach((input) => (input.disabled = false));

    let el = document.querySelector(`.try-${currentTry}`);
    if (el) {
      document
        .querySelector(`.try-${currentTry}`)
        .classList.remove("disabled-inputs");
      el.children[1].focus();
    } else {
      // Disable guess button
      guessButton.disabled = true;
      hintButton.disabled = true;
      messageArea.innerHTML = `You lose! The word is <span>${wordToGuess}</span>`;
    }
  }
}

// Handle hint
function getHint() {
  if (NUM_HINTS > 0) {
    NUM_HINTS--;
    document.querySelector(".hint span").innerHTML = NUM_HINTS;

    if (NUM_HINTS === 0) {
      hintButton.disabled = true;
    }

    const enabledInputs = document.querySelectorAll("input:not([disabled])");
    const emptyEnabledInputs = Array.from(enabledInputs).filter(
      (input) => input.value === ""
    );

    if (emptyEnabledInputs.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
      const randomInput = emptyEnabledInputs[randomIndex];
      const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
      if (indexToFill !== -1) {
        randomInput.value = wordToGuess[indexToFill].toUpperCase();
      }
    }
  }
}

// Handle backspace
function handleBackspace(event) {
  if (event.key === "Backspace") {
    const inputs = document.querySelectorAll("input:not([disabled])");
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);
    if (currentIndex > 0) {
      const currentInput = inputs[currentIndex];
      const prevInput = inputs[currentIndex - 1];
      currentInput.value = "";
      prevInput.value = "";
      prevInput.focus();
    }
  }
}

// Initialize event listeners
guessButton.addEventListener("click", handleGuess);
hintButton.addEventListener("click", getHint);
document.addEventListener("keydown", handleBackspace);

// Initialize game
initGame();
