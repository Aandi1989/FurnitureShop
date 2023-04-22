// Functions.js

// функция проверяющая есть на нашем устройстве тачскрин или нет. изначально 
// была другая более сложная функция, но найти её полный код не удалось
function hasTouchScreen(){
    return 'maxTouchPoints' in navigator && navigator.maxTouchPoints > 0;
}
// как вариант функция возвращающая true если сайт был открыт на мобильном ус-ве
function isMobile(){
    return /Mobi/.test(navigator.userAgent)
}
// функция для удаления класса
function removeClasses(elements, className){
    elements.forEach(function(element){
        element.classList.remove(className);
    });
}
// ibg function
function ibg(){
    let ibg=document.querySelectorAll("._ibg");
    for (var i = 0; i < ibg.length; i++) {
    if(ibg[i].querySelector('img')){
    ibg[i].style.backgroundImage = 'url('+ibg[i].querySelector('img').getAttribute('src')+')';
    }
    }
    }
    ibg();



// /Functions.js

window.onload = function(){ /*функция будет срабатывать когда весь контент на странице загрузится*/
    document.addEventListener("click",documentActions)

    // Actions (делегирование события click)
    function documentActions(e){
        const targetElement = e.target;
        if(window.innerWidth > 767 && isMobile()){
            if(targetElement.classList.contains('menu__arrow')){
                targetElement.closest('.menu__item').classList.toggle('_hover');
            }
            if(!targetElement.closest('.menu__item') && document.querySelectorAll('.menu__item._hover').length > 0){
                removeClasses(document.querySelectorAll('.menu__item._hover'),"_hover")
            }
        }
    }
}
