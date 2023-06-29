import { useDynamicAdapt } from './dynamicAdaptive/dynamicAdapt.js'
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

// Functions.js --- Spollers
const spollersArray = document.querySelectorAll('[data-spollers]');
if(spollersArray.length > 0){
    // Functions.js --- Spollers---Получение обычных спойлеров
    const spollersRegular = Array.from(spollersArray).filter(function(item, index, self){
        return !item.dataset.spollers.split(",")[0];
    });
    // Functions.js --- Spollers---Инициализация обычных спойлеров
    if(spollersRegular.length > 0){
        initSpollers(spollersRegular);
    }

    // Functions.js --- Spollers---Получение спойлеров с медиа запросами
    const spollersMedia = Array.from(spollersArray).filter(function(item, index, self){
        return item.dataset.spollers.split(",")[0];
    });

    // Functions.js --- Spollers---Инициализация спойлеров с медиа запросами
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

        // Functions.js --- Spollers---Получаем уникальные брейкпоинты
        let mediaQueries = breakpointsArray.map(function(item){
            return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
        });
        mediaQueries = mediaQueries.filter(function(item, index, self){
            return self.indexOf(item) === index;
            console.log(mediaQueries)
        });

        // Functions.js --- Spollers---Работаем с каждым брейкпоинтом 
        mediaQueries.forEach(breakpoint => {
            const paramsArray = breakpoint.split(",");
            const mediaBreakpoint = paramsArray[1];
            const mediaType = paramsArray[2];
            const matchMedia = window.matchMedia(paramsArray[0]);

            // Functions.js --- Spollers---Объекты с нужными условиями
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
    //  Functions.js --- Spollers---Инициализация
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
    // Functions.js --- Spollers---Работа с контентом 
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
// Functions.js --- Spollers---SlideToggle
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

// Functions.js --- DynamicAdaptive

useDynamicAdapt()

// /DynamicAdaptive

// Functions.js --- Load More Products
async function getProducts(button){
    if(!button.classList.contains('_hold')){
        button.classList.add('_hold');
        const file = "json/products.json";
        let response = await fetch(file, {
            method: "GET"
        });
        if(response.ok){
            let result = await response.json();
            loadProducts(result);
            button.classList.remove('_hold');
            button.remove();
        }else{
            alert("Ошибка")
        }
    }
}

function loadProducts(data){
    const productsItems = document.querySelector('.products__items');
    data.products.forEach(item => {
        const productId = item.id;
        const productUrl = item.url;
        const productImage = item.image;
        const productTitle = item.title;
        const productText = item.text;
        const productPrice = item.price;
        const productOldPrice = item.priceOld;
        const productShareUrl = item.shareUrl;
        const productLikeUrl= item.likeUrl;
        const productLabels = item.labels;

        let productTemplateStart = `<article data-pid="${productId}" class="products__item itemProduct">`;
        let productTemplateEnd = `</article>`;

        let productTemplateLabels = '';
        if(productLabels){
            let productTemplateLabelsStart = `<div class="itemProduct__labels">`;
            let productTemplateLabelsEnd = `</div>`;
            let productTemplateLabelsContent = '';

            productLabels.forEach(labelItem => {
                productTemplateLabelsContent += `<div class="itemProduct__label itemProduct__label_${labelItem.type}">${labelItem.value}</div>`
            });

            productTemplateLabels += productTemplateLabelsStart;
            productTemplateLabels += productTemplateLabelsContent;
            productTemplateLabels += productTemplateLabelsEnd;
        }

        let productTemplateImage = `
        <a href="${productUrl}" class="itemProduct__image _ibg">
            <img src="static/images/products/${productImage}" alt="${productTitle}">
        </a>
        `;

            let productTemplateBodyStart = `<div class="itemProduct__body">`;
            let productTemplateBodyEnd = `</div>`;

            let productTemplateContent = `
            <div class="itemProduct__content">
                <h3 class="itemProduct__title">${productTitle}</h3>  
                <div class="itemProduct__text">${productText}</div>  
            </div>
            `;

            let productTemplatePrices = '';
            let productTemplatePricesStart = `<div class="itemProduct__prices">`;
            let productTemplatePricesCurrent = `<div class="itemProduct__price">Rp ${productPrice}</div>`;
            let productTemplatePricesOld = `<div class="itemProduct__price itemProduct__price_old">Rp ${productOldPrice}</div>`;
            let productTemplatePricesEnd = `</div>`;

            productTemplatePrices = productTemplatePricesStart;
            productTemplatePrices += productTemplatePricesCurrent;
            if(productOldPrice){
                productTemplatePrices += productTemplatePricesOld;
            }
            productTemplatePrices += productTemplatePricesEnd;

            let productTemplateAction = `
            <div class="itemProduct__actions actionsProduct">
                <div class="actionsProducts__body">
                    <a href="" class="actionsProducts__button btn btn_white">Add to cart</a>
                    <a href="${productShareUrl}" class="actionsProducts__link _icon-share">Share</a>
                    <a href="${productLikeUrl}" class="actionsProducts__link _icon-favorite">Like</a>
                </div>
            </div>
            `;

            let productTemplateBody = '';
            productTemplateBody += productTemplateBodyStart;
            productTemplateBody += productTemplateContent;
            productTemplateBody += productTemplatePrices;
            productTemplateBody += productTemplateAction;
            productTemplateBody += productTemplateBodyEnd;

            let productTemplate = '';
            productTemplate += productTemplateStart;
            productTemplate += productTemplateLabels;
            productTemplate += productTemplateImage;
            productTemplate += productTemplateBody;
            productTemplate += productTemplateEnd;

            productsItems.insertAdjacentHTML('beforeend', productTemplate);
    });
    ibg(); // вызываем чтобы добавился класс _ibg для подгруженных элементов 
}
// /Functions.js ---Load More Products

// Functions.js --- Add products to cart
function addToCart(productButton, productId){
    if(!productButton.classList.contains('_hold')){
            productButton.classList.add('_hold');
            productButton.classList.add('_fly');

            const cart = document.querySelector('.cartHeader__icon');
            const product = document.querySelector(`[data-pid="${productId}"]`);
            const productImage = product.querySelector('.itemProduct__image');

            const productImageFly = productImage.cloneNode(true);

            // получаем размеры и координаты картинки товара
            const productImageFlyWidth = productImage.offsetWidth; // ширина оригинальной картинки
            const productImageFlyHeight = productImage.offsetHeight; // высота оригинальной картинки
            const productImageFlyTop = productImage.getBoundingClientRect().top; // позиция сверху
            const productImageFlyLeft = productImage.getBoundingClientRect().left; // позиция слева

            // применение полученых размеров для нашего клона
            productImageFly.setAttribute('class', '_flyImage _ibg');
            productImageFly.style.cssText=
            `
            left:${productImageFlyLeft}px;
            top:${productImageFlyTop}px;
            width:${productImageFlyWidth}px;
            height:${productImageFlyHeight}px;
            `;

            document.body.append(productImageFly);

            const cartFlyLeft = cart.getBoundingClientRect().left;
            const cartFlyTop = cart.getBoundingClientRect().top;

            productImageFly.style.cssText =
            `
            left:${cartFlyLeft}px;
            top:${cartFlyTop}px;
            width:0px;
            height:0px;
            opacity:0;
            `;

            productImageFly.addEventListener('transitionend', function(){
                if(productButton.classList.contains('_fly')){
                    productImageFly.remove();
                    updateCart(productButton, productId);
                    productButton.classList.remove('_fly');
                }
            })
    }
}

function updateCart(productButton, productId, productAdd = true){
    const cart = document.querySelector('.cartHeader');
    const cartIcon = cart.querySelector('.cartHeader__icon');
    const cartQuantity = cartIcon.querySelector('span');
    const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`);
    const cartList = document.querySelector('.cartList');

    //Добавляем
    if(productAdd){
        if(cartQuantity){
            cartQuantity.innerHTML = ++cartQuantity.innerHTML;
        }else{
            cartIcon.insertAdjacentHTML('beforeend',`<span>1</span>`);
        }

        if(!cartProduct){
            const product = document.querySelector(`[data-pid="${productId}"]`);
            const cartProductImage = product.querySelector('.itemProduct__image').innerHTML;
            const cartProductTitle = product.querySelector('.itemProduct__title').innerHTML;
            const cartProductContent = `
            <a href="" class="cartList__image _ibg">${cartProductImage}</a>
            <div class="cartList__body">
                <a href="" class="cartList__title">${cartProductTitle}</a>
                <div class="cartList__quantity">Quantity: <span>1</span></div>
                <a href="" class="cartList__delete">Delete</a>
            </div>`;
            cartList.insertAdjacentHTML('beforeend', `<li data-cart-pid="${productId}" class="cartList__item">${cartProductContent}</li>`)
        }else{
            const cartProductQuantity = cartProduct.querySelector('.cartList__quantity span');
            cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;
        }

        // После всех действий
        productButton.classList.remove('_hold');
        ibg();
    }else{
        const cartProductQuantity = cartProduct.querySelector('.cartList__quantity span');
        cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;
        if(!parseInt(cartProductQuantity.innerHTML)){
            cartProduct.remove();
        }

        const cartQuantityValue = --cartQuantity.innerHTML;

        if(cartQuantityValue){
            cartQuantity.innerHTML = cartQuantityValue;
        } else {
            cartQuantity.remove();
            cart.classList.remove('_active')
        }
    }
}

// /Functions.js ---Add products to cart

// /Functions.js

// Swiper ================================================================================================
// BildSlider
let sliders = document.querySelectorAll('._swiper');
if(sliders){
    for(let index = 0; index <sliders.length; index++){
        let slider = sliders[index];
        if(!slider.classList.contains('swiper-bild')){
            let slider_items = slider.children;
            if(slider_items){
                for(let index = 0; index < slider_items.length; index++){
                    let el = slider_items[index];
                    el.classList.add('swiper-slide');
                }
            }
            let slider_content = slider.innerHTML;
            let slider_wrapper = document.createElement('div');
            slider_wrapper.classList.add('swiper-wrapper');
            slider_wrapper.innerHTML = slider_content;
            slider.innerHTML = '';
            slider.appendChild(slider_wrapper);
            slider.classList.add('swiper-bild');

            if(slider.classList.contains('_swiper_scroll')){
                let sliderScroll = document.createElement('div');
                sliderScroll.classList.add('swiper-scrollbar');
                slider.appendChild(sliderScroll);
            }
        }
        if(slider.classList.contains('_gallery')){
            //slider.data('lightGallery').destroy(true);
        }
    }
    sliders_bild_callback();
}

function sliders_bild_callback(params){}

let sliderScrollItems = document.querySelectorAll('._swiper_scroll');
if(sliderScrollItems.length > 0){
    for(let index = 0; index < sliderScrollItems.length; index++){
        const sliderScrollItem = sliderScrollItems[index];
        const sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar');
        const sliderScroll = new Swiper(sliderScrollItem,{
            observer:true,
            observeParents:true,
            direction:'vertical',
            slidesPerView:'auto',
            freeMode:true,
            scrollbar:{
                el:sliderScrollBar,
                draggable:true,
                snapOnRelease:false
            },
            mousewheel:{
                releaseOnEdges:true,
            },
        });
        sliderScroll.scrollbar.updateSize();
    }
}

// function sliders_bild_callback(params){}

// Main slider (the first one)
if(document.querySelector('.sliderMain__body')){
    new Swiper('.sliderMain__body', {
        observer:true,
        observeParents:true,
        slidesPerView:1,
        spaceBetween:32,
        watchOverflow:true,
        speed:800,
        loop:true,
        loopAdditionalSlides:5,
        preloadImages:false,
        parallax:true,
        //Dots
        pagination:{
            el:'.controlsSliderMain__dots',
            clickable:true,
        },
        //Arrows
        navigation:{
            nextEl:'.sliderMain .sliderArrow_next',
            prevEl:'.sliderMain .sliderArrow_prev',
        }
    });
}

// Rooms slider (the second one)
if(document.querySelector('.sliderRooms__body')){
    new Swiper('.sliderRooms__body', {
        observer:true,
        observeParents:true,
        slidesPerView:'auto',
        spaceBetween:24,
        speed:800,
        loop:true,
        watchOverflow:true,
        loopAdditionalSlides:5,
        preloadImages:false,
        parallax:true,
        //Dots
        pagination:{
            el:'.sliderRooms__dots',
            clickable:true,
        },
        //Arrows
        navigation:{
            nextEl:'.sliderRooms .sliderArrow_next',
            prevEl:'.sliderRooms .sliderArrow_prev',
        }
    });
}

// /Swiper ================================================================================================

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
        // Подгрузка файлов из json файла
        if(targetElement.classList.contains('products__more')){
            getProducts(targetElement);
            e.preventDefault();
        }
        // Добавление товара в корзину
        if(targetElement.classList.contains('actionsProducts__button')){
            const productId = targetElement.closest('.itemProduct').dataset.pid;
            addToCart(targetElement, productId);
            ibg();
            e.preventDefault();
        }
        // Появление  списка товаров корзины
        if(targetElement.classList.contains('cartHeader__icon') || targetElement.closest('.cartHeader__icon')){
            if(document.querySelector('.cartList').children.length > 0){
                document.querySelector('.cartHeader').classList.toggle('_active');
            }
            e.preventDefault();
        }else if(!targetElement.closest('.cartHeader') && !targetElement.classList.contains('actionsProduct__button')){
            document.querySelector('.cartHeader').classList.remove('_active')
        }
        // Удаление из корзины
        if(targetElement.classList.contains('cartList__delete')){
            const productId = targetElement.closest('.cartList__item').dataset.cartPid;
            updateCart(targetElement, productId, false);
            e.preventDefault();
        }

    }

    // Header
    const headerElememnt = document.querySelector('.header');

    const callback = function (entries, observer){
        if(entries[0].isIntersecting){
            headerElememnt.classList.remove('_scroll');
        }else{
            headerElememnt.classList.add('_scroll');
        }
    };

    const headerObserver = new IntersectionObserver(callback); // есть отдельное видео. вкратце: при прокрутке добавляется на высоту header добавляется класс _scroll
    headerObserver.observe(headerElememnt);


}


