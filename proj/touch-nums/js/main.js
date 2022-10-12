'use strict'
var gCells = 25
var gCount = 1
var gInterval = 0
var gFirstClickTS

var gNums = shuffleNums(gCells)
// console.log(gNums);



function initGame() {
    clearInterval(gInterval)
    gInterval = 0

    gCount = 1
    renderTable()
}

function renderTable() {

    var elTable = document.querySelector('.table-body')
    var tableHTML = ''
    var count = 0

    for (var i = 0; i < gCells ** 0.5; i++) {
        tableHTML += '<tr>\n'

        for (var j = 0; j < gCells ** 0.5; j++) {
            tableHTML += `<td onclick="cellClicked(this)"
            >${gNums[count]}</td>\n`
            count++
        }
        tableHTML += '\n</tr>\n'
    }
    elTable.innerHTML = tableHTML
}


function cellClicked(elClickedCell) {
    var cellNum = +elClickedCell.innerText
    if (cellNum === gCount) {
        if (gCount === 1) firstClick()
        elClickedCell.style.backgroundColor = '#70A288'
        if (gCount === gCells) gameOver()
        gCount++
    }

    // Rendering DOM to currNum
    var elCurrNum = document.querySelector('.curr-num')
    var strHTML = `HIT ME!: ${gCount}`
    elCurrNum.innerText = strHTML
}

function firstClick() {
    var elTime = document.querySelector('.time')
    elTime.classList.remove('hide')

    gFirstClickTS = Date.now()
    gInterval = setInterval(() => {
        var currTime = (Date.now() - gFirstClickTS) / 1000
        elTime.innerText = `Time Passed: ${currTime}s`
    }, 100);
}

function gameOver() {
    var elBtn = document.querySelector('.restart-button')
    elBtn.classList.remove('hide')

    var elDiffBtns = document.querySelectorAll('.diff')
    for(var i=0;i<elDiffBtns.length;i++){
        elDiffBtns[i].classList.add('hide')
    }
    clearInterval(gInterval)
    gInterval = 0
}


function restartGame(elBtn) {
    elBtn.classList.add('hide')

    var elDiffBtns = document.querySelectorAll('.diff')
    for(var i=0;i<elDiffBtns.length;i++){
        elDiffBtns[i].classList.remove('hide')
    }

    var elTime = document.querySelector('.time')
    elTime.classList.add('hide')

    initGame()
}


function chooseDifficulty(cellNum) {
    gCells = cellNum
    gNums = shuffleNums(gCells)

    var elTime = document.querySelector('.time')
    elTime.classList.add('hide')

    initGame()
}













function shuffleNums() {
    var nums = getNums(gCells)
    var shuffledNums = []

    for (var i = 0; i < gCells; i++) {
        var randIdx = getRandomInt(0, nums.length)
        var randNum = nums[randIdx]
        shuffledNums.push(randNum)
        nums.splice(randIdx, 1)
    }
    return shuffledNums
}

function getNums(num) {
    // if(num**0.5 ) return check later
    var nums = []

    for (var i = 0; i < num; i++) {
        nums[i] = i + 1
    }
    return nums
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min)
}
