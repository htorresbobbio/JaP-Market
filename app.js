// Node.js Modules
const express = require("express")
const fs = require("fs")

// JSONs
const categories = require("./json/categories_list.json")
const categoryDetails = require("./json/category_details.json")
const products = require("./json/products_list.json")
const productDetails = require("./json/product_details.json")
const productDetailsComments = require("./json/product_details_comments.json")
const cart_content = require("./json/cart_content.json")

const app = express()
const port = process.env.PORT || 5000

app.use(express.static(__dirname + "/static"));
app.use(express.json())

// Routes
app.get("/json/categories", (req, res) => {
    res.send(categories)
})

app.get("/json/category_details", (req, res) => {
    res.send(categoryDetails)
})

app.get("/json/products", (req, res) => {
    res.send(products)
})

app.get("/json/product_details", (req, res) => {
    res.send(productDetails)
})

app.get("/json/product_details_comments", (req, res) => {
    res.send(productDetailsComments)
})

app.get("/json/cart_content", (req, res) => {
    res.send(cart_content)
})

app.post("/post/buy", function (req, res) {
    let cartProductsDetails = ""
    req.body.articles.forEach(article => {
        cartProductsDetails += `
        Producto: ${article.name}
        Costo Unitario: ${article.unitCost}
        Moneda: ${article.currency}
        `
    });

    purchaseDataString = `
    --------------------------------------------------
    ARTICULOS EN EL CARRITO:
    ${cartProductsDetails}
    SUBTOTAL: $${req.body.subtotal}

    TIPO DE ENVIO: ${req.body.shippingType}

    COSTO DE ENVIO: $${req.body.shippingCost}

    COSTO TOTAL: $${req.body.totalCost}
    --------------------------------------------------

    `

    fs.appendFile("purchase-log.txt", purchaseDataString, err => {
        if (err) {
            res.send({
                msg: "Ha ocurrido un error en la compra, vuelve a intentarlo mas tarde"
            })
        } else {
            res.send({
                msg: "A la brevedad te llegará un e-mail con los detalles de envío"
            })
        }
    })
})

app.use((req, res, next) => res.status(404).sendFile(`${__dirname}/static/404.html`))

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`)
})