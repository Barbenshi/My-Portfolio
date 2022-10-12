function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}


function getEmptyPos(board) {

    var emptyCoords = []
    for (var i = 0; i < ROW_COUNT-1; i++) {
        for (var j = 0; j < COL_COUNT-1; j++) {
            if (!board[i][j].gameElement && board[i][j].type !== WALL) emptyCoords.push({ i, j }) //change names
        }
    }
    return emptyCoords[getRandomInt(0, emptyCoords.length)]
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min)
}


