$(document).ready(function () {
  const toggleLoginBtn = () => {
    const formIsValid = $("#usernameInput").hasClass("is-valid") && 
        $("#passwordInput").hasClass("is-valid");
    $("#loginBtn").attr("disabled", !formIsValid);
  }

  const resetLoginForm = () => {
    $("#loginForm").trigger("reset");
    $("#loginForm").addClass("d-none");
    $("#usernameInput").removeClass(["is-invalid","is-valid"]);
    $("#passwordInput").removeClass(["is-invalid","is-valid"]);
    $("#loginBtn").attr("disabled", true);
  }

  const loginSuccessCb = (response) => {
    if(response != 0) {
      $("#loginBtn > span").addClass("d-none");
      $("#loginBtn").text("Login");
      resetLoginForm();
      window.location.href = "http://panahon.observatory.ph/api/new-report.php";
    } else {
      // console.log("Login Failed!!!");
    }
  }

  const loginFailCb = (xhr, status, err) => {
    // console.log(status);
    // console.log(err);
    // $("#loginBtn > span").addClass("d-none");
    $("#loginBtn").text("Login");
    resetLoginForm();
    $("#loginForm").removeClass("d-none");
    console.log("Login Failed!!!");
  }

  toggleLoginBtn();

  $("#usernameInput").focusout(() => {
    const username = $("#usernameInput").val();
    if (username && username.length > 0) {
      $("#usernameInput").addClass("is-valid").removeClass("is-invalid");
    } else {
      $("#usernameInput").removeClass("is-valid").addClass("is-invalid");
    }
    toggleLoginBtn();
  });

  $("#passwordInput").focusout(() => {
    const passwd = $("#passwordInput").val();
    if (passwd && passwd.length > 0) {
      $("#passwordInput").addClass("is-valid").removeClass("is-invalid");
    } else {
      $("#passwordInput").removeClass("is-valid").addClass("is-invalid");
    }
    toggleLoginBtn();
  });

  $("#loginBtn").click((ev) => {
    ev.preventDefault();

    const fd = new FormData();

    $("#loginBtn").html(`<span
      class="spinner-border spinner-border-sm"
      role="status" aria-hidden="true"></span> Logging in...`);

    fd.append('username', $("#usernameInput").val());
    fd.append('password', $("#passwordInput").val());

    $.ajax({
      url: 'scripts/login.php',
      type: 'post',
      data: fd,
      contentType: false,
      processData: false,
      success: loginSuccessCb,
      error: loginFailCb
    });
  });
});
