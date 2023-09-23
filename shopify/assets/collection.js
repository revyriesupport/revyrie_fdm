document.addEventListener("DOMContentLoaded",()=>{
  var endlessScroll = new Ajaxinate({
    container: '#product-grid',
    pagination: '#AjaxinatePagination',
    method: "click",
    loadingText: "Load More",
    callback: function() {
      document.getElementById("loading-status").style.display = "none";
    }
  });

  // document.getElementById("verticalTitle").addEventListener("click", ()=>{
  //   const filter_options = document.querySelectorAll("#FacetsWrapperDesktop details");
  //   filter_options.forEach((option) => {
  //     if(option.style.opacity === "1"){
  //       option.style.opacity = "0";
  //     }else{
  //       option.style.opacity = "1";
  //     }
  //   });
  // })
});

function updateLoadingStatus() {
  document.getElementById("loading-status").style.display = "block";
}

const grid_switcher_options = document.querySelectorAll(".grid-switcher-option");

grid_switcher_options.forEach(grid_switcher_option => {
  grid_switcher_option.addEventListener('click', ()=>{
    document.getElementById("collection_loader").style.display = "block";
    
    document.querySelector("#two-grid-switcher").classList.remove("active");
    document.querySelector("#three-grid-switcher").classList.remove("active");
    document.querySelector("#four-grid-switcher").classList.remove("active");
    
    grid_count = grid_switcher_option.getAttribute("grid_count");
    grid_switcher_option.classList.add("active");
    url = window.location.href;

    if (url.includes("?") == false) {
      url_string = url + "?view_on=" + grid_count;
    } else {
      if (url.includes("view_on") == false) {
        url_string = url + "&view_on=" + grid_count;
      } else {
        url_string = url.replace(/view_on=\d/, "view_on=" + grid_count);
      }
    }
    document.getElementById("view_on").value = grid_count;
    document.getElementById("product-grid").classList.remove("grid--2-col-tablet", "grid--2-col-desktop", "grid--3-col-tablet", "grid--3-col-desktop", "grid--4-col-tablet", "grid--4-col-desktop");
    document.getElementById("product-grid").classList.add("grid--" + grid_count + "-col-tablet", "grid--" + grid_count + "-col-desktop");
    
    var search_params = url_string.split("?")[1];
    history.pushState(search_params,'',url_string,);
    //window.location.assign(url_string);
    
    document.getElementById("collection_loader").style.display = "none";
  });
});