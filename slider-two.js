document.addEventListener("DOMContentLoaded", function () {
    let cartlist = document.querySelector(".shoplist");
    let slideIndex = 2;
  
  
    document
      .querySelector(".next-recomended")
      .addEventListener("click", function () {
        plusSlides(1);
      });
  
    document
      .querySelector(".back-recomended")
      .addEventListener("click", function () {
        plusSlides(-1);
      });
  
    // Next/previous controls
    function plusSlides(n) {
      showSlides((slideIndex += n));
    }
  
    // Thumbnail image controls
    function currentSlide(n) {
      showSlides((slideIndex = n));
    }
  
    function showSlides(n) {
      let i;
      let slides = document.getElementsByClassName("recomended-product");
     
      if (n > slides.length) {
        slideIndex = 1;
      }
      if (n < 1) {
        slideIndex = slides.length;
      }
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }
  
      slides[slideIndex - 1].style.display = "flex";
    }
  
    /* Listeners for line items in cart */
    function updateListeners() {
  
      Array.from(document.getElementsByClassName("add")).forEach((button) => {
        const product_id = button.getAttribute("data-product-id");
        button.addEventListener("click", function () {
          const tag = document.getElementById(`input-qty-${product_id}`);
          tag.value = parseInt(tag.value) + 1;
          updateCart(product_id);
  
          const loadingbar = document.getElementById(
            `loading-container-${product_id}`
          );
  
          loadingbar.style.display = "flex";
  
          setTimeout(() => {
            loadingbar.style.display = "none";
          }, "500");
        });
      });
  
      Array.from(document.getElementsByClassName("remove")).forEach((button) => {
        const product_id = button.getAttribute("data-product-id");
        button.addEventListener("click", function () {
          const tag = document.getElementById(`input-qty-${product_id}`);
          if (tag.value >= 1) {
            tag.value = parseInt(tag.value) - 1;
            updateCart(product_id);
  
            const loadingbar = document.getElementById(
              `loading-container-${product_id}`
            );
  
            loadingbar.style.display = "flex";
  
            setTimeout(() => {
              loadingbar.style.display = "none";
            }, "500");
          }
        });
      });
  
      Array.from(document.getElementsByClassName("erase-product")).forEach(
        (button) => {
          const product_id = button.getAttribute("data-product-id");
  
          const product_to_erase = document.querySelector(
            `.product-${product_id}`
          );
  
          button.addEventListener("click", function () {
            deleteCartElement(product_id).then((data) => {
              if (product_to_erase) {
                product_to_erase.remove();
              }
  
              setTimeout(() => {
                updateAllCart();
              }, "1000");
            });
          });
        }
      );
  
    }
  
    function updateListenersRecommended(){
      /* Listeners for Recomended Products */
  
      
  
      Array.from(document.getElementsByClassName("add-recomended")).forEach((button) => {
          const product_id = button.getAttribute("data-product-id");
          button.addEventListener("click", function () {
            const tag = document.getElementById(
              `input-qty-${product_id}-recomended`
            );
            tag.value = parseInt(tag.value) + 1;
          });
        }
      );
  
      Array.from(document.getElementsByClassName("remove-recomended")).forEach((button) => {
          const product_id = button.getAttribute("data-product-id");
          button.addEventListener("click", function () {
            const tag = document.getElementById(
              `input-qty-${product_id}-recomended`
            );
            if (tag.value >= 1) {
              tag.value = parseInt(tag.value) - 1;
            }
          });
        }
      );
  
      Array.from(document.getElementsByClassName("add-product-recommeded")).forEach((button) => {
        const product_id = button.getAttribute("data-product-id");
  
        button.addEventListener("click", function () {
          addCartElement(product_id).then((data) => {
            plusSlides(1);
  
            updateAllCart();
          });
        });
      });
    }

    currentSlide(2);
  
  
    // updateAllCart();
    // getAllRecomendations();
  });