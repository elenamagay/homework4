// variables to keep track of quiz state
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

// variables to reference DOM elements
var questionsEl = document.getElementById("questions");
var timerEl = document.getElementById("time");
var choicesEl = document.getElementById("choices");
var submitBtn = document.getElementById("submit");
var startBtn = document.getElementById("start");
var initialsEl = document.getElementById("initials");
var feedbackEl = document.getElementById("feedback");
var score = document.getElementById("scores");


// sound effects
var sfxRight = new Audio("assets/sfx/correct.wav");
var sfxWrong = new Audio("assets/sfx/incorrect.wav");

function startQuiz() {
  // hide start screen
    startScreen.style.display = "none";
  // un-hide questions section
    questionsEl.style.display = "block";
  
  // start timer
  // show starting time
  timerId = setInterval(function() {
    time--;
    timerEl.textContent = time;
  }, 1000);

  getQuestion();
}

function getQuestion() {
  // get current question object from array
  var currentQuestion = questions[currentQuestionIndex];
  choicesEl.textContent = questions[0].choices;

  // update title with current question
  questionTitle.textContent = questions[currentQuestionIndex].title;
  // clear out any old question choices
  if (choicesEl !== "") {
  choicesEl.textContent = ""
  };
  // loop over choices
  currentQuestion.choices.forEach(function(choice, i) {
    // create new button for each choice
    var btn = document.createElement("button");
    var text = document.createTextNode(choice);
    btn.appendChild(text);
    // attach click event listener to each choice
    btn.addEventListener("click", function () {
      questionClick(btn)
    });
    // display on the page
    choicesEl.appendChild(btn);
  });
    
}

function questionClick(btnPress) {
  var userAnswer = btnPress.innerText;
  var correctAnswer = questions[currentQuestionIndex].answer;
    // check if user guessed wrong
  if (userAnswer !== correctAnswer) {
    // penalize time
    time -= 10;

    if (time < 0) {
      time = 0;
    }
    // display new time on page
    timerEl.innerText = time;
    // play "wrong" sound effect
    sfxWrong.play();
    feedbackEl.textContent = "Wrong!"

  } else {
    score++;
    // play "right" sound effect
    sfxRight.play();
    feedbackEl.textContent = "Correct!"
  }

  // flash right/wrong feedback on page for a second
  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function() {
    feedbackEl.setAttribute("class", "feedback hide");
  }, 1000);

  // move to next question
  currentQuestionIndex++;
  // check if we've run out of questions
  if (currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  // stop timer
  clearInterval(time);
  // show end screen
  endScreen.style.display = "block";
  // show final score
  finalScore.innerText = score;
  // hide questions section
  questionsEl.style.display = "none";
  questionsEl.setAttribute("class", "hide");
}

function clockTick() {
  // update time
  time--;
  timerEl.textContent = time;

  // check if user ran out of time
  if (time <= 0) {
    quizEnd();
  }
}

function saveHighscore() {
  // get value of input box
  var newInitials = initialsEl.value;

  if (newInitials.length !== " " && newInitials.length > 3) {
    feedbackEl.textContent = "Error initials cannot be blank or longer than 3 characters";
    feedbackEl.setAttribute("class", "feedback");
    setTimeout(function() {
      feedbackEl.setAttribute("class", "feedback hide");
    }, 1000);

    return
  }
  var newScore = {
    score: score,
    newInitials: newInitials
  };

  // save to local storage
  localStorage.setItem("newScore", JSON.stringify(newScore));
  // redirect to a highscore page
    window.location.href = "highscores.html"
  
};


function checkForEnter(event) {
  // "13" represents the enter key
  if (event.key === "enter") {
    event.preventDefault();
    submitBtn.click();
    saveHighscore();
  }
};

// user clicks button to submit initials
submitBtn.addEventListener("click", saveHighscore);

// user clicks button to start quiz
startBtn.addEventListener("click", startQuiz);

initials.addEventListener("keyup", checkForEnter);
