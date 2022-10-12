'use strict'

function renderBoard(mat, selector) {

    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            const className = 'cell cell-' + i + '-' + j
            strHTML += `<td class="${className}">${cell}</td>`

        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    
    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
    
    
    // rendering colored ghosts to DOM
renderGhosts()

}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomColor() {
    return Math.floor(Math.random() * 16777215).toString(16);
}

function getGhostIdx(location){
    for(var i=0;i<gGhosts.length;i++){
        const ghost = gGhosts[i]
        if(ghost.location.i === location.i &&
             ghost.location.j === location.j) return i
    }
    return null
}

function renderGhosts(){
    for(var i = 0; i<gGhosts.length;i++){
        const ghost = gGhosts[i]
        renderCell(ghost.location, getGhostHTML(ghost))
    }
}

function getEmptyPos(board) {

    var emptyCoords = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j] === EMPTY) emptyCoords.push({ i, j }) 
        }
    }
    return emptyCoords[getRandomIntInclusive(0, emptyCoords.length-1)]
}

