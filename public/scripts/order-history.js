//ripped from full-menu.js

$(() => {
  // Transforms any scripting attacks to normal text
  const escape = function (str) {
    let div = document.createElement("div");
    div.append(document.createTextNode(str));
    return div.innerHTML;
  };

  const createActiveOrder = (activeOrderObj) => {
    return $(`
    <div class="entry-div">
      <h4>Order #: ${activeOrderObj.orders_id}</h4>
      <p class="entries">Order Placed: ${activeOrderObj.time_ordered}</p>
      <p class="entries">Order Accepted: ${activeOrderObj.time_accepted}</p>
      <p class="entries">Estimated Preparation Time: ${activeOrderObj.estimated_completion_time}</p>
    </div>
    `);
  };

  const createPriorOrder = (oldOrderObj) => {
    return $(`
    <div class="entry-div">
      <div>
        <h4>Order #: ${oldOrderObj.orders_id}</h4>
        <p class="entries">Order Placed: ${oldOrderObj.time_ordered}</p>
        <p class="entries">Order Accepted: ${oldOrderObj.time_accepted}</p>
        <p class="entries">Estimated Preparation Time: ${oldOrderObj.estimated_completion_time}</p>
      </div>
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
    // console.log("newOrdersArr: ", newOrdersArr);

    let tempArr = [];

    let indexUniqueOrders = [];

    for (const object of newOrdersArr) {
      tempArr.push(object.orders_id);
    }

    // console.log("tempArr: ", tempArr);

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
    }

    if (data.oldOrders.length > 0) {
      $("#previous-orders-container").empty();
      renderPreviousOrders(data.oldOrders);
    }
  });
});
