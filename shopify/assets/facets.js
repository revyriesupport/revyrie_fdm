const filtersToggle = function () {
  const toggleBtn = document.getElementById("desktop-filter-toggler");
  const filterItems = document.querySelectorAll(".filter_item");
  toggleBtn.addEventListener("click", (e) => {
    filterItems.forEach((item) => {
      item.classList.toggle("hidden");
    });
  });
};
filtersToggle();

const ajustViewOn = function (params) {
  //console.group('component-facets ajustViewOn');
  let myDefaults = {
    url: window.location.href,
  };
  params = Object.assign({}, myDefaults, params);
  let { url } = params;
  //console.log('url',url, typeof url);
  url = url.substring(url.indexOf("?") + 1);

  const productGrid = document.getElementById("product-grid"),
    searchParams = new URLSearchParams(url);
};
const allCombinations = function (array) {
  let combi = [],
    temp = "",
    slent = Math.pow(2, array.length);

  for (let i = 0; i < slent; i++) {
    temp = "";
    for (let j = 0; j < array.length; j++) {
      //console.log('i',i,'j',j,'Math.pow(2, j)',Math.pow(2, j),(i & Math.pow(2, j)));
      if (i & Math.pow(2, j)) {
        temp += (temp !== "" ? " " : "") + array[j];
      }
      //console.log('temp',temp);
    }
    if (temp !== "") {
      combi.push(temp);
    }
  }
  //console.log(combi.join("\n"));
  return combi;
};
/**
 * * Reconocer parametros
 */
const ajustTags = function (params) {
  let myDefaults = {
    url: window.location.href,
  };
  params = Object.assign({}, myDefaults, params);
  let { url } = params;
  urlSearch = url.substring(url.indexOf("?") + 1);
  //console.log('url',url,'url.search',url.search);

  const searchParams = new URLSearchParams(urlSearch);
  let tags = "",
    tagsObject = {},
    tagsSize = 0;

  if (true) {
    tags = searchParams.getAll("filter.v.option.size");
    let selectedSizes = searchParams.getAll("selectedSizes");
    console.log("selectedSizes", selectedSizes);
    //console.log('tag',tags);
    tags.forEach((tag) => {
      //console.log('tag',tag);
      document
        .querySelectorAll(
          '.facets__details-size [name="filter.v.option.size"][value="' +
            tag +
            '"], .mobile-facets__details-size [name="filter.v.option.size"][value="' +
            tag +
            '"]'
        )
        .forEach((element) => {
          let isAllTags = true;
          element.parentNode.querySelectorAll("input").forEach((subelement) => {
            element != subelement && subelement.name != "filter.v.option.size"
              ? (isAllTags = false)
              : null;
          });
          if (
            isAllTags == true &&
            selectedSizes.includes(element.getAttribute("data-size-label"))
          ) {
            element.checked = true;

            element.parentNode
              .querySelectorAll("input")
              .forEach((subelement) => {
                element != subelement
                  ? (subelement.checked = element.checked)
                  : null;
              });
          }
          let parentLabel = "==XX==";
          //console.log('element',element,'facets__details-size',element.closest('.facets__details-size'),'mobile-facets__details-size',element.closest('.mobile-facets__details-size'));
          if (element.closest(".facets__details-size") != null) {
            parentLabel = element.closest(".facets__details-size").dataset
              .label;
          } else if (element.closest(".mobile-facets__details-size")) {
            parentLabel = element.closest(".mobile-facets__details-size")
              .dataset.label;
          }
          if (tagsObject[parentLabel] == null) {
            tagsObject[parentLabel] = {};
          }
          tagsObject[parentLabel][element.parentElement.dataset.index] = 1;
          //console.log('parentLabel',parentLabel,tagsObject[parentLabel]);
        });
    });
  }

  //console.log('url',url,(url.includes(window.location.hostname) == false ? window.location.protocol + window.location.hostname : '') + url);
  let newUrl = new URL(
      (url.includes(window.location.hostname) == false
        ? window.location.protocol + window.location.hostname
        : "") + url
    ),
    urlParams = new URLSearchParams(newUrl.search);
  urlParams.delete("page");
  urlParams.delete("view_on");
  urlParams.delete("section_id");
  urlParams.delete("filter.p.tag");
  urlParams.set("view", "list-tags");
  newUrl.search = urlParams.toString();

  fetch(newUrl)
    .then((response) => response.text())
    .then((responseText) => {
      //console.log('responseText',responseText);
      let tagsFoundAll = responseText.split("=;=");
      //console.log('tagsFoundAll',tagsFoundAll);
      urlParams.set("view", "list-tags");
      newUrl.search = urlParams.toString();

      console.log('url params -------',);
       document
        .querySelectorAll(".facets__details-tags .list-menu__item, .mobile-facets__details-tags .list-menu__item")
        .forEach((element) => {
          if(urlParams.size == 1) {
            element.style.display = "none";
          }
          element.classList.add("list-menu__item--disabled");
        });
       document
        .querySelectorAll('.facets__details-tags .list-menu__item [name="filter.p.tag"]:checked, .mobile-facets__details-tags .list-menu__item [name="filter.p.tag"]:checked')
        .forEach((element) => {
          console.log("element-value", element.value);
          element.closest(".list-menu__item").style.display = "";
          element
            .closest(".list-menu__item")
            .classList.remove("list-menu__item--disabled");
        });
       tagsFoundAll.forEach((tag) => {
        // tagss
        //console.log('tag',tag);
        document
          .querySelectorAll('.facets__details-tags.facets__details-category [name="filter.p.tag"][value="' + tag + '"], .mobile-facets__details-tags.mobile-facets__details-category [name="filter.p.tag"][value="' + tag + '"]'
          )
          .forEach((element) => {
            //console.log('element-value', element.value, element.closest('.list-menu__item'));
            element.closest(".list-menu__item").style.display = "";
            element
              .closest(".list-menu__item")
              .classList.remove("list-menu__item--disabled");
            //console.log('element-value', element.value, element.closest('.list-menu__item').style.display);
          });
        document
          .querySelectorAll('.facets__details-tags.facets__details-color [name="filter.p.tag"][value="' + tag + '"], .mobile-facets__details-tags.mobile-facets__details-color [name="filter.p.tag"][value="' + tag + '"]'
          )
          .forEach((element) => {
            element.closest(".list-menu__item").style.display = "";
          });
      });
      fetch(newUrl)
        .then((response) => response.text())
        .then((responseText) => {
          //alert('yeah 2 ');
          //console.log('responseText',responseText);
          let tagsFound = responseText.split("=;=");
          //console.log('tagsFound',tagsFound);
          /**
           * Categories Hiding
           */
           document.querySelectorAll('.facets__details-tags.facets__details-category [name="filter.p.tag"], .mobile-facets__details-tags.mobile-facets__details-category [name="filter.p.tag"]')
          .forEach((element)=>{
            if(!tagsFound.includes(element.value)) {
              element
              .closest(".list-menu__item")
              .classList.add("list-menu__item--disabled");
            }
          });
          /**
           * Categories Hide logic end
           */

          tagsFound.forEach((tag) => {
            //console.log('tag',tag);
            document
              .querySelectorAll('.facets__details-tags.facets__details-color [name="filter.p.tag"][value="' + tag + '"], .mobile-facets__details-tags.mobile-facets__details-color [name="filter.p.tag"][value="' + tag +'"]'
              )
              .forEach((element) => {
                element
                  .closest(".list-menu__item")
                  .classList.remove("list-menu__item--disabled");
              });
          });

          if (searchParams.has("filter.p.tag") == true) {
            tags = searchParams.getAll("filter.p.tag");
            //console.log('tags',tags);
            tags.forEach((tag) => {
              //console.log('tag',tag);
              let findTags = [];
              findTags.push(tag);
              if (tag.includes(" ")) {
                //findTags = tag.split(' ');
                findTags = allCombinations(tag.split(" "));
              }
              //console.log('findTags',findTags);
              findTags.forEach((findTag) => {
                document
                  .querySelectorAll('.facets__details-tags [name="filter.p.tag"][value="' + findTag + '"], .mobile-facets__details-tags [name="filter.p.tag"][value="' + findTag + '"]')
                  .forEach((element) => {
                    let isAllTags = true;
                    element.parentNode
                      .querySelectorAll("input")
                      .forEach((subelement) => {
                        element != subelement &&
                        subelement.name != "filter.p.tag"
                          ? (isAllTags = false)
                          : null;
                      });
                    if (isAllTags == true) {
                      element.checked = true;
                      element.parentNode
                        .querySelectorAll("input")
                        .forEach((subelement) => {
                          element != subelement
                            ? (subelement.checked = element.checked)
                            : null;
                        });
                    }
                    element.closest(".list-menu__item").style.display = "";
                    element
                      .closest(".list-menu__item")
                      .classList.remove("list-menu__item--disabled");
                    let parentLabel = "==XX==";
                    //console.log('element',element,'facets__details-tags',element.closest('.facets__details-tags'),'mobile-facets__details-tags',element.closest('.mobile-facets__details-tags'));
                    if (element.closest(".facets__details-tags") != null) {
                      parentLabel = element.closest(".facets__details-tags")
                        .dataset.label;
                    } else if (
                      element.closest(".mobile-facets__details-tags")
                    ) {
                      parentLabel = element.closest(
                        ".mobile-facets__details-tags"
                      ).dataset.label;
                    }
                    if (tagsObject[parentLabel] == null) {
                      tagsObject[parentLabel] = {};
                    }
                    tagsObject[parentLabel][
                      element.parentElement.dataset.index
                    ] = 1;
                    //console.log('parentLabel',parentLabel,tagsObject[parentLabel]);
                  });
              });
            });
          }
          //console.log('tagsObject',tagsObject);
          document
            .querySelectorAll(
              ".facets__details-tags, .mobile-facets__details-tags"
            )
            .forEach((element) => {
              let parentLabel = element.dataset.label;
              //console.log('parentLabel',parentLabel);
              tagsSize = 0;
              if (parentLabel != undefined) {
                if (tagsObject[parentLabel] != null) {
                  tagsSize = Object.keys(tagsObject[parentLabel]).length;
                }
              } else if (tagsObject["==XX=="] != null) {
                tagsSize = Object.keys(tagsObject["==XX=="]).length;
              }
              element.querySelectorAll("summary").forEach((subelement) => {
                subelement.ariaLabel =
                  parentLabel + " (" + tagsSize + " selected)";
              });
              element
                .querySelectorAll("summary .facets__selected")
                .forEach((subelement) => {
                  subelement.innerHTML = " (" + tagsSize + ")";
                  if (tagsSize > 0) {
                    subelement.classList.remove("hidden");
                  } else {
                    subelement.classList.add("hidden");
                  }
                });
              element
                .querySelectorAll(".facets__header .facets__selected")
                .forEach((subelement) => {
                  subelement.innerHTML = tagsSize + " selected";
                });
            });
        });
    });
  setTimeout(() => {
    checkSelectedSizes();
  }, 500);
};
const checkSelectedSizes = function (params) {
  let myDefaults = {
    url: window.location.href,
  };
  params = Object.assign({}, myDefaults, params);
  let { url } = params;
  urlSearch = url.substring(url.indexOf("?") + 1);
  //console.log('url',url,'url.search',url.search);

  const searchParams = new URLSearchParams(urlSearch);
  let tags = "",
    tagsObject = {},
    tagsSize = 0;

  tags = searchParams.getAll("filter.v.option.size");
  let selectedSizes = searchParams.getAll("selectedSizes");
  if (selectedSizes.length > 0) {
    selectedSizes = selectedSizes[0].split(",");
  }

  document
    .querySelectorAll('[name="filter.v.option.size"]')
    .forEach((input) => {
      if (
        input.checked &&
        !selectedSizes.includes(input.getAttribute("data-size-label"))
      ) {
        input.checked = false;
      }
    });

  let selectedSizeCounter = document.querySelectorAll(".sizes-count");
  const selectedSvgs = document.querySelectorAll(
    ".facet-checkbox>input[type=checkbox]:checked~svg"
  );
  console.log("selected svgs ", selectedSvgs.length);
  selectedSizeCounter.forEach((item) => {
    item.innerHTML = " (" + selectedSizes.length + ")";
  });
};

ajustViewOn();
ajustTags();
setTimeout(() => {
  checkSelectedSizes();
}, 1000);

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}
function onKeyUpEscape(event) {
  if (event.code.toUpperCase() !== "ESCAPE") return;

  const openDetailsElement = event.target.closest("details[open]");
  if (!openDetailsElement) return;

  const summaryElement = openDetailsElement.querySelector("summary");
  openDetailsElement.removeAttribute("open");
  summaryElement.setAttribute("aria-expanded", false);
  summaryElement.focus();
}

/**
 * * evento check onSubmitHandler*()
 */
class FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    this.onActiveFilterClick = this.onActiveFilterClick.bind(this);

    this.debouncedOnSubmit = debounce((event) => {
      this.onSubmitHandler(event);
    }, 500);

    const facetForm = this.querySelector("form");
    facetForm.addEventListener("input", this.debouncedOnSubmit.bind(this));

    const facetWrapper = this.querySelector("#FacetsWrapperDesktop");
    if (facetWrapper) facetWrapper.addEventListener("keyup", onKeyUpEscape);
  }

  static setListeners() {
    const onHistoryChange = (event) => {
      const searchParams = event.state
        ? event.state.searchParams
        : FacetFiltersForm.searchParamsInitial;
      if (searchParams === FacetFiltersForm.searchParamsPrev) return;
      FacetFiltersForm.renderPage(searchParams, null, false);
    };
    window.addEventListener("popstate", onHistoryChange);
  }

  static toggleActiveFacets(disable = true) {
    document.querySelectorAll(".js-facet-remove").forEach((element) => {
      element.classList.toggle("disabled", disable);
    });
  }

  static renderPage(searchParams, event, updateURLHash = true) {
    FacetFiltersForm.searchParamsPrev = searchParams;
    const sections = FacetFiltersForm.getSections();
    const countContainer = document.getElementById("ProductCount");
    const countContainerDesktop = document.getElementById(
      "ProductCountDesktop"
    );

    document
      .getElementById("ProductGridContainer")
      .querySelector(".collection")
      .classList.add("loading");
    if (countContainer) {
      countContainer.classList.add("loading");
    }
    if (countContainerDesktop) {
      countContainerDesktop.classList.add("loading");
    }

    sections.forEach((section) => {
      const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
      const filterDataUrl = (element) => element.url === url;

      FacetFiltersForm.filterData.some(filterDataUrl)
        ? FacetFiltersForm.renderSectionFromCache(filterDataUrl, event)
        : FacetFiltersForm.renderSectionFromFetch(url, event);
    });

    if (updateURLHash) FacetFiltersForm.updateURLHash(searchParams);
  }

  static renderSectionFromFetch(url, event) {
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => {


        console.log("url ==========");
        console.log(url);

        const html = responseText;

        FacetFiltersForm.filterData = [
          ...FacetFiltersForm.filterData,
          { html, url },
        ];
        setTimeout(() => {

          FacetFiltersForm.renderProductGridContainer(html);
          FacetFiltersForm.renderFilters(html, event);
          FacetFiltersForm.renderProductCount(html);

          if (
            document.querySelector(
              ".choose-quantity .quantity-option.active span"
            ) != null
          ) {
            validateAddToCart(
              document.querySelector(
                ".choose-quantity .quantity-option.active span"
              ).textContent
            );
            $(document).foundation();
            eventPopup();
          }

          ajustViewOn({ url: url });
          ajustTags({ url: url });
        }, 1500);
      });
  }

  static renderSectionFromCache(filterDataUrl, event) {
    const html = FacetFiltersForm.filterData.find(filterDataUrl).html;
    FacetFiltersForm.renderFilters(html, event);
    FacetFiltersForm.renderProductGridContainer(html);
    FacetFiltersForm.renderProductCount(html);

    ajustViewOn({ url: FacetFiltersForm.filterData.find(filterDataUrl).url });
    ajustTags({ url: FacetFiltersForm.filterData.find(filterDataUrl).url });
    
    if (
      document.querySelector(".choose-quantity .quantity-option.active span") !=
      null
    ) {
      validateAddToCart(
        document.querySelector(".choose-quantity .quantity-option.active span")
          .textContent
      );
      $(document).foundation();
      eventPopup();
    }
  }

  static renderProductGridContainer(html) {
    document.getElementById("ProductGridContainer").innerHTML = new DOMParser()
      .parseFromString(html, "text/html")
      .getElementById("ProductGridContainer").innerHTML;
  }

  static renderProductCount(html) {
    const htmlPase = new DOMParser().parseFromString(html, "text/html");
    if (htmlPase.getElementById("ProductCount") != null) {
      const count = htmlPase.getElementById("ProductCount").innerHTML;
      const container = document.getElementById("ProductCount");
      const containerDesktop = document.getElementById("ProductCountDesktop");
      if (container) {
        container.innerHTML = count;
        container.classList.remove("loading");
      }
      if (containerDesktop) {
        containerDesktop.innerHTML = count;
        containerDesktop.classList.remove("loading");
      }
    }
  }

  static renderFilters(html, event) {
    const parsedHTML = new DOMParser().parseFromString(html, "text/html");

    const facetDetailsElements = parsedHTML.querySelectorAll(
      "#FacetFiltersForm .js-filter, #FacetFiltersFormMobile .js-filter, #FacetFiltersFormMobileSort .js-filter, #FacetFiltersPillsForm .js-filter"
    );
    const matchesIndex = (element) => {
      const jsFilter = event ? event.target.closest(".js-filter") : undefined;
      return jsFilter
        ? element.dataset.index === jsFilter.dataset.index
        : false;
    };
    const facetsToRender = Array.from(facetDetailsElements).filter(
      (element) => !matchesIndex(element)
    );
    const countsToRender = Array.from(facetDetailsElements).find(matchesIndex);

    facetsToRender.forEach((element) => {
      document.querySelector(
        `.js-filter[data-index="${element.dataset.index}"]`
      ).innerHTML = element.innerHTML;
    });

    FacetFiltersForm.renderActiveFacets(parsedHTML);
    FacetFiltersForm.renderAdditionalElements(parsedHTML);

    if (countsToRender)
      FacetFiltersForm.renderCounts(
        countsToRender,
        event.target.closest(".js-filter")
      );
  }

  static renderActiveFacets(html) {
    const activeFacetElementSelectors = [
      ".active-facets-mobile",
      ".active-facets-desktop",
    ];

    activeFacetElementSelectors.forEach((selector) => {
      const activeFacetsElement = html.querySelector(selector);
      if (!activeFacetsElement) return;
      document.querySelector(selector).innerHTML =
        activeFacetsElement.innerHTML;
    });

    FacetFiltersForm.toggleActiveFacets(false);
  }

  static renderAdditionalElements(html) {
    const mobileElementSelectors = [
      ".mobile-facets__open",
      ".mobile-facets__count",
      ".sorting",
    ];

    mobileElementSelectors.forEach((selector) => {
      if (!html.querySelector(selector)) return;
      document.querySelector(selector).innerHTML =
        html.querySelector(selector).innerHTML;
    });

    document
      .getElementById("FacetFiltersFormMobile")
      .closest("menu-drawer")
      .bindEvents();
  }

  static renderCounts(source, target) {
    const targetElement = target.querySelector(".facets__selected");
    const sourceElement = source.querySelector(".facets__selected");

    const targetElementAccessibility = target.querySelector(".facets__summary");
    const sourceElementAccessibility = source.querySelector(".facets__summary");

    if (sourceElement && targetElement) {
      target.querySelector(".facets__selected").outerHTML =
        source.querySelector(".facets__selected").outerHTML;
    }

    if (targetElementAccessibility && sourceElementAccessibility) {
      target.querySelector(".facets__summary").outerHTML =
        source.querySelector(".facets__summary").outerHTML;
    }
  }

  static updateURLHash(searchParams) {
    history.pushState(
      { searchParams },
      "",
      `${window.location.pathname}${searchParams && "?".concat(searchParams)}`
    );
    //console.log('updateURLHash-searchParams',searchParams);
  }

  static getSections() {
    return [
      {
        section: document.getElementById("product-grid").dataset.id,
      },
    ];
  }

  createSearchParams(form) {
    //console.group('component-facets FacetFiltersForm-createSearchParams');
    const formData = new FormData(form);
    if (form.querySelector('[name="filter.v.price.gte"][data-checked="true"]') == null) {
      formData.delete("filter.v.price.gte");
    }
    if (form.querySelector('[name="filter.v.price.lte"][data-checked="true"]') == null) {
      formData.delete("filter.v.price.lte");
    }

    return new URLSearchParams(formData).toString();
  }

  onSubmitForm(searchParams, event) {
    let availabilityParameter = "";

    console.log("before searchParams", searchParams, typeof(searchParams));
    if (searchParams.includes("filter.v.availability=1")) {
      availabilityParameter = "";
    } else {
      availabilityParameter = (searchParams != '' ? '&' : '') + "filter.v.availability=1";
    }
    console.log("after searchParams", searchParams, 'availabilityParameter', availabilityParameter);
    FacetFiltersForm.renderPage(searchParams + availabilityParameter, event);
  }

  onSubmitHandler(event) {
    console.group('component-facets FacetFiltersForm-onSubmitHandler');
    event.preventDefault();
    const sizeLabels = [];
    const sortFilterForms = document.querySelectorAll(
      "facet-filters-form form"
    );
    // if es mobile
    if (event.srcElement.className == "mobile-facets__checkbox") {
      console.log("1");
      const searchParams = this.createSearchParams(
        event.target.closest("form")
      );

      this.onSubmitForm(searchParams, event);
    } else {
      const forms = [];
      const isMobile =
        event.target.closest("form").id === "FacetFiltersFormMobile";
      console.log("2");
      sortFilterForms.forEach((form) => {
        if (!isMobile) {
          console.log("3");
          if (
            form.id === "FacetSortForm" ||
            form.id === "FacetFiltersForm" ||
            form.id === "FacetSortDrawerForm"
          ) {
            const noJsElements = document.querySelectorAll(".no-js-list");
            noJsElements.forEach((el) => el.remove());
            if (
              event.target.name == "filter.v.option.size" &&
              form.querySelectorAll(
                '[name="filter.v.option.size"][value="' +
                  event.target.value +
                  '"]'
              ).length > 1
            ) {
              console.log("5");
            }

            form
              .querySelectorAll('[name="filter.v.option.size"]')
              .forEach((input) => {
                if (input.checked) {
                  const sizeLabel = input.getAttribute("data-size-label");
                  if (sizeLabel && !sizeLabels.includes(sizeLabel)) {
                    sizeLabels.push(sizeLabel);
                  }
                }
              });

            forms.push(this.createSearchParams(form));
          }
        } else if (form.id === "FacetFiltersFormMobile") {
          console.log("mobile size changed");

          form
            .querySelectorAll('[name="filter.v.option.size"]')
            .forEach((input) => {
              if (input.checked) {
                const sizeLabel = input.getAttribute("data-size-label");
                if (sizeLabel && !sizeLabels.includes(sizeLabel)) {
                  sizeLabels.push(sizeLabel);
                }
              }
            });
          console.log("to send params: ", this.createSearchParams(form));
          forms.push(this.createSearchParams(form));
        }
      });
      let sizesAttr = sizeLabels.length > 0 ? "selectedSizes=" + sizeLabels.join(",") + "&" : "";

      //console.log('sizesAttr', sizesAttr, 'forms', forms.join("&"));
      this.onSubmitForm(sizesAttr + forms.join("&"), event);
    }
    console.groupEnd();
  }

  onActiveFilterClick(event) {
    event.preventDefault();
    FacetFiltersForm.toggleActiveFacets();
    
    const url =
      event.currentTarget.href.indexOf("?") == -1
        ? ""
        : event.currentTarget.href.slice(
            event.currentTarget.href.indexOf("?") + 1
          );
    FacetFiltersForm.renderPage(url);
  }
}

FacetFiltersForm.filterData = [];
FacetFiltersForm.searchParamsInitial = window.location.search.slice(1);
FacetFiltersForm.searchParamsPrev = window.location.search.slice(1);
customElements.define("facet-filters-form", FacetFiltersForm);
FacetFiltersForm.setListeners();

class PriceRange extends HTMLElement {
  constructor() {
    super();
    this.querySelectorAll("input").forEach((element) =>
      element.addEventListener("change", this.onRangeChange.bind(this))
    );
    this.setMinAndMaxValues();
  }

  onRangeChange(event) {
    this.adjustToValidValues(event.currentTarget);
    this.setMinAndMaxValues();
  }

  setMinAndMaxValues() {
    const inputs = this.querySelectorAll("input");
    const minInput = inputs[0];
    const maxInput = inputs[1];
    if (maxInput.value) minInput.setAttribute("max", maxInput.value);
    if (minInput.value) maxInput.setAttribute("min", minInput.value);
    if (minInput.value === "") maxInput.setAttribute("min", 0);
    if (maxInput.value === "")
      minInput.setAttribute("max", maxInput.getAttribute("max"));
  }

  adjustToValidValues(input) {
    const value = Number(input.value);
    const min = Number(input.getAttribute("min"));
    const max = Number(input.getAttribute("max"));

    if (value < min) input.value = min;
    if (value > max) input.value = max;
  }
}
customElements.define("price-range", PriceRange);
class PriceRadio extends HTMLElement {
  constructor() {
    super();
    this.querySelectorAll("input").forEach((element) =>
      element.addEventListener("change", this.onRangeChange.bind(this))
    );
    this.setMinAndMaxValues();
  }

  onRangeChange(event) {
    event.preventDefault();
    this.adjustToValidValues(event.currentTarget);
    this.setMinAndMaxValues();
    event.currentTarget.parentNode
      .querySelectorAll("input")
      .forEach((element) =>
        event.currentTarget != element ? (element.checked = true) : null
      );
  }

  setMinAndMaxValues() {
    const inputs = this.querySelectorAll("input");
    const minInput = inputs[0];
    const maxInput = inputs[1];
    if (maxInput.value) minInput.setAttribute("max", maxInput.value);
    if (minInput.value) maxInput.setAttribute("min", minInput.value);
    if (minInput.value === "") maxInput.setAttribute("min", 0);
    if (maxInput.value === "")
      minInput.setAttribute("max", maxInput.getAttribute("max"));
  }

  adjustToValidValues(input) {
    const value = Number(input.value);
    const min = Number(input.getAttribute("min"));
    const max = Number(input.getAttribute("max"));

    if (value < min) input.value = min;
    if (value > max) input.value = max;
  }
}
customElements.define("price-radio", PriceRadio);

class ColorCheck extends HTMLElement {
  constructor() {
    super();
    this.querySelectorAll("input").forEach((element) => {
      element.addEventListener("change", this.onColorChange.bind(this));
    });
  }

  onColorChange(event) {
    event.preventDefault();
    event.currentTarget.parentNode
      .querySelectorAll("input")
      .forEach((element) =>
        event.currentTarget != element
          ? (element.checked = event.currentTarget.checked)
          : null
      );
  }
}
customElements.define("color-check", ColorCheck);
class SizeCheck extends HTMLElement {
  constructor() {
    super();
    this.querySelectorAll("input").forEach((element) => {
      element.addEventListener("change", this.onSizeChange.bind(this));
    });
  }

  onSizeChange(event) {
    event.preventDefault();
    event.currentTarget.parentNode
      .querySelectorAll("input")
      .forEach((element) =>
        event.currentTarget != element
          ? (element.checked = event.currentTarget.checked)
          : null
      );
  }
}
customElements.define("size-check", SizeCheck);

class FacetRemove extends HTMLElement {
  constructor() {
    super();
    const facetLink = this.querySelector("a:last-of-type");
    if (facetLink) {
      facetLink.setAttribute("role", "button");
      facetLink.addEventListener("click", this.closeFilter.bind(this));
      facetLink.addEventListener("keyup", (event) => {
        event.preventDefault();
        if (event.code.toUpperCase() === "SPACE") this.closeFilter(event);
      });
    }
  }

  closeFilter(event) {
    event.preventDefault();
    const form =
      this.closest("facet-filters-form") ||
      document.querySelector("facet-filters-form");
    form.onActiveFilterClick(event);
  }
}
customElements.define("facet-remove", FacetRemove);

class ShowMoreButton extends HTMLElement {
  constructor() {
    super();
    const button = this.querySelector("button");
    button.addEventListener("click", (event) => {
      this.expandShowMore(event);
      const nextElementToFocus = event.target
        .closest(".parent-display")
        .querySelector(".show-more-item");
      if (
        nextElementToFocus &&
        !nextElementToFocus.classList.contains("hidden")
      ) {
        nextElementToFocus.querySelector("input").focus();
      }
    });
  }
  expandShowMore(event) {
    const parentDisplay = event.target
      .closest('[id^="Show-More-"]')
      .closest(".parent-display");
    const parentWrap = parentDisplay.querySelector(".parent-wrap");
    this.querySelectorAll(".label-text").forEach((element) =>
      element.classList.toggle("hidden")
    );
    parentDisplay
      .querySelectorAll(".show-more-item")
      .forEach((item) => item.classList.toggle("hidden"));
  }
}
customElements.define("show-more-button", ShowMoreButton);
