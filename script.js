let minutes = 0;
let seconds = 0;
let matrix = [];
let myInterval;
let boxesToCheck = 0;
let flagsCounter = 0;
let gameIsActive = false;
let numberOfLines = 0;
let numberOfColumns = 0;
let numberOfMines = 0;
let dividend = 0;

function displayFlagsLeft() { //show the number of flags left to be placed
    let element = document.getElementById('bombs-left');
    element.innerHTML = '<h2>0' + (numberOfMines - flagsCounter) + '</h2>';
}

function displayWinnerMessage() { //when the game is won, display a message on the top of the page and stop the timer
    if (seconds < 10) {
        document.getElementById('top-box'). innerHTML = `<span class='glowing-text'>You won the game in ${minutes}:0${seconds}!</span>
        <br>
        <span class='glowing-text'>Congratulations!</span>`;
    } else {
        document.getElementById('top-box'). innerHTML = `<span class='glowing-text'>You won the game in ${minutes}:${seconds}!</span>
        <br>
        <span class='glowing-text'>Congratulations!</span>`;
    }
    clearInterval(myInterval);
}

function checkWinner() { //check if all the flags have been placed and if there are no more boxes to be clicked
    if (boxesToCheck == numberOfMines && flagsCounter == numberOfMines) {
        gameIsActive = false;
        displayWinnerMessage();
    }
}

function checkFlag(line, column, elementId) { //if a button was right clicked, place/remove the flag on it
    let myBtn = document.getElementById(elementId);
    let newBtn = document.createElement('button');
    newBtn.className = "button";
    newBtn.id = elementId;
    if (matrix[line][column].flag == false && numberOfMines - flagsCounter > 0) {
        newBtn.textContent = '🚩';
        matrix[line][column].flag = true;
        ++flagsCounter;
        myBtn.parentNode.replaceChild(newBtn, myBtn);
    } else if (matrix[line][column].flag == true) {
        newBtn.setAttribute('onclick', `checkBox(${line}, ${column})`);
        matrix[line][column].flag = false;
        --flagsCounter;
        myBtn.parentNode.replaceChild(newBtn, myBtn);
    }
    checkWinner();
    displayFlagsLeft();
}

window.addEventListener('contextmenu', (event) => { //check whenever a button is right clicked for flags
    if (event.target.className == 'button' && gameIsActive == true) {
        event.preventDefault();
        let rightClickButtonId = event.target.id;
        let columnId = parseInt(rightClickButtonId % 10);
        rightClickButtonId = parseInt(rightClickButtonId / 10);
        let digit = parseInt(rightClickButtonId % 10);
        if (digit != 0) {
            digit = parseInt(rightClickButtonId % 10);
            columnId += digit * 10;
            rightClickButtonId = parseInt(rightClickButtonId / 100);
        } else {
            rightClickButtonId = parseInt(rightClickButtonId / 10);
        }
        let lineId = rightClickButtonId;
        checkFlag(lineId, columnId, event.target.id);
    }
});

function displayCompleteBoard() { //display the complete board, except the bomb boxes that have a flag
    for (let line = 1; line <= numberOfLines; ++line) {
        for(let column = 1; column <= numberOfColumns; ++column) {
            let columnIndex = column;
            let multiplier = 10;
            while (columnIndex >= 1) {
                multiplier *= 10;
                columnIndex /= 10;
            }
            if (matrix[line][column].value == -1) {
                displayBombBox(line, column, multiplier);
            } else if (matrix[line][column].value == -0) {
                displayEmptyBox(line, column, multiplier);
            } else {
                displayNumberBox(line, column, multiplier);
            }            
        }
    }
}

function displayGameOverMessage() { //display a message that the game is lost
    let image = document.getElementById('top-image');
    image.parentNode.removeChild(image);
    document.getElementById('top-box').innerHTML += '<img src="Images/gameOver.png" class="game-over">';
}

function gameOver() { //end the game
    displayCompleteBoard();
    displayGameOverMessage();
    clearInterval(myInterval);
    gameIsActive = false;
}

function checkNeighbors(line, column) { //if an empty box was left clicked, all the neighbors which does not contain a bomb will be revealed
    for (let newLine = line - 1; newLine <= line + 1 && newLine <= numberOfLines; ++newLine) {
        for (let newColumn = column - 1; newColumn <= column + 1 && newColumn <= numberOfColumns; ++newColumn) {
            if (newLine < 1 || newColumn < 1 || matrix[newLine][newColumn].value == -1) {
                continue;
            }
            checkBox(newLine, newColumn);
        }
    }
}

function displayBombBox(line, column) { //display the bomb under the left clicked box
    if (matrix[line][column].flag == false) {
        let buttonId = parseInt( "" + (line * 10) + column);
        let myBtn = document.getElementById(buttonId);
        let mySpan = document.createElement('span');
        mySpan.className = "bomb-box";
        mySpan.id = buttonId;
        myBtn.parentNode.replaceChild(mySpan, myBtn);
    }
}

function displayNumberBox(line, column) { //display the box which contains the number of nearby bombs
    let buttonId = parseInt( "" + (line * 10) + column);
    let myBtn = document.getElementById(buttonId);
    let mySpan = document.createElement('span');
    mySpan.className = "box";
    mySpan.textContent = matrix[line][column].value;
    mySpan.id = buttonId;
    if (matrix[line][column].value == 1) { //set the color of the text according to the number of bombs
        mySpan.style.color = 'Blue';
    } else if (matrix[line][column].value == 2) {
        mySpan.style.color = 'Green';
    } else if (matrix[line][column].value == 3) {
        mySpan.style.color = 'Red';
    } else {
        mySpan.style.color = 'Purple';
    }
    myBtn.parentNode.replaceChild(mySpan, myBtn);
}

function displayEmptyBox(line, column) { //display the empty box
    let buttonId = parseInt( "" + (line * 10) + column);
    let myBtn = document.getElementById(buttonId);
    let mySpan = document.createElement('span');
    mySpan.className = "empty-box";
    mySpan.id = buttonId;
    myBtn.parentNode.replaceChild(mySpan, myBtn);
}

function checkBox(line, column) { //check the left clicked box
    if (matrix[line][column].isChecked == true) {
        return;
    } else {
        if (matrix[line][column].value == 0 && matrix[line][column].flag == false) {
            displayEmptyBox(line, column);
            matrix[line][column].isChecked = true;
            checkNeighbors(line, column);
            --boxesToCheck;
        } else if (matrix[line][column].value > 0 && matrix[line][column].flag == false) {
            displayNumberBox(line, column);
            matrix[line][column].isChecked = true;
            --boxesToCheck;
        } else if (matrix[line][column].value == -1) {
            displayBombBox(line, column);
            gameOver();
        }
    }
    checkWinner();
}

function timer() { //the timer which is displayed on the top right of the game board
    seconds++;
    let minutesFirstDigit = '0';
    if (seconds == 60) {
        ++minutes;
        seconds = 0;
    }
    if (minutes > 9) {
        minutesFirstDigit = '';
    }
    if (seconds < 10) {
        document.getElementById('timer').innerHTML = minutesFirstDigit + minutes + ':' + '0' + seconds;
    } else {
        document.getElementById('timer').innerHTML = minutesFirstDigit + minutes + ':' + seconds;
    }
}

function displayRules() { //diplay a message on the bottom of the page containing the game rules
    document.getElementById('game-rules').innerHTML += `<span>Game rules: there are ${numberOfLines * numberOfLines} boxes, of which ${numberOfMines} contain a mine.</span>
    <br>
    <span>The number on a box shows the number of mines adjacent to it, you will have to flag all the mines.</span>
    <br>
    <span>If you click on a mine, the game is lost. After you placed a flag on all the mines and the rest of the boxes were opened, you win the game!</span>`
}

function drawTable() { //draw the buttons on the game board
    for (let lineIndex = 1; lineIndex <= numberOfLines; ++lineIndex) {
        for(let columnIndex = 1; columnIndex <= numberOfColumns; ++columnIndex) {
                document.getElementById('game-box').innerHTML += `<button type="button" class="button" id="${lineIndex * 10}${columnIndex}" onclick="checkBox(${lineIndex}, ${columnIndex})"></button>`;
        }
    }
}

function setBoardDimmensions() { //set the game board style attributes according to the number of the boxes to be checked
    let width = numberOfColumns * 30;
    let widthDivident = 0;
    if (numberOfColumns < 15) {
        widthDivident = 30;
    } else if (numberOfColumns < 22) {
        widthDivident = 15;
    } else {
        widthDivident = 1;
    }
    document.getElementById('game-box').style.width = `${width + (widthDivident / numberOfColumns)}px`;
    document.getElementById('display-box').style.width = `${width}px`;
    document.getElementById('box').style.width = `${width + 50}px`;
    document.getElementById('game-rules').style.width = `${width}px`;
    document.getElementById('top-box').style.width = `${width}px`;
    let height = numberOfLines * 30;
    document.getElementById('game-box').style.height = `${height + (30 / numberOfLines)}px`;
    document.getElementById('box').style.height = `${height + 125}px`;

}

function displayGameBoard() { // display the game board which contains the boxes to be checked
    let board = document.getElementById('box');
    board.style.visibility = 'visible';
    let inputDiv = document.getElementById('input');
    inputDiv.style.display = 'none';
    displayFlagsLeft();
    setBoardDimmensions();
    drawTable();
}

function setBombs() { //set the bombs random on the matrix
    let bombsToBePlaced = numberOfMines;
    while (bombsToBePlaced > 0) {
        let bombLine = Math.floor(Math.random() * (numberOfLines - 1)) + 1;
        let bombColumn = Math.floor(Math.random() * (numberOfColumns - 1)) + 1;
        if (matrix[bombLine][bombColumn].value == -1) {
            ++bombsToBePlaced; //re-try to place the bomb because the place is not correct
        } else {
            matrix[bombLine][bombColumn].value = -1;
            for (let line = bombLine - 1; line <= bombLine + 1; ++line) {
                for (let column = bombColumn - 1; column <= bombColumn + 1; ++column) {
                    if (matrix[line][column].value != -1) {
                        ++matrix[line][column].value;
                    }
                }
            }
        }
        --bombsToBePlaced;
    }
}

function setMatrix() { //set the lines and columns of the matrix which will be used for the game to value 0
    for (let lineIndex = 0; lineIndex <= numberOfLines; ++lineIndex) {
        matrix[lineIndex] = [];
        for(let columnIndex = 0; columnIndex <= numberOfColumns; ++columnIndex) {
            let element = {value : 0, isChecked : false, flag : false};
            matrix[lineIndex][columnIndex] = element;
        }
    }
}

function startGame() { //start the game
    myInterval = setInterval(timer, 1000);
    setMatrix();
    setBombs();
    displayGameBoard();
    displayRules();
    document.getElementById('start-button').disabled = true;
    gameIsActive = true;
}

function insertLines() { //read and set the number of lines assigned by the user
    let lines = document.getElementById('linesNumber').value;
    if (lines >= 10 && lines <= 30) {
        numberOfLines = lines;
        let message = document.getElementById('line-insert-message');
        message.innerHTML = 'Number of the lines assigned complete!';
        message.style.color = 'green';
    } else {
        let message = document.getElementById('line-insert-message');
        message.innerHTML = 'Invalid value. Please enter a value between 8 and 30!';
        message.style.color = 'red';
    }
}

function insertColumns() { //read and set the number of columns assigned by the user
    let columns = document.getElementById('columnsNumber').value;
    if (columns >= 10 && columns <= 30) {
        numberOfColumns = columns;
        let message = document.getElementById('column-insert-message');
        message.innerHTML = 'Number of the columns assigned complete!';
        message.style.color = 'green';
    } else {
        let message = document.getElementById('column-insert-message');
        message.innerHTML = 'Invalid value. Please enter a value between 8 and 30!';
        message.style.color = 'red';
    }
    boxesToCheck = numberOfLines * numberOfColumns;
}

function insertDifficulty() { //read and set the difficulty level assigned by the user
    dividend = parseInt(numberOfLines) + parseInt(numberOfColumns);
    let difficultyLevel = document.getElementById('difficulty').value;
    let message = document.getElementById('difficulty-insert-message');
    message.innerHTML = 'Difficulty level assigned complete!';
    message.style.color = 'green';
    if (numberOfLines == 0 || numberOfColumns == 0) {
        message.innerHTML = 'Please set the number of Lines and Columns first!';
        message.style.color = 'red';
    } else {
        if (difficultyLevel == 'Easy') {
            numberOfMines = parseInt(dividend / 4);
        } else if (difficultyLevel == 'Medium') {
            numberOfMines = parseInt(dividend / 2);
        } else if (difficultyLevel == 'Hard') {
            numberOfMines = parseInt(dividend / 1.5);
        } else {
            message.innerHTML = 'Invalid input, please insert: Easy, Medium or Hard';
            message.style.color = 'red';
        }
    }
}
