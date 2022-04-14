//ripped from full-menu.js

$(() => {
  const timeFormatter = (detailedTimeString) => {
    if (detailedTimeString === null) {
      return "Pending";
    } else {
      let date = detailedTimeString.slice(0, 10);
      let time = detailedTimeString.slice(11, 16);
      return date, " ", time;
    }
  };

  const createActiveOrder = (activeOrderObj, total) => {
    let time_ordered = timeFormatter(activeOrderObj.time_ordered);
    let time_accepted = timeFormatter(activeOrderObj.time_accepted);

    let est_time = activeOrderObj.estimated_completion_time;

    total = total.toFixed(2);

    if (est_time === null) {
      est_time = "Pending";
    } else {
      est_time = activeOrderObj.estimated_completion_time + " mins";
    }

    return $(`
    <div class="entry-div" id="order_id${activeOrderObj.orders_id}">
      <h5>Order #${activeOrderObj.orders_id}</h5>
      <p class="entries"><b>Ordered:</b> ${time_ordered}</p>
      <p class="entries"><b>Accepted:</b> ${time_accepted}</p>
      <p class="entries"><b>Est. time:</b> ${est_time}</p>
      <p class="entries"><b>Total:</b> $${total}</p>
      <button type="submit" class="resolve-order-btn">Order Complete</button>
    </div>
    `);
  };

  const createPriorOrder = (oldOrderObj, total) => {
    let time_ordered = timeFormatter(oldOrderObj.time_ordered);
    let time_accepted = timeFormatter(oldOrderObj.time_accepted);
    total = total.toFixed(2);
    return $(`
    <div class="entry-div-history" id="order_id${oldOrderObj.orders_id}">
        <h5>Order #${oldOrderObj.orders_id}</h5>
        <p class="entries"><b>Ordered:</b> ${time_ordered}</p>
        <p class="entries"><b>Accepted:</b> ${time_accepted}</p>
        <p class="entries"><b>Total:</b> $${total}</p>
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
      let orderDesc = "||";

      for (const object of newOrdersArr) {
        if (object.orders_id === newOrdersArr[indexNumber].orders_id) {
          orderCost += ((object.price * object.quantity) / 100) * 1.13 + 1;
          orderDesc += ` ${object.name} x (${object.quantity}) ||`;
        }
      }

      $(`#active-orders-container`).append(
        createActiveOrder(newOrdersArr[indexNumber], orderCost)
      );

      const ordNo = newOrdersArr[indexNumber].orders_id;

      $(`#order_id${ordNo} > button`).on("click", function (event) {
        event.stopPropagation();

        $.ajax({
          url: `/api/resolve-order`,
          method: "post",
          data: { orderId: ordNo },
        })
          .then(() => {
            window.location.href = "/orders";
          })
          .catch((err) => {
            console.log(err);
          });
      });


      $(`#order_id${ordNo}`)
        .unbind()
        .on("click", function () {
          // Sets info in modal to menuItem that was clicked
          $(".modal-title").text(`Order #${ordNo}`);
          $("#desc").text(orderDesc);
          $("#total-modal").text(`Total: $${orderCost.toFixed(2)}`);
          $(`#menuItem-modal`).modal("toggle");
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
      let orderDesc = "||";

      //calculates the total order price
      for (const object of oldOrdersArr) {
        if (object.orders_id === oldOrdersArr[indexNumber].orders_id) {
          orderCost += ((object.price * object.quantity) / 100) * 1.13 + 1;
          orderDesc += ` ${object.name} x (${object.quantity}) ||`;
        }
      }

      $(`#previous-orders-container`).append(
        createPriorOrder(oldOrdersArr[indexNumber], orderCost)
      );

      let ordNo = oldOrdersArr[indexNumber].orders_id;

      $(`#order_id${ordNo}`)
        .unbind()
        .on("click", function () {
          // Sets info in modal to menuItem that was clicked
          $(".modal-title").text(`Order #${ordNo}`);
          $("#desc").text(orderDesc);
          $("#total-modal").text(`Total: $${orderCost.toFixed(2)}`);
          $(`#menuItem-modal`).modal("toggle");
        });

      //end of rip
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
    }

    if (data.oldOrders.length > 0) {
      $("#previous-orders-container").empty();
      renderPreviousOrders(data.oldOrders);
    }
  });

});
