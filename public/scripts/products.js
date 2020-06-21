const getProductPrice = id => {
    const detail = document.getElementById(`${id}-detail`).getAttribute("data-value");
    const big = document.getElementById(`${id}-big`).getAttribute("data-value");
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
        document.getElementById('portal').classList.toggle('active');
    });
})
