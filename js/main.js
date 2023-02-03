'use strict'

$(init)
// {/* <i class="fa fa-plus fa-3x"></i> */}
function init() {
    createProjs()
    renderPortfolio()
    $('#contact-form button').click(onSubmit)
}

function renderPortfolio() {
    const projs = getProjs()
    const strHtmls = projs.map(proj =>
        `
    <div class="col-md-4 col-sm-6 portfolio-item d-flex flex-column">
    <a class="portfolio-link w-100" data-toggle="modal" data-id="${proj.id}" href="#portfolioModal">
      <div class="portfolio-hover w-100">
        <div class="portfolio-hover-content">
        <lottie-player src="https://assets2.lottiefiles.com/packages/lf20_HW7ZtQ.json"  background="transparent"  speed="1" style="height:150px"  loop  autoplay></lottie-player>
        </div>
      </div>
      <img class="img-fluid w-100" src="img/portfolio/${proj.id}.jpg" style="height:260px" alt="">
    </a>
    <div class="portfolio-caption rounded-bottom" style="flex-grow:1; width:100%;">
      <h4>${proj.name}</h4>
      <p class="text-muted">${proj.title}</p>
    </div>
  </div>
    `
    )
    const $elPortItems = $('#port-items')
    $elPortItems.html(strHtmls)

    $('.portfolio-link').click(renderModal)
}

function renderModal() {
    const projId = this.getAttribute('data-id')
    const proj = getProjById(projId)
    const date = new Date(proj.publishedAt)
    console.log(date);
    const strHtml =
        `
<div class="modal-dialog">
<div class="modal-content">
  <div class="close-modal" data-dismiss="modal">
    <div class="lr">
      <div class="rl"></div>
    </div>
  </div>
  <div class="container">
    <div class="row">
      <div class="col-lg-8 mx-auto">
        <div class="modal-body">
          <!-- Project Details Go Here -->
          <h2>${proj.name}</h2>
          <p class="item-intro text-muted">${proj.title}</p>
          <img class="img-fluid d-block mx-auto" src="img/portfolio/${proj.id}.jpg" alt="">
          <p>${proj.desc}</p>
          <a href="${proj.url}">
          <button class="btn mb-1 btn-xl bg-info">Check me out!</button>
          </a>
          <ul class="list-inline">
            <li>Date of creation: ${date.getMonth() + 1}/${date.getFullYear()}</li>
            <li>Client: Threads</li>
            <li>Category: Illustration</li>
          </ul>
          
          <button class="btn btn-primary" data-dismiss="modal" type="button">
            <i class="fa fa-times"></i>
            Close Project</button>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
`
    $('#portfolioModal').html(strHtml)
}

function onSubmit(ev) {
    const $elEmail = $('#email')
    const $elSubject = $('#subject')
    const $elBody = $('#body')

    const email = $elEmail.val().trim()
    const subject = $elSubject.val().trim()
    const body = $elBody.val().trim()
    if (!email || !subject || !body) return

    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=barbenshimol2@gmail.com&su=${subject}&body=${body}`
    window.open(url, '_blank')
    
    $elEmail.val('')
    $elSubject.val('')
    $elBody.val('')
}