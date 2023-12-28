
//.....................add-validateForm.......................
function AddvalidateForm() {
    const categoryname = document.getElementById("categoryname").value;
   
    // Reset error messages
    document.getElementById("categorynameError").textContent = "";

    let valid = true;

    if (categoryname.trim() === "") {
        document.getElementById("categorynameError").textContent = "Category Name is required";
        valid = false;
    } else if (categoryname.length > 32) {
        document.getElementById("categorynameError").textContent = "Category Name should not exceed 32 characters";
        valid = false;
    }

    return valid;
}


//....................addCategory...........................
function addCategory(event) {
    event.preventDefault();
    const categoryname = document.getElementById("categoryname");

    if (AddvalidateForm()) {
        let formData = {
            categoryName: categoryname.value
        }

        fetch("/admin/category", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(formData)
        }).then((response) => response.json()).then((res) => {
            if (res.status) {
                location.href = "/admin/category";
            }
            if (res.err) {
                document.getElementById("categorynameError").textContent = res.err;
            }
        });
    }
}

//..........................loadCategoryitems..............................
function loadCategory(id) {
    window.localStorage.setItem("categoryId", id)
    fetch(`/admin/category/edit-Category/${id}`).then(response => response.json()).then((res) => {
        const loadCategoryData = res.categoryData
        document.querySelector("#Editcategoryname").value = loadCategoryData.category
    })
}
//.....................edit-validateForm.......................
function editvalidateForm() {
    //get form inputs
    const categoryname = document.getElementById("Editcategoryname").value;
    //define regualar expressions


    //reset error messages
    document.getElementById("editcategorynameError").textContent = ""

    let valid = true;
    if (categoryname.trim() === "") {
        document.getElementById("editcategorynameError").textContent = "category Name is required";
        valid = false
    }
    return valid;
}

//.........editCategory...................
function editCategory(event) {
    event.preventDefault()
    const Editcategoryname = document.querySelector("#Editcategoryname").value
    const id = window.localStorage.getItem("categoryId")
    if (editvalidateForm()) {
        const formBody = {
            category: Editcategoryname
        }
        fetch(`/admin/category/edit-Category/${id}`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(formBody)
        }).then(response => response.json()).then((res) => {
            if (res.status) {
                location.href = "/admin/category"
            }
            if (res.err) {
                document.getElementById("editcategorynameError").textContent = res.err;
            }
        })
    }
}