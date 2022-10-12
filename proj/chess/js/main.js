'use strict'

// Pieces Types
const PAWN_BLACK = '♟'
const ROOK_BLACK = '♜'
const KNIGHT_BLACK = '♞'
const BISHOP_BLACK = '♝'
const QUEEN_BLACK = '♛'
const KING_BLACK = '♚'

const PAWN_WHITE = '♙'
const ROOK_WHITE = '♖'
const KNIGHT_WHITE = '♘'
const BISHOP_WHITE = '♗'
const QUEEN_WHITE = '♕'
const KING_WHITE = '♔'


var gGameElements = {
    pawn: [PAWN_BLACK, PAWN_WHITE],
    rook: [ROOK_BLACK, ROOK_WHITE],
    knight: [KNIGHT_BLACK, KNIGHT_WHITE],
    bishop: [KNIGHT_BLACK, KNIGHT_WHITE],
    queen: [QUEEN_BLACK, QUEEN_WHITE],
    king: [KING_BLACK, KING_WHITE]
}


// The Chess Board
var gBoard
var gSelectedElCell = null
var gIsBlackTurn = true

function initGame() {
    gBoard = buildBoard()
    console.log(gBoard);
    renderBoard(gBoard)
}

function buildBoard() {
    var board = []

    // TODO: build the board 8 * 8
    for (var i = 0; i < 8; i++) {
        board[i] = []
        for (var j = 0; j < 8; j++) {
            board[i][j] = ''
            if (i === 1) {
                board[i][j] = gGameElements.pawn[0]
            }
            if (i === 6) {
                board[i][j] = gGameElements.pawn[1]
            }
        }
    }
    board[0][0] = board[0][7] = gGameElements.rook[0]
    board[0][1] = board[0][6] = gGameElements.knight[0]
    board[0][2] = board[0][5] = gGameElements.bishop[0]
    board[0][3] = gGameElements.queen[0]
    board[0][4] = gGameElements.king[0]

    board[7][0] = board[7][7] = gGameElements.rook[1]
    board[7][1] = board[7][6] = gGameElements.knight[1]
    board[7][2] = board[7][5] = gGameElements.bishop[1]
    board[7][3] = gGameElements.queen[1]
    board[7][4] = gGameElements.king[1]


    console.table(board)
    return board
}

function renderBoard(board) {
    var strHtml = ''

    for (var i = 0; i < board.length; i++) {
        var row = board[i]
        strHtml += '<tr>\n'
        for (var j = 0; j < row.length; j++) {
            var cell = row[j]
            // TODO: figure class name
            var className = (i + j) % 2 ? 'black' : 'white'
            var tdId = `cell-${i}-${j}`
            strHtml += `\t<td id="${tdId}" onclick="cellClicked(this)" class="${className}">${cell}</td>\n`
        }
        strHtml += '</tr>\n'
    }
    // console.log(strHtml);
    var elMat = document.querySelector('.game-board')
    elMat.innerHTML = strHtml
}

function cellClicked(elCell) {

    // TODO: if the target is marked - move the piece!
    if (elCell.classList.contains('mark')) {
        movePiece(gSelectedElCell, elCell)
        cleanBoard()
        return
    }
    cleanBoard()

    elCell.classList.add('selected')
    gSelectedElCell = elCell

    var cellCoord = getCellCoord(elCell.id)
    var piece = gBoard[cellCoord.i][cellCoord.j]
    var possibleCoords = []

    switch (piece) {
        case ROOK_BLACK:
        case ROOK_WHITE:
            possibleCoords = getAllPossibleCoordsRook(cellCoord)
            break
        case BISHOP_BLACK:
        case BISHOP_WHITE:
            possibleCoords = getAllPossibleCoordsBishop(cellCoord)
            break
        case KNIGHT_BLACK:
        case KNIGHT_WHITE:
            possibleCoords = getAllPossibleCoordsKnight(cellCoord)
            break
        case PAWN_BLACK:
        case PAWN_WHITE:
            possibleCoords = getAllPossibleCoordsPawn(cellCoord, piece === PAWN_WHITE)
            break
        case KING_WHITE:
        case KING_BLACK:
            possibleCoords = getAllPossibleCoordsKing(cellCoord)
            break
        case QUEEN_BLACK:
        case QUEEN_WHITE:
            possibleCoords = getAllPossibleCoordsQueen(cellCoord)
            break

    }
    console.log('possibleCoords: ', possibleCoords)
    markCells(possibleCoords)
}

function movePiece(elFromCell, elToCell) {
    // TODO: use: getCellCoord to get the coords, move the piece
    // update the MODEl, update the DOM

    // Update the model:
    var coord = getCellCoord(elFromCell.id)
    var piece = gBoard[coord.i][coord.j]

    gBoard[coord.i][coord.j] = ''

    // Update the DOM:
    elFromCell.innerText = ''


    // Update the model:
    coord = getCellCoord(elToCell.id)
    gBoard[coord.i][coord.j] = piece

    // Update the DOM:
    elToCell.innerText = piece

}

function markCells(coords) {
    // TODO: query select them one by one and add mark 
    for (var i = 0; i < coords.length; i++) {
        var selector = getSelector(coords[i])
        var elCell = document.querySelector(selector)
        elCell.classList.add('mark')
    }
}

// Gets a string such as:  'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
    var coord = {}
    var parts = strCellId.split('-')

    coord.i = +parts[1]
    coord.j = +parts[2]
    return coord;
}

function cleanBoard() {
    var elTds = document.querySelectorAll('.mark, .selected')

    for (var i = 0; i < elTds.length; i++) {
        elTds[i].classList.remove('mark', 'selected')
    }
}

function getSelector(coord) {
    return `#cell-${coord.i}-${coord.j}`
}

function isEmptyCell(coord) {
    return (gBoard[coord.i][coord.j] === '')
}

function getAllPossibleCoordsPawn(pieceCoord, isWhite) {
    var res = []

    var diff = isWhite ? -1 : 1
    var nextCoord = { i: pieceCoord.i + diff, j: pieceCoord.j }

    if (!isEmptyCell(nextCoord)) return res
    res.push(nextCoord)

    if (pieceCoord.i === 1 && !isWhite || pieceCoord.i === 6 && isWhite) {
        nextCoord = { i: pieceCoord.i + diff * 2, j: pieceCoord.j }
        if (!isEmptyCell(nextCoord)) return res
        res.push(nextCoord)
    }
    return res
}

function getAllPossibleCoordsRook(pieceCoord) {
    var res = []

    for (var k = 1; k <= 7; k++) {

        var nextCoord = { i: pieceCoord.i + k, j: pieceCoord.j }
        if (pieceCoord.i + k >= 0 && pieceCoord.i + k < gBoard.length) {
            if (!isEmptyCell(nextCoord)) break
            res.push(nextCoord)
        }
    }
    console.log(res);
    for (var k = 1; k <= 7; k++) {

        if (pieceCoord.i - k >= 0 && pieceCoord.i - k < gBoard.length) {
            nextCoord = { i: pieceCoord.i - k, j: pieceCoord.j }
            if (!isEmptyCell(nextCoord)) break
            res.push(nextCoord)
        }
        console.log(res);
    }

    for (var k = 1; k <= 7; k++) {

        if (pieceCoord.j + k >= 0 && pieceCoord.j + k < gBoard.length) {
            nextCoord = { i: pieceCoord.i, j: pieceCoord.j + k }
            if (!isEmptyCell(nextCoord)) break
            res.push(nextCoord)
        }
        console.log(res);
    }

    for (var k = 1; k <= 7; k++) {

        if (pieceCoord.j - k >= 0 && pieceCoord.j - k < gBoard.length) {
            nextCoord = { i: pieceCoord.i, j: pieceCoord.j - k }
            if (!isEmptyCell(nextCoord)) break
            res.push(nextCoord)
        }
    }


    console.log(res);
    return res
}

function getAllPossibleCoordsBishop(pieceCoord) {
    var res = []
    let i = pieceCoord.i - 1
    for (var idx = pieceCoord.j + 1; i >= 0 && idx < 8; idx++) {
        const coord = { i: i--, j: idx }
        if (!isEmptyCell(coord)) break
        res.push(coord)
    }

    i = pieceCoord.i + 1
    for (var idx = pieceCoord.j + 1; i < 8 && idx < 8; idx++) {
        const coord = { i: i++, j: idx }
        if (!isEmptyCell(coord)) break
        res.push(coord)
    }

    let j = pieceCoord.j - 1
    for (var idx = pieceCoord.i + 1; j >= 0 && idx < 8; idx++) {
        const coord = { i: idx, j: j-- }
        if (!isEmptyCell(coord)) break
        res.push(coord)
    }

    j = pieceCoord.j - 1
    for (var idx = pieceCoord.i - 1; j >= 0 && idx >= 0; idx--) {
        const coord = { i: idx, j: j-- }
        if (!isEmptyCell(coord)) break
        res.push(coord)
    }


    // TODO: handle The 3 other directions of the Bishop
    return res
}

function getAllPossibleCoordsKing(pieceCoord) {
    var res = []

    for (var i = pieceCoord.i - 1; i <= pieceCoord.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = pieceCoord.j - 1; j <= pieceCoord.j + 1; j++) {
            if (i === pieceCoord.i && j === pieceCoord.j) continue

            var currCoord = { i, j }
            if (isEmptyCell(currCoord)) res.push(currCoord)
        }
    }

    return res
}

function getAllPossibleCoordsQueen(pieceCoord) {
    var res = []
    var rookCoords = getAllPossibleCoordsRook(pieceCoord)
    var bishopCoords = getAllPossibleCoordsBishop(pieceCoord)

    res = rookCoords.concat(bishopCoords)
    return res
}

function getAllPossibleCoordsKnight(pieceCoord) {
    var res = []

    if (pieceCoord.j - 1 >= 0) {
        if (pieceCoord.i - 2 >= 0) {
            var currPos = { i: pieceCoord.i - 2, j: pieceCoord.j - 1 }
            if (isEmptyCell(currPos)) res.push(currPos)
        } if (pieceCoord.i + 2 < gBoard.length) {
            currPos = { i: pieceCoord.i + 2, j: pieceCoord.j - 1 }
            if (isEmptyCell(currPos)) res.push(currPos)
        }
    }

    if (pieceCoord.j + 1 < gBoard.length) {
        if (pieceCoord.i - 2 >= 0) {
            var currPos = { i: pieceCoord.i - 2, j: pieceCoord.j + 1 }
            if (isEmptyCell(currPos)) res.push(currPos)
        } if (pieceCoord.i + 2 < gBoard.length) {
            currPos = { i: pieceCoord.i + 2, j: pieceCoord.j + 1 }
            if (isEmptyCell(currPos)) res.push(currPos)
        }
    }

    if (pieceCoord.i - 1 >= 0) {
        if (pieceCoord.j - 2 >= 0) {
            var currPos = { i: pieceCoord.i - 1, j: pieceCoord.j - 2 }
            if (isEmptyCell(currPos)) res.push(currPos)
        } if (pieceCoord.i + 2 < gBoard.length) {
            currPos = { i: pieceCoord.i - 1, j: pieceCoord.j + 2 }
            if (isEmptyCell(currPos)) res.push(currPos)
        }
    }

    if (pieceCoord.i + 1 < gBoard.length) {
        if (pieceCoord.j - 2 >= 0) {
            var currPos = { i: pieceCoord.i + 1, j: pieceCoord.j - 2 }
            if (isEmptyCell(currPos)) res.push(currPos)
        } if (pieceCoord.i + 2 < gBoard.length) {
            currPos = { i: pieceCoord.i + 1, j: pieceCoord.j + 2 }
            if (isEmptyCell(currPos)) res.push(currPos)
        }
    }

    return res
}


function restartGame() {
    initGame()
}