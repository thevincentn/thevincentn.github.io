
var input = document.getElementById('search-input');
input.focus();
input.select();


// var words = ["amaze","energy","amusing","enormous","noticed","analyze","escape","observed", "annoy","estimate","opinion", "arranged","exercise","peeking", "avoid","expect","plan", "cause","famous","poke", "classify","flock","predict", "community","friendly","prefer", "conclusion","frighten","process", "connection","frown","publish", "continue","gasp","records", "cooperation","gather","revise", "curious","gust","separate","cycle","helpful","steaming data","include","shivered", "describe","insist","similar detail","investigate","diagram","label","suppose","difference","leaned","sway", "different","living","stormy", "discover","march","swoop", "drowsy","matter","treasure", "edit","moist","vanish","effect","necessary","volunteer"];
var words = ["now","down","how","out","shout","about","our","house","slow","show"];
var currentword = words[Math.floor(Math.random() * words.length)];
var correct = false;

document.getElementById("Level").innerHTML = "Spell " + currentword;


if ('speechSynthesis' in window) {
 // Speech Synthesis supported 🎉
}else{
  // Speech Synthesis Not Supported 😣
  alert("Sorry, your browser doesn't support text to speech!");
}

var audio = new Audio('hahakill.mp3');





function react(source){
  if (source == reaction){

    setTimeout(function(){
      document.getElementById("kill").style.display = "table";
      document.getElementById("gamediv").style.display = "none";
      console.log('got here');
      audio.play();
    }, 100);

    setTimeout(function(){
      document.getElementById("kill").style.display = "none";
    document.getElementById("gamediv").style.display = "table";
    console.log("source is neutral");
    input.focus();
    input.select();
    }, 2500);
    

  }else if (source == neutral){
    document.getElementById("kill").style.display = "none";
    document.getElementById("gamediv").style.display = "table";
    
  }
}


var reaction = "images/redkillsblue.gif";
var neutral = "images/neutral.png";



function search(){
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
      correct = (document.getElementById('search-input').value == currentword)
      updategame();
    }
});


function updategame() {   
  if (correct == true) {
    currentword = words[Math.floor(Math.random() * words.length)];
    correct = false
    document.getElementById("Level").innerHTML = "Spell " + currentword;
    $("#search-results").html("");
    document.getElementById('search-input').value = '';
    react(reaction);
  }
  else{
    console.log('wrong');
  }

  document.getElementById("Level").innerHTML = "Spell " + currentword;
  // react(reaction);
}
