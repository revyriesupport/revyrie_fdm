const ajustViewOnPaginate = function (params) {
  /*let myDefaults = {
    'url': window.location.href
  }*/
  //params = Object.assign({}, myDefaults, params);
  //const {productGridChild, productGridChildSize, viewOn, dataPaginateView} = params;
  if (document.querySelector(".pagination") != null) {
    let viewOn = "";
    if (document.querySelector('[name="view_on"]:checked') != null) {
      viewOn =
        "view_on=" + document.querySelector('[name="view_on"]:checked').value;
    }
    document
      .querySelectorAll(".pagination__item,.pagination__next,.pagination__prev")
      .forEach((item) => {
        if (item.getAttribute("href") != null) {
          //console.log('href',item.getAttribute('href'));
          if (item.getAttribute("href").includes("?") == false) {
            item.setAttribute("href", item.getAttribute("href") + "?" + viewOn);
          } else {
            if (item.href.includes("view_on") == false) {
              item.setAttribute(
                "href",
                item.getAttribute("href") + "&" + viewOn
              );
            } else {
              item.setAttribute(
                "href",
                item.getAttribute("href").replace(/view_on=\d/, viewOn)
              );
            }
          }
        }
      });
  }
};
/**
 * Clear by filter button
 */

const clearByFilter = function (bnt, element) {
  const clearBtn = document.getElementById(bnt);
  if (clearBtn) {
    clearBtn.addEventListener("click", (e) => {
      e.preventDefault();
      setTimeout(() => {
        const grid = document.getElementById(element);
        const checkbox = grid.querySelectorAll(
          "input[type='checkbox']:checked"
        );
        const array = [...checkbox];
        array.map((item) => item.click());
      }, 1000);
    });
  }
};

const clearFilters = function () {
  clearByFilter("clearBtn", "Facet-category-main-collection-product-grid");
  clearByFilter("clearBtnMob", "Category-filters-mobile");

  // size
  clearByFilter("clearBtnSize", "size-filters");
  clearByFilter("clearBtnSizeMob", "size-filters-mob");

  // color
  clearByFilter("clearBtnColor", "Color-filters");
  clearByFilter("clearBtnColorMob", "Color-filtersMob");

  // color
  clearByFilter("clearBtnPrice", "Price-filters");
  clearByFilter("clearBtnPriceMob", "Price-filtersMob");
};
clearFilters();

const ajustViewOnProducts = function (params) {
  /*let myDefaults = {
    'url': window.location.href
  }*/
  //params = Object.assign({}, myDefaults, params);
  const { productGridChild, productGridChildSize, viewOn, dataPaginateView } =
    params;
  //console.log('params',params);

  //console.log('productGridChildSize',productGridChildSize,'viewOn',viewOn,productGridChildSize % viewOn,'.pagination__next',document.querySelector('.pagination__next'));
  let isAll = false;
  if (
    document.querySelector(".pagination__next") == null ||
    (document.querySelector(".view-more-button") != null &&
      document.querySelector(".view-more-button").style.display == "none")
  ) {
    isAll = true;
  }
  if (productGridChildSize % viewOn == 0 || isAll == true) {
    productGridChild.forEach((product) => {
      if (product.classList.contains("hidden") == false) {
        product.style.display = "";
      }
    });
  } else {
    let paginateView =
        parseInt(viewOn) * parseInt(productGridChildSize / parseInt(viewOn)),
      productCount = 1;

    if (paginateView == 0) {
      paginateView = productGridChildSize;
    }
    //console.log('viewOn',parseInt(viewOn),'productGridChildSize',productGridChildSize,productGridChildSize / parseInt(viewOn));
    //console.log('paginateView',paginateView);
    productGridChild.forEach((product) => {
      if (product.classList.contains("hidden") == false) {
        if (productCount <= paginateView) {
          product.style.display = "";
        } else {
          product.style.display = "none";
        }
        productCount++;
      }
    });
  }
};
const ajustViewOn = function (params) {
  let myDefaults = {
    url: window.location.href,
  };
  params = Object.assign({}, myDefaults, params);
  let { url } = params;
  //console.log('url',url, typeof url);
  url = url.substring(url.indexOf("?") + 1);

  const productGrid = document.getElementById("product-grid"),
    searchParams = new URLSearchParams(url);

  //console.log('productGrid.dataset', productGrid,productGrid.dataset);
  if (productGrid.dataset.viewOn != null) {
    let dataViewOn = productGrid.dataset.viewOn,
      dataColumns2 = productGrid.dataset["columns-2"].split(" "),
      dataColumns3 = productGrid.dataset["columns-3"].split(" "),
      dataColumns4 = productGrid.dataset["columns-4"].split(" "),
      dataPaginateView2 = productGrid.dataset["paginateView-2"],
      dataPaginateView3 = productGrid.dataset["paginateView-3"],
      dataPaginateView4 = productGrid.dataset["paginateView-4"],
      viewOn = dataViewOn,
      productGridChild = productGrid.querySelectorAll(".product:not(.hidden)"),
      productGridChildSize = productGridChild.length;

    //console.log('searchParams',searchParams.has('view_on'),'productGrid.dataset',productGrid.dataset);
    if (searchParams.has("view_on") == true) {
      viewOn = searchParams.get("view_on");
    }
    //console.log('viewOn',viewOn,'dataViewOn',dataViewOn);

    productGrid.classList.remove(...dataColumns2);
    productGrid.classList.remove(...dataColumns3);
    productGrid.classList.remove(...dataColumns4);

    switch (viewOn.split("?")[0]) {
      case "2":
        productGrid.classList.add(...dataColumns2);
        productGrid.dataset.viewOn = 2;
        productGrid.dataset.paginateView = dataPaginateView2;
        document.getElementById("Filter-view_on-2") != null &&
          (document.getElementById("Filter-view_on-2").checked = true);
        //console.log('dataColumns2',dataColumns2);
        ajustViewOnProducts({
          productGridChild: productGridChild,
          productGridChildSize: productGridChildSize,
          viewOn: viewOn,
          dataPaginateView: dataPaginateView2,
        });
        break;

      case "3":
        productGrid.classList.add(...dataColumns3);
        productGrid.dataset.viewOn = 3;
        productGrid.dataset.paginateView = dataPaginateView3;
        document.getElementById("Filter-view_on-3") != null &&
          (document.getElementById("Filter-view_on-3").checked = true);
        //console.log('dataColumns3',dataColumns3);
        ajustViewOnProducts({
          productGridChild: productGridChild,
          productGridChildSize: productGridChildSize,
          viewOn: viewOn,
          dataPaginateView: dataPaginateView3,
        });
        break;

      case "4":
        productGrid.classList.add(...dataColumns4);
        productGrid.dataset.viewOn = 4;
        productGrid.dataset.paginateView = dataPaginateView4;
        document.getElementById("Filter-view_on-4") != null &&
          (document.getElementById("Filter-view_on-4").checked = true);
        //console.log('dataColumns4',dataColumns4);
        ajustViewOnProducts({
          productGridChild: productGridChild,
          productGridChildSize: productGridChildSize,
          viewOn: viewOn,
          dataPaginateView: dataPaginateView4,
        });
        break;

      default:
        //console.log('ajustViewOn-viewOn',viewOn, typeof viewOn);
        break;
    }
    ajustViewOnPaginate();
  }
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
const ajustTags = function (params) {
  let myDefaults = {
    url: window.location.href,
  };
  params = Object.assign({}, myDefaults, params);
  let { url } = params;
  urlSearch = url.substring(url.indexOf("?") + 1);
  //console.log('url',url,'url.search',url.search);
  /*
  const searchParams = new URLSearchParams(urlSearch);
  let tags = '',
    tagsObject = {},
    tagsSize = 0;

  if (searchParams.has('filter.v.option.size') == true) {
    tags = searchParams.getAll('filter.v.option.size');
    //console.log('tag',tags);
    tags.forEach( tag => {
      //console.log('tag',tag);
      document.querySelectorAll('.facets__details-size [name="filter.v.option.size"][value="' + tag + '"], .mobile-facets__details-size [name="filter.v.option.size"][value="' + tag + '"]').forEach(element => {
        let isAllTags = true;
        element.parentNode.querySelectorAll('input').forEach(subelement => {
          (element != subelement && subelement.name != "filter.v.option.size") ? isAllTags = false : null
        });
        if (isAllTags == true) {
          element.checked = true;
          element.parentNode.querySelectorAll('input').forEach(subelement => {
            element != subelement ? subelement.checked = element.checked : null
          });
        }
        let parentLabel = '==XX==';
        //console.log('element',element,'facets__details-size',element.closest('.facets__details-size'),'mobile-facets__details-size',element.closest('.mobile-facets__details-size'));
        if (element.closest('.facets__details-size') != null) {
          parentLabel = element.closest('.facets__details-size').dataset.label;
        } else if (element.closest('.mobile-facets__details-size')) {
          parentLabel = element.closest('.mobile-facets__details-size').dataset.label;
        }
        if (tagsObject[parentLabel] == null) {
          tagsObject[parentLabel] = {};
        }
        tagsObject[parentLabel][element.parentElement.dataset.index] = 1;
        //console.log('parentLabel',parentLabel,tagsObject[parentLabel]);
      });
    })
  }

  //console.log('url',url,(url.includes(window.location.hostname) == false ? window.location.protocol + window.location.hostname : '') + url);
  let newUrl = new URL((url.includes(window.location.hostname) == false ? window.location.protocol + window.location.hostname : '') + url),
    urlParams = new URLSearchParams(newUrl.search);
  urlParams.delete('section_id');
  urlParams.set('view','list-tags-all');
  newUrl.search = urlParams.toString();

  //console.log('url',url,'newUrl',newUrl,'urlParams',urlParams.toString());

  fetch(newUrl)
    .then(response => response.text())
    .then((responseText) => {
      //console.log('responseText',responseText);
      let tagsFoundAll = responseText.split('=;=');
      console.log('tagsFoundAll',tagsFoundAll);
      urlParams.set('view','list-tags');
      newUrl.search = urlParams.toString();

      document.querySelectorAll('.facets__details-tags .list-menu__item, .mobile-facets__details-tags .list-menu__item').forEach(element => { element.style.display = 'none'; element.classList.add('list-menu__item--disabled'); });
      document.querySelectorAll('.facets__details-tags .list-menu__item [name="filter.p.tag"]:checked, .mobile-facets__details-tags .list-menu__item [name="filter.p.tag"]:checked').forEach(element => {
        console.log('element-value', element.value);
        element.closest('.list-menu__item').style.display = '';
        element.closest('.list-menu__item').classList.remove('list-menu__item--disabled'); 
      });
      tagsFoundAll.forEach( tag => {
        console.log('tag',tag);
        document.querySelectorAll('.facets__details-tags.facets__details-category [name="filter.p.tag"][value="' + tag + '"], .mobile-facets__details-tags.mobile-facets__details-category [name="filter.p.tag"][value="' + tag + '"]').forEach(element => {
          console.log('element-value', element.value, element.closest('.list-menu__item'));
          element.closest('.list-menu__item').style.display = '';
          element.closest('.list-menu__item').classList.remove('list-menu__item--disabled');
          console.log('element-value', element.value, element.closest('.list-menu__item').style.display);
        });
        document.querySelectorAll('.facets__details-tags.facets__details-color [name="filter.p.tag"][value="' + tag + '"], .mobile-facets__details-tags.mobile-facets__details-color [name="filter.p.tag"][value="' + tag + '"]').forEach(element => {
          element.closest('.list-menu__item').style.display = '';
        });
      });
      fetch(newUrl)
        .then(response => response.text())
        .then((responseText) => {
          //console.log('responseText',responseText);
          let tagsFound = responseText.split('=;=');
          //console.log('tagsFound',tagsFound);

          tagsFound.forEach( tag => {
            //console.log('tag',tag);
            document.querySelectorAll('.facets__details-tags.facets__details-color [name="filter.p.tag"][value="' + tag + '"], .mobile-facets__details-tags.mobile-facets__details-color [name="filter.p.tag"][value="' + tag + '"]').forEach(element => {
              element.closest('.list-menu__item').classList.remove('list-menu__item--disabled');
            });
          });

          if (searchParams.has('filter.p.tag') == true) {
            tags = searchParams.getAll('filter.p.tag');
            //console.log('tags',tags);
            tags.forEach( tag => {
              //console.log('tag',tag);
              let findTags = [];
              findTags.push(tag);
              if (tag.includes(' ')) {
                //findTags = tag.split(' ');
                findTags = allCombinations(tag.split(' '));
              }
              //console.log('findTags',findTags);
              findTags.forEach(findTag => {
                document.querySelectorAll('.facets__details-tags [name="filter.p.tag"][value="' + findTag + '"], .mobile-facets__details-tags [name="filter.p.tag"][value="' + findTag + '"]').forEach(element => {
                  let isAllTags = true;
                  element.parentNode.querySelectorAll('input').forEach(subelement => {
                    (element != subelement && subelement.name != "filter.p.tag") ? isAllTags = false : null
                  });
                  if (isAllTags == true) {
                    element.checked = true;
                    element.parentNode.querySelectorAll('input').forEach(subelement => {
                      element != subelement ? subelement.checked = element.checked : null
                    });
                  }
                  element.closest('.list-menu__item').style.display = '';
                  element.closest('.list-menu__item').classList.remove('list-menu__item--disabled');
                  let parentLabel = '==XX==';
                  //console.log('element',element,'facets__details-tags',element.closest('.facets__details-tags'),'mobile-facets__details-tags',element.closest('.mobile-facets__details-tags'));
                  if (element.closest('.facets__details-tags') != null) {
                    parentLabel = element.closest('.facets__details-tags').dataset.label;
                  } else if (element.closest('.mobile-facets__details-tags')) {
                    parentLabel = element.closest('.mobile-facets__details-tags').dataset.label;
                  }
                  if (tagsObject[parentLabel] == null) {
                    tagsObject[parentLabel] = {};
                  }
                  tagsObject[parentLabel][element.parentElement.dataset.index] = 1;
                  //console.log('parentLabel',parentLabel,tagsObject[parentLabel]);
                });
              });
            });
          }
          //console.log('tagsObject',tagsObject);
          document.querySelectorAll('.facets__details-tags, .mobile-facets__details-tags').forEach(element => {
            let parentLabel = element.dataset.label;
            //console.log('parentLabel',parentLabel);
            tagsSize = 0;
            if (parentLabel != undefined) {
              if (tagsObject[parentLabel] != null) {
                tagsSize = Object.keys(tagsObject[parentLabel]).length;
              }
            } else if (tagsObject['==XX=='] != null) {
              tagsSize = Object.keys(tagsObject['==XX==']).length;
            }
            element.querySelectorAll('summary').forEach(subelement => {
              subelement.ariaLabel = parentLabel + ' (' + tagsSize + ' selected)';
            })
            element.querySelectorAll('summary .facets__selected').forEach(subelement => {
              subelement.innerHTML = ' (' + tagsSize + ')';
              if (tagsSize > 0) {
                subelement.classList.remove('hidden');
              } else {
                subelement.classList.add('hidden');
              }
            })
            element.querySelectorAll('.facets__header .facets__selected').forEach(subelement => {
              subelement.innerHTML = tagsSize + ' selected';
            })
          });
        });
    });
  */
  if (
    document.querySelector(".facets__details-size") != null ||
    document.querySelector(".mobile-facets__details-size")
  ) {
    //console.log('url',url,(url.includes(window.location.hostname) == false ? window.location.protocol + window.location.hostname : '') + url);
    let newUrl = new URL(
        (url.includes(window.location.hostname) == false
          ? window.location.protocol + window.location.hostname
          : "") + url
      ),
      urlParams = new URLSearchParams(newUrl.search);
    urlParams.delete("section_id");
    urlParams.delete("filter.p.tag");
    urlParams.set("view", "list-product-types");
    newUrl.search = urlParams.toString();
    //console.log('url',url,'newUrl',newUrl,'urlParams',urlParams.toString());
    fetch(newUrl)
      .then((response) => response.text())
      .then((responseText) => {
        //console.log('responseText',responseText);
        let productTypesFoundAll = responseText.split("=;=");
        //console.log('productTypesFoundAll', productTypesFoundAll);

        document
          .querySelectorAll(
            ".facets__details-size .facets__list-wrap, .mobile-facets__details-size .facets__list-wrap"
          )
          .forEach((element) => {
            //console.log('element', element.dataset);
            let dataTypes = element.dataset.types.split(","),
              foundProductType = false;
            productTypesFoundAll.forEach((type) => {
              if (dataTypes.includes(type) == true) {
                foundProductType = true;
              }
            });
            //console.log('foundProductType', foundProductType);
            if (foundProductType == false) {
              element.classList.add("dont-found-type");
              if (
                element.querySelectorAll(
                  '.list-menu__item [name="filter.p.tag"]:checked'
                ).length == 0
              ) {
                //element.style.display = 'none';
                element
                  .querySelectorAll(".list-menu__item")
                  .forEach((subelement) => {
                    /*subelement.style.display = 'none';*/ subelement.classList.add(
                      "list-menu__item--disabled"
                    );
                  });
                element.querySelectorAll("label").forEach((subelement) => {
                  subelement.classList.add("facet-checkbox--disabled");
                });
              } else {
                element
                  .querySelectorAll(".list-menu__item")
                  .forEach((subelement) => {
                    //console.log('element',element,'subelement', subelement.querySelectorAll('[name="filter.p.tag"]:checked').length);
                    if (
                      subelement.querySelectorAll(
                        '[name="filter.p.tag"]:checked'
                      ).length == 0
                    ) {
                      //subelement.style.display = '';
                      subelement.classList.add("list-menu__item--disabled");
                    } else {
                      subelement.classList.remove("list-menu__item--disabled");
                    }
                  });
                element.querySelectorAll("label").forEach((subelement) => {
                  //console.log('element',element,'subelement', subelement.querySelectorAll('[name="filter.p.tag"]:checked').length);
                  if (
                    subelement.querySelectorAll('[name="filter.p.tag"]:checked')
                      .length == 0
                  ) {
                    subelement.classList.add("facet-checkbox--disabled");
                  } else {
                    subelement.classList.remove("facet-checkbox--disabled");
                  }
                });
              }
            } else {
              element.classList.remove("dont-found-type");
              //element.style.display = '';
              element
                .querySelectorAll(".list-menu__item")
                .forEach((subelement) => {
                  //subelement.style.display = '';
                  if (
                    subelement.querySelectorAll(
                      '[name="filter.p.tag"]:disabled'
                    ).length == 0
                  ) {
                    subelement.classList.remove("list-menu__item--disabled");
                  } else {
                    subelement.classList.add("list-menu__item--disabled");
                  }
                });
              element.querySelectorAll("label").forEach((subelement) => {
                if (
                  subelement.querySelectorAll('[name="filter.p.tag"]:disabled')
                    .length == 0
                ) {
                  subelement.classList.remove("facet-checkbox--disabled");
                } else {
                  subelement.classList.add("facet-checkbox--disabled");
                }
              });
            }
          });

        document
          .querySelectorAll(
            ".facets__details-size, .mobile-facets__details-size"
          )
          .forEach((element) => {
            let foundItems = 0;
            //console.log('element', element);
            element
              .querySelectorAll(
                '.list-unstyled:not(.no-js-facets) .list-menu__item [name="filter.p.tag"]:checked'
              )
              .forEach((subelement) => {
                //console.log('subelement', subelement);
                if (
                  subelement.closest(".facets__list-wrap").style.display ==
                    "none" ||
                  subelement
                    .closest(".facets__list-wrap")
                    .classList.contains("dont-found-type")
                ) {
                  //subelement.checked = false;
                  foundItems = foundItems + 1;
                } else {
                  foundItems = foundItems + 1;
                }
              });
            //console.log('foundItems', foundItems);
            if (foundItems == 0) {
              element
                .querySelectorAll(".facets__selected")
                .forEach((subelement) => {
                  subelement.classList.add("no-js-hidden");
                });
            } else {
              element
                .querySelectorAll(".facets__selected")
                .forEach((subelement) => {
                  subelement.classList.remove("no-js-hidden");
                });
            }
            element
              .querySelectorAll(".facets__selected")
              .forEach((subelement) => {
                subelement.innerHTML = " (" + foundItems + ")";
              });
            element
              .querySelectorAll(".facets__summary, .mobile-facets__summary")
              .forEach((subelement) => {
                subelement.ariaLabel = "Size (" + foundItems + " selected)";
              });
          });
        /*
        urlParams.set('view','list-tags');
        newUrl.search = urlParams.toString();
  
        document.querySelectorAll('.facets__details-tags .list-menu__item, .mobile-facets__details-tags .list-menu__item').forEach(element => { element.style.display = 'none'; element.classList.add('list-menu__item--disabled'); });
        document.querySelectorAll('.facets__details-tags .list-menu__item [name="filter.p.tag"]:checked, .mobile-facets__details-tags .list-menu__item [name="filter.p.tag"]:checked').forEach(element => {
          console.log('element-value', element.value);
          element.closest('.list-menu__item').style.display = '';
          element.closest('.list-menu__item').classList.remove('list-menu__item--disabled'); 
        });
        productTypesFoundAll.forEach( tag => {
          console.log('tag',tag);
          document.querySelectorAll('.facets__details-tags.facets__details-category [name="filter.p.tag"][value="' + tag + '"], .mobile-facets__details-tags.mobile-facets__details-category [name="filter.p.tag"][value="' + tag + '"]').forEach(element => {
            console.log('element-value', element.value, element.closest('.list-menu__item'));
            element.closest('.list-menu__item').style.display = '';
            element.closest('.list-menu__item').classList.remove('list-menu__item--disabled');
            console.log('element-value', element.value, element.closest('.list-menu__item').style.display);
          });
          document.querySelectorAll('.facets__details-tags.facets__details-color [name="filter.p.tag"][value="' + tag + '"], .mobile-facets__details-tags.mobile-facets__details-color [name="filter.p.tag"][value="' + tag + '"]').forEach(element => {
            element.closest('.list-menu__item').style.display = '';
          });
        });
        */
        /*
        fetch(newUrl)
          .then(response => response.text())
          .then((responseText) => {
            //console.log('responseText',responseText);
            let tagsFound = responseText.split('=;=');
            //console.log('tagsFound',tagsFound);
  
            tagsFound.forEach( tag => {
              //console.log('tag',tag);
              document.querySelectorAll('.facets__details-tags.facets__details-color [name="filter.p.tag"][value="' + tag + '"], .mobile-facets__details-tags.mobile-facets__details-color [name="filter.p.tag"][value="' + tag + '"]').forEach(element => {
                element.closest('.list-menu__item').classList.remove('list-menu__item--disabled');
              });
            });
  
            if (searchParams.has('filter.p.tag') == true) {
              tags = searchParams.getAll('filter.p.tag');
              //console.log('tags',tags);
              tags.forEach( tag => {
                //console.log('tag',tag);
                let findTags = [];
                findTags.push(tag);
                if (tag.includes(' ')) {
                  //findTags = tag.split(' ');
                  findTags = allCombinations(tag.split(' '));
                }
                //console.log('findTags',findTags);
                findTags.forEach(findTag => {
                  document.querySelectorAll('.facets__details-tags [name="filter.p.tag"][value="' + findTag + '"], .mobile-facets__details-tags [name="filter.p.tag"][value="' + findTag + '"]').forEach(element => {
                    let isAllTags = true;
                    element.parentNode.querySelectorAll('input').forEach(subelement => {
                      (element != subelement && subelement.name != "filter.p.tag") ? isAllTags = false : null
                    });
                    if (isAllTags == true) {
                      element.checked = true;
                      element.parentNode.querySelectorAll('input').forEach(subelement => {
                        element != subelement ? subelement.checked = element.checked : null
                      });
                    }
                    element.closest('.list-menu__item').style.display = '';
                    element.closest('.list-menu__item').classList.remove('list-menu__item--disabled');
                    let parentLabel = '==XX==';
                    //console.log('element',element,'facets__details-tags',element.closest('.facets__details-tags'),'mobile-facets__details-tags',element.closest('.mobile-facets__details-tags'));
                    if (element.closest('.facets__details-tags') != null) {
                      parentLabel = element.closest('.facets__details-tags').dataset.label;
                    } else if (element.closest('.mobile-facets__details-tags')) {
                      parentLabel = element.closest('.mobile-facets__details-tags').dataset.label;
                    }
                    if (tagsObject[parentLabel] == null) {
                      tagsObject[parentLabel] = {};
                    }
                    tagsObject[parentLabel][element.parentElement.dataset.index] = 1;
                    //console.log('parentLabel',parentLabel,tagsObject[parentLabel]);
                  });
                });
              });
            }
            //console.log('tagsObject',tagsObject);
            document.querySelectorAll('.facets__details-tags, .mobile-facets__details-tags').forEach(element => {
              let parentLabel = element.dataset.label;
              //console.log('parentLabel',parentLabel);
              tagsSize = 0;
              if (parentLabel != undefined) {
                if (tagsObject[parentLabel] != null) {
                  tagsSize = Object.keys(tagsObject[parentLabel]).length;
                }
              } else if (tagsObject['==XX=='] != null) {
                tagsSize = Object.keys(tagsObject['==XX==']).length;
              }
              element.querySelectorAll('summary').forEach(subelement => {
                subelement.ariaLabel = parentLabel + ' (' + tagsSize + ' selected)';
              })
              element.querySelectorAll('summary .facets__selected').forEach(subelement => {
                subelement.innerHTML = ' (' + tagsSize + ')';
                if (tagsSize > 0) {
                  subelement.classList.remove('hidden');
                } else {
                  subelement.classList.add('hidden');
                }
              })
              element.querySelectorAll('.facets__header .facets__selected').forEach(subelement => {
                subelement.innerHTML = tagsSize + ' selected';
              })
            });
          });
          */
      });
  }
};
const ajustPrices = function (params) {
  let myDefaults = {
    url: window.location.href,
  };
  params = Object.assign({}, myDefaults, params);
  let { url } = params,
    newUrl = new URL(window.location.href),
    urlParams = new URLSearchParams(newUrl.search);
  urlParams.delete("section_id");
  urlParams.delete("filter.p.tag");
  urlParams.set("sort_by", "price-ascending");
  urlParams.set("view", "list-prices");
  newUrl.search = urlParams.toString();

  //console.log('url',url,'newUrl',newUrl,'urlParams',urlParams.toString());

  fetch(newUrl)
    .then((response) => response.text())
    .then((responseText) => {
      //console.log('responseText',responseText);
      document
        .querySelectorAll(
          ".facets__details-price_range ul, .mobile-facets__details-price_range ul"
        )
        .forEach((element) => {
          element.innerHTML = new DOMParser()
            .parseFromString(responseText, "text/html")
            .querySelector("ul.list-unstyled").innerHTML;
        });
    });
};

const infiniteScroll = function (params) {
  //params = Object.assign({}, myDefaults, params);
  //const {itemName, category, brokerName, sellingCost, initialCost, inStock} = params;

  if (document.querySelector(".pagination__next") != null) {
    // infinite-scroll.pkgd.min.js
    let infScroll = new InfiniteScroll(
      "#ProductGridContainer .paginate-filters",
      {
        // options
        path: ".pagination__next",
        checkLastPage: true,
        append: ".paginate-item",
        history: "replace",
        status: ".page-load-status",
        hideNav: ".pagination",
        button: ".view-more-button",
        // load pages on button click
        scrollThreshold: false,
      }
    );
    infScroll.on("append", function (body, path, items, response) {
      //console.log(`Appended ${items.length} items on ${path}`);
      ajustViewOn();
      ajustTags();
    });
  }
};

ajustViewOn();
ajustTags();
//ajustPrices();
infiniteScroll();

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
function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  );
}
const trapFocusHandlers = {};
function trapFocus(container, elementToFocus = container) {
  var elements = getFocusableElements(container);
  var first = elements[0];
  var last = elements[elements.length - 1];

  removeTrapFocus();

  trapFocusHandlers.focusin = (event) => {
    if (
      event.target !== container &&
      event.target !== last &&
      event.target !== first
    )
      return;

    document.addEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.focusout = function () {
    document.removeEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.keydown = function (event) {
    if (event.code.toUpperCase() !== "TAB") return; // If not TAB key
    // On the last focusable element and tab forward, focus the first element.
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }

    //  On the first focusable element and tab backward, focus the last element.
    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener("focusout", trapFocusHandlers.focusout);
  document.addEventListener("focusin", trapFocusHandlers.focusin);

  elementToFocus.focus();
}
class MenuDrawer extends HTMLElement {
  constructor() {
    super();

    this.mainDetailsToggle = this.querySelector("details");

    if (navigator.platform === "iPhone")
      document.documentElement.style.setProperty(
        "--viewport-height",
        `${window.innerHeight}px`
      );

    this.addEventListener("keyup", this.onKeyUp.bind(this));
    this.addEventListener("focusout", this.onFocusOut.bind(this));
    this.bindEvents();
  }

  bindEvents() {
    this.querySelectorAll("summary").forEach((summary) =>
      summary.addEventListener("click", this.onSummaryClick.bind(this))
    );
    this.querySelectorAll("button").forEach((button) =>
      button.addEventListener("click", this.onCloseButtonClick.bind(this))
    );
  }

  onKeyUp(event) {
    if (event.code.toUpperCase() !== "ESCAPE") return;

    const openDetailsElement = event.target.closest("details[open]");
    if (!openDetailsElement) return;

    openDetailsElement === this.mainDetailsToggle
      ? this.closeMenuDrawer(
          event,
          this.mainDetailsToggle.querySelector("summary")
        )
      : this.closeSubmenu(openDetailsElement);
  }

  onSummaryClick(event) {
    const summaryElement = event.currentTarget;
    const detailsElement = summaryElement.parentNode;
    const parentMenuElement = detailsElement.closest(".has-submenu");
    const isOpen = detailsElement.hasAttribute("open");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function addTrapFocus() {
      trapFocus(
        summaryElement.nextElementSibling,
        detailsElement.querySelector("button")
      );
      summaryElement.nextElementSibling.removeEventListener(
        "transitionend",
        addTrapFocus
      );
    }

    parentMenuElement &&
      parentMenuElement.querySelectorAll("details").forEach((detail) => {
        detail != detailsElement ? detail.removeAttribute("open") : "";
      });

    if (detailsElement === this.mainDetailsToggle) {
      if (isOpen) event.preventDefault();
      isOpen
        ? this.closeMenuDrawer(event, summaryElement)
        : this.openMenuDrawer(summaryElement);
    } else {
      setTimeout(() => {
        detailsElement.classList.add("menu-opening");
        summaryElement.setAttribute("aria-expanded", true);
        parentMenuElement && parentMenuElement.classList.add("submenu-open");
        !reducedMotion || reducedMotion.matches
          ? addTrapFocus()
          : summaryElement.nextElementSibling.addEventListener(
              "transitionend",
              addTrapFocus
            );
      }, 100);
    }
  }

  openMenuDrawer(summaryElement) {
    setTimeout(() => {
      this.mainDetailsToggle.classList.add("menu-opening");
    });
    summaryElement.setAttribute("aria-expanded", true);
    trapFocus(this.mainDetailsToggle, summaryElement);
    document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
  }

  closeMenuDrawer(event, elementToFocus = false) {
    if (event === undefined) return;

    this.mainDetailsToggle.classList.remove("menu-opening");
    this.mainDetailsToggle.querySelectorAll("details").forEach((details) => {
      details.removeAttribute("open");
      details.classList.remove("menu-opening");
    });
    this.mainDetailsToggle
      .querySelectorAll(".submenu-open")
      .forEach((submenu) => {
        submenu.classList.remove("submenu-open");
      });
    document.body.classList.remove(
      `overflow-hidden-${this.dataset.breakpoint}`
    );
    removeTrapFocus(elementToFocus);
    this.closeAnimation(this.mainDetailsToggle);
  }

  onFocusOut(event) {
    setTimeout(() => {
      if (
        this.mainDetailsToggle.hasAttribute("open") &&
        !this.mainDetailsToggle.contains(document.activeElement)
      )
        this.closeMenuDrawer();
    });
  }

  onCloseButtonClick(event) {
    const detailsElement = event.currentTarget.closest("details");
    this.closeSubmenu(detailsElement);
  }

  closeSubmenu(detailsElement) {
    const parentMenuElement = detailsElement.closest(".submenu-open");
    parentMenuElement && parentMenuElement.classList.remove("submenu-open");
    detailsElement.classList.remove("menu-opening");
    detailsElement
      .querySelector("summary")
      .setAttribute("aria-expanded", false);
    removeTrapFocus(detailsElement.querySelector("summary"));
    this.closeAnimation(detailsElement);
  }

  closeAnimation(detailsElement) {
    let animationStart;

    const handleAnimation = (time) => {
      if (animationStart === undefined) {
        animationStart = time;
      }

      const elapsedTime = time - animationStart;

      if (elapsedTime < 400) {
        window.requestAnimationFrame(handleAnimation);
      } else {
        detailsElement.removeAttribute("open");
        if (detailsElement.closest("details[open]")) {
          trapFocus(
            detailsElement.closest("details[open]"),
            detailsElement.querySelector("summary")
          );
        }
      }
    };

    window.requestAnimationFrame(handleAnimation);
  }
}
customElements.define("menu-drawer", MenuDrawer);
function removeTrapFocus(elementToFocus = null) {
  document.removeEventListener("focusin", trapFocusHandlers.focusin);
  document.removeEventListener("focusout", trapFocusHandlers.focusout);
  document.removeEventListener("keydown", trapFocusHandlers.keydown);

  if (elementToFocus) elementToFocus.focus();
}

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

  static getPathName() {
    let pathname = window.location.pathname,
      indexOfFirst = pathname.indexOf("/"),
      indexOfSecond = pathname.indexOf("/", indexOfFirst + 1),
      indexOfThird = pathname.indexOf("/", indexOfSecond + 1);
    //console.log('pathname', pathname, 'indexOfFirst', indexOfFirst, 'indexOfSecond', indexOfSecond, 'indexOfThird', indexOfThird);
    return `${
      indexOfThird == -1
        ? window.location.pathname
        : pathname.slice(0, indexOfThird)
    }`;
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
      const url = `${FacetFiltersForm.getPathName()}/${searchParams}?section_id=${
        section.section
      }`;
      console.log("url", url);
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
        const html = responseText;
        FacetFiltersForm.filterData = [
          ...FacetFiltersForm.filterData,
          { html, url },
        ];
        FacetFiltersForm.renderFilters(html, event);
        FacetFiltersForm.renderProductGridContainer(html);
        FacetFiltersForm.renderProductCount(html);

        ajustViewOn({ url: url });
        ajustTags({ url: url });
        //ajustPrices({'url':url});
        infiniteScroll();

        /**
         * Clear by filter button
         */
        clearByFilter("clearBtn", "Facet-category-main-collection-product-grid");
        clearByFilter("clearBtnMob", "Category-filters-mobile");

        // size
        clearByFilter("clearBtnSize", "size-filters");
        clearByFilter("clearBtnSizeMob", "size-filters-mob");

        // color
        clearByFilter("clearBtnColor", "Color-filters");
        clearByFilter("clearBtnColorMob", "Color-filtersMob");

        // color
        clearByFilter("clearBtnPrice", "Price-filters");
        clearByFilter("clearBtnPriceMob", "Price-filtersMob");
      });
  }

  static renderSectionFromCache(filterDataUrl, event) {
    const html = FacetFiltersForm.filterData.find(filterDataUrl).html;
    FacetFiltersForm.renderFilters(html, event);
    FacetFiltersForm.renderProductGridContainer(html);
    FacetFiltersForm.renderProductCount(html);

    ajustViewOn({ url: FacetFiltersForm.filterData.find(filterDataUrl).url });
    ajustTags({ url: FacetFiltersForm.filterData.find(filterDataUrl).url });
    //ajustPrices({'url':FacetFiltersForm.filterData.find(filterDataUrl).url});
    infiniteScroll();
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
    const facetsToRender = Array.from(facetDetailsElements);
    //const countsToRender = Array.from(facetDetailsElements).find(matchesIndex);

    facetsToRender.forEach((element) => {
      document.querySelector(
        `.js-filter[data-index="${element.dataset.index}"]`
      ).innerHTML = element.innerHTML;
    });

    FacetFiltersForm.renderActiveFacets(parsedHTML);
    FacetFiltersForm.renderAdditionalElements(parsedHTML);

    //if (countsToRender) FacetFiltersForm.renderCounts(countsToRender, event.target.closest('.js-filter'));
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
    //console.log('updateURLHash-searchParams',searchParams);
    //history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
    history.pushState(
      { searchParams },
      "",
      `${FacetFiltersForm.getPathName()}${
        searchParams && "/".concat(searchParams)
      }`
    );
  }

  static getSections() {
    return [
      {
        section: document.getElementById("product-grid").dataset.id,
      },
    ];
  }

  createSearchParams(form) {
    const formData = new FormData(form);
    let formDataSearchParams = new URLSearchParams(formData),
      filterPTagValue = "",
      filterPTagValues = "",
      formDataSearchParamsArray = [],
      formDataSearchParamsString = formDataSearchParams.toString();

    let thereIsExtra = false;
    let extraParams = "";

    //console.log('formDataSearchParamsString',formDataSearchParamsString);
    for (const [key, value] of formDataSearchParams.entries()) {
      if (key != "view_on" && key != "sort_by") {
        formDataSearchParamsArray.push(value);
      } else {
        if (thereIsExtra) {
          extraParams += "&" + key + "=" + value;
        } else {
          extraParams += key + "=" + value;
          thereIsExtra = true;
        }
      }
    }
    let formDataSearchParamsArrayUniq = [...new Set(formDataSearchParamsArray)];
    formDataSearchParamsString = formDataSearchParamsArrayUniq.join("+");
    //console.log('formDataSearchParamsArray',formDataSearchParamsArray,'formDataSearchParamsArrayUniq',formDataSearchParamsArrayUniq,formDataSearchParamsString);
    /*
    if (formDataSearchParams.get('filter.p.tag') != null) {
      filterPTagValue = encodeURIComponent(formDataSearchParams.get('filter.p.tag')).replace(/%20/g, '+');
      filterPTagValues = encodeURIComponent(formDataSearchParams.getAll('filter.p.tag').join('+')).replace(/%20/g, '+').replace(/%2B/g, '+');
      //console.log('filter.p.tag=' + filterPTagValue,'filter.p.tag=' + filterPTagValues);
      formDataSearchParamsString = formDataSearchParamsString.replace('filter.p.tag=' + filterPTagValue, 'filter.p.tag=' + filterPTagValues);
    }
    */
    //console.log('formDataSearchParamsString-last',formDataSearchParamsString);
    //return new URLSearchParams(formData).toString();

    return formDataSearchParamsString + "?" + extraParams;
  }

  onSubmitForm(searchParams, event) {
    FacetFiltersForm.renderPage(searchParams, event);
  }

  onSubmitHandler(event) {
    event.preventDefault();
    const sortFilterForms = document.querySelectorAll(
      "facet-filters-form form"
    );
    if (event.srcElement.className == "mobile-facets__checkbox") {
      const searchParams = this.createSearchParams(
        event.target.closest("form")
      );
      this.onSubmitForm(searchParams, event);
    } else {
      const forms = [];
      const isMobile =
        event.target.closest("form").id === "FacetFiltersFormMobile";

      sortFilterForms.forEach((form) => {
        if (!isMobile) {
          if (
            form.id === "FacetSortForm" ||
            form.id === "FacetFiltersForm" ||
            form.id === "FacetSortDrawerForm"
          ) {
            const noJsElements = document.querySelectorAll(".no-js-list");
            noJsElements.forEach((el) => el.remove());
            if (
              event.target.name == "filter.p.tag" &&
              form.querySelectorAll(
                '[name="filter.p.tag"][value="' + event.target.value + '"]'
              ).length > 1
            ) {
              form
                .querySelectorAll(
                  '[name="filter.p.tag"][value="' + event.target.value + '"]'
                )
                .forEach((input) => {
                  input.checked = event.target.checked;
                });
            }
            forms.push(this.createSearchParams(form));
          }
        } else if (form.id === "FacetFiltersFormMobile") {
          if (
            event.target.name == "filter.p.tag" &&
            form.querySelectorAll(
              '[name="filter.p.tag"][value="' + event.target.value + '"]'
            ).length > 1
          ) {
            form
              .querySelectorAll(
                '[name="filter.p.tag"][value="' + event.target.value + '"]'
              )
              .forEach((input) => {
                input.checked = event.target.checked;
              });
          }
          forms.push(this.createSearchParams(form));
        }
      });
      this.onSubmitForm(forms.join("&"), event);
    }
  }

  onActiveFilterClick(event) {
    event.preventDefault();
    FacetFiltersForm.toggleActiveFacets();
    let viewOn = "";
    if (document.querySelector('[name="view_on"]:checked') != null) {
      viewOn =
        "view_on=" + document.querySelector('[name="view_on"]:checked').value;
    }
    //console.log('onActiveFilterClick-viewOn',viewOn);
    const url =
      event.currentTarget.href.indexOf("?") == -1
        ? ""
        : event.currentTarget.href.slice(
            event.currentTarget.href.indexOf("?") + 1
          );
    //const url = event.currentTarget.href.indexOf('?') == -1 ? '' + viewOn : event.currentTarget.href.slice(event.currentTarget.href.indexOf('?') + 1) + '&' + viewOn;
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

class FacetRemove extends HTMLElement {
  constructor() {
    super();
    const facetLink = this.querySelector("a");
    facetLink.setAttribute("role", "button");
    facetLink.addEventListener("click", this.closeFilter.bind(this));
    facetLink.addEventListener("keyup", (event) => {
      event.preventDefault();
      if (event.code.toUpperCase() === "SPACE") this.closeFilter(event);
    });
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
