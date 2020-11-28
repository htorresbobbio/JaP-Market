const form = document.querySelector(".form-signin")
form.addEventListener("submit", function (e) {
    e.preventDefault();
    e.stopPropagation();
    let inputEmail = document.getElementById("inputEmail")
    form.classList.add('was-validated')
    if (form.checkValidity()) {
        sessionStorage.clear();
        sessionStorage.setItem(
            "User-Logged",
            JSON.stringify({ email: inputEmail.value.trim() })
        );
        window.location.href = "index.html"
    }
})

function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log("Full Name: " + profile.getName());
    console.log("Given Name: " + profile.getGivenName());
    console.log("Family Name: " + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);

    // After login redirect:
    window.location.href = "index.html";
}
