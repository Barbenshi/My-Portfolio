'use strict'

const WALL = '#'
const FOOD = '.'
const SUPER_FOOD = '&#x1F354;'
const CHERRY = '&#127826;'
const EMPTY = ' '

const SIZE = 10

var gGame = {
    score: 0,
    isOn: false,
    winScore: 0,
    superTimeout: null,
    cherryInterval: null
}
var gBoard

function init() {
    console.log('hello')

    gBoard = buildBoard()
    createPacman(gBoard)
    createGhosts(gBoard)

    renderBoard(gBoard, '.board-container')
    gGame.cherryInterval = setInterval(() => { addElement(CHERRY) }, 15000);

    gGame.isOn = true
}

function buildBoard() {
    const board = []

    for (var i = 0; i < SIZE; i++) {
        board.push([])

        for (var j = 0; j < SIZE; j++) {

            if (i === 0 || i === SIZE - 1 ||
                j === 0 || j === SIZE - 1 ||
                (j === 3 && i > 4 && i < SIZE - 2)) {
                board[i][j] = WALL

            } else if (j === 1 || j === SIZE - 2) {
                if (i === 1 || i === SIZE - 2) {
                    board[i][j] = SUPER_FOOD
                    //gGame.winScore+= 10?
                }
            }
            if (!board[i][j]) {
                board[i][j] = FOOD
                gGame.winScore++
            }

        }
    }
    //winScore returns the number of food available
    // here it removes 1 food due to Pacman occupying space
    gGame.winScore--
    console.log(gGame.winScore);

    return board
}

function updateScore(diff) {
    gGame.score += diff
    document.querySelector('h2 span').innerText = gGame.score

    if (gGame.score >= gGame.winScore) gameOver('WELL DONE!')
}

function gameOver(isWin = false) {
    console.log('Game Over')
    clearInterval(gIntervalGhosts)
    clearInterval(gGame.cherryInterval)
    clearTimeout(gGame.superTimeout)
    
    var elDiv = document.querySelector('.game-over')
    elDiv.classList.remove('hide')
    
    var elSpan = elDiv.querySelector('span')
    elSpan.innerText = isWin ? isWin : 'GAME OVER, YOU LOSE'
    
    resetGameStats()

}

function restartGame() {
    var elDiv = document.querySelector('.game-over')
    elDiv.classList.add('hide')

    document.querySelector('h2 span').innerText = gGame.score

    init()
}

function onSuperMode(){
    renderGhosts()

    gGame.superTimeout = setTimeout(()=>{
        gPacman.isSuper = false
        resetLocation()
        reviveGhosts()
        renderGhosts()
    },5000)
}

function reviveGhosts(){
    gGhosts=[...gGhosts,...gDeadGhosts]
    gDeadGhosts=[]
}

function resetLocation() {
    for (var i = 0; i < gDeadGhosts.length; i++) {
        const deadGhost = gDeadGhosts[i]
        deadGhost.location.i = 3
        deadGhost.location.j = 3
    }
}

function addElement(element) {
    const pos = getEmptyPos(gBoard)
    if (!pos) return

    // Model
    gBoard[pos.i][pos.j] = element

    // DOM
    renderCell(pos, element)

    setTimeout(() => {
        if (gBoard[pos.i][pos.j] !== PACMAN) {
            gBoard[pos.i][pos.j] = EMPTY
            renderCell(pos, EMPTY)
        }

    }, 5000);
}


function resetGameStats() {
    gGame.score = 0,
    gGame.winScore = 0,
    gGame.superTimeout = null,
    gGame.cherryInterval = null
    gGame.isOn = false
}