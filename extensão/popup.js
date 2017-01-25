var open = document.querySelector("#open")
var close = document.querySelector("#close")

open.addEventListener('click', () =>{	
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function (tabs) {
			chrome.tabs.sendMessage(
			tabs[0].id,
			{from: 'popup', subject: 'open'})
		})				
	})

close.addEventListener('click', () =>{
 	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function (tabs) {
			chrome.tabs.sendMessage(
			tabs[0].id,
			{from: 'popup', subject: 'close'})
		})
 })
