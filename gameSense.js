
document.addEventListener("DOMContentLoaded", () => {
    let word = "";
    getNewWord();
    initBoard();
    let currGuessNumber = 0;
    let currGuess = "";
    const keys = document.querySelectorAll(".keyboard-row button");
    function initBoard() {
        let board = document.getElementById("game-board");

        for (let i = 0; i < 8; i++) {
            let row = document.createElement("div")
            row.className = "letter-row"
            row.id = "letter-row"+i
            for (let j = 0; j < 5; j++) {
                let box = document.createElement("button")
                box.className = "letter-box"
                box.id="letter-box-"+i+"-"+j;
                box.addEventListener("click", changeColor(box.id));
                row.appendChild(box)
            }
            let box = document.createElement("div")
            box.className = "letter-box-spacer"
            row.appendChild(box)
            let boxG = document.createElement("div")
            boxG.className = "letter-box-green"
            boxG.id ="letter-box-green"+i
            row.appendChild(boxG)
            let boxY = document.createElement("div")
            boxY.className = "letter-box-yellow"
            boxY.id = "letter-box-yellow"+i
            row.appendChild(boxY)
            let boxR = document.createElement("div")
            boxR.className = "letter-box-red"
            boxR.id = "letter-box-red"+i
            row.appendChild(boxR)
            board.appendChild(row)
        }
    }
    function getNewWord() {
        // Specify the API endpoint for user data
        const apiUrl = 'https://random-word-api.vercel.app/api?words=1&length=5';
        // Make a GET request using the Fetch API
        fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(userData => {
            // Process the retrieved user data
            word = userData[0];
        })
        .catch(error => {
            console.error('Error:', error);
        });
        
    }
    function hasRepeatLetter(string){
        let map = {};
        for(let i =0 ; i < string.length; i++){
            if(string[i] in map){
                return true;
            }
            map[string[i]] = 1;
        }
        return false;
    }
    function guessLogic(ans, guess){
        if(guess.length != 5){
            alert("Please do something of the length 5");
            return "length too long";
        }
        let samePos = 0;
        let difPos = 0;
        let ret = []
        for(let i=0; i < guess.length ; i++ ){
            if(ans[i] == guess[i]){
                samePos++;
            }
            else{
                for(let j = 0; j < guess.length ; j++)
                {
                    if(ans[i] == guess[j])
                    {
                        difPos++;
                    }
                }
            }
        }
        let wrong = 5 - samePos - difPos;
        ret.push(samePos, difPos, wrong);
        return ret;
    }
    function printGuessLogic(logicArray){
        document.getElementById("letter-box-green"+currGuessNumber).innerHTML = logicArray[0];
        document.getElementById("letter-box-yellow"+currGuessNumber).innerHTML = logicArray[1];
        document.getElementById("letter-box-red"+currGuessNumber).innerHTML = logicArray[2];
        //let s = logicArray[0]+" "+logicArray[1]+" "+logicArray[2];
        if(logicArray[0] == 5){
            alert("You won!");
        }
        //return s;
    }
    function gameplayLoop(){
        if(currGuessNumber > 7){
            alert("You Lost");
            return "lost";
        }
    }
    function guess(){
        let lost = gameplayLoop();
        if(lost == "lost"){
            return;
        }
        //get guess 
        let lastGuess = currGuess;
        let feedback = guessLogic(word, lastGuess);
        if(feedback == "length too long"){
            return;
        }
        printGuessLogic(feedback);
        for(let i = 0; i < 5; i++){
            document.getElementById("letter-box-"+currGuessNumber+"-"+i).innerHTML = currGuess[i];
        }
        currGuessNumber++;
        currGuess = "";
    }
    function changeColor(id){
        return function() {
             if(document.getElementById(id) !== null){
                let mydiv = document.getElementById(id);
                if(mydiv.className == "letter-box-green"){
                    mydiv.className = "letter-box";
                }
                else if(mydiv.className == "letter-box"){
                    mydiv.className = "letter-box-red";
                }
                else if(mydiv.className == "letter-box-yellow"){
                    mydiv.className = "letter-box-green";
                }
                else{
                    mydiv.className = "letter-box-yellow";
                }
            }
        }
    }
    function updateGuessedWords(letter){
        if(currGuess.length >= 5){
            return;
        }
        currGuess = currGuess + letter;
        let tempLength = currGuess.length-1;
        let id = "letter-box-"+currGuessNumber+"-"+tempLength;
        document.getElementById(id).innerHTML = currGuess[currGuess.length-1];
        console.log(word);
        if(hasRepeatLetter(word)){
            getNewWord();
        }
    }
    function handleDeleteLetter(){
        currGuess = currGuess.slice(0, currGuess.length - 1);
        document.getElementById("letter-box-"+currGuessNumber+"-"+currGuess.length).innerHTML = "";
    }
    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({ target }) => {
          const letter = target.getAttribute("data-key");
    
          if (letter === "enter") {
            guess();
            return;
          }
    
          if (letter === "del") {
            handleDeleteLetter();
            return;
          }
    
          updateGuessedWords(letter);
        };
      }
});


