const { Router } = require('express');
const db = require('./firebase');
const bcrypt = require('bcrypt');
const url = require('url');  



const router = Router();

// Render login view and send param error if login was incorrect

router.get('/login', (req, res) => {
  res.render('login');
});


// Verify in db weher user is correct
// // A promise is used to await for the response in db
  const verifyUser = ({reqUsername, reqPassword}) => {
    return new Promise((resolve, reject) => {
      db.ref('User').once('value',(ss) => {
        const {username, password} = ss.val();
        if(username === reqUsername && password === reqPassword){
          resolve(true);
        }else resolve(false);
      })
    })
  }

//    Authenticate user and log, if incorrect return to login
   router.post('/login', async (req, res) => {
     const valid = await verifyUser(req.body);
     console.log(valid);
     const pass = 'sd68ad1s';
       if(valid){
        bcrypt.hash(pass, 6, (err, hash) => {
          if(err) return err;
          return res.redirect(url.format({
            pathname:"/admin",
            query:{
              [pass]: encodeURIComponent(hash)
            },
          }));
        }); 
       }else{
         res.redirect('/login');
       }
   });


router.get('/admin/logout', (req, res) => {
  res.redirect('/login');
})



//  router.get('/contacts', (req, res) => {
//      db.ref('contacts').once('value', (snapshot) => {

//           data = snapshot.val()
//           res.json(data);        
//      });
//  })

// router.post('/productos', (req,res) => {
//   console.log(req.body);

//   const newProduct = {
//     imageUrl: req.body,
//     title: 'telephono vergatario',
//     price: 80,
//     desc: "lorem impsum tu madre"
//   };
//   db.ref('products').push(newProduct);
//   res.json({
//     status: 200
//   });
// })

// router.post('/new-contact', (req, res) => {
//     const newContact = {
//         firstname: req.body.firstname,
//         lastname: req.body.lastname,
//         email: req.body.email,
//         phone: req.body.phone
//     }
//     db.ref('contacts').push(newContact);
//     res.redirect('/');
// });

// router.get('/delete-contact/:id', (req, res) => {
//     db.ref('contacts/' + req.params.id).remove();
//     res.redirect('/');
// });


// Posibly auth with db to test later ---------------------------------------------

// Verify in db weher user is correct
// //  A promise is used to await for the response in db
//   const verifyUser = ({reqUsername, reqPassword}) => {
//     return new Promise((resolve, reject) => {
//       db.ref('User').once('value',(ss) => {
//         const {username, password} = ss.val();
//         if(username === reqUsername && password === reqPassword){
//           resolve(true);
//         }else resolve(false);
//       })
//     })
//   }



// //   Authenticate user and log, if incorrect return to login
//   router.post('/login', async (req, res) => {
//     const valid = await verifyUser(req.body);
//       if(valid){
//         req.session.log = true;
//         req.session.logError = false;
//         req.session.save();
//         res.redirect('/admin');
//       }else{
//         req.session.log = false;
//         req.session.logError = true;
//         req.session.save();
//         res.redirect('/login');
//       }
//   });

// router.get('/login', (req, res) => {
//   isLogged = req.session.log || false;
//   if(isLogged){
//     res.redirect('/admin')
//   }else{
//     let error = req.session.logError || false;
//     if(error){ 
//       res.render('login', {error});
//     }else {
//       res.render('login');
//     }
//   }
// });


module.exports = router;