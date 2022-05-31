const main = document.querySelector("#main");
const sectionDifficulty = document.querySelector("#difficulty");
const sectionGame = document.querySelector("#game");
const sectionAddWord = document.querySelector("#addWord");
const canvasContainer = document.querySelector(".canvas-container");
const input = document.querySelector(".input");

const wordsList = ["PLATO", "CELULAR", "CAMPERA"];
const wordsList2 = ["GUITARRA", "PLATAFORMA", "CALENDARIO"];
const wordsList3 = ["ENCICLOPEDIA", "MULTIPLICACION", "CONSTITUCION"];
let lines, correctLetters, wrongLetters, x, word;
let list;

function chooseDifficulty() {
  main.classList.add("hide");
  sectionDifficulty.classList.remove("hide");
}

function addWord() {
  main.classList.add("hide");
  sectionAddWord.classList.remove("hide");
}

function addWordAndPlay() {
  const wordInput = input.value.toUpperCase();
  const wordLength = wordInput.length;

  if (wordLength >= 4 && wordLength <= 16) {
    if (wordLength >= 4 && wordLength < 8) {
      wordsList.push(wordInput);
    } else if (wordLength >= 8 && wordLength < 12) {
      wordsList2.push(wordInput);
    } else if (wordLength >= 12 && wordLength <= 16) {
      wordsList3.push(wordInput);
    }
    input.value = "";
    sectionAddWord.classList.add("hide");
    chooseDifficulty();
  } else {
    invalid();
  }
}

function cancel() {
  sectionAddWord.classList.add("hide");
  main.classList.remove("hide");
}

function playGame() {
  sectionDifficulty.classList.add("hide");
  sectionGame.classList.remove("hide");
  createCanvas();
  game();
}

function game() {
  word = chooseWord();
  lines = drawLine(word);
  correctLetters = [];
  wrongLetters = [];
  x = 400;
  drawHangman();
  document.addEventListener("keypress", listenKeyboard);
}

function listenKeyboard(event) {
  event.stopPropagation();
  let letter = captureLetter(event),
    indexes = index(word, letter);

  if (indexes && !correctLetters.includes(letter)) {
    drawCorrectLetter(indexes, letter, lines, correctLetters);

    if (correctLetters.length === word.length) {
      removeListeners();
      personalizedAlert(youWon());
    }
  } else if (letter) {
    if (!(correctLetters.includes(letter) || wrongLetters.includes(letter))) {
      x = drawWrongLetter(letter, x);
    }
    wrongLetters.push(letter);
    drawHangman(wrongLetters.length);

    if (wrongLetters.length === 9) {
      removeListeners();
      personalizedAlert(youLost());
    }
  }
}

function home() {
  sectionDifficulty.classList.add("hide");
  main.classList.remove("hide");
}

function newGame() {
  removeListeners();
  let canvas = document.querySelector("canvas");
  let context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();
  game();
}

function desist() {
  removeListeners();
  let canvas = document.querySelector("canvas");
  canvasContainer.removeChild(canvas);
  sectionGame.classList.add("hide");
  sectionDifficulty.classList.remove("hide");
}

function removeListeners() {
  document.removeEventListener("keypress", listenKeyboard, false);
}

function context() {
  return document.querySelector("canvas").getContext("2d");
}

function createCanvas() {
  let canvas = document.createElement("canvas");
  canvas.width = "1200";
  canvas.height = "700";
  canvasContainer.appendChild(canvas);
}

function chooseWord() {
  switch (event.target.id) {
    case "btnGame1":
      list = wordsList;
      break;
    case "btnGame2":
      list = wordsList2;
      break;
    case "btnGame3":
      list = wordsList3;
      break;
  }
  let index = Math.round(Math.random() * (list.length - 1));
  let word = list[index];
  return word;
}

function drawLine(word) {
  const paintBrush = context();
  let x = 570 - 35 * word.length;
  const positionsList = [];

  for (let i = 0; i < word.length; i++) {
    paintBrush.fillStyle = "rgb(26, 248, 255)";
    paintBrush.fillRect(x, 580, 60, 4);
    positionsList.push(x);
    x += 80;
  }
  return positionsList;
}

function captureLetter(event) {
  let keyValue = event.which;

  if (
    (keyValue >= 97 && keyValue <= 122) ||
    (keyValue >= 65 && keyValue <= 90) ||
    keyValue === 209 ||
    keyValue === 241
  ) {
    return event.key.toUpperCase();
  } else {
    return false;
  }
}

function index(word, letter) {
  let wordSplit = word.split(""),
    indexList = [],
    index = wordSplit.indexOf(letter);

  if (wordSplit.includes(letter)) {
    while (index != -1) {
      indexList.push(index);
      index = wordSplit.indexOf(letter, index + 1);
    }
    return indexList;
  } else {
    return false;
  }
}

function drawLetter(letter, color, x, y) {
  const pencil = context();
  // pencil.font = "Oxanium";
  pencil.font = "bold 50px 'Open Sans', sans-serif";
  pencil.fillStyle = color;
  pencil.fillText(letter, x, y);
}

function drawCorrectLetter(indexes, letter, x, correctLetters) {
  indexes.forEach((index) => {
    drawLetter(letter, "rgb(255, 225, 0)", x[index] + 15, 570);
    correctLetters.push(letter);
  });
}

function drawWrongLetter(letter, x) {
  drawLetter(letter, "rgb(255, 0, 158)", x, 660);
  return (x += 50);
}

function draw(paintBrush, thickness, xInitial, yInitial, xFinal, yFinal) {
  paintBrush.lineWidth = thickness;
  paintBrush.strokeStyle = "rgb(26, 248, 255)";
  paintBrush.beginPath();
  paintBrush.moveTo(xInitial, yInitial);
  paintBrush.lineTo(xFinal, yFinal);
  paintBrush.stroke();
}

function drawHangman(failures) {
  const paintBrush = context();

  switch (failures) {
    case 1:
      draw(paintBrush, 10, 500, 445, 500, 90);
      break;
    case 2:
      draw(paintBrush, 10, 485, 105, 680, 105);
      draw(paintBrush, 10, 500, 180, 575, 105);
      break;
    case 3:
      draw(paintBrush, 4, 670, 105, 670, 170);
      break;
    case 4:
      paintBrush.fillStyle = "rgb(26, 248, 255)";
      paintBrush.beginPath();
      paintBrush.arc(670, 202, 34, 0, 2 * 3.14);
      paintBrush.stroke();
      break;
    case 5:
      draw(paintBrush, 10, 670, 236, 670, 246);
      draw(paintBrush, 24, 670, 246, 670, 310);
      break;
    case 6:
      draw(paintBrush, 18, 668, 306, 633, 370);
      break;
    case 7:
      draw(paintBrush, 18, 672, 306, 707, 370);
      break;
    case 8:
      draw(paintBrush, 14, 666, 250, 633, 310);
      break;
    case 9:
      draw(paintBrush, 14, 674, 250, 707, 310);

      draw(paintBrush, 4, 650, 194, 664, 208);
      draw(paintBrush, 4, 650, 208, 664, 194);
      draw(paintBrush, 4, 674, 194, 688, 208);
      draw(paintBrush, 4, 674, 208, 688, 194);
      break;
    default:
      draw(paintBrush, 30, 440, 460, 760, 460);
      break;
  }
}

function personalizedAlert(alert) {
  setTimeout(function () {
    alert;
  }, 100);
}