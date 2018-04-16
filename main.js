window.onload = function(){
	canvas.onScreen = document.querySelector("#main");
	document.querySelector("#min input").value = 0;
	document.querySelector("#max input").value = 10;
	preloadImages();
	updateSpoilerHeights();
	window.onresize = onResize;

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

	/*document.querySelector("#hamburger").onclick = function(event){
		if(menu.isOn)
			hideMenu();
		else
			showMenu();
	}*/

	document.querySelectorAll(".menu-item").forEach(item => item.onmouseover = showMenuItemDescr);
	document.querySelectorAll(".menu-item").forEach(item => item.onmouseleave = hideMenuItemDescr);
	document.querySelectorAll(".spoiler-head").forEach(item => item.addEventListener("click", openSpoiler));
	document.querySelector("#home").addEventListener("click", function(){
		show(document.querySelector("#main"), 200)
	});
	document.querySelector("#faq").addEventListener("click", function(){
		show(document.querySelector("#faq-container"), 200);
	});
}
const canvas = {
	onScreen: null,
	isOkToMove: true
}
const menu = {
	isOn: false,
	animationDuration: 250,
	showItemDelay: 1/4
}
const egg = {
	hasFired: false
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
async function show(item, duration){
	function slideIn(item, duration){
		return new Promise(function(resolve, reject){
			item.classList.remove("move-out");
			item.classList.add("move-in");
			item.classList.remove("remove-to-left");
			let id = setTimeout(()=> resolve("item is on now"), duration);
		});
	}
	function slideOut(item, duration){
		return new Promise(function(resolve, reject){
			item.classList.remove("move-in");
			item.classList.add("move-out");
			item.classList.add("remove-to-right");
			let id = setTimeout(()=> resolve("item is off now"), duration);
		});
	}
	function resetPosition(item){
		item.classList.remove("move-out");
		item.classList.add("remove-to-left");
		item.classList.remove("remove-to-right");
	}

	if(item == canvas.onScreen || !canvas.isOkToMove)
		return;

	canvas.isOkToMove = false;

	await Promise.all([slideIn(item, duration), slideOut(canvas.onScreen, duration)]);
	resetPosition(canvas.onScreen);

	canvas.onScreen = item;
	canvas.isOkToMove = true;
}
async function openSpoiler(){
	function animateSpoilerBody(node, duration){
		return new Promise(function(resolve, reject){
			node.classList.remove("closed");
			let id = setTimeout(()=> resolve("spoiler is open now"), duration);
		})
	}

	let duration = 200;
	let spoilerBody = this.parentNode.querySelector(".spoiler-body");
	let icon = this.querySelector("i");

	icon.classList.remove("closed");
	icon.classList.add("open");
	await animateSpoilerBody(spoilerBody, duration);
	spoilerBody.classList.remove("hidden");

	this.removeEventListener("click", openSpoiler);
	this.addEventListener("click", closeSpoiler);
}
async function closeSpoiler(){
	function animateSpoilerBody(node, duration){
		return new Promise(function(resolve, reject){
			node.classList.add("closed");
			let id = setTimeout(()=> resolve("spoiler is collapsed now"), duration);
		})
	}

	let duration = 200;
	let spoilerBody = this.parentNode.querySelector(".spoiler-body");
	let icon = this.querySelector("i");

	icon.classList.remove("open");
	icon.classList.add("closed");
	spoilerBody.classList.add("hidden");
	await animateSpoilerBody(spoilerBody, duration);

	this.removeEventListener("click", closeSpoiler);
	this.addEventListener("click", openSpoiler);
}
function setCssHeight(item){
	let height = item.offsetHeight;
	item.style.setProperty("--height", `${height}px`);
}
function onResize(){
	updateSpoilerHeights();
}
function updateSpoilerHeights(){
	document.querySelectorAll(".spoiler-body").forEach(item => setCssHeight(item));
}