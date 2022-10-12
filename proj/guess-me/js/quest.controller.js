'use strict'

// NOTE: This is a global used only in the controller
var gLastRes = null

$(document).ready(init)
$('.btn-start').click(onStartGuessing)
$('.btn-yes').click({ans: 'yes'}, onUserResponse)
$('.btn-no').click({ans: 'no'}, onUserResponse)
$('.btn-add-guess').click(onAddGuess)
$('.modal-footer .btn-primary').click(onRestartGame)
$('.modal-footer .btn-secondary').click(()=>$('.modal').hide())

function init() {
  createQuestsTree()
}

function onStartGuessing() {
  $('.game-start').hide()

  renderQuest()
  $('.quest').show()
}

function renderQuest() {
  // its text by the currQuest text
  $('.quest').children('h2').text(getCurrQuest().txt)
}

function onUserResponse(ev) {
  var res = ev.data.ans
  // If this node has no children
  if (isChildless(getCurrQuest())) {
    const $elModal = $('.modal')
    if (res === 'yes') {
      $('.modal h5').text('Victorious')
      $('.modal p').text('I made it correctly anoter time!')
      $elModal.show()
    } else {
      $('.modal h5').text('I lost 😮')
      $('.modal p').text(`I didn't make it this time, maybe you could teach me?`)
      $('.modal .btn-secondary').text(`Help me here`)
      $('.modal').show()
      $('.new-quest').show()
    }
    $('.quest').hide()
    
  } else {
    gLastRes = res

    moveToNextQuest(res)
    renderQuest()
  }
}

function onAddGuess(ev) {
  ev.preventDefault()
  var newGuess = $('#newGuess').val()
  var newQuest = $('#newQuest').val()

  if(!newGuess || !newQuest) return
  addGuess(newQuest, newGuess, gLastRes)

  onRestartGame()
}

function onRestartGame() {
  $('.modal').hide()
  $('.new-quest').hide()
  $('.game-start').show()
  $('.modal').hide()
  gLastRes = null
  init()
}
