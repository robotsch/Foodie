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

    for (const menuItem of Object.values(cartData)) {
      $("#checkout-container > hr:first").after(createItem(menuItem));
    }

  };

  // GET request to /api/cart to get JSON of the current card but with additional info from db
  $.ajax({
    url: "/api/cart",
    type: "get",
    data: JSON.parse(sessionStorage.getItem('orders')), // Passes in sessionStorage order info
    success: function (response) {
      renderCheckout(response);
    },
    err: function (err) {
      console.log(err.message);
    }
  });

  // sohould be post request to /api/checkout to send order to backend
  $("#place-order-btn").unbind().on("click", function () {
    $.ajax({
      url: "/api/checkout",
      type: "get",
      data: JSON.parse(sessionStorage.getItem('orders')), // Passes in sessionStorage order info
      success: function (orderID) {
        console.log(orderID);
        $("#checkout-container").replaceWith(`
        <div class="container-md d-flex flex-column align-items-center mt-4" id="order-pending-container">
        <h1>PENDING</h1>
        <!-- <h3>Thank You!</h3>
        <h5>Pickup at 94 Halsey Ave, Toronto</h5>
        <h5>Your order will be ready at approximately:</h5>
        <span id="estimated-completion-time">1:25 pm</span>
        <span id="estimated-completion-date-time">(1:25 pm on Tue, April 11, 2022)</span> -->
        </div>`
        );

        let timer = setInterval(function () {
          $.ajax({
            url: "/order-pending",
            type: "get",
            data: { "orderID": orderID },
            success: function (response) {
              // if (response === "null") {
              if (response !== "null") {
                clearInterval(timer);
                document.location.href = "/";
              }
            },
            err: function (err) {
              console.log(err.message);
            }
          });
        }, 1000);

      },
      err: function (err) {
        console.log(err.message);
      }
    });
  });

  // const requestLoop = setInterval(function () {
  //   $.ajax({
  //     url: "",
  //     type: "get",
  //     data: ,
  //     success: function (response) {
  //       console.log(response);
  //     },
  //     err: function (err) {
  //       console.log(err.message);
  //     }
  //   });
  //   // if (order completion time exists) {
  //   if (true) {
  //     clearInterval(timer);
  //   }
  // }, 1000);

});