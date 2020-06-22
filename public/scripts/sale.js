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

// render sale
const sale = $('saleRender');
let currentCartData;

if(!cartNumber || cartNumber === 0){
    sale.innerHTML = `
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
    //const url = 'https://jgp-admin/cart';

    fetch(url,info)
    .then( res => res.json())
    .then(res => {

        if(res.status === 200){
            currentCartData = res.cartData;
            renderSale(currentCartData);
        }
    }).catch(err => {
        console.log(err);
    })
}

function renderSale(cartData){
    const {cart, total} = cartData;
    sale.innerHTML = template(total);
}

function template(total) {
return `
<div class="platanito-u">
    <img src="/img/Platano.png" alt="">
</div>

    <div class="sale-contact">
    <form action="" class="form-sale">
        <label for="name">Nombre:</label>
        <input type="text" id="name" placeholder="Inserta tu nombre" required>

        <label for="apellido">Apellido:</label>
        <input type="text" id="apellido" placeholder="Inserta tu apellido" required>

        <label for="email">Email:</label>
        <input type="email" id="email" placeholder="Inserta tu email" required>

        <label for="telefono">Teléfono:</label>
        <input type="tel" id="telefono" placeholder="Inserta tu teléfono" required>

        <label for="direccion">Dirección:</label>
        <input type="text" id="direccion" placeholder="Inserta tu dirección" required>

        <label for="referencia">Número de referencia bancaria:</label>
        <input type="text" id="referencia" placeholder="Inserta el número de referencia bancaria" required>

        <label for="mensaje">Mensaje:</label>
        <textarea name="" id="mensaje" cols="30" rows="10"></textarea>

        <div class="sale-total">
            <p>Total a pagar</p>
            <p>${total} CLP</p>
        </div>

        <input type="submit" class="button sale-bt">
    </div>

    <div class="sale-process">
    <div class="sale-info">
        <h4>Datos Bancarios</h4>
        <p>Elizabeth Urdaneta 26.814.385-8 <br>
            elizabethurdaneta66@gmail.com <br>
            +56 954351213</p>
        <p>Banco Santander <br>
            Cuenta Corriente # 74-97737-5</p>
        <p>Banco estado <br>
            Cuenta Rut: 26.814.385-8</p>
    </div>

    <div class="steps">

        <div class="step">
            <p class="circle">1</p>
            <p class="instruction">Realiza la transferencia</p>
        </div>

        <div class="step">
            <p class="circle">2</p>
            <p class="instruction">Rellenar el formulario de venta</p>
        </div>

        <div class="step">
            <p class="circle">3</p>
            <p class="instruction">Pulsar el botón "ENVIAR"</p>
        </div>
    </div>
    </div>

    <div class="platanito-b">
    <img src="/img/Platanotlf.png" alt="">
    </div>
</div>
`;
}


