const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p");
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");
const scoreList = document.querySelector("#score-list");
const wpmEl = document.querySelector(".wpm");
const errorsEl = document.querySelector(".errors");
let errors = 0;
let previousCorrect = true;
let time = 0;
let interval = null;

const paragraphs = [
  "May the Force be with you.",

  "I am serious… and don’t call me Shirley.",

  "Houston, we have a problem.",

  "SpongeBob, if I had a dollar for every time you annoyed me, I'd retire",

  "You didn't just save my life brown eyes, you made my life worth saving."
];

// format time
function format(time) {
  let min = Math.floor(time / 6000);
  let sec = Math.floor((time % 6000) / 100);
  let ms = time % 100;
  return String(min).padStart(2, "0") + ":" + String(sec).padStart(2, "0") + ":" + String(ms).padStart(2, "0");
}


// save score
function saveScore(score) {
  let scores = JSON.parse(localStorage.getItem("scores")) || [];

  scores.push(score);

  // sort lowest time first
  scores.sort((a, b) => a - b);

  // keep only top 3
  scores = scores.slice(0, 3);

  localStorage.setItem("scores", JSON.stringify(scores));

  displayScores();
}


// display scores
function displayScores() {
  let scores = JSON.parse(localStorage.getItem("scores")) || [];

  scoreList.innerHTML = "";

  scores.forEach(score => {
    const li = document.createElement("li");
    li.textContent = format(score);
    scoreList.appendChild(li);
  });
}

//  event listener, typing 

testArea.addEventListener("input", function() {
  if (!interval) {
    interval = setInterval(function() {
      time++;
      theTimer.textContent = format(time);
    }, 10);
    }
  const text = testArea.value;
  if (text === originText.textContent) {
    clearInterval(interval);
    testWrapper.style.borderColor = "green";

    // calculate WPM
    const totalCharacters = text.length;
    const totalSeconds = time / 100;

    const wpm = Math.round(
      (totalCharacters / 5) / (totalSeconds / 60)
    );

    wpmEl.textContent = "WPM: " + wpm;

    saveScore(time);
  }
   else if (originText.textContent.startsWith(text)) {
    testWrapper.style.borderColor = "blue";
    previousCorrect = true;
  } else {
    testWrapper.style.borderColor = "red";

    // count mistake 
    if (previousCorrect) {
        errors++;
        errorsEl.textContent = "Errors: " + errors;
    }

    previousCorrect = false;
}
});
  // prevent paste
testArea.addEventListener("paste", function(e) {
  e.preventDefault();
});



originText.addEventListener("copy", function(e){
  e.preventDefault();
});


// reset
resetButton.addEventListener("click", function() {
  clearInterval(interval);
  interval = null;
  time = 0;
  theTimer.textContent = "00:00:00";
  testArea.value = "";
  testWrapper.style.borderColor = "grey";
  wpmEl.textContent = "WPM: 0";
  errors = 0;
previousCorrect = true;
errorsEl.textContent = "Errors: 0";
  // random paragraph
const randomIndex = Math.floor(Math.random() * paragraphs.length);

originText.textContent = paragraphs[randomIndex];
});

displayScores();