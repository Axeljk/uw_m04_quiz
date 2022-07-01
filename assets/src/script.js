// Constants. These values do NOT change.
const QUESTION_BONUS = 1;		// Points per correct answer.
const QUESTION_PENALTY = 2;		// Seconds lost for wrong answer.
const UNANSWERED_PENALTY = 1;	// Points lost per unanswered question.
const TIME_BONUS = 0.2;			// Points per second bonus.

// Global mutable variables.
var timer = 60.0;
var timerCount;
var score = 0;
var questions = [];
var selected = 0;

// Sets page up once loaded.
window.onload = () => {
	document.querySelector("#begin").addEventListener("click", startQuiz);
	document.querySelector("main").addEventListener("click", answer);
	document.querySelector("#submit").addEventListener("click", scores);
}

// Beginning of quiz.
function startQuiz() {
	// Set everything again just in case.
	timer = 60.0;
	score = 0;
	selected = 0;
	questions = Array.from(document.querySelectorAll("main > div"));

	timerCount = window.setInterval(Timer, 100);
	document.querySelector("#scores").setAttribute("style", "display: none");
	document.querySelector("#scoreboard").setAttribute("style", "display: flex");
	questionSelect();
}

// Event called when clicking (answering) one of the questions. Determines what
//   to do if it is right/wrong.
function answer(event) {
	if (event.target.matches(".answer")) {
		if (event.target.getAttribute("data-answer") === "right")
			score++;
		else
			timer -= QUESTION_PENALTY;
		questionSelect();
	}
}

// Countdown function. Automatically ends the quiz if time runs out.
function Timer() {
	if (timer > 0)
		timer = (timer - 0.1);
	else {
		timer = 0;
		endGame();
	}

	updateScoreboard();
}

// Handles picking the next question at random. Automatically ends quiz if none.
function questionSelect() {
	questions[selected].setAttribute("style", "display: none");
	questions.splice(selected, 1);

	if (questions.length > 0) {
		selected = Math.floor(Math.random() * questions.length);
		questions[selected].setAttribute("style", "display: grid");
	} else
		endGame();
}

// Tallies-up score and provides a heartfelt message on the inherent value of the user.
function endGame() {
	// Calculate parts of the score.
	let questionsTotal = document.querySelectorAll(".question").length;
	let questionScore = score - (questions.length * UNANSWERED_PENALTY);
	let timeScore = Math.floor(timer * TIME_BONUS);

	// Transition to end screen.
	clearInterval(timerCount);
	if (questions.length > 0)
		questions[selected].setAttribute("style", "display: none");
//	document.querySelector("header").setAttribute("style", "display: none");
	document.querySelector("#scoreboard").setAttribute("style", "display: none");
	document.querySelector("#end").setAttribute("style", "display: grid");

	// Question section of score.
	document.querySelector("#qScore").textContent = score;
	document.querySelector("#qAnswered").textContent = questionsTotal - questions.length;
	document.querySelector("#qUnanswered").textContent = questions.length;
	document.querySelector("#qTotal").textContent = questionsTotal;
	document.querySelector("#qFinal").textContent = questionScore;

	// Time section of score.
	document.querySelector("#tLeft").textContent = timer.toFixed(1);
	if (timer > 1) { // Penalize wrong answers if time is left.
		let timePenalty = (questionsTotal - questions.length - score) * QUESTION_PENALTY;

		timeScore -= timePenalty;
		document.querySelector("#tWrong").textContent += (questionsTotal - questions.length - score);
	} else
		document.querySelector("#tWrong").textContent = "";
	document.querySelector("#tFinal").textContent = timeScore;

	// Total score and final message.
	if (questionScore + timeScore >= 15)
		document.querySelector("#rating").textContent = "excellent!!";
	else if (questionScore + timeScore >= 10)
		document.querySelector("#rating").textContent = "great!";
	else if (questionScore + timeScore >= 5)
		document.querySelector("#rating").textContent = "good.";
	else if (questionScore + timeScore >= 0)
		document.querySelector("#rating").textContent = "okay.";
	else
		document.querySelector("#rating").textContent = "awful.";
	score = questionScore + timeScore;
	document.querySelector("#msg").textContent = score;
}

// Creates the highscore list.
function scores(event) {
	let scoreData = [];
	let spaces = 20;

	// Switch screens.
	event.preventDefault();
	document.querySelector("#end").setAttribute("style", "display: none");
	document.querySelector("#scores").setAttribute("style", "display: block");

	// Read any saved scores, add our new score (if finished), sort, and save.
	if (localStorage.getItem("scoreData") != null)
		scoreData = JSON.parse(localStorage.getItem("scoreData"));
	if (document.querySelector("#name").value != "") {
		scoreData.push({
			name: document.querySelector("#name").value,
			score: score
		});
	}
	document.querySelector("#name").value = "";
	if (scoreData != []) {
		scoreData.sort((a, b) => { return b.score - a.score; });
		scoreData.splice(10);
		localStorage.setItem("scoreData", JSON.stringify(scoreData));
	}

	// Display the high scores.
	for (let i = 0; i < scoreData.length; i++) {
		let item = document.createElement("li");
		item.textContent = scoreData[i].name.padEnd(spaces, "\xa0") + scoreData[i].score.toString().padStart(4, "0");
		document.querySelector("#highscores").appendChild(item);
	}
}

// Updates elements on page with time left and current score.
function updateScoreboard() {
	document.querySelector("#timer").textContent = timer.toFixed(1).toString().padStart(4, "0");
	document.querySelector("#score").textContent = score.toString().padStart(3, "0");
}