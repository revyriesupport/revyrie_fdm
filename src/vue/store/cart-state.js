import { defineStore } from 'pinia'
import {
  generateFetchRequest,
  focusElement,
  calculateTotal,
  temporalUpdateBubbleCartCount
} from '@/lib/utilities'

import {
  generateBodyObject,
  hasDiscounts,
  discountTotal,
  applyDiscount,
  removeDiscount,
  applyGiftCard,
  removeGiftCard,
  validateCartItem,
  handleResponseOrError
} from '@/lib/utilities-cart'

import { ERROR_MESSAGES } from '@/lib/error-messages.js';
import { cleanProductVariantId } from '@/lib/utilities-graphql'
import { miniCartRevertedOrder } from '@/lib/store-definition'

const {
  giftLoverEnable,
  giftLoverTitle,
  giftLoverProduct,
  giftLoverContent,
  giftLoverNote,
  giftLoverNoteLinkText,
  giftLoverNoteTextLink,
  giftLoverNoteContent,
  giftLoverButtonText,
  giftLoverImage,
  giftLoverImageAlt,
  giftLoverImageLink,
  giftLoverProductSelect,
  giftLoverProductVariant,
  giftLoverProductVariantPriceSize,
  giftLoverProductVariantPriceSizeTwo,
  bundleText,
  bundleImageThree,
  bundleImageFour,
  bundleImageFive,
} = window.cartGiftLover

const useCartStoreDefinition = defineStore({
  id: 'cart',
  state: () => ({
    items: [],
    isOpen: false,
    isLoading: false,
    note: '',
    cartRequested: false,
    giftLoverEnable: giftLoverEnable,
    giftLoverTitle: giftLoverTitle,
    giftLoverProduct: giftLoverProduct,
    giftLoverContent: giftLoverContent,
    giftLoverNote: giftLoverNote,
    giftLoverNoteLinkText: giftLoverNoteLinkText,
    giftLoverNoteTextLink: giftLoverNoteTextLink,
    giftLoverButtonText: giftLoverButtonText,
    giftLoverImage: giftLoverImage,
    giftLoverImageAlt: giftLoverImageAlt,
    giftLoverImageLink: giftLoverImageLink,
    giftLoverProductSelect: giftLoverProductSelect,
    giftLoverProductVariant: giftLoverProductVariant,
    giftLoverProductVariantPriceSize: giftLoverProductVariantPriceSize,
    giftLoverProductVariantPriceSizeTwo: giftLoverProductVariantPriceSizeTwo,
    
  }),
  getters: {
    variantsProduct() {
      var productVariantSize = JSON.parse(giftLoverProductVariant);
      return productVariantSize;
    },
    giftProductId() {
          var value = document.getElementById("select_size").value;
          const select = document.getElementById('select_size');
          const addButton = document.querySelectorAll('.addcart_button .product-form__submit');
         
          addButton.forEach(element => {
            var variantId = element.getAttribute('data-variantid');
            var event_variantId = event.target.value;
            if(variantId === value){
              element.classList.add('active');
            } else{
              element.classList.remove('active');
            }

          });
          select.addEventListener('change', function handleChange(event) {
            addButton.forEach(element => {
                var variantId = element.getAttribute('data-variantid');
                var event_variantId = event.target.value;
                if(variantId === event_variantId){
                  element.classList.add('active');
                } else{
                  element.classList.remove('active');
                }
            });
          });
    },
    listItems() {
      return miniCartRevertedOrder ? this.items.reverse() : this.items;
    },
    listBundleItems() {
        var bundle_id = "";
        var bundle_items = [];
        var index = -1;
        this.items.forEach((item) => {
          if(item.properties['_product_from'] == 'byob') {
            if(item.properties['_bundle_id'] == bundle_id) {
                bundle_items[index].price = bundle_items[index].price + item.line_price;
                bundle_items[index].original_line_price = bundle_items[index].original_line_price + item.original_line_price;
                bundle_items[index].update_data = bundle_items[index].update_data.concat("-;-" + item.key + "-:-" + item.quantity);
                bundle_items[index].remove_data = bundle_items[index].remove_data.concat("&" + item.key);
                if(item.properties['final_sale'] == "1") {
                  bundle_items[index].sale_count = parseInt(bundle_items[index].sale_count) + 1;
                }
              }else{
                bundle_id = item.properties['_bundle_id'];
                index++;
                var temp_item = {
                      bundle_size:item.properties['_byo'], 
                      bundle_id:item.properties['_bundle_id'], 
                      title: window.bundleConfig.bundle_text.replace('"', '').replace('\"', ''),
                      price: item.line_price,
                      original_line_price: item.original_line_price,
                      update_data: item.key.concat("-:-" + item.quantity),
                      remove_data: item.key,
                }
                if (item.line_price != item.original_line_price){
                  temp_item.discounted = true;
                }else{
                  temp_item.discounted = false;
                }if(item.properties['_byo'] == 3){
                  temp_item.bundle_image = window.bundleConfig.bundle_image_3;
                }else if(item.properties['_byo'] == 4){
                  temp_item.bundle_image = window.bundleConfig.bundle_image_4;
                }else if(item.properties['_byo'] == 5){
                  temp_item.bundle_image = window.bundleConfig.bundle_image_5;
                }if(item.properties['final_sale'] == "1"){
                  temp_item.sale_count = 1;
                }else{
                  temp_item.sale_count = 0;
                }
                bundle_items.push(temp_item);
              }
          }        
      });
       //console.log(bundle_items);
       return bundle_items;
    },
    isEmpty() {
      return this.items?.length === 0;
    },
    totalAmount() {
      return !this.isEmpty
        ? calculateTotal(this.items, (item) => item.price * item.quantity)
        : 0
    },
    totalItems() {
      if(this.isEmpty){
          return 0;
      }else{
        var cartItemSize = 0;
        var cartItemBYOB = false;
        var cartItemsBYOB = '';
        this.items.forEach((item) => {
          var productBYOB = false;
          if(item.properties['_product_from'] == 'byob')
          {
              productBYOB = true;
              cartItemBYOB = true;
          }

          if(item.properties['_bundle_id'] == 'byob')
          {
            if(!cartItemsBYOB.includes(item.properties['_bundle_id']))
            {
              if(cartItemsBYOB != '')
              {
                cartItemsBYOB = cartItemsBYOB.concat(",");
              }
              cartItemsBYOB = cartItemsBYOB.concat(item.properties['_bundle_id']);
            }                 
          }

          if(productBYOB == false)
          {
            cartItemSize = parseInt(cartItemSize) + item.quantity; 
          }
        });

        if(cartItemBYOB == true)
        {
          cartItemsBYOB = cartItemsBYOB.split(",");
          cartItemSize = parseInt(cartItemSize) + cartItemsBYOB.length
        }
        return cartItemSize
       }
      // return !this.isEmpty
      //   ? calculateTotal(this.items, (item) => item.quantity)
      //   : 0
    },
    hasProductType(productType) {
      if (!productType || this.items.length == 0) return false
      return this.items.some((item) => item.product_type === productType);
    },
    hasProductTag(productTag) {
      if (!productTag || this.items.length == 0) return false
      return this.items.some((item) => item?.tags?.includes(productTag));
    },
    hasDiscounts() {
      return hasDiscounts(this.items);
    },
    discountTotal() {
      return discountTotal(this.items);
    },
    subtotal() {
      return calculateTotal(this.items, (item) => item.original_line_price) || 0;
    },
    taxes() {
      return calculateTotal(this.items, (item) => item.total_tax) || 0;
    },
    shipping() {
      return this.items.reduce((total, item) => total + item.line_level_shipping_price, 0) || 0;
    },
    total() {
      return this.subtotal + this.taxes + this.shipping - this.discountTotal || 0;
    }
  },
  actions: {
    open() {
      this.isOpen = true
      document.body.classList.add('cart-drawer-open');
    },
    toggle() {
      this.isOpen = !this.isOpen

      if (this.isOpen) {
        document.body.classList.add('cart-drawer-open')
        focusElement('#close-mini-cart')
      } else {
        document.body.classList.remove('cart-drawer-open')
        if (document.querySelector('.shopify-section-header-sticky:not(.shopify-section-header-hidden)')) {
          focusElement('#cart-icon-bubble')
        }
      }

      if (this.isOpen && this.cartRequested === false) {
        this.fetchCart()
      }
    },

    

    async fetchCart() {
      this.isLoading = true
      try {
        const response = await generateFetchRequest('/cart.js', 'GET', null, null)
        this.items = response.data.items || []
        this.note = response.data.note || ''
        this.isLoading = false
        this.cartRequested = true
        temporalUpdateBubbleCartCount(this.totalItems)
        await this.getCartItemsVariantData(this.items);
        //console.log(this.items);
      } catch (error) {
        this.isLoading = false
        return handleResponseOrError(null, error);
      }
    },

    async getCartItemsVariantData(items) { 
              items.forEach((item) => {
                item.variant_data = [];
                item.dummy= "dummy1";
                fetch('/products/' + item.handle + '.js')
                .then(response => response.json())
                .then(product_data =>
                  item.variant_data = product_data.variants)
                .catch(err => { throw err });
                  });
      return items;
    },
          
    async getCartItemVariantData(item) { 
                item.variant_data = [];
                fetch('/products/' + item.handle + '.js')
                .then(response => response.json())
                .then(product_data =>
                  item.variant_data = product_data.variants)
                .catch(err => { throw err });
      return item;
    },

    async removeBundle(requestBody){
      console.log(requestBody);
            const bundleItems = requestBody.split("&");            
            const updates = {};
            bundleItems.forEach((item, index) => {
              updates[item] = 0;
             });
            const updateRequestBody = {updates};
            try {
              const response =
          await Rt('/cart/update.js', 'POST', updateRequestBody, null)

        this.items = response.data.items
         temporalUpdateBubbleCartCount(this.totalItems);
        } catch (error) {
          return handleResponseOrError(null, error);
        }
    },

    async addToCart({ id, quantity = 1, properties = {}, selling_plan = null }) {
      const error = validateCartItem({ id, quantity, properties });
      if (error) {
        return handleResponseOrError(null, error);
      }
      if (this.cartRequested === false) {
        await this.fetchCart()
      }

      const _id = cleanProductVariantId(id.toString())
      let requestBody = generateBodyObject({
        id: _id.toString(),
        quantity,
        properties,
        selling_plan
      })

      const itemAlreadyOnCart = this.isProductInCartById(_id);
      if (itemAlreadyOnCart) {
        const itemWithSameIdAndSameProperties = this.items
          .find(item => item.id === _id
            && JSON.stringify(item.properties) === JSON.stringify(properties || {})
          )

        if (itemWithSameIdAndSameProperties) {
          requestBody = generateBodyObject({
            key: itemAlreadyOnCart.key,
            quantity: quantity + itemAlreadyOnCart.quantity,
            properties,
            selling_plan
          })
          return this.updateCartItemFetch(requestBody)
        }

        requestBody.key = itemAlreadyOnCart.key
      }

      this.isLoading = true
      try {
        const response =
          await generateFetchRequest('/cart/add.js', 'POST', requestBody, null)
          await this.getCartItemVariantData(response.data);
          
        this.items.length === 0
          ? this.items.push(response.data)
          : this.items = [response.data].concat(this.items)
        await this.getCartItemsVariantData(this.items);
        const cartTemplate = document.querySelector('body[data-template="cart"]');
        if(cartTemplate){
          
        }else{
          this.open()
        }
        
        temporalUpdateBubbleCartCount(this.totalItems)

        return handleResponseOrError(response, null);
      } catch (error) {
        return handleResponseOrError(null, error);
      } finally {
        this.isLoading = false
      }
    },

    async updateCartItem({ key, quantity = 1, properties = false, selling_plan = null }) {
      const error = validateCartItem({ key, quantity, properties });
      if (error) { return handleResponseOrError(null, error); }

      this.isLoading = true
      const requestBody = generateBodyObject({
        key: key,
        quantity,
        properties,
        selling_plan
      })

      return await this.updateCartItemFetch(requestBody)
    },


    async updateCartItemFetch(requestBody) {
      const error = validateCartItem({ key: requestBody.key });
      if (error) { return handleResponseOrError(null, error); }

      const key = requestBody.key
      const updateRequestBody = {
        updates: {
          [key]: requestBody.quantity
        }
      }
      try {
        const response =
          await generateFetchRequest('/cart/update.js', 'POST', updateRequestBody, null)
          

        this.items = response.data.items
        await this.getCartItemsVariantData(this.items);
        const cartTemplate = document.querySelector('body[data-template="cart"]');
        if(cartTemplate){
          
        }else{
          this.open()
        }
        temporalUpdateBubbleCartCount(this.totalItems)

        return handleResponseOrError(response, null);
      } catch (error) {
        return handleResponseOrError(null, error);
      } finally {
        this.isLoading = false
      }
    },

    async changeCartItemFetch(requestBody) {
      try {
        const response =
          await generateFetchRequest('/cart/change.js', 'POST', requestBody, null)

        this.items = response.data.items
        this.open();
        temporalUpdateBubbleCartCount(this.totalItems)
        return handleResponseOrError(response, null);

      } catch (error) {
        return handleResponseOrError(null, error);
      } finally {
        this.isLoading = false
      }
    },

    removeCartItem(key) {
      if (this.isProductInCartByKey(key)) {
        return this.updateCartItem({ key, quantity: 0 })
      } else {
        return handleResponseOrError(null, ERROR_MESSAGES.PRODUCT_NOT_IN_CART);
      }
    },


    isProductInCartById(id) {
      return this.items.find(item => item.id === id)
    },

    isProductInCartByKey(key) {
      return this.items.find(item => item.key === key)
    },

    async applyDiscount(discountCode) {
      return applyDiscount(discountCode)
    },

    async removeDiscount() {
      return removeDiscount()
    },

    async applyGiftCard(giftCardCode) {
      return applyGiftCard(giftCardCode)
    },

    async removeGiftCard(giftCardId) {
      return removeGiftCard(giftCardId)
    },

    updateNote(note) {
      this.note = note;
    },
    checkout() {
      const checkoutUrl = `/checkout?note=${encodeURIComponent(this.note)}`;
      window.location.href = checkoutUrl;
    },
    giftMessage() {
      var textArea = document.getElementById('SideCartSpecialInstructions')
      textArea.disabled = !textArea.disabled
      
      var totalChars      = 200; //Total characters allowed in textarea
      var countTextBox    = document.getElementById('SideCartSpecialInstructions') // Textarea input box
      var charsCountEl    = document.getElementById('sidecountchars'); // Remaining chars count will be displayed here

        charsCountEl.innerHTML = totalChars;
        countTextBox.addEventListener("keyup", (event) => {
          var thisChars = countTextBox.value.length;
          var remaingtext = totalChars - thisChars;
          charsCountEl.innerHTML = remaingtext;

      });
    }
  }
})

export const useCartStore = useCartStoreDefinition
window.theme = {
  toggleCart: () => {
    const cart = useCartStoreDefinition();
    cart.toggle();
  },
  openCart: () => {
    const cart = useCartStoreDefinition();
    cart.open();
  },
  addToCart: async (item) => {
    const cart = useCartStoreDefinition();
    const response = await cart.addToCart(item);
    return response
  },
  fetchCart: () =>{
    const cart = useCartStoreDefinition();
    cart.fetchCart();
  },
  removeBundle: (requestBody) => {
    const cart = useCartStoreDefinition();
    cart.removeBundle(requestBody);
  }
}
