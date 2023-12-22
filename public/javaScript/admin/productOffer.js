function resetAddProductOffer() {
    document.getElementById('productName').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('expiryDate').value = '';
    document.getElementById('discount').value = '';
    document.getElementById("productNameError").textContent = ''; // Reset error messages
    document.getElementById("startDateError").textContent = '';
    document.getElementById("expiryDateError").textContent = '';
    document.getElementById("discountError").textContent = '';
}

function addProductOfferValidation() {
    var productName = document.getElementById('productName').value;
    var startDate = new Date(document.getElementById('startDate').value);
    var expiryDate = new Date(document.getElementById('expiryDate').value);
    var discount = document.getElementById('discount').value;

    // Check if productName is present and not just spaces
    if (!productName || !productName.trim()) {
        document.getElementById("productNameError").textContent = 'Product Name is required and should not be empty.';
        return false;
    }else {
        document.getElementById("productNameError").textContent = "";
    }

    // Check if startDate is a valid date and today or a future date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set hours to 0 for proper date comparison
    if (isNaN(startDate.getTime()) || startDate < today) {
        document.getElementById("startDateError").textContent = 'Start date should be today or a future date.';
        return false;
    } else {
        document.getElementById("startDateError").textContent = "";
    }

    // Check if expiryDate is a valid date and after the startDate
    if (isNaN(expiryDate.getTime()) || expiryDate < startDate) {
        document.getElementById("expiryDateError").textContent = 'Expiry date should be a valid date and after the start date.';
        return false;
    } else {
        document.getElementById("expiryDateError").textContent = "";
    }

    // Check if discount is a number greater than or equal to 0
    const parsedDiscount = parseFloat(discount);
    if (isNaN(parsedDiscount) || parsedDiscount < 0 || parsedDiscount > 100) {
        document.getElementById("discountError").textContent = 'Discount should be a number greater than or equal to 0.';
        return false;
    } else {
        document.getElementById("discountError").textContent = "";
    }

    return true;
}



function addProductOffer() {
    var productId = document.getElementById('productName').value;
    var productName = document.getElementById('productName').options[document.getElementById('productName').selectedIndex].text;
    var startDate = document.getElementById('startDate').value;
    var expiryDate = document.getElementById('expiryDate').value;
    var discount = document.getElementById('discount').value;
    const formBody = {
        productId: productId,
        productName: productName,
        startDate: startDate,
        expiryDate: expiryDate,
        discount: discount
    }

    if (addProductOfferValidation()) {
        fetch('/admin/product_offers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formBody)
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    document.getElementById("productNameError").textContent = data.error;
                }
                if (data.status) {
                    window.location.href = "/admin/product_offers";
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

function loadEditProductOffer(id) {
    fetch(`/admin/product_offers/edit_product_offers?productOfferId=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.productOfferData) {
                const {
                    productName,
                    startDate,
                    expiryDate,
                    discount
                } = data.productOfferData;

                // Check if HTML element IDs exist before assigning values
                const productNameEdit = document.getElementById(`productNameEdit${id}`);
                const startDateEdit = document.getElementById(`startDateEdit${id}`);
                const expiryDateEdit = document.getElementById(`expiryDateEdit${id}`);
                const discountPercentageEdit = document.getElementById(`discountPercentageEdit${id}`);

                if (productNameEdit && startDateEdit && expiryDateEdit && discountPercentageEdit) {
                    productNameEdit.value = productName || '';
                    startDateEdit.value = formatDate(startDate) || '';
                    expiryDateEdit.value = formatDate(expiryDate) || '';
                    discountPercentageEdit.value = discount || '';
                }
            }
        })
        .catch(error => {
            console.error('Error fetching or parsing data:', error);
        });
}

// Function to format date to yyyy-mm-dd
function formatDate(date) {
    if (!date) return '';

    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
    const day = String(formattedDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}


function EditProductOffer(id) {
    const productNameEdit = document.getElementById(`productNameEdit${id}`).value;
    const startDateEdit = document.getElementById(`startDateEdit${id}`).value;
    const expiryDateEdit = document.getElementById(`expiryDateEdit${id}`).value;
    const discountPercentageEdit = document.getElementById(`discountPercentageEdit${id}`).value;

    const formBody = {
        productName: productNameEdit,
        startDate: startDateEdit,
        expiryDate: expiryDateEdit,
        discount: discountPercentageEdit
    };
    if (editProductOfferValidation(id)) {
        fetch(`/admin/category_offers/edit?categoryOfferId=${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formBody)
        })
            .then(response => response.json())
            .then(data => {
               if(data.status){
                window.location.href = "/admin/product_offers";
               }
            })
            .catch(error => {
                console.error('Error editing product offer:', error);
                // Handle error scenarios here
            });
    }
}

function editProductOfferValidation(id) {
    const productNameEdit = document.getElementById(`productNameEdit${id}`).value;
    const startDateEdit = new Date(document.getElementById(`startDateEdit${id}`).value);
    const expiryDateEdit = new Date(document.getElementById(`expiryDateEdit${id}`).value);
    const discountPercentageEdit = document.getElementById(`discountPercentageEdit${id}`).value;

    // Check if productName is present and not just spaces
    if (!productNameEdit || !productNameEdit.trim()) {
        document.getElementById(`productNameEditError${id}`).textContent = 'Product Name is required and should not be empty.';
        return false;
    } else {
        document.getElementById(`productNameEditError${id}`).textContent = '';
    }

    // Check if startDate is a valid date and today or a future date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set hours to 0 for proper date comparison
    if (isNaN(startDateEdit.getTime()) || startDateEdit < today) {
        document.getElementById(`startDateEditError${id}`).textContent = 'Start date should be today or a future date.';
        return false;
    } else {
        document.getElementById(`startDateEditError${id}`).textContent = '';
    }

    // Check if expiryDate is a valid date and after the startDate
    if (isNaN(expiryDateEdit.getTime()) || expiryDateEdit < startDateEdit) {
        document.getElementById(`expiryDateEditError${id}`).textContent = 'Expiry date should be a valid date and after the start date.';
        return false;
    } else {
        document.getElementById(`expiryDateEditError${id}`).textContent = '';
    }

    // Check if discount is a number greater than or equal to 0
    const parsedDiscount = parseFloat(discountPercentageEdit);
    if (isNaN(parsedDiscount) || parsedDiscount < 0 || parsedDiscount > 100) {
        document.getElementById(`discountPercentageEditError${id}`).textContent = 'Discount should be a number between 0 and 100.';
        return false;
    } else {
        document.getElementById(`discountPercentageEditError${id}`).textContent = '';
    }

    return true;
}
