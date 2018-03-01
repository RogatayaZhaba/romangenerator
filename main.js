window.onload = function(){
	document.querySelector("#min").value = 0;
	document.querySelector("#max").value = 10;
	document.querySelector("button").onclick = function(event){
		let min = +document.querySelector("#min").value + 1;
		let max = +document.querySelector("#max").value;

		let result = Math.floor(min + Math.random() * (max - min));
		document.querySelector("#result").innerText = result;
	}
}