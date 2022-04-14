$(() => {
  $("#logout-btn").unbind().on("click", function () {
    console.log("bruh");
    sessionStorage.clear();
  });
});