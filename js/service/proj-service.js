'use strict'

var gProjs

function createProjs() {
    gProjs = []
    gProjs.push(_createProj('Ball-Board'))
    gProjs.push(_createProj('Chess'))
    gProjs.push(_createProj('Mine-Sweeper'))
}

function _createProj(name) {
    return {
        id: name.toLowerCase(),
        name,
        title: "Better push those boxes",
        desc: "lorem ipsum lorem ipsum lorem ipsum",
        url: `proj/${name.toLowerCase()}/index.html`,
        publishedAt: new Date(1448693940000),
        labels: ["Matrixes", "keyboard events"],
    }
}

function getProjs() {
    return gProjs
}

function getProjById(projId) {
    return gProjs.find(proj => proj.id === projId)
}