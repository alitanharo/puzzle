
/////////////////// Global variables/////////////////////////////////
let photo;
let CANVAS, CONTEXT
let turns = 0;
let scaler = 0.4;
let SIZE = { x: 0, y: 0, width: 0, height: 0, rows: 2, columns: 4 };
let PIECES = [];
let PIECE;
let currentPiece = null;
let otherPiece = null;
let pieceHeight, pieceWidth
let currentCoords, otherCoords
let r, c, r2, c2
let moveDown, moveLeft, moveRight, moveUp
let d = new Date()
let startTime;
let endTime;
let copy





////////////// when the body load this main function will execute////////////////////////////////////////////////
function main() {
    setCanvas()
    setImage()
    handleResize()
    checkSizeChanging()
    initializePieces(SIZE.rows, SIZE.columns);
    setGame();
    getCopy();
    eventListeners()

}

//////////////// canvas and image setup///////////////////////////////////////////

function setCanvas() {
    CANVAS = document.getElementById("canvas");
    CONTEXT = CANVAS.getContext("2d");
}

function setImage() {
    photo = document.createElement("img");
    photo.src = "/asset/images/11.jpg";
    frameWidth = 2
    frameheight = 1

}

////////////////sizing///////////////////////////////////////////////////////
function handleResize() {
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;
    let resizer = scaler *
        Math.min(
            window.innerWidth / frameWidth,
            window.innerHeight / frameheight
        );

    SIZE.width = resizer * frameWidth;
    SIZE.height = resizer * frameheight;
    SIZE.x = window.innerWidth / 2 - SIZE.width / 2;
    SIZE.y = window.innerHeight / 2 - SIZE.height / 2;

    pieceHeight = SIZE.height / SIZE.rows
    pieceWidth = SIZE.width / SIZE.columns

}
function checkSizeChanging() {

    window.addEventListener('resize', handleResize);

}
////////////////// pushing pieces & blanks & ///////////////////////////////////////////////////////////
function initializePieces(rows, cols) {
    SIZE.rows = rows;
    SIZE.columns = cols;
    PIECES = [];
    for (let i = 0; i < SIZE.rows + 1; i++) {
        for (let j = 0; j < SIZE.columns; j++) {
            PIECES.push(new Piece(i, j));

        }
    }

    for (let i = 1; i <= SIZE.columns; i++) {

        PIECES[PIECES.length - i].isBlank = true
    }

}
////////////drawing images in canvas/////////////////////////////////////////////////////////////////////////
function setGame() {
    CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
    CONTEXT.globalAlpha = 0.1;
    CONTEXT.drawImage(photo,
        SIZE.x, SIZE.y,
        SIZE.width, SIZE.height);
    CONTEXT.globalAlpha = 1;
    for (let i = 0; i < PIECES.length; i++) {
        PIECE = PIECES[i]
        PIECE.draw(CONTEXT)


    }
    resetTime()
    window.requestAnimationFrame(setGame);
}
///////////////shuffleing////////////////////////////////////////////
function shuffle(p) {
    for (let i = p.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [p[i].x, p[j].x] = [p[j].x, p[i].x];
        [p[i].y, p[j].y] = [p[j].y, p[i].y];
        p[i].correct = false
        p[j].correct = false

    }
}


////////////// piece class/////////////////////////////////////////////////////

class Piece {
    constructor(rowIndex, colIndex) {


        this.isBlank = false;
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;
        this.x = SIZE.x + SIZE.width * this.colIndex / SIZE.columns;
        this.y = SIZE.y + SIZE.height * this.rowIndex / SIZE.rows;
        this.width = pieceWidth;
        this.height = pieceHeight;
        this.id = this.rowIndex.toString() + "-" + this.colIndex.toString();
        this.correct = true;


    }
    draw(context) {

        context.beginPath();
        context.drawImage(photo,
            this.colIndex * photo.width / SIZE.columns,
            this.rowIndex * photo.height / SIZE.rows,
            photo.width / SIZE.columns,
            photo.height / SIZE.rows,
            this.x,
            this.y,
            this.width,
            this.height);
        let gradient = context.createLinearGradient(0, 0, 10, 0);
        gradient.addColorStop("0.2", "gray");
        gradient.addColorStop("0.1", "white")
        context.strokeStyle = gradient;
        context.lineWidth = 5
        context.rect(this.x, this.y, this.width, this.height);
        context.stroke();


    }

}

//////////////////////////////////////////////////////////////////////////

function eventListeners() {
    CANVAS.addEventListener("mousedown", onMouseDown);
    CANVAS.addEventListener("mousemove", onMouseMove);
    CANVAS.addEventListener("mouseup", onMouseUp);
    CANVAS.addEventListener("mouseover", onMouseOver);
    CANVAS.addEventListener("mouseenter", onMouseEnter);

}

function getSelectedPiece(loc) {
    for (let i = PIECES.length - 1; i >= 0; i--) {
        if (loc.x > PIECES[i].x && loc.x < PIECES[i].x + PIECES[i].width &&
            loc.y > PIECES[i].y && loc.y < PIECES[i].y + PIECES[i].height) {
            return PIECES[i];
        }
    }
    return null;
}

function onMouseDown(e) {
    currentPiece = getSelectedPiece(e)
    if (currentPiece != null) {
        let index = PIECES.indexOf(currentPiece);
        if (index > -1) {
            PIECES.splice(index, 1);
            PIECES.push(currentPiece);
        }
    }
    currentPiece.correct = false;
}

function onMouseMove(e) {
    e.preventDefault()
}

function onMouseUp(e) {
    otherPiece = getSelectedPiece(e)

    isAdjacent(currentPiece, otherPiece)
    if (isAdjacent && otherPiece.isBlank == true) {
        movePiece();
    }
    else {
        return
    }


    //     if(isComplete&&endTime ==null){
    // let now = new Date().getTime()
    // endTime = now

    //     }
}


function onMouseOver(e) {

    e.preventDefault()
}

function onMouseEnter(e) {

    e.preventDefault()
}


function movePiece() {
    [currentPiece.x, otherPiece.x] = [otherPiece.x, currentPiece.x];
    [currentPiece.y, otherPiece.y] = [otherPiece.y, currentPiece.y];
    currentPiece = null;
    turns += 1;
    document.getElementById("turns").innerText = "Turns" + turns;
}

function isAdjacent(p1, p2) {
    currentCoords = p1.id.split("-"); 
    r = parseInt(currentCoords[0]);
    c = parseInt(currentCoords[1]);
    otherCoords = p2.id.split("-");
    r2 = parseInt(otherCoords[0]);
    c2 = parseInt(otherCoords[1]);
    moveLeft = r == r2 && c2 == c - 1;
    moveRight = r == r2 && c2 == c + 1;
    moveUp = c == c2 && r2 == r - 1;
    moveDown = c == c2 && r2 == r + 1;


    if (moveLeft || moveRight || moveUp || moveDown) {

        return true
    }
    else {
        return false
    }

}

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

function restart() {

    startTime = d.getTime();
    endTime = null;

    shuffle(PIECES)

    document.getElementById("menuBar").style.display = "none"
}


// function setDifficulty() {
//     let diff = document.getElementById("difficulty").value;
//     switch (diff) {
//         case "easy":
//             SIZE.rows=1;
//             SIZE.columns = 3;
//             break;
//         case "medium":
//             SIZE.rows = 4;
//             SIZE.columns = 6;
//             break;
//         case "hard":
//             SIZE.rows = 10;
//             SIZE.columns = 12;
//             break;

//     }
// }

////////////////////Timer/////////////////////////////////////////////////////////////////

function resetTime() {
    let now = new Date().getTime();
    if (startTime != null) {
        if (endTime != null) {
            document.getElementById("time").innerHTML =
                formatTime(endTime - startTime);
        } else {
            document.getElementById("time").innerHTML =
                formatTime(now - startTime);
        }
    }
}

function formatTime(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    let s = Math.floor(seconds % 60);
    let m = Math.floor((seconds % (60 * 60)) / 60);
    let h = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));

    let formattedTime = h.toString().padStart(2, '0');
    formattedTime += ":";
    formattedTime += m.toString().padStart(2, '0');
    formattedTime += ":";
    formattedTime += s.toString().padStart(2, '0');

    return formattedTime;
}

/////////////////copy//////////////////////////////////////////////////////////

function getCopy() {


    return copy = [...PIECES]

}
/////////////////////////////////////////////////////////////////////////////



// }
// function isComplete() {
//     for (let i = 0; i < PIECES.length; i++) {
//         if (PIECES[i].correct == false) {
//             return false;
//         }
//     }
//     return true;
//




//////////////////////////////////////////////////////////////////////////////////
//////////////////slider////////////////////////////////////////////////////////////////
