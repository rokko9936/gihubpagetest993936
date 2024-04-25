const CAR_PRODUCTOS = "cartProductsId";


document.addEventListener("DOMContentLoaded", () =>{
    loadProducts();
    loadProductCart();
});

function getProductsDb() {
    const url = "../dbProducts.json";

    return fetch(url).then(response =>{
        return response.json();
    }).then(result =>{
        return result;
    }).catch(err =>{
        console.log(err);
    })
}

async function loadProducts() {
    const products = await getProductsDb();
    let html = '';
    products.forEach(product => {//comienzo del template
        html += ` 
            <div class="col-3 product-container">
                <div class="card product">
                    <img
                        src="${product.img}"
                        class="card-img-top"
                        alt="${product.name}"
                    />
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.extraInfo}</p>
                        <p class="card-text">${product.price} $ / Unidad</p>
                        <button type="button" class="btn btn-primary btn-cart" onClick=(addProductCart(${product.id}))>Añadir al carrito</button>
                    </div>
                </div>
            </div>
        `
    });
    document.getElementsByClassName("products")[0].innerHTML = html; 
}

function openCloseCart() {
    const containerCart = document.getElementsByClassName("cart-products")[0];
    containerCart.classList.forEach(item => {
        if (item === "hidden") {
            containerCart.classList.remove("hidden");
            containerCart.classList.add('active');
        }
        if (item === "active") {
            containerCart.classList.remove('active');
            containerCart.classList.add('hidden');
        }
    });
}

function addProductCart(idProduct) {
    let arrayProductId = [];
    let localStorageItems  = localStorage.getItem(CAR_PRODUCTOS);
    if (localStorageItems === null) {
        arrayProductId.push(idProduct);
        localStorage.setItem(CAR_PRODUCTOS,arrayProductId);
    }else{
        let productsId = localStorage.getItem(CAR_PRODUCTOS);
        if (productsId.length > 0) {
            productsId += "," + idProduct;
        }else{
            productsId = productId;
        }
        localStorage.setItem(CAR_PRODUCTOS, productsId);
        //console.log("Carrito lleno");
        //console.log(localStorage.getItem(CAR_PRODUCTOS));
    }

    loadProductCart();

}

async function loadProductCart() { //funcion asincrona debe esperar a que la fucion get products se complete
    const products = await getProductsDb(); //con await le pedimos que espere a que get producs se complete

    //convertimos el resultado del local store en un array

    const localStorageItems = localStorage.getItem(CAR_PRODUCTOS);
    let html = "";
    if (!localStorageItems) { // si esta vacio
        html = `
            <div class="cart-product empty">
                <p>Carrito vacio</p>
            </div>
        `;
    }else{
    const idProductsSplit = localStorageItems.split(",");

    // eliminamos los ids duplicados

    const idProductsCart = Array.from(new Set(idProductsSplit)); //eliminar duplicados



    idProductsCart.forEach(id => {
        products.forEach(product => {
            if (id == product.id) {
                const quantity = countDuplicateID(id, idProductsSplit);
                const totalPrice = product.price * quantity;
                html += `
                    <div class="cart-product">
                        <img src="${product.img}" alt="${product.name}" />
                        <div class="cart-product-info">
                            <span class="quantity">${quantity}</span>
                            <p>${product.name}</p>
                            <p>${totalPrice.toFixed(2)}</p>
                            <p class="change-quantity">
                                <button onClick="decreaseQuantity(${product.id})">-</button>
                                <button onClick="increaseQuantity(${product.id})">+</button>
                            </p>
                            <p class="cart-product-delete">
                                <button onClick=(deleteProductCart(${product.id}))>Eliminar</button>
                            </p>
                        </div>
                    </div>
                `;
            }
        });
    });

    //console.log(localStorageItems);
        }   

    document.getElementsByClassName('cart-products')[0].innerHTML = html;
}

function deleteProductCart(idProduct) {
    const idProductsCart = localStorage.getItem(CAR_PRODUCTOS);
    const arrayIdPructsCart = idProductsCart.split(',');
    const resultIdDelete = deleteAllIds(idProduct,arrayIdPructsCart);
    if (resultIdDelete) {
        let count = 0;
        let idString = "";

        resultIdDelete.forEach(id => {
            count ++;
            if (count < resultIdDelete.length) {
                idString += id + ',';
            }else{
                idString += id;
            }
        });
        localStorage.setItem(CAR_PRODUCTOS, idString);
    }

    const idsLocalStorage = localStorage.getItem(CAR_PRODUCTOS);
    if (!idsLocalStorage) {
        localStorage.removeItem(CAR_PRODUCTOS);
    }

    loadProductCart();
}

function increaseQuantity(idProduct) {
    const idProductsCart = localStorage.getItem(CAR_PRODUCTOS);
    const arrayIdPructsCart = idProductsCart.split(",");
    arrayIdPructsCart.push(idProduct);

    let count = 0;
    let idString = "";

    arrayIdPructsCart.forEach(id => {
        count++;
        if (count < arrayIdPructsCart.length) {
            idString += id + ",";
        }else{
            idString += id;
        }
    });

    localStorage.setItem(CAR_PRODUCTOS, idString);
    loadProductCart();
}

function decreaseQuantity(idProduct) {
    const idProductsCart = localStorage.getItem(CAR_PRODUCTOS);
    const arrayIdPructsCart = idProductsCart.split(',');

    const deleteItem = idProduct.toString();

    let index = arrayIdPructsCart.indexOf(deleteItem);
    if (index > -1) {
        arrayIdPructsCart.splice(index,1); 
    }

    let count = 0;
    let idString = "";

    arrayIdPructsCart.forEach(id => {
        count++;
        if (count < arrayIdPructsCart.length) {
            idString += id + ",";
        }else{
            idString += id;
        }
    });
    localStorage.setItem(CAR_PRODUCTOS, idString);
    loadProductCart();
}

function countDuplicateID(value, arrayIds) {
    let count = 0;
    arrayIds.forEach(id => {
        if (value == id) {
            count++;
        }
    });
    return count;
}

function deleteAllIds(id, arrayIds) {
    return arrayIds.filter(itemId =>{
        return itemId != id;
    });
}