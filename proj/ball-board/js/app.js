'use strict'

const WALL = 'WALL'
const FLOOR = 'FLOOR'

const BALL = 'BALL'
const GAMER = 'GAMER'
const GLUE = 'GLUE'

const GAMER_IMG = '\n\t\t<img src="img/gamer.png">\n'
const PURPLE_GAMER_IMG = '\n\t\t<img src="img/gamer-purple.png">\n'
const BALL_IMG = '\n\t\t<img src="img/ball.png">\n'
const GLUE_IMG = '\n\t\t<img src="img/glue.png">\n'


const ROW_COUNT = 10
const COL_COUNT = 12

var gBallInterval
var gGlueInterval
var gIsOnGlue = false

var gEatingSound = new Audio("/audio/eat_sound.wav")
var gWinSound = new Audio("/audio/applause.wav")
var gBgSound = new Audio("/audio/bg-sound.wav")


// Model:
var gBallCount = 2
var gCollectedBalls = 0

var gBoard
var gGamerPos

function initGame() {
    gBallCount = 2
    gCollectedBalls = 0

    var elTable = document.querySelector('table')
    elTable.classList.remove('hide')

    clearInterval(gBallInterval)
    clearInterval(gGlueInterval)
    gGamerPos = { i: 2, j: 9 }

    gBoard = buildBoard()
    renderBoard(gBoard)

    gBallInterval = setInterval(addElement, 5000, BALL)

    gGlueInterval = setInterval(glueMod, 5000)

    gBgSound.loop = true
    gBgSound.play()

}

function buildBoard() {
    var board = []

    // TODO: Create the Matrix 10 * 12 
    board = createMat(10, 12)

    // TODO: Put FLOOR everywhere and WALL at edges
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j] = { type: FLOOR, gameElement: null }
            if (i === 0 || i === board.length - 1) board[i][j].type = WALL
            else if (j === 0 || j === board[i].length - 1) board[i][j].type = WALL
        }
    }
    board[0][6].type = FLOOR
    board[ROW_COUNT - 1][6].type = FLOOR

    board[5][0].type = FLOOR
    board[5][COL_COUNT - 1].type = FLOOR

    // TODO: Place the gamer and two balls
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER

    var randPos1 = getEmptyPos(board)
    board[randPos1.i][randPos1.j].gameElement = BALL

    var randPos2 = getEmptyPos(board)
    board[randPos2.i][randPos2.j].gameElement = BALL

    return board;
}

// Render the board to an HTML table
function renderBoard(board) {

    var elBoard = document.querySelector('.board')
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'

        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]

            var cellClass = getClassName({ i, j })

            if (currCell.type === FLOOR) cellClass += ' floor'
            else if (currCell.type === WALL) cellClass += ' wall'

            strHTML += `\t<td class="cell ${cellClass}" onclick="moveTo(${i}, ${j})">`

            if (currCell.gameElement === GAMER) {
                strHTML += GAMER_IMG;
            } else if (currCell.gameElement === BALL) {
                strHTML += BALL_IMG;
            }

            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }
    console.log('strHTML is:')
    console.log(strHTML)
    elBoard.innerHTML = strHTML
}

// Move the player to a specific location
function moveTo(i, j) {
    if (gIsOnGlue) return

    // Secret Passage
    if (i === -1) i = ROW_COUNT - 1
    if (i === ROW_COUNT) i = 0
    if (j === -1) j = COL_COUNT - 1
    if (j === COL_COUNT) j = 0


    var targetCell = gBoard[i][j]
    if (targetCell.type === WALL) return

    // Calculate distance to make sure we are moving to a neighbor cell
    var iAbsDiff = Math.abs(i - gGamerPos.i)
    var jAbsDiff = Math.abs(j - gGamerPos.j)

    // If the clicked Cell is one of the four allowed
    if (iAbsDiff + jAbsDiff === 1 || iAbsDiff === ROW_COUNT - 1 ||
        jAbsDiff === COL_COUNT - 1) {


        if (targetCell.gameElement === BALL) {
            // Model Update
            gCollectedBalls++
            console.log('Collecting!')
            gEatingSound.play()

            // updating DOM
            var elH2 = document.querySelector('h2')
            elH2.innerText = `Balls Collected: ${gCollectedBalls}`

            if (gCollectedBalls === gBallCount) gameOver()
        }



        if (targetCell.gameElement === GLUE) stepOnGlue({ i, j })

        // TODO: Move the gamer
        // Update the Model:
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = null

        // DOM:
        renderCell(gGamerPos, '')

        // Update the Model:
        targetCell.gameElement = GAMER
        gGamerPos = { i, j }

        // DOM:
        renderCell(gGamerPos, (gIsOnGlue) ? PURPLE_GAMER_IMG : GAMER_IMG)





    } else console.log('TOO FAR', iAbsDiff, jAbsDiff)


}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
}

// Move the player by keyboard arrows
function handleKey(event) {
    var i = gGamerPos.i
    var j = gGamerPos.j


    switch (event.key) {
        case 'ArrowLeft':
            moveTo(i, j - 1)
            break;
        case 'ArrowRight':
            moveTo(i, j + 1)
            break;
        case 'ArrowUp':
            moveTo(i - 1, j)
            break;
        case 'ArrowDown':
            moveTo(i + 1, j)
            break;

    }

}

// Returns the class name for a specific cell
function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}

function addElement(gameElement) {

    var pos = getEmptyPos(gBoard)
    if (!pos) return

    // Update the Model
    gBoard[pos.i][pos.j].gameElement = gameElement
    if(gameElement === BALL) gBallCount++

    //Updating DOM
    renderCell(pos, (gameElement === BALL) ? BALL_IMG : GLUE_IMG)

    return pos
}

function glueMod() {
    var glueCoord = addElement(GLUE)

    setTimeout(() => {
        // Model
        var currGameElement = ''
        if (gBoard[glueCoord.i][glueCoord.j].gameElement === GAMER) {
            currGameElement = PURPLE_GAMER_IMG

        } else gBoard[glueCoord.i][glueCoord.j].gameElement = null


        //Updating DOM
        renderCell(glueCoord, currGameElement)
    }, 3000);
}




function gameOver() {
    clearInterval(gBallInterval)
    clearInterval(gGlueInterval)

    gWinSound.play()
    console.log('You WIN!');

    var elBtn = document.querySelector('.restart')
    elBtn.classList.remove('hide')

    var elTable = document.querySelector('table')
    elTable.classList.add('hide')

    var elH2 = document.querySelector('h2')
    elH2.innerText = '🏆 Well done Champ!! 🏆'

    gBgSound.pause()
    gBgSound.load()

}

function restartGame() {
    initGame()

    var elBtn = document.querySelector('.restart')
    elBtn.classList.add('hide')

    var elH2 = document.querySelector('h2')
    elH2.innerText = `Balls Collected: 0`
}


function stepOnGlue() {
    gIsOnGlue = true
    console.log('Stepped on glue');

    setTimeout(() => {
        gIsOnGlue = false;
        renderCell(gGamerPos, GAMER_IMG)
    }, 3000);
}
