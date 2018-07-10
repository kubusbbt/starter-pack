export default function navComponent(){
    var hamburger = document.querySelector('.nav-hamburger');
    var listItems = document.querySelector('.nav-items');

    window.addEventListener('click', function(e){   
        if (hamburger.contains(e.target)){
            hamburger.classList.toggle('open');
            document.body.classList.toggle('menuopen');
        } else{
            hamburger.classList.remove('open');
            document.body.classList.remove('menuopen');
        }
    });
}