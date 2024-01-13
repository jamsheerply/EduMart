
// Form validation
function validateProductForm() {
  const productName = document.getElementById("productName").value;
  const productDescription = document.getElementById("productDescription").value;
  const category = document.getElementById("category").value;
  const publisher = document.getElementById("publisher").value;
  const language = document.getElementById("language").value;
  const status = document.getElementById("status").value;
  const quantity = document.getElementById("quantity").value
  const price = document.getElementById("price").value;

  // Reset error messages
  document.getElementById("productNameError").textContent = "";
  document.getElementById("productDescriptionError").textContent = "";
  document.getElementById("categoryError").textContent = "";
  document.getElementById("publisherError").textContent = "";
  document.getElementById("languageError").textContent = "";
  document.getElementById("statusError").textContent = "";
  document.getElementById("quantityError").textContent = ""
  document.getElementById("priceError").textContent = "";

  let valid = true;

  if (productName.trim() === "") {
    document.getElementById("productNameError").textContent = "Product Name is required";
    valid = false;
  } else if (productName.length > 150) {
    document.getElementById("productNameError").textContent = "Product Name should not exceed 150 characters";
    valid = false;
  }

  if (productDescription.trim() === "") {
    document.getElementById("productDescriptionError").textContent = "Product Description is required";
    valid = false;
  } else if (productDescription.length > 1000) {
    document.getElementById("productDescriptionError").textContent = "Product should not exceed 1000 characters";
    valid = false;
  }

  if (category.trim() === "") {
    document.getElementById("categoryError").textContent = "Category is required";
    valid = false;
  }

  if (publisher.trim() === "") {
    document.getElementById("publisherError").textContent = "Publisher is required";
    valid = false;
  } else if (publisher.length > 50) {
    document.getElementById("publisherError").textContent = "Publisher should not exceed 50 characters";
    valid = false;
  }

  if (language.trim() === "") {
    document.getElementById("languageError").textContent = "Language is required";
    valid = false;
  } else if (language.length > 20) {
    document.getElementById("languageError").textContent = "Language should not exceed 20 characters";
    valid = false;
  }

  if (status.trim() === "") {
    document.getElementById("statusError").textContent = "Status is required";
    valid = false;
  }

  if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
    document.getElementById("priceError").textContent = "Price must be a number greater than 0";
    valid = false;
  } else if (price.length > 10) {
    document.getElementById("priceError").textContent = "Price should not exceed 10 characters";
    valid = false;
  }

  if (isNaN(parseFloat(quantity)) || parseFloat(quantity) < 0) {
    document.getElementById("quantityError").textContent = "quantity must be a number greater than 0";
    valid = false;
  }else if (quantity.length > 5) {
    document.getElementById("quantityError").textContent = "quantity should not exceed 10 characters";
    valid = false;
  }


  return valid;
}

// Image file validation
function validateImageFiles() {
  const productImage1 = document.getElementById("productImage1").files[0];
  const productImage2 = document.getElementById("productImage2").files[0];
  const productImage3 = document.getElementById("productImage3").files[0];
  const productImage4 = document.getElementById("productImage4").files[0];

  // Reset image error messages
  document.getElementById("productImage1Error").textContent = "";
  document.getElementById("productImage2Error").textContent = "";
  document.getElementById("productImage3Error").textContent = "";
  document.getElementById("productImage4Error").textContent = "";

  let valid = true;

  if (!productImage1) {
    document.getElementById("productImage1Error").textContent = "Image  is required";
    valid = false;
  }

  if (!productImage2) {
    document.getElementById("productImage2Error").textContent = "Image  is required";
    valid = false;
  }

  if (!productImage3) {
    document.getElementById("productImage3Error").textContent = "Image  is required";
    valid = false;
  }

  if (!productImage4) {
    document.getElementById("productImage4Error").textContent = "Image  is required";
    valid = false;
  }

  return valid;
}

//............add product........
function addProduct(event) {
  event.preventDefault();
  if (validateProductForm() && validateImageFiles()) {
    const productImage1 = document.getElementById("productImage1").files[0];
    const productImage2 = document.getElementById("productImage2").files[0];
    const productImage3 = document.getElementById("productImage3").files[0];
    const productImage4 = document.getElementById("productImage4").files[0];
    const productName = document.getElementById("productName").value;
    const productDescription = document.getElementById("productDescription").value;
    const publisher = document.getElementById("publisher").value;
    const language = document.getElementById("language").value;
    const category = document.getElementById("category").value;
    const status = document.getElementById("status").value;
    const quantity = document.getElementById("quantity").value
    const price = document.getElementById("price").value;

    const formData = new FormData();
    formData.append("productImage1", productImage1);
    formData.append("productImage2", productImage2);
    formData.append("productImage3", productImage3);
    formData.append("productImage4", productImage4);
    formData.append("productName", productName);
    formData.append("productDescription", productDescription);
    formData.append("publisher", publisher);
    formData.append("language", language);
    formData.append("category", category);
    formData.append("status", status);
    formData.append("quantity", quantity)
    formData.append("price", price);

    // Make a POST request to the server
    fetch("/admin/add-product", {
      method: "POST",
      body: formData
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.status) {
          location.href = "/admin/products";
        }
        if (res.err) {
          document.getElementById("productNameError").textContent = res.err;
        }
      });
  }
}

//..........edit product...........
function editProduct(id) {
  event.preventDefault();
  if (validateProductForm()) {
    const productImage1 = document.getElementById("productImage1").files[0];
    const productImage2 = document.getElementById("productImage2").files[0];
    const productImage3 = document.getElementById("productImage3").files[0];
    const productImage4 = document.getElementById("productImage4").files[0];
    const productName = document.getElementById("productName").value;
    const productDescription = document.getElementById("productDescription").value;
    const publisher = document.getElementById("publisher").value;
    const language = document.getElementById("language").value;
    const category = document.getElementById("category").value;
    const status = document.getElementById("status").value;
    const quantity = document.getElementById("quantity").value;
    const price = document.getElementById("price").value;

    const formData = new FormData();
    formData.append("productImage1", productImage1);
    formData.append("productImage2", productImage2);
    formData.append("productImage3", productImage3);
    formData.append("productImage4", productImage4);
    formData.append("productName", productName);
    formData.append("productDescription", productDescription);
    formData.append("publisher", publisher);
    formData.append("language", language);
    formData.append("category", category);
    formData.append("status", status);
    formData.append("quantity", quantity);
    formData.append("price", price);

    // Make a POST request to the server
    fetch(`/admin/edit-product/${id}`, {
      method: "POST",
      body: formData
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.status) {
          location.href = "/admin/products";
        }
        if (res.err) {
          document.getElementById("productNameError").textContent = res.err;
        }
      });
  }
}



//..............image preview.........
function previewImage(input, imageId) {

  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      // document.getElementById(imageId).style.display='block'
      document.getElementById(imageId).src = event.target.result;
      input.style.display = "none"; // Hide the input tag
    };
    reader.readAsDataURL(file);
  }
}

function deleteImgAddProduct(input, image) {
  document.getElementById(input).value = ''
  document.getElementById(image).src = 'admin/testi-no-image.png'
  // document.getElementById(image).style.display='none'
}

//......................productPagination.............................
function productPagination(productPageCount) {
  fetch(`/admin/products/pagination/?productPageCount=${productPageCount}`)
    .then(response => response.json())
    .then(data => {
      const rows = [];
      if (data.product.length > 0) {
        data.product.forEach((element) => {
          rows.push(
            `<tr>
            <td>${element.productName}</td>
            <td><img src="${element.imageURL[0].productImage1}"
                style="height: 50px; width:50px;" alt=""></td>
            <td>${element.category}</td>
            <td>${element.price}</td>
            <td>${element.status}</td>
            <td>${element.productAdded}</td>
            <td><a href="/admin/edit-product?id=${element._id}"><i class="fa-solid fa-pen-to-square"></i></a></td>
            ${element.isdeleted ?
              `<td><i class="fa-solid fa-trash-can" data-toggle="modal"
              data-target="#exampleModalCenterdelete${element._id}"></i></td>
              <!-- Modal -->
              <div class="modal fade" id="exampleModalCenterdelete${element._id}" tabindex="-1" role="dialog"
                aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLongTitle">Delete Product</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                      Are you sure you want to Delete this Product?
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-success" data-dismiss="modal">Cancel</button>
                      <a href="/admin/delete-product?id=${element._id}"><button type="button"
                          class="btn btn-danger">Delete</button></a>
                    </div>
                  </div>
                </div>
              </div>` :
              `<td><a><i class="fa-solid fa-rotate-right" data-toggle="modal"
              data-target="#exampleModalCenterrecover${element._id}"></i></a></td>
              <!-- Modal -->
              <div class="modal fade" id="exampleModalCenterrecover${element._id}" tabindex="-1" role="dialog"
                aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLongTitle">Recover Product</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                      Are you sure you want to Recover this Product?
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>
                      <a href="/admin/recover-product?id=${element._id}"><button type="button"
                          class="btn btn-success">Recover</button></a>
                    </div>
                  </div>
                </div>
              </div>`}
          </tr>`);
        });
      }

      const tableContent = `
        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">PRODUCT NAME</th>
                    <th scope="col">IMAGE</th>
                    <th scope="col">CATEGORY</th>
                    <th scope="col">PRICE</th>
                    <th scope="col">STATUS</th>
                    <th scope="col">ADDED ON</th>
                    <th scope="col">EDIT</th>
                    <th scope="col">DELETE</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows.length > 0 ? rows.join('') : '<tr><td colspan="5">Product Not Found</td></tr>'}
                </tbody>
              </table>
            </div>
          </div>
        </div>`;

      document.getElementById("productTableRow").innerHTML = tableContent || '<h1>Data not found</h1>';

      if (data.productPageNumber) {
        document.querySelector('#productPageNumber').innerHTML = data.productPageNumber;
      }
    });
}
