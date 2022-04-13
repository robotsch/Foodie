//ripped from full-menu.js

$(() => {
  // Transforms any scripting attacks to normal text
  const escape = function (str) {
    let div = document.createElement("div");
    div.append(document.createTextNode(str));
    return div.innerHTML;
  };

  const createActiveOrder = (activeOrderObj) => {
    return $(`
     <div class="entry-div">


            <h4>Order #: ${activeOrderObj.orders_id}</h4>
            <p class="entries">Order Placed: ${activeOrderObj.time_ordered}</p>
            <p class="entries">Order Accepted: ${activeOrderObj.time_accepted}</p>
            <p class="entries">Estimated Preparation Time: ${activeOrderObj.estimated_completion_time}</p>



      </div>
    `);
  };
  const createPriorOrder = (oldOrderObj) => {
    return $(`
    <div class="entry-div">

          <div>
            <h4>Order #: ${oldOrderObj.orders_id}</h4>
            <p class="entries">Order Placed: ${oldOrderObj.time_ordered}</p>
            <p class="entries">Order Accepted: ${oldOrderObj.time_accepted}</p>
            <p class="entries">Estimated Preparation Time: ${oldOrderObj.estimated_completion_time}</p>
          </div>


      </div>
    `);
  };

  const createMenuItem = function (menuItemData) {
    return $(`
      <div class="row">
        <div class="col-lg-8 d-flex justify-content-between menuItem" id="menuItem-${menuItemData.id
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

  const createMenuItemModal = function (menuItemData) {
    return $(`
    <div class="modal fade" id="menuItemModal-${menuItemData.id}">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">${menuItemData.name
      }</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            ${menuItemData.description}
            <hr class="bg-danger border-2 border-top border-danger">
            <div>
              <div>
                Price<br>
                $${menuItemData.price / 100}
              </div>
              <div>
                Quantity<br>
                <span class="menuItemModal-quantity-${menuItemData.id}">1</span>
              </div>
              <div>
                Total<br>
                <span id="menuItemModal-total-cost-${menuItemData.id}">$${menuItemData.price / 100
      }</span>
              </div>
            </div>
            <hr class="bg-danger border-2 border-top border-danger">
            <div>
              <button type="button" class="btn btn-outline-dark mx-3" id="menuItemModal-minus-quantity-${menuItemData.id
      }">-</button>
              <span class="menuItemModal-quantity-${menuItemData.id}">1</span>
              <button type="button" class="btn btn-outline-dark mx-3" id="menuItemModal-plus-quantity-${menuItemData.id
      }">+</button>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" data-bs-dismiss="modal" id="menuItemModal-submit-btn-${menuItemData.id
      }" class="btn btn-primary">Add To Order</button>
          </div>
          </div>
        </div>
      </div>
    `);
  };

  //to be excluded
  const createMenuCategoryTitle = function (category) {
    return $(`
      <div class="row" id="${category}">
        <div class="col-lg-8">
          <h3>${category}</h3>
        </div>
      </div>
    `);
  };

  const getUnique = (valArray) => {
    let newArray = valArray.filter(
      (element, index, array) => array.indexOf(element) === index
    );
    return newArray;
  };

  const renderActiveOrders = (newOrdersArr) => {
    console.log("newOrdersArr: ", newOrdersArr);

    let tempArr = [];

    let indexUniqueOrders = [];

    for (const object of newOrdersArr) {
      tempArr.push(object.orders_id);
    }

    console.log("tempArr: ", tempArr);

    let searchArr = getUnique(tempArr);

    for (const searchVal of searchArr) {
      indexUniqueOrders.push(tempArr.indexOf(searchVal));
    }

    console.log("indexUniqueOrders: ", indexUniqueOrders);

    for (const indexNumber of indexUniqueOrders) {
      console.log(newOrdersArr[indexNumber]);

      $(`#active-orders-container`).append(
        createActiveOrder(newOrdersArr[indexNumber])
      );
    }
  };
  const renderPreviousOrders = (oldOrdersArr) => {
    let tempArr = [];

    let indexUniqueOrders = [];

    for (const object of oldOrdersArr) {
      tempArr.push(object.orders_id);
    }

    let searchArr = getUnique(tempArr);

    for (const searchVal of searchArr) {
      indexUniqueOrders.push(tempArr.indexOf(searchVal));
    }

    for (const indexNumber of indexUniqueOrders) {
      $(`#previous-orders-container`).append(
        createPriorOrder(oldOrdersArr[indexNumber])
      );
    }
  };

  const renderMenuItems = function (menuItemsData, category) {
    $("#menu-container").append(createMenuCategoryTitle(category));

    for (const menuItem of menuItemsData) {
      $(`#${category}`).append(createMenuItem(menuItem));
      $(`#${category}`).append(createMenuItemModal(menuItem));

      // Sets menuItem div to open it's associated modal on click
      $(`#menuItem-${menuItem.id}`).on("click", function (e) {
        $(`#menuItemModal-${menuItem.id}`).modal("toggle");
      });

      // Decreases quantity by 1 on minus button click
      $(`#menuItemModal-minus-quantity-${menuItem.id}`)
        .unbind()
        .on("click", function (e) {
          const quantity = parseInt($(this).next().text());
          if (quantity > 0) {
            $(`.menuItemModal-quantity-${menuItem.id}`).text(quantity - 1);
            $(`#menuItemModal-total-cost-${menuItem.id}`).text(
              `$${((quantity - 1) * menuItem.price) / 100}`
            );
          }
        });

      // Increase quantity by 1 on plus button click
      $(`#menuItemModal-plus-quantity-${menuItem.id}`)
        .unbind()
        .on("click", function (e) {
          const quantity = parseInt($(this).prev().text());
          if (quantity < 100) {
            $(`.menuItemModal-quantity-${menuItem.id}`).text(quantity + 1);
            $(`#menuItemModal-total-cost-${menuItem.id}`).text(
              `$${((quantity + 1) * menuItem.price) / 100}`
            );
          }
        });

      $(`#menuItemModal-submit-btn-${menuItem.id}`).on("click", function (e) {
        const order = {};
        order["itemId"] = menuItem.id;
        order["quantity"] = parseInt(
          $(`#menuItemModal-minus-quantity-${menuItem.id}`).next().text()
        );

        $.post("/api/additem", order, function () {
          console.log("Added to cart!");
        });
      });
    }
  };

  const deleteSearchResults = () => {
    $("#menu-container").empty();
  };

  //listens for inputs to the search field. continuously makes ajax requests to the database
  $("textarea").on("input", function (event) {
    const searchString = $("#search-text").val();

    deleteSearchResults();

    if (!searchString) {
      fetch("/api/menu")
        .then((response) => response.json())
        .then((data) => {
          console.log("data: ", data);
          for (const category in data.categories) {
            if (Object.hasOwnProperty.call(data.categories, category)) {
              renderMenuItems(
                data.menuItems[category],
                data.categories[category]
              );
            }
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      $.ajax({
        url: `/search/`,
        method: "POST",
        data: searchString.toLowerCase(),
      })
        .then((response) => {
          let data = JSON.parse(response);
          console.log("responsedata: ", data);

          const menuItemKeys = Object.keys(data.menuItems);

          for (const element of menuItemKeys) {
            renderMenuItems(data.menuItems[element], data.categories[element]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  $.ajax({
    url: `/orders-user-id`,
    method: "GET",
  }).then(function (response) {
    let data = JSON.parse(response);
    console.log("getmethod data:", data);
    console.log("response: ", response);

    if (data.newOrders.length > 0) {
      $("#active-orders-container").empty();
      renderActiveOrders(data.newOrders);
    }

    if (data.oldOrders.length > 0) {
      $("#previous-orders-container").empty();
      renderPreviousOrders(data.oldOrders);
    }
  });
});

//end of rip

const renderSearchItems = (data) => {
  for (let i = 0; i < data.mentItems.length; i++) { }
};
