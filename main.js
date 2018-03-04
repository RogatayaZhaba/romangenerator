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
		
		let result = Math.floor(min + 1 + Math.random() * (max - min - 1));
		if(isNaN(result))
			document.querySelector("#result div").innerText = "Not a number";
		else
			document.querySelector("#result div").innerText = result;
	}
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