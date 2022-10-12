'use strict'

const STORAGE_KEY = 'questsTreeDB'

var gQuestsTree
var gCurrQuest
var gPrevQuest = null

function createQuestsTree() {
  // Loading quests tree from storage if exists
  gQuestsTree = loadFromStorage(STORAGE_KEY)

  // Building new Quests tree if doesn't exist
  if(!gQuestsTree){
    gQuestsTree = createQuest('Male?')
    gQuestsTree.yes = createQuest('Gandhi')
    gQuestsTree.no = createQuest('Rita')
  }

    gCurrQuest = gQuestsTree
    gPrevQuest = null
}

function createQuest(txt) {
  return {
    txt: txt,
    yes: null,
    no: null,
  }
}

function isChildless(node) {
  return node.yes === null && node.no === null
}

function moveToNextQuest(res) {
  gPrevQuest = gCurrQuest
  gCurrQuest = gPrevQuest[res]
}

function addGuess(newQuestTxt, newGuessTxt, lastRes) {
  const newQuest = createQuest(newQuestTxt)
  newQuest.no = gPrevQuest[lastRes]
  newQuest.yes = createQuest(newGuessTxt)

  gPrevQuest[lastRes] = newQuest

  saveToStorage(STORAGE_KEY, gQuestsTree)
}

function getCurrQuest() {
  return gCurrQuest
}
