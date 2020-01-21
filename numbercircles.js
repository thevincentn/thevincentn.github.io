class NumberCircle{
	constructor(num,cx,cy,radius,primes){
		this.number = num;
		this.x = cx;
		this.y = cy;
		this.primesList = primes;

		var toFactor = this.number;
        var lengthF = this.primesList.length;
        var index = 0;
        var factoring = true;
        const factors = [];
        while ((toFactor > 1 ) & (primes.includes(toFactor) == false)){
            if (toFactor % primes[index] == 0){
                toFactor = toFactor/primes[index];
                factors.push(primes[index]);
            }
            else{
                index = index + 1;
            }
            if (index == lengthF){
                factors.push(primes[index]);
            }
        }
        factors.push(toFactor);
        this.factors =  factors;
        this.length = this.factors.length;

        var current = 3 * Math.PI / 2;
		var shift = 2*Math.PI / (this.length);
		var next = current + shift;
		if(this.length>1){
			for(var i = 0; i < this.length; i++){
				context.beginPath();
				context.moveTo(this.x,this.y);
				context.arc(this.x,this.y,radius,current,next);
				context.lineTo(this.x,this.y);
				if(factors[i] == 1){
					context.fillStyle = "grey";
				}
				else if(factors[i] == 2){
					context.fillStyle = "orange";
				}
				else if(factors[i] == 3){
					context.fillStyle = "green";
				}
				else if(factors[i] == 5){
					context.fillStyle = "blue";
				}
				else if(factors[i] == 7){
					context.fillStyle = "purple";
				}
				else{
					context.fillStyle = "red";
				}
				context.fill(); // or context.fill()
				context.strokeStyle = "white";
				context.lineWidth = 2;
				context.stroke();

				let conditionsArray = [1,2,3,5,7];
				if(conditionsArray.indexOf(factors[i]) == -1){
					context.beginPath()
					context.font = "bold 6px Verdana";
					context.fillStyle = "white";
					context.textAlign = "center";
					var text = context.fillText(""+factors[i], this.x + (3*radius/4) * Math.cos(((current+next)/2) - Math.PI/36), this.y + (3*radius/4) * Math.sin(((current+next)/2) - Math.PI/36));
				}
				current = next;
				next = (next + shift);
			}
		}
		else{
			context.beginPath();
			context.moveTo(this.x,this.y);
			context.arc(this.x,this.y,radius,0,2*Math.PI);
			context.lineTo(this.x,this.y);
			if(factors[0] == 1){
				context.fillStyle = "grey";
			}
			else if(factors[0] == 2){
				context.fillStyle = "orange";
			}
			else if(factors[0] == 3){
				context.fillStyle = "green";
			}
			else if(factors[0] == 5){
				context.fillStyle = "blue";
			}
			else if(factors[0] == 7){
				context.fillStyle = "purple";
			}
			else{
				context.fillStyle = "red";
			}
			
			context.strokeStyle = "white";
			context.lineWidth = 2;
			context.stroke();
			context.fill(); // or context.fill()
		}

		context.beginPath();
		context.moveTo(this.x,this.y);
		context.arc(this.x,this.y,radius/2,0,2*Math.PI);
		context.fillStyle = "white";
		context.fill(); // or context.fill()

		context.beginPath()
		context.font = "bold 8px Verdana";
		context.fillStyle = "black";
		context.textAlign = "center";
		var text = 
		context.fillText(""+this.number, this.x, this.y + 3);

	}
}