var canvas = document.getElementById('myCanvas'),
ctx = canvas.getContext('2d');


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const angles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];

var centerX = canvas.width/2;
var centerY = canvas.height/2;

var mindim = Math.min(canvas.width, canvas.height)

var radius = 0.3*mindim;

var standardangle = 0;
var referenceangle = 0;
var theta = 0;

var xcord = centerX;
var ycord = centerY;

write_info(ctx, referenceangle, standardangle);
for(i=0; i<angles.length; i++) {
    draw_ray(ctx, centerX, centerY, radius, angles[i]);
}

ctx.strokeStyle = "#000000";
create_axis(ctx,centerX,centerY,mindim);

ctx.beginPath();
ctx.lineWidth = 10;
ctx.arc(centerX,centerY,radius,0,2 * Math.PI);

ctx.stroke();

for(i=0; i<angles.length; i++) {
    draw_indicator(ctx, centerX, centerY, radius, angles[i], 'white');
}

function draw(e){
	var pos = getMousePos(canvas, e);
    posx = pos.x;
    posy = pos.y;

    xcord = posx - centerX;
    ycord = centerY - posy;
    theta = (Math.atan2(ycord,xcord) * 360 / (2*Math.PI) + 360 ) % 360;

    standardangle = angles.reduce(function(prev, curr) {return (Math.abs(curr - theta) < Math.abs(prev - theta) ? curr : prev);});
    referenceangle = getReferenceAngle(standardangle);


	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	write_info(ctx, referenceangle, standardangle);
	for(i=0; i<angles.length; i++) {
	    draw_ray(ctx, centerX, centerY, radius, angles[i]);
	}

	ctx.strokeStyle = "#000000";
	create_axis(ctx,centerX,centerY,mindim);

	ctx.beginPath();
	ctx.lineWidth = 10;
	ctx.arc(centerX,centerY,radius,0,2 * Math.PI);

	ctx.stroke();

	for(i=0; i<angles.length; i++) {
	    draw_indicator(ctx, centerX, centerY, radius, angles[i], 'white');
	}

	

	draw_arc(ctx, centerX, centerY, radius/4, standardangle, 'blue');
	draw_triangle(ctx, centerX, centerY, radius, standardangle);
	draw_indicator(ctx, centerX, centerY, radius, standardangle, 'red');
}

window.addEventListener('mousemove', draw, false);

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

function getReferenceAngle(theta){
	if(theta >= 0 & theta < 90){
		return theta;
	}else if(theta >= 90 & theta < 180){
		return 180 - theta;
	}else if(theta >= 180 & theta < 270){
		return theta - 180;
	}else{
		return 360 - theta;
	}
}

function create_axis(ctx, centerX, centerY, mindim){
	ctx.beginPath();
	ctx.lineWidth = 5;
	canvas_arrow(ctx, centerX, centerY, centerX + 0.4*mindim, centerY);
	canvas_arrow(ctx, centerX, centerY, centerX, centerY - 0.4*mindim);
	canvas_arrow(ctx, centerX, centerY, centerX -  0.4*mindim, centerY);
	canvas_arrow(ctx, centerX, centerY, centerX, centerY + 0.4*mindim);
	ctx.stroke();

	ctx.font = "16px Arial";
	ctx.fillStyle = 'black';
	ctx.fillText("A - Q1", centerX + 0.3*mindim, centerY - 0.3*mindim);
	ctx.fillText("S - Q2", centerX - 0.3*mindim, centerY - 0.3*mindim);
	ctx.fillText("T - Q3", centerX - 0.3*mindim, centerY + 0.3*mindim);
	ctx.fillText("C - Q4", centerX + 0.3*mindim, centerY + 0.3*mindim);

}

function canvas_arrow(context, fromx, fromy, tox, toy) {
  var headlen = 10; // length of head in pixels
  var dx = tox - fromx;
  var dy = toy - fromy;
  var angle = Math.atan2(dy, dx);
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  context.lineCap = 'round'
  context.moveTo(tox, toy);
  context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
  context.lineCap = 'round'
  context.moveTo(tox, toy);
  context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
  context.lineCap = 'round'
}

function draw_indicator(context, centerX, centerY, radius, angle, col){
	context.beginPath();
	context.lineWidth = 3;
	context.arc(centerX + radius*Math.cos(angle * 2 * Math.PI/360),centerY - radius*Math.sin(angle * 2* Math.PI/360),10,0,2 * Math.PI);
	context.stroke();
	context.fillStyle = col;
	context.fill();
}

function draw_ray(context, centerX, centerY, radius, angle){
	context.beginPath();
	context.moveTo(centerX,centerY);
	context.lineTo(centerX + radius*Math.cos(angle * 2 * Math.PI/360),centerY - radius*Math.sin(angle * 2* Math.PI/360));
	context.strokeStyle = "#aaaaaa";
	context.stroke();
}

function write_info(ctx, ref, stan){
	loadImage("images/"+stan+".png", ctx,10,10);
	ctx.font = "20px Arial";
	ctx. fillStyle = 'black';
	ctx.fillText("Move your mouse/finger around!", 10, 20);
	ctx.font = "16px Arial";
	ctx. fillStyle = 'blue';
	ctx.fillText("Angle in Standard Position: " + stan + " degrees.", 10, canvas.height - 45);
	ctx. fillStyle = 'red';
	ctx.fillText("Reference Angle: " + ref  + " degrees.", 10, canvas.height - 70);
	ctx. fillStyle = "#000000";
	if(ref == 0 || ref == 90){
		ctx.fillText("Not a special triangle, the terminal arm is on an axis.", 10, canvas.height - 95);
	}else if(ref == 30 || ref == 60){
		ctx.fillText("1-2-root 3 Triangle", 10, canvas.height - 95);
	}else{
		ctx.fillText("1-1-root 2 Triangle", 10, canvas.height - 95);
	}
	
}


var loadImage = function (url, ctx,x,y) {
  var img = new Image();
  img.src = url
  img.onload = function () { 
    ctx.drawImage(img, x, y);
  }
}

function draw_triangle(ctx, centerX, centerY, radius, theta){
	var start, ang;
	if(theta >= 0 & theta <= 90){
		ctx.beginPath();
		ctx.lineWidth = 5;
		ctx.arc(centerX,centerY,radius/5,0,-theta * Math.PI/180, true);
		ctx.strokeStyle = 'red';
		ctx.stroke();
	}else if(theta > 90 & theta < 180){
		ctx.beginPath();
		ctx.lineWidth = 5;
		ctx.arc(centerX,centerY,radius/5,Math.PI, -theta * Math.PI/180,false);
		ctx.strokeStyle = 'red';
		ctx.stroke();
	}else if(theta >= 180 & theta <= 270){
		ctx.beginPath();
		ctx.lineWidth = 5;
		ctx.arc(centerX,centerY,radius/5,-Math.PI,-theta * Math.PI/180,true);
		ctx.strokeStyle = 'red';
		ctx.stroke();
	}else{
		ctx.beginPath();
		ctx.lineWidth = 5;
		ctx.arc(centerX,centerY,radius/5,-theta * Math.PI/180, 0,true);
		ctx.strokeStyle = 'red';
		ctx.stroke();
	}

	

	ctx.beginPath();
	ctx.lineWidth = 3;
	ctx.moveTo(centerX,centerY);
	ctx.lineTo(centerX + radius * Math.cos(theta * 2 * Math.PI/360), centerY - radius * Math.sin(theta * 2 * Math.PI / 360));
	ctx.lineTo(centerX + radius * Math.cos(theta * 2 * Math.PI/360), centerY);
	ctx.lineTo(centerX,centerY);
	ctx.strokeStyle = "#000000";
	ctx.stroke();
}

function draw_arc(ctx, centerX, centerY, radius, theta, col){
	ctx.beginPath();
	ctx.lineWidth = 5;
	ctx.arc(centerX,centerY,radius,0,-theta * Math.PI/180, true);
	ctx.strokeStyle = col;
	ctx.stroke();
}

function loadImage(url) {
  return new Promise(r => { let i = new Image(); i.onload = (() => r(i)); i.src = url; });
}
