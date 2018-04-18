window.onload = function(){
	canvas.onScreen = document.querySelector("#main");
	document.querySelector("#min input").value = 0;
	document.querySelector("#max input").value = 10;
	preloadImages();
	updateSpoilerHeights();
	window.onresize = onResize;

	document.querySelector("button").onclick = function(event){
		showResult();	
	}

	document.querySelector("#hamburger").onclick = function(event){
		if(menu.isOn)
			hideMenu();
		else
			showMenu();
	}

	document.querySelectorAll(".menu-item").forEach(item => item.onmouseover = showMenuItemDescr);
	document.querySelectorAll(".menu-item").forEach(item => item.onmouseleave = hideMenuItemDescr);
	document.querySelectorAll(".spoiler-head").forEach(item => item.addEventListener("click", openSpoiler));
	document.querySelectorAll(".spoiler-head > i").forEach(item => item.addEventListener("click", openSpoiler));
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
function getRandomNumber(min, max, includeMin, includeMax, avoid){
	let minCorrection = 0;
	let maxCorrection = 0;
	let result = avoid || false;

	if(!includeMin)
		minCorrection = 1;
	if(!includeMax)
		maxCorrection = 1;

	do{
		result = Math.floor(min + minCorrection + Math.random() * (max - min - maxCorrection));
		if(isNaN(result))
			result = "Not a number";
	}while(result == avoid)
	return result;
}
function wait(time){
	return new Promise((resolve, reject) => {
		let id = setTimeout(() => resolve(`${time} milliseconds gone`), time);
	});
}
function setResult(unique){
	let min = +document.querySelector("#min input").value;
	let max = +document.querySelector("#max input").value;
	let element = document.querySelector("#result div");
	let result = 0;

	if(unique || unique === 0)
		result = getRandomNumber(min, max, false, false, unique);
	else
		result = getRandomNumber(min, max, false, false);

	console.log(result !== unique);
	element.innerText = result;
	return result;
}
async function showResult(){
	let prevResult = 0;
	let currResult = 0;

	prevResult = document.querySelector("#result div").innerText;
	for(let i = 0; i < 20; i++){
		prevResult = setResult(prevResult);
		await wait(50);
	}
	setResult();
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