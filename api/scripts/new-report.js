$(document).ready(function () {
  const toggleUploadBtn = () => {
    const formIsValid = $("#tcCodeInput").hasClass("is-valid") && 
        $("#reportNumInput").hasClass("is-valid") &&
        $("#docInput").hasClass("is-valid");
    $("#uploadBtn").attr("disabled", !formIsValid);
  }

  const resetUploadForm = () => {
    $("#uploadDocForm").trigger("reset");
    $("#uploadDocForm").addClass("d-none");
    $("#tcCodeInput").removeClass(["is-invalid","is-valid"]);
    $("#reportNumInput").removeClass(["is-invalid","is-valid"]);
    $("#docInput").removeClass(["is-invalid","is-valid"]);
    $("#uploadBtn").attr("disabled", true);
  }

  const uploadSuccessCb = (response) => {
    if(response != 0) {
      $("#uploadBtn > span").addClass("d-none");
      $("#uploadBtn").text("Upload");
      resetUploadForm();
      $("#messageDiv h4").text("Upload Success!!!");
      $("#messageDiv p").removeClass("d-none");
      $("#messageDiv div.alert-info").addClass("alert-info").removeClass("alert-danger");
      $("#messageDiv").removeClass("d-none");
      $("#publishDiv").removeClass("d-none");
    } else {
      alert('file not uploaded');
    }
  }

  const uploadFailCb = (xhr, status, err) => {
    // console.log(status);
    // console.log(err);
    $("#uploadBtn > span").addClass("d-none");
    $("#uploadBtn").text("Upload");
    resetUploadForm();
    $("#messageDiv h4").text("Upload Failed!!!");
    $("#messageDiv p").addClass("d-none");
    $("#messageDiv div.alert-info").removeClass("alert-info").addClass("alert-danger");
    $("#messageDiv").removeClass("d-none");
  }

  const postSuccessCb = () => {
    $("#publishBtn > span").addClass("d-none");
    $("#publishBtn").text("Publish");
    $("#publishBtnn").attr("disabled", true);

    $("#messageDiv h4").text("Publish Success!!!");
    $("#messageDiv p").html(`<p>
      Document published 
      <a href="http://panahon.observatory.ph/reports.php" target="_blank" class="alert-link">here</a></p>
    `);
    $("#messageDiv p").removeClass("d-none");
    $("#messageDiv div.alert-info").addClass("alert-info").removeClass("alert-danger");
  }

  toggleUploadBtn();

  

  $("#tcCodeInput").focusout(() => {
    const tcCode = $("#tcCodeInput").val();
    const res = tcCode.match(/wp[0-9]{6}/g);
    if (res && tcCode.length === 8) {
      $("#tcCodeInput").addClass("is-valid").removeClass("is-invalid");
    } else {
      $("#tcCodeInput").removeClass("is-valid").addClass("is-invalid");
    }
    toggleUploadBtn();
  });

  $("#reportNumInput").change(() => {
    const reportNum = $("#reportNumInput").val();
    if (reportNum.length > 0) {
      $("#reportNumInput").addClass("is-valid").removeClass("is-invalid");
    } else {
      $("#reportNumInput").removeClass("is-valid").addClass("is-invalid");
    }
    toggleUploadBtn();
  });

  $("#docInput").focusout(() => {
    const docName = $("#docInput").val();
    const res = docName.match(/.pdf$/g);
    if (res && res[0].length > 0) {
      $("#docInput").addClass("is-valid").removeClass("is-invalid");
    } else {
      $("#docInput").removeClass("is-valid").addClass("is-invalid");
    }
    toggleUploadBtn();
  });

  $("#uploadBtn").click((ev) => {
    ev.preventDefault();

    const fd = new FormData();
    const docFile = $('#docInput')[0].files[0];

    $("#uploadBtn").html(`<span
      class="spinner-border spinner-border-sm"
      role="status" aria-hidden="true"></span> Uploading...`);

    fd.append('file', docFile);
    fd.append('tccode', $("#tcCodeInput").val());
    fd.append('repnum', $("#reportNumInput").val());

    $.ajax({
      url: 'scripts/upload-report.php',
      type: 'post',
      data: fd,
      contentType: false,
      processData: false,
      success: uploadSuccessCb,
      error: uploadFailCb
    });
  });

  $("#publishBtn").click((ev) => {
    ev.preventDefault();

    $("#publishBtn").html(`<span
      class="spinner-border spinner-border-sm"
      role="status" aria-hidden="true"></span> Publishing...`);

    $.ajax({
      url: 'scripts/publish-report.php',
      type: 'get',
      success: postSuccessCb
    });
  });
});
