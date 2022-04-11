$(() => {

  const createItems = function (orderData) {
    return $(`
    <div id="items-container">
    <div>
      <div>
        <div class="px-2 py-1 mx-2 text-center">${orderData.quantity}</div>
        <div>${orderData.name}</div>
      </div>
      <div>
        <button type="button" class="btn btn-primary mx-3">Edit</button>
        <div>$${(orderData.quantity * orderData.price / 100).toFixed(2)}</div>
      </div>
    </div>
    <hr>
    </div>
  `);
  };

  const createTotals = function (totals) {
    return $(`
    <div id="totals-container">
      <div>
        <div>Subtotal</div>
        <div>$${totals.subtotal}</div>
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

  const renderCart = function (cartData) {
    if (Object.keys(cartData).length === 0) {
      $(`#cart-container > h3`).after(`
      <div class="my-5">
        <h4>No items in cart</h4>
      </div>
      `);
      return;
    }

    const checkoutBtn = $(`#cart-container > button:last-child`);

    let sum = 0;

    for (const menuItem of Object.values(cartData)) {
      sum += menuItem.price * menuItem.quantity;
      checkoutBtn.before(createItems(menuItem));
    }

    checkoutBtn.before(createTotals({
      subtotal: sum / 100,
      serviceFee: 1,
      tax: sum * 0.13 / 100,
      total: sum * 1.13 / 100
    }));

    checkoutBtn.before("<hr>");
  };

  const orders = JSON.parse(sessionStorage.getItem('orders'));

  $.ajax({
    url: "/api/cart",
    type: "get",
    data: orders,
    success: function (response) {
      console.log(response);
      renderCart(response);
    },
    err: function (err) {
      console.log(err.message);
    }
  });
});