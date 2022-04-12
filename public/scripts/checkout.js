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

  updateTotals(sessionStorage.getItem("subtotal"));

  

});