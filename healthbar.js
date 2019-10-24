var canvas = document.getElementById('display'),
context = canvas.getContext('2d');


var currentHealth = 5;

var maxHealth = 10;

var wi = canvas.width;
var len = canvas.height;

var maxLives = 5;
var currentLives = 5;
var startingLevel = 1;
var currentLevel = 1;
var levelHealth = currentLevel;
var winningLevel = 5;

var currentHealth = levelHealth;
var maxLevelHealth = currentLevel;

// drawHearts(context,5,10,currentLives,maxLives);
drawHealthbar(context,10,10,500,50,currentHealth);

var reaction = 'images/neutral.JPG';
var neutral = 'images/neutral.JPG';
react(neutral);

document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '40') {
    	//Down
        currentHealth = currentHealth - 1;
        randomReaction = Math.floor((Math.random() * 5) + 1);
        if (randomReaction == 1){
            reaction = 'images/damage01.JPG';
        }else if (randomReaction == 2){
            reaction = 'images/damage02.JPG';
        }else if (randomReaction == 3){
            reaction = 'images/damage03.JPG';
        }else if (randomReaction == 4){
            reaction = 'images/damage04.JPG';
        }else{
            reaction = 'images/damage05.JPG';
        }
    }
    else if (e.keyCode == '37') {
    	//Left
       currentLives = currentLives - 1;
       currentHealth = currentLevel;
        randomReaction = Math.floor((Math.random() * 2) + 1);
        if (randomReaction == 1){
            reaction = 'images/victory01.JPG';
        }else{
            reaction = 'images/victory02.JPG';
        }
    }
    updateLives();
    react(reaction);
    setTimeout(function(){
    	react(neutral);
    }, 500);
    drawHealthbar(context,10,10,500,50,currentHealth);
    if (currentLives == 0){
        document.getElementById("Level").innerHTML = "You Lose!";
        reaction = 'images/victory02.JPG';
        neutral = 'images/victory02.JPG';
        react(neutral);
    }
}

function drawHealthbar(canvas,x,y,width,height,health){
	if(health >= maxLevelHealth){health = maxLevelHealth;}
	canvas.fillStyle = '#000000';
	canvas.fillRect(x,y,width,height);
	var colorNumber = Math.round((1-(health/maxLevelHealth))*0xff)*0x10000+Math.round((health/maxLevelHealth)*0xff)*0x100;
	var colorString = colorNumber.toString(16);
	if (colorNumber >= 0x100000){
		canvas.fillStyle = '#'+colorString;
	}else if (colorNumber << 0x100000 && colorNumber >= 0x10000){
		canvas.fillStyle = '#0'+colorString;
	}else if (colorNumber << 0x10000){
		canvas.fillStyle = '#00'+colorString;
	}
	canvas.fillRect(x+1,y+1,(health/maxLevelHealth)*(width-2),height-2);
    if(health <= 0){
        currentLevel = currentLevel + 1;
        if (currentLevel == winningLevel){
            document.getElementById("Level").innerHTML = "You win!";
            reaction = 'images/dead.JPG';
            neutral = 'images/dead.JPG';
            react(reaction);
        }else{
            levelHealth = currentLevel;
            currentHealth = levelHealth;
            maxLevelHealth = currentLevel;
            health = currentLevel;
            document.getElementById("Level").innerHTML = "Level " + currentLevel;
            setTimeout(function(){
                drawHealthbar(canvas,x,y,width,height,health);
            }, 1000);
        }
    }
}


function updateLives(){
	if(currentLives >= maxLives){currentLives = maxLives;}
	if(currentLives <= 0){currentLives = 0;}
	document.getElementById("Lives").innerHTML = currentLives;
}

function react(src){
	var emote = document.getElementById("emote"), emoteContext = emote.getContext('2d');
	base_image = new Image();
  	base_image.src = src;
		base_image.onload = function(){
    		emoteContext.drawImage(base_image, 0, 0);
  		}
}