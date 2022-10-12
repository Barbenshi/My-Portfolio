'use strict'

function onInit() {
    createBooks()
    renderFilterByQueryStringParams()
    renderBooks()
    renderPagingButtons()

    const bookId = loadFromStorage('modalDB')
    if (bookId) onReadBook(bookId)

}

function renderBooks() {
    const books = getBooksForDisplay()
    var strHtmls
    var favLayout = loadFromStorage('favLayout')
    // loadFromStorage('favLayout')
    if (!favLayout || favLayout === 'table') {
        strHtmls = books.map(book =>
            `
            <tr>
            <td>${book.id}</td>
            <td>${book.name}</td>
            <td>$${book.price}</td>
            <td><button class="read" onclick="onReadBook(${book.id})">Read</button></td>
            <td><button class="update" onclick="onUpdateBook(${book.id})">Update</button></td>
            <td><button class="remove" onclick="onRemoveBook(${book.id})">X</button></td>
            </tr>
            `
        )
        document.querySelector('.books-container').classList.remove('hide')
        document.querySelector('.books-cards-container').classList.add('hide')
        document.querySelector('.books-container tbody').innerHTML = strHtmls.join('')
    } else {
        strHtmls = books.map(book =>
            `
            <div class="book">
                <div class="description">${book.name}, $${book.price}</div>
                <img src="img/book-pictures/${book.image}.jfif" alt="book img"/>
                <div class="book-actions"><button class="read" onclick="onReadBook(${book.id})">Read</button>
                <button class="update" onclick="onUpdateBook(${book.id})">Update</button>
                <button class="remove" onclick="onRemoveBook(${book.id})">X</button> </div>
            </div>

            `
        )
        document.querySelector('.books-container').classList.add('hide')
        document.querySelector('.books-cards-container').classList.remove('hide')
        document.querySelector('.books-cards-container').innerHTML = strHtmls.join('')
    }

}

function renderModalForBook(bookId) {
    const book = getBookById(bookId)
    const strHtml =
        `
        <button class="close-btn" onclick="onCloseModal()">X</button>
        <h4>${book.name}</h4>
        <h5>Price: $<span>${book.price}</span></h5>
        <div class="rating">
            Rating:&nbsp 
            <button ${book.rating <= 0 ? 'disabled' : 'enabled'} onclick="onUpdateRating(${book.id},-1)">➖</button>
            <h6> <span>${book.rating}</span></h6>
            <button ${book.rating >= 10 ? 'disabled' : 'enabled'} onclick="onUpdateRating(${book.id},1)">➕</button>
        </div>
        <p>${book.details}</p>
        `
    document.querySelector('.details-modal').innerHTML = strHtml

}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = queryStringParams.get('text') || ''

    if (!filterBy) return

    document.querySelector('.filter input').value = filterBy
    setFilter('text', filterBy)
}

function renderModalForNewBook() {
    const strHtml = `
    <button class="close-btn" onclick="onCloseModal()">X</button>
    <form onsubmit="onAddBook(event)">
    <label for="book-name">Book-Name</label>
        <input name="book-name" placeholder="Lord of the rings for example..." type="text"/>
        <br/>
        <label for="price">Price (in dollars)</label>
        <input name="price" min="1" placeholder="25 for exmaple..." type="number"/>
        <br/>
        <button>Add Book</button>
        </form>
    `
    document.querySelector('.details-modal').innerHTML = strHtml
}

function onLayout(str) {
    setLayout(str)
    renderBooks()
}

function onAddBookModal() {
    renderModalForNewBook()
    toggleModal()
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    flashMsg('removed')
    renderBooks()
    renderPagingButtons()
}

function onAddBook(ev) {
    ev.preventDefault()
    const elBookName = document.querySelector('[name=book-name]')
    const name = elBookName.value

    const elBookPrice = document.querySelector('[name=price]')
    const price = elBookPrice.value

    // const name = prompt('Enter the book name')
    // const price = +prompt('Enter the book price')
    if (!name || !price) return
    if (isBookExist(name)) {
        console.log('Book already exist... Try updating book instead');
        return
    }

    addBook(name, price)
    renderBooks()
    renderPagingButtons()
    onCloseModal()
    flashMsg('added')
}

function onUpdateBook(bookId) {
    const price = +prompt('Enter the book new price')
    if (!price) return

    updateBook(bookId, price)
    flashMsg('price updated')
    renderBooks()
}

function onReadBook(bookId) {
    saveToStorage('modalDB', bookId)
    renderModalForBook(bookId)
    openModal()
}

function toggleModal() {
    document.querySelector('.details-modal').classList.toggle('open')
}

function openModal() {
    document.querySelector('.details-modal').classList.add('open')
}

function onCloseModal() {
    saveToStorage('modalDB', '')
    document.querySelector('.details-modal').classList.remove('open')
}

function onUpdateRating(bookId, strNum) {
    updateRating(bookId, strNum)
    renderModalForBook(bookId)
    renderBooks()
}

function onSetSort(sorter) {
    console.log(sorter);
    setSort(sorter)
    renderBooks()
}

function onSetFilter(filter, value) {
    setFilter(filter, value)
    renderBooks()
    renderUrl(filter, value)
}

function renderUrl(filter, value) {
    const queryStringParams = `?${filter}=${value}}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function onUpdatePage(num) {
    updatePage(num)
    renderBooks()
    renderPagingButtons()
}

function renderPagingButtons() {
    var firstPage = getPageNumber()
    var secondPage = getPageNumber() + 1
    var thirdPage = getPageNumber() + 2
    
        if (isLastPage(getPageNumber())) {
            firstPage = getPageNumber() - 1
            secondPage = getPageNumber()
            thirdPage = getPageNumber() + 1
        }
    
    if (isLastPage(getPageNumber() - 1)) {
        firstPage = getPageNumber() - 2
        secondPage = getPageNumber() - 1
        thirdPage = getPageNumber()
    }

    var strHtml = `
    <button ${isFirstPage() ? 'disabled' : 'enabled'} onclick="onUpdatePage(-1)" class="prev">&lt</button>
        <button ${getPageNumber() === firstPage? 'disabled' : 'enabled'}
         onclick="onChangePage(${firstPage},this)" >${firstPage}</button>

        <button ${getPageNumber() === secondPage? 'disabled' : 'enabled'}
         onclick="onChangePage(${secondPage},this)" >${secondPage}</button>

        <button ${getPageNumber() === thirdPage? 'disabled' : 'enabled'}
         onclick="onChangePage(${thirdPage},this)" >${thirdPage}</button>
    <button ${isLastPage() ? 'disabled' : 'enabled'} onclick="onUpdatePage(1)" class="next">&gt</button>`

    document.querySelector('.paging-buttons').innerHTML = strHtml

    // const strHtml = `
    // <button ${isFirstPage() ? 'disabled' : 'enabled'} onclick="onUpdatePage(-1)" class="prev">Previous page</button>
    // <button ${isLastPage() ? 'disabled' : 'enabled'} onclick="onUpdatePage(1)" class="next">Next Page</button>
    // `
    // document.querySelector('.paging-buttons').innerHTML = strHtml

}

function onChangePage(num,elBtn){
    changePage(num)
    renderBooks()
    renderPagingButtons()
    elBtn.style.backgroundColor = 'blue'
}

function flashMsg(str){
    var elFlashModal = document.querySelector('.flash-modal')
    
    document.querySelector('.flash-modal span').innerText = str
    elFlashModal.classList.remove('hide')
    setTimeout(() => {
        elFlashModal.classList.add('hide')
    }, 3000);
    
}