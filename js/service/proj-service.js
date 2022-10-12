'use strict'
const STORAGE_KEY = 'projsDB'
var gProjs

function createProjs() {
    gProjs = loadFromStorage(STORAGE_KEY)
    if(!gProjs || !gProjs.length){
        gProjs = []
        gProjs.push(_createProj('Ball-Board'))
        gProjs.push(_createProj('Chess'))
        gProjs.push(_createProj('Mine-Sweeper'))
        _saveProjsToStorage()
    }
}

function _createProj(name) {
    return {
        id: name.toLowerCase(),
        name,
        title: "Better push those boxes",
        desc: "lorem ipsum lorem ipsum lorem ipsum",
        url: `proj/${name.toLowerCase()}/index.html`,
        publishedAt: 1448693940000,
        labels: ["Matrixes", "keyboard events"],
    }
}

function getProjs() {
    return gProjs
}

function getProjById(projId) {
    return gProjs.find(proj => proj.id === projId)
}

function _saveProjsToStorage() {
    saveToStorage(STORAGE_KEY, gProjs)
}
