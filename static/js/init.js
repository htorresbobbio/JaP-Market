const CATEGORIES_URL = "/json/categories"
const CATEGORY_INFO_URL = "/json/category_details"
const PRODUCTS_URL = "/json/products"
const PRODUCT_INFO_URL = "/json/products_details"
const PRODUCT_INFO_COMMENTS_URL = "/json/products_details_comments"
const CART_INFO_URL = "/json/cart_content"
const BUY = "/post/buy"

const showSpinner = () => document.getElementById("spinner-wrapper").style.display = "flex"

const hideSpinner = () => document.getElementById("spinner-wrapper").style.display = "none"

async function getJSONData(url) {
  try {
    showSpinner()
    let response = await fetch(url)
    let result = {}

    if (response.ok) {
      result.data = await response.json()
      result.status = "ok"
      hideSpinner()
      return result
    } else {
      hideSpinner()
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
  } catch (error) {
    console.log(error)
  }
}

async function postJSONData(url, obj) {
  try {
    showSpinner()
    let response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    })
    let result = {}

    if (response.ok) {
      result.data = await response.json()
      result.status = "ok"
      hideSpinner()
      return result
    } else {
      hideSpinner()
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
  } catch (error) {
    console.log(error)
  }
}

//Google Auth Logout
function signOut() {
  var loggedWithGoogle = JSON.parse(sessionStorage.getItem("loggedWithGoogle"))
  if (loggedWithGoogle) {
    var auth2 = gapi.auth2.getAuthInstance()
    auth2.signOut().then(function () {
      console.log("User signed out.")
    })
  }
  sessionStorage.clear()
  localStorage.clear()
  sessionStorage.setItem("Visited", true)
  window.location.href = "index.html"
}

function onLoad() {
  gapi.load("auth2", function () {
    gapi.auth2.init();
  });
}

document.addEventListener("DOMContentLoaded", function (e) {
  userLogged = sessionStorage.getItem("User-Logged");
  let userName = document.getElementById("navbarDropdownMenuLink");
  let userPanel = document.getElementById("userPanel");
  let loginPanel = document.getElementById("loginPanel");
  if (userLogged) {
    userLogged = JSON.parse(userLogged);
    userName.innerText = userLogged.email;
    userPanel.style.display = "flex";
    loginPanel.style.display = "none";
  }
});
