const profileForm = {
    id: document.querySelector("#profile-form"),
    name: document.querySelector('#name'),
    surname: document.querySelector('#surname'),
    age: document.querySelector('#age'),
    email: document.querySelector('#email'),
    phone: document.querySelector('#phone'),
    avatarImage: document.querySelector('#avatar-image'),
    avatarInput: document.querySelector('#avatar-input'),
}

document.addEventListener("DOMContentLoaded", () => {
    profileData = JSON.parse(localStorage.getItem('profileData'))
    if (profileData) {
        profileForm.name.value = profileData.name
        profileForm.surname.value = profileData.surname
        profileForm.age.value = profileData.age
        profileForm.email.value = profileData.email
        profileForm.phone.value = profileData.phone
        profileForm.avatarImage.src = profileData.avatar
    } else {
        profileForm.avatarImage.src = "https://i.ibb.co/S6dt6zn/Profile-avatar-placeholder-large.png"
    }
});

profileForm.avatarInput.addEventListener('change', function () {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
        console.log(reader.result)
        profileForm.avatarImage.src = reader.result
    })
    reader.readAsDataURL(this.files[0])
})

profileForm.id.addEventListener('submit', (e) => {
    e.preventDefault()
    e.stopPropagation()
    const profileData = {
        name: profileForm.name.value,
        surname: profileForm.surname.value,
        age: parseInt(profileForm.age.value),
        email: profileForm.email.value,
        phone: profileForm.phone.value,
        avatar: profileForm.avatarImage.src
    }
    localStorage.setItem('profileData', JSON.stringify(profileData))
})