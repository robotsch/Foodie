$(() => {
  $("#logout-btn").unbind().on("click", function () {
    sessionStorage.clear();
  });
});