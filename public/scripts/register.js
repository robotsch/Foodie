$(() => {

  jQuery.validator.addMethod("tenDigits", function(value, element) {
    return this.optional(element) || value.toString().length === 10;
  }, "Phone number must be 10 digits");

  $("form").validate({
    rules: {
      fname: "required",
      lname: "required",
      email: {
        required: true,
        email: true
      },
      phone: {
        required: true,
        digits: true,
        tenDigits: true
      },
      password1: {
        required: true,
        minlength: 5
      },
      password2: {
        required: true,
        equalTo: "#password1"
      },
      messages: {
        firstname: "Please enter your first name",
        lastname: "Please enter your last name",
        email: "Please enter a valid email address",
        phone: {
          required: "Please enter your phone number",
          digits: "Please enter without spaces, hypens or parentheses"
        },
        password1: {
          required: "Please provide a password",
          minlength: "Your password must be at least 5 characters long"
        },
        password2: {
          required: "Please re-enter your password",
        }
      },
      submitHandler: function (form) {
        form.submit();
      }
    }
  });
});