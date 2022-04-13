$(() => {

  const createItem = function (menuItem) {
    return $(`
    <div class="item-container" id="item-${menuItem.id}">
      <div>
        <div class="px-2 py-1 mx-2 text-center">${menuItem.quantity}</div>
        <div>${menuItem.name}</div>
      </div>
      <div>$${(menuItem.quantity * menuItem.price / 100).toFixed(2)}</div>
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

  const renderEmptyCart = function () {
    $(`#cart-container > h3`).after(`
      <hr>
      <div class="my-5">
        <h4>No items in cart</h4>
      </div>
      <hr>
      `);
  };


  const renderCheckout = function (cartData) {

    updateTotals(sessionStorage.getItem("subtotal"));

    // No items in cart
    if (Object.keys(cartData).length === 0) {
      renderEmptyCart();
      return;
    }

    // Renders each item in order
    for (const menuItem of Object.values(cartData)) {
      $("#totals-container").before(createItem(menuItem));
    }

  };

  // GET request to /api/cart to get JSON of the current card but with additional info from db
  $.ajax({
    url: "/api/cart",
    type: "get",
    // Passes in sessionStorage order info
    data: JSON.parse(sessionStorage.getItem('orders')),
    success: function (response) {
      renderCheckout(response);
    },
    err: function (err) {
      console.log(err.message);
    }
  });

  // When place order button is clicked
  $("#place-order-btn").unbind().on("click", function () {

    // If no items in order, does nothing
    if (sessionStorage.getItem("orders") === null) return;

    // GET requests to /api/checkout to get orderID of the newly created order
    $.ajax({
      url: "/api/checkout",
      type: "get",
      // Passes in sessionStorage order info
      data: JSON.parse(sessionStorage.getItem('orders')),
      success: function (orderID) {

        // After new order has been created and inserted into database
        // user is shown pending screen while waiting for restaurant
        // to accept order
        // $("#checkout-container").replaceWith(`
        // // <div class="container-md d-flex flex-column align-items-center mt-4" id="order-pending-container">
        // // <h1>PENDING</h1>
        // // </div>`
        // );

        // Sends a GET request to /api/order-status every 2 seconds
        // to check if order has been accepted
        let timer = setInterval(function () {
          $.ajax({
            url: "/api/order-status",
            type: "get",
            data: { "orderID": orderID },
            success: function (response) {
              // if (response === "null") {
              // SWITCH IF'S WHEN DEPLOYING ON HEROKU
              if (response !== "null") {
                sessionStorage.clear();
                clearInterval(timer);
                document.location.href = "/orders";
              }
            },
            err: function (err) {
              console.log(err.message);
            }
          });
        }, 2000);

        document.location.href = "/orders";
      },
      err: function (err) {
        console.log(err.message);
      }
    });
  });

});