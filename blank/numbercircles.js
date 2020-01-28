class NumberCircle{
	constructor(num,cx,cy,radius,primes){
		this.number = num;
		this.x = cx;
		this.y = cy;
		this.primesList = primes;

		context.moveTo(this.x,this.y);
		context.beginPath();
		context.moveTo(this.x,this.y);
		context.arc(this.x,this.y,radius,0,2*Math.PI);
		context.fillStyle = "#FFFFFF";
		context.strokeStyle = "black";
		context.lineWidth = 2;
		context.stroke();
		context.fill(); // or context.fill()

		context.moveTo(this.x,this.y);
		context.beginPath();
		context.arc(this.x,this.y,radius/2,0,2*Math.PI);
		context.strokeStyle = "black";
		context.lineWidth = 1;
		context.stroke();

		context.moveTo(this.x,this.y);
		context.beginPath()
		context.font = "bold 8px Verdana";
		context.fillStyle = "black";
		context.textAlign = "center";
		var text = 
		context.fillText(""+this.number, this.x, this.y + 3);

	}
}