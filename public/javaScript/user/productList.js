
function sortProductList(selectElement) {
    let selectedValue = selectElement.options[selectElement.selectedIndex].value;
    if (selectedValue === "nameA") {
        productListSort("productName", 1)
    }
    if (selectedValue === "nameZ") {
        productListSort("productName", -1)
    }
    if (selectedValue === "priceLow") {
        productListSort("price", 1)
    }
    if (selectedValue === "priceHigh") {
        productListSort("price", -1)
    }
}

function productListSort(sortBy, order) {
    fetch(`/user/product-list/${sortBy}/${order}`)
        .then(response => response.json())
        .then(data => {
            const tableSort = document.getElementById("tableSort");
            if (data.product.length > 0) {
                tableSort.innerHTML = ''; // Clear existing content
                data.product.forEach(element => {
                    const productHTML = `
                        <div class="col-lg-4 col-md-4 col-sm-6 mt-40">
                            <!-- single-product-wrap start -->
                            <div class="single-product-wrap">
                                <div class="product-image">
                                    <a href="/user/product-detail?id=${element._id}">
                                        <img src="${element.imageURL[0].productImage1}" alt="">
                                    </a>
                                    <!-- <span class="sticker">New</span> -->
                                </div>
                                <div class="product_desc">
                                    <div class="product_desc_info">
                                        <div class="product-review">
                                            <h5 class="manufacturer">
                                                <a>${element.category}</a>
                                            </h5>
                                            <div class="rating-box">
                                                <ul class="rating">
                                                    <li><i class="fa fa-star-o"></i></li>
                                                    <li><i class="fa fa-star-o"></i></li>
                                                    <li><i class="fa fa-star-o"></i></li>
                                                    <li class="no-star"><i class="fa fa-star-o"></i></li>
                                                    <li class="no-star"><i class="fa fa-star-o"></i></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <h4><a class="product_name">${element.productName}</a></h4>
                                        <div class="price-box">
                                            <span class="new-price">&#8377;${element.price}</span>
                                        </div>
                                    </div>
                                    <!-- <div class="add-actions">
                                        <ul class="add-actions-link">
                                            <li class="add-cart active"><a href="shopping-cart.html">Add to cart</a></li>
                                            <li><a href="#" title="quick view" class="quick-view-btn" data-toggle="modal" data-target="#exampleModalCenter"><i class="fa fa-eye"></i></a></li>
                                            <li><a class="links-details" href="wishlist.html"><i class="fa fa-heart-o"></i></a></li>
                                        </ul>
                                    </div> -->
                                </div>
                            </div>
                            <!-- single-product-wrap end -->
                        </div>`;
                    tableSort.insertAdjacentHTML('beforeend', productHTML);
                });
            } else {
                tableSort.innerHTML = `<p>No products found.</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching or displaying products:', error);
        });
}

// Define the productListFilter function first
const productListFilter = () => {
    const categories = Array.from(
        document.querySelectorAll('input[name="category"]:checked')
    ).map((checkbox) => checkbox.value);
    const prices = Array.from(
        document.querySelectorAll('input[name="price"]:checked')
    ).map((checkbox) => checkbox.value);

    // Assuming `brands` and `sortedBy` are defined somewhere

    fetch(
        `/user/product-list/filter/?category=${categories.join(",")}&price=${prices.join(",")}`
    )
        .then((response) => response.json())
        .then((data) => {
            const tableSort = document.getElementById("tableSort");
            if (data.product.length > 0) {
                tableSort.innerHTML = ''; // Clear existing content
                data.product.forEach(element => {
                    const productHTML = `
                        <div class="col-lg-4 col-md-4 col-sm-6 mt-40">
                            <!-- single-product-wrap start -->
                            <div class="single-product-wrap">
                                <div class="product-image">
                                    <a href="/user/product-detail?id=${element._id}">
                                        <img src="${element.imageURL[0].productImage1}" alt="">
                                    </a>
                                    <!-- <span class="sticker">New</span> -->
                                </div>
                                <div class="product_desc">
                                    <div class="product_desc_info">
                                        <div class="product-review">
                                            <h5 class="manufacturer">
                                                <a>${element.category}</a>
                                            </h5>
                                            <div class="rating-box">
                                                <ul class="rating">
                                                    <li><i class="fa fa-star-o"></i></li>
                                                    <li><i class="fa fa-star-o"></i></li>
                                                    <li><i class="fa fa-star-o"></i></li>
                                                    <li class="no-star"><i class="fa fa-star-o"></i></li>
                                                    <li class="no-star"><i class="fa fa-star-o"></i></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <h4><a class="product_name">${element.productName}</a></h4>
                                        <div class="price-box">
                                            <span class="new-price">&#8377;${element.price}</span>
                                        </div>
                                    </div>
                                    <!-- <div class="add-actions">
                                        <ul class="add-actions-link">
                                            <li class="add-cart active"><a href="shopping-cart.html">Add to cart</a></li>
                                            <li><a href="#" title="quick view" class="quick-view-btn" data-toggle="modal" data-target="#exampleModalCenter"><i class="fa fa-eye"></i></a></li>
                                            <li><a class="links-details" href="wishlist.html"><i class="fa fa-heart-o"></i></a></li>
                                        </ul>
                                    </div> -->
                                </div>
                            </div>
                            <!-- single-product-wrap end -->
                        </div>`;
                    tableSort.insertAdjacentHTML('beforeend', productHTML);
                });
            } else {
                tableSort.innerHTML = `<p>No products found.</p>`;
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};

// Add event listeners after the productListFilter function is defined
document.querySelectorAll('input[name="category"],input[name="price"]').forEach((input) => {
    input.addEventListener("change", productListFilter);
});

function productListPagination(pageNumber) {
    // Assuming pageNumber is passed as an argument to this function
    // alert(pageNumber); // Display the page number (you can remove this in the final code)

    // Make a fetch request to the server with the pageNumber parameter
    fetch(`/user/product-list/pagination/?pageNumber=${pageNumber}`)
        .then(response => {
            return response.json(); // Return the response.json() promise
        })
        .then(data => {
            if (data.product.length > 0) {
                tableSort.innerHTML = ''; // Clear existing content
                data.product.forEach(element => {
                    const productHTML = `
                        <div class="col-lg-4 col-md-4 col-sm-6 mt-40">
                            <!-- single-product-wrap start -->
                            <div class="single-product-wrap">
                                <div class="product-image">
                                    <a href="/user/product-detail?id=${element._id}">
                                        <img src="${element.imageURL[0].productImage1}" alt="">
                                    </a>
                                    <!-- <span class="sticker">New</span> -->
                                </div>
                                <div class="product_desc">
                                    <div class="product_desc_info">
                                        <div class="product-review">
                                            <h5 class="manufacturer">
                                                <a>${element.category}</a>
                                            </h5>
                                            <div class="rating-box">
                                                <ul class="rating">
                                                    <li><i class="fa fa-star-o"></i></li>
                                                    <li><i class="fa fa-star-o"></i></li>
                                                    <li><i class="fa fa-star-o"></i></li>
                                                    <li class="no-star"><i class="fa fa-star-o"></i></li>
                                                    <li class="no-star"><i class="fa fa-star-o"></i></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <h4><a class="product_name">${element.productName}</a></h4>
                                        <div class="price-box">
                                            <span class="new-price">&#8377;${element.price}</span>
                                        </div>
                                    </div>
                                    <!-- <div class="add-actions">
                                        <ul class="add-actions-link">
                                            <li class="add-cart active"><a href="shopping-cart.html">Add to cart</a></li>
                                            <li><a href="#" title="quick view" class="quick-view-btn" data-toggle="modal" data-target="#exampleModalCenter"><i class="fa fa-eye"></i></a></li>
                                            <li><a class="links-details" href="wishlist.html"><i class="fa fa-heart-o"></i></a></li>
                                        </ul>
                                    </div> -->
                                </div>
                            </div>
                            <!-- single-product-wrap end -->
                        </div>`;
                    tableSort.insertAdjacentHTML('beforeend', productHTML);
                });
                if (data.pageNumber) {
                    document.querySelector('#pageNumber1').innerHTML = data.pageNumber;
                    document.querySelector('#pageNumber2').innerHTML = data.pageNumber;
                }

            } else {
                tableSort.innerHTML = `<p>No products found.</p>`;
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            // Handle errors here (e.g., display an error message to the user)
        });
}

function productListSearch() {
    const productListSearch = document.getElementById('productListSearch').value;

    fetch(`/user/product-list/search/?productListSearch=${productListSearch}`)
        .then(response => response.json()) // Parse response as JSON
        .then(data => {
            if (data.product.length > 0) {
                tableSort.innerHTML = ''; // Clear existing content
                data.product.forEach(element => {
                    const productHTML = `
                        <div class="col-lg-4 col-md-4 col-sm-6 mt-40">
                            <!-- single-product-wrap start -->
                            <div class="single-product-wrap">
                                <div class="product-image">
                                    <a href="/user/product-detail?id=${element._id}">
                                        <img src="${element.imageURL[0].productImage1}" alt="">
                                    </a>
                                    <!-- <span class="sticker">New</span> -->
                                </div>
                                <div class="product_desc">
                                    <div class="product_desc_info">
                                        <div class="product-review">
                                            <h5 class="manufacturer">
                                                <a>${element.category}</a>
                                            </h5>
                                            <div class="rating-box">
                                                <ul class="rating">
                                                    <li><i class="fa fa-star-o"></i></li>
                                                    <li><i class="fa fa-star-o"></i></li>
                                                    <li><i class="fa fa-star-o"></i></li>
                                                    <li class="no-star"><i class="fa fa-star-o"></i></li>
                                                    <li class="no-star"><i class="fa fa-star-o"></i></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <h4><a class="product_name">${element.productName}</a></h4>
                                        <div class="price-box">
                                            <span class="new-price">&#8377;${element.price}</span>
                                        </div>
                                    </div>
                                    <!-- <div class="add-actions">
                                        <ul class="add-actions-link">
                                            <li class="add-cart active"><a href="shopping-cart.html">Add to cart</a></li>
                                            <li><a href="#" title="quick view" class="quick-view-btn" data-toggle="modal" data-target="#exampleModalCenter"><i class="fa fa-eye"></i></a></li>
                                            <li><a class="links-details" href="wishlist.html"><i class="fa fa-heart-o"></i></a></li>
                                        </ul>
                                    </div> -->
                                </div>
                            </div>
                            <!-- single-product-wrap end -->
                        </div>`;
                    tableSort.insertAdjacentHTML('beforeend', productHTML);
                });
                if (data.pageNumber) {
                    document.querySelector('#pageNumber1').innerHTML = data.pageNumber;
                    document.querySelector('#pageNumber2').innerHTML = data.pageNumber;
                }

            } else {
                tableSort.innerHTML = `<p>No products found.</p>`;
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            // Handle errors here (e.g., display an error message to the user)
        });
}
