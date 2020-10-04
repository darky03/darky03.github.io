$(document).ready(function() {
	let selectedElements = [];
	selectedElements[0] = null;
	selectedElements[1] = null;
	let generatedList = [];
	let cardsLocked = false;
	let gameWon = false;
	let minutes = 3;
	let seconds = 0;
	let totalTime = (minutes * 60) + seconds;
	let originalTime = -1;
	let clockTimer = null;
	generateMemoryCards(6);
	clockTimer = setInterval(clockTick,1000,true);
	$(".flip-card").click(function() {
		if(!cardsLocked && !gameWon) {

			flipCard(this);
			if(selectedElements[0] != null) {
				selectedElements[1] = this;
				let id0 = $(selectedElements[0]).attr("target_id");
				let id1 = $(selectedElements[1]).attr("target_id");
				if(id0 != id1) {
					
					cardsLocked = true;
					checkElements();
				}
				else {
					selectedElements[1] = null;
				}
			} else {
				selectedElements[0] = this;
			}

		}
	});
	function flipCard(element) {
		let target = $(element).attr("target_id");
		$("#" + target).css("transform","rotateY(180deg)");
	}
	function unflipCard(element) {
		let target = $(element).attr("target_id");
		$("#" + target).css("transform","rotateY(0deg)");
	}
	function checkElements() {
		if(selectedElements[0] != null && selectedElements[1] != null) {
			let id0 = $(selectedElements[0]).attr("target_id");
			let id1 = $(selectedElements[1]).attr("target_id");
			console.log(id0 + " , " + id1);
			if(id0 != id1) {
				let cardid0 = parseInt($(selectedElements[0]).attr("cardnumber"));
				let cardid1 = parseInt($(selectedElements[1]).attr("cardnumber"));

				console.log("Checking for (" + id0 + " , " + id1 + ")");
				if(cardid0 != cardid1) {
					setTimeout(function() {
							unflipCard(selectedElements[0]);
							unflipCard(selectedElements[1]);

							selectedElements[0] = null;
							selectedElements[1] = null;
							cardsLocked = false;
					},750);
				}
				else {
					setTimeout(function() {
						$(selectedElements[0]).css("visibility","hidden");
						$(selectedElements[1]).css("visibility","hidden");

						cardsLocked = false;
						selectedElements[0] = null;
						selectedElements[1] = null;
						//Remove the 2 elements from the list
						generatedList.splice(generatedList.indexOf(cardid0), 1);
						generatedList.splice(generatedList.indexOf(cardid1), 1);
						if(generatedList.length == 0) {
							gameWon = true;
							clearInterval(clockTimer);
							$("#overlay").css("display","block");
							$("#overlay_box").html("<h2>You have won!</h2><br>Kudos! You've won the game.<br><br>Reload the page to play again");
						}
					},500);

				}
			}
		}
	}
	function generateRandomUniqueList(listLength, startRange, endRange) {
		//Thanks Leanne Serrao for this logic
		let list = [];
		while(list.length < listLength) {
			let randomNum = ( Math.round(Math.random() * 1000) % (endRange + 1) ) + startRange;
			if(!list.includes(randomNum)) list.push(randomNum);
		}
		console.log("List generated:");
		console.log(list);
		return list;
	}
	//function checkMatch()
	function generateMemoryCards(gridSize) {
		let firstList = generateRandomUniqueList(18, 0, 212);
		let secondList = shuffleList(firstList);
		generatedList = firstList.concat(secondList);
		console.log(generatedList);
		console.log("Length: " + generatedList.length);
		generateGridTable(gridSize);
		let k = 0;
		for(let i = 0; i < gridSize; i++) {
			for(let j = 0; j < gridSize; j++) {

				attachTableCard(generatedList[k], i, j, "./memorygame/vehicles/Vehicle_" + generatedList[k] + ".jpg");
				k++;
			}
		}
		console.log(k);

	}
	function generateGridTable(gridSize) {
		let appendable = "<table align=center>";
		for(let i = 0; i < gridSize; i++) {
			appendable += "<tr>";
			for(let j = 0; j < gridSize; j++) {
				// We create something like <td id='card_0x0'>, <td id='card_0x1'> and so on..
				appendable += "<td id='card_" + i + "x" + j +"'></td>"; 
			}
			appendable += "</tr>";
		}
		appendable += "</table>";
		$(".cards_holder").html(appendable);
	}
	function attachTableCard(cardId, i, j, imageSource) {
		let gId = "card_" + i + "x" + j;
		let cardHtml = "<div class='flip-card' id='flip_card' target_id='flip_inner_" + i + "x" + j + "' cardNumber='" + cardId +"'> \
				<div class='flip-card-inner' id='flip_inner_" + i + "x" + j +  "'> \
					<div class='flip-card-front'> \
						<img src='./memorygame/cardfront.png' style='width:125px;height: 75px;'>	\
					</div> \
					<div class='flip-card-back'> \
						<img src='" + imageSource + "' style='width: 125px; height: 75px;'> \
					</div>\
				</div> \
			</div>";
		$("#" + gId).html(cardHtml);
	}

	function shuffleList(list) {

		//We first create an array which will hold the indices which we will later assign
		let shuffleIndices = [];
		while(shuffleIndices.length < list.length) {
		    let random = Math.round(Math.random() * 100) % list.length;
		    if(!shuffleIndices.includes(random)) shuffleIndices.push(random);
		}

		// We then store the new list in this variable
		let tempList = [];
		for(let i = 0; i < shuffleIndices.length; i++) {
			tempList[i] = list[ shuffleIndices[i] ];
		}
		return tempList;
	}
	function clockTick() {
		console.log(totalTime);
		if(totalTime > -1) {
			
			let iMin = Math.floor(totalTime / 60);
			let iSec = totalTime % 60;
			iMin = (iMin < 10) ? ("0" + iMin) : ("" + iMin);
			iSec = (iSec < 10) ? ("0" + iSec) : ("" + iSec);
			$("#gameMinutes").html(iMin);
			$("#gameSeconds").html(iSec);
			if(totalTime < 30) {
				$("#gameMinutes").css("color","red");
				$("#gameSeconds").css("color","red");
				$("#gameMinutes").css("font-weight","bold");
				$("#gameSeconds").css("font-weight","bold");
			} else {
				$("#gameMinutes").css("color","black");
				$("#gameSeconds").css("color","black");
			}
			totalTime--;
		} else {
			//The player ran out of time
			clearInterval(clockTimer);
			$("#overlay").css("display","block");
			$("#overlay_box").html("<h2>You lose!</h2><br>The timer ran out .. Better luck next time!<br><br>Reload the page to play again");
		}
	}
});