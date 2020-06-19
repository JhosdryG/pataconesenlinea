const db = require('./firebase');
const { Router } = require('express');
const {verifyLog} = require('./middlewares');
const url = require('url'); 

const router = Router();

router.get('/admin/cert', (req,res) => {
    db.ref('cert').once('value', (snapshot) => {
        const data = snapshot.val();
        res.json(data); 
    });
})

router.get('/admin', verifyLog, (req, res) => {
    const pass = 'sd68ad1s';
    const urlHash = decodeURIComponent(req.query[pass]);
    res.render('admin', {urlHash,pass});
 });

// Products section --------------------------------------

// Render products page
router.get('/admin/productos', verifyLog, (req, res) => {
    const pass = 'sd68ad1s';
    const urlHash = decodeURIComponent(req.query[pass]);

    db.ref('products').on('value', (snapshot) => {
        const products = snapshot.val();
        res.render('productos', {products, pass, urlHash}); 
        db.ref('products').off("value");
    });
    
})

// Render add product page
router.get('/admin/products/add', verifyLog, (req, res) => {
    const pass = 'sd68ad1s';
    const urlHash = decodeURIComponent(req.query[pass]);
    res.render('addProduct', {urlHash,pass});
 });

// Add new product
router.post('/admin/product', (req, res) => {
    const isValid = req.body.isValid;

    if(!isValid) return res.redirect('/login');
     
    const newProduct = req.body.product;

    db.ref('products').push(newProduct).then(e => {
        return res.json({
            status: 200
       });
    }).catch( err => {
        return res.json({
            status: 500,
            err
       });
    })
});

// get product
router.get('/admin/product/:id', verifyLog,  (req, res) => {

    const pass = 'sd68ad1s';
    const urlHash = decodeURIComponent(req.query[pass]);
    const key = req.params.id;

    db.ref('products/' + key).on('value', (snapshot) => {
        const data = snapshot.val();
        if(data){

            res.render('addProduct', {data, urlHash, pass, key} );
            

        }else{

            res.redirect(url.format({
                pathname:"/admin/productos",
                query:{
                  [pass]: encodeURIComponent(urlHash)
                },
              }));

        }
        db.ref('products/' + key).off('value');
    });
});

// Edit product

router.put('/admin/product', (req, res) => {
    const isValid = req.body.isValid;

    if(!isValid) return res.redirect('/login');
     
    const product = req.body.product;
    const key = product.key;
    delete product.key;

    db.ref('products/' + key).set(product).then(e => {
        return res.json({
            status: 200
       });
    }).catch( err => {
        return res.json({
            status: 500,
            err
       });
    })
});

// delete product
router.delete('/admin/product',  (req, res) => {

    const isValid = req.body.isValid;

    if(!isValid) return res.redirect('/login');

    const key = req.body.key;

    db.ref('products/' + key).remove().then(e => {
        return res.json({status: 200});
    }).catch(err => {
        res.json({
            status: 500,
            err
        });
    });
});

module.exports = router;