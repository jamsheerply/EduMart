function validateForm() {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Reset error messages
    document.getElementById("firstNameError").textContent = "";
    document.getElementById("lastNameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("phoneError").textContent = "";

    let valid = true;

    // Validate first name
    if (!firstName || firstName.trim() === "") {
        document.getElementById("firstNameError").textContent = "First Name is required.";
        valid = false;
    }

    // Validate last name
    if (!lastName || lastName.trim() === "") {
        document.getElementById("lastNameError").textContent = "Last Name is required.";
        valid = false;
    }

    // Validate email
    if (!email) {
        document.getElementById("emailError").textContent = "Email is required.";
        valid = false;
    } else if (!emailRegex.test(email)) {
        document.getElementById("emailError").textContent = "Invalid email format.";
        valid = false;
    }

    // Validate phone number
    if (!phone) {
        document.getElementById("phoneError").textContent = "Phone number is required.";
        valid = false;
    } else if (isNaN(phone) || phone.length !== 10) {
        document.getElementById("phoneError").textContent = "Phone number should be a 10-digit number.";
        valid = false;
    }


    return valid;
}


//.....................editing the MyProfile......................
function editMyProfile() {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    // Validation code if needed
    if (validateForm()) {

        let formData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
        };

        // alert(JSON.stringify(formData));

        fetch('/user/my-profile', {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(formData)
        }).then((response) => response.json()).then((res) => {
            if (res.statusEditMyProfile) {
                window.location.reload();
            }
        });
    }
}

//..

function formValidation() {
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    document.getElementById("oldPasswordError").textContent = "";
    document.getElementById("passwordError").textContent = "";
    document.getElementById("passwordMatchStatus").textContent = "";

    const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=!])([A-Za-z\d@#$%^&+=!]){8,}$/;

    let valid = true;

    if (!oldPassword) {
        document.getElementById("oldPasswordError").textContent = "Old Password is required.";
        valid = false;
    }

    if (!newPassword) {
        document.getElementById("passwordError").textContent = "New Password is required.";
        valid = false;
    } else if (!strongPasswordRegex.test(newPassword)) {
        document.getElementById("passwordError").textContent = "New Password must be at least 8 characters long and include letters, digits, and special characters.";
        valid = false;
    }

    if (newPassword !== confirmPassword) {
        document.getElementById("passwordMatchStatus").textContent = "Passwords do not match.";
        valid = false;
    }

    return valid;
}

function editPasswordMyProfile() {
    if (formValidation()) {
        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;

        const formData = {
            oldPassword: oldPassword,
            newPassword: newPassword
        };
        // alert(JSON.stringify(formData))
        fetch('/user/my-profile', {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(formData)
        }).then((response) => response.json()).then((res) => {
            if (res.statusEditMyProfile) {
                window.location.reload();
            }
            if (res.statusChangePasswordMyProfile) {
                alert("password updated")
                window.location.reload();
            }
            if (res.err) {
                document.getElementById("oldPasswordError").textContent = res.err
            }
        }).catch((error) => {
            console.error('Error:', error);
            // Handle error (e.g., display error message to the user)
        });
    }
}
