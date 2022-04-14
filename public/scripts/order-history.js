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
    <div class="entry-div">
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
    <div class="entry-div-history">
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
    //console.log("newOrdersArr: ", newOrdersArr);

    let tempArr = [];

    let indexUniqueOrders = [];

    for (const object of newOrdersArr) {
      tempArr.push(object.orders_id);
    }

    //console.log("tempArr: ", tempArr);

    let searchArr = getUnique(tempArr);

    for (const searchVal of searchArr) {
      indexUniqueOrders.push(tempArr.indexOf(searchVal));
    }

    for (const indexNumber of indexUniqueOrders) {
      let orderCost = 0;
      for (const object of newOrdersArr) {
        if (object.orders_id === newOrdersArr[indexNumber].orders_id) {
          console.log("object: ", object);
          console.log("object order id: ", object.orders_id);
          console.log("object price: ", object.price);
          console.log("object quantity: ", object.quantity);
          orderCost += ((object.price * object.quantity) / 100) * 1.13 + 1;
        }
      }

      $(`#active-orders-container`).append(
        createActiveOrder(newOrdersArr[indexNumber], orderCost)
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
      let orderCost = 0;
      for (const object of oldOrdersArr) {
        if (object.orders_id === oldOrdersArr[indexNumber].orders_id) {
          console.log("object: ", object);
          console.log("object order id: ", object.orders_id);
          console.log("object price: ", object.price);
          console.log("object quantity: ", object.quantity);
          orderCost += ((object.price * object.quantity) / 100) * 1.13 + 1;
        }
      }

      $(`#previous-orders-container`).append(
        createPriorOrder(oldOrdersArr[indexNumber], orderCost)
      );
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
              }
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

  $("#active-orders-container").on(
    "click",
    ".resolve-order-btn",
    function (event) {
      event.preventDefault();

      const orderH4 = $(this).siblings("h5").text();
      const indOf = orderH4.indexOf("#");
      const orderID = orderH4.slice(indOf + 1);

      //console.log("retrieved orderID: ", orderID);

      $.ajax({
        url: `/api/resolve-order`,
        method: "post",
        data: { orderId: orderID },
      })
        .then(() => {
          /*
          setTimeout(() => {
            document.location.href = "/orders";
          }, 5000);*/
          console.log("it is working");
          window.location.href = "/orders";
        })
        .catch((err) => {
          console.log(err);
        });
    }
  );
});
