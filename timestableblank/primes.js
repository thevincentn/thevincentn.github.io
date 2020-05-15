class Prime {
    constructor(maxNumber){
        console.log("Constructor");
        const isPrime = new Array(maxNumber + 1).fill(true);
        isPrime[0] = false;
        isPrime[1] = false;
        console.log("Sieve called");
        const primes = [];

        for (let number = 2; number <= maxNumber; number += 1) {
	        if (isPrime[number] === true) {
				primes.push(number);

	          /*
	           * Optimisation.
	           * Start marking multiples of `p` from `p * p`, and not from `2 * p`.
	           * The reason why this works is because, at that point, smaller multiples
	           * of `p` will have already been marked `false`.
	           *
	           * Warning: When working with really big numbers, the following line may cause overflow
	           * In that case, it can be changed to:
	           * let nextNumber = 2 * number;
	           */
				let nextNumber = number * number;

	          	while (nextNumber <= maxNumber) {
	            	isPrime[nextNumber] = false;
	            	nextNumber += number;
	          	}
	        }
    	}
        this.primeList = primes;
    }

    isPrime(num){
        return this.primeList.includes(num);
    }

    primeFactor(num){
        var toFactor = num;
        var length = this.primeList.length;
        var index = 0;
        var factoring = true;
        const factors = [];
        while ((toFactor > 1 ) & (this.primeList.includes(toFactor) == false)){
            if (toFactor % this.primeList[index] == 0){
                toFactor = toFactor/this.primeList[index];
                factors.push(this.primeList[index]);
            }
            else{
                index = index + 1;
            }
            if (index == length){
                factors.push(this.primeList[index]);
            }
        }
        factors.push(toFactor);
        return factors;
    }

}

