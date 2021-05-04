"use strict";

/**
 * HTML Elements
 */
//  Text Areas
let inputText = document.getElementById("inputArea");
let shownText = document.getElementById("showingArea");

//buttons
let startBtn = document.getElementById("startBtn");
let stopBtn = document.getElementById("stopBtn");

//radioButtons
let sizeRadioBtn = document.getElementsByName("textSize");

//speed options
let speedOptions = document.querySelector("select");

let firstRun = true;
let paused = false;
/**
 *  Helper Variables
 */
let words; // variable to get the words after splicing the text
let showWordsIntervalID = -1; //variable to get the interval id to clear it later
let index = 0; //variable to get words index to help showing the exact word needed

class settings {
  static speed = speedOptions[speedOptions.options.selectedIndex].value; //variable to set the word speed in millie seconds
}

//Helper Functions
//-----------------

/**
 * helper function to update the showText
 */
let updateShowArea = () => {
  firstRun = false;
  if (!firstRun) {
    showWordsIntervalID = setInterval(
      () => (shownText.innerHTML = centerLetter(getWords())),
      settings.speed
    );
  }
};

let startingCond = () => {
  startBtn.disabled = false;
  inputText.disabled = false;
  startBtn.innerHTML = "Start";
  stopBtn.disabled = true;
  firstRun = true;
};

/**
 *  helper function to get the needed word from the words array
 * @returns {string} the current needed word
 */
let getWords = () => {
  if (words.length > index) return words[index++];
  else {
    clearInterval(showWordsIntervalID);
    startingCond();
    return words[index - 1];
  }
};

/**
 * helper function to remove the last punctuation in a word
 * and insert it in the array to show it double the time
 */
let removePunctuation = () => {
  for (const [index, word] of words.entries()) {
    if (index != 0 && words[index] === words[index - 1]) continue;
    if (words[index].search(/[,.;:!?]$/) != -1) {
      words[index] = word.replace(/[,.;:!?]$/, "");
      words.splice(index, 0, words[index]);
    }
  }
};

/**
 * helper function to set size pf the shownText
 * upon action on radioButton
 */
let setTextSizeVal = () => {
  for (const iterator of sizeRadioBtn) {
    if (iterator.checked) {
      if (iterator.value === "Medium") shownText.style.fontSize = "36pt";
      else if (iterator.value === "Big") shownText.style.fontSize = "48pt";
      else if (iterator.value === "Bigger") shownText.style.fontSize = "60pt";
    }
  }
};

/**
 * helper function to be called upon window loading to
 * assign event listeners to radioBtns upon change to alter text
 * size
 */
let setEventListenersForRadioBtns = () => {
  sizeRadioBtn.forEach((elem) => {
    elem.addEventListener("change", setTextSizeVal);
  });
};

/**
 * helper function to change text speed
 */
let setSpeed = () => {
  settings.speed = speedOptions[speedOptions.options.selectedIndex].value;
  clearInterval(showWordsIntervalID);
  !firstRun&&!paused ?  updateShowArea() : getText();
};

/**
 * extracting words form the input text and fill the words array
 */
let getText = () => {
  words = inputText.value.split(/[ \t\n]+/);
  removePunctuation();
  index == words.length ? (index = 0) : 0;
};

let centerLetter = (word) => {
  let child;
  if (word.length > 13) child = stringCentringFormat(word, 5);
  else if (word.length > 9) child = stringCentringFormat(word, 4);
  else if (word.length > 5) child = stringCentringFormat(word, 3);
  else if (word.length > 2) child = stringCentringFormat(word, 2);
  else if (word.length > 1)
    child = "&nbsp" + coloringTheCenterChar(word[0]) + word[word.length - 1];
  else child = coloringTheCenterChar(word[0]);
  return child;
};

let stringCentringFormat = (word, centerIndex) => {
  let length = word.length;
  let allChar = word.split("");
  let temp = allChar.splice(0, centerIndex - 1);
  let letter = allChar.splice(0, 1);
  let text =
    addSpaces(centerIndex, length) +
    temp.join("") +
    coloringTheCenterChar(letter) +
    allChar.join("");
  return text;
};

let addSpaces = (center, length) => {
  let addedSpaces = "";
  for (let i = 0; i < length + 1 - 2 * center; i++) addedSpaces += "&nbsp";
  return addedSpaces;
};

/**
 *
 * @param {char} letter
 * @returns
 */
let coloringTheCenterChar = (letter) => {
  let child = '<span style="color: red">' + letter + "</span>";
  return child;
};

//Event Listeners
//----------------

/**
 * assigning listeners to the radioButtons window loading
 * -----------------------------------------------------------
 */
window.addEventListener("load", setEventListenersForRadioBtns);

/**
 * Event listener to the speed options
 */
speedOptions.addEventListener("change", setSpeed);
/**
 *  start button event listener
 * ----------------------------
 *  starts showing the input text with the determined speed in the show area
 */
startBtn.addEventListener("click", () => {
  paused = false;
  clearInterval(showWordsIntervalID);
  words = inputText.value.split(/[ \t\n]+/);
  removePunctuation();
  index == words.length ? (index = 0) : 0;
  updateShowArea();
  stopBtn.disabled = false;
  startBtn.disabled = true;
  inputText.disabled = true;
});

/**
 *  stop button event listener
 * ----------------------------
 *  clears the interval
 */
stopBtn.addEventListener("click", () => {
  paused = true;
  clearInterval(showWordsIntervalID);
  shownText.value = "";
  startBtn.disabled = false;
  inputText.disabled = false;
  startBtn.innerHTML = "Continue";
});
