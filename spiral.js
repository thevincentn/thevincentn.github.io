console.log("script");

var canvas = document.getElementById('display'),
context = canvas.getContext('2d');


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

context.fillStyle = "#4e4d52";
context.fillRect(0, 0, canvas.width, canvas.height);
var can = document.getElementById("display");
var down = document.getElementById("myDownload");
var textElem=document.getElementById('whatprime');
var contact = document.getElementById("contactForm");
can.style.display = "none";
down.style.display = "none";

var upper = canvas.height/2;
var bot = canvas.height/2;
var left = canvas.width/2;
var right = canvas.width/2;
var num = 40;
var centerX = canvas.width/2;
var centerY = canvas.height/2;
var scale = 9;
var radius = 20;
var lastTheta;


function getPrime(){
	
	num = parseInt(textElem.value, 10);
    contact.style.display = "none";
	textElem.style.display = "none";
    can.style.display = "block";
	down.style.display = "block";
	
	preDraw();
}

function preDraw(){
	for(var j = num; j > 0; j--){
	var newX = centerX + scale * Math.sqrt((j-1)*num/6) * Math.cos(Math.sqrt((j-1)*num/6)); 
	var newY = centerY - scale * Math.sqrt((j-1)*num/6) * Math.sin(Math.sqrt((j-1)*num/6)); 
		if(j == 1){
			newY = newY - 10;
		}
		if(newX < left){
			left = newX;
		}
		if(newX > right){
			right = newX;
		}
		if(newY < upper){
			upper = newY;
		}
		if(newY > bot){
			bot = newY;
		}
	}
	lastTheta = Math.sqrt((num-1)*num/6);
	canvas.height = bot - upper + radius * 4;
	canvas.width = right - left + radius * 4;

	draw();
}

function draw(){
	context.fillStyle = "#4e4d52";
	context.fillRect(0, 0, canvas.width, canvas.height);
	var primes = new Prime(num);
	var circles = []

	var centerX = canvas.width/2;
	var centerY = canvas.height/2;
	context.moveTo(centerX, centerY);

	var STEPS_PER_ROTATION = num;
	var increment = 2*Math.PI/STEPS_PER_ROTATION;       
	var theta = 0;
	var scale = 9;
	var count = 0;

	while( theta <= lastTheta) {
	  var newX = centerX + scale * theta * Math.cos(theta); 
	  var newY = centerY - scale * theta * Math.sin(theta); 
	  context.lineTo(newX, newY);
	  theta = theta + increment;
	}
	context.strokeStyle = "white";
	context.lineWidth = 10;
	context.stroke();

	theta = increment;

	for(var j = num; j > 0; j--){
		var newX = centerX + scale * Math.sqrt((j-1)*num/6) * Math.cos(Math.sqrt((j-1)*num/6)); 
		var newY = centerY - scale * Math.sqrt((j-1)*num/6) * Math.sin(Math.sqrt((j-1)*num/6)); 
		if(j == 1){
			newY = newY - 10;
		}
		circles.push(new NumberCircle(j,newX,newY,radius,primes.primeList));
	}
}

download_img = function(el) {
  var image = canvas.toDataURL("image/jpg");
  el.href = image;
};

