const currentCart = JSON.parse(localStorage.getItem('cart'));

// First render of incart products
if(currentCart){
    Object.keys(currentCart).forEach( key => {
        $(key).classList.add('incart');
        $q(`#${key} button`).disabled = true;
        $q(`#${key} button`).innerText = 'Ya en el carrito';
    });
}

const cantInput = $('productCant');
const portalTotal = $('portalTotal');
const portalAccept = $('portalAccept');
const portalClose = $('portalClose');
const portal = $('portal');


// Validates only numbers
cantInput.addEventListener('keypress', (e) => {
    const key = e.key;
    const noNumberRegex = /^[0-9]*$/;

    if(!noNumberRegex.test(key) && e.keyCode !== 8){
        e.preventDefault();
        return null;
    }
});


// Extra validations and calc of the price
cantInput.addEventListener('keyup', (e) => {
    let total = 0;
    let cant = parseInt(cantInput.value, 10);
    const detailLimit = 5; 

    if(cant > 20){
        cantInput.value = 20;
    }

    cant = parseInt(cantInput.value, 10);
    
    if(cant > 0 && cant <= detailLimit){
        total = productsPrices[currentProduct].detail * cant;
    }else if(cant > 0 && cant > detailLimit){
        total = productsPrices[currentProduct].big * cant;
    }
    
    portalTotal.innerText = `Total: ${total} CLP`; 
    if(total < 1) portalAccept.disabled = true;
    else portalAccept.disabled = false;
});

portalClose.addEventListener('click', () => {
    portal.classList.toggle('active');
});

// Triggers when a product is bought
portalAccept.addEventListener('click', () => {

    if(cantInput.value.trim().length > 0 && parseInt(cantInput.value,10) > 0){    
        addToCart();
        updateCartCount();
        updateInterface();
    }
});

function addToCart(){
    const productAmount = { [currentProduct] : cantInput.value };
    const inCart = JSON.parse(localStorage.getItem('cart'));
    const toCart = {...inCart, ...productAmount};
    localStorage.setItem('cart', JSON.stringify(toCart));
}

function updateInterface(){
    portal.classList.toggle('active');
    $q(`#${currentProduct} button`).disabled = true;
    $q(`#${currentProduct} button`).innerText = 'Ya en el carrito';
    $(currentProduct).classList.toggle('incart');
}

function updateCartCount(){
    const cartNumber = JSON.parse(localStorage.getItem('cartCount'));
    if(!cartNumber){
        localStorage.setItem('cartCount',"1");
        $('cart_counter').innerText = "1";
    }else{
        const number = parseInt(cartNumber,10) + 1;
        localStorage.setItem('cartCount', JSON.stringify(number));
        $('cart_counter').innerText = number;
    }
}
