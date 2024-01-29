// Selecting elements from the DOM
const listOfAllDice = document.querySelectorAll(".die");
const scoreInputs = document.querySelectorAll("#score-options input");
const scoreSpans = document.querySelectorAll("#score-options span");
const currentRoundText = document.getElementById("current-round");
const currentRoundRollsText = document.getElementById("current-round-rolls");
const totalScoreText = document.getElementById("total-score");
const scoreHistory = document.getElementById("score-history");
const rollDiceBtn = document.getElementById("roll-dice-btn");
const keepScoreBtn = document.getElementById("keep-score-btn");
const rulesContainer = document.querySelector(".rules-container");
const rulesBtn = document.getElementById("rules-btn");

// Game state variables
let diceValuesArr = [];
let isModalShowing = false;
let score = 0;
let totalScore = 0;
let round = 1;
let rolls = 0;

// Function to roll the dice and update their values
const rollDice = () => {
  diceValuesArr = [];

  // Generate random values for the dice
  for (let i = 0; i < 5; i++) {
    const randomDice = Math.floor(Math.random() * 6) + 1;
    diceValuesArr.push(randomDice);
  }

  // Update the displayed values of the dice
  listOfAllDice.forEach((dice, index) => {
    dice.textContent = diceValuesArr[index];
  });
};

// Function to update various game stats
const updateStats = () => {
  currentRoundRollsText.textContent = rolls;
  currentRoundText.textContent = round;
};

// Function to update a radio option with a given score
const updateRadioOption = (optionNode, score) => {
  scoreInputs[optionNode].disabled = false;
  scoreInputs[optionNode].value = score;
  scoreSpans[optionNode].textContent = `, score = ${score}`;
};

// Function to update the total score and display score history
const updateScore = (selectedValue, achieved) => {
  totalScore += parseInt(selectedValue);
  totalScoreText.textContent = totalScore;

  scoreHistory.innerHTML += `<li>${achieved} : ${selectedValue}</li>`;
};

// Function to identify and update scores for highest duplicates
const getHighestDuplicates = (arr) => {
  const counts = {};

  // Count occurrences of each number in the array
  for (const num of arr) {
    if (counts[num]) {
      counts[num]++;
    } else {
      counts[num] = 1;
    }
  }

  let highestCount = 0;

  // Find the highest count of any number
  for (const num of arr) {
    const count = counts[num];
    if (count >= 3 && count > highestCount) {
      highestCount = count;
    }
    if (count >= 4 && count > highestCount) {
      highestCount = count;
    }
  }

  const sumOfAllDice = diceValuesArr.reduce((a, b) => a + b, 0);

  // Update radio options based on the highest counts
  if (highestCount >= 4) {
    updateRadioOption(1, sumOfAllDice);
  }

  if (highestCount >= 3) {
    updateRadioOption(0, sumOfAllDice);
  }

  updateRadioOption(5, 0);
};

// Function to identify and update scores for a full house
const detectFullHouse = (arr) => {
  const counts = {};

  // Count occurrences of each number in the array
  for (const num of arr) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }

  const hasThreeOfAKind = Object.values(counts).includes(3);
  const hasPair = Object.values(counts).includes(2);

  // Update radio options based on the presence of a full house
  if (hasThreeOfAKind && hasPair) {
    updateRadioOption(2, 25);
  }

  updateRadioOption(5, 0);
};

// Function to identify and update scores for straights
const checkForStraights = (arr) => {
  const sortedNumbersArr = arr.sort((a, b) => a - b);
  const uniqueNumbersArr = [...new Set(sortedNumbersArr)];
  const uniqueNumbersStr = uniqueNumbersArr.join("");

  const smallStraightsArr = ["1234", "2345", "3456"];
  const largeStraightsArr = ["12345", "23456"];

  // Update radio options based on the presence of straights
  if (smallStraightsArr.includes(uniqueNumbersStr)) {
    updateRadioOption(3, 30);
  }

  if (largeStraightsArr.includes(uniqueNumbersStr)) {
    updateRadioOption(4, 40);
  }

  updateRadioOption(5, 0);
};

