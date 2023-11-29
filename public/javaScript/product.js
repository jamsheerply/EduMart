// Form validation
function validateProductForm() {
  const productName = document.getElementById("productName").value;
  const productDescription = document.getElementById("productDescription").value;
  const category = document.getElementById("category").value;
  const publisher = document.getElementById("publisher").value;
  const language = document.getElementById("language").value;
  const status = document.getElementById("status").value;
  const quantity=document.getElementById("quantity").value
  const price = document.getElementById("price").value;

  // Reset error messages
  document.getElementById("productNameError").textContent = "";
  document.getElementById("productDescriptionError").textContent = "";
  document.getElementById("categoryError").textContent = "";
  document.getElementById("publisherError").textContent = "";
  document.getElementById("languageError").textContent = "";
  document.getElementById("statusError").textContent = "";
  document.getElementById("quantityError").textContent=""
  document.getElementById("priceError").textContent = "";

  let valid = true;

  if (productName.trim() === "") {
    document.getElementById("productNameError").textContent = "Product Name is required";
    valid = false;
  }

  if (productDescription.trim() === "") {
    document.getElementById("productDescriptionError").textContent = "Product Description is required";
    valid = false;
  }

  if (category.trim() === "") {
    document.getElementById("categoryError").textContent = "Category is required";
    valid = false;
  }

  if (publisher.trim() === "") {
    document.getElementById("publisherError").textContent = "Publisher is required";
    valid = false;
  }

  if (language.trim() === "") {
    document.getElementById("languageError").textContent = "Language is required";
    valid = false;
  }

  if (status.trim() === "") {
    document.getElementById("statusError").textContent = "Status is required";
    valid = false;
  }

  if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
    document.getElementById("priceError").textContent = "Price must be a number greater than 0";
    valid = false;
}
  if (isNaN(parseFloat(quantity)) || parseFloat(quantity) <= 0) {
    document.getElementById("quantityError").textContent = "quantity must be a number greater than 0";
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
    const quantity=document.getElementById("quantity").value
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
    formData.append("quantity",quantity)
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

function deleteImgAddProduct(input,image){
  document.getElementById(input).value=''
  document.getElementById(image).src='admin/testi-no-image.png'
  // document.getElementById(image).style.display='none'
}


