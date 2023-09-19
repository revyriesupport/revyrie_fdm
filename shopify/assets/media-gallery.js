const IS_ACTIVE = 'is-active'
const IS_HIDDEN = 'is-hidden'

if (!customElements.get('media-gallery')) {
  customElements.define(
    'media-gallery',
    class MediaGallery extends HTMLElement {
      constructor() {
        super();
        this.activeColor = null;
        this.elements = {
          liveRegion: this.querySelector('[id^="GalleryStatus"]'),
          viewer: this.querySelector('[id^="GalleryViewer"]'),
          thumbnails: this.querySelector('[id^="GalleryThumbnails"]'),
        };
        this.mql = window.matchMedia('(min-width: 750px)');

        if (!this.elements.thumbnails) return;

        this.elements.viewer.addEventListener(
          'slideChanged',
          debounce(this.onSlideChanged.bind(this), 500),
        );
        this.elements.thumbnails
          .querySelectorAll('[data-target]')
          .forEach((mediaToSwitch) => {
            mediaToSwitch
              .querySelector('button')
              .addEventListener(
                'click',
                this.setActiveMedia.bind(
                  this,
                  mediaToSwitch.dataset.target,
                  false,
                ),
              );
          });

        if (
          this.dataset.desktopLayout.includes('thumbnail') &&
          this.mql.matches
        )
          this.removeListSemantic();
      }

      connectedCallback() {
        if (this.dataset.activeColor && this.dataset.activeColor !== 'default-title') {
          this.activeColor = this.dataset.activeColor;
          this.filterImagesByColor();

          this.addEventListener('colorChanged', (event) => {
            this.activeColor = event.detail.color;
            this.filterImagesByColor();
          });
        }
      }

      filterImagesByColor() {
        if (!this.activeColor || !this.dataset.hasVariantImages) {
          this.elements.viewer
            .querySelectorAll('[data-media-id]')
            .forEach((element) => {
              element.classList.remove(IS_HIDDEN);
            });


          this.elements.thumbnails && this.elements.thumbnails
            .querySelectorAll('[data-media-position]')
            .forEach((element) => {
              element.classList.remove(IS_HIDDEN);
            });
        } else {
          this.processElements.call(this, this.elements.viewer, 'li[data-media-id]');

          if (this.elements.thumbnails) {
            this.processElements.call(this, this.elements.thumbnails, '[data-media-position]');

            const firstImages = document.querySelector('.thumbnail-list__item:not(.is-hidden)');
            if (firstImages) {
              const activeThumbnail = this.elements.thumbnails.querySelector(`[data-target="${firstImages.dataset.target}"]`);
              this.setActiveThumbnail(activeThumbnail);
            }
          }
        }
        this.updatePagination();
      }

      processElements(container, selector) {
        container.querySelectorAll(selector).forEach((element) => {
          const { classList, dataset } = element;
          dataset.color === this.activeColor
            ? classList.remove(IS_HIDDEN)
            : classList.add(IS_HIDDEN) && classList.remove(IS_ACTIVE);
        });
      }

      onSlideChanged(event) {
        const thumbnail = this.elements.thumbnails.querySelector(
          `[data-target="${event.detail.currentElement.dataset.mediaId}"]`,
        );
        this.setActiveThumbnail(thumbnail);
      }

      setActiveMedia(mediaId, prepend) {
        const activeMedia = this.elements.viewer.querySelector(
          `[data-media-id="${mediaId}"]`,
        );
        this.elements.viewer
          .querySelectorAll('[data-media-id]')
          .forEach((element) => {
            element.classList.remove(IS_ACTIVE);
          });
        activeMedia.classList.add(IS_ACTIVE);

        if (prepend) {
          activeMedia.parentElement.prepend(activeMedia);
          if (this.elements.thumbnails) {
            const activeThumbnail = this.elements.thumbnails.querySelector(
              `[data-target="${mediaId}"]`,
            );
            activeThumbnail.parentElement.prepend(activeThumbnail);
          }
          if (this.elements.viewer.slider) this.elements.viewer.resetPages();
        }

        this.preventStickyHeader();
        window.setTimeout(() => {
          if (this.elements.thumbnails) {
            activeMedia.parentElement.scrollTo({
              left: activeMedia.offsetLeft,
            });
          }
          if (
            !this.elements.thumbnails ||
            this.dataset.desktopLayout === 'stacked'
          ) {
            activeMedia.scrollIntoView({ behavior: 'smooth' });
          }
        });
        this.playActiveMedia(activeMedia);

        if (!this.elements.thumbnails) return;
        const activeThumbnail = this.elements.thumbnails.querySelector(
          `[data-target="${mediaId}"]`,
        );
        this.setActiveThumbnail(activeThumbnail);
        this.announceLiveRegion(
          activeMedia,
          activeThumbnail.dataset.mediaPosition,
        );
      }

      updatePagination() {
        const totalImages = this.elements.viewer.querySelectorAll('li[data-media-id]:not(.is-hidden)')
        if (totalImages.length <= 0) return;
        document.querySelectorAll('.slider-counter--total').forEach((element) => {
          element.textContent = totalImages.length;
        });
      }

      setActiveThumbnail(thumbnail) {
        if (!this.elements.thumbnails || !thumbnail) return;

        this.elements.thumbnails
          .querySelectorAll('button')
          .forEach((element) => element.removeAttribute('aria-current'));
        thumbnail.querySelector('button').setAttribute('aria-current', true);
        if (this.elements.thumbnails.isSlideVisible(thumbnail, 10)) return;

        this.elements.thumbnails.slider.scrollTo({
          left: thumbnail.offsetLeft,
        });
      }

      announceLiveRegion(activeItem, position) {
        const image = activeItem.querySelector(
          '.product__modal-opener--image img',
        );
        if (!image) return;
        image.onload = () => {
          this.elements.liveRegion.setAttribute('aria-hidden', false);
          this.elements.liveRegion.innerHTML =
            window.accessibilityStrings.imageAvailable.replace(
              '[index]',
              position,
            );
          setTimeout(() => {
            this.elements.liveRegion.setAttribute('aria-hidden', true);
          }, 2000);
        };
        image.src = image.src;
      }

      playActiveMedia(activeItem) {
        window.pauseAllMedia();
        const deferredMedia = activeItem.querySelector('.deferred-media');
        if (deferredMedia) deferredMedia.loadContent(false);
      }

      preventStickyHeader() {
        this.stickyHeader =
          this.stickyHeader || document.querySelector('sticky-header');
        if (!this.stickyHeader) return;
        this.stickyHeader.dispatchEvent(new Event('preventHeaderReveal'));
      }

      removeListSemantic() {
        if (!this.elements.viewer.slider) return;
        this.elements.viewer.slider.setAttribute('role', 'presentation');
        this.elements.viewer.sliderItems.forEach((slide) =>
          slide.setAttribute('role', 'presentation'),
        );
      }
    },
  );
}
