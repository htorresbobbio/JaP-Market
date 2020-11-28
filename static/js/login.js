const form = document.querySelector(".form-signin")
form.addEventListener("submit", function (e) {
    e.preventDefault();
    e.stopPropagation();
    let inputEmail = document.getElementById("inputEmail")
    form.classList.add('was-validated')
    if (form.checkValidity()) {
        sessionStorage.clear();
        sessionStorage.setItem(
            "User-Logged", JSON.stringify({ email: inputEmail.value.trim() })
        );
        sessionStorage.setItem(
            "Visited", true
        )
        window.location.href = "index.html"
    }
})

function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    sessionStorage.clear()
    sessionStorage.setItem(
        "User-Logged", JSON.stringify({ email: profile.getEmail() })
    )
    sessionStorage.setItem(
        "loggedWithGoogle", true
    )
    sessionStorage.setItem(
        "Visited", true
    )

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;

    // After login redirect:
    window.location.href = "index.html";
}
