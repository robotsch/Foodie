//ripped from full-menu.js

$(() => {
  // Transforms any scripting attacks to normal text
  const escape = function (str) {
    let div = document.createElement("div");
    div.append(document.createTextNode(str));
    return div.innerHTML;
  };

  const timeFormatter = (detailedTimeString) => {
    if (detailedTimeString === null) {
      return "Pending";
    } else {
      let date = detailedTimeString.slice(0, 10);
      let time = detailedTimeString.slice(11, 16);
      return date, " ", time;
    }
  };

  const createActiveOrder = (activeOrderObj) => {
    let time_ordered = timeFormatter(activeOrderObj.time_ordered);
    let time_accepted = timeFormatter(activeOrderObj.time_accepted);

    let est_time = activeOrderObj.estimated_completion_time;

    if (est_time === null) {
      est_time = "Pending";
    } else {
      est_time = activeOrderObj.estimated_completion_time + " mins";
    }

    return $(`
    <div class="entry-div">
      <h4>Order #${activeOrderObj.orders_id}</h4>
      <p class="entries"><b>Order Placed:</b> ${time_ordered}</p>
      <p class="entries"><b>Order Accepted:</b> ${time_accepted}</p>
      <p class="entries"><b>Estimated Preparation Time:</b> ${est_time}</p>
      <button type="submit" class="resolve-order-btn">Order Complete</button>
    </div>
    `);
  };

  const createPriorOrder = (oldOrderObj) => {
    let time_ordered = timeFormatter(oldOrderObj.time_ordered);
    let time_accepted = timeFormatter(oldOrderObj.time_accepted);

    return $(`
    <div class="entry-div-history">
        <h4>Order #${oldOrderObj.orders_id}</h4>
        <p class="entries"><b>Order Placed:</b> ${time_ordered}</p>
        <p class="entries"><b>Order Accepted:</b> ${time_accepted}</p>
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

    // console.log("indexUniqueOrders: ", indexUniqueOrders);

    for (const indexNumber of indexUniqueOrders) {
      // console.log(newOrdersArr[indexNumber]);

      $(`#active-orders-container`).append(
        createActiveOrder(newOrdersArr[indexNumber])
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
      $(`#previous-orders-container`).append(
        createPriorOrder(oldOrdersArr[indexNumber])
      );
    }
  };

  $.ajax({
    url: "/api/orders-user-id",
    method: "GET",
  }).then(function (response) {
    const data = JSON.parse(response);
    // console.log("getmethod data:", data);
    // console.log("response: ", response);

    if (data.newOrders.length > 0) {
      $("#active-orders-container").empty();
      renderActiveOrders(data.newOrders);

      console.log(data.newOrders);

      data.newOrders.forEach(order => {
        if (order.estimated_completion_time === null) {
          
          let timer = setInterval(function () {
            $.ajax({
              url: "/api/order-status",
              type: "get",
              data: { "orderID": order.orders_id },
              success: function (response) {
                // SWITCH IF'S WHEN DEPLOYING ON HEROKU
                console.log("INSIDE SUCCESS");
                console.log(typeof response);
                console.log("loop");
                // if (response !== "null") {
                if (response === "null") {
                  sessionStorage.clear();
                  clearInterval(timer);
                  console.log("PLS DEAR GOD IT WORKED");
                  document.location.href = "/orders"
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

      const orderH4 = $(this).siblings("h4").text();
      const indOf = orderH4.indexOf("#");
      const orderID = orderH4.slice(indOf + 1);

      //console.log("retrieved orderID: ", orderID);

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
    }
  );
});
