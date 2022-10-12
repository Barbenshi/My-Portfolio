'use strict'

// Setting local Storage high scores
localStorage.easyBestScore = Infinity
localStorage.mediumBestScore = Infinity
localStorage.hardBestScore = Infinity

// Constants
const EMPTY = ''

const WIN_IMG = '<img src="img/spiderman-win.png">'
const LOSE_IMG = '<img src="img/fire.png">'
const NORMAL_IMG = '<img src="img/gob-face.png">'

const MINE_IMG = '<img src="img/mine.png">'
const LIFE_IMG = '🕷️'
const FLAGS_IMG = '🕸️'
const HINT_IMG = '💡'

const gWinAudio = new Audio('audio/spiderman-thank-you.wav')
const gApplauseAudio = new Audio('audio/applause.wav')
const gLoseAudio = new Audio('audio/spiderman-lose.wav')
const gExterminatorAudio = new Audio('audio/bomb-has-been-defused-csgo-sound-effect.mp3')

// Global variables
var gIsDarkMode = false

var gElTable = document.querySelector('table')
var gElHints = document.querySelector('.hints')
var gElRestartBtn = document.querySelector('.restart-btn')

var gLastMovesPos = []
var gElLastCells = []

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    timerInterval: null,
    isFirstClick: true,
    lives: 2,
    hints: 3,
    isHint: false,
    saveMe: 3,
    isManual: false,
    manualMines: gLevel.MINES,
    isSevenBoom: false,
    megaHint: 1,
    isMegaHint: false,
    megaHintPos: null,
    minesPos: [],
}

var gBoard

function initGame() {
    resetGameStats()
    resetTimer()

    // Model
    gBoard = getMat(gLevel.SIZE)
    buildBoard(gBoard)

    // DOM
    renderBoard(gBoard)
    resetDOM()

}


function buildBoard(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            const cell = {
                minesAroundCount: 4, //gonna calculate that later with function 
                isShown: false, // depends on left click later
                isMine: false, // all false except mines
                isMarked: false, // Depends on right click
                isRecursable: true,  // for negs recursion
            }
            board[i][j] = cell
        }
    }
}

function renderBoard(mat) {

    var strHTML = '<table border="10"><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]

            var className = 'cell cell-' + i + '-' + j
            if (cell.isMarked) className += ' marked'
            if (cell.isShown) className += ' shown'
            if (cell.mineClicked) className += ' mine-clicked'
            if (gIsDarkMode) className += ' dark-theme'

            var currElement = cell.minesAroundCount ? cell.minesAroundCount : EMPTY
            if (cell.isMine) currElement = MINE_IMG
            strHTML += `<td class="${className}" onclick="cellClicked(this,${i},${j})"
            onmousedown="onRightClick(event,this,${i},${j})">
            ${cell.isShown ? currElement : EMPTY}</td>`

        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    gElTable.innerHTML = strHTML

}

function negsRecursion(board, i, j, hide = false) {
    for (var row = i - 1; row <= i + 1; row++) {
        if (row < 0 || row >= board.length) continue

        for (var col = j - 1; col <= j + 1; col++) {
            if (col < 0 || col >= board.length) continue

            if (hide) {
                if (!board[row][col].minesAroundCount && !board[row][col].isRecursable) {
                    showNegs(board, row, col, hide)
                    board[row][col].isRecursable = true
                    negsRecursion(board, row, col, hide)
                }
            } else if (!board[row][col].minesAroundCount && board[row][col].isRecursable) {
                showNegs(board, row, col)
                board[row][col].isRecursable = false
                negsRecursion(board, row, col)
            }

        }
    }
}

function showNegs(board, i, j, hide = false) {
    for (var row = i - 1; row <= i + 1; row++) {
        if (row < 0 || row >= board.length) continue

        for (var col = j - 1; col <= j + 1; col++) {
            if (col < 0 || col >= board.length) continue
            if (row === i && col === j) continue
            if (!hide) {
                if (board[row][col].isShown) continue
            }
            if (board[row][col].isMarked) {
                // board[row][col].isMarked = hide ? true : false
                board[row][col].isMarked = false

                // gGame.markedCount = hide? gGame.markedCount+1: gGame.markedCount-1
                gGame.markedCount--
            }
            board[row][col].isShown = hide ? false : true
            gGame.shownCount = hide ? gGame.shownCount - 1 : gGame.shownCount + 1
        }
    }
}

function hintClicked() {
    if (gGame.isFirstClick) return
    if (!gGame.isHint && !gGame.hints) return

    gGame.isHint = gGame.isHint ? false : true
    gElHints.classList.toggle('clicked')
    gElTable.classList.toggle('clicked')
}

function useHint(i, j) {
    // gBoardCopy = gBoard.slice()
    console.log('You got hint');
    var hintCoords = []

    for (var row = i - 1; row <= i + 1; row++) {
        if (row < 0 || row >= gBoard.length) continue

        for (var col = j - 1; col <= j + 1; col++) {
            if (col < 0 || col >= gBoard.length) continue
            if (gBoard[row][col].isShown) continue

            gBoard[row][col].isShown = true
            hintCoords.push({ row, col })

            renderBoard(gBoard)
        }
    }
    gElHints.classList.remove('clicked')
    gElTable.classList.remove('clicked')

    setTimeout(() => {

        for (var i = 0; i < hintCoords.length; i++) {
            gBoard[hintCoords[i].row][hintCoords[i].col].isShown = false
        }
        gGame.isHint = false
        gGame.hints--

        updateHints()
        if (gGame.hints === 0) gElHints.classList.add('max-hints')
        renderBoard(gBoard)
    }, 1000);
}

function setMinesNegsCounts(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            board[i][j].minesAroundCount = setMinesNegsCount(board, i, j)
        }
    }
}

// Factory function of setMinesNegsCounts
function setMinesNegsCount(board, i, j) {
    var count = 0

    for (var row = i - 1; row <= i + 1; row++) {
        if (row < 0 || row >= board.length) continue

        for (var col = j - 1; col <= j + 1; col++) {
            if (col < 0 || col >= board.length) continue
            if (row === i && col === j) continue
            if (board[row][col].isMine) count++
        }
    }
    return count
}

function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    if (gGame.isMegaHint) {
        onMegaHint(i, j)
        return
    }
    if (gGame.isManual) {
        plantMine(i, j)
        return
    }
    if (gBoard[i][j].isShown) return
    if (gBoard[i][j].isMarked) return
    if (gGame.isHint) {
        useHint(i, j)
        return
    }
    // Model
    gBoard[i][j].isShown = true
    if (!gBoard[i][j].isMine) gGame.shownCount++

    // Setting mines and Negs count after first click
    if (gGame.isFirstClick) onFirstClick()

    if (gBoard[i][j].isMine) {
        gGame.lives ? removeLife() : gameOver(elCell, i, j)
    } else if (!gBoard[i][j].minesAroundCount) {
        // showing up negs if empty cell with no mine negs
        // showNegs(gBoard, i, j)
        negsRecursion(gBoard, i, j)
    }

    // DOM
    elCell.classList.add('shown')
    renderBoard(gBoard)

    gLastMovesPos.push({ i, j })
    gElLastCells.push(elCell)

    // Show negs function can make some changes on flags
    updateFlags()
    checkWin()
}

function randomizeMines(board, num) {

    for (var i = 0; i < num; i++) {
        var pos = getRandomPos()
        var currCell = board[pos.i][pos.j]
        if (currCell.isMine || currCell.isShown) i--
        else {
            board[pos.i][pos.j].isMine = true
            gGame.minesPos.push({ i: pos.i, j: pos.j })
        }
    }
}


function onRightClick(ev, elCell, i, j) {
    console.log(gBoard[i][j].isMarked);
    if (!gGame.isOn) return
    if (gBoard[i][j].isShown) return
    if (ev.which !== 3) return
    if (!gBoard[i][j].isMarked && (gGame.markedCount >= gLevel.MINES)) return

    if (gGame.isFirstClick) onFirstClick()

    // Model

    gBoard[i][j].isMarked ? gGame.markedCount-- : gGame.markedCount++
    gBoard[i][j].isMarked = gBoard[i][j].isMarked ? false : true
    console.log(gBoard[i][j].isMarked)
    console.log(gGame.markedCount);
    // DOM
    elCell.classList.toggle('marked')
    updateFlags()

    checkWin()
}

function onFirstClick() {
    gGame.isFirstClick = false

    starTimer()
    if (gGame.manualMines > 0 && !gGame.isSevenBoom) randomizeMines(gBoard, gLevel.MINES)
    setMinesNegsCounts(gBoard)
}

function gameOver(elMine, i, j) {
    clearInterval(gGame.timerInterval)

    gGame.isOn = false
    gBoard[i][j].mineClicked = true

    showMines()

    elMine.classList.add('mine-clicked')
    gElRestartBtn.innerHTML = LOSE_IMG

    removeLife()
    document.querySelector('h2 span').innerText = '\nK.O'


    gLoseAudio.play()
}

function checkWin() {
    if ((gLevel.SIZE ** 2 - gGame.markedCount)
        !== gGame.shownCount) return false
    console.log('gGame.shownCount, gGame.markedCount :>> ', gGame.shownCount, gGame.markedCount);

    gElRestartBtn.innerHTML = WIN_IMG
    console.log('You win!');

    gGame.isOn = false
    clearInterval(gGame.timerInterval)
    checkHighScore()

    gApplauseAudio.play()
    gWinAudio.play()
    return true
}

function showMines() {
    // Model
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].isShown = true
                gBoard[i][j].isMarked = false
            }
        }
    }
}

function resetGameStats() {
    clearInterval(gGame.timerInterval)

    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        isFirstClick: true,
        timerInterval: null,
        lives: 2,
        hints: 3,
        isHint: false,
        saveMe: 3,
        isManual: false,
        manualMines: gLevel.MINES,
        isSevenBoom: false,
        megaHint: 1,
        isMegaHint: false,
        megaHintPos: null,
        minesPos: [],

    }


}



function removeLife() {
    // Model
    gGame.lives--
    gGame.markedCount++

    // DOM
    updateLife()
    updateFlags()
}

function checkHighScore() {
    switch (gLevel.SIZE) {
        case 4:
            if (gGame.secsPassed < localStorage.easyBestScore) {
                localStorage.easyBestScore = gGame.secsPassed
                document.querySelector('h1 span').innerText = localStorage.easyBestScore + ' Seconds'
            }
            break
        case 8:
            if (gGame.secsPassed < localStorage.mediumBestScore) {
                localStorage.mediumBestScore = gGame.secsPassed
                document.querySelector('h1 span').innerText = localStorage.mediumBestScore + ' Seconds'
            }
            break
        case 12:
            if (gGame.secsPassed < localStorage.hardBestScore) {
                localStorage.hardBestScore = gGame.secsPassed
                document.querySelector('h1 span').innerText = localStorage.hardBestScore + ' Seconds'
            }
            break
    }
}

function updateHighScore() {
    var time
    switch (gLevel.SIZE) {
        case 4:
            time = localStorage.easyBestScore
            break
        case 8:
            time = localStorage.mediumBestScore
            break
        case 12:
            time = localStorage.hardBestScore
            break
    }
    document.querySelector('h1 span').innerText = time + ' Seconds'
}

function updateLife() {
    document.querySelector('.header h2 span').innerText = EMPTY

    for (var i = 0; i <= gGame.lives; i++) {
        document.querySelector('.header h2 span').innerText += LIFE_IMG
    }
}

function updateFlags() {
    document.querySelector('.header .flags').innerText = gLevel.MINES - gGame.markedCount
}

function updateHints() {
    document.querySelector('.header .hints').innerText = EMPTY
    for (var i = 0; i < gGame.hints; i++) {
        document.querySelector('.header .hints').innerText += HINT_IMG
    }
}

function changeDifficulty(size, mines) {
    gLevel.SIZE = size
    gLevel.MINES = mines
    initGame()
}

function onSevenBoom() {
    initGame()
    var count = 0

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (count) {
                if (count % 7 === 0) gBoard[i][j].isMine = true
            }
            count++
        }
    }
    gGame.isSevenBoom = true
}

function getSafePositions() {
    var coords = []

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                coords.push({ i, j })
            }
        }
    }
    return coords
}

function saveMe() {
    if (!gGame.saveMe) return
    gGame.saveMe--
    updateSaveMe()

    var safeCoords = getSafePositions()
    var safePos = safeCoords[getRandomInt(0, safeCoords.length)]

    var elCell = document.querySelector(`.cell-${safePos.i}-${safePos.j}`)
    elCell.classList.add('saved')

    setTimeout(() => {
        elCell.classList.remove('saved')

    }, 1000);

}

function updateSaveMe() {
    document.querySelector('.header button span').innerText = gGame.saveMe
}

function plantMine(i, j) {
    if (gBoard[i][j].isMine) return
    gBoard[i][j].isMine = true
    gGame.manualMines--
    if (!gGame.manualMines) {
        gGame.isManual = false
        document.querySelector(".manual-mode").classList.remove('manual-mode')
    }
}

function manualMode(elBtn) {
    if (!gGame.isFirstClick) return
    if (gGame.isSevenBoom) return
    if (gGame.manualMines < gLevel.MINES) return
    gGame.isManual = gGame.isManual ? false : true
    elBtn.classList.toggle('manual-mode')
}

function onDarkMode() {
    gIsDarkMode = gIsDarkMode? false : true

    document.body.classList.toggle("dark-theme");

    var elBtns = document.querySelectorAll('button')
    for (var i = 0; i < elBtns.length; i++) {
        elBtns[i].classList.toggle("dark-theme");
    }

    document.querySelector('.header').classList.toggle('dark-theme')
    gElTable.classList.toggle('dark-theme')

    var elTds = document.querySelectorAll('td')

    for (var i = 0; i < elTds.length; i++) {
        elTds[i].classList.toggle("dark-theme");
    }
    renderBoard(gBoard)


}

function megaHint() {
    // TODO
    if (!gGame.megaHint) return
    if (gGame.isFirstClick) return
    gGame.isMegaHint = gGame.isMegaHint ? false : true
    document.querySelector('.mega-hint').classList.toggle('mega-on')


}

function onMegaHint(i, j) {
    if (gGame.megaHint) {
        gGame.megaHintPos = [{ i, j }]
        gGame.megaHint--
    } else {
        gGame.megaHintPos.push({ i, j })
        showSelectedArea(gGame.megaHintPos[0], gGame.megaHintPos[1])
        gGame.isMegaHint = false
    }
}

function showSelectedArea(posA, posB) {
    for (var i = posA.i; i <= posB.i; i++) {
        for (var j = posA.j; j <= posB.j; j++) {
            gBoard[i][j].isShown = true
        }
    }
    renderBoard(gBoard)

    setTimeout(() => {
        for (var i = posA.i; i <= posB.i; i++) {
            for (var j = posA.j; j <= posB.j; j++) {
                gBoard[i][j].isShown = false
            }
        }
        renderBoard(gBoard)
        document.querySelector('.mega-hint').classList.remove('mega-on')
    }, 2000);
}

function onExterminator() {
    if (gGame.isFirstClick) return
    if (gGame.minesPos.length < 3) return
    if (gGame.minesPos.length != gLevel.MINES) return

    // Looping through 3 mines
    for (var i = 0; i < 3; i++) {
        var randNum = getRandomInt(0, gGame.minesPos.length)
        gBoard[gGame.minesPos[randNum].i][gGame.minesPos[randNum].j].isMine = false
        gGame.minesPos.splice(randNum, 1)
    }
    setMinesNegsCounts(gBoard)

    renderBoard(gBoard)
    gExterminatorAudio.play()
}

function undo() {
    if (gGame.isFirstClick) return

    var i = gLastMovesPos[gLastMovesPos.length - 1].i
    var j = gLastMovesPos[gLastMovesPos.length - 1].j
    if (gBoard[i][j].isMine) return

    if (!gBoard[i][j].minesAroundCount) negsRecursion(gBoard, i, j, 'Hide-Negs')

    // Model
    gBoard[i][j].isShown = false
    gGame.shownCount--


    // DOM
    gElLastCells[gElLastCells.length - 1].classList.remove('shown')
    renderBoard(gBoard)

    gLastMovesPos.pop()
    gElLastCells.pop()

    if (!gLastMovesPos.length) gGame.isFirstClick = true
}

function resetDOM() {
    gElRestartBtn.innerHTML = NORMAL_IMG
    updateLife()
    updateFlags()
    updateHints()
    updateHighScore()
    updateSaveMe()
    gElHints.classList.remove('max-hints')
    if (document.querySelector(".manual-mode")) {
        document.querySelector(".manual-mode").classList.remove('manual-mode')
    }
    document.querySelector('.mega-hint').classList.remove('mega-on')
}

function resetTimer() {
    document.querySelector(".seconds").innerHTML = '00'
    document.querySelector(".minutes").innerHTML = '00'
}

function starTimer() {
    gGame.timerInterval = setInterval(() => {
        document.querySelector(".seconds").innerHTML = pad(++gGame.secsPassed % 60)
        document.querySelector(".minutes").innerHTML = pad(parseInt(gGame.secsPassed / 60, 10))
    }, 1000)
}
// padding zeros if value lower than 9
function pad(val) { return val > 9 ? val : "0" + val; }

