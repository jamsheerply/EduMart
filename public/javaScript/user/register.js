function validateForm() {
    // Get form inputs
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Define regular expressions for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=!])([A-Za-z\d@#$%^&+=!]){8,}$/;


    // Reset error messages
    document.getElementById("firstNameError").textContent = "";
    document.getElementById("lastNameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("passwordError").textContent = "";
    document.getElementById("confirmPasswordError").textContent = "";

    let valid = true;

    // Validate first name
    if (!firstName || firstName.trim() === "") {
        document.getElementById("firstNameError").textContent = "First Name is required.";
        valid = false;
    }

    // Validate last name
    if (!lastName|| lastName.trim() === "") {
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

    // Validate password
    if (!password) {
        document.getElementById("passwordError").textContent = "Password is required.";
        valid = false;
    } else if (!strongPasswordRegex.test(password)) {
        document.getElementById("passwordError").textContent = "Password must be at least 8 characters long and include letters and digits.";
        valid = false;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
        document.getElementById("confirmPasswordError").textContent = "Passwords do not match.";
        valid = false;
    }

    return valid;
}
function postData(event){
    event.preventDefault()
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    if(validateForm()){

        let formData={
            firstName:firstName.value,
            lastName:lastName.value,
            email:email.value,
            password:password.value,
        }
        fetch('/user/register',{
            method:"POST",
            headers:{"Content-type":"application/json"},
            body:JSON.stringify(formData)
        }).then((response)=>response.json()).then((res)=>{
            if(res.status){
                location.href='/user/otp'
            }
            if(res.err){
                document.getElementById("emailError").textContent=res.err

            }
        })
    }
}