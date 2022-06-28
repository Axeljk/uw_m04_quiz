var timer = 60.0;
var score = 0;
var questions = [];
var selected = 0;

window.onload = () => {
	document.querySelector("#begin").addEventListener("click", startQuiz);
	questions = Array.from(document.querySelectorAll("main > div"));
}

function startQuiz() {
	var timerCount = window.setInterval(Timer, 100);
	document.querySelector("#scoreboard").setAttribute("style", "display: flex");
	questionSelect();
}

function Timer() {
	if (timer > 0)
		timer = (timer - 0.1);
	updateScoreboard();
}

function questionSelect() {
	questions[0].setAttribute("style", "display: none");
	questions.splice(selected, 1);
	selected = Math.floor(Math.random() * questions.length);

	console.log(questions.length);
	console.log(selected);
	console.log(questions[selected]);
	questions[selected].setAttribute("style", "display: grid");
}

function updateScoreboard() {
	document.querySelector("#timer").textContent = timer.toFixed(1);
	document.querySelector("#score").textContent = score;
}