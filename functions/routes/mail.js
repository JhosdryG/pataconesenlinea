const { Router } = require('express');
const router = Router();
const nodemailer = require('nodemailer');


router.post('/sale', (req, res) => {

    const {name, apellido, email, telefono, direccion, referencia, mensaje} = req.body.form;
    const {cart,total} = req.body; 
    

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
        
        ${mensaje}
    `


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'devsktop@gmail.com',
          pass: 'bbtgacbotvhllxlw'
        }
    });

    const mailOptions = {
        from: 'devsktop@gmail.com',
        to: 'devsktop@gmail.com',
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


module.exports = router;