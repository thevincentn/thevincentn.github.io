
var input = document.getElementById('search-input');
input.focus();
input.select();


var words = ["pointing","oily","boy","voice","oyster","voyage","loyal","joined","coin","choice","poison","destroy","enjoy","choose","chocolate"];
var currentword = words[Math.floor(Math.random() * words.length)];
var correct = false;
// ,"PXL_20210122_212514127.mp3","PXL_20210122_212507118.mp3","Snapchat-1284439271.mp3"
var sounds = ["PXL_20210208_172838106.mp3","hahakill.mp3"];

document.getElementById("Level").innerHTML = "Spell " + currentword;


if ('speechSynthesis' in window) {
 // Speech Synthesis supported 🎉
}else{
  // Speech Synthesis Not Supported 😣
  alert("Sorry, your browser doesn't support text to speech!");
}

var audio = new Audio(sounds[Math.floor(Math.random() * sounds.length)]);





function react(source){
  if (source == reaction){

    setTimeout(function(){
      document.getElementById("kill").style.display = "table";
      document.getElementById("gamediv").style.display = "none";
      console.log('got here');
      audio = new Audio(sounds[Math.floor(Math.random() * sounds.length)]);
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
