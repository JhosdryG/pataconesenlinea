let menuButton = document.getElementById('menu_button');
let menu = document.getElementById('alternative-menu');
let menuNormal = document.getElementById('menuNormal');

menuButton.addEventListener('click', () => {
    console.log(getComputedStyle(menu).display);
    if(getComputedStyle(menu).display === 'none'){
        menuNormal.classList.toggle('active'); 
    }else{
        menu.classList.toggle('active');
       
    }
    
});