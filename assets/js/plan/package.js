
$(function () {

  $(document).on("click", ".check-invoice", function () {
    var orderNum = $(this).attr("ordernum");
    if ($.trim(orderNum) == "") {
      return false;
    }
    basicAjaxCall(
      {
        url: APP_DOMAIN + "/package/check?orderNo=" + $.trim(orderNum),
        dataType: "json",
        type: "get",
        async: true,
      },
      function (result) {
        if (result.state == 0) {
          var urlVal = APP_DOMAIN + "/package/invoice";
          $("#exportForm").attr("action", urlVal);
          $('#exportForm input[name="orderNo"]').val($.trim(orderNum));
          $("#exportForm").submit();
        } else {
          $(document).alertbox({
            msgContent: result.msg,
            msgContentClass: "warning",
          });
        }
      }
    );
  });
  pageClick(searchOrderList);
  billAddressInit();
  payFailed();
  addDotNum();
  function searchOrderList(pageNum, pageSize) {
    if (pageSize == null || pageSize == "" || typeof pageSize == "undefined") {
      pageSize = $.trim($("#pageSize").attr("values"));
    }
    if (pageNum == null || pageNum == "" || typeof pageNum == "undefined") {
      pageNum = 1;
    }
    pageSize = $.trim(pageSize);
    pageNum = $.trim(pageNum);
    $(".pageSize").val(pageSize);
    $(".pageNum").val(pageNum);
    $(".page-form").submit();
  }
  function pageClick(searchFun) {
    $(".gotoNextPage").click(function (e) {
      nextPage();
    });
    $(".gotoPrePage").click(function (e) {
      prePage();
    });
    $(".gotoFirstPage").click(function (e) {
      firstPage();
    });
    $(".gotoLastPage").click(function (e) {
      lastPage();
    });
    $("#pageNum").keydown(function (e) {
      if (e.keyCode == 13) {
        var jumpPageNum = $("#pageNum").val();
        var totalPageCount = parseInt($("#totalPageCount").text());
        if (
          typeof jumpPageNum != "undefined" &&
          jumpPageNum != "" &&
          !isNaN(jumpPageNum)
        ) {
          jumpPageNum = parseInt(jumpPageNum);
          if (jumpPageNum < 1) {
            jumpPageNum = 1;
          }
          if (jumpPageNum > totalPageCount) {
            jumpPageNum = totalPageCount;
          }
          searchFun(jumpPageNum);
        } else {
          searchFun(1, "");
        }
      }
    });
    $('span[name="pageSizes"]').click(function (e) {
      var pageSize = $(this).text();
      searchFun("", pageSize);
    });
    function prePage() {
      var currentPageNum = parseInt($("#pageNum").val());
      if (currentPageNum <= 1) {
        return;
      }
      currentPageNum = currentPageNum - 1;
      searchFun(currentPageNum, "");
    }

    function nextPage() {
      var currentPageNum = parseInt($("#pageNum").val());
      var totalPageCount = parseInt($("#totalPageCount").text());
      if (currentPageNum >= totalPageCount) {
        return;
      }
      currentPageNum = currentPageNum + 1;
      searchFun(currentPageNum, "");
    }

    function firstPage() {
      var currentPageNum = parseInt($("#pageNum").val());
      if (currentPageNum == 1) {
        return;
      }
      searchFun(1, "");
    }

    function lastPage() {
      var currentPageNum = parseInt($("#pageNum").val());
      var totalPageCount = parseInt($("#totalPageCount").text());
      if (totalPageCount == currentPageNum) {
        return;
      }
      searchFun(totalPageCount, "");
    }
  }
  function billAddressInit() {
    $(document).on("mouseover", ".billAddress", function () {
      var initVal = $(this).attr("data-msg");
      if (!initVal) {
        return false;
      }
      initVal = JSON.parse(initVal);
      var left = $(this).offset().left;
      var width = $(this).outerWidth();
      var top = $(this).offset().top;
      var windowWidth = $(window).width();
      var addressInit = initVal.address2
        ? initVal.address1 + "; " + initVal.address2
        : initVal.address1;
      var html =
        '<div class="tip-box"><i></i><b></b><p>' +
        PKG.BILL_ADDRESS +
        addressInit +
        "; " +
        initVal.city +
        "; " +
        initVal.province +
        "; " +
        initVal.postal +
        "; " +
        initVal.country +
        "</p></div>";
      $(html).appendTo("body");
      var htmlHeight = $(".tip-box").outerHeight();
      var htmlWidth = $(".tip-box").outerWidth();
      var htmlLeft = left - htmlWidth / 2;
      $(".tip-box b").css({
        left: (htmlWidth - 18) / 2,
      });
      $(".tip-box").css({
        left: htmlLeft,
        top: top - htmlHeight,
      });
    });
    $(document).on("mouseout", ".billAddress", function () {
      $(".tip-box").remove();
    });
    $(document).on("mouseover", ".order-fail-color1", function () {
      var initVal = escapeHtml($(this).attr("data-msg"));
      if (!initVal) {
        return false;
      }
      var left = $(this).offset().left;
      var width = $(this).outerWidth();
      var top = $(this).offset().top;
      var windowWidth = $(window).width();
      var html =
        '<div class="popover-box order-tips"><i class="bottom-arrow"></i><p class="fl"><b class="warn"></b>' +
        initVal +
        "</p></div>";
      $(html).appendTo("body");
      var htmlHeight = $(".popover-box").outerHeight();
      var htmlWidth = $(".popover-box").outerWidth();
      var htmlLeft = left - htmlWidth / 2 + 24;
      $(".popover-box").css({
        left: left + width / 2 - htmlWidth / 2,
        top: top - htmlHeight - 5,
      });
    });
    $(document).on("mouseout", ".order-fail-color1", function () {
      $(".popover-box").remove();
    });

    if (localStorage.failedBtnSuccess == "yes") {
      $(document).alertbox({
        msgContent: PKG.PAY_RESULT_TOAST_SUCCESS,
      });
      localStorage.failedBtnSuccess = "no";
    }
  }
  function payFailed() {
    $(document).on("click", ".back-to-plan-btn", function (event) {
      event.preventDefault();
      var option = {
        url:
          APP_DOMAIN +
          "package/payment_detail?paymentId=" +
          $(this).attr("data-value"),
        dataType: "json",
        type: "get",
        async: true,
      };
      basicAjaxCall(option, function (result) {
        if (result.state == 0) {
          window.location.href = APP_DOMAIN + "package/history";
        } else {
          $(document).alertbox({
            msgContent: result.msg,
            msgContentClass: "warning",
          });
        }
      });
    });
  }
  function addDotNum() {
    $(".addDot").each(function () {
      var isHasData = $(this).attr("data-price");
      if (isHasData) {
        $(this).text(addSuffix(isHasData));
      }
    });
  }
  function addSuffix(num) {
    var numInit = num + "";
    if (numInit.indexOf(".") > 0) {
      var arrNum = numInit.split(".");
      if (arrNum[1].length == 1) {
        return "Rp" + numInit + "0";
      } else {
        return "Rp" + numInit;
      }
    } else {
      return "Rp" + numInit + ".00";
    }
  }
});
