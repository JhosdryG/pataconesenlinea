const db = require('./firebase');
const { Router } = require('express');
const router = Router();


router.get('/', (req,res) => {
    res.render('index');
});


router.get('/products', (req, res) => {
    db.ref('products').on('value', (snapshot) => {
        const products = snapshot.val();
        res.render('products', {products}); 
        db.ref('products').off("value");
    });
});

router.get('/cart', (req,res) => {
    res.render('cart');
});

router.get('/sale', (req,res) => {
    res.render('sale');
});

router.post('/cart', async (req, res) => {
    const products = req.body.inCart;
   

    try {
        const cartData = await dataLoop(products);
        res.json({
            status: 200,
            cartData
        });
    } catch (error) {
        res.json({
            status: 500,
            error
        });
    }

});

const dataLoop = products => new Promise( (resolve, reject) => {
    let total = 0;
    let cart = {};
    counter = 0;
    const keysArr = Object.keys(products);
    keysArr.map( async key => {
        const amount = products[key];
        try {
            const data = await getData(key, amount);
            counter++;
            total += data.productTotal;
            cart[key] = data;
            if(counter === keysArr.length){
                resolve({total, cart});
            }
        } catch (err) {
            reject(err);
        }
    });
});

const getData = (key, amount) => new Promise((resolve, reject) => {

    const breakpoint = 5;
    amount = parseInt(amount, 10);

    db.ref('products/' + key).on('value', (snapshot) => {

        const {desc, title, bigPrice, detailPrice, url200} = snapshot.val();
        let price = 0;

        if(amount > breakpoint){
            price = bigPrice;

        }else{
            price = detailPrice;
        }

        const productTotal = price * amount;

        cart ={desc,title,productTotal,amount,url200}

        db.ref('products').off("value");

        resolve(cart);

    }, (err) => {
        db.ref('products').off("value");
        reject(err);
    });
});

module.exports = router;