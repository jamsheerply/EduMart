
function plus(cartId, productId) {

    const unitPriceElement = document.getElementById(`${productId}UnitPrice`);
    const quantityElement = document.getElementById(`${productId}quantity`);

    // Get the text content and remove non-numeric characters
    const unitPriceText = unitPriceElement.textContent.replace(/[^\d.]/g, '');

    // Parse the text content to a numeric value
    const unitPrice = parseFloat(unitPriceText);
    const quantityValue = parseFloat(quantityElement.value);
    // console.log(unitPrice,quantityValue)

    // console.log(unitPrice * (quantityValue + 1))
    const totalElement = document.getElementById(`${productId}total`);
    totalElement.innerHTML = `&#8377 ${unitPrice * (quantityValue + 1)}`;

    const formBody = {
        cartId: cartId,
        productId: productId,
        count: 1
    };

    fetch('/user/shopping-cart/update', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formBody)
    }).then(response => response.json()).then((res) => {
        if (res.subtotal) {
            document.getElementById("Subtotal").textContent = res.subtotal;
            document.getElementById("Total").textContent = res.subtotal;
        }
    });
}


function mins(cartId, productId) {

    const unitPriceElement = document.getElementById(`${productId}UnitPrice`);
    const quantityElement = document.getElementById(`${productId}quantity`);

    
    // Get the text content and remove non-numeric characters
    const unitPriceText = unitPriceElement.textContent.replace(/[^\d.]/g, '');
    
    // Parse the text content to a numeric value
    const unitPrice = parseFloat(unitPriceText);
    const quantityValue = parseFloat(quantityElement.value);
 
    if (quantityValue === 1) {
        // Do not perform any action if the quantity is already 1
        return;
    }

    const totalElement = document.getElementById(`${productId}total`);
    totalElement.innerHTML = `&#8377 ${unitPrice * (quantityValue -1)}`;

    const formBody = {
        cartId: cartId,
        productId: productId,
        count:-1
    };

    fetch('/user/shopping-cart/update', {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Corrected typo here
        },
        body: JSON.stringify(formBody)
    }).then(response => response.json()).then((res) => {
        if (res.subtotal) {
            document.getElementById("Subtotal").textContent = res.subtotal;
            document.getElementById("Total").textContent = res.subtotal;
        }
    });
}

