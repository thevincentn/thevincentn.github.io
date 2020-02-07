var canvas = document.getElementById('display'),
context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var x = 1;
var maxIteration = 10;
var numTriangles = 2;
var xoffset = 0;

var sideLength = Math.min(canvas.width,canvas.height)/(2*maxIteration);

var centerX = canvas.width/2;
var leftMost = canvas.width/2 - maxIteration*sideLength/2;
var centerY = canvas.height/2;  
var botMost = canvas.height/2;

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
  numTriangles = 2;
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
  context.fillText(("Number of Triangles = " + numTriangles), centerX, canvas.height - sideLength);



  if (x == 1){
    context.beginPath();
    context.moveTo(leftMost,botMost);
    context.lineTo(leftMost+sideLength,botMost);
    context.lineTo(leftMost+sideLength/2,botMost-sideLength*Math.sin(Math.PI/3));
    context.lineTo(leftMost,botMost);
    context.fillStyle = "orange";
    context.fill();
    context.strokeStyle = "black";
    context.stroke();

    context.beginPath();
    context.moveTo(leftMost+xoffset+sideLength/2,botMost-sideLength*Math.sin(Math.PI/3));
    context.lineTo(leftMost+xoffset+3*sideLength/2,botMost-sideLength*Math.sin(Math.PI/3));
    context.lineTo(leftMost+xoffset+sideLength,botMost);
    context.fillStyle = "orange";
    context.fill();
    context.strokeStyle = "black";
    context.stroke();

    x++;
    xoffset += sideLength;
    numTriangles = numTriangles + 2;
  }
  else if (x <= maxIteration){
    context.beginPath();
    context.moveTo(leftMost+xoffset,botMost);
    context.lineTo(leftMost+xoffset+sideLength,botMost);
    context.lineTo(leftMost+xoffset+sideLength/2,botMost-sideLength*Math.sin(Math.PI/3));
    context.fillStyle = "orange";
    context.fill();
    context.strokeStyle = "black";
    context.stroke();

    context.beginPath();
    context.moveTo(leftMost+xoffset+sideLength/2,botMost-sideLength*Math.sin(Math.PI/3));
    context.lineTo(leftMost+xoffset+3*sideLength/2,botMost-sideLength*Math.sin(Math.PI/3));
    context.lineTo(leftMost+xoffset+sideLength,botMost);
    context.fillStyle = "orange";
    context.fill();
    context.strokeStyle = "black";
    context.stroke();

    xoffset += sideLength;
    x++;
    numTriangles = numTriangles + 2;
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