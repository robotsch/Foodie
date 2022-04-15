$(() => {

  const createMenuItem = function (menuItemData) {
    return $(`
      <div class="row justify-content-center">
        <div class="col-lg-8 d-flex justify-content-between align-items-center menuItem" id="menuItem-${menuItemData.id
      }">
          <div>
            <h4>${menuItemData.name}</h4>
            <p>${menuItemData.description}</p>
            <h5>$${menuItemData.price / 100}</h5>
          </div>
          <div class="menuItem-img-container">
            <img src="${menuItemData.image_url}" alt="IMG">
          </div>
        </div>
      </div>
    `);
  };

  const createMenuCategoryTitle = function (category) {
    return $(`
      <div class="row justify-content-center category-title" id="${category}">
        <div class="col-lg-8">
        <hr>
          <h3>${category}</h3>
          <hr>
        </div>
      </div>
    `);
  };

  const renderMenuItems = function (menuItemsData, category) {
    $("#menu-container").append(createMenuCategoryTitle(category));

    for (const menuItem of menuItemsData) {
      $(`#menu-container`).append(createMenuItem(menuItem));

      // menuItem modal opens when menuItem div clicked
      $(`#menuItem-${menuItem.id}`).unbind().on("click", function () {

        // Sets info in modal to menuItem that was clicked
        $('.modal-title').text(menuItem.name);
        $('#desc').text(menuItem.description);
        $('.quantity').text(1);
        $(`#price`).text(`$${(menuItem.price / 100).toFixed(2)}`);
        $("#total").text(`$${(menuItem.price * parseInt($('.modal-body').find(".quantity:first").text()) / 100).toFixed(2)}`);

        // Decreases quantity by 1 on minus button click
        $(`#minus-quantity-btn`).unbind().on("click", function () {
          const quantity = parseInt($('.modal-body').find(".quantity:first").text());
          if (quantity > 1) {
            $(`.quantity`).text(quantity - 1);
            $(`#total`).text(`$${(((quantity - 1) * menuItem.price) / 100)}`);
          }
        });

        // Increase quantity by 1 on plus button click
        $(`#plus-quantity-btn`).unbind().on("click", function () {
          const quantity = parseInt($('.modal-body').find(".quantity:first").text());
          if (quantity < 100) {
            $(`.quantity`).text(quantity + 1);
            $(`#total`).text(`$${((quantity + 1) * menuItem.price) / 100}`);
          }
        });

        // When user adds item to order
        $(`#add-to-order-btn`).unbind().on("click", function () {

          // If no items in order, creates order format
          if (!sessionStorage.getItem("orders")) {
            sessionStorage.setItem("orders", JSON.stringify({}));
            sessionStorage.setItem("subtotal", JSON.stringify(0));
          }

          const orders = JSON.parse(sessionStorage.getItem("orders"));
          let subtotal = JSON.parse(sessionStorage.getItem("subtotal"));

          if (!(menuItem.id in orders)) {
            orders[menuItem.id] = 0;
          }

          const quantity = parseInt($('.modal-body').find(".quantity:first").text());

          orders[menuItem.id] += quantity;

          subtotal += menuItem.price * quantity;

          // Saves info to sessionStorage
          sessionStorage.setItem("orders", JSON.stringify(orders));
          sessionStorage.setItem("subtotal", JSON.stringify(subtotal));

          // Updates cart in bottom right
          $("#cart-btn > span").text(`Cart | ${Object.keys(orders).length}`);

        });

        // Opens and closes modal
        $(`#menuItem-modal`).modal("toggle");

      });

      $(`#menuItem-${menuItem.id}`).hover(function () {
        $(this).children(".menuItem-img-container").children("img").css("transform", "scale(1.1)");
      });

      $(`#menuItem-${menuItem.id}`).mouseleave(function() {
        $(this).children(".menuItem-img-container").children("img").css("transform", "scale(1)");
      })

    }
  };

  // GET request for all menu data
  fetch("/api/menu")
    .then((response) => response.json())
    .then((data) => {

      // Loops over each category and renders all menu items for each category
      for (const category in data.categories) {
        if (Object.hasOwnProperty.call(data.categories, category)) {
          renderMenuItems(data.menuItems[category], data.categories[category]);
        }
      }
    })
    .catch((err) => console.log(err.message));

});
