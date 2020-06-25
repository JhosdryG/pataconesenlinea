const { Router } = require('express');
const router = Router();
const nodemailer = require('nodemailer');
const db = require('./firebase');

const mailCredentials = new Promise((resolve,reject) => {
  db.ref('zoho').once('value',(ss) => {
    const {user, pass} = ss.val();
      resolve({user, pass});
  })
});

router.post('/sale', async (req, res) => {

    const {name, apellido, email, telefono, direccion, referencia, mensaje, check} = req.body.form;
    const {cart,total} = req.body; 
    
    const {user, pass} = await mailCredentials;

    let renderCart = '';

    Object.keys(cart).forEach(key => {
        renderCart += `
        Producto: ${cart[key].title}
        cantidad: ${cart[key].amount}

        `
    });

    renderCart += 'Total: ' + total + "CLP";

    renderCart += `

        Información del cliente: 
        Nombre: ${name} ${apellido}
        Correro: ${email}
        Telefono: ${telefono}
        Dirección: ${direccion}
        Referencia de pago: ${referencia}

        Delivery: ${check ? 'SI' : 'NO'}
        
        ${mensaje}
    `


    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {user, pass}
  });

    const mailOptions = {
        from: '"Orden de productos" <bot@pataconesenlinea.cl>',
        to: 'contacto@pataconesenlinea.cl',
        subject: 'Nueva orden de productos',
        text: renderCart
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.send({
              status: 500,
              error
          });
        } else {
          res.send({
              status: 200,
              info
          });
        }
      });
});


router.post('/contact', async (req, res) => {

  const {name,email,telefono,mensaje} = req.body;

  const {user, pass} = await mailCredentials;

  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {user, pass}
});

  const message = `
    ${mensaje}

    Información de contacto:
    Nombre: ${name}
    Telefono: ${telefono}
    Correo: ${email}
  `;

const mailOptions = {
    from: '"Solicitud de contacto" <bot@pataconesenlinea.cl>',
    to: 'contacto@pataconesenlinea.cl',
    subject: 'Solicitud de contacto',
    text: message
};


transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.redirect('/');
    } else {
      res.redirect('/');
    }
  });
})

module.exports = router;