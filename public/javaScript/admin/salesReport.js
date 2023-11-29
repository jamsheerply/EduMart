function fillerDate() {
  const dateFrom = document.getElementById('dateFrom').value;
  const dateTo = document.getElementById('dateTo').value;
  const dateError = document.getElementById('dateError');

  dateError.textContent = ''; // Clear previous error messages

  if (!dateFrom || !dateTo) {
    dateError.textContent = 'Please select both "from" and "to" dates.';
    return;
  }

  const fromDate = new Date(dateFrom);
  const toDate = new Date(dateTo);
  const today = new Date();

  if (toDate > today) {
    dateError.textContent = 'The "to" date cannot be greater than today.';
    return;
  }

  if (fromDate > toDate) {
    dateError.textContent = 'The "from" date cannot be greater than the "to" date.';
    return;
  }

  const formBody = {
    dateFrom: dateFrom,
    dateTo: dateTo
  };

  fetch("admin/sales-report/filler", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formBody)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(res => {
      // alert(JSON.stringify(res.data))
      const rows = [];
      let counter = 0; // Initialize a counter variable

      res.data.forEach((data) => {
        data.populatedProducts.forEach((product) => {
          const orderIdString = String(data._id);
          const lastFourDigits = orderIdString.slice(-4);
          const orderDate = new Date(data.date);
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          const formattedDate = orderDate.toLocaleDateString('en-US', options);

          rows.push(`
          <tr>
            <td>${++counter}</td> <!-- Increment the counter for each row -->
            <td>${product.productName}</td>
            <td>${lastFourDigits}</td>
            <td>${data.populatedUser[0].firstName}</td>
            <td>${formattedDate}</td>
            <td>${data.products[0].quantity}</td>
            <td>${product.price*data.products[0].quantity}</td>
            <td>${data.paymentStatus}</td>
            <td>${data.orderStatus}</td>
          </tr>`);
        });
      });

      const tableContent = `
      <div class="col-12">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Product</th>
                <th>Order Id</th>
                <th>User</th>
                <th>Order Date</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Payment Status</th>
                <th>Order Status</th>
              </tr>
            </thead>
            <tbody>
              ${rows.length > 0 ? rows.join('') : `
                <tr>
                  <td colspan="9" style="text-align: center; font-size: xx-large;">Sales Not Found</td>
                </tr>`
        }
            </tbody>
          </table>
        </div>
      </div>`;

      document.getElementById("tb_row").innerHTML = tableContent || `<h1>Data not found</h1>`;

      console.log('Response from server:', res);
      // Add your code to handle the response here
    })
    .catch(error => {
      console.error('There was a problem sending the data:', error);
    });
}

function handleDownload(selectElement) {
  let selectedValue = selectElement.options[selectElement.selectedIndex].value;
  if (selectedValue === 'Pdf') {
    downloadPdf();
  } else if (selectedValue === 'Excel') {
    downloadExcel();
  }
}

function downloadPdf() {
  alert("pdf vvv");
}

function downloadExcel() {
  fetch('/admin/sales-report/report_excel_download')
    .then(response => response.json())
    .then(data => {
    if(data.status){
      window.location.href="/admin/download"
    }
    })
    .catch(error => {
      // Handle errors here
      console.error('There was a problem with the fetch operation:', error);
    });
}

