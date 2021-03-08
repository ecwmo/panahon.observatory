$(document).ready(function () {
  $("#logoutBtn").click((ev) => {
    ev.preventDefault();
    $.get('scripts/logout.php', () => {
      window.location.href = "http://panahon.observatory.ph/api/login.php";
    });
  });
});