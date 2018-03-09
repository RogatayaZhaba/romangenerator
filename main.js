window.onload = function(){
	document.querySelector("#min input").value = 0;
	document.querySelector("#max input").value = 10;
	preloadImages();

	document.querySelector("button").onclick = function(event){
		if(document.querySelector("#min input").value.toLowerCase() == "р" &&
		 document.querySelector("#max input").value.toLowerCase() == "ж"){
		 	EasterEgg();
		 	return;
		}
		let min = +document.querySelector("#min input").value;
		let max = +document.querySelector("#max input").value;
		let element = document.querySelector("#result div");
		let result = getRandomNumber(min, max, false, false);

		setResult(result);
	}

	document.querySelector("#hamburger").onclick = function(event){
		if(menu.isOn)
			hideMenu();
		else
			showMenu();
	}

	document.querySelectorAll(".menu-item").forEach(item => item.onmouseover = showMenuItemDescr);
	document.querySelectorAll(".menu-item").forEach(item => item.onmouseleave = hideMenuItemDescr);
}
const menu = {
	isOn: false,
	animationDuration: 250,
	showItemDelay: 1/4
}
function getRandomNumber(min, max, includeMin, includeMax){
	let minCorrection = 0;
	let maxCorrection = 0;

	if(!includeMin)
		minCorrection = 1;
	if(!includeMax)
		maxCorrection = 1;

	let result = Math.floor(min + minCorrection + Math.random() * (max - min - maxCorrection));
	if(isNaN(result))
		result = "Not a number";
	return result;
}
async function setResult(result){
	let element = document.querySelector("#result div");
	await fadeIn(element);
	element.innerText = result;
	await fadeOut(element);
}
function fadeIn(element){
	return new Promise(function(resolve, reject){
		element.classList.add("transparent");
		let id = setTimeout(() => resolve("faded in"), 250);
	})
}
function fadeOut(element){
	return new Promise(function(resolve, reject){
		element.classList.remove("transparent");
		let id = setTimeout(() => resolve("faded out"), 250);
	})
}
function preloadImages(){
	let images = [];
	for(let i = 0; i < 8; i++){
		images[i] = new Image();
		images[i].src = `background-${i+1}.svg`;
	}
}
function EasterEgg(){
	let quotes = [];
	let logo = [];
	let canvas = document.querySelector("#canvas");
	let frame = 0;

	for(let i = 0; i < 8; i++){
		logo[i] = document.createElement("div");
		logo[i].className = "logo hidden";
		logo[i].style.backgroundImage = `url("background-${i+1}.svg")`;
		canvas.append(logo[i]);
	}
	let timerId = setTimeout(function tick(){
		if(frame > 7){
			document.querySelectorAll(".hidden").forEach(logo => logo.remove());
			document.querySelector("#result div").innerText = quotes[0];
			return;
		}
		if(frame == 0)
			document.querySelector(".logo").classList.add("hidden");
		else
			logo[frame-1].classList.add("hidden");

		logo[frame].classList.remove("hidden");
		frame++;
		timerId = setTimeout(tick, 30);
	}, 30);
	quotes[0] = "Юкі, юкі, юкі!";
}
async function showMenu(){
	let menuItems = [...document.querySelectorAll(".menu-item")];

	menu.isOn = true;
	for(let item of menuItems){
		await showMenuItem(item, menu.animationDuration);
	}
}
async function hideMenu(){
	let menuItems = [...document.querySelectorAll(".menu-item")];

	menu.isOn = false;
	for(let item of menuItems){
		await hideMenuItem(item, menu.animationDuration);
	}
}
function showMenuItem(item, duration){
	return new Promise(function(resolve, reject){
		item.classList.remove("hidden");
		item.classList.remove("off");
		item.classList.add("on");
		let id = setTimeout(()=> resolve("item is on now"), duration * menu.showItemDelay);
	});
}
function hideMenuItem(item, duration){
	return new Promise(function(resolve, reject){
		item.classList.remove("on");
		item.classList.add("off");
		let id = setTimeout(()=> resolve("item is off now"), duration * menu.showItemDelay);
	});
}
function showMenuItemDescr(){
	let description = this.parentNode.querySelector("p");
	description.classList.remove("hidden");
}
function hideMenuItemDescr(){
	let description = this.parentNode.querySelector("p");
	description.classList.add("hidden");
}