function addToCart(productId) {
    const formBody = {
        productId: productId
    }
    fetch('/user/shopping-cart', {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formBody)
    }).then(response => response.json()).then((res) => {
        if (res.status) {
            location.href = "/user/shopping-cart"
        }
        // if (res.err) {
        //     document.getElementById("editcategorynameError").textContent = res.err;
        // }
    })
}
