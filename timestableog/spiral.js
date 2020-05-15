console.log("script");


var canvas = document.getElementById('display'),
context = canvas.getContext('2d');


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

context.fillStyle = "#FFFFFF";
context.fillRect(0, 0, canvas.width, canvas.height);
var can = document.getElementById("display");
var down = document.getElementById("myDownload");
var textElem=document.getElementById('whatprime');
var contact = document.getElementById("contactForm");


var upper = canvas.height/2;
var bot = canvas.height/2;
var left = canvas.width/2;
var right = canvas.width/2;
var num = 100;
var centerX = canvas.width/2;
var centerY = canvas.height/2;
var scale = 9;
var radius = 20;
var lastTheta;




window.onload= function(){
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
	canvas.height = (bot - upper + radius * 4)*2;
	canvas.width = (right - left + radius * 4)*2;

	draw();
}

function draw(){
	context.fillStyle = "#FFFFFF";
	context.scale(2,2);
	context.fillRect(0, 0, canvas.width, canvas.height);
	var primes = new Prime(num);
	var circles = []
	
	context.beginPath()
	context.font = "bold 16px Raleway";
	context.fillStyle = "black";
	context.textAlign = "left";
	context.fillText(("Multiplication Table"), 10, 25);

	var centerX = canvas.width/4;
	var centerY = canvas.height/4;
	context.moveTo(centerX, centerY);

	var STEPS_PER_ROTATION = num;
	var increment = 2*Math.PI/STEPS_PER_ROTATION;       
	var theta = 0;
	var scale = 9;
	var count = 0;


	theta = increment;

	for(var i = 1; i < 11; i++){
		for(var j = 1; j < 11; j++){
			circles.push(new NumberCircle(i*j,radius+radius*3*i,radius+radius*3*j,radius,primes.primeList));
		}
	}
}



download_img = function(el) {
  var image = canvas.toDataURL("image/jpg");
  el.href = image;
};

