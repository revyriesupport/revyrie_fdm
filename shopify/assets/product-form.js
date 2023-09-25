if (!customElements.get('product-form')) {
  customElements.define('product-form', class ProductForm extends HTMLElement {
    constructor() {
      super();

      this.form = this.querySelector('form');
      this.form.querySelector('[name=id]').disabled = false;
      this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
      this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
      this.submitButton = this.querySelector('[type="submit"]');

      if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');

      this.hideErrors = false; //this.dataset.hideErrors === 'true';
    }

    async onSubmitHandler(evt) {
      evt.preventDefault();
      if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

      this.handleErrorMessage();

      this.submitButton.setAttribute('aria-disabled', true);
      this.submitButton.classList.add('loading');
      this.querySelector('.loading-overlay__spinner').classList.remove('hidden');

      const id = this.form.querySelector('[name=id]').value;
      const quantity = parseInt(document.querySelector('[data-cart-quantity]').value) || 1;

      if (window.location.href.indexOf("physical-gift-card") > -1) {
        var your_email = document.getElementById('gift-card-sender').value;
        var lovers_email = document.getElementById('gift-card-recipient').value;
        var card_msg = document.getElementById('gift-card-message').value;
        var obj = {
          "YOUR EMAIL": your_email,
          "LOVER'S EMAIL": lovers_email,
          "SAY SOMETHING SWEET": card_msg
        };
      }else{
        var obj = {};
      }
      
        await window.theme.addToCart({
        id,
        quantity: quantity || 0,
        properties: obj,
      })
        .then((result) => {
          if (result.error) {
            this.handleErrorMessage(result.error);

            const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
            if (!soldOutMessage) return;
            this.submitButton.setAttribute('aria-disabled', true);
            this.submitButton.querySelector('span').classList.add('hidden');
            soldOutMessage.classList.remove('hidden');
            soldOutMessage.textContent = result.error;
            this.error = true;
            return
          }
          this.error = false;
          const quickAddModal = this.closest('quick-add-modal');
          if (quickAddModal) {
            quickAddModal.hide(true);
          }
        }).finally(() => {
          this.submitButton.classList.remove('loading');
          if (!this.error) this.submitButton.removeAttribute('aria-disabled');
          this.querySelector('.loading-overlay__spinner').classList.add('hidden');
        });

   

      
    }

    handleErrorMessage(errorMessage = false) {
      if (this.hideErrors) return;

      this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
      if (!this.errorMessageWrapper) return;
      this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

      this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

      if (errorMessage) {
        this.errorMessage.textContent = errorMessage;
      }
    }
  });
}
