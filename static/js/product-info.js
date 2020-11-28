var productsArray = [];
var product = {};
var comments = [];
var userLogged = undefined;

function showRelatedProducts(relatedArray) {
    let htmlContentToAppend = ""

    relatedArray.forEach(relatedIndex => {
        let product = productsArray[relatedIndex]
        htmlContentToAppend += `
            <div class="col-md-3">
                <div class="card">
                    <img class="card-img-top" src="img/products/${product.imgSrc.slice(4)}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text"><strong>Precio: </strong>${product.currency} ${product.cost}
                        <p class="card-text mb-0">${product.description}</p>
                        <a class="card-link stretched-link" href="product-info.html"></a>
                    </div>
                </div>
            </div>
        `
    });

    document.getElementById("relatedProducts").innerHTML = htmlContentToAppend
}

function showImagesGallery(array) {
    let htmlContentToAppend = "";

    array.forEach(imageSrc => {
        if (imageSrc.indexOf("_") < 0) {
            htmlContentToAppend += `
                <div class="carousel-item active">
                    <img src="img/products/${imageSrc.slice(4)}" class="d-block w-100" alt="">
                </div>
        `
        }
        else {
            htmlContentToAppend += `
                <div class="carousel-item">
                    <img src="img/products/${imageSrc.slice(4)}" class="d-block w-100" alt="">
                </div>
        `
        }
        document.getElementById("carouselInner").innerHTML = htmlContentToAppend;
    });
}

function showComments(array) {
    let htmlContentToAppend = "";
    for (let i = 0; i < array.length; i++) {
        let comment = array[i];
        let starRatingHTML = "";
        for (let i = 1; i <= comment.score; i++) {
            starRatingHTML += "<span class='fas fa-star star-checked'></span>"
        }
        for (let i = comment.score + 1; i <= 5; i++) {
            starRatingHTML += "<span class='fas fa-star'></span>"
        }
        htmlContentToAppend += `
            <li class="list-group-item">
                <div>${starRatingHTML}</div>
                <p>${comment.description}</p>
                <p class="font-weight-bold small mb-0">${comment.user}</p>
                <em class="small">Publicado el ${comment.dateTime}</em>
            </li>
        `
        document.getElementById("productComments").innerHTML = htmlContentToAppend;
    }
}

function getFormatedDate() {
    let timeNow = new Date()
    let dateTime = ""
    dateTime = `${timeNow.getFullYear()}-${timeNow.getMonth() + 1}-${timeNow.getDate()} ${timeNow.getHours()}:${timeNow.getMinutes()}:${timeNow.getSeconds()}`
    return dateTime
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    userLogged = JSON.parse(sessionStorage.getItem('User-Logged'));
    getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            product = resultObj.data;
            getJSONData(PRODUCTS_URL).then(function (resultObj) {
                if (resultObj.status === "ok") {
                    productsArray = resultObj.data;
                    let productNameHTML = document.getElementById("productName");
                    let productDescriptionHTML = document.getElementById("productDescription");
                    let productCostHTML = document.getElementById("productCost");
                    let productSoldCountHTML = document.getElementById("productSoldCount");
                    let productCategory = document.getElementById("productCategory");

                    productNameHTML.innerHTML = product.name;
                    productDescriptionHTML.innerHTML = product.description;
                    productCostHTML.innerHTML += `${product.cost} ${product.currency}`;
                    productSoldCountHTML.innerHTML += product.soldCount;
                    productCategory.innerHTML += product.category;

                    showImagesGallery(product.images);
                    showRelatedProducts(product.relatedProducts);
                }
            })
        }
    });
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            comments = resultObj.data;
            showComments(comments);
        }
    })

    if (userLogged != undefined) {
        document.getElementById("reviewForm").style.display = "inline"
        document.getElementById("loginToReview").style.display = "none"
    }

    document.getElementById("sendReview").addEventListener("click", function () {
        let rating = parseInt(document.querySelector('input[name="rating"]:checked').value);
        let description = document.getElementById("userComment");
        let newReview = { score: rating, description: description.value, user: userLogged.email, dateTime: getFormatedDate() }
        comments.push(newReview)
        showComments(comments);
        description.value = "";
    })
});
