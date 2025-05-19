function updateClock() {
	const now = new Date();
	let hours = now.getHours();
	let minutes = now.getMinutes();
	let seconds = now.getSeconds();
	const day = now.getDay();

	// Saat ve dakika 10'dan küçükse önlerine 0 ekle
	hours = hours < 10 ? "0" + hours : hours;
	minutes = minutes < 10 ? "0" + minutes : minutes;
	seconds = seconds < 10 ? "0" + seconds : seconds;

	

	const clockDisplay = ` ${hours}:${minutes}:${seconds}`;

	
	document.querySelector(".time").innerText = clockDisplay;
}


setInterval(updateClock, 1000);

// Sayfa yüklendiğinde ilk güncellemeyi yap
updateClock();