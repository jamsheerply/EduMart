
//...............orderPagination....................
function orderPagination(orderPageCount) {
  fetch(`admin/orders/pagination/?orderPageCount=${orderPageCount}`)
    .then(response => response.json())
    .then(data => {
      const rows = [];
      if (data.orderData.length > 0) {
        data.orderData.forEach(element => {
          const orderDate = new Date(element.orderDate);
          const options = { day: '2-digit', month: 'long', year: 'numeric' };
          const formattedDate = orderDate.toLocaleDateString('en-US', options);
          const [month,day , year] = formattedDate.split(' ');

          rows.push(
            `<tr>
              <td>${element.orderNumber}</td>
              <td>${element.userId.firstName}</td>
              <td>${element.orderStatus}</td>
              <td>${element.paymentMethod}</td>
              <td>${day}${month},${year}</td>
              <td><a href="admin/order/detail/${element._id}">view details</a></td>
            </tr>`
          );
        });
      }

      const tableContent = `
        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">ORDER ID</th>
                    <th scope="col">USER NAME</th>
                    <th scope="col">STATUS</th>
                    <th scope="col">PAYMENT METHOD</th>
                    <th scope="col">DATE</th>
                    <th scope="col">DETAILS</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows.length > 0 ? rows.join('') : '<tr><td colspan="5">Order Not Found</td></tr>'}
                </tbody>
              </table>
            </div>
          </div>
        </div>`;

      document.getElementById("orderRow").innerHTML = tableContent || '<h1>Data not found</h1>';
      if (data.orderPageNumber) {
        document.querySelector('#orderPageNumber').innerHTML = data.orderPageNumber;
      }
    });
}

  