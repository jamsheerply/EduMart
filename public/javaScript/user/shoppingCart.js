function plus(cartId, productId) {
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
    })
        .then(response => response.json())
        .then((data) => {
            // alert(JSON.stringify(data.cartData))
            const rows = [];
            if (data.cartData.items) {
                data.cartData.items.forEach(element => {
                    const offerPercentage = Math.max(element.productId.productOffer || 0, element.productId.categoryOffer || 0);
                    const originalPrice = element.productId.price;
                    const discountAmount = (originalPrice * offerPercentage) / 100;
                    const discountedPrice = originalPrice - discountAmount;
                    rows.push(`
                    <tr>
                        <td class="li-product-remove">
                            <a href="user/shopping-cart/delete/${data.cartData._id}/${element.productId._id}">
                                <i class="fa fa-times"></i>
                            </a>
                        </td>
                        <td class="li-product-thumbnail">
                            <a>
                                <img src="${element.productId.imageURL[0].productImage1}" width="100px" height="100px">
                            </a>
                        </td>
                        <td class="li-product-name">
                            <a>${element.productId.productName}</a>
                        </td>
                        <td class="li-product-price">
                            <span class="amount" >&#8377;${discountedPrice.toFixed(2)}</span>
                        </td>
                        <td class="quantity">
                            <div class="number">
                                <span class="minus" onclick="mins('${data.cartData._id}','${element.productId._id}')">-</span>
                                <input type="text" value="${element.quantity}" readonly id="${element.productId._id}_quantity">
                                <span class="plus" onclick="plus('${data.cartData._id}','${element.productId._id}')">+</span>
                            </div>
                        </td>
                        <td class="product-subtotal">
                            <span class="amount" >&#8377;${(discountedPrice * element.quantity).toFixed(2)}</span>
                        </td>
                    </tr>
                `);
                });
            }

            const tableContent = `
            <form>
                <div class="table-content table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th class="li-product-remove">Remove</th>
                                <th class="li-product-thumbnail">Images</th>
                                <th class="cart-product-name">Product</th>
                                <th class="li-product-price">Unit Price</th>
                                <th class="li-product-quantity">Quantity</th>
                                <th class="li-product-subtotal">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows.join('')}
                        </tbody>
                    </table>
                </div>
                <div class="row">
                    <div class="col-md-5 ml-auto">
                     <div class="cart-page-total">
                    <h2>Cart totals</h2>
                     <ul>
                    <li>Subtotal <span id="Subtotal">&#8377; ${data.subtotal.toFixed(2)}</span></li>
                    <li>Total <span id="Total">&#8377; ${data.grandtotal.toFixed(2)}</span></li>
                     </ul>
                <a href="user/address">Proceed to checkout</a>
             </div>
        </div>
    </div>
            </form>
        `;
            document.getElementById("cartRow").innerHTML = tableContent || '<h1>Data not found</h1>';

            // if (data.error) {
            //     alert(data.errorMessage);
            //     // window.location.reload();
            // }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('limit exceeded');
            window.location.reload();
            // Handle other errors here if needed
        });
}


function mins(cartId, productId) {
    const formBody = {
        cartId: cartId,
        productId: productId,
        count: -1
    };

    fetch('/user/shopping-cart/update', {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Corrected typo here
        },
        body: JSON.stringify(formBody)
    })
    .then(response => response.json())
    .then((data) => {
    //    alert(JSON.stringify(data.cartData))
       const rows = [];
            if (data.cartData.items) {
                data.cartData.items.forEach(element => {
                    const offerPercentage = Math.max(element.productId.productOffer || 0, element.productId.categoryOffer || 0);
                    const originalPrice = element.productId.price;
                    const discountAmount = (originalPrice * offerPercentage) / 100;
                    const discountedPrice = originalPrice - discountAmount;
                    rows.push(`
                    <tr>
                        <td class="li-product-remove">
                            <a href="user/shopping-cart/delete/${data.cartData._id}/${element.productId._id}">
                                <i class="fa fa-times"></i>
                            </a>
                        </td>
                        <td class="li-product-thumbnail">
                            <a>
                                <img src="${element.productId.imageURL[0].productImage1}" width="100px" height="100px">
                            </a>
                        </td>
                        <td class="li-product-name">
                            <a>${element.productId.productName}</a>
                        </td>
                        <td class="li-product-price">
                            <span class="amount" >&#8377;${discountedPrice.toFixed(2)}</span>
                        </td>
                        <td class="quantity">
                            <div class="number">
                                <span class="minus" onclick="mins('${data.cartData._id}','${element.productId._id}')">-</span>
                                <input type="text" value="${element.quantity}" readonly id="${element.productId._id}_quantity">
                                <span class="plus" onclick="plus('${data.cartData._id}','${element.productId._id}')">+</span>
                            </div>
                        </td>
                        <td class="product-subtotal">
                            <span class="amount" >&#8377;${(discountedPrice * element.quantity).toFixed(2)}</span>
                        </td>
                    </tr>
                `);
                });
            }

            const tableContent = `
            <form>
                <div class="table-content table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th class="li-product-remove">Remove</th>
                                <th class="li-product-thumbnail">Images</th>
                                <th class="cart-product-name">Product</th>
                                <th class="li-product-price">Unit Price</th>
                                <th class="li-product-quantity">Quantity</th>
                                <th class="li-product-subtotal">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows.join('')}
                        </tbody>
                    </table>
                </div>
                <div class="row">
                    <div class="col-md-5 ml-auto">
                     <div class="cart-page-total">
                    <h2>Cart totals</h2>
                     <ul>
                    <li>Subtotal <span id="Subtotal">&#8377; ${data.subtotal.toFixed(2)}</span></li>
                    <li>Total <span id="Total">&#8377; ${data.grandtotal.toFixed(2)}</span></li>
                     </ul>
                <a href="user/address">Proceed to checkout</a>
             </div>
        </div>
    </div>
            </form>
        `;
            // alert(JSON.stringify(rows))
            document.getElementById("cartRow").innerHTML = tableContent || '<h1>Data not found</h1>';
       
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        alert('its not a valid input');
        window.location.reload();
        // Handle other errors here if needed
    });
}
