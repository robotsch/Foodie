$(() => {

  $("form").validate({
    rules: {
      email: {
        email: true,
        required: true
      },
      password: {
        required: true
      },
      messages: {
        email: {
          email: "Please enter a valid email address",
          required: "Please enter an email address"
        },
        password: {
          required: "Please enter your password",
        },
      },
      submitHandler: function (form) {
        form.submit();
      }
    }
  });
  
});