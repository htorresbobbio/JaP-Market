let articles = [];

// Elements used in multiple functions
const cartContainer = document.querySelector("#cart-container")
const cartSubtotalID = document.querySelector("#cart-subtotal")
const shippingCostID = document.querySelector("#shipping-cost")
const cartTotalID = document.getElementById("cart-total")

function removeArticle(index) {
  articles.splice(index, 1)
  showCartContent(articles)
}

function showCartContent(array) {
  cartContainer.innerHTML = ''

  // If the array is empty show special message if not show cart content
  document.getElementById("cart-articles-qty").innerHTML = array.length
  if (array.length <= 0) {
    cartContainer.innerHTML = `
    <div class="row mt-5 mx-5 mb-4 px-3 text-center">
      <div class="col">
        <h4>Tu carrito está vacío</h4>
        <p>Ve todos los <a href="products.html">productos</a> que tenemos disponibles!</p>
      </div>
    </div>
    `
    document.querySelector("#totals-container").style.display = "none"
    document.querySelector("#shipping-details-container").style.display = "none"
  } else {
    // Convert all costs to UYU
    array.forEach((article, index) => {
      let costUYU = article.unitCost;
      if (article.currency == "USD") {
        costUYU = article.unitCost * 40;
      }

      cartContainer.innerHTML += `
                  <div class="row mb-4 align-items-center">
                    <div class="col-md-5 col-lg-3 col-xl-3">
                      <img class="img-fluid w-100"
                        src="img/products/${article.src.slice(4)}" alt="Sample">
                    </div>
                    <div class="col-md-7 col-lg-9 col-xl-9">
                      <div class="row mb-3 mt-3">
                        <div class="col-md-8 col-7">
                          <h5 class="mb-0">${article.name}</h5>
                        </div>
                        <div class="col-md-4 col-5">
                          <div class="input-group mb-0">
                            <div class="input-group-prepend">
                              <a
                                onclick="document.getElementById('article-qty${index}').stepDown(); 
                                updateArticleTotal(${index})"
                                class="btn btn-primary text-white"><i class="fas fa-minus"></i>
                              </a>
                            </div>
                            <input class="form-control text-center" id="article-qty${index}" min="1" value="${article.count}" oninput="updateArticleTotal(${index})" type="number">
                            <div class="input-group-append">
                              <a 
                                onclick="document.getElementById('article-qty${index}').stepUp(); 
                                updateArticleTotal(${index})"
                                class="btn btn-primary text-white"><i class="fas fa-plus"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row mb-3">
                        <div class="col-md-8 col-7">
                          <a onclick="removeArticle(${index})" type="button" class="small text-uppercase mr-3"><i
                              class="fas fa-trash-alt mr-1"></i> Eliminar</a>
                        </div>
                        <div class="col-md-4 col-5 text-center">
                          <p class="mb-0">Unidad <strong>$<span id="article-cost${index}">${costUYU}</strong></p>
                          <p class="mb-0">Subtotal <strong>$<span class="article-total" id="article-total${index}"></span></strong></p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr>
      `
      updateArticleTotal(index)
    })
  }
}

function updateArticleTotal(index) {
  const articleCostID = document.getElementById(`article-cost${index}`)
  const articleQtyID = document.getElementById(`article-qty${index}`)
  const articleTotalID = document.getElementById(`article-total${index}`)
  let cartSubtotalAcc = 0

  articleTotalID.innerHTML = parseInt(articleCostID.innerHTML) * parseInt(articleQtyID.value)

  for (articleTotal of document.getElementsByClassName("article-total")) {
    cartSubtotalAcc += parseInt(articleTotal.innerHTML)
  }
  cartSubtotalID.innerHTML = cartSubtotalAcc
  updateShippingCost()
}

function updateShippingCost() {
  const shippingType = document.querySelector(".shipping-type:checked").value
  switch (shippingType) {
    case "premium":
      shippingCostID.innerHTML = parseInt(parseInt(cartSubtotalID.innerHTML) * 0.15)
      break
    case "express":
      shippingCostID.innerHTML = parseInt(parseInt(cartSubtotalID.innerHTML) * 0.07)
      break
    case "standard":
      shippingCostID.innerHTML = parseInt(parseInt(cartSubtotalID.innerHTML) * 0.05)
      break
  }
  // Update cart total values
  cartTotalID.innerHTML = parseInt(shippingCostID.innerHTML) + parseInt(cartSubtotalID.innerHTML)
}

function showCCData() {
  const HTMLContainer = document.querySelector("#paymentOptionContent")
  HTMLContainer.innerHTML = `
  <div class="form-group">
    <label for="CCNumber">Número de tarjeta (entre 13 y 19 dígitos)</label>
    <input type="tel" id="CCNumber" class="form-control" pattern="[0-9]{13,16}" placeholder='xxxx-xxxx-xxxx-xxxx' required>
  </div>
  <div class="form-group">
    <label for="CCPaymentsQty">Cantidad de cuotas</label>
    <select class="form-control" id="CCPaymentsQty" required>
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>6</option>
      <option>12</option>
    </select>
  </div>
  `
}

function showTransferData() {
  const HTMLContainer = document.querySelector("#paymentOptionContent")
  HTMLContainer.innerHTML = `
  <div class="form-group">
    <label for="TransferBank">Banco</label>
    <select class="form-control" id="TransferBank" required>
      <option>BROU</option>
      <option>Itau</option>
      <option>BBVA</option>
      <option>Santander</option>
    </select>
  </div>
  <div class="form-group">
    <label for="AccountNumber">Número de cuenta</label>
    <input type="tel" id="AccountNumber" class="form-control" required>
  </div>
  `
}

// Validar los datos de pago seleccionados y hacer POST al servidor con la información para el log
function validatePaymentForm() {
  paymentForm = document.querySelector("#paymentForm")
  paymentForm.addEventListener('submit', (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (paymentForm.checkValidity()) {
      cartData = {
        articles: articles,
        subtotal: cartSubtotalID.innerHTML,
        shippingType: document.querySelector(".shipping-type:checked").value,
        shippingCost: shippingCostID.innerHTML,
        totalCost: cartTotalID.innerHTML
      }
      postJSONData(BUY, cartData).then(resultObj => {
        if (resultObj.status === "ok") {
          document.querySelector('#shipping-form').style.display = "none"
          document.querySelector('#buy-response-msg').innerHTML = resultObj.data.msg
          document.querySelector('#successAlertContainer').classList.remove('d-none')
          $('#paymentModal').modal('hide')
        }
      })
    }
  })
}

document.getElementById("shipping-form").addEventListener('submit', function (e) {
  e.preventDefault()
  e.stopPropagation()
  if (this.checkValidity()) {
    $('#paymentModal').modal('show')
    validatePaymentForm()
  }
  this.classList.add('was-validated')
})

document.addEventListener("DOMContentLoaded", () => {
  getJSONData(CART_INFO_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      articles = resultObj.data.articles;
      showCartContent(articles);
    }
  });

});