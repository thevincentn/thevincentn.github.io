var canvas = document.getElementById('display'),
      context = canvas.getContext('2d');

var input = document.getElementById('search-input');
input.focus();
input.select();


var words = ["abolish","agony","catapult","character","denounce","escalate","grim","harbor","inflict","loathe","meddle","monstrous","rouse","steadfast","translate"];
var definitions = ["v. To bring to an end; to do away with.",
"n. Great pain of mind or body; suffering.",
"n. A machine used in ancient wars that threw objects with great force. \n v. To move or be moved suddenly and with great force, as if by a catapult. ",
"n. 1. The qualities that make a person or place different or special. \n 2.  A person in a story, movie, or play. \n 3. A letter or symbol used in writing or printing. ",
"v. 1. To speak out against something; to criticize. \n 2. To accuse someone of doing wrong.",
"v. To go up or increase in size or scope.",
"adj. 1. Cruel; fierce. \n 2. Unfriendly or threatening; stern. \n 3. Unpleasant; disturbing.",
"n. A protected place along a seacoast where ships can find shelter. \n v. 1. To give shelter to; to take care of by hiding.\n 2. To hold and nourish a thought or feeling in the mind.",
"v. To cause something painful to be felt.",
"v. To hate or dislike greatly. \n n. A feeling of hatred.",
"v. To involve oneself in other people's affairs without being asked.",
"adj. 1. Causing shock; horrible; wicked. \n 2. Extremely large.",
"v. 1. To awaken, to wake up.\n 2. To stir up; to excite.",
"adj. Unchanging; steady; loyal.",
"v. to put into a different language."]
var wordindex = Math.floor(Math.random() * words.length)
var currentword = words[wordindex];
var correct = false;


$("#definitionhere").html(definitions[wordindex]);
console.log(definitions.length)
console.log(words.length)
console.log(currentword)
console.log(definitions[wordindex])

if ('speechSynthesis' in window) {
 // Speech Synthesis supported 🎉
}else{
  // Speech Synthesis Not Supported 😣
  alert("Sorry, your browser doesn't support text to speech!");
}


function search(){
  var searchFor = $("#search-input").val();
  var searchIndex = words.indexOf(searchFor.toLowerCase());
  if(searchIndex == -1){
    $("#definitionhere").html(definitions[currentword]);
    $("#search-results").html("incorrect");
    $("#search-results").css("color", "red");
    correct = false;
  }
  else{
    $("#search-results").html(searchFor);
    $("#search-results").css("color", "green");
    wordindex = Math.floor(Math.random() * words.length)
    currentword = words[wordindex];
    $("#definitionhere").html(definitions[wordindex]);
    correct = true;
  }
}
$("#search-input").on("keyup", search);

function speak(){
    speechSynthesis.speak(new SpeechSynthesisUtterance(currentword));
    if (correct){
        $("#search-results").html("");
        document.getElementById('search-input').value = ''
    }
    
}


document.querySelector('#search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      updategame();
      speak();
    }
});



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


      function updategame() {
        if (currentLevel < 5) {
            

            if (correct == true) {
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
            else if (correct == false) {
              //Left
               currentLives = currentLives - 1;
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
      }

      function drawHealthbar(canvas,x,y,width,height,health){
        console.log("huh");
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