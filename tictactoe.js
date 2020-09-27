$(document).ready(function() {
	let arrayList = [
		["","",""],
		["","",""],
		["","",""]
	];
	let TURN_PLAYER = "X";
	$("#playerturn").html("Turn for player: " + TURN_PLAYER);

	let gameStop =  false;
	$("td").click(function() {
		if($(this).html() == "" && !gameStop) {
			$(this).html(TURN_PLAYER);
			
			let id = $(this).attr("id");
			let indices = id.split("x");
			indices[0] = parseInt(indices[0]);
			indices[1] = parseInt(indices[1]);

			arrayList[indices[0]][indices[1]] = TURN_PLAYER;
			console.log(arrayList);
			TURN_PLAYER = (TURN_PLAYER == "X" ? "O" : "X");
			$("#playerturn").html("Turn for player: " + TURN_PLAYER);
			checkWinner();
		}
	});
	function checkWinner() {
		let patterns = 
		[
			[ [0,0], [0,1], [0,2] ],
			[ [1,0], [1,1], [1,2] ],
			[ [2,0], [2,1], [2,2] ],
			[ [0,0], [1,0], [2,0] ],
			[ [0,1], [1,1], [2,1] ],
			[ [0,2], [1,2], [2,2] ],
			[ [0,0], [1,1], [2,2] ],
			[ [2,0], [1,1], [0,2] ]
		];
		let wpi = -1;
		let stop = false;
		let old = "";
		for(let i = 0; i < patterns.length; i++)
		{
			let idxI = patterns[i][0][0];
			let idxJ = patterns[i][0][1];
			old = arrayList[idxI][idxJ];
			for(let j = 1; j < patterns[i].length; j++)
			{
				idxI = patterns[i][j][0];
				idxJ = patterns[i][j][1];
				console.log(arrayList[idxI][idxJ] + " , " + old);
				if(arrayList[idxI][idxJ] == old && old != "")
				{
					stop = true;
					continue;
				} else {
					stop = false;
					old = "";
					break;
				}
			}
			if(stop) {
				wpi = i;
				break;
			}
		}
		if(stop && old != "") {
			console.log("We have a winner: " + old);
			$("#winnerName").html(old);
			$("#overlay_main").css("display","block");
			gameStop = true;
			// we paint those boxes
			let idStr = "";
			for(let i = 0; i < patterns[wpi].length; i++) {
				idStr = patterns[wpi][i][0] + "x" +  patterns[wpi][i][1];
				console.log("ID String: " + idStr);
				$("td#" + idStr).css("background-color","red");
			}
		}
		else{
			//we check for a tie
			let hasBlank = true;
			for(let x = 0; x < 3; x++) {
				for(let y = 0; y < 3; y++) {
					if(arrayList[x][y] == "") {
						hasBlank = true;
						break;
					}
					else {
						hasBlank = false;
					}
				}	
				if(hasBlank) {
					break;
				}
			}
			if(!hasBlank) {
				console.log("We have a winner: " + old);
				$("#overlayfg").html("The game ended with a tie");
				$("#overlay_main").css("display","block");
				gameStop = true;
			}
		}
	}
});