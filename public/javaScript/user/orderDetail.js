function cancelOrder(orderId){
    const formBody = {
        orderStatus: "cancelled"
    };

    fetch(`user/order/detail/${orderId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formBody)
    })
    .then(response => response.json())
    .then(res => {
        // Check if the response contains the updated order status
        if (res && res.orderStatus) {
            alert(res.orderStatus); // Display the updated order status
            location.reload(); // Reload the page after the status update
        } else {
            console.error("Unable to retrieve updated order status");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
function returnOrder(orderId){
    const formBody = {
        orderStatus: "returned"
    };

    fetch(`user/order/detail/${orderId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formBody)
    })
    .then(response => response.json())
    .then(res => {
        // Check if the response contains the updated order status
        if (res && res.orderStatus) {
            alert(res.orderStatus); // Display the updated order status
            location.reload(); // Reload the page after the status update
        } else {
            console.error("Unable to retrieve updated order status");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
