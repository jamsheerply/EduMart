function editOrderDetail(orderId) {
    const orderStatus = document.getElementById("orderStatus").value;
    const paymentStatus = document.getElementById("paymentStatus").value;

    const formBody = {
        orderStatus: orderStatus,
        paymentStatus: paymentStatus
    };

    fetch(`admin/order/detail/${orderId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formBody)
    })
        .then(response => response.json())
        .then(res => {
            if (res.status) {
                // Reload the page
                location.reload();
            }

        })
        .catch(error => {
            console.error('Error:', error);
        });
}
