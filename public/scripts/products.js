const getProductPrice = id => {
    const detail = $(`${id}-detail`).getAttribute("data-value");
    const big = $(`${id}-big`).getAttribute("data-value");
    return {detail,big};
}

let currentProduct;

// Getting product prices -----------------

// Get all products divs
const products = [...document.getElementsByClassName('product')];

// Const where will be save products prices
const productsPrices = {};

// Saving products prices
products.forEach(product => {
    const productId = product.id;
    productsPrices[productId] = getProductPrice(productId);
});

// Set event to buttons -------

// Get all buttons
const addTocartButtons = [...document.querySelectorAll('.product .button')];

// Set events to each buttons
addTocartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        currentProduct = e.target.getAttribute("data-id");
        setPortal(currentProduct);
        $('portal').classList.toggle('active');
    });
});

// Set cart counter
const cartNumber = JSON.parse(localStorage.getItem('cartCount'));
if(cartNumber){
    $('cart_counter').innerText = cartNumber;
}else{
    $('cart_counter').innerText = 0;

}

function setPortal(product){
    $('portalImage').src = $q(`#${product} img`).src;
    $('portalTitle').innerText = $q(`#${product} h4`).innerText;
    $('portalDesc').innerText = $q(`#${product} .desc`).innerText;
    $('portalTotal').innerText = "Total: " + $(`${product}-detail`).getAttribute('data-value') + " CLP";
    $('productCant').value = 1;
    $('portalAccept').disabled = false;
}

function $(id) {
    return document.getElementById(id);
}


function $q(selector) {
    return document.querySelector(selector);
}
