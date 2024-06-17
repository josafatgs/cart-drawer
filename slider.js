document.addEventListener("DOMContentLoaded", function () {
  let cartlist = document.querySelector(".shoplist");

  document
    .getElementById("cart-icon-bubble")
    .addEventListener("click", function () {
      updateAllCart();
      getAllRecomendations();
      open();
    });

  document.getElementById("close-cart").addEventListener("click", function () {
    close();
  });

  try {
    document
      .getElementById("open-when-add")
      .addEventListener("click", function () {
        open();
        setTimeout(() => {
          updateAllCart();
          getAllRecomendations();
        }, "1000");
      });
  } catch (error) {
    console.error(error);
  }

  try {
    Array.from(
      document.getElementsByClassName("open-when-add-quickview")
    ).forEach((button) => {
      button.addEventListener("click", function () {
        open();
        setTimeout(() => {
          updateAllCart();
          getAllRecomendations();
        }, "1000");
      });
    });
  } catch (error) {
    console.Error(error);
  }

  function open() {
    cartlist.classList.toggle("open-cart-list");
  }

  function close() {
    cartlist.classList.remove("open-cart-list");
  }

  const productHTML = (
    product_id,
    product_image,
    product_link,
    product_name,
    product_qty,
    product_price
  ) => `
<div class="product product-${product_id}">
    <div class="product-image-space">
        <img class="product-image" loading="lazy" src="${product_image}" alt="Imagen de Producto">
    </div>

    <div class="product-description">
        <input name="id" id="product-item-cart-${product_id}" value="${product_id}" type="hidden" />
        <a class="product-description-name" href="${product_link}">${product_name}</a>
        <div class="product-description-info">
            <div class="product-description-all">
                <div class="product-description-qty">
                    <button type="button" id="remove-product-${product_id}" class="remove" data-product-id="${product_id}">-</button>
                    <input type="number" name="updates[]" min="1" step="1" value="${product_qty}" class="input-qty" id="input-qty-${product_id}" />
                    <button type="button" id="add-product-${product_id}" class="add" data-product-id="${product_id}">+</button>
                </div>
                <div class="loading-container" id="loading-container-${product_id}">
                    <div class="loading-bar">
                        <div class="inner-bar"></div>
                    </div>
                </div>
            </div>
            <div class="product-description-price">
                <span id="product-price-${product_id}">$ ${product_price} MXN</span>
                <button class="erase-product" type="button" data-product-id="${product_id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"></path>
                        <path d="M10 11v6"></path>
                        <path d="M14 11v6"></path>
                        <path d="M1 6h22"></path>
                        <path d="M4 6l1-4h14l1 4"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</div>
`;

  const recommendedProduct = (
    product_id,
    product_image,
    product_link,
    product_name,
    product_price
  ) => ` 
        <div class="product recomended-product" id="product-${product_id}-recomended">
            <div class="product-image-space">
                <img class="product-image" id="product-image-${product_id}-recomended" loading="lazy" src="${product_image}" alt="Imagen de Producto">
            </div>
            <div class="product-description">
                <input id="product-recommended-${product_id}" name="id" value="${product_id}" type="hidden" />
                <a class="product-description-name recomended-text" id="product-name-${product_id}-recomended" href="${product_link}">${product_name}</a>
                <div class="product-description-info">
                    <div class="product-description-qty">
                        <button type="button" id="remove-product-${product_id}-recomended" class="remove-recomended" data-product-id="${product_id}">-</button>
                        <input type="number" name="quantity" min="1" step="1" value="1" class="input-qty" id="input-qty-${product_id}-recomended"/>
                        <button type="button" id="add-product-${product_id}-recomended" class="add-recomended" data-product-id="${product_id}">+</button>
                    </div>
                    <div class="product-description-price">
                        <span id="product-price-${product_id}-recomended">$ ${product_price} MXN</span>
                        <button type="button" data-product-id="${product_id}" class="add-product add-product-recommeded">Agregar</button>
                    </div>
                </div>
            </div>
        </div> `;

  async function getAllCartData() {
    const response = await fetch(window.Shopify.routes.root + "cart.js", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.json();
  }

  function updateAllCart() {
    console.log("Entre");
    getAllCartData()
      .then((data) => {
        console.log(data);
        const items = data.items;
        const total_money = document.querySelector(`.total-money`);
        total_money.innerHTML = `$ ${data.total_price / 100}`;

        if (data.item_count == 0) {
          var div = document.createElement("div");
          div.className = "text";
          div.textContent = "El carrito esta vacio";
          document.body.appendChild(div);
        } else {
          const product_list = document.querySelector(`.product-list`);
          product_list.innerHTML = "";

          items.forEach((item) => {
            const product_id = item.id;
            const product_image = item.image;
            const product_link = item.url;
            const product_name = item.title;
            const product_qty = item.quantity;
            const product_price = item.price;

            product_list.innerHTML += productHTML(
              product_id,
              product_image,
              product_link,
              product_name,
              product_qty,
              product_price / 100
            );
          });

          updateListeners();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  async function deleteCartElement(id) {
    let updates = {
      id: id,
      quantity: 0,
    };

    const response = await fetch(
      window.Shopify.routes.root + "cart/change.js",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      }
    );

    updateAllCart();
    getAllRecomendations();

    return response.json();
  }

  async function addCartElement(id) {
    const qty = document.getElementById(`input-qty-${id}-recomended`);

    const formData = {
      items: [
        {
          id: id,
          quantity: parseInt(qty.value),
        },
      ],
    };

    const response = await fetch(window.Shopify.routes.root + "cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    updateAllCart();
    getAllRecomendations();

    return response.json();
  }

  function updateCart(id) {
    const qtyInput = document.getElementById(`input-qty-${id}`);

    let updates = {
      id: id,
      quantity: parseInt(qtyInput.value),
    };

    fetch(window.Shopify.routes.root + "cart/update.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        updates: {
          [id]: updates.quantity,
        },
      }),
    })
      .then((response) => {
        updateAllCart();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  let slideIndex = 1;
  showSlides(slideIndex);

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

  currentSlide(1);

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

    /* Listeners for Recomended Products */

    Array.from(document.getElementsByClassName("add-recomended")).forEach(
      (button) => {
        const product_id = button.getAttribute("data-product-id");
        button.addEventListener("click", function () {
          const tag = document.getElementById(
            `input-qty-${product_id}-recomended`
          );
          tag.value = parseInt(tag.value) + 1;
        });
      }
    );

    Array.from(document.getElementsByClassName("remove-recomended")).forEach(
      (button) => {
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

    Array.from(
      document.getElementsByClassName("add-product-recommeded")
    ).forEach((button) => {
      const product_id = button.getAttribute("data-product-id");

      button.addEventListener("click", function () {
        addCartElement(product_id).then((data) => {
          plusSlides(1);

          updateAllCart();
          updateListeners();
        });
      });
    });
  }

  async function getProductRecommendations(id) {
    const response = await fetch(
      window.Shopify.routes.root +
        `recommendations/products.json?product_id=${id}`
    );

    return response.json();
  }

  function getAllRecomendations() {
    console.log("Recomendations");
    getAllCartData().then((data) => {
      const recommendationsContainer = document.querySelector(
        ".recommended-products-container"
      );
      recommendationsContainer.innerHTML = "";

      const related_products = data.items;
      related_products.forEach((item) => {
        getProductRecommendations(item.product_id).then((recomendationData) => {
          const recommendation = recomendationData.products;

          recommendation.forEach((product) => {
            const id = product.id;
            const title = product.title;
            const price = product.price / 100;
            const url = product.url;
            const image = product.featured_image;

            recommendationsContainer.innerHTML += recommendedProduct(
              id,
              image,
              url,
              title,
              price
            );
          });
        });
      });
    });

    showSlides(1);

    updateListeners();
  }

  updateListeners();
});
