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

  const createTotals = function (cartData) {
    return $(`
    <div id="totals-container">
      <div>
        <div>Subtotal</div>
        <div>$${1}</div>
      </div>
      <div>
        <div>Serivce Fee</div>
        <div>$1.00</div>
      </div>
      <div>
        <div>Tax</div>
        <div>$${1}</div>
      </div>
      <div>
        <div>Total</div>
        <div>$${1}</div>
      </div>
    </div>   
    `);
  };

  const renderCart = function () {
    $(`h3`).after(createItems({ name: "Spring Rolls", quantity: 3, price: 150 }), createTotals());
  };


  console.log(JSON.parse(sessionStorage.getItem('orders')));
  // fetch("/api/cart/")
  //   .then(response => response.json())
  //   .then(data => {
  //     console.log(data);
  //     renderCart();
  //   })
  //   .catch(err => console.log(err.message));

});