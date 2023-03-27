if (!customElements.get('product-form')) {
  customElements.define(
    'product-form',
    class ProductForm extends HTMLElement {
      constructor() {
        super();

        this.form = this.querySelector('form');
        this.form.querySelector('[name=id]').disabled = false;
        this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
        this.submitButton = this.querySelector('[type="submit"]');
      }

      async onSubmitHandler(evt) {
        evt.preventDefault();
        if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

        this.handleErrorMessage();

        this.submitButton.setAttribute('aria-disabled', true);
        this.submitButton.classList.add('loading');
        this.querySelector('.loading-overlay__spinner').classList.remove(
          'hidden',
        );

        const id = this.form.querySelector('[name=id]').value;
        await window.theme.addToCart({
          id,
          quantity: 1,
          properties: {
            ink: 'red',
          },
        }).then((result) => {
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
          this.submitButton.removeAttribute('aria-disabled');
          this.querySelector('.loading-overlay__spinner').classList.add('hidden');
        })
      }

      handleErrorMessage(errorMessage = false) {
        this.errorMessageWrapper =
          this.errorMessageWrapper ||
          this.querySelector('.product-form__error-message-wrapper');
        if (!this.errorMessageWrapper) return;
        this.errorMessage =
          this.errorMessage ||
          this.errorMessageWrapper.querySelector(
            '.product-form__error-message',
          );

        this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

        if (errorMessage) {
          this.errorMessage.textContent = errorMessage;
        }
      }
    },
  );
}
