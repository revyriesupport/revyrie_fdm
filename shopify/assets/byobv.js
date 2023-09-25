const byobUtilsDefaultTo = (value, defaultValue) => {
    return (value == null || value !== value) ? defaultValue : value
};
const byobCurrencyFormatMoney = (e, t) => {
    "string" == typeof e && (e = e.replace(".", ""));
    var a = "", n = /\{\{\s*(\w+)\s*\}\}/, i = t || window.byo.amount;
    function o(e, t, a, n) {
        if (t = byobUtilsDefaultTo(t, 2),
        a = byobUtilsDefaultTo(a, ","),
        n = byobUtilsDefaultTo(n, "."),
        isNaN(e) || null == e)
            return 0;
        var i = (e = (e / 100).toFixed(t)).split(".");
        return i[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + a) + (i[1] ? n + i[1] : "")
    }
    switch (i.match(n)[1]) {
    case "amount":
        a = o(e, 2);
        break;
    case "amount_no_decimals":
        a = o(e, 0);
        break;
    case "amount_with_space_separator":
        a = o(e, 2, " ", ".");
        break;
    case "amount_no_decimals_with_comma_separator":
        a = o(e, 0, ",", ".");
        break;
    case "amount_no_decimals_with_space_separator":
        a = o(e, 0, " ")
    }
    return i.replace(n, a)
}
// To hide Category Filter
document.querySelectorAll('.collection-options label').forEach(item => {
    if (item.innerText == "Category:") {
        item.parentNode.parentNode.parentNode.style.display = 'none';
    }
})

function deepFreeze(object) {
    // Retrieve the property names defined on object
    const propNames = Object.getOwnPropertyNames(object);

    // Freeze properties before freezing self
    for (const name of propNames) {
        const value = object[name];
        if (value && typeof value === "object") {
            deepFreeze(value);
        }
    }
    return Object.freeze(object);
}
byob = {
    productContainer: '.product',
    textBottomSide:"",
    textBottomSideComplete:"<b>-XX- off</b>",
    oneTime:{
        3:{
            items: 3,
            save: 10,
            saveText: '10%',
            textBottom:"Save 10%",
            textBottomSide:"Add <b>-XX- more</b> items to get <b>10% off</b>"
        },
        4:{
            items: 4,
            save: 15,
            saveText: '15%',
            textBottom:"Save 15%",
            textBottomSide:"Add <b>-XX- more</b> items to get <b>15% off</b>"
        },
        5:{
            items: 5,
            save: 20,
            saveText: '20%',
            textBottom:"Save 20%",
            textBottomSide:"Add <b>-XX- more</b> items to get <b>20% off</b>"
        }
    }
};
deepFreeze(byob);
//console.log('byob',byob);

let arrayProductsAdd = [],
    countAdd = 0;

function countDuplicate(arr, variantId) {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i]['productId'] == variantId) {
            count++
        }
    }
    return count
}
function configProductGrid(productId, variantId, totalAdd){
    let grid = document.querySelector(byob.productContainer + `[data-id="${ productId }"]`);
    if (grid) {
        let gridBtnAdd = grid.querySelectorAll('.addtocart-btn'),
            gridbtnRemove = grid.querySelectorAll('.deletetocart-btn'),
            gridVariants = grid.querySelectorAll('.variants');
      
        grid.querySelector('input').setAttribute('data-count-onetime', totalAdd);

        for (let i = 0; i < gridBtnAdd.length; i++) {
            gridBtnAdd[i].textContent = 'ADD ANOTHER';
            gridbtnRemove[i] && gridbtnRemove[i].classList.remove('hide');
            gridVariants[i] && gridVariants[i].classList.remove('hide');
        }
    }
}
function updateCopyButtomSide(typeBundle) {
    let quantityActive = document.querySelectorAll('.choose-products .contain-item-bundle.active'),
        quantityActiveMissing = 0;

    document.querySelector('.add-to-cart-actions .copy-shipping').innerHTML = byob.textBottomSide;
    if (byob.oneTime[typeBundle]) {
        if (quantityActive.length > 0 && byob.oneTime[typeBundle].items != quantityActive.length) {
            quantityActiveMissing = byob.oneTime[typeBundle].items - quantityActive.length;
            document.querySelector('.add-to-cart-actions .copy-shipping').innerHTML = byob.oneTime[typeBundle].textBottomSide.replace('-XX-', quantityActiveMissing);
        } else if (byob.oneTime[typeBundle].items == quantityActive.length) {
            document.querySelector('.add-to-cart-actions .copy-shipping').innerHTML = byob.textBottomSideComplete.replace('-XX-', byob.oneTime[typeBundle].saveText);
        }
    }
}
function validateAddToCart(typeBundle) {
    let countActive = document.querySelectorAll('.choose-products .contain-item-bundle.active').length;
    function enableAddBag(stateAddToCart){
        let btnCart = document.querySelector('.add-to-cart-actions .cart__checkout');
        let btnClearCart = document.querySelector('.add-to-cart-actions .cart__clear-bag');
        if (stateAddToCart) {
            btnCart.classList.remove('disable');
            btnClearCart.classList.remove('disable');
            btnClearCart.style.display = '';
            btnClearCart.parentElement.classList.add('cart__clear-bag--show');
        } else {
            if (!btnCart.classList.contains('disable')) {
                btnCart.classList.add('disable');
            }
            btnClearCart.classList.add('disable');
            btnClearCart.style.display = 'none';
            btnClearCart.parentElement.classList.remove('cart__clear-bag--show');
        }
    }
    function enableAddToCart(stateAddToCart) {
        document.querySelectorAll(`${ byob.productContainer } .addtocart-btn`).forEach(item => {
            if (stateAddToCart) {
                item.classList.add('hide');
            } else {
                item.classList.remove('hide');
            }
        });
        document.querySelectorAll(`${ byob.productContainer } .variants`).forEach(item => {
            if (stateAddToCart) {
                item.classList.add('hide');
            } else {
                item.classList.remove('hide');
            }
        });
    }
    function disableRemoveToCart(stateAddToCart) {
        document.querySelectorAll(`${ byob.productContainer } .deletetocart-btn`).forEach(item => {
            if (stateAddToCart) {
                item.classList.add('hide');
            }
        });
    }

    console.log('countActive',countActive,'typeBundle',typeBundle);
    if (countActive == typeBundle) {
        enableAddBag(true);
        enableAddToCart(true);
    } else {
        enableAddBag(false);
        enableAddToCart(false);
    }

    if (countActive == 0) {
        enableAddToCart(false);
        disableRemoveToCart(true);
    }
}
function updatePrice(typeBundle){
    //console.log('typeBundle',typeBundle,'byob.oneTime[typeBundle]',byob.oneTime[typeBundle])
    if (byob.oneTime[typeBundle]) {
        let priceTotal = 0, priceTotalDiscount = 0;
        //console.log('choose-products',document.querySelectorAll('.choose-products .contain-item-bundle.active').length)
        document.querySelectorAll('.choose-products .contain-item-bundle.active').forEach(item => {
            let priceItem = (Number(item.dataset.price) * 100);
            priceTotal = priceTotal + priceItem;
            if (byob.oneTime[typeBundle].save) {
                priceTotalDiscount = priceTotalDiscount + (priceItem - parseInt(priceItem * byob.oneTime[typeBundle].save / 100));
            } else {
                priceTotalDiscount = priceTotalDiscount + priceItem;
            }
        });

        document.querySelectorAll(`.price-container .now`).forEach(item => {
            item.innerHTML = byobCurrencyFormatMoney(priceTotalDiscount, window.byo.amountNoDecimals),
            item.setAttribute('data-pricejs', priceTotalDiscount);
        });
        document.querySelectorAll(`.price-container .before`).forEach(item => {
            item.innerHTML = byobCurrencyFormatMoney(priceTotal, window.byo.amountNoDecimals),
            item.setAttribute('data-pricejs', priceTotal);
            if (priceTotal == 0) {
                item.style.display = 'none';
            } else {
                item.style.display = '';
            }
        });
    }
}
function bundleQuantity(typeBundle) {
    let bundleOptionTotal = document.querySelectorAll('.choose-products .contain-item-bundle');

    const subtractQuantity = (productId) => {
        if (document.querySelector(`${ byob.productContainer }[data-id="${ productId }"] input`)) {
            let total = document.querySelector(`${ byob.productContainer }[data-id="${ productId }"] input`).getAttribute('data-count-onetime'),
                result = parseInt(total) - 1;
            //console.log('total',total,'result',result);
            document.querySelector(`${ byob.productContainer }[data-id="${ productId }"] input`).setAttribute('data-count-onetime', result);
        }
    }

    bundleOptionCount = 0
    for (var i = 0; i < bundleOptionTotal.length; i++) {
        if (i > parseInt(typeBundle) - 1 ) {
            if (bundleOptionTotal[i].classList.contains('active')){
                subtractQuantity(bundleOptionTotal[i].getAttribute('data-product'));
            }
            bundleOptionTotal[i].style.display = 'none';
            bundleOptionTotal[i].classList.remove('active');
            bundleOptionTotal[i].removeAttribute('data-product');
            bundleOptionTotal[i].removeAttribute('data-product-variant');
            bundleOptionTotal[i].querySelector('img').setAttribute("src", window.byo.srcPantyFlatBack);
            bundleOptionTotal[i].querySelector('img').setAttribute("srcset", window.byo.srcsetPantyFlatBack);
            bundleOptionTotal[i].querySelector('.final-sale').innerHTML = '';
            bundleOptionTotal[i].querySelector('.variant-size').innerHTML = '';
        } else {
            bundleOptionTotal[i].style.display = 'block';
        }
    }

    document.querySelectorAll('.choose-quantity .quantity-option').forEach(item => { item.classList.remove('active'); })
    if (byob.oneTime[typeBundle]) {
        document.querySelector('.choose-quantity .copy .save').innerHTML = byob.oneTime[typeBundle].textBottom;
        let classes = document.querySelector('.selectorMobile.choose-products').className.split(" ").filter(c => !c.startsWith('active-'));
        document.querySelector('.selectorMobile.choose-products').className = classes.join(" ").trim();
        document.querySelector('.selectorMobile.choose-products').classList.add('active-' + typeBundle);
        document.querySelectorAll(`.choose-quantity .quantity-option[data-option="${typeBundle}"]`).forEach(item => { item.classList.add('active'); });
    }

    updateCopyButtomSide(typeBundle);
    validateAddToCart(typeBundle);
    updatePrice(typeBundle);
}

function scriptByob(arrayProductsAdd, countAdd) {
    let typeBundle = document.querySelector('.choose-quantity .quantity-option.active span').textContent;

    function setOptionsLocalStorage(){
        arrayProductsAdd = [];
        let totalProductsAdd = document.querySelectorAll(`.contain-item-bundle.active`);
        for (let i = 0; i < totalProductsAdd.length; i++) {
            let jsonInfo = {};

            jsonInfo['productId'] = totalProductsAdd[i].getAttribute('data-product');
            jsonInfo['id'] = totalProductsAdd[i].getAttribute('data-product-variant');
            jsonInfo['price'] = totalProductsAdd[i].getAttribute('data-price');
            jsonInfo['img'] = totalProductsAdd[i].querySelector('img').getAttribute('src');
            jsonInfo['imgSrcSet'] = totalProductsAdd[i].querySelector('img').getAttribute('srcset');
            jsonInfo['finalSale'] = totalProductsAdd[i].querySelector('.final-sale').innerHTML;
            jsonInfo['variantSize'] = totalProductsAdd[i].querySelector('.variant-size').innerHTML;
            arrayProductsAdd.push(jsonInfo);
        }
        //console.log(arrayProductsAdd);

        localStorage.setItem('itemsAdd', JSON.stringify(arrayProductsAdd));
        localStorage.setItem('priceOld', document.querySelector('.price-container .before').textContent);
        localStorage.setItem('priceNow', document.querySelector('.price-container .now').textContent);
        localStorage.setItem('typeBundle', document.querySelector('.choose-quantity .quantity-option.active span').textContent);
    }

    function chooseTypeBundle() {
        let element = document.querySelectorAll('.choose-quantity .quantity-option');

        if (element) {
            element.forEach(function(el, key){
                el.addEventListener('click', function () {
                    el.classList.toggle("active");
                    element.forEach(function(ell, els){
                        if(key !== els) {
                            ell.classList.remove('active');
                        }
                        // console.log(els);
                    });
                    typeBundle = document.querySelector('.choose-quantity .quantity-option.active span').textContent;
                    bundleQuantity(typeBundle);
                });
            });
        }
    }

    chooseTypeBundle();
    bundleQuantity(typeBundle);

    function addProductsToBar(a) {
        for (var i = 0; i < a.myNodeList.length; i++) {
            if (a.myNodeList[i].classList.contains("active")) {

            } else {
                a.myNodeList[i].setAttribute("data-product", a.productId);
                a.myNodeList[i].setAttribute("data-product-variant", a.variantId);
                a.myNodeList[i].setAttribute("data-price", a.productPrice);
                a.myNodeList[i].setAttribute("data-final-sale", a.isFinalSale);
                a.myNodeList[i].classList.add('active');
                a.myNodeList[i].querySelector('img').setAttribute("src", a.imageSrcProduct);
                a.myNodeList[i].querySelector('img').setAttribute("srcset", a.imageProduct);
                if (a.isFinalSale != 'false') {
                    a.myNodeList[i].querySelector('.final-sale').innerHTML = a.isFinalSale;
                } else {
                    a.myNodeList[i].querySelector('.final-sale').innerHTML = '';
                }
                a.myNodeList[i].querySelector('.variant-size').innerHTML = a.variantSize;
                break;
            }
        }
    }

    function validateOptionsActive() {
        let selectorActive = document.querySelectorAll('.contain-item-bundle.active').length;
        let typeBundleSelect = document.querySelector('.choose-quantity .quantity-option.active').getAttribute('data-option');

        if (selectorActive == typeBundleSelect) {
            return true
        } else {
            return false
        }
    }
    if (validateOptionsActive()) {
        let hideBtn = document.querySelectorAll('.addtocart-btn');
        for (var i = 0; i < hideBtn.length; i++) {
            hideBtn[i].classList.add('hide');
        }
    }

    function clearProducts() {
        let slides = document.querySelectorAll('.contain-item-bundle.active');
        //console.log("slides", slides);

        if (slides.length > 0) {
            bundleType = typeBundle = 3;

            let containsItemBundle = document.querySelectorAll('.contain-item-bundle'),
                id, image, totalAdd;

            for (let i = 0; i < containsItemBundle.length; i++) {
                containsItemBundle[i].classList.remove('active');
                containsItemBundle[i].querySelector('img').setAttribute("src", window.byo.srcPantyFlatBack);
                containsItemBundle[i].querySelector('img').setAttribute("srcset", window.byo.srcsetPantyFlatBack);
                containsItemBundle[i].removeAttribute('data-product');
                containsItemBundle[i].removeAttribute('data-product-variant');
                containsItemBundle[i].querySelector('.final-sale').innerHTML = '';
                containsItemBundle[i].querySelector('.variant-size').innerHTML = '';
            }
            /*} else {
                bundleType = document.querySelector('.choose-quantity .quantity-option.active span').textContent;
            }*/
            bundleQuantity(bundleType);
            updatePrice(bundleType);
            updateCopyButtomSide(bundleType);
        }
    }
    function addToCartProducts(e){
        let viewData = {
                items: []
            },
            slides = document.querySelectorAll('.contain-item-bundle.active'),
            unit = 1,
            bundleId = (new Date()).toJSON();
        for (let i = 0; i < slides.length; i++) {
            let tempQty = 0,
                prodId = document.querySelectorAll(`.choose-products [data-product-variant="${ slides[i].getAttribute('data-product-variant') }"]`),
                comp = slides[i].getAttribute('data-product-variant');
            for (let i = 0; i < prodId.length; i++) {
                if (prodId[i].classList.contains('active')) {
                    tempQty++;
                }
            }

            let state_add = false;
            for (let e = 0; e < viewData.items.length; e++) {
                if (viewData.items[e].id == comp ) {
                    state_add = true;
                }

            }

            if ( !state_add ){
                var jsonData = {};
                jsonData['quantity'] = tempQty * unit ;
                jsonData['productId'] = slides[i].getAttribute('data-product');
                jsonData['id'] = slides[i].getAttribute('data-product-variant');
                jsonData['property_product_form'] = 'byob';
                jsonData['property_byo'] = slides.length;
                jsonData['property_bundle_id'] = bundleId;
                jsonData['properties[_product_from]'] = 'byob';
                jsonData['properties[_byo]'] = slides.length;
                jsonData['properties[_bundle_id]'] = bundleId;
                viewData.items.push(jsonData);
            }
        }

        //console.log("viewData.items", viewData.items);

        if (viewData.items.length) {
            let editBundle = false;
            const editBundlePromise = new Promise((resolve, reject) => {
                if (e.target.hasAttribute('data-edit-bundle')) {
                    if (e.target.dataset.editBundle != 'false') {
                        editBundle = e.target.dataset.editBundle;
                      var cartContents = fetch(window.Shopify.routes.root + 'cart.js')
          .then(response => response.json())
          .then(data => {
            
              let update_byob = [],
                                editBundleItems = editBundle.split('-;-');
                            editBundleItems.forEach( editBundleItem => {
                                let editKey = editBundleItem.split('-:-')[0],
                                    editQty = editBundleItem.split('-:-')[1];
                              // data.items.forEach(cartItem => {
                                for (const cartItem of data.items) {
                                    let found = false;
                                    //console.log(cartItem.properties,removeSubs);
                                    if (cartItem.properties !== null && Object.keys(cartItem.properties).length !== 0) {
                                        Object.getOwnPropertyNames(cartItem.properties).forEach(key => {
                                            let value = Object.getOwnPropertyDescriptor(cartItem.properties, key);
                                            //console.log(key,value.value);
                                            if (key == '_product_from' && value.value == 'byob' && cartItem.key == editKey) {
                                                found = true;
                                            }
                                        });
                                    }
                                    if (found == true) {
                                        update_byob.push('updates[' + cartItem.key + ']=0');
                                        break;
                                    }
                                };
                              // });
                            });
                            console.log("update_byob", update_byob,update_byob.join('&'));

                            if (Object.keys(update_byob).length !== 0) {
                                $.ajax({
                                    type: 'POST',
                                    url: window.Shopify.routes.root + 'cart/update.js',
                                    data: update_byob.join('&'),
                                    dataType: 'json',
                                    success: function (data) {
                                        //console.log('addToCartProducts-update',data);
                                        resolve("Success!");
                                    },
                                    error: function(x,y,z) {
                                        console.log(z);
                                        resolve("Error!");
                                    }
                                });
                            } else {
                                resolve("Success!");
                            }
          });
                        // Shopify.getCart(function (current_cart) {
                        //     let update_byob = [],
                        //         editBundleItems = editBundle.split('-;-');
                        //     editBundleItems.forEach( editBundleItem => {
                        //         let editKey = editBundleItem.split('-:-')[0],
                        //             editQty = editBundleItem.split('-:-')[1];
                        //         for (const cartItem of current_cart.items) {
                        //             let found = false;
                        //             //console.log(cartItem.properties,removeSubs);
                        //             if (cartItem.properties !== null && Object.keys(cartItem.properties).length !== 0) {
                        //                 Object.getOwnPropertyNames(cartItem.properties).forEach(key => {
                        //                     let value = Object.getOwnPropertyDescriptor(cartItem.properties, key);
                        //                     //console.log(key,value.value);
                        //                     if (key == '_product_from' && value.value == 'byob' && cartItem.key == editKey) {
                        //                         found = true;
                        //                     }
                        //                 });
                        //             }
                        //             if (found == true) {
                        //                 update_byob.push('updates[' + cartItem.key + ']=0');
                        //                 break;
                        //             }
                        //         };
                        //     });
                        //     console.log("update_byob", update_byob,update_byob.join('&'));

                        //     if (Object.keys(update_byob).length !== 0) {
                        //         $.ajax({
                        //             type: 'POST',
                        //             url: window.Shopify.routes.root + 'cart/update.js',
                        //             data: update_byob.join('&'),
                        //             dataType: 'json',
                        //             success: function (data) {
                        //                 //console.log('addToCartProducts-update',data);
                        //                 resolve("Success!");
                        //             },
                        //             error: function(x,y,z) {
                        //                 console.log(z);
                        //                 resolve("Error!");
                        //             }
                        //         });
                        //     } else {
                        //         resolve("Success!");
                        //     }
                        // });
                    } else {
                        resolve("Success!");
                    }
                } else {
                    resolve("Success!");
                }
            });
            editBundlePromise.then((successMessage) => {
                // successMessage is whatever we passed in the resolve(...) function above.
                // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
                console.log(`Yay! ${successMessage}`);
              //   viewData.items.forEach((item, index) => {
              //       localStorage.setItem('bundle_size', index+1);
              //     window.theme.addToCart({
              //       id: item.id,
              //       quantity: item.quantity,
              //       properties: {"_product_from" : item.property_product_form, "_byo" : item.property_byo, "_bundle_id" : item.property_bundle_id}
              //       }).then((response) => {
              //           item = response.response.data;
              //           window.dataLayer = window.dataLayer || [];
              //           let color = '', size = '';
              //           item.options_with_values.forEach((option, index) => {
              //               if (option.name.toLowerCase() == 'color') {
              //                   color = option.value
              //               }
              //               if (option.name.toLowerCase() == 'size') {
              //                   size = option.value
              //               }
              //           }),
              //           window.dataLayer.push({
              //               'event': 'byoAddToBag',
              //               'itemName': item.product_title,
              //               'itemSize': size,
              //               'itemColor': color,
              //               'itemQty': item.quantity,
              //               'itemPrice': item.price,
              //               'itemTotal': item.line_price
              //           });
              //       if(viewData.items.length == localStorage.getItem('bundle_size'))
              //       {
              //         clearProducts();
              //         localStorage.removeItem('itemsAdd');
              //         localStorage.removeItem('priceNow');
              //         localStorage.removeItem('priceOld');
              //         localStorage.removeItem('typeBundle');
              //         localStorage.removeItem('bundle_size');
              //       }
              //   });
              // });
              $.ajax({
                    type: 'POST',
                    url: window.Shopify.routes.root + 'cart/add.js',
                    data: {
                        items : viewData['items']
                    },
                    dataType: 'json',
                    success: function (data) {
                        //console.log('data',data);
                        window.dataLayer = window.dataLayer || [];
                        data.items.forEach((item, index) => {
                            let color = '', size = '';
                            item.options_with_values.forEach((option, index) => {
                                if (option.name.toLowerCase() == 'color') {
                                    color = option.value
                                }
                                if (option.name.toLowerCase() == 'size') {
                                    size = option.value
                                }
                            }),
                            window.dataLayer.push({
                                'event': 'byoAddToBag',
                                'itemName': item.product_title,
                                'itemSize': size,
                                'itemColor': color,
                                'itemQty': item.quantity,
                                'itemPrice': item.price,
                                'itemTotal': item.line_price
                            });
                        }),
                        clearProducts(),
                        localStorage.removeItem('itemsAdd'),
                        localStorage.removeItem('priceNow'),
                        localStorage.removeItem('priceOld'),
                        localStorage.removeItem('typeBundle')
                      window.theme.openCart();
                      window.theme.fetchCart();
                    }, error: function(x,y,z){
                        console.log(z);
                    }
                });
            });
        }
    }
    document.querySelector(".cart__checkout").addEventListener("click", (e) => {
        if (e.currentTarget.classList.contains('disable') == false) {
            addToCartProducts(e);
        }
    });


    function clearCartProducts() {
        let slides = document.querySelectorAll('.contain-item-bundle.active');
        //console.log("slides", slides);

        if (slides.length > 0) {
          var cartContents = fetch(window.Shopify.routes.root + 'cart.js')
          .then(response => response.json())
          .then(data => {
            let update_byob = [];
                data.items.forEach(cartItem => {
                    let item_qty = cartItem.quantity;
                    //console.log(cartItem.properties,removeSubs);
                    if (cartItem.properties !== null && Object.keys(cartItem.properties).length !== 0) {
                        Object.getOwnPropertyNames(cartItem.properties).forEach(key => {
                            let value = Object.getOwnPropertyDescriptor(cartItem.properties, key);
                            //console.log(key,value.value);
                            if (key == '_product_from' && value.value == 'byob') {
                                item_qty = 0;
                            }
                        });
                    }
                    update_byob.push(item_qty);
                });

                //console.log("update_byob", update_byob);

                var updateByobDeferred = $.Deferred();
                var updateByobPromise = updateByobDeferred.promise();

                if (update_byob.length) {
                    $.ajax({
                        type: 'POST',
                        url: window.Shopify.routes.root + 'cart/update.js',
                        data: {
                            updates: update_byob
                        },
                        dataType: 'json',
                        success: function (data) {
                            //console.log('addToCartProducts-update',data);
                            updateByobDeferred.resolve(data);
                        },
                        error: function(x,y,z) {
                            console.log(z);
                            updateByobDeferred.resolve(false);
                        }
                    });
                } else {
                    updateByobDeferred.resolve(true);
                }

                $.when(updateByobPromise).done(function( x ) {
                    console.log('x',x);
                    let bundleType;
                    if (Object.keys(x).length !== 0) {
                        cartBYOB = x;
                    }
                    arrayCartProductsAdd = [];
                    //console.log('arrayCartProductsAdd',arrayCartProductsAdd);
                    let cartBYOBTags = null;
                    if (document.querySelector('#cartBYOBTags') != null) {
                        cartBYOBTags = JSON.parse(document.querySelector('#cartBYOBTags').innerHTML);
                    }
                    cartBYOB.items.forEach((cartItem, index) => {
                        var prodImg = cartItem.image.replace(/(\.[^.]*)$/, "_medium$1").replace('http:', '');
                        var prodImgSrcSet = cartItem.image.replace(/(\.[^.]*)$/, "_medium$1").replace('http:', '');
                        var productBYOB = false;

                        if (cartItem.properties !== null && cartItem.properties['_product_from'] != null && cartItem.properties['_product_from'] == 'byob') {
                            productBYOB = true;
                        }
                        if (productBYOB == true) {
                            let cartItemTags = null;
                            if (cartBYOBTags != null) {
                                cartItemTags = cartBYOBTags[cartItem.id] != null ? cartBYOBTags[cartItem.id].tags : false;
                            }
                            if (document.querySelector('.addtocart-btn[data-id="' + cartItem.product_id + '"]') && document.querySelector('.addtocart-btn[data-id="' + cartItem.product_id + '"]').dataset.imageRender) {
                                prodImg = document.querySelector('.addtocart-btn[data-id="' + cartItem.product_id + '"]').dataset.imageRender;
                                prodImgSrcSet = document.querySelector('.addtocart-btn[data-id="' + cartItem.product_id + '"]').dataset.imageRenderSrc;
                            }
                            for (let x=1; x <= cartItem.quantity; x++) {
                                let jsonInfo = {};
                                let size = '';
                                cartItem.options_with_values.forEach((option, index) => {
                                    if (option.name.toLowerCase() == 'size') {
                                        size = option.value
                                    }
                                });

                                jsonInfo['productId'] = cartItem.product_id;
                                jsonInfo['id'] = cartItem.variant_id;
                                jsonInfo['price'] = cartItem.original_price / 100;
                                jsonInfo['img'] = prodImg;
                                jsonInfo['imgSrcSet'] = prodImgSrcSet;
                                jsonInfo['isFinalSale'] = cartItemTags != null ? (cartItemTags.includes('badge:final sale') ? window.byo.labelFinalSale : 'false') : 'false';
                                jsonInfo['variantSize'] = 'Size: ' + size.toUpperCase();
                                arrayCartProductsAdd.push(jsonInfo);
                            }
                        }
                    });

                    //console.log('arrayCartProductsAdd', arrayCartProductsAdd);
                    bundleType = 3;

                    let containsItemBundle = document.querySelectorAll('.contain-item-bundle'),
                        id, image, totalAdd;

                    for (let i = 0; i < containsItemBundle.length; i++) {
                        if (i < arrayCartProductsAdd.length) {
                            let productId = arrayCartProductsAdd[i]['productId'],
                                id = arrayCartProductsAdd[i]['id'],
                                isFinalSale = arrayCartProductsAdd[i]['isFinalSale'] != undefined ? arrayCartProductsAdd[i]['isFinalSale'] : 'false';
                            containsItemBundle[i].classList.add('active');
                            containsItemBundle[i].querySelector('img').setAttribute("src", arrayCartProductsAdd[i]['img']);
                            containsItemBundle[i].querySelector('img').setAttribute("srcset", arrayCartProductsAdd[i]['imgSrcSet']);
                            containsItemBundle[i].setAttribute("data-product", productId),
                            containsItemBundle[i].setAttribute("data-product-variant", id),
                            containsItemBundle[i].setAttribute("data-price", arrayCartProductsAdd[i]['price']);
                            if (isFinalSale != 'false') {
                                containsItemBundle[i].querySelector('.final-sale').innerHTML = isFinalSale;
                            } else {
                                containsItemBundle[i].querySelector('.final-sale').innerHTML = '';
                            }
                            containsItemBundle[i].querySelector('.variant-size').innerHTML = arrayCartProductsAdd[i]['varianSize'];
                            totalAdd = countDuplicate(arrayCartProductsAdd, productId);
                            configProductGrid(productId, id,totalAdd);
                        } else {
                            containsItemBundle[i].classList.remove('active');
                            containsItemBundle[i].querySelector('img').setAttribute("src", window.byo.srcPantyFlatBack);
                            containsItemBundle[i].querySelector('img').setAttribute("srcset", window.byo.srcsetPantyFlatBack);
                            containsItemBundle[i].removeAttribute('data-product');
                            containsItemBundle[i].removeAttribute('data-product-variant');
                            containsItemBundle[i].querySelector('.final-sale').innerHTML = '';
                            containsItemBundle[i].querySelector('.variant-size').innerHTML = '';
                        }
                    }
                  
                    bundleQuantity(bundleType);
                    updatePrice(bundleType);
                    updateCopyButtomSide(bundleType);
                    window.theme.fetchCart();

                    //ajaxifyShopify.cartUpdateCallback(cartBYOB, false);
                });
          });

        //     Shopify.getCart(function (current_cart) {
        //         let update_byob = [];
        //         current_cart.items.forEach(cartItem => {
        //             let item_qty = cartItem.quantity;
        //             //console.log(cartItem.properties,removeSubs);
        //             if (cartItem.properties !== null && Object.keys(cartItem.properties).length !== 0) {
        //                 Object.getOwnPropertyNames(cartItem.properties).forEach(key => {
        //                     let value = Object.getOwnPropertyDescriptor(cartItem.properties, key);
        //                     //console.log(key,value.value);
        //                     if (key == '_product_from' && value.value == 'byob') {
        //                         item_qty = 0;
        //                     }
        //                 });
        //             }
        //             update_byob.push(item_qty);
        //         });

        //         //console.log("update_byob", update_byob);

        //         var updateByobDeferred = $.Deferred();
        //         var updateByobPromise = updateByobDeferred.promise();

        //         if (update_byob.length) {
        //             $.ajax({
        //                 type: 'POST',
        //                 url: window.Shopify.routes.root + 'cart/update.js',
        //                 data: {
        //                     updates: update_byob
        //                 },
        //                 dataType: 'json',
        //                 success: function (data) {
        //                     //console.log('addToCartProducts-update',data);
        //                     updateByobDeferred.resolve(data);
        //                 },
        //                 error: function(x,y,z) {
        //                     console.log(z);
        //                     updateByobDeferred.resolve(false);
        //                 }
        //             });
        //         } else {
        //             updateByobDeferred.resolve(true);
        //         }

        //         $.when(updateByobPromise).done(function( x ) {
        //             console.log('x',x);
        //             let bundleType;
        //             if (Object.keys(x).length !== 0) {
        //                 cartBYOB = x;
        //             }
        //             arrayCartProductsAdd = [];
        //             //console.log('arrayCartProductsAdd',arrayCartProductsAdd);
        //             let cartBYOBTags = null;
        //             if (document.querySelector('#cartBYOBTags') != null) {
        //                 cartBYOBTags = JSON.parse(document.querySelector('#cartBYOBTags').innerHTML);
        //             }
        //             cartBYOB.items.forEach((cartItem, index) => {
        //                 var prodImg = cartItem.image.replace(/(\.[^.]*)$/, "_medium$1").replace('http:', '');
        //                 var prodImgSrcSet = cartItem.image.replace(/(\.[^.]*)$/, "_medium$1").replace('http:', '');
        //                 var productBYOB = false;

        //                 if (cartItem.properties !== null && cartItem.properties['_product_from'] != null && cartItem.properties['_product_from'] == 'byob') {
        //                     productBYOB = true;
        //                 }
        //                 if (productBYOB == true) {
        //                     let cartItemTags = null;
        //                     if (cartBYOBTags != null) {
        //                         cartItemTags = cartBYOBTags[cartItem.id] != null ? cartBYOBTags[cartItem.id].tags : false;
        //                     }
        //                     if (document.querySelector('.addtocart-btn[data-id="' + cartItem.product_id + '"]') && document.querySelector('.addtocart-btn[data-id="' + cartItem.product_id + '"]').dataset.imageRender) {
        //                         prodImg = document.querySelector('.addtocart-btn[data-id="' + cartItem.product_id + '"]').dataset.imageRender;
        //                         prodImgSrcSet = document.querySelector('.addtocart-btn[data-id="' + cartItem.product_id + '"]').dataset.imageRenderSrc;
        //                     }
        //                     for (let x=1; x <= cartItem.quantity; x++) {
        //                         let jsonInfo = {};
        //                         let size = '';
        //                         cartItem.options_with_values.forEach((option, index) => {
        //                             if (option.name.toLowerCase() == 'size') {
        //                                 size = option.value
        //                             }
        //                         });

        //                         jsonInfo['productId'] = cartItem.product_id;
        //                         jsonInfo['id'] = cartItem.variant_id;
        //                         jsonInfo['price'] = cartItem.original_price / 100;
        //                         jsonInfo['img'] = prodImg;
        //                         jsonInfo['imgSrcSet'] = prodImgSrcSet;
        //                         jsonInfo['isFinalSale'] = cartItemTags != null ? (cartItemTags.includes('badge:final sale') ? window.byo.labelFinalSale : 'false') : 'false';
        //                         jsonInfo['variantSize'] = 'Size: ' + size.toUpperCase();
        //                         arrayCartProductsAdd.push(jsonInfo);
        //                     }
        //                 }
        //             });

        //             //console.log('arrayCartProductsAdd', arrayCartProductsAdd);
        //             bundleType = 3;

        //             let containsItemBundle = document.querySelectorAll('.contain-item-bundle'),
        //                 id, image, totalAdd;

        //             for (let i = 0; i < containsItemBundle.length; i++) {
        //                 if (i < arrayCartProductsAdd.length) {
        //                     let productId = arrayCartProductsAdd[i]['productId'],
        //                         id = arrayCartProductsAdd[i]['id'],
        //                         isFinalSale = arrayCartProductsAdd[i]['isFinalSale'] != undefined ? arrayCartProductsAdd[i]['isFinalSale'] : 'false';
        //                     containsItemBundle[i].classList.add('active');
        //                     containsItemBundle[i].querySelector('img').setAttribute("src", arrayCartProductsAdd[i]['img']);
        //                     containsItemBundle[i].querySelector('img').setAttribute("srcset", arrayCartProductsAdd[i]['imgSrcSet']);
        //                     containsItemBundle[i].setAttribute("data-product", productId),
        //                     containsItemBundle[i].setAttribute("data-product-variant", id),
        //                     containsItemBundle[i].setAttribute("data-price", arrayCartProductsAdd[i]['price']);
        //                     if (isFinalSale != 'false') {
        //                         containsItemBundle[i].querySelector('.final-sale').innerHTML = isFinalSale;
        //                     } else {
        //                         containsItemBundle[i].querySelector('.final-sale').innerHTML = '';
        //                     }
        //                     containsItemBundle[i].querySelector('.variant-size').innerHTML = arrayCartProductsAdd[i]['varianSize'];
        //                     totalAdd = countDuplicate(arrayCartProductsAdd, productId);
        //                     configProductGrid(productId, id,totalAdd);
        //                 } else {
        //                     containsItemBundle[i].classList.remove('active');
        //                     containsItemBundle[i].querySelector('img').setAttribute("src", window.byo.srcPantyFlatBack);
        //                     containsItemBundle[i].querySelector('img').setAttribute("srcset", window.byo.srcsetPantyFlatBack);
        //                     containsItemBundle[i].removeAttribute('data-product');
        //                     containsItemBundle[i].removeAttribute('data-product-variant');
        //                     containsItemBundle[i].querySelector('.final-sale').innerHTML = '';
        //                     containsItemBundle[i].querySelector('.variant-size').innerHTML = '';
        //                 }
        //             }
                  
        //             bundleQuantity(bundleType);
        //             updatePrice(bundleType);
        //             updateCopyButtomSide(bundleType);

        //             //ajaxifyShopify.cartUpdateCallback(cartBYOB, false);
        //         });
        //     });
        }
    }
    document.querySelector(".cart__clear-bag").addEventListener("click", (e) => {
        if (e.currentTarget.classList.contains('disable') == false) {
            clearCartProducts();
        }
    });

    function configProductAfterClick(productId, id, minus = false){
        let productsSelectorInput = document.querySelector(byob.productContainer + ` input[name='updates--${ productId }']`),
            gridProduct = document.querySelector(byob.productContainer + `[data-id="${ productId }"]`),
            count = productsSelectorInput.getAttribute('data-count-onetime');

        if (minus) {
            count = parseInt(count) - 1;
        } else {
            count = parseInt(count) + 1;
        }

        //console.log(count);

        productsSelectorInput.setAttribute('data-count-onetime', count );

        let alldelete = gridProduct.querySelectorAll('.deletetocart-btn');
        let allRemove = gridProduct.querySelectorAll('.addtocart-btn');
        if( count > 0) {
            for (var i = 0; i < alldelete.length; i++) {
                alldelete[i].classList.remove('hide');
                allRemove[i].textContent = 'ADD ANOTHER';
            }
        } else {
            gridProduct.querySelector('.deletetocart-btn').classList.add('hide');
            gridProduct.querySelector('.addtocart-btn').textContent = 'ADD TO BUNDLE';
            for (var i = 0; i < alldelete.length; i++) {
                alldelete[i].classList.add('hide');
                allRemove[i].textContent = 'ADD TO BUNDLE';
            }
        }
    }

    function removeProduct(idProduct, variantId){
        let elementActive,
            elementActives = document.querySelectorAll(`.contain-item-bundle[data-product='${ idProduct }']`);
        if (elementActives.length > 0) {
            elementActive = elementActives[elementActives.length - 1];
            elementActive.classList.remove('active');
            elementActive.querySelector('img').setAttribute("src", window.byo.srcPantyFlatBack);
            elementActive.querySelector('img').setAttribute("srcset", window.byo.srcsetPantyFlatBack);
            elementActive.removeAttribute('data-product');
            elementActive.removeAttribute('data-product-variant');
            elementActive.querySelector('.final-sale').innerHTML = '';
            elementActive.querySelector('.variant-size').innerHTML = '';
        }
    }

    function functionRemoveFromBar(idElement, targetElement){
        let elementGrid = document.querySelector(`${ byob.productContainer }[data-id="${ idElement }"]`),
            countGridAdd, countFinal;

        targetElement.querySelector('img').setAttribute("src", window.byo.srcPantyFlatBack);
        targetElement.querySelector('img').setAttribute("srcset", window.byo.srcsetPantyFlatBack);
        targetElement.classList.remove('active');
        targetElement.removeAttribute('data-product');
        targetElement.removeAttribute('data-product-variant');
        targetElement.querySelector('.final-sale').innerHTML = '';
        targetElement.querySelector('.variant-size').innerHTML = '';

        //console.log('elementGrid',elementGrid,'idElement',idElement,`${ byob.productContainer }[data-first-variant-id="${ idElement }"]`);
        countGridAdd = elementGrid.querySelector('.product_byob_quantity').getAttribute('data-count-onetime');

        countFinal = parseInt(countGridAdd) - 1;

        elementGrid.querySelector('.product_byob_quantity').setAttribute("data-count-onetime", countFinal);

        if ( countFinal == 0 ) {
            let alldelete = elementGrid.querySelectorAll('.deletetocart-btn');
            let allRemove = elementGrid.querySelectorAll('.addtocart-btn');

            for (var i = 0; i < alldelete.length; i++) {
                alldelete[i].classList.add('hide');
                allRemove[i].textContent = 'ADD TO BUNDLE';
            }
        }

        updatePrice(typeBundle);
        updateCopyButtomSide(typeBundle);

        let stateAcives = validateOptionsActive();
        if ( !stateAcives ) {
            let hideBtn = document.querySelectorAll('.addtocart-btn');
            for (var i = 0; i < hideBtn.length; i++) {
                hideBtn[i].classList.remove('hide');
            }
        }

        validateAddToCart(typeBundle);
        setOptionsLocalStorage();
    }

    function addToCart(e) {
        //console.log(`type bundle ${typeBundle}`);

        let productId = e.target.getAttribute('data-id'),
            variantId = e.target.getAttribute('data-variant-id'),
            variantSize = e.target.getAttribute('data-variant-size'),
            productPrice = e.target.getAttribute('data-price'),
            imageProduct = e.target.getAttribute('data-image-render'),
            imageSrcProduct = e.target.getAttribute('data-image-render-src'),
            isFinalSale = e.target.getAttribute('data-final-sale') != null ? e.target.getAttribute('data-final-sale') : 'false',
            myNodeList = document.querySelectorAll('.choose-products .contain-item-bundle');

        // Function to add the selected product to the top bar, where the active bundles are located.
        addProductsToBar({
            productId: productId,
            variantId: variantId,
            variantSize: variantSize,
            imageProduct: imageProduct,
            imageSrcProduct: imageSrcProduct,
            isFinalSale: isFinalSale,
            myNodeList: myNodeList,
            productPrice: productPrice
        });

        configProductAfterClick(productId, variantId);

        let stateAcives = validateOptionsActive();
        if (stateAcives) {
            let hideBtn = document.querySelectorAll('.addtocart-btn');
            for (var i = 0; i < hideBtn.length; i++) {
                hideBtn[i].classList.add('hide');
            }
        }

        validateAddToCart(typeBundle);
        updatePrice(typeBundle);
        updateCopyButtomSide(typeBundle);

        // set Local Storage
        setOptionsLocalStorage();
    }

    function deleteToCart(e) {
        // console.log(typeBundle);
        let productId = e.target.getAttribute('data-id'),
            variantId = e.target.getAttribute('data-variant-id');

        removeProduct(productId, variantId);

        configProductAfterClick(productId, variantId, true);

        updatePrice(typeBundle);
        updateCopyButtomSide(typeBundle);

        let stateAcives = validateOptionsActive();
        if ( !stateAcives ) {
            let hideBtn = document.querySelectorAll('.addtocart-btn');
            for (var i = 0; i < hideBtn.length; i++) {
                hideBtn[i].classList.remove('hide');
            }
        }

        validateAddToCart(typeBundle);
        setOptionsLocalStorage();
    }

    const addtocartBtn = `${ byob.productContainer } .addtocart-btn`,
        variantSelector = `${ byob.productContainer } .variant-selector`,
        deletetocartBtn = `${ byob.productContainer } .deletetocart-btn`,
        removeFromBarBtn = `.contain-item-bundle.active .remove`,
        optionContain = `${ byob.productContainer } .options-products`;
    document.addEventListener('click', function (e) {
        //console.log('target',e.target);
        var target;
        target = e.target.closest(variantSelector); //console.log('target',target);
        if (target) {
            addToCart(e);
            return false;
        }
        target = e.target.closest(deletetocartBtn); //console.log('target',target);
        if (target) {
            deleteToCart(e);
            return false;
        }
        target = e.target.closest(removeFromBarBtn); //console.log('target',target);
        if (target) {
            let targetElement = target.closest('.contain-item-bundle');
            let idElement = targetElement.getAttribute('data-product');
            functionRemoveFromBar(idElement,targetElement);
            return false;
        }
        target = e.target.closest(addtocartBtn);// console.log('target',target);
        if (target) {
            target.classList.remove('dontHover');
            target.parentNode.classList.add('active');
            return false;
        }
    });
    document.body.addEventListener("mouseleave", function(e) {
        var target;
        if (e.target && typeof e.target.closest === 'function') {
            target = e.target.closest(optionContain);// console.log('target',target);
            if (e.target.classList.contains('options-products')) {
                target.querySelector('.option-contain').classList.remove('active');
                target.querySelector('.addtocart-btn')?.classList.add('dontHover');
                return false;
            }
        }
    },true); // capturing phase

    return countAdd;
}

const getLocalStorage = (countAdd, changeGrid = false) => {
    arrayProductsAdd = JSON.parse(localStorage.getItem('itemsAdd'));
    bundleType = localStorage.getItem('typeBundle');

    if (document.querySelector('#cartBYOB') != null && document.querySelector('#cartBYOBTags') != null) {
        const urlParams = new URLSearchParams(window.location.search);
        cartBYOB = JSON.parse(document.querySelector('#cartBYOB').innerHTML);
        cartBYOBTags = JSON.parse(document.querySelector('#cartBYOBTags').innerHTML);
        if ((cartBYOB !== null || Object.keys(cartBYOB).length !== 0) && (cartBYOBTags !== null || Object.keys(cartBYOBTags).length !== 0) && urlParams.has('edit-bundle') == true) {
            let editBundle = urlParams.get('edit-bundle'),
                editBundleItems = editBundle.split('-;-'),
                arrayCartProductsAdd = [];
            editBundleItems.forEach( editBundleItem => {
                let editKey = editBundleItem.split('-:-')[0],
                    editQty = editBundleItem.split('-:-')[1];
                for (const cartItem of cartBYOB.items) {
                    var prodImg = cartItem.image.replace(/(\.[^.]*)$/, "_medium$1").replace('http:', '');
                    var prodImgSrcSet = cartItem.image.replace(/(\.[^.]*)$/, "_medium$1").replace('http:', '');
                    var productBYOB = false;

                    if (cartItem.properties !== null && cartItem.properties['_product_from'] != null && cartItem.properties['_product_from'] == 'byob') {
                        productBYOB = true;
                    }
                    if (productBYOB == true && cartItem.key == editKey) {
                        if (document.querySelector('.addtocart-btn[data-id="' + cartItem.product_id + '"]') && document.querySelector('.addtocart-btn[data-id="' + cartItem.product_id + '"]').dataset.imageRender) {
                            prodImg = document.querySelector('.addtocart-btn[data-id="' + cartItem.product_id + '"]').dataset.imageRender;
                            prodImgSrcSet = document.querySelector('.addtocart-btn[data-id="' + cartItem.product_id + '"]').dataset.imageRenderSrc;
                        }
                        let cartItemTags = cartBYOBTags[cartItem.id] != null ? cartBYOBTags[cartItem.id].tags : false;
                        prodImg = prodImgSrcSet = cartBYOBTags[cartItem.id] != null ? cartBYOBTags[cartItem.id].single_image.replace(/(\.[^.]*)$/, "_medium$1").replace('http:', '') : prodImg;
                        let size = '';
                        cartItem.options_with_values.forEach((option, index) => {
                            if (option.name.toLowerCase() == 'size') {
                                size = option.value
                            }
                        });
                        for (let x=1; x <= editQty; x++) {
                            let jsonInfo = {};

                            jsonInfo['productId'] = cartItem.product_id;
                            jsonInfo['id'] = cartItem.variant_id;
                            jsonInfo['price'] = cartItem.original_price / 100;
                            jsonInfo['img'] = prodImg;
                            jsonInfo['imgSrcSet'] = prodImgSrcSet;
                            jsonInfo['isFinalSale'] = cartItemTags.includes('badge:final sale') ? window.byo.labelFinalSale : 'false';
                            jsonInfo['variantSize'] = 'Size: ' + size.toUpperCase();
                            arrayCartProductsAdd.push(jsonInfo);
                        }
                        break;
                    }
                };
            });

            //console.log('arrayCartProductsAdd',arrayCartProductsAdd);
            //if (((arrayProductsAdd === null || Object.keys(arrayProductsAdd).length === 0) && Object.keys(arrayCartProductsAdd).length > 0) || (arrayProductsAdd !== null && Object.keys(arrayProductsAdd).length != Object.keys(arrayCartProductsAdd).length)) {
            if (Object.keys(arrayCartProductsAdd).length > 0) {
                arrayProductsAdd = arrayCartProductsAdd;
                bundleType = Object.keys(arrayCartProductsAdd).length;
            }
        }
    }

    //console.log('arrayProductsAdd', arrayProductsAdd, 'bundleType', bundleType);
    if (arrayProductsAdd === null || Object.keys(arrayProductsAdd).length === 0 ) {

    } else {
        let totalArray =  arrayProductsAdd.length,
            containsItemBundle = document.querySelectorAll('.contain-item-bundle'),
            id, image, totalAdd;

        for (let i = 0; i < containsItemBundle.length; i++) {
            if (i < arrayProductsAdd.length) {
                let productId = arrayProductsAdd[i]['productId'],
                    variantId = arrayProductsAdd[i]['id'],
                    isFinalSale = arrayProductsAdd[i]['isFinalSale'] != undefined ? arrayProductsAdd[i]['isFinalSale'] : 'false';
                containsItemBundle[i].classList.add('active');
                containsItemBundle[i].querySelector('img').setAttribute("src", arrayProductsAdd[i]['img']);
                containsItemBundle[i].querySelector('img').setAttribute("srcset", arrayProductsAdd[i]['imgSrcSet']);
                containsItemBundle[i].setAttribute("data-product", productId),
                containsItemBundle[i].setAttribute("data-product-variant", variantId),
                containsItemBundle[i].setAttribute("data-price", arrayProductsAdd[i]['price']);
                if (isFinalSale != 'false') {
                    containsItemBundle[i].querySelector('.final-sale').innerHTML = isFinalSale;
                } else {
                    containsItemBundle[i].querySelector('.final-sale').innerHTML = '';
                }
                containsItemBundle[i].querySelector('.variant-size').innerHTML = arrayProductsAdd[i]['variantSize'];
                totalAdd = countDuplicate(arrayProductsAdd, productId);
                configProductGrid(productId, variantId, totalAdd);
            } else {
                containsItemBundle[i].classList.remove('active');
                containsItemBundle[i].querySelector('.final-sale').innerHTML = '';
                containsItemBundle[i].querySelector('.variant-size').innerHTML = '';
            }
        }

        let priceOld = localStorage.getItem('priceOld'),
            priceNow = localStorage.getItem('priceNow');

        //console.log(`Price old ${priceOld} - Price Now ${priceNow}`);
        document.querySelector('.price-container .before').textContent = priceOld;
        document.querySelector('.price-container .now').textContent = priceNow;

        countAdd = totalArray;

        bundleQuantity(bundleType);console.log('bundleType',bundleType);
        updatePrice(bundleType);
        updateCopyButtomSide(bundleType);
    }

    return countAdd
}

countAdd = getLocalStorage();
scriptByob(arrayProductsAdd,countAdd);

window.addEventListener('scroll', (e) => {
    stickyFilter();
    hiddenSizeOptions();
});
window.addEventListener('resize', (e) => {
    setTimeout(function () {
        byobHeader.classList.remove("sticky");
        stickyFilter();
        hiddenSizeOptions();
    }, 300);
});
const byobHeader = document.querySelector('#build-your-kit-sticky');
function getAbsoluteHeight(el) {
    // Get the DOM Node if you pass in a string
    el = (typeof el === 'string') ? document.querySelector(el) : el;

    var styles = window.getComputedStyle(el);
    var margin = parseFloat(styles['marginTop']) +
                parseFloat(styles['marginBottom']);

    return Math.ceil(el.offsetHeight + margin);
}
function stickyFilter() {
    let mainContent = document.getElementById("MainContent"),
        sectionCollectionHeader = document.querySelector(".byob-main-wrapper"),
        sticky = mainContent.offsetTop,
        headerHeight = getAbsoluteHeight(byobHeader);
    if (window.pageYOffset > sticky) {
        byobHeader.classList.add("sticky"),
        sectionCollectionHeader && (sectionCollectionHeader.style.paddingTop = 'calc(' + headerHeight + 'px + 1rem)');
    } else {
        byobHeader.classList.remove("sticky"),
        sectionCollectionHeader && (sectionCollectionHeader.style.paddingTop = '0px');
    }
}
let lastScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
function hiddenSizeOptions() {
    if (document.body.clientWidth <= 768) {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (currentScroll < lastScroll + 50 || currentScroll > lastScroll + 50) {
            document.querySelectorAll('.byob-main-wrapper .product .option-contain.active').forEach(item => {
                item.classList.remove("active");
                item.querySelectorAll('.addtocart-btn').forEach(subitem => { subitem.classList.add("dontHover"); });
            });
            // scroll update
            lastScroll = currentScroll <= 0 ? 0 : currentScroll;
        }
    }
}

$(function() {
    setTimeout(function () {
        byobHeader.classList.remove("sticky");
        stickyFilter();
        hiddenSizeOptions();
    }, 300);
    function eventPopup() {
        "ontouchstart" in window || navigator.msMaxTouchPoints || $('.byob-zoom').each(function (index) {
            let thisImg = $(this).find('img');
            //console.log('thisImg', thisImg, 'data-zoom', thisImg.attr('data-zoom'));
            $(this).zoom({
                //url: $(this).find('img').attr('data-zoom'),
                on: "click",
                touch: !1,
                callback: function () {
                    if ($(this).attr('loading') == undefined) {
                        $(this).attr('srcset', thisImg.attr('data-zoom') + ' 2200w');
                        $(this).attr('loading', 'lazy');
                    }
                    //console.log('this', $(this));
                }
            });
        });
        var t = $(".byob-carousel").flickity({
                imagesLoaded: !0,
                setGallerySize: !0,
                pageDots: !1,
                prevNextButtons: !0,
                wrapAround: !0,
                draggable: !1,
                accessibility: !1,
                percentPosition: !1,
                groupCells: 2
            }),
            a = $(".byob-carousel-nav"),
            n = a.find(".carousel-cell");
        a.on("click", ".carousel-cell", (function(a) {
            var n = $(a.currentTarget).index();
            t.flickity("select", n)
        }));
        var i = t.data("flickity");
        t.on("select.flickity", (function() {
            a.find(".is-nav-selected").removeClass("is-nav-selected"), n.eq(i.selectedIndex).addClass("is-nav-selected")
        })), t.css({
            opacity: 1
        }), a.css({
            opacity: 1
        })
        // jQuery(document).on('open.zf.reveal', '.show-details-modal[data-reveal]', function(e) {
        //     var flkty = new Flickity(e.currentTarget.querySelector('.byob-carousel'));
        //     flkty.resize()
        // });
    }
    eventPopup();
    $('.paginate').on( 'append.infiniteScroll', function( event, response, path, items ) {
        console.log('append.infiniteScroll');
        $(document).foundation();
        eventPopup();
    });
})