function $(id){
    return document.getElementById(id);
}
// Set cart counter
const cartNumber = JSON.parse(localStorage.getItem('cartCount'));
if(cartNumber){
    $('cart_counter').innerText = cartNumber;
}else{
    $('cart_counter').innerText = 0;
}

// render cart
const cartDiv = $('cart');
let currentCartData;

if(!cartNumber || cartNumber === 0){
    cartDiv.innerHTML = `
        <p class="no_products" >Actualmente no hay productos</p>
    `;
}else{

   const inCart = JSON.parse(localStorage.getItem('cart'));
   // console.log(inCart);
    // Laru0410
    const info = {
            method: 'POST',
            body: JSON.stringify({inCart}),
            headers:{
                'Content-Type': 'application/json'
            }
        }
    
    //dev
    const url = 'http://localhost:5000/cart';
    // production
    //const url = 'https://pataconesenlinea.web.app/cart';

    fetch(url,info)
    .then( res => res.json())
    .then(res => {

        if(res.status === 200){
            currentCartData = res.cartData;
            renderCart(currentCartData);
        }
    }).catch(err => {
        console.log(err);
    })
}

function renderCart(cartData){
    const {cart, total} = cartData;
    let cartList = '<div class="cart-products">';
    
    Object.keys(cart).forEach( key => {
        const {desc,title,productTotal,amount,url200} = cart[key];
        cartList += `
        
            <div class="cart-product">
                <img src=${url200} alt=${title} class="cart-product-img">
                <div class="cart-product-info">
                    <h4>${title}</h4>
                    <div class="info-product">
                        <p>Paquete</p>
                        <p class="cart-info-r">${desc}</p>
                    </div>
        
                    <div class="info-product">
                        <p>Cantidad</p>
                        <p class="cart-info-r">${amount}</p>
                    </div>
        
                    <div class="info-product">
                        <p>Precio total: </p>
                        <p class="cart-info-r">${productTotal} CLP</p>
                    </div>
                    <button onClick="removeProduct('${key}')">Retirar</button>
                </div>
            </div>
        `;
    });

    cartList += '</div>';

    cartList += `
    <div class="cart-r">
    <div class="order">
        <div class="order-summary">
            <p>Resumen del pedido</p>
        </div>

        <div class="order-data">
            <div class="total">
                <p>Total</p>
                <p class="total-r">${total} CLP</p>
            </div>
            <p class="order-qt">${Object.keys(cart).length} Productos</p>
        </div>
        <div class="order-button">
            <a href="/sale" class="button">Realiza tu pedido</a>
        </div>
    </div>
    <img src="/img/Platanos.png" alt="platanos-logo">
</div>
    `;

    cartDiv.innerHTML = cartList;
}


function removeProduct(key){
    // Get to remove from localStorage
    let leftInCart = removeFromStorage(key);
    // Set cart icon number
    $('cart_counter').innerText = leftInCart;
    // remove from current data
    removeFromCurrentCart(key);
    if(leftInCart > 0){
        renderCart(currentCartData);
    }else{
        cartDiv.innerHTML = `
        <p class="no_products" >Actualmente no hay productos</p>
    `;
    }
}

function removeFromStorage(key){
    let leftInCart = 0;
    let local = JSON.parse(localStorage.getItem('cart'));
    delete local[key];
    leftInCart = Object.keys(local).length;
    local = JSON.stringify(local);
    localStorage.setItem('cart',local);
    localStorage.setItem('cartCount',leftInCart);
    return leftInCart;
}

function removeFromCurrentCart(key){
    let {cart, total} = currentCartData;
    total -= cart[key].productTotal;
    delete cart[key];
    currentCartData = {cart, total};
}

