'use strict'

const PACMAN = 'ᗤ';
var gPacman;

function createPacman(board) {
    gPacman = {
        location: {
            i: 3,
            j: 5
        },
        isSuper: false,
        direction: 0
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
}

function movePacman(ev) {

    if (!gGame.isOn) return
    // console.log('ev', ev);
    const nextLocation = getNextLocation(ev)

    if (!nextLocation) return
    // console.log('nextLocation', nextLocation)

    var nextCell = gBoard[nextLocation.i][nextLocation.j]
    // console.log('NEXT CELL', nextCell)
    console.log(gPacman.isSuper);
    if (nextCell === WALL) return
    if (nextCell === FOOD) updateScore(1)
    if (nextCell === CHERRY) updateScore(10)
    if (nextCell === SUPER_FOOD) {
        if (gPacman.isSuper) return
        gPacman.isSuper = true
        onSuperMode()
    }
    if (nextCell === GHOST) {
        if (gPacman.isSuper) {
            const ghostIdx = getGhostIdx(nextLocation)
            if (gGhosts[ghostIdx].currCellContent === FOOD) gGame.score++
            gDeadGhosts.push(gGhosts.splice(ghostIdx, 1)[0])

        } else {
            gameOver()
            renderCell(gPacman.location, EMPTY)
            return
        }
    }

        // update the model
        gBoard[gPacman.location.i][gPacman.location.j] = EMPTY

        // update the DOM
        renderCell(gPacman.location, EMPTY)

        // update the model
        gPacman.location = nextLocation
        gBoard[gPacman.location.i][gPacman.location.j] = PACMAN

        // update the DOM
        renderCell(gPacman.location, getPacmanHTML())
        console.log(getPacmanHTML());
    }

    function getNextLocation(eventKeyboard) {

        var nextLocation = {
            i: gPacman.location.i,
            j: gPacman.location.j
        }


        switch (eventKeyboard.code) {
            case 'ArrowUp':
                nextLocation.i--;
                gPacman.direction = 90
                break;
            case 'ArrowDown':
                nextLocation.i++;
                gPacman.direction = 270
                break;
            case 'ArrowLeft':
                nextLocation.j--;
                gPacman.direction = 0
                break;
            case 'ArrowRight':
                nextLocation.j++;
                gPacman.direction = 180
                break;
            default:
                return null;
        }

        return nextLocation;
    }



    function getPacmanHTML() {
        return `<span style="color:yellow ;transform:rotate(${gPacman.direction}deg); position:absolute;" >${PACMAN}</span>`
    }
