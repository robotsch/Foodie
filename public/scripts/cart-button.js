$(() => {

  let orders = sessionStorage.getItem("orders");
  if (orders) {
    orders = JSON.parse(orders);
    $("#cart-btn > span").text(`Cart | ${Object.keys(orders).length}`);
  }

  $("#cart-btn").unbind().on("click", function () {
    document.location.href = "/cart";
  });
});