
// artwork
var bongoArt;
var catCursor;

// sounds
var meow;
var bongo;

// initial bongo location
var bongoX = 140;
var bongoY = 130;

// points system
var points = 0;
var misses = 0;

// milliseconds - to keep track of time played
var gameTime;
var pauseTime;

// reset counter to check if first time played for title screen
var reset_counter = 0;

// play
var play = false;


function preload() {
	// art
	bongoArt = loadImage("images/bongos.png");
	catCursor = loadImage("images/cat.png");

	// sounds
	meow = loadSound("sound/meow.mp3");
	bongos = loadSound("sound/bongos.mp3");

}

// Bongo Class
class Bongo {

	// contructor
	constructor(x, y, state) {
		// store values into object
		this.x = x;
		this.y = y;
		this.state = state;

		// random wait time
		this.timeWait = int(random(100,125));

		// count how long we have been waiting
		this.timer = 0;

	}

	display() {
		// center images and shapes
		imageMode(CENTER);
		ellipseMode(CENTER);

		// check if up or down
		if (this.state == "up") {
			image(bongoArt, this.x, this.y);
			noFill();
			stroke(255,0,0);
			strokeWeight(6);
			ellipse(this.x, this.y, 170, 130);
		}
		if (this.state == "down") {
			noFill();
			stroke(255);
			strokeWeight(6);
			ellipse(this.x, this.y, 170, 130);
		}

	    // increase timer
	    this.timer += 1;

	    // update to check if timer reaches wait time
	    this.update();
	}

	update() {
		// check if timer has reached wait time
	    if (this.timer >= this.timeWait) {

	        // change state
	        if (this.state == "down") {
	        	this.state = "up";
	        }
	        else {
	        	this.state = "down";
	        	misses++;
	        }

	        // reset time
	        this.timer = 0;

	        // new random wait time
	        this.timeWait = int(random(100,125));
		}

		// click function within the object
		this.clicked = function() {
			if (this.state == "up") {
				if (this.checkHit() == true) {
					points++;
					bongos.play();
					this.state = "down";
				}
			}
			else if (this.state == "down") {
				if (this.checkHit() == true) {
					meow.play();
					misses++;
				}
			}
		}
	}

	// check hit if mouse is pressed
	checkHit() {
		if (mousePressed) {
			return true;
		}
	}


}

// create an array of 9 bongos to hit
var bongos = new Array(9);

// setup
function setup() {
	
	// canvas
	createCanvas(800, 600);
	background(0);

	// fill in array of bongos
	for (var i=0; i<9; i++) {
		bongos[i] = new Bongo(bongoX, bongoY, "down");
		
		if (i == 2) {
			bongoX = 140;
			bongoY = 300;
		}
		else if (i == 5) {
			bongoX = 140;
			bongoY = 470;
		} else {
			bongoX += 250;
		}
	}

}

// draw
function draw() {
	// background
	background(0);

	// paused - title screen
	if (play == false) {
		// get current time
		pauseTime = Date.now();

		// first time playing
		if (reset_counter == 0) {
			// title screen - play button
			fill(255);
			image(bongoArt, 90, 40);
			image(bongoArt, 530, 40);
			image(catCursor, 360, 100);
			textSize(50);
			strokeWeight(1);
			text("PLAY", 340, 300);
			textSize(25);
			text("Just click on the bongos to earn points within 30 seconds!", 80, 370);
			text("If you hit an empty spot you get a miss!", 200, 410);
			text("If you don't hit the bongo before it disappears you get a miss!", 70, 450);

			// border for play button
			noFill();
			stroke(255);
			strokeWeight(6);
			rect(320,250,165,60);

		} else if (reset_counter == 1) {

			// Game Over - Score
			fill(255,0,0);
			stroke(255,0,0);
			textSize(50);
			strokeWeight(2);
			text("GAME OVER", 400, 250);
			text("FINAL SCORE: " + (points - misses), 395, 320);
			text("PLAY AGAIN", 400, 450);

			// borders for buttons
			noFill();
			stroke(255,0,0);
			rect(220,200,360,60); // GAME OVER border
			rect(180,270,430,60); // FINAL SCORE border
			rect(240,400,320,60); // PLAY AGAIN border

		}

	}

	// gameplay
	if (play == true) {
		// timer
		gameTime = Date.now() - pauseTime;
		gameTime = Math.floor(gameTime/1000);

		// end game
		if (gameTime == 30) {
			reset_counter = 1;
			play = false;
		}

		// cat cursor
		cursor("images/cat.png", mouseX, mouseY);

		// time
		fill (255);
		if ((30-gameTime) <= 5) {
			stroke(255,0,0);
			fill(255,0,0);
		}
		strokeWeight(1);
		text("Time: " + Math.floor(30 - gameTime), 380, 30);

		// points and misses
		drawWords(width * .75);

		// display
		for (var j = 0; j<9 ; j++) {
			bongos[j].display();
		}
	}


}


// mouse pressed
function mousePressed() {
	if (play == true) {
		for (var k=0; k<9; k++) {
			if ((mouseX >= bongos[k].x - 75 && mouseX <= bongos[k].x + 110) && (mouseY >= bongos[k].y - 50 && mouseY <= bongos[k].y + 75)) {
				bongos[k].clicked();
				return true;
			}
		}
	}

	if (play == false) {
		// boundaries for play button
		if ((mouseX >= 320 && mouseX <= 485) && ((mouseY >= 250 && mouseY <= 310))) {
			play = true;
			reset_counter = 1;
		}

		// boundaries for play again button
		if ((mouseX >= 240 && mouseX <= 560) && ((mouseY >= 400 && mouseY <= 470))) {
			play = true;
			points = 0;
			misses = 0;
		}
	}
}

// text function
function drawWords(x) {
	fill(255);
	textAlign(CENTER);
	textSize(25);
	stroke(255);
	strokeWeight(1);
	text("Points: " + points, 70, 30);
	text("Misses: " + misses, 650, 30);

}












