const ORDER_ASC_BY_COST = "CostAsc";
const ORDER_DESC_BY_COST = "CostDesc"
const ORDER_DESC_BY_SOLD_COUNT = "Relevancia";

let productsArray = [];
let minCost = undefined;
let maxCost = undefined;
let searchText = undefined;

function showProductsList(criteria) {
    // Sort array by criteria, if no criteria passed the array is unmodified
    switch (criteria) {
        case ORDER_ASC_BY_COST:
            productsArray.sort((a, b) => a.cost - b.cost);
            break;
        case ORDER_DESC_BY_COST:
            productsArray.sort((a, b) => b.cost - a.cost);
            break
        case ORDER_DESC_BY_SOLD_COUNT:
            productsArray.sort((a, b) => a.soldCount - b.soldCount);
            break
    }

    let htmlContentToAppend = "";

    // Iterate elements of the array, show element if price and search text coincide with defined parameters
    for (product of productsArray) {
        if (((minCost == undefined) || (minCost != undefined && product.cost >= minCost)) &&
            ((maxCost == undefined) || (maxCost != undefined && product.cost <= maxCost)) &&
            ((searchText == undefined) || ((product.name.toLowerCase().indexOf(searchText) != -1) ||
                (product.description.toLowerCase().indexOf(searchText) != -1)))) {

            htmlContentToAppend += `
                <div class="row border rounded-lg bg-white position-relative my-3">
                    <div class="col-md-3 col-12 mb-3">
                        <img src="img/products/${product.imgSrc.slice(4)}" class="img-fluid mt-3" alt="${product.description}">
                    </div>
                    <div class="col-md-9 col-12 align-self-center">
                        <h5 class="mt-0">${product.name}</h5>
                        <h6>$ ${product.cost}<h6>
                        <p>${product.description}</p>
                    </div>
                    <a href="product-info.html" class="stretched-link"></a>
                </div>
            `
        }

    }

    document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
}

// Events Listeners for sorting
document.getElementById("sortCostAsc").addEventListener("click", () => {
    showProductsList(ORDER_ASC_BY_COST);
    document.querySelector("#sortRelevance").classList.remove("active");
    document.querySelector("#sortCostAsc").classList.add("active");
    document.querySelector("#sortCostDesc").classList.remove("active");
});

document.getElementById("sortCostDesc").addEventListener("click", () => {
    showProductsList(ORDER_DESC_BY_COST);
    document.getElementById("sortRelevance").classList.remove("active");
    document.getElementById("sortCostAsc").classList.remove("active");
    document.getElementById("sortCostDesc").classList.add("active");
});

document.getElementById("sortRelevance").addEventListener("click", () => {
    showProductsList(ORDER_DESC_BY_SOLD_COUNT);
    document.getElementById("sortRelevance").classList.add("active");
    document.getElementById("sortCostAsc").classList.remove("active");
    document.getElementById("sortCostDesc").classList.remove("active");
});

// Events Listeners for filter
document.getElementById("clearRangeFilter").addEventListener("click", () => {
    document.getElementById("rangeFilterCountMin").value = "";
    document.getElementById("rangeFilterCountMax").value = "";

    minCost = undefined;
    maxCost = undefined;

    showProductsList();
});

document.getElementById("rangeFilterCount").addEventListener("click", () => {
    //Obtengo el mínimo y máximo de los intervalos para filtrar por precio validando que los valores ingresados tengan sentido
    minCost = document.getElementById("rangeFilterCountMin").value;
    maxCost = document.getElementById("rangeFilterCountMax").value;

    if ((minCost != undefined) && (minCost != "") && (parseInt(minCost)) >= 0) {
        minCost = parseInt(minCost);
    } else {
        minCost = undefined;
    }

    if ((maxCost != undefined) && (maxCost != "") && (parseInt(maxCost)) >= 0) {
        maxCost = parseInt(maxCost);
    } else {
        maxCost = undefined;
    }

    showProductsList();
});

// Events Listeners for search
document.getElementById("searchText").addEventListener("input", () => {
    searchText = document.getElementById("searchText").value.toLowerCase();
    showProductsList();
})

document.getElementById("searchClear").addEventListener("click", () => {
    document.getElementById("searchText").value = "";
    searchText = undefined;
    showProductsList();
})

// Get products from JSON and display in relevance (Sold count) order on page load
document.addEventListener("DOMContentLoaded", () => {
    getJSONData(PRODUCTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            productsArray = resultObj.data
            showProductsList(ORDER_DESC_BY_SOLD_COUNT);
        }
    });
});