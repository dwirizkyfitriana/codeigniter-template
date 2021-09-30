function getCommonEmailMatch() {
  return /^[^<> @,;]*@(?:[^<> @,;]+\.)+(?:[-\w]){2,32}$/;
}
function getCommonPhoneMatch() {
  return /^[^<> ,;]{1,64}$/;
}
var ie8PropertychangeFlag = false;
function hideDeleteIcon(inputObject) {
  inputObject
    .parents(".search")
    .find(".delete-icon-box")
    .css("display", "none");
  addPlaceholderForie8(inputObject);
}
function bindSearchInputEvent() {
  $(".right-container .operation .search input").bind(
    "focus input propertychange",
    function (e) {
      controlDeleteIcon($(this));
    }
  );
  function controlDeleteIcon(obj) {
    var inputValue = $.trim(obj.val());
    if (inputValue != "") {
      $(".right-container .operation .search .delete-icon-box").css(
        "display",
        "block"
      );
    } else {
      $(".right-container .operation .search .delete-icon-box").css(
        "display",
        "none"
      );
    }
  }

  keydownDeleteForie9(
    $(".right-container .operation .search input"),
    function () {
      $(".right-container .operation .search .delete-icon-box").css(
        "display",
        "none"
      );
    },
    function () {
      $(".right-container .operation .search .delete-icon-box").css(
        "display",
        "block"
      );
    }
  );
}
function keydownDeleteForie9(inputObject, inputEmpty, inputNotEmpty) {
  if (navigator.userAgent.indexOf("MSIE 9.0") > 0) {
    inputObject.keydown(function (e) {
      if (e.keyCode == 8 || e.keyCode == 46) {
        var inputValue = $.trim(inputObject.val());
        if (inputValue.length < 2) {
          if (inputEmpty) {
            inputEmpty();
          }
        } else {
          if (inputNotEmpty) {
            inputNotEmpty();
          }
        }
      }
    });
  }
}
function meetingKeydownDeleteForie9(inputObject, callback) {
  if (navigator.userAgent.indexOf("MSIE 9.0") > 0) {
    inputObject.keydown(function (e) {
      if (e.keyCode == 8 || e.keyCode == 46) {
        if (callback) {
          callback();
        }
      }
    });
  }
}
function addPlaceholderForie8(inputObject) {
  if (!placeholderSupport()) {
    var placeholderTxt = inputObject.parent().children();
    if (placeholderTxt.hasClass("placeholder-txt")) {
      placeholderTxt.css("display", "block");
      return;
    }
    var placeholderValue = inputObject.attr("placeholder");
    if (
      inputObject.val() == "" ||
      inputObject.val() == inputObject.attr("placeholder")
    ) {
      $(
        '<div class="placeholder-txt">' + placeholderValue + "</div>"
      ).insertAfter(inputObject);
    }
  }
}
function addInputAutocomplete() {
  $("input").attr("autocomplete", "off");
}
function enptyShide(obj) {
  var shide = obj.parents(".selectbox").find(".s-hide-box");
  if (shide.children() && shide.children().length == 0) {
    shide.append("<div class = 'no-selects'>" + COMMON.NO_SELECT + "</div>");
    shide.show();
    return false;
  }
  return true;
}
function initDefaultHidden() {
  $(".icon-check-all")
    .removeClass("icon-check-selected")
    .addClass("icon-check");
  if ($(".table-container tbody .icon-check-selected").length == 0) {
    $(".defaultHidden").hide();
  }
}
$(function () {
  initSystemError();

  addInputAutocomplete();

  capsLockCheck();

  $(document).on(
    "focus",
    ".right-container .operation .search input",
    function () {
      $(this).parents(".search").find(".search-icon-box").addClass("blue");
      $(this).parents(".search").addClass("active");
    }
  );
  $(document).on(
    "blur",
    ".right-container .operation .search input",
    function () {
      $(this).parents(".search").find(".search-icon-box").removeClass("blue");
      $(this).parents(".search").removeClass("active");
    }
  );
  $(document).on(
    "click",
    ".right-container .operation .search .delete-icon-box",
    function () {
      var inputObject = $(this)
        .parents(".search")
        .find("input#keyword , input#searchInput");
      inputObject.val("").focus();
      $(this).css("display", "none");
      addPlaceholderForie8(inputObject);
    }
  );
  initLanguage();
  termsWidth();
  function termsWidth() {
    if ($(".termsDes").width() > 360) {
      $(".termsDes").children("a").eq(1).wrap("<div></div>");
    }
  }
  var win_height = $(document).height();
  if (window.navigator.userAgent.indexOf("IE 8.0") > 0) {
    $("#bigpic").show();
    cover();
    window.onresize = function () {
      cover();
    };
  }
  function cover() {
    var win_width = $(".login-header").outerWidth();
    $("#bigpic").css({ width: win_width, height: win_height });
  }

  $("body").on("click", ".radio", function (event) {
    event.stopPropagation();
    $(this).parents(".view").find(".icons").removeClass("error");
    $(this).parents(".view").find(".name").removeClass("error");
    $(this).parents(".view").find(".error-tip").remove();
    if ($(this).children("b").hasClass("icon-radio")) {
      var name = $(this).attr("name");
      if (name != undefined && name != null && name != "") {
        $(".radio").each(function () {
          var eRadio = $(this).attr("name");
          if (
            eRadio != undefined &&
            eRadio != null &&
            eRadio != "" &&
            eRadio == name
          ) {
            $(this)
              .children("b")
              .removeClass("icon-radio-selected")
              .addClass("icon-radio");
          }
        });
      }
      $(this)
        .children("b")
        .removeClass("icon-radio")
        .addClass("icon-radio-selected");
    }
  });
  //click checkbox
  $("body").on("click", ".checkbox", function (event) {
    event.stopPropagation();
    event.preventDefault();
    $(this).parents(".view").find(".icons").removeClass("error");
    $(this).parents(".view").find(".name").removeClass("error");
    $(this).parents(".view").find(".error-tip").remove();
    if ($(this).children("i").hasClass("icon-check")) {
      $(this)
        .children("i")
        .removeClass("icon-check")
        .addClass("icon-check-selected");
    } else if ($(this).children("i").hasClass("icon-check-selected")) {
      $(this)
        .children("i")
        .removeClass("icon-check-selected")
        .addClass("icon-check");
    } else if ($(this).children("i").hasClass("icon-check-mixed")) {
      $(this)
        .children("i")
        .removeClass("icon-check-mixed")
        .addClass("icon-check-selected");
    }
  });
  $("body").on("click", ".control-box .checkbox", function (event) {
    event.stopPropagation();
    if ($(this).find(".icons").hasClass("icon-check-selected")) {
      //$(".control-box ul").show();
      $(".check-item-td")
        .find("input")
        .attr("checked", true)
        .end()
        .find(".icons")
        .removeClass("icon-check")
        .addClass("icon-check-selected");
    } else {
      //$(".control-box ul").hide();
      $(".check-item-td")
        .find("input")
        .attr("checked", false)
        .end()
        .find(".icons")
        .addClass("icon-check")
        .removeClass("icon-check-selected");
    }
  });
  $("body").on("click", ".check-item-td .checkbox", function (event) {
    event.stopPropagation();
    var selectedChecSize = $(".check-item-td i.icon-check-selected").size();
    var checkboxSize = $(".check-item-td i.icons").size();
    if (selectedChecSize > 0) {
      if (selectedChecSize < checkboxSize) {
        $(".control-box ul").show();
        //$('.control-box .checkbox i').removeClass('icon-check').removeClass('icon-check-selected').addClass('icon-check-mixed');
        $(".control-box .checkbox i")
          .removeClass("icon-check-selected")
          .addClass("icon-check");
        $(".control-box .checkbox input").attr("checked", false);
      } else if (selectedChecSize == checkboxSize) {
        $(".control-box ul").show();
        $(".control-box .checkbox i")
          .removeClass("icon-check")
          .removeClass("icon-check-mixed")
          .addClass("icon-check-selected");
        $(".control-box .checkbox input").attr("checked", true);
      }
    } else if (selectedChecSize == 0) {
      $(".control-box ul").hide();
      $(".control-box .checkbox i")
        .addClass("icon-check")
        .removeClass("icon-check-mixed")
        .removeClass("icon-check-selected");
      $(".control-box .checkbox input").attr("checked", false);
    }
  });
  $("#usericon").click(function () {
    location.href = APP_DOMAIN + "/settings";
  });
  placeholderFun();
  if (!tipsSupport()) {
    $(document).on(
      {
        mouseover: function () {
          var txt = $(this).attr("tip-val");
          if (txt == undefined || txt == "") {
            return false;
          }
          var left = $(this).offset().left;
          var width = $(this).outerWidth();
          var top = $(this).offset().top;
          var windowWidth = $(document).width();
          var right = windowWidth - left - width + width / 2;
          var html =
            '<div class="tip-box" style="max-width:620px;"><i></i><b></b><p>' +
            txt +
            "</p></div>";
          $(html).appendTo("body");
          var htmlHeight = $(".tip-box").outerHeight() + 10;
          var htmlWidth = $(".tip-box").outerWidth();
          var htmlLeft = left - htmlWidth / 2 + width / 2;

          if (htmlWidth / 2 > right) {
            $(".tip-box b").css({
              right: right - 15,
            });
            $(".tip-box").css({
              right: "8px",
              top: top - htmlHeight,
            });
          } else {
            $(".tip-box b").css({
              left: (htmlWidth - 18) / 2,
            });
            $(".tip-box").css({
              left: htmlLeft,
              top: top - htmlHeight,
            });
          }
        },
        mouseout: function () {
          $(".tip-box").remove();
        },
        click: function (e) {
          //		setTimeout(function () {
          if (!$(e.target).is(":visible")) {
            $(".tip-box").remove();
          }
          //		}, 500);
        },
        keyup: function (e) {
          if (e.keyCode == 13) {
            $(".tip-box").remove();
          }
        },
        keydown: function (e) {
          if (e.keyCode == 13) {
            $(".tip-box").remove();
          }
        },
      },
      "[tip-val]"
    );
  }
  function tipsSupport() {
    return "tip-val" in document;
  }

  // regular input value

  regularFun();
  function regularFun() {
    var oldVal = "";
    $(".pagination-num")
      .focus(function () {
        oldVal = $(this).val();
      })
      .blur(function () {
        var numInputValue = $(this).val();
        var numRegular = /^[0-9]*[1-9][0-9]*$/;
        if (!numRegular.test(numInputValue)) {
          $(this).val(oldVal);
        }
      });
  }

  //time select
  var clickTimeMouseStatus = true;
  $(document).on({
    mousedown: function (e) {
      if ($(e.target).is(".time-select input")) {
        clickTimeMouseStatus = true;
      } else {
        clickTimeMouseStatus = false;
      }
    },
    click: function (e) {
      if ($(e.target).is(".time-select-box ul li.abledSelect")) {
        e.stopPropagation();
        $(e.target)
          .parents(".time-select")
          .find("input")
          .val($(e.target).text());
        $(".time-select").removeClass("cur-time-select");
        $(".time-select-box").hide();
        if (
          typeof $("#createMeetingForm") != "undefined" &&
          typeof $("#createMeetingForm") != ""
        ) {
          MeetingTime.loadUserDateTime();
        }
      } else if ($(e.target).is(".time-select-box ul li.disabledSelect")) {
        return false;
      } else {
        if (!clickTimeMouseStatus) {
          $(".time-select-box").hide();
          $(".time-select").removeClass("cur-time-select");
        }
      }
    },
  });
  //clear time select box
  function clearTimeSelectBox() {
    $(".time-select").removeClass("cur-time-select");
    $(".time-select .time-select-box").hide();
  }
  // selectbox
  $(document).on("click", ".selectbox-and-input .ico-arr", function (e) {
    // click selectbox and show option
    e.stopPropagation();
    var selectbox = $(this).parents(".selectbox");
    if (
      selectbox.find(".s-hide-box").is(":visible") ||
      selectbox.find(".autoSearchBox").is(":visible")
    ) {
      selectbox.find(".s-hide-box").css("display", "none");
      selectbox.find(".autoSearchBox").css("display", "none");
      return false;
    }
    $(".autoSearchBox").hide();
    $(".s-hide-box").hide();
    $(".selectbox").removeClass("s-current");
    clearTimeSelectBox();
    $(this).parents(".selectbox").find(".s-hide-box").show();
    $(this).parents(".selectbox").addClass("s-current");
    var sInput = $(this).parents(".selectbox").find(".s-input-box");
    var sInputBoxHeight = sInput.outerHeight() + 1;
    var sInputBoxWidth = sInput.outerWidth() + 2;
    var sHideInput = $(this).parents(".selectbox").find(".s-hide-box");
    var sHideBoxHeight = sHideInput.outerHeight();
    $(".s-hide-box").css({
      top: sInputBoxHeight,
      "min-width": sInputBoxWidth,
    });
    $(".autoSearchBox").css({
      top: sInputBoxHeight,
      "min-width": sInputBoxWidth,
    });
    if (sHideBoxHeight >= 200) {
      if (sHideInput.outerWidth() > sInputBoxWidth + 2) {
        sHideInput.addClass("s-hide-box-border");
      }
    } else {
      sHideInput.find("span").css({
        "padding-right": "",
      });
      sHideInput.removeClass("s-hide-box-border");
    }
    if (!enptyShide($(this))) {
      return false;
    }
  });
  $(document).on("focus", ".selectbox-and-input input", function (e) {
    e.stopPropagation();
    var selectbox = $(this).closest(".selectbox");
    if (selectbox.find(".s-hide-box").is(":visible")) {
      return false;
    }
    $(".autoSearchBox").hide();
    $(".s-hide-box").hide();
    $(".selectbox").removeClass("s-current");
    clearTimeSelectBox();
    selectbox.find(".s-hide-box").show();
    selectbox.addClass("s-current");
    var sInput = selectbox.find(".s-input-box");
    var sInputBoxHeight = sInput.outerHeight() + 1;
    var sInputBoxWidth = sInput.outerWidth() + 2;
    var sHideInput = selectbox.find(".s-hide-box");
    var sHideBoxHeight = sHideInput.outerHeight();
    $(".s-hide-box").css({
      top: sInputBoxHeight,
      "min-width": sInputBoxWidth,
    });
    $(".autoSearchBox").css({
      top: sInputBoxHeight,
      "min-width": sInputBoxWidth,
    });
    if (sHideBoxHeight >= 200) {
      if (sHideInput.outerWidth() > sInputBoxWidth + 2) {
        sHideInput.addClass("s-hide-box-border");
      }
    } else {
      sHideInput.find("span").css({
        "padding-right": "",
      });
      sHideInput.removeClass("s-hide-box-border");
    }
    if (!enptyShide($(this))) {
      return false;
    }
  });
  // selectbox
  $(document).on("click", "div.s-input-box", function (e) {
    if ($(this).parent().hasClass("disabled")) {
      return;
    }
    e.stopPropagation();
    $(".repeatTime").removeClass("cur-time-select");
    $(".s-hide-box").hide();
    $(".autoSearchBox").hide();
    $(".selectbox").removeClass("s-current");
    clearTimeSelectBox();
    $(this).next(".s-hide-box").show();
    $(this).parents(".selectbox").addClass("s-current");
    var sInputBoxHeight = $(this).outerHeight() + 1;
    var sInputBoxWidth = $(this).outerWidth() - 2;
    var sHideBoxHeight = $(this).next(".s-hide-box").outerHeight();
    $(".s-hide-box").css({
      top: sInputBoxHeight,
      "min-width": sInputBoxWidth,
    });
    if (sHideBoxHeight >= 200) {
      if ($(this).next(".s-hide-box").outerWidth() > sInputBoxWidth + 2) {
        $(this).next(".s-hide-box").addClass("s-hide-box-border");
      }
    } else {
      $(this).next(".s-hide-box").find("span").css({
        "padding-right": "",
      });
      $(this).next(".s-hide-box").removeClass("s-hide-box-border");
    }
    if (!enptyShide($(this))) {
      return false;
    }
  });
  var ssearchSelectBox;
  var searchSelectBoxInputChars = "";
  var searchSelectBoxKeySetDown;
  $(document).on("mouseover", ".selectbox", function () {
    ssearchSelectBox = $(this);
    $(document).off("keydown", searchSelectKeydownEvent);
    if (
      $(this).find(".s-input-box").length > 0 &&
      $(this).find(".s-input-box")[0].tagName.toLocaleLowerCase() == "input"
    ) {
      return false;
    }
    $(document).on("keydown", searchSelectKeydownEvent);
  });
  $(document).on("mouseout", ".selectbox", function () {
    $(document).off("keydown", searchSelectKeydownEvent);
  });
  function searchSelectKeydownEvent(e) {
    if (ssearchSelectBox == undefined || ssearchSelectBox.length == 0) {
      return false;
    }
    var event = e || event || window.event;
    var keycode = event.keyCode || event.which || event.charCode;
    if (keycode == 17) {
      return false;
    }
    searchSelectBoxInputChars =
      searchSelectBoxInputChars + String.fromCharCode(keycode);
    searchSelectScrollTo(searchSelectBoxInputChars);
    clearTimeout(searchSelectBoxKeySetDown);
    searchSelectBoxKeySetDown = setTimeout(function () {
      if (searchSelectBoxInputChars != "") {
        searchSelectScrollTo(searchSelectBoxInputChars);
        clearTimeout(searchSelectBoxKeySetDown);
        searchSelectBoxInputChars = "";
      }
    }, 2000);
  }
  function searchSelectScrollTo(searchSelectBoxInputChars) {
    var found = 0,
      index = 0,
      scrollFlag = 0;
    var scrollBox = ssearchSelectBox.find(".s-hide-box");
    scrollBox.find("span").each(function (i) {
      if (found == 0) {
        var char = makePy($(this).html())[0];
        if (
          char.toLowerCase().startsWith(searchSelectBoxInputChars.toLowerCase())
        ) {
          index = $(this).index();
          found = 1;
          scrollFlag = 1;
        }
      }
    });
    if (scrollFlag == 0 || !scrollBox.is(":visible")) {
      return false;
    }
    scrollBox.scrollTo(scrollBox.find("span:eq(" + index + ")"), 400, {
      offset: -10,
    });
  }
  $(document).on("click", ".selectbox .ico-arr", function (e) {
    e.stopPropagation();
    var selectbox = $(this).parents(".selectbox");
    var inputBox = selectbox.find(".s-input-box");
    if (inputBox.is("div") && selectbox.find(".s-hide-box").is(":visible")) {
      selectbox.find(".s-hide-box").css("display", "none");
      return false;
    }
    $(this).parents(".selectbox").find("div.s-input-box").click();
    if (!enptyShide($(this))) {
      return false;
    }
  });
  $(document).on("click", ".page div.s-input-box", function (e) {
    var sHideBoxHeight = $(this).next(".s-hide-box").outerHeight();
    $(".s-hide-box").css({
      top: -(sHideBoxHeight + 1),
    });
  });
  $(document).on("click", ".page .selectbox .ico-arr", function (e) {
    e.stopPropagation();
    $(this).parents(".selectbox").find(".page div.s-input-box").click();
    if (!enptyShide($(this))) {
      return false;
    }
  });
  var mouseDownStatus = true;
  var autoMouseStatus = true;

  $(document).on({
    mousedown: function (e) {
      if (
        $(e.target).is(
          ".placeholder-txt, .s-input-box , .mCSB_dragger_bar , div.s-hide-box span , div.s-hide-box span s , .s-hide-box span b"
        )
      ) {
        mouseDownStatus = true;
      } else {
        mouseDownStatus = false;
      }
      if (
        $(e.target).is(
          ".placeholder-txt, .s-input-box , .mCSB_dragger_bar ,.autoSearchBox span"
        )
      ) {
        autoMouseStatus = true;
      } else {
        autoMouseStatus = false;
      }
    },
    click: function (e) {
      if (
        $(e.target).is(
          ".s-hide-box span , .s-hide-box span font font , .s-hide-box span label , .s-hide-box span s , .s-hide-box span b"
        )
      ) {
        var sItemHtml = $(e.target).html();
        var sItemValue =
          $(e.target)[0].tagName.toLowerCase() == "font"
            ? $(e.target).parents("span").attr("values")
            : $(e.target).attr("values");
        var sHideBox = $(e.target).parents(".selectbox").find(".s-input-box");
        if ($(e.target).parents(".contactCallPre").length > 0) {
          sItemValue = $(e.target).parent().attr("values");
          if (sItemValue == undefined || sItemValue == "") {
            sItemValue =
              $(e.target)[0].tagName.toLowerCase() == "font"
                ? $(e.target).parents("span").attr("values")
                : $(e.target).attr("values");
          }
          sItemHtml = sItemValue;
          var viewVal =
            $(e.target)[0].tagName.toLowerCase() == "font"
              ? $(e.target).parents("span").attr("viewval")
              : $(e.target).parent().attr("viewval");
          if (viewVal == undefined || viewVal == "") {
            viewVal = $(e.target).attr("viewval");
          }
          sHideBox.val(viewVal).end();
          $(e.target).parents(".s-hide-box").hide();
        } else {
          if (sHideBox[0].tagName == "DIV" || sHideBox[0].tagName == "div") {
            sHideBox.html(sItemHtml).end();
            sHideBox.attr({
              values: sItemValue,
              value: escapeHtml(sItemHtml),
            });
          } else {
            if (sHideBox.attr("id") == "proAccount") {
              ScheduleMeetingInput.setSelectProAccountFlag(true);
            }
            var viewVal = $(e.target).attr("viewval");
            var usefulVal = $(e.target).attr("usefulVal");
            if ($(e.target).is(".s-hide-box span label")) {
              viewVal = $(e.target).parents(".s-hide-box span").attr("viewVal");
              usefulVal = $(e.target)
                .parents(".s-hide-box span")
                .attr("usefulVal");
              sItemValue = $(e.target)
                .parents(".s-hide-box span")
                .attr("values");
            } else if ($(e.target)[0].tagName.toLowerCase() == "font") {
              viewVal = $(e.target).parents("span").attr("viewVal");
              usefulVal = $(e.target).parents("span").attr("usefulVal");
              sItemValue = $(e.target).parents("span").attr("values");
            }
            ie8PropertychangeFlag = true;
            sHideBox.attr("values", sItemValue);
            ie8PropertychangeFlag = true;
            sHideBox.attr("usefulVal", usefulVal);
            ie8PropertychangeFlag = true;
            sHideBox.val(viewVal);
            var placeholderTxt = sHideBox
              .parents(".placeholder-box")
              .find(".placeholder-txt");
            if (placeholderTxt != undefined) {
              placeholderTxt.hide();
            }
          }
          $(e.target).parents(".s-hide-box").hide();
        }
        var thisParSelectbox = $(e.target).parents(".selectbox");
        if (!thisParSelectbox.is(":visible")) {
          thisParSelectbox.removeClass("s-current");
        }
        if (
          $(e.target).parents(".call-tdsp").find(".call-last").hasClass("error")
        ) {
        } else {
          $(e.target).closest("td").find(".error-box").text("");
        }
        if ($(e.target).parents(".meeting-ampm-box").length > 0) {
          MeetingTime.loadUserDateTime();
        }
      } else if ($(e.target).is(".s-hide-box .no-selects")) {
        return false;
      } else {
        if (!mouseDownStatus) {
          $(".s-hide-box").hide();
          var thisParSelectbox = $(e.target).parents(".selectbox");
          if (thisParSelectbox.is(":visible")) {
            $(".selectbox").removeClass("s-current");
            thisParSelectbox.addClass("s-current");
          }
        }
      }

      if ($(e.target).is(".autoSearchBox span , .autoSearchBox span label")) {
        ie8PropertychangeFlag = true;
        var viewVal = $(e.target).attr("viewVal");
        var usefulVal = $(e.target).attr("usefulVal");
        var sItemValue = $(e.target).attr("values");
        if ($(e.target).is(".autoSearchBox span label")) {
          viewVal = $(e.target).parents(".autoSearchBox span").attr("viewVal");
          usefulVal = $(e.target)
            .parents(".autoSearchBox span")
            .attr("usefulVal");
          sItemValue = $(e.target)
            .parents(".autoSearchBox span")
            .attr("values");
        }
        var sInputBox = $(e.target).parents(".selectbox").find(".s-input-box");
        if (sInputBox.attr("id") == "proAccount") {
          ScheduleMeetingInput.setSelectProAccountFlag(true);
        }
        ie8PropertychangeFlag = true;
        sInputBox.attr("values", sItemValue);
        ie8PropertychangeFlag = true;
        sInputBox.attr("usefulVal", usefulVal);
        ie8PropertychangeFlag = true;
        sInputBox.val(viewVal);
        var thisParSelectbox = $(e.target).parents(".selectbox");
        if (!thisParSelectbox.is(":visible")) {
          thisParSelectbox.removeClass("s-current");
        }
        var placeholderTxt = sInputBox
          .parents(".placeholder-box")
          .find(".placeholder-txt");
        if (placeholderTxt != undefined) {
          placeholderTxt.hide();
        }
        $(".autoSearchBox").hide();
      } else {
        if (!autoMouseStatus) {
          $(".autoSearchBox").hide();
          var thisParSelectbox = $(e.target).parents(".selectbox");
          if (thisParSelectbox.is(":visible")) {
            $(".selectbox").removeClass("s-current");
            thisParSelectbox.addClass("s-current");
          }
        }
      }
    },
  });

  if ($(".textarea-main textarea").size() > 0) {
    countTextarea($(".textarea-main textarea"));
  }
  $("body").on(
    "keyup keydown input propertychange",
    ".textarea-main textarea",
    function (e) {
      var eDOM = $(e.target);
      countTextarea(eDOM);
    }
  );
});
function countTextarea(eDOM) {
  if ($.syncProcessSign) {
    return;
  }
  $.syncProcessSign = true;
  var countSize = eDOM.val().length;
  var maxSize = 500;
  var textAreaBox = eDOM.parents(".textarea-box");
  var textAreaCurent = textAreaBox.find(".textarea-count .current");
  if (textAreaBox.find('.textarea-count input[name="maxLength"]').length > 0) {
    maxSize = textAreaBox.find('.textarea-count input[name="maxLength"]').val();
  }
  textAreaCurent.text(countSize);
  if (countSize >= maxSize) {
    eDOM.attr("maxlength", maxSize);
    eDOM.val(eDOM.val().substring(0, maxSize));
  } else {
    eDOM.removeAttr("maxlength");
  }
  if (countSize > maxSize) {
    textAreaCurent.css({
      color: "#d83437",
    });
  } else {
    textAreaCurent.removeAttr("style");
  }
  $.syncProcessSign = false;
}
// meeting msg
function pageBtnDisabled(page, pageCount) {
  var page = page;
  var page_count = pageCount;
  if (page == page_count) {
    $(".meeting-msg .page-next").addClass("disabled");
    $(".meeting-msg .page-pre").removeClass("disabled");
  } else if (page == 1) {
    $(".meeting-msg .page-pre").addClass("disabled");
    $(".meeting-msg .page-next").removeClass("disabled");
  } else {
    $(".meeting-msg .page-pre , .meeting-msg.page-next").removeClass(
      "disabled"
    );
  }
}
function msgAutoPlay(val) {
  var len = $(".meeting-msg-main ul li").length;
  var index = val;
  var adTimer;
  $(".msg-page a").click(function () {
    if ($(this).hasClass("disabled") == true) {
      return;
    }
    index = parseInt($(".msg-page span b").text());
    if (index == len) {
      index = 0;
    }
    msgMove(index, len);
  });
  $(".meeting-msg")
    .hover(
      function () {
        clearInterval(adTimer);
      },
      function () {
        adTimer = setInterval(function () {
          msgMove(index, len);
          index++;
          if (index == len) {
            index = 0;
          }
        }, 1000);
      }
    )
    .trigger("mouseleave");
}
function msgMove(index, len) {
  var page = parseInt(index) + 1;
  var index = index;
  var pageCount = len;
  var width = $(".meeting-msg-main").width();
  if (pageCount == 1) {
    return;
  }
  $(".meeting-msg-main ul")
    .stop(true, false)
    .animate(
      {
        left: -width * index,
      },
      500
    );
  $(".meeting-msg-main .msg-page span b").text(page);
  var topTitleText = $(".meeting-msg li[index=" + page + "]")
    .find(".hd-title")
    .text();
  $(".meeting-msg .pop-title p").text(topTitleText);
  pageBtnDisabled(page, pageCount);
}
function alertMsg(msg) {
  // delete meeting pop box
  var alertHmtl =
    "<div class='pop-box message' id='alert-pop' style='display:block;'>" +
    "<div class='pop-title'><p>" +
    COMMON.TIP_REMINDER +
    "</p><b class='pop-close-ico-alert'></b></div>" +
    "<div class='pop-main'>" +
    "<div class='pop-tip-txt clearfix'><b class='ico-warn'></b><p class='tip-p' id='msg'>" +
    msg +
    "</p></div>" +
    "</div>";
  ("</div>");
  $(".pop-box").hide();
  $("body").append(alertHmtl);
  popMessagePosition();
  popMessageClsoeIco();
}
// close pop

function popMessageClsoeIco() {
  $(document).on("click", ".pop-close-ico-alert", function () {
    $(".message , .pop-bg").fadeOut(function () {
      $(this).remove();
    });
  });
}
// pop position

function popMessagePosition() {
  $('<div class="pop-bg"></div>').insertAfter(".wrap");
  var sTop = $("body").scrollTop();
  var pageWidth = $(document).width();
  var pageHidth = $(window).height();
  var popboxWidth = $(".message").width();
  var popboxHeight = $(".message").height();
  $(".message").css({
    "margin-top": -popboxHeight / 2,
    "margin-left": -popboxWidth / 2,
  });
  $(".pop-bg").css({
    width: pageWidth,
    height: pageHidth,
  });
}
//loading
(function ($, document, window) {
  var defaults = {
    content: "",
    loadingBgOpacity: "",
    type: "",
    appendto: "body",
  };
  $.fn.loading = function (option, callback) {
    var option = $.extend({}, defaults, option);
    var htmlInner = "<b class='loading-icon'></b>";
    if (option.content != "") {
      htmlInner =
        "<div class='content-text'>" +
        option.content +
        "</div> <div class='loading-icon-box'><b class='loading-icon'></b></div>";
    }
    if (option.type != "" && option.type == "html") {
      htmlInner = option.content;
    }
    var html =
      "<div class='loading-box loading-with-content-box'>" +
      htmlInner +
      "</div>";
    if (option.content == "") {
      html =
        "<div class='loading-box loading-no-content-box'>" +
        htmlInner +
        "</div>";
    }
    var appendTo = ".right-container";
    if (
      ($(".alert-box").length > 0 && $(".alert-box").is(":visible")) ||
      $(".right-container").length == 0 ||
      ($(".right-container").length > 0 &&
        !$(".right-container").is(":visible"))
    ) {
      appendTo = "body";
    }
    if (
      option.appendto &&
      $(option.appendto).length > 0 &&
      $(option.appendto).is(":visible")
    ) {
      appendTo = option.appendto;
    }
    $('<div class="loading-bg dn"></div>').appendTo("body").fadeIn();
    $(html).appendTo(appendTo).fadeIn();
    if (option.loadingBgOpacity) {
      $(".loading-bg").addClass("loading-bg-opacity");
    }
    var sTop = $("body").scrollTop();
    var pageWidth = $(document).width();
    var pageHidth = $(document).height();
    var boxHeight = $(".loading-box").height();
    var boxWidth = $(".loading-box").width();
    $(".loading-box").css({
      "margin-top": -boxHeight / 2,
      "margin-left": -boxWidth / 2,
    });
    $(".alert-bg").css({
      width: "100%",
      height: "100%",
    });
  };
})(jQuery, document, window);
function removeLoading() {
  $(".loading-box , .loading-bg").fadeOut(function () {
    $(".loading-box").remove();
    $(".loading-bg").remove();
  });
}

function removeLoadingNoAnim() {
  $(".loading-box").remove();
  $(".loading-bg").remove();
}
/* alert */
(function ($, document, window) {
  var toastTime;
  var defaults = {
    id: "",
    className: "",
    title: "",
    titleStyle: "",
    content: "",
    clickAlertBgNoClose: "",
    alertBgOpacity: "",
    alertBgClass: "",
    withoutClose: "",
    msgContent: "",
    msgContentClass: "",
    type: "none",
    icoType: "warn",
    btnStyle: "btn-blue",
    btnLeftVal: COMMON["TIP_OK"],
    btnRightVal: COMMON["TIP_CANCEL"],
    removeOldBox: true,
    btnOkClick: $.noop(),
    btnCancelClick: $.noop(),
    alertCloseClick: $.noop(),
  };
  $.fn.alertbox = function (option, callback) {
    var option = $.extend({}, defaults, option);
    var html,
      htmlInner,
      htmlBottom = "";
    htmlInner =
      '<div class="alert-content">' +
      '<div class="alert-tips clearfix">' +
      '<b class="ico-warn"></b>' +
      '<p class="alert-tips-txt">' +
      option.content +
      "</p>" +
      "</div>" +
      "</div>";
    if (option.type == "none") {
      if (option.icoType == "success") {
        htmlInner =
          '<div class="alert-content">' +
          '<div class="alert-tips clearfix">' +
          '<b class="ico-success"></b>' +
          '<p class="alert-tips-txt">' +
          option.content +
          "</p>" +
          "</div>" +
          "</div>";
      } else if (option.icoType == "none") {
        htmlInner =
          '<div class="alert-content">' +
          '<div class="alert-tips clearfix">' +
          '<p class="alert-tips-txt">' +
          option.content +
          "</p>" +
          "</div>" +
          "</div>";
      }
    } else if (option.type == "confirm") {
      htmlBottom =
        '<div class="alert-bottom"><span id="btn-alert-ok" class="' +
        option.btnStyle +
        '">' +
        option.btnLeftVal +
        '</span><span id="btn-alert-cancel" class="btn-white">' +
        option.btnRightVal +
        "</span></div>";
      htmlInner =
        '<div class="alert-content alert-mh clearfix">' +
        option.content +
        "</div>";
    } else if (option.type == "html") {
      htmlInner = option.content;
    }
    var alertClose = "alert-close";
    if (option.withoutClose) {
      alertClose = "";
    }

    if (option.title != "") {
      var alertTitleClass = "alert-title";
      if (option.titleStyle) {
        alertTitleClass = option.titleStyle;
      }
      html =
        '<div class="alert-box dn ' +
        option.className +
        '" id="' +
        option.id +
        '">' +
        '<div class="' +
        alertTitleClass +
        '"><p>' +
        option.title +
        '</p><b class="' +
        alertClose +
        '"></b></div>' +
        '<div class="alert-main">' +
        htmlInner +
        "</div>" +
        htmlBottom +
        "</div>";
    } else {
      html =
        '<div class="alert-box dn ' +
        option.className +
        '" id="' +
        option.id +
        '">' +
        '<div class="alert-main"><b class="' +
        alertClose +
        '"></b>' +
        htmlInner +
        "</div>" +
        htmlBottom +
        "</div>";
    }

    if (option.msgContent) {
      clearTimeout(toastTime);
      $(".msg-box").remove();
      html =
        '<div class="msg-box clearfix ' +
        option.msgContentClass +
        '"><b></b><p>' +
        option.msgContent +
        "</p></div>";
      $(html).appendTo("body").fadeIn();
      toastTime = setTimeout(function () {
        $(".msg-box").fadeOut(function () {
          $(this).remove();
        });
      }, 3000);
    } else {
      if (option.removeOldBox) {
        $(".alert-box").remove();
        $(".alert-bg").remove();
      }
      if (option.alertBgClass) {
        $('<div class="' + option.alertBgClass + ' dn"></div>')
          .appendTo("body")
          .fadeIn();
      } else {
        $('<div class="alert-bg dn"></div>').appendTo("body").fadeIn();
      }
      $(html).appendTo("body").fadeIn();
      placeholderFun();
    }
    var sTop = $("body").scrollTop();
    var pageWidth = $(document).width();
    var pageHidth = $(document).height();
    var boxHeight = $(".alert-box").height();
    var boxWidth = $(".alert-box").width();
    var msgBoxHeight = $(".msg-box").height();
    var msgBoxWidht = $(".msg-box").width();
    if ($(".alert-box").length > 1) {
      boxHeight = $(".alert-box").not(".keepOldAlert").height();
      boxWidth = $(".alert-box").not(".keepOldAlert").width();
      if (boxHeight == 0 || boxWidth == 0) {
        $(".alert-box").not(".keepOldAlert").css({
          "margin-top": -250,
          "margin-left": -340,
        });
      } else {
        $(".alert-box")
          .not(".keepOldAlert")
          .css({
            "margin-top": -boxHeight / 2,
            "margin-left": -boxWidth / 2,
          });
      }
    } else {
      if (boxHeight == 0 || boxWidth == 0) {
        $(".alert-box").css({
          "margin-top": -250,
          "margin-left": -340,
        });
      } else {
        $(".alert-box").css({
          "margin-top": -boxHeight / 2,
          "margin-left": -boxWidth / 2,
        });
      }
    }

    $(".msg-box").css({
      "margin-left": -msgBoxWidht / 2,
    });
    $(".alert-bg").css({
      width: "100%",
      height: "100%",
    });
    if (option.alertBgOpacity) {
      $(".alert-bg").addClass("alert-bg-opacity");
    }
    $("body").off(
      "click",
      ".alert-close , #btn-alert-cancel , .alert-bg",
      removeAlert
    );
    $("body").off("keydown", keydownEsc);
    if (!option.msgContent) {
      if (option.clickAlertBgNoClose) {
        $("body").on("click", ".alert-close , #btn-alert-cancel", removeAlert);
      } else {
        $("body").on(
          "click",
          ".alert-close , #btn-alert-cancel , .alert-bg",
          removeAlert
        );
        $("body").on("keydown", keydownEsc);
      }
    } else if ($(".alert-box").is(":visible")) {
      $("body").on(
        "click",
        ".alert-close , #btn-alert-cancel , .alert-bg",
        removeAlert
      );
    }
    function keydownEsc(e) {
      if (e.keyCode == "27") {
        e.preventDefault();
        removeAlert();
      }
    }
    if (option.btnOkClick) {
      $("body").off("click", "#btn-alert-ok");
      $("body").on("click", "#btn-alert-ok", function () {
        option.btnOkClick.apply(this);
      });
    } else {
      $("body").off("click", "#btn-alert-ok");
      $("body").on("click", "#btn-alert-ok", function () {
        removeAlert();
      });
    }

    if (option.btnCancelClick) {
      $("body").off("click", "#btn-alert-cancel");
      $("body").on("click", "#btn-alert-cancel", function () {
        option.btnCancelClick.apply(this);
      });
    } else {
      $("body").off("click", "#btn-alert-cancel");
      $("body").on("click", "#btn-alert-cancel", function () {
        removeAlert();
      });
    }

    if (option.alertCloseClick) {
      $("body").off("click", "#alert-close");
      $("body").on("click", "#alert-close", function () {
        option.alertCloseClick.apply(this);
      });
    } else {
      $("body").off("click", "#alert-close");
      $("body").on("click", "#alert-close", function () {
        removeAlert();
      });
    }
    if (callback) {
      callback();
    }
  };
})(jQuery, document, window);
function removeAlert() {
  if ($(".alert-box , .alert-bg").length > 2) {
    $(".alert-box , .alert-bg").each(function () {
      if ($(this).hasClass("keepOldAlert")) {
        $(this).show();
      } else {
        $(this).fadeOut(function () {
          $(this).remove();
        });
      }
    });
    setTimeout(function () {
      $(".alert-box , .alert-bg").removeClass("keepOldAlert");
    }, 500);
  } else {
    $(".alert-box , .alert-bg").fadeOut(function () {
      $(this).remove();
    });
  }
}
function popRemoveHtml() {
  $(".pop-box , .pop-bg").fadeOut(function () {
    $(this).remove();
  });
}
function popHideHtml() {
  $(".pop-box , .pop-bg").fadeOut();
}

function placeholderFun() {
  if (!placeholderSupport()) {
    $.each($("[placeholder]"), function () {
      if ($(this).parent().hasClass("placeholder-box")) {
        return;
      }
      $(this).wrap('<div class="placeholder-box"></div>');
    });
    $.each($("[placeholder]"), function (index) {
      if ($(this).parent().children().hasClass("placeholder-txt")) {
        return;
      }
      var placeholderValue = $(this).attr("placeholder");
      if ($(this).val() == "" || $(this).val() == $(this).attr("placeholder")) {
        $(
          '<div class="placeholder-txt">' + placeholderValue + "</div>"
        ).insertAfter(this);
      }
    });
    $(document).on("click", ".placeholder-box", function (event) {
      $(this).find("[placeholder]").focus();
      $(this).find(".placeholder-txt").remove();
    });
    $("[placeholder]")
      .focus(function () {
        $(this).parents(".placeholder-box").find(".placeholder-txt").hide();
        if ($(this).val() == $(this).attr("placeholder")) {
          var placeholderValue = $(this).attr("placeholder");
          $(
            '<div class="placeholder-txt">' + placeholderValue + "</div>"
          ).appendTo(".placeholder-box");
        }
      })
      .blur(function () {
        if (
          $(this).val() == "" ||
          $(this).val() == $(this).attr("placeholder")
        ) {
          var placeholderValue = $(this).attr("placeholder");
          $(
            '<div class="placeholder-txt">' + placeholderValue + "</div>"
          ).insertAfter($(this));
        }
      });
  }
}

function placeholderSupport() {
  if (
    navigator.userAgent.indexOf("MSIE 9.0") > 0 ||
    navigator.userAgent.indexOf("MSIE 8.0") > 0
  ) {
    return false;
  }
  return true;
}

function checkBrowser() {
  var ua = navigator.userAgent;
  if (/AppleWebKit\/(\S+)/.test(ua)) {
    if (/Chrome\/(\S+)/.test(ua)) {
      if (/OPR\/(\S+)/.test(ua)) {
        return "opera";
      }
      return "chrome";
    } else if (/Version\/(\S+)/.test(ua)) {
      return "safari";
    } else {
      return "safari";
    }
  } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
    return "konq";
  } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
    //determine if it's Firefox
    if (/Firefox\/(\S+)/.test(ua)) {
      return "firefox";
    }
  } else if (/Trident\/(\S+)/.test(ua)) {
    return "ie";
  } else if (/Edge\/(\S+)/.test(ua)) {
    return "Edge";
  }
  /*else if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE7.0")
     {
     return 'ie7';
     }
     else if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE8.0")
     {
     return 'ie8';
     }
     else if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE9.0")
     {
     return 'ie9';
     } */
}

function basicAjaxCall(options, successFun, errFun) {
  var httpUrl = options.url;
  if (checkBrowser() == "ie" || checkBrowser() == "Edge") {
    if (httpUrl.indexOf("?") != -1) {
      httpUrl = httpUrl + "&i=" + Math.random();
    } else {
      httpUrl = httpUrl + "?i=" + Math.random();
    }
  }
  $.ajax({
    url: httpUrl,
    type: options.type == undefined ? "POST" : options.type,
    async: options.async == undefined ? false : options.async,
    dataType: options.dataType == undefined ? "json" : options.dataType,
    cache: false,
    timeout: options.timeout == undefined ? 60000 : options.timeout,
    contentType:
      options.contentType == undefined
        ? "application/x-www-form-urlencoded"
        : options.contentType,
    beforeSend:
      options.before == undefined
        ? function () {
            if (
              typeof options.isShowLoad == "undefined" ||
              options.isShowLoad == true
            ) {
              var loadingAppendto =
                options.loadingAppendto == undefined
                  ? ""
                  : options.loadingAppendto;
              $(document).loading({
                loadingBgOpacity: "0",
                appendto: loadingAppendto,
              });
            }
          }
        : options.before,
    data: options.data == undefined ? {} : options.data,
    complete:
      options.complete == undefined
        ? function () {
            if (
              typeof options.isShowLoad == "undefined" ||
              options.isShowLoad == true
            ) {
              removeLoading();
            }
          }
        : options.complete,
    jsonp: options.complete == undefined ? "" : options.jsonp,
    jsonpCallback:
      options.jsonpCallback == undefined ? "" : options.jsonpCallback,
    success: function (result) {
      try {
        var jsonObject;
        if (typeof result != "object") {
          jsonObject = JSON.parse(result.replace(/&quot;/g, '"'));
        } else {
          jsonObject = result;
        }
        if (options.isShowError != false) {
          if (
            typeof jsonObject["retCode"] != "undefined" &&
            jsonObject["retCode"] != "0"
          ) {
            var errorMsg = jsonObject["errorMsg"];
            if (typeof errorMsg == "undefined" || errorMsg == "") {
              errorMsg = COMMON.NETWORK_BUSY;
            }
            $(document).alertbox({
              msgContent: errorMsg,
              msgContentClass: "warning",
            });
            return;
          }
        }
      } catch (e) {
        // TODO: handle exception
      }
      if (options.wEescape == true) {
        result = JSON.stringify(result);
        result = escapeJsonHtml(result);
        result = JSON.parse(result);
      }
      try {
        var object;
        if (options.wEescape == true) {
          object = result;
        } else {
          if (typeof result != "object") {
            object = JSON.parse(result);
          } else {
            object = result;
          }
        }
        var state = object["state"];
        if (typeof state != "undefined") {
          if (state == 4) {
            window.location = APP_DOMAIN + "/login";
            return;
          }
          if (state == 2) {
            if (!options.hasUserdefinedNoPermissionHandler) {
              $(document).alertbox({
                msgContent: COMMON.NO_PERMISSION,
                msgContentClass: "warning",
              });
              setTimeout(function () {
                window.location = HOME_DOMAIN;
              }, 3000);
              return;
            }
          }
        }
      } catch (e) {}
      if (successFun) {
        successFun(result);
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      if (XMLHttpRequest.responseText == "auth_no_login") {
        window.location = APP_DOMAIN + "/login";
        return;
      }
      if (
        typeof options.isShowLoad == "undefined" ||
        options.isShowLoad == true
      ) {
        removeLoading();
      }
      if (errFun) {
        errFun(XMLHttpRequest, textStatus, errorThrown);
      } else {
        $(document).alertbox({
          msgContent: COMMON.NETWORK_BUSY,
          msgContentClass: "warning",
        });
      }
    },
  });
}

var entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
  " ": "&nbsp;",
  "\n": "</br>",
};
function escapeJsonHtml(string) {
  return String(string).replace(/[&<>'\/]/g, function (s) {
    return entityMap[s];
  });
}
function escapeBlankHtml(string) {
  return String(string).replace(/[ ]/g, function (s) {
    return entityMap[s];
  });
}

function escapeHtml(string) {
  return String(string).replace(/[&<>'"\/]/g, function (s) {
    return entityMap[s];
  });
}
function escapeSpecialHtml(string) {
  return String(string).replace(/[ '"]/g, function (s) {
    return entityMap[s];
  });
}
function escapeQuotation(string) {
  return String(string).replace(/["']/g, function (s) {
    return entityMap[s];
  });
}
function escapeLineBreak(string) {
  return String(string).replace(/[\n]/g, function (s) {
    return entityMap[s];
  });
}
function ajaxFormSubmit(fromID, successFun, errFun, options) {
  $(fromID).ajaxSubmit({
    dataType: "json",
    beforeSubmit: function () {
      if (
        typeof options != "undefined" &&
        typeof options.isShowLoad != "undefined" &&
        options.isShowLoad == true
      ) {
        $(document).loading({
          loadingBgOpacity: "0",
        });
      }
    },
    complete: function () {
      if (
        typeof options != "undefined" &&
        typeof options.isShowLoad != "undefined" &&
        options.isShowLoad == true
      ) {
        removeLoading();
      }
    },
    success: function (result) {
      if (successFun) {
        successFun(result);
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      if (errFun) {
        errFun(XMLHttpRequest, textStatus);
      }
    },
  });
}
function ajaxObjFormSubmit(formObj, successFun, errFun, options) {
  formObj.ajaxSubmit({
    dataType: "json",
    beforeSubmit: function () {
      if (
        typeof options != "undefined" &&
        typeof options.isShowLoad != "undefined" &&
        options.isShowLoad == true
      ) {
        $(document).loading({
          loadingBgOpacity: "0",
        });
      }
    },
    complete: function () {
      if (
        typeof options != "undefined" &&
        typeof options.isShowLoad != "undefined" &&
        options.isShowLoad == true
      ) {
        removeLoading();
      }
    },
    success: function (result) {
      if (successFun) {
        successFun(result);
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      if (errFun) {
        errFun(XMLHttpRequest, textStatus);
      }
    },
  });
}
function bindPageClickMethod(searchFun) {
  $(".gotoNextPage").click(function (e) {
    nextPage();
  });
  $(".gotoPrePage").click(function (e) {
    prePage();
  });
  $(".gotoFirstPage").click(function (e) {
    if ($(this).hasClass("disabled")) {
      return false;
    }
    firstPage();
  });
  $(".gotoLastPage").click(function (e) {
    if ($(this).hasClass("disabled")) {
      return false;
    }
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
        $("#pageNum").val(parseInt($("#currentPageNum").val()));
      }
    }
  });
  $('span[name="pageSizes"]').click(function (e) {
    var pageSize = $(this).text();
    searchFun(1, pageSize);
  });
  function prePage() {
    var currentPageNum = parseInt($("#pageNum").val());
    if (currentPageNum <= 1) {
      return;
    }
    currentPageNum = currentPageNum - 1;
    searchFun(currentPageNum, "", "", "");
  }

  function nextPage() {
    var currentPageNum = parseInt($("#pageNum").val());
    var totalPageCount = parseInt($("#totalPageCount").text());
    if (currentPageNum >= totalPageCount) {
      return;
    }
    currentPageNum = currentPageNum + 1;
    searchFun(currentPageNum, "", "", "");
  }

  function firstPage() {
    searchFun(1, "", "", "");
  }

  function lastPage() {
    var totalPageCount = parseInt($("#totalPageCount").text());
    searchFun(totalPageCount, "", "", "");
  }
}
function afterPageClickMethod(page) {
  if (typeof page == "undefined") {
    return;
  }
  $("#pageSize").attr("values", page.pageSize);
  $("#pageNum").val(page.pageNum);
  $("#currentPageNum").val(page.pageNum);
  $("#orderDirection").val(page.orderDirection);
  $("#orderField").val(page.orderField);
  $("#totalPageCount").text(page.totalPageCount);
  if (page.pageNum == 1) {
    $(".gotoFirstPage, .gotoPrePage")
      .removeClass("enabled")
      .addClass("disabled");
  } else {
    $(".gotoFirstPage, .gotoPrePage")
      .removeClass("disabled")
      .addClass("enabled");
  }
  if (page.pageNum == page.totalPageCount) {
    $(".gotoNextPage, .gotoLastPage")
      .removeClass("enabled")
      .addClass("disabled");
  } else {
    $(".gotoNextPage, .gotoLastPage")
      .removeClass("disabled")
      .addClass("enabled");
  }
  if (page.orderDirection == "desc") {
    $('.package-management .sort[name="' + page.orderField + '"]')
      .removeClass("asc")
      .addClass("desc");
  } else {
    $('.package-management .sort[name="' + page.orderField + '"]')
      .removeClass("desc")
      .addClass("asc");
  }
}
function initLanguage() {
  
  $(".languageBox .ico-arr").click(function (e) {
    e.stopPropagation();
    var languageHide = $(this).parents(".languageBox").find(".languageHide");
    if (languageHide.is(":visible")) {
      languageHide.css("display", "none");
      return false;
    }
    $(".languageHide").show();
  });
  $(".languageBox").click(function (e) {
    e.stopPropagation();
    $(".languageHide").show();
  });
  $(document).click(function () {
    $(".languageHide").hide();
  });
  $(".languageHide span").click(function (e) {
    e.stopPropagation();
    $(".languageHide").hide();
    $(".languageCur").text($(this).text());
    var selLanguage = $(this).attr("case");
    basicAjaxCall(
      {
        url: APP_DOMAIN + "/language",
        data: {
          language: selLanguage,
        },
      },
      function (data) {
        if (0 == data["state"]) {
          window.location.reload();
        }
      }
    );
  });
}
function initSystemError() {
  $(".system-error").each(function () {
    if (
      $(this).parent().length &&
      $(this).parent()[0].nodeName.toLocaleLowerCase() == "button"
    ) {
      var width = $(this).parent().outerWidth();
      $(this).css("left", width + 10 + "px");
    }
  });
}
function initCopyYear() {
  var year = new Date().getFullYear();
  $(".copyright .year").html(year);
}
function markSearchWord(showValue, replaceValue) {
  replaceValue = String(replaceValue).replace(/[&<>\/"']/g, function (s) {
    return entityMap[s];
  });
  var index = -1;
  var showValueCp = "";
  if (showValue == undefined) {
    showValue = "";
  } else {
    showValue = showValue.toString();
  }
  if (replaceValue && replaceValue != "") {
    while (
      (index = showValue.toLowerCase().indexOf(replaceValue.toLowerCase())) !=
      -1
    ) {
      if (index == 0) {
        showValueCp =
          showValueCp +
          '<label class="font-orange">' +
          escapeBlankHtml(showValue.substring(0, replaceValue.length)) +
          "</label>";
        showValue = showValue.substring(replaceValue.length, showValue.length);
      } else {
        showValueCp =
          showValueCp +
          escapeBlankHtml(showValue.substring(0, index)) +
          '<label class="font-orange">' +
          escapeBlankHtml(
            showValue.substring(index, index + replaceValue.length)
          ) +
          "</label>";
        showValue = showValue.substring(
          index + replaceValue.length,
          showValue.length
        );
      }
    }
  }
  return showValueCp + escapeBlankHtml(showValue);
}
function highlight(s, classNames) {
  if (
    classNames == null ||
    classNames == undefined ||
    classNames == "" ||
    s.length == 0
  ) {
    return false;
  }
  var classNs = classNames.split(",");
  for (var i = 0; i < classNs.length; i++) {
    s = encode(s);
    var objs = document.getElementsByClassName(classNs[i]);
    for (var j = 0; j < objs.length; j++) {
      var obj = objs[j];
      var t = obj.innerHTML.replace(
        /<label\s+class=.?font-orange.?>([^<>]*)<\/label>/gi,
        "$1"
      );
      obj.innerHTML = t;
      loopSearch(s, obj);
      t = obj.innerHTML;
      var r = /{searchHL}(({(?!\/searchHL})|[^{])*){\/searchHL}/g;
      t = t.replace(r, "<label class='font-orange'>$1</label>");
      obj.innerHTML = t;
    }
  }
}
function encode(s) {
  return s
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/([\\\.\*\[\]\(\)\$\^\|\+\?\{\}\/])/g, "\\$1");
}
function decode(s) {
  return s
    .replace(/\\([\\\.\*\[\]\(\)\$\^\|\+\?\{\}\/])/g, "$1")
    .replace(/>/g, ">")
    .replace(/</g, "<")
    .replace(/&/g, "&");
}
function loopSearch(s, obj) {
  if (obj.nodeType == 3) {
    replace(s, obj);
    return;
  }
  for (var i = 0, c; (c = obj.childNodes[i]); i++) {
    if (!c.className || c.className != "font-orange") loopSearch(s, c);
  }
  return false;
}
function replace(s, dest) {
  var r = new RegExp(s, "g");
  var t = dest.nodeValue;
  if (t.match(r)) {
    t = t.replace(r, "{searchHL}" + decode(s) + "{/searchHL}");
    dest.nodeValue = t;
  }
  return false;
}
function replaceUndefined(value) {
  if (typeof value == "undefined") {
    return "";
  } else {
    return value;
  }
}

function replaceSearchWord(srcString, replaceValue) {
  if (srcString && replaceValue && srcString != "" && replaceValue != "") {
    patt = replaceValue.replace(
      /[\*|\?|\(|\)|\+|\.|\\|\||\^|\$|\[|\]|\{|\}]/g,
      function (match, index) {
        return "\\" + match;
      }
    );

    var reg = new RegExp(patt, "gi");
    var ok = srcString.replace(reg, function (match, index) {
      return (
        '<label class="font-orange">' + escapeBlankHtml(match) + "</label>"
      );
    });
    return ok;
  }
  return srcString;
}

function checkIsNull(value) {
  if (typeof value == "undefined" || value == "") {
    return true;
  } else {
    return false;
  }
}
function appendValue(valueOne, valueTwo, separator) {
  if (checkIsNull(valueOne) && checkIsNull(valueTwo)) {
    return "";
  }
  if (!checkIsNull(valueOne) && !checkIsNull(valueTwo)) {
    return valueOne + separator + valueTwo;
  }
  if (!checkIsNull(valueTwo)) {
    return valueTwo;
  }
  if (!checkIsNull(valueOne)) {
    return valueOne;
  }
}

function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}
function fileMaxShow(object, text, max) {
  if (text.length > max) {
    text.substring(0, max);
    return text.substring(0, max) + "...";
  }
  return text;
}
function capsLockCheck() {
  var capsLockState = "unknown";
  var methods = {
    init: function (options) {
      var settings = $.extend({}, options);
      var capsLockForcedUppercase =
        /MacPPC|MacIntel/.test(window.navigator.platform) === true;
      var helpers = {
        isCapslockOn: function (event) {
          var shiftOn = false;
          if (event.shiftKey) {
            shiftOn = event.shiftKey;
          } else if (event.modifiers) {
            shiftOn = !!(event.modifiers & 4);
          }
          var keyString = String.fromCharCode(event.which);
          if (keyString.toUpperCase() === keyString.toLowerCase()) {
          } else if (keyString.toUpperCase() === keyString) {
            if (capsLockForcedUppercase === true && shiftOn) {
            } else {
              capsLockState = !shiftOn;
            }
          } else if (keyString.toLowerCase() === keyString) {
            capsLockState = shiftOn;
          }
          return capsLockState;
        },
        isCapslockKey: function (event) {
          var keyCode = event.which;
          if (keyCode === 20) {
            if (capsLockState !== "unknown") {
              capsLockState = !capsLockState;
            }
          }
          return capsLockState;
        },
        hasStateChange: function (previousState, currentState) {
          if (previousState !== currentState) {
            $("body").trigger("capsChanged");

            if (currentState === true) {
              $("body").trigger("capsOn");
            } else if (currentState === false) {
              $("body").trigger("capsOff");
            } else if (currentState === "unknown") {
              $("body").trigger("capsUnknown");
            }
          }
        },
      };
      $("body").bind("keypress.capslockstate", function (event) {
        var previousState = capsLockState;
        capsLockState = helpers.isCapslockOn(event);
        helpers.hasStateChange(previousState, capsLockState);
      });
      $("body").bind("keydown.capslockstate", function (event) {
        var previousState = capsLockState;
        capsLockState = helpers.isCapslockKey(event);
        helpers.hasStateChange(previousState, capsLockState);
      });
      $(window).bind("focus.capslockstate", function () {
        var previousState = capsLockState;
        capsLockState = "unknown";
        helpers.hasStateChange(previousState, capsLockState);
      });
      helpers.hasStateChange(null, "unknown");
      return this.each(function () {});
    },
    state: function () {
      return capsLockState;
    },
    destroy: function () {
      return this.each(function () {
        $("body").unbind(".capslockstate");
        $(window).unbind(".capslockstate");
      });
    },
  };
  $.fn.capslockstate = function (method) {
    if (methods[method]) {
      return methods[method].apply(
        this,
        Array.prototype.slice.call(arguments, 1)
      );
    } else if (typeof method === "object" || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error("Method " + method + " does not exist on jQuery.capslockstate");
    }
  };
  (function () {
    document.msCapsLockWarningOff = true;
    $(window).bind("capsOff capsUnknown", function (event) {
      $(".capsWarning").hide();
    });
    $(".capsPwd").bind("focusout", function (event) {
      $(".capsWarning").hide();
    });
    $(".capsPwd").bind("focusin keyup", function (event) {
      if ($(window).capslockstate("state") === true) {
        $(this).nextUntil("capsWarning").show();
      }
    });
    $(window).capslockstate();
  })();
}
function assembleMac(mac) {
  if (mac == null) {
    return mac;
  }
  mac = mac.replace(/:/g, "").replace(/-/g, "");
  var macSp = mac.split("");
  var macRs;
  $.each(macSp, function (index, item) {
    if (index == 0) {
      macRs = item;
    } else if (index == 1) {
      macRs = macRs + item;
    } else if (index % 2 == 0) {
      macRs = macRs + ":" + item;
    } else {
      macRs = macRs + item;
    }
  });
  return macRs;
}
function selectedText() {
  var selectedText;
  if (window.getSelection) {
    selectedText = window.getSelection();
  } else if (document.selection) {
    selectedText = document.selection.createRange().text;
  }
  if (selectedText == undefined || selectedText == "") {
    return false;
  }
  return true;
}

//system tips animate
// systemTipsAnimate();
//system tips animate
function systemTipsAnimate() {
  var noticeInterval;
  $(document).on("click", ".system-tips-view", function (e) {
    e.stopPropagation();
    e.preventDefault();
    var currentAnimate = $(this).parents(".system-tips-main");
    var clickType = $(this).attr("clickType");
    var msgType = "1";
    if (clickType == "device") {
      msgType = "2";
    } else if (clickType == "plan") {
      msgType = "3";
    } else if (clickType == "record") {
      msgType = "4";
    }
    var options = {
      url: APP_DOMAIN + "/removesysinf",
      type: "GET",
      async: true,
      isShowLoad: false,
      wEescape: true,
      data: {
        msgType: msgType,
      },
    };
    basicAjaxCall(options, function (result) {
      if (clickType == "maintenance") {
        currentAnimate.remove();
        var next = currentAnimate.next();
        if (next == undefined || next.length == 0) {
          var childs = $("#system-tips").children();
          if (childs.length < 2) {
            clearInterval(noticeInterval);
          }
          next = childs.get(0);
        }
        $(next).addClass("current").removeClass("other");
        $(document).alertbox(
          {
            content: $("#maintenance-alert-box-hidden").html(),
            type: "html",
            title: SYS.MAINTENANCE_TIP_ALERT_TITLE,
          },
          function () {
            var time =
              "on " +
              $("#preserveday").val() +
              " at " +
              $("#preservetime").val();
            if (COMMON.LANGUAGE == "cn") {
              time = $("#preserveday").val() + " " + $("#preservetime").val();
            }
            $(".maintenance-alert-box .time").html(time);
            var d = new Date();
            var year = d.getFullYear();
            var month =
              d.getMonth() + 1 < 10
                ? "0" + (d.getMonth() + 1)
                : d.getMonth() + 1;
            var day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
            var signTime = year + "/" + month + "/" + day;
            $(".maintenance-alert-box .sign-date").text(signTime);
          }
        );
        if ($(".system-tips-main").length == 0) {
          $("#system-tips").css("display", "none");
          $(".iframe-container").css("top", "70px");
        }
      } else if (clickType == "device") {
        location.href = APP_DOMAIN + "/device/list?showType=-4";
      } else if (clickType == "plan") {
        location.href = APP_DOMAIN + "/package/list";
      } else if (clickType == "record") {
        location.href = APP_DOMAIN + "/record/list";
      }
    });
  });
  noticeInterval = setInterval(function () {
    var childs = $("#system-tips").children();
    if (childs.length < 2) {
      clearInterval(noticeInterval);
      return false;
    }
    $(".system-tips-main.current").animate(
      { marginLeft: "-11920px" },
      function () {
        var next = $(this).next();
        if (next == undefined || next.length == 0) {
          next = childs.get(0);
        }
        $(next).addClass("current").removeClass("other");
        if ($("#system-tips").children().length > 1) {
          $(this).removeClass("current").addClass("other");
        } else {
          clearInterval(noticeInterval);
        }
        $(".system-tips-main").css("margin-left", "1920px");
        $(".system-tips-main").animate({ marginLeft: "0" });
      }
    );
  }, 8000);
}
function guideToBuyWebPlan(preserveNews) {
  $(document).alertbox({
    className: "alert-box-guide",
    alertBgClass: "alert-bg-guide-plan",
    content: $("#guide-to-buy-web-plan").html(),
    type: "html",
    withoutClose: "yes",
    clickAlertBgNoClose: "yes",
  });
  $(".guide-to-buy-web-plan .btn-box a").attr("href", preserveNews);
  $(".alert-box-guide").removeClass("alert-box");
}
$(document).on("click", ".guide-to-buy-web-plan .close-btn", function (e) {
  e.preventDefault();
  var alertBox = $(this).closest(".alert-box-guide");
  alertBox.remove();
  $(".alert-bg-guide-plan").remove();
});
function getAllSystemTips() {
  $("#system-tips").empty();
  var options = {
    url: APP_DOMAIN + "/sysinf",
    type: "GET",
    async: true,
    isShowLoad: false,
  };

  basicAjaxCall(options, function (result) {
    if (result.retCode == "surampak") {
      var data = result.data;
      var innerHtml = "";
      var maintenanceClass = "";
      var firmwareClass = "";
      var planClass = "";
      var recordClass = "";
      if (data.preserveNews != undefined && data.preserveNews != "") {
        $("#guide-to-buy-web-plan .desc").text(
          $("#guide-to-buy-web-plan .desc")
            .attr("data-value")
            .replace(/{version}/, data.version)
        );
        guideToBuyWebPlan(data.preserveNews);
      }
      if (
        data.preserveday != "" &&
        data.preservetime != "" &&
        data.preserveday != undefined &&
        data.preservetime != undefined
      ) {
        maintenanceClass = "current";
        innerHtml =
          innerHtml +
          '<div class="system-tips-main maintenanceSysTip ' +
          maintenanceClass +
          '"><b class="icon"></b><span class="system-tips-text">' +
          SYS.MAINTENANCE_TIP_HEAD +
          data.preserveday +
          SYS.MAINTENANCE_TIP_MIDDLE +
          data.preservetime +
          SYS.MAINTENANCE_TIP_FOOT +
          '</span><span class="system-tips-view" clickType="maintenance">' +
          SYS.TIP_CHECKOUT +
          "</span></div>";
        $("#preserveday").val(data.preserveday + "");
        $("#preservetime").val(data.preservetime + "");
      } else if ($(".maintenanceSysTip").length > 0) {
        $(".maintenanceSysTip").remove();
      }
      if (data.lowVerCount != "" && data.lowVerCount != undefined) {
        if (maintenanceClass != "") {
          firmwareClass = "other";
        } else {
          firmwareClass = "current";
        }
        var text = SYS.FIRMWARE_TIP_FOOT_SINGLE;
        if (parseInt(data.lowVerCount) > 1) {
          text = SYS.FIRMWARE_TIP_FOOT_MANY;
        }
        innerHtml =
          innerHtml +
          '<div class="system-tips-main deviceSysTip ' +
          firmwareClass +
          '"><b class="icon"></b><span class="system-tips-text">' +
          SYS.FIRMWARE_TIP_HEAD +
          data.lowVerCount +
          text +
          '</span><span class="system-tips-view" clickType="device">' +
          SYS.TIP_CHECKOUT +
          "</span></div>";
      } else if ($(".deviceSysTip").length > 0) {
        $(".deviceSysTip").remove();
      }
      if (data.planCount != "" && data.planCount != undefined) {
        if (maintenanceClass != "" || firmwareClass != "") {
          planClass = "other";
        } else {
          planClass = "current";
        }
        var text = SYS.PLAN_TIP_FOOT_SINGLE;
        if (parseInt(data.planCount) > 1) {
          text = SYS.PLAN_TIP_FOOT_MANY;
        }
        innerHtml =
          innerHtml +
          '<div class="system-tips-main planSysTip ' +
          planClass +
          '"><b class="icon"></b><span class="system-tips-text">' +
          SYS.PLAN_TIP_HEAD +
          data.planCount +
          text +
          '</span><span class="system-tips-view" clickType="plan">' +
          SYS.TIP_CHECKOUT +
          "</span></div>";
      } else if ($(".planSysTip").length > 0) {
        $(".planSysTip").remove();
      }

      if (data.preservespace != "" && data.preservespace != undefined) {
        if (maintenanceClass != "" || firmwareClass != "" || planClass != "") {
          recordClass = "other";
        } else {
          recordClass = "current";
        }
        innerHtml =
          innerHtml +
          '<div class="system-tips-main recordSysTip ' +
          recordClass +
          '"><b class="icon"></b><span class="system-tips-text">' +
          SYS.RECORD_SPACE_FULL +
          '</span><span class="system-tips-view" clickType="record">' +
          SYS.TIP_CHECKOUT +
          "</span></div>";
      } else if ($(".recordSysTip").length > 0) {
        $(".recordSysTip").remove();
      }
      if (innerHtml != "") {
        $("#system-tips").css("display", "block");
        $("#system-tips").append(innerHtml);
        $(".iframe-container").css("top", "113px");
      }
    }
  });
}
function getWebPlanAuthority() {
  basicAjaxCall(
    {
      url: APP_DOMAIN + "/settings/show_pay_plan",
      type: "GET",
      async: true,
      isShowLoad: false,
    },
    function (result) {
      if (result.state == 0) {
        result.msg == 1
          ? $(".getWebPlanAuthority").show()
          : $(".getWebPlanAuthority").hide();
        $("#getWebPlanAuthority").attr("data-state", result.msg);
      }
    }
  );
}
function enterPress(e) {
  var e = e || window.event;
  if (e.keyCode == 13) {
    return false;
  }
}
