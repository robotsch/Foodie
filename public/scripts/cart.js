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

  // const createItemEditModal = function (menuItemData) {
  //   return $(`
  //   <div class="modal fade" id="menuItemModal-${menuItemData.id}">
  //     <div class="modal-dialog">
  //       <div class="modal-content">
  //         <div class="modal-header">
  //           <h5 class="modal-title" id="exampleModalLabel">${menuItemData.name}</h5>
  //           <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
  //         </div>
  //         <div class="modal-body">
  //           ${menuItemData.description}
  //           <hr class="bg-danger border-2 border-top border-danger">
  //           <div>
  //             <div>
  //               Price<br>
  //               $${menuItemData.price / 100}
  //             </div>
  //             <div>
  //               Quantity<br>
  //               <span class="menuItemModal-quantity-${menuItemData.id}">1</span>
  //             </div>
  //             <div>
  //               Total<br>
  //               <span id="menuItemModal-total-cost-${menuItemData.id}">$${menuItemData.price / 100}</span>
  //             </div>
  //           </div>
  //           <hr class="bg-danger border-2 border-top border-danger">
  //           <div>
  //             <button type="button" class="btn btn-outline-dark mx-3" id="menuItemModal-minus-quantity-${menuItemData.id}">-</button>
  //             <span class="menuItemModal-quantity-${menuItemData.id}">1</span>
  //             <button type="button" class="btn btn-outline-dark mx-3" id="menuItemModal-plus-quantity-${menuItemData.id}">+</button>
  //           </div>
  //         </div>
  //         <div class="modal-footer">
  //           <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
  //           <button type="button" data-bs-dismiss="modal" id="menuItemModal-submit-btn-${menuItemData.id}" class="btn btn-primary">Add To Order</button>
  //         </div>
  //         </div>
  //       </div>
  //     </div>
  //     `);
  // };

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
    // No items in cart
    if (Object.keys(cartData).length === 0) {
      $(`#cart-container > h3`).after(`
      <div class="my-5">
        <h4>No items in cart</h4>
      </div>
      `);
      return;
    }

    let sum = 0;

    for (const menuItem of Object.values(cartData)) {
      let newQuantity = 1;

      sum += menuItem.price * menuItem.quantity;
      $("#cart-container > h3").after(createItem(menuItem));

      $(`#edit-quantity-btn-${menuItem.id}`).on("click", function () {
        const modal = $(`#edit-quantity-modal`);
        $('.modal-title').text(menuItem.name);
        $('#desc').text(menuItem.description);
        $(`#price`).text(`$${(menuItem.price / 100).toFixed(2)}`);
        $(".quantity").text(menuItem.quantity);
        $("#total").text(`$${(menuItem.price * menuItem.quantity / 100).toFixed(2)}`);

        $("#minus-quantity-btn").unbind().on("click", function () {
          if (menuItem.quantity > 1) {
            menuItem.quantity--;
            $(".quantity").text(menuItem.quantity);
            $("#total").text(`$${(menuItem.price * menuItem.quantity / 100).toFixed(2)}`);
          }
        });

        $("#plus-quantity-btn").unbind().on("click", function () {
          if (menuItem.quantity < 100) {
            menuItem.quantity++;
            $(".quantity").text(menuItem.quantity);
            $("#total").text(`$${(menuItem.price * menuItem.quantity / 100).toFixed(2)}`);
          }
        });

        $("#set-quantity-btn").on("click", function () {
          const sessionCart = JSON.parse(sessionStorage.getItem('orders'));

          // Gets new quantity
          const newQuantity = parseInt($(this).parent().prev().children("div:last-child").children("span").text());

          // Updates new quantity in sessionStorage
          sessionCart[menuItem.id] = newQuantity;

          // Updates quantity in yellow div on 'Your Cart' page to new quantity
          $(`#item-${menuItem.id}`).children("div:first-child").children("div:first-child").text(newQuantity);

          // Updates total price for each item on 'Your Cart' page after quantity changes
          $(`#item-${menuItem.id}`).children("div:last-child").children("div:last-child").text(`$${(menuItem.price * menuItem.quantity / 100).toFixed(2)}`);

          // idk if commenting/uncommenting this line does much
          // delete cartData[menuItem.id];

          // Updates sessionStorage
          sessionStorage.setItem('orders', JSON.stringify(sessionCart));
        });

        $("#remove-btn").on("click", () => {
          const sessionCart = JSON.parse(sessionStorage.getItem('orders'));

          // Deletes from sessionStorage
          delete sessionCart[menuItem.id];

          // Deletes horizontal line under item entry in cart from DOM
          $(`#item-${menuItem.id}`).next().remove();

          // Deletes item entry in cart from DOM
          $(`#item-${menuItem.id}`).remove();

          // idk if commenting/uncommenting this line does much
          // delete cartData[menuItem.id];

          // Updates sessionStorage
          sessionStorage.setItem('orders', JSON.stringify(sessionCart));
        });

        modal.modal("toggle");
      });

    }

    // Gets jquery selector for checkout button
    const checkoutBtn = $(`#cart-container > button:last-child`);

    // Creates and renders section for totals before checkout button
    checkoutBtn.before(createTotals({
      subtotal: sum / 100,
      serviceFee: 1,
      tax: sum * 0.13 / 100,
      total: sum * 1.13 / 100
    }));

    // Adds horizontal line before checkout button
    checkoutBtn.before("<hr>");

  };

  $.ajax({
    url: "/api/cart",
    type: "get",
    data: JSON.parse(sessionStorage.getItem('orders')),
    success: function (response) {
      renderCart(response);
    },
    err: function (err) {
      console.log(err.message);
    }
  });
});