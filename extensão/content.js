let amount,stopLoss,target,profit,earn;
let downButton = document.querySelector('#purchase_button_bottom')
let state ='won'
let interval = 0
let lastClick ='close';
let body;
let running = false;
let times = []

chrome.runtime.onMessage.addListener(function (msg, sender, response) {
	body = document.querySelector('body')
	if ((msg.from === 'popup') && (msg.subject === 'open')) {
		if(lastClick  != 'open'){		
			adjust()
			var div = document.createElement('div')
			div.style = 'height: 120px; width: 100vw; background-color:rgba(62, 57, 57, 0.98); z-index: 3; position: fixed; bottom:0px;display:flex;flex-direction:column;align-items:center;justify-content: center;transition: all .4s ease'
			div.id = 'extensionContainer'
			var minimizeButton = document.createElement('div')	
			minimizeButton.style = 'height:5px;width:22px;background-color:white;align-self:flex-end;margin-top:5px;margin-right:22px;cursor:pointer'
			minimizeButton.addEventListener('click',minimize)
			div.appendChild(minimizeButton)
			var div2 = document.createElement('div')
			div2.style = 'margin-bottom:5px;height: 90%; width:50%; border:1px solid white;display:flex;flex-direction:column;justify-content:center;align-items:center;'
			div.appendChild(div2)
			var div3 = document.createElement('div')
			div3.style = 'height:50%;width:100%;display:flex;flex-direction:row;justify-content:center;align-items:center'
			var inputStyle = 'outline:none;margin:5px;text-align:center;border:1px solid white;width:20%; height:20px;background-color:transparent;color:white;margin-top:5px'
			var aStyle = 'font-family: Verdana,sans-serif;padding: 6px 16px;font-size:14px;text-decoration:none;border:1px solid white;margin:5px;cursor:default;background-color:transparent;color:white;transition:all .2s'
			var inputStop = document.createElement('input')
			inputStop.placeholder = 'stop'
			inputStop.id = 'inputStop';
			inputStop.style = inputStyle
			div3.appendChild(inputStop)
			var inputAmount = document.createElement('input')
			inputAmount.placeholder = 'amount'
			inputAmount.id = 'inputAmount';
			inputAmount.style = inputStyle
			div3.appendChild(inputAmount)
			var inputTarget = document.createElement('input')
			inputTarget.placeholder = 'target'
			inputTarget.id = 'inputTarget';
			inputTarget.style = inputStyle
			div3.appendChild(inputTarget)
			div2.appendChild(div3)
			var div4 = document.createElement('div')
			div4.style = 'height:50%;width:100%;display:flex;flex-direction:row;justify-content:center;align-items:center'
			var span1 = document.createElement('span')
			span1.id = 'spanTitle'
			span1.style = 'color:white;margin:5px'
			span1.innerText = 'Earnings:'
			var span2 = document.createElement('span')
			span2.id = 'spanEarn'
			span2.style = 'color:white;margin:5px'
			span2.innerText = '0'
			var infoButton = document.createElement('div')
			infoButton.id = 'infoButton'
			infoButton.style = aStyle
			infoButton.style.border = 'none'
			infoButton.style.textDecoration = 'underline'
			infoButton.style.textDecorationColor = 'white'			
			infoButton.style.cursor = 'pointer'			
			infoButton.innerText = 'info'
			infoButton.addEventListener('click',infos)
			div4.appendChild(infoButton)
			div4.appendChild(span1)
			div4.appendChild(span2)
			div2.appendChild(div4)
			var startButton = document.createElement('a')
			startButton.style = aStyle
			startButton.innerText = 'start'
			startButton.id = 'startButton'
			var stopButton = document.createElement('a')
			stopButton.style = aStyle
			stopButton.innerText = 'stop'
			stopButton.id = 'stopButton'
			var div5 = document.createElement('div')
			div5.style = 'height:50%;width:100%;display:flex;flex-direction:row;justify-content:center;align-items:center'
			div5.appendChild(startButton)
			div5.appendChild(stopButton)
			div2.appendChild(div5)
			var page = document.querySelector("#page-wrapper")
			body.insertBefore(div,body.firstChild)		
			startButton.addEventListener('click',start)
			stopButton.addEventListener('click',stop)
			startButton.addEventListener('mouseover',mouseOverStart)
			startButton.addEventListener('mouseout',mouseOutStart)
			stopButton.addEventListener('mouseover',mouseOverStop)
			stopButton.addEventListener('mouseout',mouseOutStop)
			maximizeButton()
			document.querySelector('style').innerHTML += '#inputAmount::selection{background:#fff}'
			document.querySelector('style').innerHTML += '#inputStop::selection{background:#fff}'
			document.querySelector('style').innerHTML += '#inputTarget::selection{background:#fff}'
			lastClick = 'open'
		}
	}else if((msg.from === 'popup') && (msg.subject === 'close')){
		if(lastClick  != 'close'){
			times.forEach((time) =>{
				clearTimeout(time)
			})
			var startButton = document.querySelector('#startButton')
			var stopButton = document.querySelector('#stopButton')
			startButton.removeEventListener('click',start)
			stopButton.removeEventListener('click',stop)
			for (var i = 0; i < 2; i++) {
				if(body.childNodes[0].id == 'maximizeButton' || body.childNodes[0].id == 'extensionContainer'){
					body.removeChild(body.childNodes[0])
				}
			}
			lastClick = 'close'
		}
	}
})

function mouseOverStart(){		
	if(running == false){
	document.querySelector('#startButton').style.backgroundColor = 'white'
	document.querySelector('#startButton').style.color = 'rgba(62, 57, 57, 0.98)'
	}
}

function mouseOverStop(){
	document.querySelector('#stopButton').style.backgroundColor = 'white'
	document.querySelector('#stopButton').style.color = 'rgba(62, 57, 57, 0.98)'	
}

function mouseOutStart(){	
	document.querySelector('#startButton').style.backgroundColor = 'transparent'
	document.querySelector('#startButton').style.color = 'white'
}

function mouseOutStop(){
	document.querySelector('#stopButton').style.backgroundColor = 'transparent'
	document.querySelector('#stopButton').style.color = 'white'
}

function minimize(){
	document.querySelector("#extensionContainer").style.bottom = '-120px'
	document.querySelector("#maximizeButton").style.right = '10px'
}

function maximize(){
	document.querySelector("#maximizeButton").style.right = '-50px'
	document.querySelector("#extensionContainer").style.bottom = '0px'
}

function maximizeButton(){
	var div = document.createElement('div')
	div.id = 'maximizeButton'
	div.innerText ='^'
	div.style = 'transition:all .4s ease;cursor:pointer;z-index:3;display:flex;flex-direction:row;align-items:center;justify-content:center;height:50px;width:50px;border-radius:25px;background-color:rgba(62, 57, 57, 0.98);font-family:Verdana,sans-serif;font-size:18px;color:white;position:fixed;bottom:10px;right:-50px'
	div.addEventListener('click',maximize)
	document.body.insertBefore(div,document.body.firstChild)
}

function start(){
		amount = document.querySelector('#inputAmount').value;
		if(running == false &&  amount != '' &&  amount != null){
		mouseOutStart()
		disableElements()
		running = true;
		document.querySelector('#amount').value = amount;
		target = parseFloat(document.querySelector('#inputTarget').value)
		interval = setInterval(() =>{			
			document.querySelector('#amount').dispatchEvent(new Event('input'))
			times.push(setTimeout(() =>{		
				downButton = document.querySelector('#purchase_button_bottom')
				downButton.dispatchEvent(new Event('click'))
				times.push(setTimeout(() =>{					
					state = document.querySelector("#contract_purchase_spots").classList[0]
					if(state == 'won'){						
						document.querySelector('#amount').value = amount;	
						verifier()											
					}else{						
						document.querySelector('#amount').value *= 2;
					}
					
					times.splice(0,times.length)
				},10000))
			},3000))
		},15000)
	}else if(amount == '' ||  amount == null){
		alert('Set amount value !')	
	}
}

function verifier(){
	console.log('entrou em verifier')
	profit = parseFloat(document.querySelector('#contract_purchase_profit').lastChild.innerText)
	earn = parseFloat(document.querySelector('#spanEarn').innerText)
	document.querySelector('#spanEarn').innerText = (earn + profit).toFixed(2)
	console.log(target + ' '+ earn)
	if(target != NaN){
	earn = parseFloat(document.querySelector('#spanEarn').innerText)
		if(target > 0.00 && earn >= target){
			console.log('stoping...')
			stop()
		}
	}
}

function disableElements(){
	document.querySelector('#startButton').style.opacity = 0.4
	document.querySelector('#inputAmount').style.opacity = 0.4
	document.querySelector('#inputStop').style.opacity = 0.4
	document.querySelector('#inputTarget').style.opacity = 0.4
	document.querySelector('#infoButton').style.opacity = 0.4
	document.querySelector('#inputAmount').disabled = true
	document.querySelector('#inputStop').disabled = true
	document.querySelector('#inputTarget').disabled = true
	document.querySelector('#infoButton').style.pointerEvents = 'none'
}

function enableElements(){
	document.querySelector('#startButton').style.opacity = 1
	document.querySelector('#inputAmount').style.opacity = 1
	document.querySelector('#inputStop').style.opacity = 1
	document.querySelector('#inputTarget').style.opacity = 1
	document.querySelector('#infoButton').style.opacity = 1
	document.querySelector('#inputAmount').disabled = false
	document.querySelector('#inputStop').disabled = false
	document.querySelector('#inputTarget').disabled = false
	document.querySelector('#infoButton').style.pointerEvents = 'auto'

}

function stop(){
	if(running == true){
		clearInterval(interval)
		times.forEach((time) =>{
				clearTimeout(time)
			})
		times.splice(0,times.length)
		running = false;
		enableElements()
	}
}


function adjust(){	
	var el= document.querySelector("#contract_markets")
	el[18].selected = true
	el.dispatchEvent(new Event("change"))
	el = document.querySelector('#contract_form_name_nav')
	setTimeout(() =>{
		el.childNodes[4].firstChild.click()
		el = el.childNodes[4].lastChild
		el.childNodes[2].firstChild.click()
		el = document.querySelector("#duration_amount")
		el.value = 5
		el.dispatchEvent(new Event("change"))
		el = document.querySelector('#prediction')
		el.value = 4
		el.dispatchEvent(new Event("change"))
		el = document.querySelector("#amount_type")
		el[1].selected = true
	},2000)
}

function infos(){
	openInfos()
	//var container = document.querySelector("#extensionContainer")
	var backgroundContainer = document.createElement('div')
	//rgba(0,0,0,0.5)
	backgroundContainer.id ='backgroundContainer'
	backgroundContainer.style = 'top:-100vh;position:fixed;height: 100vh;width:100vw;background-color: transparent;z-index:3;display:flex;flex-direction:center;justify-content:center;align-items: center;transition: all .4s'
	var modal = document.createElement('div')
	modal.style = 'z-index:4;height:80%;width:80%;background-color:rgba(62, 57, 57, 0.98);border-radius:10px;display:flex;flex-direction:column;align-items:center'
	backgroundContainer.appendChild(modal)
	var closeButton = document.createElement('div')
	closeButton.style = 'height:10px;width:14px;color:white;border-radius:5px;background-color:rgba(228, 66, 66,0.8);align-self:flex-end;margin-top:5px;margin-right:7px;cursor:pointer;padding: 0px 5px;'
	closeButton.addEventListener('click',closeInfos)
	modal.appendChild(closeButton)
	document.body.insertBefore(backgroundContainer,document.body.firstChild)
	setTimeout(() =>{		
	animeInfos()
	},100)
}	

function openInfos(){
	document.querySelector("#extensionContainer").style.bottom = '-120px'
}

function closeInfos(){
	unanimeInfos()
	setTimeout(() =>{		
	document.body.removeChild(document.body.firstChild)
	document.querySelector("#extensionContainer").style.bottom = '0px'	
	},100)
}

function animeInfos(){
	document.querySelector('#backgroundContainer').style.top ='0vh'
	document.querySelector('#backgroundContainer').style.backgroundColor ='rgba(0,0,0,0.5)'
}

function unanimeInfos(){
	document.querySelector('#backgroundContainer').style.top ='-100vh'
	document.querySelector('#backgroundContainer').style.backgroundColor ='transparent'
}






