'use strict'

$(init)

function init() {
    console.log('Starting up');
    createProjs()
    renderPortfolio()
}

function renderPortfolio() {
    const projs = getProjs()
    const strHtmls = projs.map(proj =>
        `
    <div class="col-md-4 col-sm-6 portfolio-item" >
    <a class="portfolio-link" data-toggle="modal" data-id="${proj.id}" href="#portfolioModal">
      <div class="portfolio-hover">
        <div class="portfolio-hover-content">
          <i class="fa fa-plus fa-3x"></i>
        </div>
      </div>
      <img class="img-fluid" src="img/portfolio/${proj.id}.jpg" alt="">
    </a>
    <div class="portfolio-caption">
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
          <img class="img-fluid d-block mx-auto" src="img/portfolio/01-full.jpg" alt="">
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
