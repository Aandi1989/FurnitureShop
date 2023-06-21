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

// Spollers
const spollersArray = document.querySelectorAll('[data-spollers]');
if(spollersArray.length > 0){
    // Получение обычных спойлеров
    const spollersRegular = Array.from(spollersArray).filter(function(item, index, self){
        return !item.dataset.spollers.split(",")[0];
    });
    // Инициализация обычных спойлеров
    if(spollersRegular.length > 0){
        initSpollers(spollersRegular);
    }

    // Получение спойлеров с медиа запросами
    const spollersMedia = Array.from(spollersArray).filter(function(item, index, self){
        return item.dataset.spollers.split(",")[0];
    });

    // Инициализация спойлеров с медиа запросами
    if(spollersMedia.length > 0){
        const breakpointsArray = [];
        spollersMedia.forEach(item => {
            const params = item.dataset.spollers;
            const breakpoint = {};
            const paramsArray = params.split(",");
            breakpoint.value = paramsArray[0];
            breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
            breakpoint.item = item;
            breakpointsArray.push(breakpoint);
        });

        // Получаем уникальные брейкпоинты
        let mediaQueries = breakpointsArray.map(function(item){
            return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
        });
        mediaQueries = mediaQueries.filter(function(item, index, self){
            return self.indexOf(item) === index;
            console.log(mediaQueries)
        });

        // Работаем с каждым брейкпоинтом 
        mediaQueries.forEach(breakpoint => {
            const paramsArray = breakpoint.split(",");
            const mediaBreakpoint = paramsArray[1];
            const mediaType = paramsArray[2];
            const matchMedia = window.matchMedia(paramsArray[0]);

            // Объекты с нужными условиями
            const spollersArray = breakpointsArray.filter(function(item) {
                if(item.value === mediaBreakpoint && item.type === mediaType){
                    return true;
                }
            });
            // Событие
            matchMedia.addListener(function(){
                initSpollers(spollersArray, matchMedia);
            });
            initSpollers(spollersArray, matchMedia);
        });
    }
    //  Инициализация
    function initSpollers(spollersArray, matchMedia = false){
        spollersArray.forEach(spollersBlock => {
            spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
            if(matchMedia.matches || !matchMedia){
                spollersBlock.classList.add('_init');
                initSpollerBody(spollersBlock);
                spollersBlock.addEventListener("click", setSpollerAction);
            }else{
                spollersBlock.classList.remove('_init');
                initSpollerBody(spollersBlock, false);
                spollersBlock.removeEventListener("click", setSpollerAction);
            }
        });
    }
    // Работа с контентом 
    function initSpollerBody(spollersBlock, hideSpollerBody = true){
        const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
        if(spollerTitles.length > 0){
            spollerTitles.forEach(spollerTitle => {
                if(hideSpollerBody){
                    spollerTitle.removeAttribute('tabindex');
                    if(!spollerTitle.classList.contains('_active')){
                        spollerTitle.nextElementSibling.hidden = true;
                    }
                }else{
                    spollerTitle.setAttribute('tabindex', '-1');
                    spollerTitle.nextElementSibling.hidden = false;
                }
            });
        }
    }
    function setSpollerAction(e){
        const el = e.target;
        if(el.hasAttribute('data-spoller') || el.closest('[data-spoller]')){
            const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
            const spollersBlock = spollerTitle.closest('[data-spollers]');
            const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
            if(!spollersBlock.querySelectorAll('._slide').length){
                if(oneSpoller && !spollerTitle.classList.contains('_active')){
                    hideSpollersBody(spollersBlock);
                }
                spollerTitle.classList.toggle('_active');
                _slideToggle(spollerTitle.nextElementSibling,500);
            }
            e.preventDefault();
        }
    }
    function hideSpollersBody(spollersBlock){
        const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
        if(spollerActiveTitle){
            spollerActiveTitle.classList.remove('_active');
            _slideUp(spollerActiveTitle.nextElementSibling, 500)
        }
    }
}

// =============================================================
// SlideToggle
let _slideUp = (target, duration = 500) => {
    if(!target.classList.contains('_slide')){
        target.classList.add('_slide');
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = target.offsetHeight + 'px';
        target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() => {
            target.hidden = true;
            target.style.removeProperty('height');
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
        },duration);
    }
}
let _slideDown = (target, duration = 500) => {
    if(!target.classList.contains('_slide')){
        if(target.hidden){
            target.hidden = false;
        }
        let height = target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = height + 'px';
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        window.setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
        },duration)
    }
}
let _slideToggle = (target, duration = 500) => {
    if(target.hidden){
        return _slideDown(target, duration);
    } else{
        return _slideUp(target, duration);
    }
}

/*
Для родителя спойлеров пишем атрибут data-spollers
Для заголовков спойлеров пишем атрибут data-spoller
Если нужно включать/выключать работу спойлеров на разных размерах экранов
пишем параметры ширины и типа брейкпоинта.
Например: 
data-spollers="992,max" - спойлеры будут работать только на экранах меньше или равно 992px
data-spollers="768,min" - спойлеры будут работать только на экранах больше или равно 768px
Если нужно что бы в блоке открывался только один спойлер добавляем атрибут data-one-spoller
*/ 



// /Functions.js

window.onload = function(){ /*функция будет срабатывать когда весь контент на странице загрузится*/
    document.addEventListener("click",documentActions)

    // Actions (делегирование события click)
    function documentActions(e){
        const targetElement = e.target;
        // выпадающие списки пунктов products и rooms
        if(window.innerWidth > 767 && isMobile()){
            if(targetElement.classList.contains('menu__arrow')){
                targetElement.closest('.menu__item').classList.toggle('_hover');
            }
            if(!targetElement.closest('.menu__item') && document.querySelectorAll('.menu__item._hover').length > 0){
                removeClasses(document.querySelectorAll('.menu__item._hover'),"_hover")
            }
        }
        // выпадающий по клюку инпут поиска
        if(targetElement.classList.contains('searchForm__icon')){
            document.querySelector('.searchForm').classList.toggle('_active');   
        }else if(!targetElement.closest('.searchForm') && document.querySelector('.searchForm._active')){
            document.querySelector('.searchForm').classList.remove('_active');  
        }
        // Burger menu
        if(targetElement.closest('.iconMenu')){
            document.querySelector('.iconMenu').classList.toggle('_active'); 
            document.querySelector('.menu__body').classList.toggle('_active'); 
            document.body.classList.toggle('_lock'); 
            console.log(document.querySelector('.menu__body').classList)
        }
        // выпадающие списки Footer
        if(targetElement.classList.contains('menuFooter__title_menu')){
            document.querySelector('.menuFooter__arrow_menu').classList.toggle('_active'); 
        }
        if(targetElement.classList.contains('menuFooter__title_account')){
            document.querySelector('.menuFooter__arrow_account').classList.toggle('_active'); 
        }
        if(targetElement.classList.contains('menuFooter__title_connected')){
            document.querySelector('.menuFooter__arrow_connected').classList.toggle('_active'); 
        }
    }
}
