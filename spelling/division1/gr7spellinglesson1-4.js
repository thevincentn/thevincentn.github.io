var input = document.getElementById('search-input');
input.focus();
input.select();


var words = ["Abate","Acknowledge","Agent","Authority","Devastate","Epidemic","Estimate","Evict","Impartial","Industrious","Infuriate","Irrelevant","Precise","Sham","Trek","Astute","Authentic","Delicacy","Derogatory","Devour","Figment","Mythical","Plumage","Predatory","Prior","Scavenge","Slaughter","Solitude","Ungainly","Vulnerable","Admonish","Aghast","Annihilate","Benefactor","Bestow","Devious","Devoid","Heed","Mortal","Muse","Pioneer","Plague","Subside","Unwitting","Wrath","Acquire","Antagonize","Competent","Comprise","Correspond","Dilapidated","Illustrious","Incident","Inherit","Latitude","Loath","Maintain","Renovate","Reprimand","Supervise"];
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