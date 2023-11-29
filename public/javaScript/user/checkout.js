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


//insertAdress and reyzor pay
document.addEventListener('DOMContentLoaded', function () {
        const rzpButton = document.getElementById('rzp-button1');

        rzpButton.addEventListener('click', function (event) {
            // Your logic or function call here when the button is clicked
            insertAddress();
        });
    });

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
        const orderTotalElement= document.getElementById('orderTotal')
        const orderTotalValue=orderTotalElement.textContent
       const orderTotal= parseInt(orderTotalValue.replace(/\D/g, ''), 10);
        // alert(orderTotal)
        // Get the selected payment method
        const paymentMethodElements = document.querySelectorAll('.paymentMethod');
        let paymentMethod;
        paymentMethodElements.forEach((element) => {
            if (element.checked) {
                paymentMethod = element.value;
            }
        });
        // alert(paymentMethod)
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
        if (paymentMethod === "COD") {
            fetch('/user/check-out', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formBody)
            }).then(response => response.json()).then((res) => {
                if (res.status) {
                    window.location.href = "/user/order/confirmation";
                }else if(res.orderId){
                    alert(res.orderId)
                    localStorage.setItem("ordreId",res.orderId)
                }
            });
        } else if (paymentMethod === "online") {
            var paymentId;
            fetch('/user/check-out/generateRazorpayPayment',{
                method:"POST",
                headers:{"content-type":"application/json"},
                body:JSON.stringify({hi:"HIe"})
            }).then(response=>response.json()).then(res=>{
                if(res.order){
                    // const orderTotalPaise=orderTotal*100
                    var options = {
                        "key": "rzp_test_0YyNEOzl0fGUQ2", 
                        "amount": res.order.amount, //showing error here why
                        "currency": "INR",
                        "name": "Safat edumart",
                        "description": "Test Transaction",
                        "image": "https://example.com/your_logo",
                        "order_id": res.order.id, 
                        "handler": function (response) {
                            paymentId=response.razorpay_payment_id
                            if(paymentId){
                                fetch('/user/check-out/verifyrazorpaypayment',{
                                    method:"post",
                                    headers:{"Content-Type":"application/json"},
                                    body:JSON.stringify({orderId:res.order.id,paymentId})
                                }).then(response=>response.json()).then(res=>{
                                    if(res.status){
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
                                    }else{
                                        alert("Payment failed")
                                    }
                                })
                            }
                           
                        }, "theme": {
                            "color": "#3399cc"
                        }
                    }
                    var rzp1 = new Razorpay(options);
                    rzp1.on('payment.failed', function (response) {
                        alert("fail")
                        alert(response.error.code);
                        alert(response.error.description);
                        alert(response.error.source);
                        alert(response.error.step);
                        alert(response.error.reason);
                        alert(response.error.metadata.order_id);
                        alert(response.error.metadata.payment_id);
                    });
                    rzp1.open();
                }else{
                    alert(JSON.stringify(res))
                }
            })
            

        }

    }
}

