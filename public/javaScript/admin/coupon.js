
function resetAddCoupon() {
    document.getElementById('productName').value = '';
    document.getElementById('couponCode').value = '';
    document.getElementById('expiryDate').value = '';
    document.getElementById('discountPercentage').value = '';
    document.getElementById('usageLimit').value = '';
    document.getElementById('minimumOrderAmount').value = ''
    document.getElementById('maximumDiscountAmount').value = ''
}

function addCouponValidation() {
    var couponName = document.getElementById('couponName').value;
    var couponCode = document.getElementById('couponCode').value;
    var expiryDate = document.getElementById('expiryDate').value;
    var discountPercentage = parseFloat(document.getElementById('discountPercentage').value);
    var usageLimit = parseInt(document.getElementById('usageLimit').value);
    var minimumOrderAmount = parseFloat(document.getElementById('minimumOrderAmount').value);
    var maximumDiscountAmount = parseFloat(document.getElementById('maximumDiscountAmount').value);

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
    // Validation for maximumDiscountAmount (checking if above or equal to zero and only numbers)
    var maximumDiscountAmount = document.getElementById('maximumDiscountAmount').value.trim();
    if (maximumDiscountAmount <=0 || isNaN(maximumDiscountAmount) || !/^\d+(\.\d+)?%?$/.test(maximumDiscountAmount)) {
        document.getElementById('maximumDiscountAmountError').style.display = 'block';
        document.getElementById('maximumDiscountAmountError').innerText = 'Maximum Discount Amount should be a non-negative whole number.';
        return false;
    } else {
        document.getElementById('maximumDiscountAmountError').style.display = 'none';
    }
    return true;

}

function addCoupon() {
    var couponName = document.getElementById('couponName').value;
    var couponCode = document.getElementById('couponCode').value;
    var expiryDate = document.getElementById('expiryDate').value;
    var discountPercentage = parseFloat(document.getElementById('discountPercentage').value);
    var usageLimit = parseInt(document.getElementById('usageLimit').value);
    var minimumOrderAmount = parseFloat(document.getElementById('minimumOrderAmount').value);
    var maximumDiscountAmount = parseFloat(document.getElementById('maximumDiscountAmount').value);

    const formBody = {
        couponName: couponName,
        couponCode: couponCode,
        expiryDate: expiryDate,
        discountPercentage: discountPercentage,
        usageLimit: usageLimit,
        minimumOrderAmount: minimumOrderAmount,
        maximumDiscountAmount:maximumDiscountAmount
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
    }
}

function loadEditCoupon(id) {
    // alert(id)
    fetch(`admin/coupons/edit_coupon?couponId=${id}`)
        .then(response => response.json())
        .then(data => {
            // alert(JSON.stringify(data.couponData.couponName))
            // Update the input fields with the fetched data
            document.getElementById(`couponNameEdit${id}`).value = data.couponData.couponName;
            document.getElementById(`couponCodeEdit${id}`).value = data.couponData.couponCode;
            // Extract the date part (YYYY-MM-DD) from the received ISO 8601 formatted date
            const expiryDateISO = data.couponData.expiryDate;
            const expiryDate = expiryDateISO.split('T')[0]; // Extracts only the date part

            // Set the date for expiryDate input field
            document.getElementById(`expiryDateEdit${id}`).value = expiryDate;

            document.getElementById(`discountPercentageEdit${id}`).value = data.couponData.discountPercentage;
            document.getElementById(`usageLimitEdit${id}`).value = data.couponData.usageLimit;
            document.getElementById(`minimumOrderAmountEdit${id}`).value = data.couponData.minimumOrderAmount;
            document.getElementById(`maximumDiscountAmountEdit${id}`).value = data.couponData.maximumDiscountAmount;

            // Update other elements as needed
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            // Handle errors or display error messages as needed
        });
}


function editCouponValidation(id) {
    var couponName = document.getElementById(`couponNameEdit${id}`).value;
    var couponCode = document.getElementById(`couponCodeEdit${id}`).value;
    var expiryDate = document.getElementById(`expiryDateEdit${id}`).value;
    var discountPercentage = parseFloat(document.getElementById(`discountPercentageEdit${id}`).value);
    var usageLimit = parseInt(document.getElementById(`usageLimitEdit${id}`).value);
    var minimumOrderAmount = parseFloat(document.getElementById(`minimumOrderAmountEdit${id}`).value);

    // Validation for Coupon Name (checking if it's not empty and <= 30 characters)
    if (couponName.trim() === '' || couponName.length > 30) {
        document.getElementById(`couponNameEditError${id}`).style.display = 'block';
        document.getElementById(`couponNameEditError${id}`).innerText = 'Coupon Name is required and should be max 30 characters.';
        return false;
    } else {
        document.getElementById(`couponNameEditError${id}`).style.display = 'none';
    }

    // Validation for Coupon Code (checking if <= 30 characters)
    if (couponCode.trim() === '' || couponCode.length > 30) {
        document.getElementById(`couponCodeEditError${id}`).style.display = 'block';
        document.getElementById(`couponCodeEditError${id}`).innerText = 'Coupon Code is required and should be max 30 characters.';
        return false;
    } else {
        document.getElementById(`couponCodeEditError${id}`).style.display = 'none';
    }

    // Validation for Expiry Date (checking if after dateNow)
    var dateNow = new Date().toISOString().split('T')[0];
    if (expiryDate < dateNow) {
        document.getElementById(`expiryDateEditError${id}`).style.display = 'block';
        document.getElementById(`expiryDateEditError${id}`).innerText = 'Expiry Date should be after today.';
        return false;
    } else {
        document.getElementById(`expiryDateEditError${id}`).style.display = 'none';
    }

    // Validation for Discount Percentage (checking if it's a valid positive number and <= 100)
    var discountPercentage = parseFloat(document.getElementById(`discountPercentageEdit${id}`).value.trim());

    if (isNaN(discountPercentage) || discountPercentage <= 0 || discountPercentage > 100 || !/^\d+(\.\d+)?%?$/.test(discountPercentage)) {
        document.getElementById(`discountPercentageEditError${id}`).style.display = 'block';
        document.getElementById(`discountPercentageEditError${id}`).innerText = 'Discount Percentage should be a positive number up to 100.';
        return false;
    } else {
        document.getElementById(`discountPercentageEditError${id}`).style.display = 'none';
    }




    // Validation for Usage Limit (checking if above 0 and only numbers)
    var usageLimit = document.getElementById(`usageLimitEdit${id}`).value.trim();
    if (usageLimit < 0 || isNaN(usageLimit) || !/^\d+(\.\d+)?%?$/.test(usageLimit)) {
        document.getElementById(`usageLimitEditError${id}`).style.display = 'block';
        document.getElementById(`usageLimitEditError${id}`).innerText = 'Usage Limit should be a positive whole number.';
        return false;
    } else {
        document.getElementById(`usageLimitEditError${id}`).style.display = 'none';
    }

    // Validation for Minimum Order Amount (checking if above or equal to zero and only numbers)
    var minimumOrderAmount = document.getElementById(`minimumOrderAmountEdit${id}`).value.trim();
    if (minimumOrderAmount < 0 || isNaN(minimumOrderAmount) || !/^\d+(\.\d+)?%?$/.test(minimumOrderAmount)) {
        document.getElementById(`minimumOrderAmountEditError${id}`).style.display = 'block';
        document.getElementById(`minimumOrderAmountEditError${id}`).innerText = 'Minimum Order Amount should be a non-negative whole number.';
        return false;
    } else {
        document.getElementById(`minimumOrderAmountEditError${id}`).style.display = 'none';
    }

    // Validation for maxmium discount Amount (checking if above or equal to zero and only numbers)
    var maximumDiscountAmountEdit = document.getElementById(`maximumDiscountAmountEdit${id}`).value.trim();
    if (maximumDiscountAmountEdit <= 0 || isNaN(maximumDiscountAmountEdit) || !/^\d+(\.\d+)?%?$/.test(maximumDiscountAmountEdit)) {
        document.getElementById(`maximumDiscountAmountEditError${id}`).style.display = 'block';
        document.getElementById(`maximumDiscountAmountEditError${id}`).innerText = 'maximum discount Amount should be a non-negative whole number.';
        return false;
    } else {
        document.getElementById(`maximumDiscountAmountEditError${id}`).style.display = 'none';
    }


    // If all validations pass
    return true;

}

function EditCoupon(id) {
    var couponName = document.getElementById(`couponNameEdit${id}`).value;
    var couponCode = document.getElementById(`couponCodeEdit${id}`).value;
    var expiryDate = document.getElementById(`expiryDateEdit${id}`).value;
    var discountPercentage = parseFloat(document.getElementById(`discountPercentageEdit${id}`).value);
    var usageLimit = parseInt(document.getElementById(`usageLimitEdit${id}`).value);
    var minimumOrderAmount = parseFloat(document.getElementById(`minimumOrderAmountEdit${id}`).value);
    var maximumDiscountAmount = parseFloat(document.getElementById(`maximumDiscountAmountEdit${id}`).value);

    const formBody = {
        couponName: couponName,
        couponCode: couponCode,
        expiryDate: expiryDate,
        discountPercentage: discountPercentage,
        usageLimit: usageLimit,
        minimumOrderAmount: minimumOrderAmount,
        maximumDiscountAmount:maximumDiscountAmount
    };

    if (editCouponValidation(id)) {
        fetch(`admin/coupons/edit_coupon?couponId=${id}`, {
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
                document.getElementById(`couponNameEditError${id}`).style.display = 'block';
                document.getElementById(`couponNameEditError${id}`).innerText = data.error;
            }
        })
        .catch(error => {
            // Handle errors or display error messages as needed
            console.error('Error editing coupon:', error);
            alert('There was an error editing the coupon. Please try again.');
        });
    }
}

