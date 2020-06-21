const cantInput = document.getElementById('productCant');
const portalTotal = document.getElementById('portalTotal');
const portalAccept = document.getElementById('portalAccept');
const portalClose = document.getElementById('portalClose');
const portal = document.getElementById('portal');

cantInput.addEventListener('keyup', (e) => {
    const key = e.key;
    const noNumberRegex = /^[0-9]*$/;
    const detailLimit = 5;  

    if(!noNumberRegex.test(key) && e.keyCode !== 8){
        return e.preventDefault();
    }

    let total = 0;
    let cant = parseInt(cantInput.value, 10);

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

portalAccept.addEventListener('click', () => {

    if(cantInput.value.trim().length > 0 && parseInt(cantInput.value,10) > 0){
        console.log('Hola bebe');
    }
})
