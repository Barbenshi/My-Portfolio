'use strict'
const STORAGE_KEY = 'projsDB'
var gProjs

function createProjs() {
    gProjs = loadFromStorage(STORAGE_KEY)
    if (!gProjs || !gProjs.length) {
        gProjs = []
        gProjs.push(_createProj('Airgnb', 'A replica app for airBnB!', '25-12-2022',null,'https://airgnb.onrender.com'))
        gProjs.push(_createProj('Appsus', 'A replica app for gmail and keep together!', '11-28-2022',null,'https://gilwallach.github.io/appsuss'))
        gProjs.push(_createProj('Meme-Gen', 'Create your own meme and share it with everybody!', '10-31-2022'))
        gProjs.push(_createProj('Ball-Board', 'Collect all those Balls', '10-24-2022'))
        gProjs.push(_createProj('Chess', 'Learn some chess movements', '10-7-2022'))
        gProjs.push(_createProj('Mine-Sweeper', 'The classic windows 10 game modernized', '10-13-2022'))
        gProjs.push(_createProj('Book-Shop', 'Control your book shop', '10-11-2022'))
        gProjs.push(_createProj('Guess-Me', 'Can Ekinator guess your tought?', '10-3-2022'))
        gProjs.push(_createProj('Pacman', 'Pacman year 1995','9-22-2022' ))
        gProjs.push(_createProj('Touch-Nums', 'My first little game :)', '9-22-2022'))
        _saveProjsToStorage()
    }
}

function _createProj(name, title,date, desc = makeLorem(), url) {
    return {
        id: name.toLowerCase(),
        name,
        title,
        publishedAt: new Date(date).getTime(),
        desc,
        url: url || `https://barbenshi.github.io/${name}/`,
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
