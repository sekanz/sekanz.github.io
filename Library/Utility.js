
let nextEntityId = 0;
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
const monthsOfYear = ["January","February","March","April","May","June","July","August","September","October","November","December"];

class BetterDate{
	constructor(date){
		this.date = date;
	}
	dateStamp(){
		let month = PrefixChars(this.date.getMonth() + 1, "0", 2);
		let day = PrefixChars(this.date.getDate(), "0", 2);
		return `${this.date.getFullYear()}${month}${day}`;
	}
	shortDate(){
		let month = PrefixChars(this.date.getMonth() + 1, "0", 2);
		let day = PrefixChars(this.date.getDate(), "0", 2);
		return `${month}/${day}/${this.date.getFullYear()}`;
	}
	getDaysFromDate(days){
		let d = new Date(this.date);
		d.setDate(this.date.getDate() + days);
		return d;
	}
	countDaysToDate(date){
		const diffInMs   = date - this.date;
		return diffInMs / (1000 * 60 * 60 * 24);
	}
}

function isString(variable) {
  return typeof variable === "string";
}

function TimeStampToShortDate(stamp){
	const year = stamp.substr(0,4);
	const month = stamp.substr(4,2);
	const day = stamp.substr(6,2);
	return `${month}/${day}`;
}

function TimeStampToFormattedDate(stamp){
	const year = stamp.substr(0,4);
	const month = stamp.substr(4,2);
	const day = stamp.substr(6,2);
	return `${month}/${day}/${year}`;
}

function GetRandomLetter(){
	let i = Math.floor(Math.random() * 999999 % 26 + 97);
	return String.fromCharCode(i);
}

function GetRandomVowel(){
	return vowels[Math.floor(Math.random() * 999999 % vowels.length)];
}

function GetRandomColor(){
	return `#${GetRandBetween(10,99)}${GetRandBetween(10,99)}${GetRandBetween(10,99)}`;
}

function PrefixChars(value, char, length){
	let val = value;
	while(val.toString().length < length){
		val = char + val;
	}
	return val;
}

function GetRandomName(){
	let name = GetRandomLetter().toUpperCase();
	for(var i = 0; i < 5; i++){
		name += GetRandomVowel();
		name += GetRandomLetter();
	}
	let length = Math.floor(Math.random() * 999999 % 3 + 4);
	return name.substr(0,length);
}

function utilityGetHash(length){
	let hash = "";
	for(let i = 0; i < length; i++){
		if(GetRandBetween(0,100) < 60){
			hash += GetRandBetween(0,10);
		}else{
			hash += GetRandomLetter();
		}
	}
	return hash;
}

function GetRandBetween(l, h){
	return Math.floor(Math.random() * 999999 % (h - l) + l);
}

function GetPseudoRandBetween(l, h){
	return Math.floor(getPseudoRandomNumber() * 999999 % (h - l) + l);
}

function GetRandomTrueFalse(){
	return Math.floor(Math.random() * 999 % 10) < 5;
}

// Takes a chance of 0.0 to 1.0;
function TemptFate(chance){
	return GetRandBetween(0,10000) / 10000 < chance;
}

function TemptPseudoFate(chance){
	return GetPseudoRandBetween(0,10000) / 10000 < chance;
}

function GetRandArrayIndexUsingFunc(arr, func){
	let possibleIndexes = [];
	for(let i = 0; i < arr.length; i++){
		if(func(arr[i])){
			possibleIndexes.push(i);
		}
	}
	if(possibleIndexes.length == 0){
		return -1;
	}
	return possibleIndexes[GetRandBetween(0,possibleIndexes.length)];
}

function RemoveFromArrayById(arr, id){
	let l;
	for(let i = 0; i < arr.length; i++){
		if(arr[i].id == id){
			l = arr[i];
			arr.splice(i,1);
			return l;
		}
	}
	throw `Didn't find id: ${id}`;
}


let pseudoSeed = 113;
function getPseudoRandomNumber(){
	while(pseudoSeed < 100000){
		pseudoSeed = Math.floor(Math.pow(pseudoSeed, 1.5));
	}

	let txt = pseudoSeed.toString();
	let newNum = "";
	for(let i = txt.length - 1; i >= 0; i-=2){
		newNum += txt[i];
	}

	pseudoSeed = parseInt(newNum);
	return pseudoSeed * .001;
}

function bitsToDecimal(bitArray) {
	let decimal = 0;
	for (let i = 0; i < bitArray.length; i++) {
	  if (bitArray[i] === 1) {
		decimal += Math.pow(2, bitArray.length - 1 - i);
	  }
	}
	return decimal;
}

function GetRandomIntArray(startInt, count){
	let arr = [];
	for(let i = 0; i < count; i++){
		arr.push(i + startInt);
	}
	return arr;
}

// modifies the given array.  no need to return;
function ShuffleArray(arr, shuffles){
	for(let i = 0; i < (shuffles != undefined ? shuffles : arr.length * 2); i++){
		let a = GetRandBetween(0, arr.length - 1);
		let b = GetRandBetween(0, arr.length - 1);
		let temp = arr[a];
		arr[a] = arr[b];
		arr[b] = temp;
	}
}

function drawHexAtCoords(ctx, offset){
	let hexLength = 100;

	ctx.strokeStyle = "red";
	ctx.beginPath();

	for(let i = 0; i < Math.PI * 2; i+=Math.PI / 3){
		let coords = getCircleCoordsForRadians(i);
		if(i == 0){
			ctx.moveTo(coords.x * hexLength + offset.x, coords.y * hexLength + offset.y);
		}else{
			ctx.lineTo(coords.x * hexLength + offset.x, coords.y * hexLength + offset.y);
		}
	}

	ctx.stroke(); // Render the path
}

// what does this do?
function getCircleCoordsForRadians(radians){
	return {x: Math.cos(radians), y: Math.sin(radians)};
}

// not tested yet
// give canvas, returns context;
function configureCanvas(canvas, canvasWidth, canvasHeight){
	const scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
	canvas.style.width = `${canvasWidth}px`;
	canvas.style.height = `${canvasHeight}px`;
	canvas.width = Math.floor(canvasWidth * scale);
	canvas.height = Math.floor(canvasHeight * scale);
	
	ctx = canvas.getContext("2d");
	
	// Normalize coordinate system to use CSS pixels.
	ctx.scale(scale, scale);
	return ctx;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getVectorFromAngle(angle){
		 return {x: Math.cos(angle * Math.PI / 180), 
			y: Math.sin(angle * Math.PI / 180)};
	}

// rotates a 2d point the given degrees around 0,0
function rotate2D(x, y, degrees){
	let rads = degrees * Math.PI / 180;
	let left = { top: Math.cos(rads), bottom: Math.sin(rads)};
	let right = { top: -Math.sin(rads), bottom: Math.cos(rads)};

	left.top *= x;
	left.bottom *= x;
	right.top *= y;
	right.bottom *= y;

	return { x: left.top + right.top, y: left.bottom + right.bottom };
}

function getCirclePointsAroundCoord(initialAngle, radius, coord, numPoints){
	let points = [];
	for(let i = initialAngle; i < 360 + initialAngle; i += 360 / numPoints){
		points.push(
			{x: radius * Math.cos(i * Math.PI / 180) + coord.x, y: radius * Math.sin(i * Math.PI / 180) + coord.y}
		);
	}
	return points;
}

function getDistance(coordA, coordB){
	return Math.sqrt(Math.pow(coordA.x - coordB.x, 2) + Math.pow(coordA.y - coordB.y, 2));
}

function getAngleFromCoords(from, to){
	return Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI;
}

function normalizeVector(x, y){
	let magnitude = vectorMagnitude(x,y);
	return {x: x / magnitude, y: y / magnitude};
}

function vectorMagnitude(x, y){
	return Math.sqrt((Math.pow(x, 2) + Math.pow(y, 2)));
}

function createLogisticFunctionStepArray(start, stop, steps, steepness = 6){
	let increment = 1 / ((steps-1) / 2);
	let arr = [];
	let finalRange = stop - start;
	let first = 1 / (1 + Math.exp(-steepness * -1));
	let last = 1 / (1 + Math.exp(-steepness * 1));
	let range = last - first;
	
	for(let x = -1; x <= 1; x += increment){
		let y = 1 / (1 + Math.exp(-steepness * x)) - first;
		let perc = y / range;
		arr.push(perc * finalRange + start);
	}

	return arr;
}

function createHtmlElement(type, parentDiv, classArray, content, onClickFunc){
	let element = document.createElement(type);
	if(parentDiv != null && parentDiv != undefined)
		parentDiv.appendChild(element);
	classArray.forEach(e => {
		element.classList.add(e);});
	element.innerHTML = content;
	element.onclick = onClickFunc;
	return element;
}