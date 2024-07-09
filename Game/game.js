var upPressed = false;
var downPressed = false;
var leftPressed = false;
var rightPressed = false;
var lastPressed = false;
var gameRunning = false; //TRACKS THE STATUS OF GAME

function keyup(event) {
  if (!gameRunning) return; //ONLY RUNS THIS CODE IF THE GAME HAS STARTED
  var player = document.getElementById("player");
  if (event.keyCode == 37) {
    leftPressed = false;
    lastPressed = "left";
  }
  if (event.keyCode == 39) {
    rightPressed = false;
    lastPressed = "right";
  }
  if (event.keyCode == 38) {
    upPressed = false;
    lastPressed = "up";
  }
  if (event.keyCode == 40) {
    downPressed = false;
    lastPressed = "down";
  }
  player.className = "character stand " + lastPressed;
}

function move() {
  if (!gameRunning) return; //ONLY RUNS THIS CODE IF THE GAME HAS STARTED
  var player = document.getElementById("player");
  var positionLeft = player.offsetLeft;
  var positionTop = player.offsetTop;
  if (downPressed) {
    var newTop = positionTop + 3;
    var element = document.elementFromPoint(player.offsetLeft, newTop + 32);
    if (element.classList.contains("sky") == false) {
      player.style.top = newTop + "px";
    }
    if (leftPressed == false) {
      if (rightPressed == false) {
        player.className = "character walk down";
      }
    }
  }
  if (upPressed) {
    var newTop = positionTop - 3;
    var element = document.elementFromPoint(player.offsetLeft, newTop);
    if (element.classList.contains("sky") == false) {
      player.style.top = newTop + "px";
    }
    if (leftPressed == false) {
      if (rightPressed == false) {
        player.className = "character walk up";
      }
    }
  }
  if (leftPressed) {
    var newLeft = positionLeft - 3;
    var element = document.elementFromPoint(newLeft, player.offsetTop);
    if (element.classList.contains("sky") == false) {
      player.style.left = newLeft + "px";
    }
    player.className = "character walk left";
  }
  if (rightPressed) {
    var newLeft = positionLeft + 3;
    var element = document.elementFromPoint(newLeft + 32, player.offsetTop);
    if (element.classList.contains("sky") == false) {
      player.style.left = newLeft + "px";
    }

    player.className = "character walk right";
  }

  //RUN WHEN PLAYER IS COLLIDING WITH CACTUS
  if (collisionWithCactus()) {
    //RESETS PLAYER POSITION
    player.style.left = positionLeft + "px";
    player.style.top = positionTop + "px";
  }
}

function keydown(event) {
  if (!gameRunning) return; //ONLY RUNS THIS CODE IF THE GAME HAS STARTED
  if (event.keyCode == 37) {
    leftPressed = true;
  }
  if (event.keyCode == 39) {
    rightPressed = true;
  }
  if (event.keyCode == 38) {
    upPressed = true;
  }
  if (event.keyCode == 40) {
    downPressed = true;
  }
}

const GAME_WIDTH = window.innerWidth;
const GAME_HEIGHT = window.innerHeight;
let startBtn = document.getElementById("start");
let spaceShip = document.getElementById("alien");
let hpDisplay = document.getElementById("hp-display");
let protag = document.getElementById("player");
let cactus = document.getElementById("tree");
let bgSpace = document.getElementById("bg-space");
let dialogueBox = document.getElementById("game-over");
let scoreBoard = document.getElementById("scoreboard");

let intervalTime = 1000;

function gameStart() {
  gameRunning = true;
  startBtn.style.display = "none";
  spaceShip.style.display = "block";
  hpDisplay.style.display = "block";
  protag.style.display = "block";
  scoreBoard.style.display = "block";
  bgSpace.style.height = "70vh";

  //CALLS THE SCORE HANDELING FUNCTION
  myScore();

  //CALLS THE FUNCTION THAT UPDATES THE INTERVAL TIME OF SPACESHIP AND BOMB EVERY 10s
  setInterval(adjustIntervalTime, 10000);
  
  //CALLS THE FUNCTION THAT RANDOMLY SPAWN THE SPACESHIP
  setInterval(spaceshipSpawn, intervalTime);

  //CALLS THE FUNCTION THAT SHOOTS BOMB EVERY TIME THE SPACESHIP SPAWNS
  setInterval(spaceshipBombing, intervalTime);

  //CALLS THE FUNCTION THAT SPAWNS CACTUS RANDOMLY
  cactusSpawn();
}

let score = 0; //INITIAL SCORE

//DISPLAYS THE SCORE OF THE PLAYER
function myScore() {
  if (!gameRunning) return; //ONLY RUNS THIS CODE IF THE GAME HAS STARTED

  //GETTING THE SCORE ELEMENT
  const scoreE = document.getElementById("scoreCount");

  //INCREASES THE SCORE BY 2 FOR EVERY 0.2s OF PLAYTIME
  function increaseScore() {
    score += 2;
    scoreE.innerText = score;
  }
  points = setInterval(increaseScore, 200);
}

//USES MATH.RANDOM METHOD TO GET RANDOM VALUES FOR POSITION FOR THE SPACESHIP AND RETURNS IT
function getRandomPosition() {
  const maxX = GAME_WIDTH - 120; //THE MAXIMUM WIDTH WHERE THE SPACESHIP CAN SPAWN
  const maxY = GAME_HEIGHT - 600; //TEH MAXIMUM HEIGHT WHERE THE SPACESHIP CAN SPAWN

  const randomX = Math.floor(Math.random() * maxX); //GETS RANDOM HORIZONTAL POSITION
  const randomY = Math.floor(Math.random() * maxY); //GETS RANDOM VERTICAL POSITION

  return { a: randomX, b: randomY };
}

//USES THE RANDOM POSITIONS FROM THE ABOVE FUNCTION TO UPDATE THE POSITION OF SPACESHIP
function spaceshipSpawn() {
  if(!gameRunning) return; //ONLY RUNS THIS CODE IF THE GAME HAS STARTED
  const { a, b } = getRandomPosition();
  spaceShip.style.left = `${a}px`;
  spaceShip.style.top = `${b}px`;
}

function adjustIntervalTime() {
  //REDUCE THE INTERVAL TIME BY 20ms
  if (intervalTime > 600) {
    intervalTime -= 20;
  } else {
    intervalTime == 600;
  }

  //CLEAR THE CURRENT INTERVAL
  clearInterval(intervalTime);

  //START A NEW INTERVAL WITH THE ADJUSTED INTERVAL TIME
  setInterval(spaceshipSpawn, intervalTime);
  setInterval(spaceshipBombing,intervalTime);
}

//MAKES THE SPACESHIP SHOT BOMB TOWARDS THE PLAYER
function spaceshipBombing() {
  if (!gameRunning) return; //ONLY RUNS THIS CODE IF THE GAME HAS STARTED
  let bomb = document.createElement("div");
  bomb.classList.add("bomb");
  bomb.style.left =
    spaceShip.offsetLeft + spaceShip.offsetWidth / 2 - 15 + "px";
  bomb.style.top = spaceShip.offsetTop + spaceShip.offsetHeight + "px";
  bomb.style.display = "block";
  document.body.appendChild(bomb);

  let speed = 6; //INITIAL SPEED OF THE BOMB
  function bombFall() {
    let posTop = parseInt(bomb.style.top) + speed;
    //CHECKS IF THE BOMB HAS REACHED THE BOTTOM OF THE SCREEN OR NOT
    if (posTop >= GAME_HEIGHT - 100) {
      //REMOVES BOMB ONCE IT REACHES THE BOTTOM
      bomb.parentNode.removeChild(bomb);
      //CREATES THE EXPLOSION
      let explosion = document.createElement("div");
      explosion.classList.add("explosion");
      explosion.style.left = bomb.style.left;
      explosion.style.top = GAME_HEIGHT - 100 + "px";
      document.body.appendChild(explosion);
      //REMOVES THE EXPLOSION AFTER SHORT DELAY
      setTimeout(function () {
        explosion.parentNode.removeChild(explosion);
      }, 800);
    } else {
      bomb.style.top = posTop + "px";
    }
  }
  setInterval(bombFall, 20);

  //DETECTS IF THE PLAYER WAS HIT BY THE BOMB OR NOT
  function detectHit() {
    let charPos = protag.getBoundingClientRect();
    let bombPos = bomb.getBoundingClientRect();
  
    if (
      bombPos.left < charPos.left + charPos.width &&
      bombPos.left + bombPos.width > charPos.left &&
      bombPos.top < charPos.top + charPos.height &&
      bombPos.top + bombPos.height > charPos.top
    ) {
      protag.classList.add("hit"); //ADDS THE HIT ACTION
      bomb.classList.add("explosion"); //ADDS THE EXPLOSION ELEMENT
      setTimeout(function () {
        protag.classList.remove("hit"); //REMOVES THE HIT ACTION AFTER 800ms
      }, 800);
      setTimeout(() => bomb.classList.remove("bomb"), 20); //REMOVES THE BOMB AFTER 20ms
      setTimeout(() => bomb.classList.remove("explosion"), 30); //REMOVES THE EXPLOSION AFTER 30ms
      reduceHealth();
    }
  }
  setInterval(detectHit, 10);

  //FUNCTION THAT REDUCED ONE HEALTH POINT FOR EACH HIT
  function reduceHealth() {
    let healthList = document.querySelectorAll(".health li");
    let charHealth = healthList.length; //i.e. 3

    charHealth--;
  
    if (charHealth > 0) {
      healthList[charHealth-1].remove();
    }
  
    if (charHealth == 0) {
      gameOver();
    }
  }
  
  //INCREASES THE SPEED OF BOMB BY 1 EVERY 9s
  function bombSpeedIncrease(){
    if(speed<12){
      speed+=1;
  }
  else{
      speed==12;
  }
  }
  setInterval(bombSpeedIncrease,9000);
}

//MAKES THE CACTUS SPAWN RANDOMLY
function cactusSpawn() {
  cactus.style.display = "block";
  cactus.style.top = GAME_HEIGHT - 150 + "px";

  //UPDATES THE CACTUS POSITION AFTER EVERY 10s
  function updatePosition() {
    const maxX = GAME_WIDTH - (cactus.offsetWidth + 20); //SETS LIMITED SPACE FOR THE CACTUS TO SPAWN ON THE Y-AXIS
    const randomX = Math.floor(Math.random() * maxX); //PROVIDES RANDOM HORIZONTAL POSITION FOR THE CACTUS

    cactus.style.left = randomX + "px";
  }
  tree = setInterval(updatePosition, 10000);
}

//CHECKS COLLISION BETWEEN THE CACTUS AND THE PLAYER
function collisionWithCactus() {
  let playerSq = protag.getBoundingClientRect();
  let cactusSq = cactus.getBoundingClientRect();
  if (
    playerSq.left < cactusSq.right &&
    playerSq.right > cactusSq.left &&
    playerSq.top < cactusSq.bottom &&
    playerSq.bottom > cactusSq.top
  ) {
    //COLLISION BETWEEN PLAYER NAD CACTUS IS DETECTED
    protag.classList.add("hit");
    return true;
  }
  return false;
}
setInterval(collisionWithCactus, 10);

//SET OF COMMANDS THAT RUNS WHEN PLAYER LOSES ALL THEIR LIVES
function gameOver() {
  gameRunning = false;
  dialogueBox.style.display = "block"; //MAKES THE GAME-OVER DIALOG BOX VISIBLE
  const scoreShowElement = document.getElementById("score-show");
  scoreShowElement.innerText = score; //SHOWS THE CURRENT SCORE OF THE PLAYER
  protag.classList.add("dead"); //ADDS THE DEAD ANIMATION OF CHARACTER
  clearInterval(timeout); //MAKES THE CHARACTER IMMOBILE
  clearInterval(points); //STOPS THE SCORE INCREMENT INTERVAL
  clearInterval(tree); //STOPS THE INTERVAL THAT IS RESPONSIBLE FOR RANDOM SPAWNING OF CACTUS
}
function myLoadFunction() {
  timeout = setInterval(move, 10);
  document.addEventListener("keydown", keydown);
  document.addEventListener("keyup", keyup);

  //CALLS THE GAMESTART FUNCTION WHEN THE USER CLICKS THE START BUTTON
  startBtn.addEventListener("click", gameStart);
}

document.addEventListener("DOMContentLoaded", myLoadFunction);
