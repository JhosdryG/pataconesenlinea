let menuButton = document.getElementById('menu_button');
let menu = document.getElementById('alternative-menu');
let menuNormal = document.getElementById('menuNormal');
let startLogo = document.getElementById('startLogo');

menuButton.addEventListener('click', () => {
    if(getComputedStyle(menu).display === 'none'){
        menuNormal.classList.toggle('active');

        if(startLogo.classList.contains('active')){
            startLogo.src = '/img/Devsktop-icon.png'
        }else{
            startLogo.src = '/img/Devsktop-logo.png';
        }
   
        startLogo.classList.toggle('active')

    }else{
        menu.classList.toggle('active');
       
    }
});