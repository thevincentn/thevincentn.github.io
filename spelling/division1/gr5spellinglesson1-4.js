var input = document.getElementById('search-input');
input.focus();
input.select();


var words = ["accustom",  "alert",  "assign",  "budge",  "burly",  "companion",  "compatible",  "concept",  "distract",  "jostle",  "obedient",  "obstacle",  "patient",  "pedestrian",  "retire",  "aroma",  "beverage",  "bland",  "brittle",  "cluster",  "combine",  "consume",  "crave",  "cultivate",  "equivalent",  "export",  "introduce",  "purchase",  "tropical",  "ancestor",  "carnivore",  "comprehend",  "duration",  "evident",  "extinct",  "ferocious",  "gigantic",  "obscure",  "option",  "premature",  "preserve",  "prey",  "puny",  "survive",  "accurate",  "approximate",  "course",  "depart",  "despair",  "destination",  "deteriorate",  "gale",  "horizon",  "jubilation",  "navigate",  "nostalgia",  "revive",  "sever",  "voyage"];
var currentword = words[Math.floor(Math.random() * words.length)];
var correct = false;


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
    $("#search-results").html("incorrect");
    $("#search-results").css("color", "red");
    correct = false;
  }
  else{
    $("#search-results").html(searchFor);
    $("#search-results").css("color", "green");
    currentword = words[Math.floor(Math.random() * words.length)];
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
      speak();
    }
});