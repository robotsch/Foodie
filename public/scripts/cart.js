$(() => {

  const createItem = function (orderData) {
    return $(`
    <div class="item-container" id="item-${orderData.id}">
      <div>
        <div class="px-2 py-1 mx-2 text-center">${orderData.quantity}</div>
        <div>${orderData.name}</div>
      </div>
      <div>
        <button type="button" class="btn btn-primary mx-3" id="edit-quantity-btn-${orderData.id}">Edit</button>
        <div>$${(orderData.quantity * orderData.price / 100).toFixed(2)}</div>
      </div>
    </div>
    <hr>
  `);
  };

  const createTotals = function (totals) {
    return $(`
    <div id="totals-container">
      <div>
        <div>Subtotal</div>
        <div>$${(totals.subtotal).toFixed(2)}</div>
      </div>
      <div>
        <div>Serivce Fee</div>
        <div>$${(totals.serviceFee).toFixed(2)}</div>
      </div>
      <div>
        <div>Tax</div>
        <div>$${(totals.tax).toFixed(2)}</div>
      </div>
      <div>
        <div>Total</div>
        <div>$${(totals.total).toFixed(2)}</div>
      </div>
    </div>   
    `);
  };

  const renderEmptyCart = function () {
    $(`#cart-container > h3`).after(`
      <hr>
      <div class="my-5">
        <h4>No items in cart</h4>
      </div>
      <hr>
      `);
  };

  const updateTotals = function (newSubtotal) {

    const totals = {
      subtotal: newSubtotal / 100,
      serviceFee: (newSubtotal) ? 1 : 0,
      tax: newSubtotal * 0.13 / 100,
      total: newSubtotal * 1.13 / 100
    };

    $("#totals-container").children("div:first-child").children("div:nth-child(2)").text(`$${(totals.subtotal).toFixed(2)}`);
    $("#totals-container").children("div:nth-child(2)").children("div:nth-child(2)").text(`$${(totals.serviceFee).toFixed(2)}`);
    $("#totals-container").children("div:nth-child(3)").children("div:nth-child(2)").text(`$${(totals.tax).toFixed(2)}`);
    $("#totals-container").children("div:nth-child(4)").children("div:nth-child(2)").text(`$${(totals.total).toFixed(2)}`);
  };

  const renderCart = function (cartData) {

    // Creates initial totals-container
    $("#checkout-btn").before(createTotals({
      subtotal: 0,
      serviceFee: 0,
      tax: 0,
      total: 0
    }));

    // No items in cart
    if (Object.keys(cartData).length === 0) {
      renderEmptyCart();
      return;
    }

    for (const menuItem of Object.values(cartData)) {

      $("#cart-container > h3").after(createItem(menuItem));

      $(`#edit-quantity-btn-${menuItem.id}`).unbind().on("click", function () {

        $('.modal-title').text(menuItem.name);
        $('#desc').text(menuItem.description);
        $(`#price`).text(`$${(menuItem.price / 100).toFixed(2)}`);
        $(".quantity").text(menuItem.quantity);
        $("#total").text(`$${(menuItem.price * menuItem.quantity / 100).toFixed(2)}`);

        $("#minus-quantity-btn").unbind().on("click", function () {
          const quantity = parseInt($('.modal-body').find(".quantity:first").text());
          if (quantity > 1) {
            $(".quantity").text(quantity - 1);
            $("#total").text(`$${((quantity - 1) * menuItem.price / 100)}`);
          }
        });

        $("#plus-quantity-btn").unbind().on("click", function () {
          const quantity = parseInt($('.modal-body').find(".quantity:first").text());
          if (quantity < 100) {
            $(".quantity").text(quantity + 1);
            $("#total").text(`$${((quantity + 1) * menuItem.price / 100)}`);
          }
        });

        $("#set-quantity-btn").unbind().on("click", function () {
          
          const sessionCart = JSON.parse(sessionStorage.getItem('orders'));
          const oldQuantity = sessionCart[menuItem.id];
          
          // Gets new quantity
          const newQuantity = parseInt($('.modal-body').find(".quantity:first").text());
          
          if (newQuantity === oldQuantity) return;

          // Updates new quantity in sessionStorage
          sessionCart[menuItem.id] = newQuantity;

          // Updates quantity in yellow div on 'Your Cart' page to new quantity
          $(`#item-${menuItem.id} > div:first-child > div:first-child`).text(newQuantity);

          // Updates total price for each item on 'Your Cart' page after quantity changes
          $(`#item-${menuItem.id} > div:nth-child(2) > div:nth-child(2)`).text(`$${menuItem.price * newQuantity / 100}`);

          // Updates sessionStorage subtotal and orders
          const newSubtotal = parseInt(sessionStorage.getItem('subtotal')) + menuItem.price * (newQuantity - oldQuantity);
          sessionStorage.setItem('subtotal', JSON.stringify(newSubtotal));

          updateTotals(newSubtotal);

          sessionStorage.setItem('orders', JSON.stringify(sessionCart));
        });

        $("#remove-btn").unbind().on("click", () => {
          const sessionCart = JSON.parse(sessionStorage.getItem('orders'));

          const quantity = sessionCart[menuItem.id];
          // Deletes from sessionStorage
          delete sessionCart[menuItem.id];

          // Deletes horizontal line under item entry in cart from DOM
          $(`#item-${menuItem.id}`).next().remove();

          // Deletes item entry in cart from DOM
          $(`#item-${menuItem.id}`).remove();

          // Updates sessionStorage subtotal and orders
          const newSubtotal = parseInt(sessionStorage.getItem('subtotal')) - menuItem.price * quantity;
          sessionStorage.setItem('subtotal', JSON.stringify(newSubtotal));

          updateTotals(newSubtotal);

          sessionStorage.setItem('orders', JSON.stringify(sessionCart));

          // If removing said item caused cart to become empty
          if (Object.keys(sessionCart).length === 0) {
            renderEmptyCart();
            updateTotals(0);
            $(`#edit-quantity-modal`).modal("toggle");
            return;
          }

        });

        $(`#edit-quantity-modal`).modal("toggle");
      });

    }

    // Updates totals container
    updateTotals(parseInt(sessionStorage.getItem("subtotal")));

    // Adds horizontal line before checkout button
    $("#checkout-btn").before("<hr>");

  };

  // GET request to /api/cart to get JSON of the current card but with additional info from db
  $.ajax({
    url: "/api/cart",
    type: "get",
    data: JSON.parse(sessionStorage.getItem('orders')), // Passes in sessionStorage order info
    success: function (response) {
      renderCart(response);
    },
    err: function (err) {
      console.log(err.message);
    }
  });
});