
function resetAddCoupon() {
    document.getElementById('couponName').value = '';
    document.getElementById('couponCode').value = '';
    document.getElementById('expiryDate').value = '';
    document.getElementById('discountPercentage').value = '';
    document.getElementById('usageLimit').value = '';
    document.getElementById('minimumOrderAmount').value = ''
}

function addCouponValidation() {
    var couponName = document.getElementById('couponName').value;
    var couponCode = document.getElementById('couponCode').value;
    var expiryDate = document.getElementById('expiryDate').value;
    var discountPercentage = parseFloat(document.getElementById('discountPercentage').value);
    var usageLimit = parseInt(document.getElementById('usageLimit').value);
    var minimumOrderAmount = parseFloat(document.getElementById('minimumOrderAmount').value);

    // Validation for Coupon Name (checking if it's not empty and <= 30 characters)
    if (couponName.trim() === '' || couponName.length > 30) {
        document.getElementById('couponNameError').style.display = 'block';
        document.getElementById('couponNameError').innerText = 'Coupon Name is required and should be max 30 characters.';
        return false;
    } else {
        document.getElementById('couponNameError').style.display = 'none';
    }

    // Validation for Coupon Code (checking if <= 30 characters)
    if (couponCode.trim() === '' || couponCode.length > 30) {
        document.getElementById('couponCodeError').style.display = 'block';
        document.getElementById('couponCodeError').innerText = 'Coupon Code is required and should be max 30 characters.';
        return false;
    } else {
        document.getElementById('couponCodeError').style.display = 'none';
    }

    // Validation for Expiry Date (checking if after dateNow)
    var dateNow = new Date().toISOString().split('T')[0];
    if (expiryDate < dateNow) {
        document.getElementById('expiryDateError').style.display = 'block';
        document.getElementById('expiryDateError').innerText = 'Expiry Date should be after today.';
        return false;
    } else {
        document.getElementById('expiryDateError').style.display = 'none';
    }

    // Validation for Discount Percentage (checking if it's a valid positive number and <= 100)
    var discountPercentage = parseFloat(document.getElementById('discountPercentage').value.trim());

    if (isNaN(discountPercentage) || discountPercentage <= 0 || discountPercentage > 100 || !/^\d+(\.\d+)?%?$/.test(discountPercentage)) {
        document.getElementById('discountPercentageError').style.display = 'block';
        document.getElementById('discountPercentageError').innerText = 'Discount Percentage should be a positive number up to 100.';
        return false;
    } else {
        document.getElementById('discountPercentageError').style.display = 'none';
    }




    // Validation for Usage Limit (checking if above 0 and only numbers)
    var usageLimit = document.getElementById('usageLimit').value.trim();
    if (usageLimit <= 0 || isNaN(usageLimit) || !/^\d+(\.\d+)?%?$/.test(usageLimit)) {
        document.getElementById('usageLimitError').style.display = 'block';
        document.getElementById('usageLimitError').innerText = 'Usage Limit should be a positive whole number.';
        return false;
    } else {
        document.getElementById('usageLimitError').style.display = 'none';
    }

    // Validation for Minimum Order Amount (checking if above or equal to zero and only numbers)
    var minimumOrderAmount = document.getElementById('minimumOrderAmount').value.trim();
    if (minimumOrderAmount < 0 || isNaN(minimumOrderAmount) || !/^\d+(\.\d+)?%?$/.test(minimumOrderAmount)) {
        document.getElementById('minimumOrderAmountError').style.display = 'block';
        document.getElementById('minimumOrderAmountError').innerText = 'Minimum Order Amount should be a non-negative whole number.';
        return false;
    } else {
        document.getElementById('minimumOrderAmountError').style.display = 'none';
    }


    // If all validations pass
    return true;

}

function addCoupon() {
    var couponName = document.getElementById('couponName').value;
    var couponCode = document.getElementById('couponCode').value;
    var expiryDate = document.getElementById('expiryDate').value;
    var discountPercentage = parseFloat(document.getElementById('discountPercentage').value);
    var usageLimit = parseInt(document.getElementById('usageLimit').value);
    var minimumOrderAmount = parseFloat(document.getElementById('minimumOrderAmount').value);

    const formBody = {
        couponName: couponName,
        couponCode: couponCode,
        expiryDate: expiryDate,
        discountPercentage: discountPercentage,
        usageLimit: usageLimit,
        minimumOrderAmount: minimumOrderAmount
    }

    if (addCouponValidation()) {
        fetch('admin/coupons', {
            method: 'POST',
            body: JSON.stringify(formBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                // Handle successful response data
                if (data.status) {
                    window.location.href = '/admin/coupons';
                } else if (data.error) {
                    document.getElementById('couponNameError').style.display = 'block';
                    document.getElementById('couponNameError').innerText = data.error;
                }
            })
            .catch(error => {
                // Handle fetch errors
                console.error('There was a problem with the fetch operation:', error);
            });
    } else {
        // Handle validation errors
        console.error('Validation failed. Please correct the input.');
    }
}

function loadEditCoupon(id) {
    fetch(`admin/coupons/edit_coupon?couponId=${id}`)
        .then(response => response.json())
        .then(data => {
            // alert(JSON.stringify(data.couponData))
            // Update the input fields with the fetched data
            document.getElementById('couponNameEdit').value = data.couponData.couponName;
            document.getElementById('couponCodeEdit').value = data.couponData.couponCode;
            // Extract the date part (YYYY-MM-DD) from the received ISO 8601 formatted date
            const expiryDateISO = data.couponData.expiryDate;
            const expiryDate = expiryDateISO.split('T')[0]; // Extracts only the date part

            // Set the date for expiryDate input field
            document.getElementById('expiryDateEdit').value = expiryDate;

            document.getElementById('discountPercentageEdit').value = data.couponData.discountPercentage;
            document.getElementById('usageLimitEdit').value = data.couponData.usageLimit;
            document.getElementById('minimumOrderAmountEdit').value = data.couponData.minimumOrderAmount;

            // Update other elements as needed
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            // Handle errors or display error messages as needed
        });
}
//.................edit coupon Reset..........................
function resetEditCoupon() {
    document.getElementById('couponNameEdit').value = '';
    document.getElementById('couponCodeEdit').value = '';
    document.getElementById('expiryDateEdit').value = '';
    document.getElementById('discountPercentageEdit').value = '';
    document.getElementById('usageLimitEdit').value = '';
    document.getElementById('minimumOrderAmountEdit').value = ''
}

function editCouponValidation() {
    var couponName = document.getElementById('couponNameEdit').value;
    var couponCode = document.getElementById('couponCodeEdit').value;
    var expiryDate = document.getElementById('expiryDateEdit').value;
    var discountPercentage = parseFloat(document.getElementById('discountPercentageEdit').value);
    var usageLimit = parseInt(document.getElementById('usageLimitEdit').value);
    var minimumOrderAmount = parseFloat(document.getElementById('minimumOrderAmountEdit').value);

    // Validation for Coupon Name (checking if it's not empty and <= 30 characters)
    if (couponName.trim() === '' || couponName.length > 30) {
        document.getElementById('couponNameEditError').style.display = 'block';
        document.getElementById('couponNameEditError').innerText = 'Coupon Name is required and should be max 30 characters.';
        return false;
    } else {
        document.getElementById('couponNameEditError').style.display = 'none';
    }

    // Validation for Coupon Code (checking if <= 30 characters)
    if (couponCode.trim() === '' || couponCode.length > 30) {
        document.getElementById('couponCodeEditError').style.display = 'block';
        document.getElementById('couponCodeEditError').innerText = 'Coupon Code is required and should be max 30 characters.';
        return false;
    } else {
        document.getElementById('couponCodeEditError').style.display = 'none';
    }

    // Validation for Expiry Date (checking if after dateNow)
    var dateNow = new Date().toISOString().split('T')[0];
    if (expiryDate < dateNow) {
        document.getElementById('expiryDateEditError').style.display = 'block';
        document.getElementById('expiryDateEditError').innerText = 'Expiry Date should be after today.';
        return false;
    } else {
        document.getElementById('expiryDateEditError').style.display = 'none';
    }

    // Validation for Discount Percentage (checking if it's a valid positive number and <= 100)
    var discountPercentage = parseFloat(document.getElementById('discountPercentageEdit').value.trim());

    if (isNaN(discountPercentage) || discountPercentage <= 0 || discountPercentage > 100 || !/^\d+(\.\d+)?%?$/.test(discountPercentage)) {
        document.getElementById('discountPercentageEditError').style.display = 'block';
        document.getElementById('discountPercentageEditError').innerText = 'Discount Percentage should be a positive number up to 100.';
        return false;
    } else {
        document.getElementById('discountPercentageEditError').style.display = 'none';
    }




    // Validation for Usage Limit (checking if above 0 and only numbers)
    var usageLimit = document.getElementById('usageLimitEdit').value.trim();
    if (usageLimit < 0 || isNaN(usageLimit) || !/^\d+(\.\d+)?%?$/.test(usageLimit)) {
        document.getElementById('usageLimitEditError').style.display = 'block';
        document.getElementById('usageLimitEditError').innerText = 'Usage Limit should be a positive whole number.';
        return false;
    } else {
        document.getElementById('usageLimitEditError').style.display = 'none';
    }

    // Validation for Minimum Order Amount (checking if above or equal to zero and only numbers)
    var minimumOrderAmount = document.getElementById('minimumOrderAmountEdit').value.trim();
    if (minimumOrderAmount < 0 || isNaN(minimumOrderAmount) || !/^\d+(\.\d+)?%?$/.test(minimumOrderAmount)) {
        document.getElementById('minimumOrderAmountEditError').style.display = 'block';
        document.getElementById('minimumOrderAmountEditError').innerText = 'Minimum Order Amount should be a non-negative whole number.';
        return false;
    } else {
        document.getElementById('minimumOrderAmountEditError').style.display = 'none';
    }


    // If all validations pass
    return true;

}

function EditCoupon(id) {
    var couponName = document.getElementById('couponNameEdit').value;
    var couponCode = document.getElementById('couponCodeEdit').value;
    var expiryDate = document.getElementById('expiryDateEdit').value;
    var discountPercentage = parseFloat(document.getElementById('discountPercentageEdit').value);
    var usageLimit = parseInt(document.getElementById('usageLimitEdit').value);
    var minimumOrderAmount = parseFloat(document.getElementById('minimumOrderAmountEdit').value);

    const formBody = {
        couponName: couponName,
        couponCode: couponCode,
        expiryDate: expiryDate,
        discountPercentage: discountPercentage,
        usageLimit: usageLimit,
        minimumOrderAmount: minimumOrderAmount
    };

    if (editCouponValidation()) {
        // Construct the URL with the coupon ID
        const url = `admin/coupons/edit_coupon?couponId=${id}`;

        fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                // Add any other necessary headers here
            },
            body: JSON.stringify(formBody)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                window.location.href = '/admin/coupons';
            } else if (data.error) {
                document.getElementById('couponNameEditError').style.display = 'block';
                document.getElementById('couponNameEditError').innerText = data.error;
            }
        })
        .catch(error => {
            // Handle errors or display error messages as needed
            console.error('Error editing coupon:', error);
            alert('There was an error editing the coupon. Please try again.');
        });
    }
}

