'use strict'
const STORAGE_KEY = 'booksDB'
const PAGE_SIZE = 5

var gPageIdx = 0
var gId = 0
var gSortOrder

var gBooks
var gFilterBy = {
    text: '',
}
var gSortBy = {
    name: '',
    price: '',
    rating: '',
}

function getBooksForDisplay() {
    var books = gBooks

    // Filter by text:
    if (gFilterBy.text) books = books.filter(book => book.name.toLowerCase().includes(gFilterBy.text.toLowerCase()))

    // Sorting by price and rating:
    if (gSortBy) {
        if (gSortBy.price) books.sort((book1, book2) => (book1.price - book2.price) * gSortOrder)
        if (gSortBy.rating) books.sort((book1, book2) => (book1.rating - book2.rating) * gSortOrder)
        if (gSortBy.name) books.sort((book1, book2) => book1.name.localeCompare(book2.name) * gSortOrder)
    }

    // Paging:
    const startIdx = gPageIdx * PAGE_SIZE
    books = books.slice(startIdx, startIdx + PAGE_SIZE)
    return books
}

function createBooks() {
    var books = loadFromStorage(STORAGE_KEY)
    _updateGId()
    // Nothing in storage - generate demo data
    if (!books || !books.length) {
        books = []
        for (let i = 0; i < 21; i++) {
            books.push(_createBook())
        }
    }

    gBooks = books
    _saveBooksToStorage()
}

function _updateGId() {
    gId = loadFromStorage('idDB')
}

function _createBook(name = makeLorem(2), price = getRandomIntInclusive(10, 20), image = getRandomIntInclusive(1, 15)) {
    gId++
    saveToStorage('idDB', gId)
    return { id: gId, name, price, details: makeLorem(), rating: 0, image }
}

function addBook(name, price) {
    const book = _createBook(name, price)
    // gBooks.unshift(book)
    gBooks.push(book)

    _saveBooksToStorage()
    return book
}

function isBookExist(name) {
    return gBooks.find(book => book.name === name)
}


function removeBook(bookId) {
    const bookIdx = gBooks.findIndex((book) => book.id === bookId)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function updateBook(bookId, newPrice) {
    const book = getBookById(bookId)
    book.price = newPrice
    _saveBooksToStorage
}

function getBookById(bookId) {
    return gBooks.find(book => book.id === bookId)
}

function updateRating(bookId, strNum) {
    const book = getBookById(bookId)
    book.rating += +strNum
    _saveBooksToStorage
}

function setFilter(filter, value) {
    gFilterBy[filter] = value
}

function setSort(sorter) {
    console.log(sorter);
    var key = Object.keys(sorter)[0]

    // Creating descending order for sort
    if (sorter[key].includes('descending')) {
        var newKey = key.substring(11)
        gSortOrder = -1
        gSortBy[newKey] = sorter[key]
    } else {
        gSortOrder = 1
        gSortBy[key] = sorter[key]
    }

}

function isFirstPage() {
    return gPageIdx === 0
}

function isLastPage(num = gPageIdx) {
    return (num + 1) * PAGE_SIZE >= gBooks.length
}

function updatePage(num) {
    gPageIdx += num
}

function changePage(num) {
    gPageIdx = num - 1
}

function getPageNumber() {
    return gPageIdx + 1
}

function setLayout(str) {
    saveToStorage('favLayout', str)
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

