var canvas = document.getElementById('display'),
context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight*0.9;

var centerX = canvas.width/2;
var centerY = canvas.height/2;
var currentSquare = sideLength;
var x = 1;
var maxIteration = 10;
var numSquares = 1;

var xoffset = 0;
var sideLength = Math.min(canvas.width,canvas.height)/(2*maxIteration);


context.beginPath();
context.font = "bold 3.2vmax Raleway";
context.fillStyle = "black";
context.textAlign = "center";
context.fillText(("Hit Spacebar or Touch Screen."), centerX, centerY);

document.addEventListener('keyup', event => {
  if (event.code === 'Space') {
    draw();
  }
})


document.addEventListener('touchstart', function(ev) {
  // Iterate through the touch points that were activated
  // for this element and process each event 'target'
  draw();
}, false);

function enterKey(e){
  if(e.keyCode == 13){
    draw();
  }
}

function clear(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context.beginPath();
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
  x = 1;
  numSquares = 1;
  xoffset = 0;
}
  


function draw(){
  if(x == 1){
    clear();
  }
  
  context.beginPath();
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, sideLength*2);

  context.beginPath();
  context.font = "bold 3.2vmax Raleway";
  context.fillStyle = "black";
  context.textAlign = "center";
  context.fillText(("Figure " + x + ":"), centerX, sideLength);

  context.beginPath();
  context.fillStyle = "white";
  context.fillRect(0, canvas.height - sideLength*2, canvas.width, sideLength*2);

  context.beginPath();
  context.font = "bold 3.2vmax Raleway";
  context.fillStyle = "black";
  context.textAlign = "center";
  context.fillText(("Number of Squares = " + numSquares), centerX, canvas.height - sideLength);


  if (x == 1){
    context.beginPath();
    context.fillStyle = "red";
    context.fillRect(centerX - sideLength/2, centerY - sideLength/2, sideLength, sideLength);
    context.strokeRect(centerX - sideLength/2, centerY - sideLength/2, sideLength, sideLength);
    x++;
    xoffset += sideLength;
    numSquares = numSquares + 4;
  }
  else if (x < maxIteration){
    context.beginPath();
    context.fillStyle = "red";
    context.fillRect(centerX - sideLength/2, centerY - sideLength/2-xoffset, sideLength, sideLength);
    context.strokeRect(centerX - sideLength/2, centerY - sideLength/2-xoffset, sideLength, sideLength);

    context.beginPath();
    context.fillStyle = "red";
    context.fillRect(centerX - sideLength/2 + xoffset, centerY - sideLength/2, sideLength, sideLength);
    context.strokeRect(centerX - sideLength/2 + xoffset, centerY - sideLength/2, sideLength, sideLength);

    context.beginPath();
    context.fillStyle = "red";
    context.fillRect(centerX - sideLength/2, centerY + sideLength/2-sideLength+xoffset, sideLength, sideLength);
    context.strokeRect(centerX - sideLength/2, centerY + sideLength/2-sideLength+xoffset, sideLength, sideLength);

    context.beginPath();
    context.fillStyle = "red";
    context.fillRect(centerX - sideLength/2 - xoffset, centerY - sideLength/2, sideLength, sideLength);
    context.strokeRect(centerX - sideLength/2 - xoffset, centerY - sideLength/2, sideLength, sideLength);
    xoffset += sideLength;
    x++;
    numSquares = numSquares + 4;
  }
  else{
    clear();
  }
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}