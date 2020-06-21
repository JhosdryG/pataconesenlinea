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
})


router.get('/cart', (req,res) => {
    res.render('cart');
});

router.get('/sale', (req,res) => {
    res.render('sale');
});

module.exports = router;