

// Initalizate Firebase app
const getFirebase = async () => {
    // production
    //const certFetch = await fetch('https://pataconesenlinea.web.app/admin/cert');
    // dev
    const certFetch = await fetch('http://localhost:5000/admin/cert');
    const cert = await certFetch.json();
    await firebase.initializeApp(cert);
};
getFirebase();


const validateForm = (setkey) => {

    let testFile;
    if(setkey) testFile = true;
    else testFile =  document.getElementById('image').files[0];
    
    // Validate form has not empty values
    if(
        getValue('title').trim() !== '' &&
        getValue('detailPrice').trim() !== '' &&
        getValue('bigPrice').trim() !== '' &&
        getValue('desc').trim() !== '' &&
        testFile
    ){
        // Validate detailPrice is higher than bigPrice
        if(
            parseInt(getValue('detailPrice').trim(), 10)  
            > 
            parseInt(getValue('bigPrice').trim(), 10))  {
            return true;
        }
        else{
            console.log(getValue('detailPrice').trim());
            console.log(getValue('bigPrice').trim());
            Swal.fire({
                title: 'El precio al por mayor debe ser menor al precio por Detal',
                icon: 'warning'
            });
        return false;
        }
        
    }else{
        Swal.fire({
            title: 'Debe rellenar todos los campos',
            icon: 'warning'
        });
        return false;
    }
}

// Save the file path
let file;

// Defiene wether is an create or update operation
let key;

// Executes when form is submited
const onSubmit = (setkey) => {
    if(!validateForm(setkey)) return null;
    // Set key
    key = setkey;
    // Get file
    file = document.getElementById('image').files[0];

    // Si es añadir producto o es uno ya existente pero va a cambiar la imagen
    if(!key || (key && file) ){
        let storageRef = firebase.storage().ref('products/' + file.name);
        // Upload file
        Swal.fire({
            title: 'Cargando producto...',
            text: 'Esto puede demorar un momento.',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading();
            }
        });
        const task = storageRef.put(file);
        task.on('state_changed', null, onLoadError, onLoadImage);
    }else if(!file){
        onLoadImage();
    }
};


// Task functions
const onLoadError = err => console.log(err); 
const onLoadImage = async () => { 
        Swal.fire({
            title: 'Comprimiendo imagen...',
            text: 'Esto puede demorar un momento.',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading();
            }
        });
    const product = await getProductData();
    fetchData(product);
}

// Get input values and resize image download url
const getProductData = () => new Promise(async (resolve, reject) => {
    let url200;
    let url400;
    if(file){
        console.log('Empizo');
        url200 = await getResizeUrl('_200x200');
        url400 = await getResizeUrl('_400x400');
        console.log('termino');
    }else{
        url200 = document.getElementById("smallImage").innerText;
        url400 = document.getElementById("productImage").src;
    }
    const product = {
        url200,
        url400,
        title: getValue('title'),
        detailPrice: getValue('detailPrice'),
        bigPrice: getValue('bigPrice'),
        desc: getValue('desc')
    }
    resolve(product);
});

// Get the resize donwload url of te specified size
const getResizeUrl = size => new Promise( async (resolve, reject) => {
    let resizeUrl = getResizeFilename(file, size);
    let storageRef = firebase.storage().ref().child('products/' + resizeUrl);
    resolve(await keepTrying(10, storageRef));
});

const getResizeFilename = (file, size) => {
    const imageExt = '.' + file.name.split('.').pop();
    return file.name.replace(imageExt, size + imageExt);
};



// Post product to firebase db
const fetchData = product => {
    // Production
    //const fetchUrl = 'https:///pataconesenlinea.web.app/admin/product/';   
    // Development    
    const fetchUrl = 'http://localhost:5000/admin/product';
    const info = fetchInfoConstructor(product);
    
    Swal.fire({
        title: 'Guardando producto...',
        text: 'Esto puede demorar un momento.',
        allowOutsideClick: false,
        onBeforeOpen: () => {
            Swal.showLoading();
        }
     });

    // Fetch product to db
    fetch(fetchUrl, info)
    .then(res => res.json())
    .then(res => {
        if(res.status === 200){
            Swal.fire({
                title: 'Producto guardado correctamente',
                text: "Tal vez deba esperar unos minutos antes de ver reflejados los cambios.",
                icon: 'success',
                allowOutsideClick: false,
                preConfirm: () => {
                    if(key){
                        document.getElementById("productImage").src = product.url400;
                    }else{
                        clearField();
                    }
                    
                }
            });
        }else if(res.status === 500){
            Swal.fire({
                title: 'Ha ocurrido un error',
                text: res.err,
                icon: 'error',
                allowOutsideClick: false,
                preConfirm: () => {
                    clearField();
                }
            });
        }
    }).catch(err => {
        Swal.fire({
            title: 'Ha ocurrido un error',
            text: err,
            icon: 'error',
            allowOutsideClick: false,
            preConfirm: () => {
                clearField();
            }
        });
    })
}

const fetchInfoConstructor = product => {
    let info;

    // !key theres no such a product so create it
    if(!key){
        info = {
            method: 'POST',
            body: JSON.stringify({product, isValid: true}),
            headers:{
                'Content-Type': 'application/json'
            }
        }
    }else{
        info = {
            method: 'PUT',
            body: JSON.stringify({product: {...product, key}, isValid: true}),
            headers:{
                'Content-Type': 'application/json'
            }
        }
    }

    return info;
}

const deleteProduct = (key, pass, urlHash) => {
    console.log('hola bebe');

    const info = {
        method: 'DELETE',
        body: JSON.stringify({key, isValid: true}),
        headers:{
            'Content-Type': 'application/json'
        }
    }
    // Production
    //const fetchUrl = 'https:///pataconesenlinea.web.app/admin/product/';   
    // Development    
    const fetchUrl = 'http://localhost:5000/admin/product';

    Swal.fire({
        title: '¿Está seguro?',
        text: "Esta acción es irreversible",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        allowOutsideClick: false,
        preConfirm: () => {
            return fetch(fetchUrl,info)
            .then(res => res.json())
            .then(res => {
                console.log('hola mundo');
                if(res.status === 200){
                    // something
                  Swal.fire({
                      title: 'Producto eliminado correctamente',
                      text: "Tal vez deba esperar unos minutos antes de ver reflejados los cambios.",
                      icon: 'success',
                      allowOutsideClick: false,
                      preConfirm: () => {
                          location.href = `/admin/productos?${pass}=${urlHash}`;
                      }  
                  });
                }else if (res.status === 500){
                    // something else
                    Swal.fire({
                      title: 'Ha ocurrido un error',
                      text: res.err,
                      icon: 'error',
                      allowOutsideClick: false
                  });
                }
            });
        }
      });
}


const clearField = () => {
    document.getElementById('image').value = "";
    document.getElementById('title').value = "";
    document.getElementById('detailPrice').value = "";
    document.getElementById('bigPrice').value = "";
    document.getElementById('desc').value = "";
}

const getValue = id => document.getElementById(id).value;

// Functions to get the resize donwload url
// it keeps trying until it's availlabel
function delay(t, v) {
    return new Promise(function(resolve) { 
        setTimeout(resolve.bind(null, v), t)
    });
};

function keepTrying(triesRemaining, storageRef) {
    if (triesRemaining < 0) {
        return  Swal.fire({
                title: 'Tiempo límite excedido',
                text: 'Verifique su conexión e intente nuevamente',
                icon: 'error',
                allowOutsideClick: false,
                preConfirm: () => {
                    clearField();
            }
        });
    }

    return storageRef.getDownloadURL().then((url) => {
        return url;
    }).catch((error) => {
        switch (error.code) {
            case 'storage/object-not-found':
                return delay(5000).then(() => {
                    return keepTrying(triesRemaining - 1, storageRef)
                });
            default:
                console.log(error);
                return Promise.reject(error);
        }
    });
}


// Allows only number on price inputs
function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
        textbox.addEventListener(event, function() {
        if (inputFilter(this.value)) {
            this.oldValue = this.value;
            this.oldSelectionStart = this.selectionStart;
            this.oldSelectionEnd = this.selectionEnd;
        } else if (this.hasOwnProperty("oldValue")) {
            this.value = this.oldValue;
            this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        } else {
            this.value = "";
        }
        });
    });
}

setInputFilter(document.getElementById("detailPrice"), function(value) {
    return /^\d*\.?\d*$/.test(value); // Allow digits and '.' only, using a RegExp
});
setInputFilter(document.getElementById("bigPrice"), function(value) {
    return /^\d*\.?\d*$/.test(value); // Allow digits and '.' only, using a RegExp
});
