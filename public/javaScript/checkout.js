function validateAddress() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const postCode = document.getElementById('postCode').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    // Get the selected payment method
    const paymentMethodElements = document.querySelectorAll('.paymentMethod');
    let paymentMethod;
    paymentMethodElements.forEach((element) => {
        if (element.checked) {
            paymentMethod = element.value;
        }
    });

    // Reset error messages
    document.getElementById("firstNameError").textContent = "";
    document.getElementById("lastNameError").textContent = "";
    document.getElementById("addressError").textContent = "";
    document.getElementById("cityError").textContent = "";
    document.getElementById("stateError").textContent = "";
    document.getElementById("postCodeError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("phoneError").textContent = "";
    document.getElementById("paymentMethodError").textContent = "";

    let valid = true;

    // Validation for First Name
    if (firstName.trim() === "") {
        document.getElementById("firstNameError").textContent = "First Name is required";
        valid = false;
    }

    // Validation for Last Name
    if (lastName.trim() === "") {
        document.getElementById("lastNameError").textContent = "Last Name is required";
        valid = false;
    }

    // Validation for Address
    if (address.trim() === "") {
        document.getElementById("addressError").textContent = "Address is required";
        valid = false;
    }

    // Validation for City
    if (city.trim() === "") {
        document.getElementById("cityError").textContent = "City is required";
        valid = false;
    }

    // Validation for State
    if (state.trim() === "") {
        document.getElementById("stateError").textContent = "State is required";
        valid = false;
    }

    // Validation for Post Code
    if (isNaN(postCode) || postCode.trim() === "" || postCode.length !== 6) {
        document.getElementById("postCodeError").textContent = "Post Code must be a 6-digit number";
        valid = false;
    }

    // Validation for Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById("emailError").textContent = "Invalid Email Format";
        valid = false;
    }

    // Validation for Phone
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        document.getElementById("phoneError").textContent = "Phone must be a 10-digit number";
        valid = false;
    }

    // Validation for Payment Method
    if (!paymentMethod) {
        document.getElementById("paymentMethodError").textContent = "Please select a Payment Method";
        valid = false;
    }

    return valid;
}


function insertAddress() {
    if (validateAddress()) {

        const firstName = document.getElementById('firstName').value
        const lastName = document.getElementById('lastName').value
        const address = document.getElementById('address').value
        const city = document.getElementById('city').value
        const state = document.getElementById('state').value
        const postCode = document.getElementById('postCode').value
        const email = document.getElementById('email').value
        const phone = document.getElementById('phone').value

        // Get the selected payment method
        const paymentMethodElements = document.querySelectorAll('.paymentMethod');
        let paymentMethod;
        paymentMethodElements.forEach((element) => {
            if (element.checked) {
                paymentMethod = element.value;
            }
        });

        const formBody = {
            firstName: firstName,
            lastName: lastName,
            address: address,
            city: city,
            state: state,
            postCode: postCode,
            email: email,
            phone: phone,
            paymentMethod: paymentMethod

        }
        // alert(JSON.stringify(formBody))

        fetch('/user/check-out', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formBody)
        }).then(response => response.json()).then((res) => {
            if (res.status) {
                window.location.href = "/user/order/confirmation";
            }
        });
    }
}

