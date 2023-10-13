window.slate=window.slate||{},window.theme=window.theme||{},slate.a11y={pageLinkFocus:function(e){var t="js-focus-hidden";e.first().attr("tabIndex","-1").focus().addClass(t).one("blur",(function(){e.first().removeClass(t).removeAttr("tabindex")}))},focusHash:function(){var e=window.location.hash;e&&document.getElementById(e.slice(1))&&this.pageLinkFocus($(e))},bindInPageLinks:function(){$("a[href*=#]").on("click",function(e){this.pageLinkFocus($(e.currentTarget.hash))}.bind(this))},trapFocus:function(e){var t=e.namespace?"focusin."+e.namespace:"focusin";e.$elementToFocus||(e.$elementToFocus=e.$container),e.$container.attr("tabindex","-1"),e.$elementToFocus.focus(),$(document).on(t,(function(t){e.$container[0]===t.target||e.$container.has(t.target).length||e.$container.focus()}))},removeTrapFocus:function(e){var t=e.namespace?"focusin."+e.namespace:"focusin";e.$container&&e.$container.length&&e.$container.removeAttr("tabindex"),$(document).off(t)}},slate.cart={cookiesEnabled:function(){var e=navigator.cookieEnabled;return e||(document.cookie="testcookie",e=-1!==document.cookie.indexOf("testcookie")),e}},slate.Currency={formatMoney:function(e,t){"string"==typeof e&&(e=e.replace(".",""));var a="",n=/\{\{\s*(\w+)\s*\}\}/,i=t||"${{amount}}";function o(e,t,a,n){if(t=slate.utils.defaultTo(t,2),a=slate.utils.defaultTo(a,","),n=slate.utils.defaultTo(n,"."),isNaN(e)||null==e)return 0;var i=(e=(e/100).toFixed(t)).split(".");return i[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1"+a)+(i[1]?n+i[1]:"")}switch(i.match(n)[1]){case"amount":a=o(e,2);break;case"amount_no_decimals":a=o(e,0);break;case"amount_with_space_separator":a=o(e,2," ",".");break;case"amount_no_decimals_with_comma_separator":a=o(e,0,",",".");break;case"amount_no_decimals_with_space_separator":a=o(e,0," ")}return i.replace(n,a)}},slate.Image={preload:function(e,t){"string"==typeof e&&(e=[e]);for(var a=0;a<e.length;a++){var n=e[a];this.loadImage(this.getSizedImageUrl(n,t))}},loadImage:function(e){(new Image).src=e},imageSize:function(e){var t=e.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);return t?t[1]:null},getSizedImageUrl:function(e,t){if(null===t)return e;if("master"===t)return this.removeProtocol(e);var a=e.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);if(a){var n=e.split(a[0]),i=a[0];return this.removeProtocol(n[0]+"_"+t+i)}return null},removeProtocol:function(e){return e.replace(/http(s)?:/,"")}},slate.Image={preload:function(e,t){"string"==typeof e&&(e=[e]);for(var a=0;a<e.length;a++){var n=e[a];this.loadImage(this.getSizedImageUrl(n,t))}},loadImage:function(e){(new Image).src=e},imageSize:function(e){var t=e.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);return t?t[1]:null},getSizedImageUrl:function(e,t){if(null===t)return e;if("master"===t)return this.removeProtocol(e);var a=e.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);if(a){var n=e.split(a[0]),i=a[0];return this.removeProtocol(n[0]+"_"+t+i)}return null},removeProtocol:function(e){return e.replace(/http(s)?:/,"")}},slate.rte={wrapTable:function(e){var t=void 0===e.tableWrapperClass?"":e.tableWrapperClass;e.$tables.wrap('<div class="'+t+'"></div>')},wrapIframe:function(e){var t=void 0===e.iframeWrapperClass?"":e.iframeWrapperClass;e.$iframes.each((function(){$(this).wrap('<div class="'+t+'"></div>'),this.src=this.src}))}},slate.rte={wrapTable:function(e){var t=void 0===e.tableWrapperClass?"":e.tableWrapperClass;e.$tables.wrap('<div class="'+t+'"></div>')},wrapIframe:function(e){var t=void 0===e.iframeWrapperClass?"":e.iframeWrapperClass;e.$iframes.each((function(){$(this).wrap('<div class="'+t+'"></div>'),this.src=this.src}))}},slate.Sections=function(){this.constructors={},this.instances=[],$(document).on("shopify:section:load",this._onSectionLoad.bind(this)).on("shopify:section:unload",this._onSectionUnload.bind(this)).on("shopify:section:select",this._onSelect.bind(this)).on("shopify:section:deselect",this._onDeselect.bind(this)).on("shopify:section:reorder",this._onReorder.bind(this)).on("shopify:block:select",this._onBlockSelect.bind(this)).on("shopify:block:deselect",this._onBlockDeselect.bind(this))},slate.Sections.prototype=$.extend({},slate.Sections.prototype,{_createInstance:function(e,t){var a=$(e),n=a.attr("data-section-id"),i=a.attr("data-section-type");if(void 0!==(t=t||this.constructors[i])){var o=$.extend(new t(e),{id:n,type:i,container:e});this.instances.push(o)}},_onSectionLoad:function(e){var t=$("[data-section-id]",e.target)[0];t&&this._createInstance(t)},_onSectionUnload:function(e){var t=slate.utils.findInstance(this.instances,"id",e.detail.sectionId);t&&("function"==typeof t.onUnload&&t.onUnload(e),this.instances=slate.utils.removeInstance(this.instances,"id",e.detail.sectionId))},_onSelect:function(e){var t=slate.utils.findInstance(this.instances,"id",e.detail.sectionId);t&&"function"==typeof t.onSelect&&t.onSelect(e)},_onDeselect:function(e){var t=slate.utils.findInstance(this.instances,"id",e.detail.sectionId);t&&"function"==typeof t.onDeselect&&t.onDeselect(e)},_onReorder:function(e){var t=slate.utils.findInstance(this.instances,"id",e.detail.sectionId);t&&"function"==typeof t.onReorder&&t.onReorder(e)},_onBlockSelect:function(e){var t=slate.utils.findInstance(this.instances,"id",e.detail.sectionId);t&&"function"==typeof t.onBlockSelect&&t.onBlockSelect(e)},_onBlockDeselect:function(e){var t=slate.utils.findInstance(this.instances,"id",e.detail.sectionId);t&&"function"==typeof t.onBlockDeselect&&t.onBlockDeselect(e)},register:function(e,t){this.constructors[e]=t,$("[data-section-type="+e+"]").each(function(e,a){this._createInstance(a,t)}.bind(this))}}),slate.utils={findInstance:function(e,t,a){for(var n=0;n<e.length;n++)if(e[n][t]===a)return e[n]},removeInstance:function(e,t,a){for(var n=e.length;n--;)if(e[n][t]===a){e.splice(n,1);break}return e},compact:function(e){for(var t=-1,a=null==e?0:e.length,n=0,i=[];++t<a;){var o=e[t];o&&(i[n++]=o)}return i},defaultTo:function(e,t){return null==e||e!=e?t:e}},slate.Variants=function(){function e(e){this.$container=e.$container,this.product=e.product,this.singleOptionSelector=e.singleOptionSelector,this.originalSelectorId=e.originalSelectorId,this.enableHistoryState=e.enableHistoryState,this.currentVariant=this._getVariantFromOptions(),$(this.singleOptionSelector,this.$container).on("change",this._onSelectChange.bind(this))}return e.prototype=$.extend({},e.prototype,{_getCurrentOptions:function(){var e=$.map($(this.singleOptionSelector,this.$container),(function(e){var t=$(e),a=t.attr("type"),n={};return"radio"===a||"checkbox"===a?!!t[0].checked&&(n.value=t.val(),n.index=t.data("index"),n):(n.value=t.val(),n.index=t.data("index"),n)}));return slate.utils.compact(e)},_getVariantFromOptions:function(){var e=this._getCurrentOptions(),t=this.product.variants,a=!1;return t.forEach((function(t){var n=!0;e.forEach((function(e){n&&(n=e.value===t[e.index])})),n&&(a=t)})),a||null},_onSelectChange:function(){var e=this._getVariantFromOptions();if(this.$container.trigger({type:"variantChange",variant:e}),e){this._updateMasterSelect(e),this._updateImages(e),this._updatePrice(e),this.currentVariant=e,this.enableHistoryState&&this._updateHistoryState(e);var t=this.originalSelectorId;if(e)for(var a=$(t).closest("form"),n=0,i=e.options.length;n<i;n++){var o=a.find('.swatch[data-option-index="'+n+'"] :radio[value="'+e.options[n]+'"]');o.size()&&(o.get(0).checked=!0)}}},_updateImages:function(e){var t=e.featured_image||{},a=this.currentVariant.featured_image||{};e.featured_image&&t.src!==a.src&&this.$container.trigger({type:"variantImageChange",variant:e})},_updatePrice:function(e){e.price===this.currentVariant.price&&e.compare_at_price===this.currentVariant.compare_at_price||this.$container.trigger({type:"variantPriceChange",variant:e})},_updateHistoryState:function(e){if(history.replaceState&&e){var t=window.location.protocol+"//"+window.location.host+window.location.pathname+"?variant="+e.id;window.history.replaceState({path:t},"",t)}},_updateMasterSelect:function(e){$(this.originalSelectorId,this.$container)[0].value=e.id}}),e}(),jQuery(document).ready((function(e){"ontouchstart"in window||navigator.msMaxTouchPoints||e(".zoom").zoom({on:"click",touch:!1});var t=e(".carousel").flickity({imagesLoaded:!0,setGallerySize:!0,pageDots:!1,prevNextButtons:!0,wrapAround:!0,draggable:!1,accessibility:!1,percentPosition:!1}),a=e(".carousel-nav"),n=a.find(".carousel-cell");a.on("click",".carousel-cell",(function(a){var n=e(a.currentTarget).index();t.flickity("select",n)}));var i=t.data("flickity");t.on("select.flickity",(function(){a.find(".is-nav-selected").removeClass("is-nav-selected"),n.eq(i.selectedIndex).addClass("is-nav-selected")})),t.css({opacity:1}),a.css({opacity:1})})),theme.Product=function(){var e="[data-add-to-cart]",t="[data-add-to-cart-text]",a="[data-price-wrapper]",n="[data-product-json]";function i(e){if(this.$container=$(e),$(n,this.$container).html()){this.$container.attr("data-section-id"),this.productSingleObject=JSON.parse($(n,this.$container).html());var t={$container:this.$container,enableHistoryState:this.$container.data("enable-history-state")||!1,singleOptionSelector:"[data-single-option-selector]",originalSelectorId:"[data-product-select]",product:this.productSingleObject};this.settings={},this.namespace=".product",this.variants=new slate.Variants(t),this.$featuredImage=$("[data-product-featured-image]",this.$container),this.$container.on("variantChange"+this.namespace,this.updateAddToCartState.bind(this)),this.$container.on("variantPriceChange"+this.namespace,this.updateProductPrices.bind(this)),this.$featuredImage.length>0&&(this.settings.imageSize=slate.Image.imageSize(this.$featuredImage.attr("src")),slate.Image.preload(this.productSingleObject.images,this.settings.imageSize),this.$container.on("variantImageChange"+this.namespace,this.updateProductImage.bind(this)))}}return i.prototype=$.extend({},i.prototype,{updateAddToCartState:function(n){var i=n.variant;if(!i)return $(e,this.$container).prop("disabled",!0),$(t,this.$container).html(theme.strings.unavailable),void $(a,this.$container).addClass("hide");$(a,this.$container).removeClass("hide"),i.available?($(e,this.$container).prop("disabled",!1),$(e,this.$container).removeClass("outline"),$(t,this.$container).html(theme.strings.addToCart),$(".back-order").addClass("hidden").fadeTo(200,1),$(".sold-out").addClass("hidden").fadeTo(200,1),$(".inventory-warning").addClass("hidden").fadeTo(200,1),i.inventory_management&&i.inventory_quantity<=0&&($(t,this.$container).html("Pre-order"),$(e,this.$container).removeClass("outline"),$(".sold-out").addClass("hidden").fadeTo(200,1),$(".back-order").removeClass("hidden").fadeTo(200,1)),i.inventory_management&&i.inventory_quantity<4&&i.inventory_quantity>0&&($(".inventory-warning").html("(Only "+[i.inventory_quantity]+" left)"),$(".inventory-warning").removeClass("hidden").fadeTo(200,1)),i.inventory_management&&i.inventory_quantity<7&&i.inventory_quantity>3&&($(".inventory-warning").html("(Only a few left)"),$(".inventory-warning").removeClass("hidden").fadeTo(200,1))):($(".inventory-warning").addClass("hidden").fadeTo(200,1),$(".back-order").addClass("hidden").fadeTo(200,1),$(".sold-out").removeClass("hidden").fadeTo(200,1),$(e,this.$container).prop("disabled",!0),$(e,this.$container).addClass("outline"),$(t,this.$container).html(theme.strings.soldOut))},updateProductPrices:function(e){var t=e.variant,a=$("[data-compare-price]",this.$container),n=a.add("[data-compare-text]",this.$container);$("[data-product-price]",this.$container).html(slate.Currency.formatMoney(t.price,theme.moneyFormat)),t.compare_at_price>t.price?(a.html(slate.Currency.formatMoney(t.compare_at_price,theme.moneyFormat)),n.removeClass("hide")):(a.html(""),n.addClass("hide"))},updateProductImage:function(e){var t=e.variant,a=slate.Image.getSizedImageUrl(t.featured_image.src,this.settings.imageSize);this.$featuredImage.attr("src",a)},onUnload:function(){this.$container.off(this.namespace)}}),i}(),theme.customerAddresses=function(){var e=$("#AddressNewForm");e.length&&(Shopify&&new Shopify.CountryProvinceSelector("AddressCountryNew","AddressProvinceNew",{hideElement:"AddressProvinceContainerNew"}),$(".address-country-option").each((function(){var e=$(this).data("form-id"),t="AddressCountry_"+e,a="AddressProvince_"+e,n="AddressProvinceContainer_"+e;new Shopify.CountryProvinceSelector(t,a,{hideElement:n})})),$(".address-new-toggle").on("click",(function(){e.toggleClass("hide")})),$(".address-edit-toggle").on("click",(function(){var e=$(this).data("form-id");$("#EditAddress_"+e).toggleClass("hide")})),$(".address-delete").on("click",(function(){var e=$(this),t=e.data("form-id"),a=e.data("confirm-message");confirm(a||"Are you sure you wish to delete this address?")&&Shopify.postLink("/account/addresses/"+t,{parameters:{_method:"delete"}})})))}(),theme.customerLogin=function(){var e="#RecoverPassword";function t(e){e.preventDefault(),a()}function a(){$("#RecoverPasswordForm").toggleClass("hide"),$("#CustomerLoginForm").toggleClass("hide")}$(e).length&&("#recover"===window.location.hash&&a(),$(".reset-password-success").length&&$("#ResetSuccess").removeClass("hide"),$(e).on("click",t),$("#HideRecoverPasswordLink").on("click",t))}(),$(document).ready((function(){(new slate.Sections).register("product",theme.Product),slate.a11y.pageLinkFocus($(window.location.hash)),$(".in-page-link").on("click",(function(e){slate.a11y.pageLinkFocus($(e.currentTarget.hash))})),slate.rte.wrapTable({$tables:$(".rte table"),tableWrapperClass:"rte__table-wrapper"}),slate.rte.wrapIframe({$iframes:$('.rte iframe[src*="youtube.com/embed"],.rte iframe[src*="player.vimeo"]'),iframeWrapperClass:"rte__video-wrapper"}),slate.cart.cookiesEnabled()&&(document.documentElement.className=document.documentElement.className.replace("supports-no-cookies","supports-cookies"))})),window.slate=window.slate||{},window.theme=window.theme||{},$(document).ready((function(){(new slate.Sections).register("product",theme.Product),slate.a11y.pageLinkFocus($(window.location.hash)),$(".in-page-link").on("click",(function(e){slate.a11y.pageLinkFocus($(e.currentTarget.hash))})),slate.rte.wrapTable({$tables:$(".rte table"),tableWrapperClass:"rte__table-wrapper"}),slate.rte.wrapIframe({$iframes:$('.rte iframe[src*="youtube.com/embed"],.rte iframe[src*="player.vimeo"]'),iframeWrapperClass:"rte__video-wrapper"}),slate.cart.cookiesEnabled()&&(document.documentElement.className=document.documentElement.className.replace("supports-no-cookies","supports-cookies"))}));const checkAddToCartPlp=document.querySelector(".template-collection .product .information .add-to-cart");if(checkAddToCartPlp){document.querySelectorAll(".template-collection .product .information .add-to-cart"),document.querySelectorAll(".template-collection .product .information .add-to-cart .variant-selector");$(".template-collection").on("mouseenter",".product .information .add-to-cart .button",(function(e){e.target.closest(".add-to-cart").classList.add("active")})),$(".template-collection").on("mouseleave",".product .information .add-to-cart",(function(e){e.target.closest(".add-to-cart").classList.remove("active")})),$(".template-collection").on("click",".product .information .add-to-cart .variant-selector",(function(e){Shopify.addItem(e.target.getAttribute("data-variant-id"),1),$(".product .information .title").matchHeight({byRow:!1,property:"min-height"})}))}const addToCartPlp=document.querySelectorAll(".add-to-cart"),addToCartTrigger=document.querySelectorAll(".add-to-cart .button"),variantTrigger=document.querySelectorAll(".add-to-cart .variant-selector");addToCartPlp&&(addToCartTrigger.forEach((e=>{e.addEventListener("mouseenter",(e=>{e.target.parentNode.classList.add("active")}))})),addToCartPlp.forEach((e=>{e.addEventListener("mouseleave",(e=>{e.target.classList.remove("active")}))})),variantTrigger.forEach((e=>{e.addEventListener("click",(e=>{Shopify.addItem(e.target.getAttribute("data-variant-id"),1)}))})));
