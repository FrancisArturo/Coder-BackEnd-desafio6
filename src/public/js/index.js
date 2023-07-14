

const formAdd = document.getElementById("formAdd");
const formEdit = document.getElementById("formEdit");
const formDelete = document.getElementById("formDelete");
const productContainer = document.getElementById("productContainer");

const addProductTitle = document.getElementById("productTitle");
const addProductPrice = document.getElementById("productPrice");
const addProductDescription = document.getElementById("productDesc");
const addProductStock = document.getElementById("productSt");
const addProductCategory = document.getElementById("productCategory");
const addProductStatus = document.getElementById("productStatus");
const addProductCode = document.getElementById("productCode");
const addBtn = document.getElementById("botonAdd");   
const idProduct = document.getElementById("idProduct").innerText;



async function getProducts() {
    const res = await fetch("/api/v1/products");
    const data = await res.json();
    return data;
}

async function addProduct(product) {
    const res = await fetch("/api/v1/products", {
        method: "POST",
        body: JSON.stringify(product),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await res.json();
    return data;
}

const createNewCart = async () => {
    const res = await fetch("/api/v1/carts", {
        method: "POST",
    });
    const data = await res.json();
    cartId = data.data._id;
    // id del cart en el sessionStorage
    sessionStorage.setItem("cartId", cartId);
    return cartId;   
}

const  addCartProduct = async (pid) => {
    let cartId = sessionStorage.getItem("cartId");
    if (!cartId) {
        cartId = await createNewCart();
    }
    const res = await fetch(`/api/v1/carts/${cartId}/products/${pid}`, {
        method: "POST",
    });
    const data = await res.json();
    if (data.message === "Product added successfully") {
        alert("Producto agregado al carrito n° " + cartId);
    }
    return data;
}

addBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const product = {
        title: addProductTitle.value,
        price: addProductPrice.value,
        description: addProductDescription.value,
        stock: addProductStock.value,
        category: addProductCategory.value,
        
        status: addProductStatus.value,
        code: addProductCode.value,
    };
    await addProduct(product);
    addProductTitle.value = "";
    addProductPrice.value = "";
    addProductDescription.value = "";
    addProductStock.value = "";
    addProductCategory.value = "";
    addProductStatus.value = "";
    addProductCode.value = "";
});







