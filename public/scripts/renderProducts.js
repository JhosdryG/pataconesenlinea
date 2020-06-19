const list = document.getElementById("products_list");

const reload = (pass, urlHash) => {
    console.log('estoy activo');
    fetch('http://localhost:5000/admin/productos/fetch')
    .then(res => res.json())
    .then(res => {
        if(res.status === 200){
            console.log('holas');
            let products = '<ul class="products_list" id="products_list">';
            Object.keys(res.products).map(key => {
                const {imageUrl, title, detailPrice, bigPrice, desc} = res.products[key];
                products += `
                <li class="product" onclick="location.href='/admin/product/${key}?${pass}=${urlHash}'">
                <div class="product_imgbox">
                    <img src=${imageUrl} alt="${title}" class="product_imgbox_img" />
                </div>
                <div class="product_info">
                    <div class="product_info_titlebox">
                        <h3 class="product_info_titlebox_title">
                            ${title}
                        </h3>
                        <span class="product_info_titlebox_price">
                            Precio al detal: ${detailPrice} CLP
                        </span>
                        <span class="product_info_titlebox_price">
                            Precio al mayor: ${bigPrice} CLP
                        </span>
                    </div>
                    <div class="product_info_desc">
                        <p>
                            ${desc}
                        </p>
                    </div>
                </div>
            </li>
                `
            })
            products += '</ul>';
            list.innerHTML = products;
        }
    });
};