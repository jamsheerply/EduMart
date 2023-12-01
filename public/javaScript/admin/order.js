
//...............orderPagination....................
function orderPagination(orderPageCount) {
    fetch(`admin/orders/pagination/?orderPageCount=${orderPageCount}`)
      .then(response => response.json())
      .then(data => {
        const rows = [];
        if (data.orderData.length > 0) {
          data.orderData.forEach((element) => {
            rows.push(
              `<tr>
                <td>${element._id}</td>
                <td>${element.userId.firstName}</td>
                <td>${element.orderStatus}</td>
                <td>${element.paymentMethod}</td>
                <td>${element.orderDate}</td>
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
  