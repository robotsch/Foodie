//ripped from full-menu.js

$(() => {
  const timeFormatter = (detailedTimeString) => {
    if (detailedTimeString === null) {
      return "Pending";
    } else {
      const date = detailedTimeString.slice(0, 10);
      const time = detailedTimeString.slice(11, 16);
      return date, " ", time;
    }
  };

  const createActiveOrder = (activeOrderObj, total) => {
    const time_ordered = timeFormatter(activeOrderObj.time_ordered);
    const time_accepted = timeFormatter(activeOrderObj.time_accepted);

    const est_time = activeOrderObj.estimated_completion_time ? activeOrderObj.estimated_completion_time + " mins" : "Pending";

    return $(`
    <div class="entry-div py-3 my-3 px-2" id="order_id${activeOrderObj.orders_id}">
        <div>
          <b>Order</b> #${activeOrderObj.orders_id}
        </div>
        <div>
          <b>Ordered:</b> ${time_ordered}
        </div>
        <div>
          <b>Accepted:</b> ${time_accepted}
        </div>
        <div>
          <b>Est. time:</b> ${est_time}
        </div>
        <div>
          <b>Total:</b> $${total.toFixed(2)}
        </div>
        <button type="submit" class="resolve-order-btn btn btn-primary">Complete Order</button>
      </div>
      <hr>
      `);
  };

  const createPriorOrder = (oldOrderObj, total) => {
    const time_ordered = timeFormatter(oldOrderObj.time_ordered);
    const time_accepted = timeFormatter(oldOrderObj.time_accepted);

    return $(`
    <div class="entry-div py-3 my-3 px-2" id="order_id${oldOrderObj.orders_id}">
        <div>
          <b>Order</b> #${oldOrderObj.orders_id}
        </div>
        <div>
          <b>Ordered:</b> ${time_ordered}
        </div>
        <div>
          <b>Accepted:</b> ${time_accepted}
        </div>
        <div>
          <b>Total:</b> $${total.toFixed(2)}
        </div>
    </div>
    <hr>
    `);
  };

  const getUnique = (valArray) => {
    const newArray = valArray.filter(
      (element, index, array) => array.indexOf(element) === index
    );
    return newArray;
  };

  const createItem = function (name, quantity, price) {
    return $(`
      <div class="item-container">
        <div>
          <div class="px-2 py-1 mx-2 text-center">${quantity}</div>
          <div>${name}</div>
        </div>
        <div>$${((price * quantity) / 100).toFixed(2)}</div>
      </div>
      <hr>
  `);
  };

  const renderOrderModalItems = function (orderID) {
    // Sets info in modal to menuItem that was clicked
    $.ajax({
      url: "/api/get-order-details",
      method: "GET",
      data: { orderID: orderID },
      success: function (response) {

        $(".modal-body").empty();

        const data = JSON.parse(response);

        let orderCost = 0;

        for (const menuItemName in data) {
          if (Object.hasOwnProperty.call(data, menuItemName)) {
            const quantity = data[menuItemName].quantity;
            const price = data[menuItemName].price;
            $('.modal-body').append(createItem(menuItemName, quantity, price));
            orderCost += quantity * price;
          }
        }

        $(".modal-body > hr:last-child").remove();

        orderCost += 100;
        orderCost *= 1.13;
        orderCost /= 100;

        $(".modal-title").text(`Order #${orderID}`);
        $("#tax-modal").text(`Tax: $${(orderCost * 0.13).toFixed(2)}`);
        $("#total-modal").text(`Total: $${orderCost.toFixed(2)}`);
        $(`#order-history-modal`).modal("toggle");

      },
      err: function (err) {
        console.log(err.message);
      }
    });
  };

  const renderActiveOrders = (newOrdersArr) => {
    let tempArr = [];

    let indexUniqueOrders = [];

    for (const object of newOrdersArr) {
      tempArr.push(object.orders_id);
    }

    let searchArr = getUnique(tempArr);

    for (const searchVal of searchArr) {
      indexUniqueOrders.push(tempArr.indexOf(searchVal));
    }

    for (const indexNumber of indexUniqueOrders) {
      let orderCost = 0;

      for (const object of newOrdersArr) {
        if (object.orders_id === newOrdersArr[indexNumber].orders_id) {
          orderCost += object.price * object.quantity;
        }
      }

      $("#prior-orders-title").before(
        createActiveOrder(newOrdersArr[indexNumber], (orderCost + 100) * 1.13 / 100)
      );

      const orderID = newOrdersArr[indexNumber].orders_id;

      $(`#order_id${orderID} > button`).on("click", function (event) {
        event.stopPropagation();

        $.ajax({
          url: `/api/resolve-order`,
          method: "post",
          data: { orderId: orderID },
        })
          .then(() => {
            window.location.href = "/orders";
          })
          .catch((err) => {
            console.log(err);
          });
      });

      $(`#order_id${orderID}`).unbind().on("click", function () {
        renderOrderModalItems(orderID);
      });
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
      let orderCost = 0;

      //calculates the total order price
      for (const object of oldOrdersArr) {
        if (object.orders_id === oldOrdersArr[indexNumber].orders_id) {
          orderCost += (object.price * object.quantity);
        }
      }
      
      $(".container-md").append(
        createPriorOrder(oldOrdersArr[indexNumber], (orderCost + 100) * 1.13 / 100)
      );

      const orderID = oldOrdersArr[indexNumber].orders_id;

      $(`#order_id${orderID}`).unbind().on("click", function () {
        renderOrderModalItems(orderID);
      });
    }
  };

  $.ajax({
    url: "/api/orders-user-id",
    method: "GET",
  }).then(function (response) {
    const data = JSON.parse(response);

    if (data.newOrders.length > 0) {
      $("#active-orders-container").empty();
      renderActiveOrders(data.newOrders);

      data.newOrders.forEach((order) => {
        if (order.estimated_completion_time === null) {
          let timer = setInterval(function () {
            $.ajax({
              url: "/api/order-status",
              type: "get",
              data: { orderID: order.orders_id },
              success: function (response) {
                // SWITCH IF'S WHEN DEPLOYING ON HEROKU
                // console.log(response);
                // if (response === "null") {
                if (response !== "null") {
                  sessionStorage.clear();
                  clearInterval(timer);
                  document.location.href = "/orders";
                }
              },
              err: function (err) {
                console.log(err.message);
              },
            });
          }, 4000);
        }
      });
    } else {
      $("#active-orders-title").after($(`      
      <div class="row text-center mt-2">
        <h3 id="no-active">No active orders</h3>
      </div>`))
    }

    if (data.oldOrders.length > 0) {
      $("#previous-orders-container").empty();
      renderPreviousOrders(data.oldOrders);
    } else {
      $("#prior-orders-title").after($(`      
      <div class="row text-center mt-2">
        <h3 id="no-active">No prior orders</h3>
      </div>`))
    }
  });
});
