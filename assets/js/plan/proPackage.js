$(function() {
    var accountName = $("#accountName").val();
    get_status_payment(accountName);
    
    
    $(document).on('blur', '#buy-new-plan-num', function () {
        if(!checkBuyNewPlan($.trim($('#buy-new-plan-num').val()))){
            $('#buy-plan-num-error').addClass('error').show();
        }else{
            $('#buy-plan-num-error').removeClass('error').hide();
            changeFee(getPackageId(),null);
        }
    })
    $(document).on('click', '.buy-plan-num-box .first', function () {
        var val = parseInt($('#buy-new-plan-num').val());
        if(!checkBuyNewPlan($.trim($('#buy-new-plan-num').val()))){
            $('#buy-plan-num-error').addClass('error').show();
            if(val > 99){
                $('#buy-new-plan-num').val(99);
                changeFee(getPackageId(),null);
                $('#buy-plan-num-error').removeClass('error').hide();
            }
        }else{
            if(val > 1){
                $('#buy-new-plan-num').val(val-1);
                changeFee(getPackageId(),null);
                $('#buy-plan-num-error').removeClass('error').hide();
            }else{
                $('#buy-plan-num-error').addClass('error').show();
            }
        }
    })
    $(document).on('click', '.buy-plan-num-box .last', function () {
        var val = parseInt($('#buy-new-plan-num').val());
        if(!checkBuyNewPlan($.trim($('#buy-new-plan-num').val()))){
            $('#buy-plan-num-error').addClass('error').show();
            if(val < 1){
                $('#buy-new-plan-num').val(1);
                changeFee(getPackageId(),null);
                $('#buy-plan-num-error').removeClass('error').hide();
            }
        }else{
            if(val < 99){
                $('#buy-new-plan-num').val(val+1);
                changeFee(getPackageId(),null);
                $('#buy-plan-num-error').removeClass('error').hide();
            }else{
                $('#buy-plan-num-error').addClass('error').show();
            }
        }
    })
    $(document).on("input","#cSerNum",function (e) {
        $(".discount-error").html("");
        $(".discount-error").removeClass("error");
        $("#cSerNum").removeClass("error");
        $("#cSerNum").attr("discountEnable","false");
        if($.trim($("#cSerNum").val()) != ""){
            $(".use-discount-btn").removeClass('use-discount-disabled');
        }else{
            $(".use-discount-btn").addClass('use-discount-disabled');
        }
    });
    $(document).on("click",".use-discount-btn",function (e) {
        if($(this).hasClass('use-discount-disabled')){
            return false;
        }
        if($.trim($("#cSerNum").val()) != ""){
            $("#cSerNum").attr("discountEnable","true");
            changeFee(getPackageId(),null);
        }
    });
    $('.right-container .operation .search input').val("");
    bindSearchInputEvent();
    tipBox();
    searchProPackage(); 
    bindPageClickMethod(searchProPackage);
    $('.package-management .search-icon-box').click(function (e) {
        searchProPackage(1);
    });
    $('.package-management .package-search').keydown(function (e) {
        if (e.keyCode == 13) {
            searchProPackage(1);
        }
    });
    $('.package-management .sort').click(function (e) {
        var orderField = $(this).attr('name');
        $('#orderField').val(orderField);
        if($(this).hasClass('desc')){
            $('#orderDirection').val('asc');
        }else{
            $('#orderDirection').val('desc');
        }
        searchProPackage(1);
    });
    $('.package-management .left-nav li').click(function (e) {
        $(".package-list").show();
        $(".renew-upgrade-view").hide();
        $('.package-management .left-nav .active').removeClass('active');
        $(this).addClass('active');
        var type = $(this).attr('type');
        $('#type').val(type);
        searchProPackage(1);
        
    });

    $('.delete-icon').click(function (e) {
        $('#keyword').val('');
        searchProPackage(1);
    });
    $('body').on('click','.payPal-package .s-hide-box span',function (e) {
        $(".after-btn-tip-box").hide();
        $("input[name='os0']").val($(this).attr("values"));
        isPlusPackage($(this).hasClass("plus"));
    });
    $('body').on('click','.package-renew-alert .paypal-container b',function (e) {
        $("#package-renew-alert").submit();
        $(".after-btn-tip-box").show();
        $(".package-renew-alert").css("height","350px");
    });
    $('body').on('click','.package-upgrade-alert .paypal-container b',function (e) {
        $("#package-upgrade-alert").submit();
    });
    $(document).on("click","#cancelRelated",function () {
        $(".alert-close").click();
    })
    $(document).on("click", ".buy-web-plan, .buy-plan-now-btn .btn", function (e) {
        removeAlert();
        e.stopPropagation();
        basicAjaxCall({
            url: APP_DOMAIN + '/package/buy',
            async: true,
            type:"get",
            dataType: 'html'
        },function(data){
            $(".package-list").hide();
            $(".renew-upgrade-view").show();
            $(".renew-upgrade-view").html(data);
            $('.package-enabled').eq(0).click()
        });
    })
    $(document).on("click",".assign-plan-save",function () {
        if($(this).hasClass("btn-disabled")){
            return false;
        }
        var assignForm = $(this).closest(".assign-plan-container");
        var proAccount = assignForm.find(".assign-proAccount").val();
        var eAccount = assignForm.find(".user-list").attr("values");
        var userAccount = assignForm.find(".default-assign").attr('eaccount');
        var planName = assignForm.find('.plan-name').html();
        var assignUser = assignForm.find('.user-list').html();
        // $(".alert-close").click();
        $(document).alertbox({
            content: PKG.PLAN_ASSIGN_COMFIRM_CONTENT1+assignUser+PKG.PLAN_ASSIGN_COMFIRM_CONTENT2+planName+PKG.PLAN_ASSIGN_COMFIRM_CONTENT3,
            title: PKG.PLAN_ASSIGN_COMFIRM_TITLE,
            type: "confirm",
            btnOkClick: function () {
                var options = {
                    url:APP_DOMAIN + "/package/distribute",
                    type:'POST',
                    data:{
                        proAccount:proAccount,
                        eAccount:eAccount,
                        user:userAccount
                    }
                };
                basicAjaxCall(options, function(data){
                    $(".alert-close").click();
                    if(0 == data["state"]){
                        searchProPackage();
                    }else{
                        $(document).alertbox({
                            msgContent :data.msg,
                            msgContentClass: 'warning'
                        });
                    }
                });
            }
        });
    })
    $(document).on("click",".assign-plan-container .selectbox .s-hide-box span",function () {
        if($(this).attr("values") != ""){
            $(".assign-plan-container .assign-plan-save").removeClass("btn-disabled").addClass("btn-blue");
        }else{
            $(".assign-plan-container .assign-plan-save").removeClass("btn-blue").addClass("btn-disabled");
        }
    })
    $('body').on('click','.assign-plan',function (e) {
        $(".assign-plan-container .assign-plan-save").removeClass("btn-blue").addClass("btn-disabled");
        e.stopPropagation();
        var proAccount=$(this).parents('tr').find('.ipvtid-td').attr('values');
        if(proAccount == ""){
            return false;
        }
        basicAjaxCall({
            url: APP_DOMAIN + '/package/distribute',
            async: true,
            type:"get",
            dataType: 'json',
            data:{
                proAccount:proAccount
            }
        },function(result){
            if(result.state == "0"){
                $(document).alertbox({
                    content: $("#assignPlanContainer").html(),
                    type: 'html',
                    title: PKG.PLAN_ASSSIGN_BTN
                });
                if(result.data){
                    $(".assign-plan-container .assign-proAccount").val(proAccount);
                    var package = result.data.package;
                    var accounts = result.data.accounts;
                    $(".assign-plan-container .default-assign").html(escapeHtml(result.data.user)).attr('eaccount',result.data.eAccount);
                    if(package == undefined || accounts == undefined){
                        return false;
                    }
                    $(".assign-plan-container .plan-name").html(package.packageName);
                    $(".assign-plan-container .plan-time").html("("+package.packageStartTimeString+"--"+package.packageExpireTimeString+")");
                    $(".assign-plan-container .selectbox .s-hide-box").html("");
                    for(var i = 0; i<accounts.length; i++){
                        if(accounts[i].email){
                            $(".assign-plan-container .selectbox .s-hide-box").append("<span values='"+accounts[i].eAccount+"'>"+escapeHtml(accounts[i].comment)+"&nbsp;("+accounts[i].email+")</span>");
                        }else{
                            $(".assign-plan-container .selectbox .s-hide-box").append("<span values='"+accounts[i].eAccount+"'>"+escapeHtml(accounts[i].comment)+"&nbsp;("+accounts[i].eAccount+")</span>");
                        }
                    }
                }
            }else{
                $(document).alertbox({
                    msgContent: result.msg,
                    msgContentClass: 'warning'
                });
            }
        });
    })
    $(document).on("click", ".redeem-plan", function () {
        $('.redeem-error').hide().text('')
        $(document).alertbox({
            content: $("#redeemInputContainer").html(),
            type: 'html',
            clickAlertBgNoClose: true,
            title: PKG.INPUT_REDEEM_CODE
        });
    })

    $(document).on("click", ".renew-exist-package .s-hide-box span label", function (e) {
        e.stopPropagation()
        $(this).parent().click()
    })
    $(document).on("click", ".redeem-code-submit", function (e) {
        e.stopPropagation();
        var code1 = $(this).parents('.redeemInputForm').find('.redeem-input-1').val().trim()
        var code2 = $(this).parents('.redeemInputForm').find('.redeem-input-2').val().trim()
        var code3 = $(this).parents('.redeemInputForm').find('.redeem-input-3').val().trim()
        var redeemCode = code1 + code2 + code3
        if (redeemCode == '') {
            $('.redeem-error').show().text(PKG.REDEEM_CODE_EMPTY)
        } else if (redeemCode.length < 12) {
            $('.redeem-error').show().text(PKG.REDEEM_CODE_ERROR)
        } else {
            basicAjaxCall({
                url: APP_DOMAIN + '/package/redeem_code/info',
                async: true,
                type: "get",
                dataType: 'json',
                data: {
                    redeemCode: redeemCode
                }
            }, function (result) {
                if (result.state == "0") {
                    $(".alert-close").click();
                    $(document).alertbox({
                        content: $("#redeemPlanContainer").html(),
                        type: 'html',
                        clickAlertBgNoClose: true,
                        className: 'redeemAssignBox',
                        title: PKG.REDEEM_CODE_PLAN
                    });
                    $('.redeemAssignBox .redeem-code').text(result.entity.redeemCode).attr('value', result.entity.redeemCode)
                    $('.redeemAssignBox .btn-container a').attr('href', result.entity.ruleUrl)
                    var planNameStr = '<p>' + result.entity.mainPackageName +'</p>'
                    // if (result.entity.packageType == 0) {
                    //     planNameStr += '<p>' + PKG.PLAN_EXTEND_PACKAGE + '</p>'
                    // }
                    if (result.entity.addOnPackageNames) {
                        for (var i = 0; i < result.entity.addOnPackageNames.length; i++) {
                            var element = result.entity.addOnPackageNames[i];
                            planNameStr += '<p>' + element + '</p>'
                        }
                    }
                    $('.redeemAssignBox .plan-name').html(planNameStr)

                    var unitMonth = ''
                    if (parseInt(result.entity.duration) == 1) {
                        unitMonth = PKG.PAY_RENEW_UPGRADE_MONTH;
                    } else {
                        unitMonth = PKG.PAY_RENEW_UPGRADE_MONTHS;
                    }
                    $('.redeemAssignBox .plan-duration').text(result.entity.duration + ' ' + unitMonth)

                    $('.assign-redeem-code').attr('packageType', result.entity.packageType)
                    var packageArray = result.entity.proPackages
                    var accountArray = result.entity.accounts
                    if (result.entity.packageType == 0) {
                        $('.redeemAssignBox .gvc-tip').show()
                        $('.redeemAssignBox .gvc-plan').show()
                        if (packageArray.length == 0) {
                            if (result.entity.roomSystemNum == 0) {
                                var textStr = '<b></b>' + PKG.REDEEM_CODE_NO_GVC_1 + '<a href="/device/list">' + PKG.BIND_GVC + '</a>' + PKG.REDEEM_CODE_NO_GVC_2
                                $('.redeemAssignBox .gvc-plan .bind-gvc').html(textStr).show()
                            } else {
                                $('.redeemAssignBox .gvc-plan .upgrade-gvc').show()
                            }
                            $('.redeemAssignBox .gvc-plan .renew-exist-package .selectbox').hide()
                            $('.redeemAssignBox .gvc-plan .renewType').hide()
                            $('.redeemAssignBox .redeem-code-use').addClass('btn-disabled').removeClass('btn-blue')
                        } else {
                            var packageList = ''
                            for (var index = 0; index < packageArray.length; index++) {
                                var element = packageArray[index];
                                var currentRemark = ''
                                if (element.remark) {
                                    currentRemark = ', ' + element.remark
                                }
                                var currentExpiredTime = ''
                                var classStr = ''
                                if (element.state == 1) {
                                    currentExpiredTime = PKG.EXPIRED
                                    classStr = 'expired'
                                } else if(element.state == 6) {
                                    currentExpiredTime = PKG.PLAN_STATE_INVALID
                                    classStr = 'expired'
                                } else {
                                    currentExpiredTime = moment(element.packageExpireTime).format(getFormat())
                                }
                                packageList += '<span values="' + element.proAccount + '"><label class="currentRemark fl">' + element.packageName + '(' + element.proAccount + currentRemark + ')</label><label class="currentExpiredTime fr ' + classStr + '">' + currentExpiredTime + '</label></span>'
                            }
                            $('.redeemAssignBox .gvc-plan .s-hide-box').append(packageList)
                            $('.redeemAssignBox .gvc-plan .s-input-box').attr('values', packageArray[0].proAccount).html($('.redeemAssignBox .gvc-plan .s-hide-box').children().eq(0).clone())
                        }
                    } else {
                        $('.redeemAssignBox .web-tip').show()
                        $('.redeemAssignBox .web-plan').show()
                        if (packageArray.length == 0) {
                            $('.redeemAssignBox .web-plan .no_match').show()
                            $('.redeemAssignBox .codeDisabled').show()
                            $('.redeemAssignBox .web-plan .renew-exist-package .selectbox').hide()
                            $('.redeemAssignBox .web-plan .create-new-package .selectbox').removeClass('disabled')
                            $('.redeemAssignBox .web-plan .renew-exist-package .icons').addClass('icon-radio').removeClass('icon-radio-selected')
                            $('.redeemAssignBox .web-plan .create-new-package .icons').removeClass('icon-radio').addClass('icon-radio-selected')
                        } else {
                            $('.redeemAssignBox .codeDisabled').hide()
                            var packageList = ''
                            for (var index = 0; index < packageArray.length; index++) {
                                var element = packageArray[index];
                                var currentRemark = ''
                                if (element.remark) {
                                    currentRemark = ', ' + element.remark
                                }
                                var currentExpiredTime = ''
                                var classStr = ''
                                if (element.state == 1) {
                                    currentExpiredTime = PKG.EXPIRED
                                    classStr = 'expired'
                                } else if (element.state == 6) {
                                    currentExpiredTime = PKG.PLAN_STATE_INVALID
                                    classStr = 'expired'
                                } else {
                                    currentExpiredTime = moment(element.packageExpireTime).format(getFormat())
                                }
                                packageList += '<span values="' + element.proAccount + '"><label class="currentRemark fl">' + element.packageName + '(' + element.eAccount + currentRemark + ')</label><label class="currentExpiredTime fr ' + classStr + '">' + currentExpiredTime +'</label></span>'
                            }
                            $('.redeemAssignBox .web-plan .renew-exist-package .s-hide-box').append(packageList)
                            $('.redeemAssignBox .web-plan .renew-exist-package .s-input-box').attr('values', packageArray[0].proAccount).html($('.redeemAssignBox .web-plan .renew-exist-package .s-hide-box').children().eq(0).clone())
                        }
                        var accountList = ''
                        for (var index = 0; index < accountArray.length; index++) {
                            var element = accountArray[index];
                            accountList += '<span values="' + element.email + '">' + element.eAccount + '</span>'
                        }
                        $('.redeemAssignBox .web-plan .create-new-package .s-hide-box').append(accountList)
                        $('.redeemAssignBox .web-plan .create-new-package .s-input-box').attr('values', accountArray[0].email).text(accountArray[0].eAccount)
                    }
                    var boxHeight = $('.alert-box').height();
                    var boxWidth = $('.alert-box').width();
                    $('.alert-box').css({
                        'margin-top': -boxHeight / 2,
                        'margin-left': -boxWidth / 2
                    });
                } else {
                    $('.redeem-error').show().text(result.msg)
                }
            })
        }
    })
    $(document).on("input", ".redeemInputForm .redeem-input input", function (e) {
        // if (e.keyCode == 32) {
        // }
        // console.log(e.keyCode)
        // $(this).val().trim()
        $('.redeem-error').hide().text('')
        if ($(this).val().length == 4 && $(this).attr('data-index') < 2) {
            $(this).blur()
            $(this).parent().find('input').eq(parseInt($(this).attr('data-index')) + 1).focus()
        } else if ($(this).val().length == 0 && $(this).attr('data-index') > 0) {
            $(this).blur()
            $(this).parent().find('input').eq(parseInt($(this).attr('data-index')) - 1).focus()
        }
    })
    $(document).on("click", ".alert-box .renewType", function () {
        if ($(this).parent().hasClass('create-new-package')) {
            $('.web-plan .renew-exist-package .selectbox').addClass('disabled')
            $('.web-plan .create-new-package .selectbox').removeClass('disabled')
        } else {
            $('.web-plan .create-new-package .selectbox').addClass('disabled')
            $('.web-plan .renew-exist-package .selectbox').removeClass('disabled')
        }
        if ($(this).children('b').hasClass('icon-radio')) {
            var name = $(this).attr("name");
            if (name != undefined && name != null && name != "") {
                $('.redeemAssignBox .renewType').each(function () { 
                    var eRadio = $(this).attr("name");
                    if (eRadio != undefined && eRadio != null && eRadio != "" && eRadio == name) {
                        $(this).children('b').removeClass('icon-radio-selected').addClass('icon-radio');
                    }
                });
            }
            $(this).children('b').removeClass('icon-radio').addClass('icon-radio-selected');
        }
    })
    $(document).on("paste", ".alert-box .redeemInputForm .redeem-input input", function (e) {
        // console.log(e)
        var index = $(this).index()
        if (!(e.originalEvent.clipboardData && e.originalEvent.clipboardData.items)) {
            return
        }
        // console.log(e.originalEvent.clipboardData)
        for (var i = 0, len = e.originalEvent.clipboardData.items.length; i < len; i++) {
            var item = e.originalEvent.clipboardData.items[i]
            if (item.kind === 'string') {
                item.getAsString((str) => {
                    if (!str.startsWith('<')) {
                        console.log(str)
                        pasteMac(str, parseInt(index))
                    }
                })
            }
        }
    })
    function pasteMac (inputVal, index) {
        let tempVal = inputVal.trim().replace(new RegExp(' ', 'gm'), '-').replace(new RegExp('-', 'gm'), '-')
        if (tempVal == '') {
            return
        }
        if (tempVal.indexOf('-') < 0) {
            let tempArray = ''
            for (let i = 0; i < tempVal.length / 4; i++) {
                tempArray += tempVal.substring(i * 4, i * 4 + 4) + '-'
            }
            tempArray = tempArray.slice(0, tempArray.length - 1)
            if (tempArray !== '') {
                tempVal = tempArray
            }
        }
        let valArray = tempVal.split('-')
        let max = 3
        if (valArray.length < max) {
            max = valArray.length
        }
        for (let i = 0; i < valArray.length; i++) {
            $('.alert-box .redeemInputForm .redeem-input input').eq(i).val(valArray[i])
        }
    }
    $(document).on("click", ".redeem-code-cancel", function () {
        $(".alert-close").click();
    })
    $(document).on("click", ".redeem-code-use", function () {
        if ($(this).hasClass('btn-disabled')) {
            return
        }
        var params = {}
        var successTip = ''
        params.redeemCode = $('.redeemAssignBox .redeem-code').attr('value')
        if ($('.redeemAssignBox .assign-redeem-code').attr('packageType') == '0') {
            params.proAccount = $('.redeemAssignBox .gvc-plan .s-input-box').attr('values')
            successTip = '<div><i class="sucIcon"></i><span>' + PKG.REDEEM_SUCCESS + '</span></div><p>' + PKG.RENEW_SUCCESS_1 + $('.redeemAssignBox .gvc-plan .s-input-box .currentRemark').text() + PKG.RENEW_SUCCESS_2 +'</p>'
        } else {
            if ($('.redeemAssignBox .web-plan .icon-radio-selected').parents('.renew-exist-package').length > 0) {
                params.proAccount = $('.redeemAssignBox .web-plan .renew-exist-package .s-input-box').attr('values')
                successTip = '<div><i class="sucIcon"></i><span>' + PKG.REDEEM_SUCCESS + '</span></div><p>' + PKG.RENEW_SUCCESS_1 + $('.redeemAssignBox .web-plan .renew-exist-package .s-input-box .currentRemark').text() + PKG.RENEW_SUCCESS_2 + '</p>'
            } else {
                params.email = $('.redeemAssignBox .web-plan .create-new-package .s-input-box').attr('values')
                successTip = '<div><i class="sucIcon"></i><span>' + PKG.REDEEM_SUCCESS + '</span></div><p>' + PKG.ASSIGN_FOR_1 + $('.redeemAssignBox .web-plan .create-new-package .s-input-box').text() + PKG.ASSIGN_FOR_2 + '</p>'
            }
        }
        basicAjaxCall({
            url: APP_DOMAIN + '/package/redeem_code/use',
            async: true,
            type: "post",
            dataType: 'json',
            data: params
        }, function (result) {
            if (result.state == "0") {
                $(".alert-close").click();
                $(document).alertbox({
                    title: '',
                    content: successTip,
                    withoutClose: true,
                    clickAlertBgNoClose: true,
                    className: 'redeemSuccess',
                    type: 'confirm',
                    btnOkClick: function () {
                        $("#btn-alert-cancel").click();
                        searchProPackage()
                    }
                })
            } else {
                $(document).alertbox({
                    msgContent: PKG[result.msg],
                    msgContentClass: 'warning'
                });
            }
        })
        
    })
    //续费
    $('body').on('click','.renew',function (e) {
        e.stopPropagation();
        var renewMsg=$(this).parent().find('.renewDesc').val();
        if ($(this).hasClass('grey')) {
            // $(document).alertbox({
            //     msgContent: renewMsg,
            //     msgContentClass: 'warning'
            // });
            return false;
        }
        var proAccount=$(this).parents('tr').find('.ipvtid-td').attr('values');
        if(proAccount == ""){
            return false;
        }
        basicAjaxCall({
            url: APP_DOMAIN + '/package/renew',
            async: true,
            type:"get",
            dataType: 'html',
            data:{
                proAccount:proAccount
            }
        },function(data){
            $(".package-list").hide();
            $(".renew-upgrade-view").show();
            $(".renew-upgrade-view").html(data);
            initRenewUpgrade();
            initDateFormat();
        });
    });
    $('body').on('click','.package-management .upgrade',function (e) {
        e.stopPropagation();
        var upgradeMsg=$(this).parent().find('.upgradeDesc').val();
        if ($(this).hasClass('grey')) {
            // $(document).alertbox({
            //     msgContent: upgradeMsg,
            //     msgContentClass: 'warning'
            // });
            return false;
        }
        var proAccount=$(this).parents('tr').find('.ipvtid-td').attr('values');
        if(proAccount == ""){
            return false;
        }
        basicAjaxCall({
            url: APP_DOMAIN + '/package/upgrade',
            async: true,
            type:"get",
            dataType: 'html',
            data:{
                proAccount:proAccount
            }
        },function(data){
            $(".package-list").hide();
            $(".renew-upgrade-view").show();
            $(".renew-upgrade-view").html(data);
            initRenewUpgrade();
            initDateFormat();
        });
    });
    $("body").on("click",'.viewHistory',function (e) {
        e.stopPropagation();
        if(selectedText()){
            return false;
        }
        if ($(this).attr('data-id') == 'undefined') {
            return false;
        }
        var proAccount = $.trim($(this).find('td.ipvtid-td').attr("values"));
        $('.proAccount').val(proAccount);
        $('.accountName').val(accountName);
        $('.orderRecord').submit();
    });
    renewUpgradeEvent();
});
function isPlusPackage(isPlus){
    if(isPlus){
        $(".IPVideoTalkID-tr").hide();
        $(".email-tr").hide();
        $(".package-renew-alert .connection-box").show();
        $(".package-renew-alert").css("height","230px");
        $(".package-renew-alert .paypal-container").hide();
    }else{
        $(".IPVideoTalkID-tr").show();
        $(".email-tr").show();
        $(".package-renew-alert .connection-box").hide();
        $(".package-renew-alert").css("height","210px");
        $(".package-renew-alert .paypal-container").show();
    }
}
function initSelectPackage(packageType){
    var curpackage = $(".payPal-package .s-hide-box .small");
    if(packageType == "pro"){
        curpackage = $(".payPal-package .s-hide-box .pro");
    }else if(packageType == "plus"){
        curpackage = $(".payPal-package .s-hide-box .plus");
    }else if(packageType == "basic"){
        curpackage = $(".payPal-package .s-hide-box .basic");
    }
    $(".payPal-package .s-input-box").html(curpackage.html());
    $(".payPal-package .s-input-box").attr("values",curpackage.attr("values"));
    $("input[name='os0']").val(curpackage.attr("values"));
}
function packageDetail(packageId){
    basicAjaxCall({
        url : APP_DOMAIN + "/package/detail",
        data:{
            packageId:packageId
        }
    }, function(data) {
        if(data['state'] != 0){
            $(document).alertbox({
                msgContent: PKG.DATA_DEL,
                msgContentClass: 'warning'
            });
        }else{
//          window.open(APP_DOMAIN + "/package/detail?packageId=" + packageId,'_blank');
            window.open(HOME_DOMAIN + "/pricing.html",'_blank');
        }
    });
}

function searchProPackage(pageNum, pageSize, orderDirection, orderField) {
    var keyword = $.trim($('#keyword').val());
    if (pageSize == null || pageSize == ''
        || typeof (pageSize) == 'undefined') {
        pageSize = $('#pageSize').attr('values');
    }
    if (pageNum == null || pageNum == '' || typeof (pageNum) == 'undefined') {
        pageNum = $('#pageNum').val();
    }
    if (orderDirection == null || orderDirection == ''
        || typeof (orderDirection) == 'undefined') {
        orderDirection = $('#orderDirection').val();
    }
    if (orderField == null || orderField == ''
        || typeof (orderField) == 'undefined') {
        orderField = $('#orderField').val();
    }
    var totalPageCount = parseInt($('#totalPageCount').text());
    if (pageNum <= 0) {
        pageNum = 1;
        $('#pageNum').val(1);
    }
    if (pageNum > totalPageCount) {
        pageNum = totalPageCount;
        $('#pageNum').val(totalPageCount);
    }
    var options = {
            url: APP_DOMAIN + '/package/search',
            async: true,
            wEescape: true,
            data: {
                type: $('#type').val(),
                keyword: keyword,
                pageSize: pageSize,
                pageNum: pageNum,
                orderDirection: orderDirection,
                orderField: orderField
            }
    };
    basicAjaxCall(options, function (data) {
        renderSearchResult(data, keyword);
    });
}

function renderSearchResult(responseData, keyword) {
    if (typeof (responseData) == 'undefined') {
        return;
    }
    var state = responseData['retCode'];
    if (state == '0') {
        var dataList = $('#data-list');
        if (responseData['data']['page'] == 'undefined') {
            return;
        }
        var page = responseData['data']['page'];
        var proList = page.data;
        var htmlContext = '';
        if(proList.length > 0){
            $('.package-management .no-account').attr('style','display:none');
            $('.package-management .table-container tbody').attr('style','');
            $('.package-management .page').attr('style','');
        }else{
            $('.package-management .table-container tbody').attr('style','display:none');
            var type = $("#type").val();
            if(keyword != ""){
                $('.package-management .no-account').html(COMMON.SEARCH_1+'<a id="clearKeword" >'+COMMON.SEARCH_2+'</a>');
                clearKeyword();
            }else if(type == 1){
                $('.package-management .no-account').html(PKG.NODATA_TOEXPIRE);
            }else if(type == 2){
                $('.package-management .no-account').html(PKG.NODATA_EXPIRED);
            }else{
                var nodataTips = $('#mainAccount').val() == 0 ? ($('#is_oem').val() == 0 ? PKG.MAIN_NODATA_1 + PKG.MAIN_NODATA_2 : PKG.MAIN_NODATA_2) : PKG.NODATA
                $('.package-management .no-account').html('<div>' + nodataTips + '</div><div class="buy-plan-now-btn getWebPlanAuthority"><button class="btn btn-blue" type="button">' + PKG.BUY_PLAN_NOW_BTN + '</button></div>');
            }
            $('.package-management .no-account').attr('style','');
            $('.package-management .page').attr('style','display:none');
        }
        $.each(proList, function (index, pro) {
            var showRemarkName = replaceUndefined(pro.remark);
            var ownerShow = replaceUndefined(pro.email);
            var showOwnerTitle = ownerShow;
            if (keyword != null && keyword != '' && typeof (keyword) != 'undefined') {
                if (showRemarkName.indexOf(keyword) != - 1) {
                    showRemarkName = markSearchWord(showRemarkName,keyword);
                }
                if (ownerShow.indexOf(keyword) != - 1) {
                    ownerShow = markSearchWord(ownerShow,keyword);
                }
            }
            if(showRemarkName != ""){
                ownerShow = ownerShow+" ("+escapeSpecialHtml(showRemarkName)+")";
                showOwnerTitle = showOwnerTitle + "("+escapeSpecialHtml(showRemarkName)+")";
            }
            var addonStr = ''
            if (pro.addOnPlans) {
                $.each(pro.addOnPlans, function (itemIndex, item) {
                    addonStr += '<div class="font-size-12 color-999">' + PKG.ADD_ON_PACKAGE + item.packageName + '</div>'
                })
            }
            var type = $("#type").val();
            var singleHtml = '<tr class="viewHistory ' + (pro.packageId ? "" : "fixed") +'" data-id="' + pro.packageId + '"><td class="gotoDetail ipvtid-td" values="'+pro.proAccount+'"></td>';
            if (pro.packageId) {
                singleHtml += '<td class="gotoDetail package-td" values="' + pro.packageId + '"><span class="viewPackage">' + replaceUndefined(pro.packageName) + '</span>' + addonStr + '</td>';
            } else {
                singleHtml += '<td class="gotoDetail package-td" values="' + pro.packageId + '"><span class="viewPackage">--</span></td>';
            }
            if (ownerShow) {
                singleHtml += '<td class="devicename-td" title="' + showOwnerTitle + '">' + ownerShow + '</td>';
            } else {
                singleHtml += '<td class="devicename-td" title="' + pro.proAccount + '">' + pro.proAccount + '</td>';
            }
            if(pro.state == 2){
                singleHtml += '<td class="">--</td>';
                singleHtml += '<td class="">--</td><td>';
            }else{
                if (pro.showExpireTime) {
                    singleHtml += '<td class="">' + pro.showExpireTime + '</td>';
                } else {
                    singleHtml += '<td class="">--</td>';
                }
                if (pro.showOrderTime) {
                    singleHtml += '<td class="">' + replaceUndefined(pro.showOrderTime) + '</td><td>';
                } else {
                    singleHtml += '<td class="">--</td><td>';
                }
            }
            if(type == 2 || pro.state == 1){
                singleHtml += '<span class="time expired">'+PKG.EXPIRED+'</span>';
            }else if(type == 1 || pro.state == 999){
                singleHtml += '<span class="time expiring">'+PKG.TOEXPIRE+'</span>';
            }else if(pro.state == 2){
                singleHtml += '<span class="time">'+PKG.DEMO+'</span>';
            }else if(pro.state == 5){
                singleHtml += '<span class="time">'+PKG.ONTRIAL+'</span>';
            }else if(pro.state == 6){
                singleHtml += '<span class="time">'+PKG.PLAN_STATE_INVALID+'</span>';
            }else if(pro.state == 0){
                singleHtml += '<span class="time available">'+PKG.AVAILABLE+'</span>';
            } else if (pro.state == undefined) {
                singleHtml += '<span class="time available">--</span>';
            }
            if(pro.state != 6){
                // if (pro.state == 5) {
                //     singleHtml += '<div class="btn-container"><button tip-val="'+PKG.PLAN_TRAIL_RENEW_TIP+'" class="more-operation renew grey">'+PKG.RENEW+'</button>';
                // }else{
                    if (pro.isRenew) {
                        singleHtml += '<div class="btn-container"><button tip-val="'+pro.renewMsg+'" class="more-operation renew grey">'+PKG.RENEW+'</button>';
                    }else{
                        singleHtml += '<div class="btn-container"><button class="more-operation renew">'+PKG.RENEW+'</button>';
                    }
                // }
                if (pro.isUpgrade) {
                    singleHtml += '<button tip-val="'+pro.upgradeMsg+'" class="more-operation upgrade grey">'+PKG.UPGRADE+'</button>';
                }else{
                    singleHtml += '<button class="more-operation upgrade">'+PKG.UPGRADE+'</button>';
                }
                if (pro.packageType == "2" && $('#mainAccount').val() == 0) {
                    singleHtml += '<button class="more-operation assign-plan">'+PKG.PLAN_ASSSIGN_BTN+'</button>';
                }
                singleHtml += '<input type="hidden" value="'+pro.upgradeMsg+'" class="upgradeDesc" />';
                singleHtml += '<input type="hidden" value="'+pro.renewMsg+'" class="renewDesc" />';
                singleHtml += '<input type="hidden" value="'+pro.proAccount+'" class="curProAccount" /></div>';
            }else {
                singleHtml += '<div class="btn-container"><button class="more-operation renew">'+PKG.PLAN_BTN_REPURCHASE+'</button></div>';
                singleHtml += '<input type="hidden" value="'+pro.upgradeMsg+'" class="upgradeDesc" />';
                singleHtml += '<input type="hidden" value="'+pro.renewMsg+'" class="renewDesc" />';
                singleHtml += '<input type="hidden" value="'+pro.proAccount+'" class="curProAccount" /></div>';
            }
            singleHtml += '</td>';
            singleHtml += '</tr>';
            htmlContext += singleHtml;
        });
        $(dataList).empty();
        $(dataList).append(htmlContext);
        var total = responseData['data']['total'];
        var expired = responseData['data']['expired'];
        var toExp = responseData['data']['toExp'];
        $('#all-nav .num').text(total);
        $('#expiring-nav .num').text(toExp);
        $('#expired-nav .num').text(expired);

        afterPageClickMethod(page);
        $('.right-container .table-container').scrollTop(0);
        if($.trim($("#keyword").val()) != ""){
            $("#keyword").focus();
        }
    } else {
        $(document).alertbox({
            msgContent: PKG.SEARCH_FAIL,
            msgContentClass: 'warning'
        });
    }
}
function clearKeyword(){
      $('#clearKeword').click(function(){
        $('#keyword').val("");
          hideDeleteIcon($('#keyword'));
        searchProPackage();
      });
}
function renewUpgradeEvent(){
    $("body").on("click",".alsoRenew",function(e){
        if($(this).find(".selectedIcon").length > 0){
            return false;
        }
        if($(this).find("i").hasClass("icon-check-selected")){
            $(".select-duration-row,.renew-row").slideDown();
            if ($('.select-addon-gvc-row:visible .active').attr("values")) {
                $('.renew-addon-gvc-row').slideDown();
            }
            if ($('.select-addon-num.active').attr('values')) {
                $('.renew-addon-num-row').slideDown();
            }
            if ($('.select-addon-space.active').attr('values')) {
                $('.renew-addon-space-row').slideDown();
            }
            if ($('.select-addon-webinar.active').attr('values')) {
                $('.renew-addon-webinar-row').slideDown();
            }
            $("#selectedYear").val($(".select-duration-row .active").attr("values"));
            var packageId = '';
            if ($('#packageType').val() == '0') {
                packageId = $('.select-addon-gvc-row:visible .active').attr("values");
            } else {
                packageId = $(".select-packages .selected-package").attr("packageId");
            }
            $('#cSerNum').val('');
            $.when(changeFee(packageId,null)).done(function(data){
            });
        }else{
            $('#cSerNum').val('');
            $(".select-duration-row,.renew-row,.renew-addon-gvc-row,.renew-addon-num-row,.renew-addon-space-row,.renew-addon-webinar-row").slideUp();
            $("#selectedYear").val("0");
            cantPaybtn();
        }
    });
    $(document).on("click",".select-duration",function(){
        var isSelected = $(this).hasClass("active");
        $(".select-duration").removeClass("active");
        $(this).addClass("active");
        $("#selectedYear").val($(this).attr("values"));
        if ($(this).attr("values") < 12) {
            $('.select-packages .package .noDiscount').removeClass('undis')
            $('.select-packages .package .hasDiscount').addClass('undis')
        } else {
            $('.select-packages .package .noDiscount').addClass('undis')
            $('.select-packages .package .hasDiscount').removeClass('undis')
        }
        if(!isSelected){
            changeFee(getPackageId(),null);
        }
    });
    $(document).on("click", ".select-addon-gvc", function () {
        if ($(this).hasClass("addon-gvc-disabled")) {
            return
        }
        var isSelected = $(this).hasClass("active");
        $(this).parent().find('.select-addon-gvc').removeClass("active");
        $(this).addClass("active");
        if (!isSelected) {
            changeFee(getPackageId(), null);
        }
    });
    $(document).on("click", ".select-addon-num", function () {
        if ($(this).hasClass("addon-num-disabled")) {
            return
        }
        var isSelected = $(this).hasClass("active");
        $(".select-addon-num").removeClass("active");
        $(this).addClass("active");
        if (!isSelected) {
            changeFee(getPackageId(), null);
        }
    });
    $(document).on("click", ".select-addon-space", function () {
        if ($(this).hasClass("addon-space-disabled")) {
            return
        }
        var isSelected = $(this).hasClass("active");
        $(".select-addon-space").removeClass("active");
        $(this).addClass("active");
        if (!isSelected) {
            changeFee(getPackageId(), null);
        }
    });
    $(document).on("click", ".select-addon-webinar", function () {
        if ($(this).hasClass("addon-webinar-disabled")) {
            return
        }
        var isSelected = $(this).hasClass("active");
        $(".select-addon-webinar").removeClass("active");
        $(this).addClass("active");
        if (!isSelected) {
            changeFee(getPackageId(), null);
        }
    });
    $(document).on("click",".package-enabled",function(){
        var isSelected = $(this).hasClass("selected-package");
        $(".package-enabled").removeClass("selected-package");
        $(this).addClass("selected-package");
        $('.select-addon-gvc-row').hide()
        $('.select-addon-gvc-row').eq($(this).index()).show()
        $('.buy-new-plan-tr').show();
        if(!isSelected){
            changeFee(getPackageId(),null);
        }
    });
    $(document).on("click",".cancel-pay-btn",function(){
        $(".package-list").show();
        $(".renew-upgrade-view").hide();
    });
    $(document).on("click",".pay-btn",function(){
        if($(this).hasClass("btn-disabled")){
            return false;
        }
        // if(checkAddr() || checkAddrLength()){
        //     return false;
        // }
        var packageId = getPackageId();
        if(packageId == undefined || packageId == ""){
            $(document).alertbox({
                msgContent: PKG.PLAN_SELECT_PLAN,
                msgContentClass: 'warning'
            });
            return false;
        }
        if($('.buy-plan-num-box').is(':visible') && !checkBuyNewPlan($.trim($('#buy-new-plan-num').val()))){
            return false;
        }
        var accountName = $("#accountName").val();
        var proAccount = $("#proAccount").val();
        var duration = $("#selectedYear").val();
        var pajak = $("#tax-price").html();
        var newWindow = window.open(APP_DOMAIN + "/srm/payment/proses/" + accountName,'_blank');
        var cSerNum = "";
        if($.trim($("#cSerNum").val()) != "" && $("#cSerNum").attr("discountEnable") == "true" && !$(".discount-tr .disabled-edit-box").is(':visible') && $(".discount-tr").is(':visible')){
            cSerNum = $.trim($("#cSerNum").val());
        }
        var quality = "";
        if($("#proAccount").closest('form').hasClass('buyNewForm')){
            quality = $('#buy-new-plan-num').val();
        }
        var addOnParticipantPackageId = null
        var addOnSpacePackageId = null
        var addOnWebinarParticipantPackageId = null

        
        if ($('#addOnParticipantPackageId').length > 0) {
            addOnParticipantPackageId = $('#addOnParticipantPackageId').val()
            addOnSpacePackageId = $('#addOnSpacePackageId').val()
            addOnWebinarParticipantPackageId = $('#addOnWebinarParticipantPackageId').val()
        } else {
            addOnParticipantPackageId = $('.select-addon-num.active').attr('values')
            addOnSpacePackageId = $('.select-addon-space.active').attr('values')
            addOnWebinarParticipantPackageId = $('.select-addon-webinar.active').attr('values')
        }

        var id_transaksi = accountName+proAccount+packageId+duration+quality+Date.now();
        $.ajax({
            url: APP_DOMAIN + '/srm/payment/gateway',
            async: true,
            type:"post",
            dataType: 'json',
            data:{
                proAccount:proAccount,
                packageId:packageId,
                addOnParticipantPackageId: addOnParticipantPackageId ? addOnParticipantPackageId : null,
                addOnSpacePackageId: addOnSpacePackageId ? addOnSpacePackageId : null,
                addOnWebinarParticipantPackageId: addOnWebinarParticipantPackageId ? addOnWebinarParticipantPackageId : null,
                duration:duration,
                billingAddress:JSON.stringify(backAddr(null)),
                total: $('.payment-total-price').attr('values'),
                upgrade: $("#renewOrUpgrade").val() == 'upgrade' ? 0 : 1,
                cSerNum:cSerNum,
                baseurl: APP_DOMAIN,
                quality:quality,
                accountName:accountName,
                id_transaksi:id_transaksi,
                pajak:pajak
            },
            beforeSend: function () {
                $(document).loading({
                    loadingBgOpacity: "0",
                    appendto:""
                });
            },
            complete: function () {
                // removeLoading();
            },
            success: function (result) {
                try {
                    var object;
                    if ((typeof result) != 'object') {
                        object = JSON.parse(result);
                    } else {
                        object = result;
                    }
                    var state = object['state'];
                    var id_transaksi = object.entity.paymentId;

                    if (typeof (state) != 'undefined') {
                        if(state == 0){
                            
                            // removeLoading();
                            // $("#paymentId").val(paymentId);
                            // $(document).alertbox({
                            //     content: $("#payResultAlertContainer").html(),
                            //     type: "html",
                            //     clickAlertBgNoClose:"true",
                            //     withoutClose:"true",
                            //     className:"payResultAlert",
                            //     title: PKG.PAY_RESULT_ALERT_TITLE
                            // });
                            // var tempTimer = setTimeout(function () {
                            //     newWindow.location.href = object.entity.approvalUrl;
                            //     clearTimeout(tempTimer);
                            // }, 100)
                        }else if (state == 4) {
                            var tempTimer = setTimeout(function () {
                                newWindow.location.href = APP_DOMAIN + '/login';
                                clearTimeout(tempTimer);
                            }, 100)
                            window.location = APP_DOMAIN + '/login';
                            return;
                        } else if (state == 9) {
                            var y = setInterval(function(){
                                checkStatusPayment(id_transaksi,newWindow, y);
                            },5000);
                        } else {
                            $(document).alertbox({
                                msgContent: object.msg,
                                msgContentClass: 'warning'
                            });
                            if ($('#packageType').val() == '0') {
                                var packageId = $('.select-addon-gvc-row:visible .active').attr("values");
                            } else {
                                var packageId = $(".select-packages .selected-package").attr("packageId");
                            }
                            // var packageId = $(".select-packages .selected-package").attr("packageId");
                            if(packageId == undefined){
                            	packageId = "-1";
                            }
                            changeFee(packageId,null);
                            // newWindow.close();
                            newWindow = null;
                        }
                    }
                } catch (e) {
                    newWindow.close();
                    newWindow = null;
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (XMLHttpRequest.responseText == 'auth_no_login') {
                    window.location = APP_DOMAIN + '/login';
                    newWindow.location.href = APP_DOMAIN + '/login';
                    return;
                }
                $(document).alertbox({
                    msgContent: COMMON.NETWORK_BUSY,
                    msgContentClass: 'warning'
                });
                newWindow.close();
                newWindow = null;
            }
        });
    });
    $(document).on("click",".pay-result-btn",function(){
        var btnId = $(this).attr("id");
        var paymentId = $("#paymentId").val();
        basicAjaxCall({
            url: APP_DOMAIN + '/package/payment_detail',
            async: true,
            type:"get",
            dataType: 'json',
            data:{
                paymentId:paymentId
            }
        },function(result){
            var proAccount = $("#proAccount").val();
            if(result.state == "0"){
                if(btnId != "pay-result-success"){
                    localStorage.failedBtnSuccess = "yes";
                }
                if($.trim(proAccount) != ""){
                    location.href = APP_DOMAIN + "/package/history?proAccount="+proAccount;
                    // location.href = APP_DOMAIN + "srm/payment";
                }else{
                    location.href = APP_DOMAIN + "/package/list";
                }
            }else{
                $("#paymentId").val("");
                removeAlert();
                if(btnId == "pay-result-success"){
                    $(document).alertbox({
                        msgContent: PKG.PAY_RESULT_TOAST2,
                        msgContentClass: 'warning'
                    });
                } 
                var renewOrUpgrade = $("#renewOrUpgrade").val();
                var packageId = '';
                if (renewOrUpgrade == "renew") {
                    if ($("#packageId").attr('data-value') == '0') {
                        packageId = '';
                    } else {
                        packageId = $("#packageId").val();
                    }
                } else if (renewOrUpgrade == 'buy') {
                    packageId = $(".select-packages .selected-package").attr("packageId");
                } else {
                    if ($('#packageType').val() == '0') {
                        packageId = $('.select-addon-gvc-row:visible .active').attr("values");
                    } else {
                        packageId = $(".select-packages .selected-package").attr("packageId");
                    }
                }
                // var packageId = $(".select-packages .selected-package").attr("packageId");
                if($('#upgradeForm').hasClass('buyNewForm')){//购买web plan 时需传入选中的packageId
                    changeFee(packageId,null);
                }else{
                    $('#packageId').val() == -1 ? changeFee(-1,null) : changeFee(packageId,null)//续费和失效的套餐重新购买，packageId为-1
                }

            }
        });
    });
    $(document).on("blur",".pay-addr-form input",function(){
        if($(this).attr("id") != "streetAddr2"){
            if(!requiredInput($(this))){
                $(".pay-btn").removeClass("btn-blue").addClass("btn-disabled");
            } else{
                changeFee(getPackageId(),null);
            }
        }
    });
    $(document).on("focus",".pay-addr-form input",function(){
        removeErrorBoxText($(this));
    });
    $(document).on("focus","#stateAddr",function(){
        $(".pay-btn").removeClass("btn-blue").addClass("btn-disabled");
    });
    $(document).on("click",".pay-addr-desc .modify",function(){
        $(".pay-addr-desc").hide();
        $(".pay-addr-form").slideDown();
    });
    $(document).on("click",".state-select-input-box",function(){
        $(this).removeClass("error");
        var errorBox = $(this).closest("td").find(".error-box");
        errorBox.removeClass("error");
        errorBox.text("");
    });
    $(document).on("click",".country-select-box .s-hide-box span",function(){
        var curCountryId = $(this).parents(".selectbox").find(".s-input-box").attr("values");
        var clickCountryId = $(this).attr("values");
        $(".country-select-input-box").attr({
            'data-domain': $(this).attr("data-domain"),
            'data-content': $(this).attr("data-content")
        })
        if(curCountryId != clickCountryId){
            basicAjaxCall({
                url: APP_DOMAIN + '/province/'+clickCountryId,
                async: true,
                type:"get",
                isShowLoad: false,
                dataType: 'json'
            },function(result){
                if(result.state == "0"){
                    $("#stateAddr").val("");
                    $(".state-select-box .s-input-box").text("");
                    $(".state-select-box .s-input-box").attr("values","");
                    $("#stateAddr").removeClass("error");
                    var errorBox = $(".state-select-box").closest("td").find(".error-box");
                    errorBox.removeClass("error");
                    if(result.entity.length > 0){
                        errorBox.text("");
                        $("#stateAddr").hide();
                        $(".state-select-box").show();
                    }else{
                        $(".state-select-box").hide();
                        $("#stateAddr").show();
                        errorBox.text($("#stateAddr").attr("tip-data"));
                    }
                    $(".state-select-box .s-hide-box").html("");
                    $.each(result.entity,function(index,value){
                        $(".state-select-box .s-hide-box").append('<span data-content="'+value.provinceEn+'" data-domain="'+value.domain+'" values="'+value.id+'">'+value.provinceEn+'</span>');
                    });
                }
            });
        }
    });
    $(document).on("click",".state-select-box .s-hide-box span",function(){
        var stateId = $(this).parents(".selectbox").find(".s-input-box").attr("values");
        var clickStateId = $(this).attr("values");
        $(".state-select-input-box").attr({
            'data-domain': $(this).attr("data-domain"),
            'data-content': $(this).attr("data-content")
        });
        if(stateId != clickStateId){
            changeFee(getPackageId(),$(this));
        }
    });
}
function checkAddr(){
    var addrRequire = false;
    $.each($('.state-select-box, .country-select-box'),function () {
        var errorBox = $(this).closest("td").find(".error-box");
        var inputBox = $(this).find(".s-input-box");
        if($(this).hasClass('state-select-box') && $(this).is(":visible") && (inputBox.attr("values") == "" || inputBox.html() == "")){
            errorBox.text($(this).closest("td").find("#stateAddr").attr("charName")+PKG.BILL_ADRESS_NOT_EMPTY);
            errorBox.addClass("error");
            inputBox.addClass("error");
            addrRequire = true;
            return;
        }else if($(this).hasClass('country-select-box') && (inputBox.attr("values") == "" || inputBox.html() == "")){
            errorBox.text($(this).closest("td").attr("charName")+PKG.BILL_ADRESS_NOT_EMPTY);
            errorBox.addClass("error");
            inputBox.addClass("error");
            addrRequire = true;
            return;
        }else{
            errorBox.text("");
            errorBox.removeClass("error");
            inputBox.removeClass("error");
        }
    })
    $.each($(".pay-addr-form input"),function(index,value){
        if($(this).attr("id") != "streetAddr2"){
            if(!requiredInput($(value))){
                addrRequire = true;
            }
        }
    });
    return addrRequire;
}
function backAddr(stateInput){
    var billingAddress = new Object();
    billingAddress.country = $(".country-select-input-box").attr('data-content');
    billingAddress.countryId = $(".country-select-input-box").attr("values");
    billingAddress.countryDomain = $(".country-select-input-box").attr("data-domain");
    if($("#stateAddr").is(":visible")){
        billingAddress.province = $.trim($("#stateAddr").val());
        billingAddress.provinceId = "";
        billingAddress.provinceDomain = $.trim($("#stateAddr").val());
    }else{
        if(stateInput != null && stateInput != "" && typeof stateInput == "object"){
            billingAddress.province = stateInput.attr('data-content');
            billingAddress.provinceId = stateInput.attr("values");
            billingAddress.provinceDomain = stateInput.attr("data-domain");
        }else{
            billingAddress.province = $(".state-select-input-box").attr('data-content');
            billingAddress.provinceId = $(".state-select-input-box").attr("values");
            billingAddress.provinceDomain = $(".state-select-input-box").attr("data-domain")||$.trim($("#stateAddr").val());
        }
    }
    billingAddress.city = $.trim($("#cityAddr").val());
    billingAddress.address1 = $.trim($("#streetAddr1").val());
    billingAddress.address2 = $.trim($("#streetAddr2").val());
    billingAddress.postal = $.trim($("#addrPostal").val());
    return billingAddress;
}
function cantPaybtn() {
    var packageId = '';
    if ($('#packageType').val() == '0') {
        packageId = $('.select-addon-gvc-row:visible .active').attr("values");
    } else {
        packageId = $(".select-packages .selected-package").attr("packageId");
    }
    $.when(changeFee(packageId,null)).done(function(data){
        var proPackageState = $("#proPackageState").val();
        var renewOrUpgrade = $("#renewOrUpgrade").val();
        if(!data.feeError){
            if (renewOrUpgrade == "upgrade" && parseFloat(data.totalPrice) <= 0 && proPackageState == '1'){
                if($(".pay-btn").hasClass("btn-blue")){
                    $(".pay-btn").removeClass("btn-blue").addClass("btn-disabled");
                }
                $(document).alertbox({
                    msgContent: PKG.PAY_RENEW_DURATION_SELECT,
                    msgContentClass: 'warning'
                });
            }
        }
    });
}
function initRenewUpgrade(){
    var packageId = "";
    var renewOrUpgrade = $("#renewOrUpgrade").val();
    if (renewOrUpgrade == "upgrade"){
        var selectedPackage = $(".select-packages .package-enabled").eq(0);
        if(selectedPackage.length > 0){
            selectedPackage.addClass('selected-package');
            selectedPackage.click()
            $('.select-addon-gvc-enabled').eq(0).show()
            $(".renew-package").html(selectedPackage.find(".title").html());
        }
        packageId = $(".select-packages .selected-package").attr("packageId");
    } else if (renewOrUpgrade == "renew") {
        if ($("#packageId").attr('data-value') == '0') {
            packageId = '';
        } else {
            packageId = $("#packageId").val();
        }
    } else if (renewOrUpgrade == 'buy') {
        packageId = $(".select-packages .selected-package").attr("packageId");
    }
    if(getQueryString(window.location.href).sn){
        //$('#cSerNum').val(getQueryString(window.location.href).sn)
        $("#cSerNum").attr("discountEnable","true");
    }
    changeFee(packageId,null);
}
function getPackageId(){
    var packageId = "";
    var renewOrUpgrade = $("#renewOrUpgrade").val();
    if(renewOrUpgrade == "upgrade" || renewOrUpgrade == 'buy'){
        if ($('#packageType').val() == '0') {
            packageId = $('.select-addon-gvc-row:visible .active').attr("values");
        } else {
            packageId = $(".select-packages .selected-package").attr("packageId");
        }
    } else if (renewOrUpgrade == "renew") {
        if ($("#packageId").attr('data-value') == '0') {
            packageId = '';
        } else {
            packageId = $("#packageId").val();
        }
    }
    return packageId;
}
var sHourFormat = "12";
var sDateFormat = "MM/dd/yyyy";
function initDateFormat(){
    basicAjaxCall({
        url:APP_DOMAIN+"/settings/uformat",
        type: 'get',
        async: true,
        isShowLoad: false
    },function(result){
        sHourFormat = result.hour;
        sDateFormat = result.format;
    });
}
function getFormat(){
    var format = "MM/DD/YYYY";
    if(sDateFormat === "dd/MM/yyyy"){
        format = "DD/MM/YYYY";
    }else if(sDateFormat === "yyyy/MM/dd"){
        format = "YYYY/MM/DD";
    }
    return format;
}


function getQueryString(url) {
    var i = url.indexOf("?");
    var param = url.substring(i+1);
    var paramArray = param.split("&");
    var urlObject = {}
    for(var i = 0; i < paramArray.length; i++) {
        var urlItem = paramArray[i];
        var item = urlItem.split("=");
        urlObject[item[0]] = item[1];
    }
    return urlObject
}

function changeFee(packageId,selectState){
    var defer = $.Deferred();
    var totalPrice = 0;
    var feeError = false;
    var proAccount = $("#proAccount").val();
    var quality = "";
    if($("#proAccount").closest('form').hasClass('buyNewForm')){
        quality = $('#buy-new-plan-num').val();
    }
    var addOnParticipantPackageId = null
    var addOnSpacePackageId = null
    var addOnWebinarParticipantPackageId = null
    if ($('#addOnParticipantPackageId').length > 0) {
        addOnParticipantPackageId = $('#addOnParticipantPackageId').val()
        addOnSpacePackageId = $('#addOnSpacePackageId').val()
        addOnWebinarParticipantPackageId = $('#addOnWebinarParticipantPackageId').val()
    } else {
        addOnParticipantPackageId = $('.select-addon-num.active').attr('values')
        addOnSpacePackageId = $('.select-addon-space.active').attr('values')
        addOnWebinarParticipantPackageId = $('.select-addon-webinar.active').attr('values')
    }
    var duration = $("#selectedYear").val();
    var billingAddress = "";
    if(selectState != null && selectState != "null" && typeof selectState == "object"){
        billingAddress = JSON.stringify(backAddr(selectState));
    }else{
        billingAddress = JSON.stringify(backAddr(null));
    }
    var cSerNum = getQueryString(window.location.href).sn;
    if($.trim($("#cSerNum").val()) != "" && $("#cSerNum").attr("discountEnable") == "true" && !$(".discount-tr .disabled-edit-box").is(':visible') && $(".discount-tr").is(':visible')){
        cSerNum = $.trim($("#cSerNum").val());
    }
    if (packageId == undefined || packageId == "") {
        $(".pay-btn").removeClass("btn-blue").addClass("btn-disabled");
        $(document).alertbox({
            msgContent: PKG.PLAN_SELECT_PLAN,
            msgContentClass: 'warning'
        });
        return false;
    }
    if($('.buy-plan-num-box').is(':visible') && !checkBuyNewPlan($.trim($('#buy-new-plan-num').val()))){
        return false;
    }
    basicAjaxCall({
        url: APP_DOMAIN + '/package/fee',
        async: true,
        type:"get",
        dataType: 'json',
        data:{
            proAccount:proAccount,
            packageId:packageId,
            addOnParticipantPackageId: addOnParticipantPackageId ? addOnParticipantPackageId : null,
            addOnSpacePackageId: addOnSpacePackageId ? addOnSpacePackageId : null,
            addOnWebinarParticipantPackageId: addOnWebinarParticipantPackageId ? addOnWebinarParticipantPackageId : null,
            duration:duration,
            billingAddress:billingAddress,
            upgrade: $("#renewOrUpgrade").val() == 'upgrade' ? 0 : 1,
            cSerNum: cSerNum,
            quality: quality
        }
    },function(result){
        if(result.state == "0"){
            var addrError = false;
            $.each($('.pay-addr-form input'),function () {
                if($(this).hasClass('error')){
                    addrError = true;
                    return false;
                }
            })
            if(!addrError){
                $(".pay-btn").removeClass("btn-disabled").addClass("btn-blue");
            }else{
                $(".pay-btn").removeClass("btn-blue").addClass("btn-disabled");
            }
            var data = result.entity;
            if(data && data.isShow == "1"){
                $(".discount-tr").css("display","table-row");
                $(".discount-tr .disabled-edit-box").hide();
            }else{
                $(".discount-tr").css("display","none");
            }
            var renewOrUpgrade = $("#renewOrUpgrade").val();
            var upgradePackageName = $(".select-packages .selected-package .title p").html();
            if(renewOrUpgrade == "upgrade"){
                $(".upgrade-row .upgrade-package").html(upgradePackageName);
                $(".renew-package").html(upgradePackageName+PKG.PAY_RENEW_UPGRADE_COLON);
               var proPackageState = $.trim($("#proPackageState").val());
                if(proPackageState == "1"){
                    $(".upgrade-row .upgrade-package-period").html("(-----)");
                }else{
                    $(".upgrade-row .upgrade-package-period").html("("+moment(data.packageStarTime1).format(getFormat()) +"-"+moment(data.packageExpireTime1).format(getFormat())+")");
                }
                var tipVal = {};
                if(proPackageState == "2" || proPackageState == "5"){
                    var desc = data.differenceDesc1;
                    if(data.differenceDesc2){
                        tipVal.contTip1=PKG.DIFFER_FORMULA_TIP1;
                        tipVal.contTip2=PKG.DIFFER_FORMULA_TIP2.replace(/{Plus}/g,upgradePackageName).replace(/{Pro}/g,$('.cur-package').eq(0).text());
                        tipVal.contTip4=PKG.DIFFER_FORMULA_TIP3.replace(/{Plus}/g,upgradePackageName).replace(/{Pro}/g,$('.cur-package').eq(0).text());
                        tipVal.contTip5=PKG.DIFFER_FORMULA_TIP4.replace(/{Plus}/g,upgradePackageName).replace(/{Pro}/g,$('.cur-package').eq(0).text());
                        tipVal.contTip3=data.differenceDesc2;
                        data.differenceDesc2 && $(".upgrade-row2 .differ-formula-tip-icon").show();
                        $(".upgrade-row2 .differ-formula-tip-icon").attr("tip-vals",JSON.stringify(tipVal));
                    }
                    $(".upgrade-row .differ-formula").html(desc+PKG.PAY_RENEW_UPGRADE_COLON);
                }else{
                    tipVal.contTip1=PKG.DIFFER_FORMULA_TIP1;
                    tipVal.contTip2=PKG.DIFFER_FORMULA_TIP2.replace(/{Plus}/g,upgradePackageName).replace(/{Pro}/g,$('.cur-package').eq(0).text());
                    tipVal.contTip4=PKG.DIFFER_FORMULA_TIP3.replace(/{Plus}/g,upgradePackageName).replace(/{Pro}/g,$('.cur-package').eq(0).text());
                    tipVal.contTip5=PKG.DIFFER_FORMULA_TIP4.replace(/{Plus}/g,upgradePackageName).replace(/{Pro}/g,$('.cur-package').eq(0).text());
                    tipVal.contTip3=data.differenceDesc1;
                    data.differenceDesc1 && $(".differ-formula-tip-icon").show();
                    $(".differ-formula-tip-icon").attr("tip-vals",JSON.stringify(tipVal));
                    $(".upgrade-row .differ-formula").html(PKG.PAY_PRICE_DIFFERENTIAL+PKG.PAY_RENEW_UPGRADE_COLON);
                }
                if(data.discount != undefined && data.discount != ""){
                    $(".upgrade-row .differ-price").html('Rp '+addSuffix(data.difference1));
                }else{
                    $(".upgrade-row .differ-price").html("");
                }
                $(".upgrade-row .differ-price-discount").html('Rp '+addSuffix(data.newDifferecnce));
                if(data.packageStarTime2 != undefined && data.packageExpireTime2 != undefined && data.packageStarTime2 != "" && data.packageExpireTime2 != ""){
                    $(".upgrade-row2").css("display","table-row");
                    $(".upgrade-row .upgrade-package-period2").html("("+moment(data.packageStarTime2).format(getFormat()) +"-"+moment(data.packageExpireTime2).format(getFormat())+")");
                    $(".upgrade-row .differ-formula2").html(PKG.PAY_PRICE_DIFFERENTIAL+PKG.PAY_RENEW_UPGRADE_COLON);
                    $(".upgrade-row .differ-price2").html('Rp '+addSuffix(data.difference2));//已无差价2
                }else{
                    $(".upgrade-row2").css("display","none");
                }
                var currentPackageId = $('.current-main-plan').attr('data-id')
                var currentParticipantPackageId = $('.current-participant-plan').attr('data-id')
                var currentSpacePackageId = $('.current-space-plan').attr('data-id')
                var currentWebinarParticipantPackageId = $('.current-webinar-plan').attr('data-id')
                if (currentPackageId == packageId && currentParticipantPackageId == addOnParticipantPackageId && currentSpacePackageId == addOnSpacePackageId && currentWebinarParticipantPackageId == addOnWebinarParticipantPackageId) {
                    $(".pay-btn").removeClass("btn-blue").addClass("btn-disabled");
                } else {
                    $(".pay-btn").removeClass("btn-disabled").addClass("btn-blue");
                }
            }
            var addOnNumPrice = ''
            var addOnSpacePrice = ''
            var addOnWebinarNumPrice = ''
            if (renewOrUpgrade == "upgrade") {
                addOnNumPrice = data.addOnParticipantDifferencePrice
                addOnSpacePrice = data.addOnSpaceDifferencePrice
                addOnWebinarNumPrice = data.addOnWebinarParticipantDifferencePrice
            } else {
                addOnNumPrice = data.addOnParticipantRenewPrice
                addOnSpacePrice = data.addOnSpaceRenewPrice
                addOnWebinarNumPrice = data.addOnWebinarParticipantRenewPrice
            }
            if ($('#alsoRenew i').hasClass('icon-check-selected')) {
                if ($('.select-addon-gvc-row:visible .active').attr('values')) {
                    $('.renew-addon-gvc-row').css("display", "table-row");
                }
                if ($('.select-addon-num.active').attr('values')) {
                    $('.renew-addon-num-row').css("display", "table-row");
                }
                if ($('.select-addon-space.active').attr('values')) {
                    $('.renew-addon-space-row').css("display", "table-row");
                }
                if ($('.select-addon-webinar.active').attr('values')) {
                    $('.renew-addon-webinar-row').css("display", "table-row");
                }
            }
            if ($('#packageType').val() == 0 && data.addOnTotal != undefined) {
                $(".addon-gvc-row").css("display", "table-row");
                $('.addon-gvc-row .originalGvcName').text($('.select-addon-gvc-enabled').eq(0).find('.originalGvcName').attr('data-name'))
                $('.addon-gvc-package').text($('.select-addon-gvc-row:visible .active').attr('data-name'))
                if (proPackageState == "1") {
                    $(".upgrade-addon-gvc-package-period").html('(-----)')
                } else {
                    $(".upgrade-addon-gvc-package-period").html("(" + moment(data.packageStarTime1).format(getFormat()) + "-" + moment(data.packageExpireTime1).format(getFormat()) + ")");
                }
                $('.addon-gvc-price').text('Rp ' + addSuffix(data.addOnRoomSystemDifferent) )
                $('.renew-addon-gvc-price').text('Rp ' + addSuffix(data.addOnTotal) )
            } else {
                $(".addon-gvc-row").css("display", "none");
                $('.renew-addon-gvc-row').css("display", "none");
            }
            if (addOnParticipantPackageId) {
                $(".addon-num-row").css("display", "table-row");
                $('.addon-num-package').text($('.select-addon-num.active').attr('data-name'))
                if (proPackageState == "1") {
                    $(".upgrade-addon-num-package-period").html('(-----)')
                } else {
                    $(".upgrade-addon-num-package-period").html("(" + moment(data.packageStarTime1).format(getFormat()) + "-" + moment(data.packageExpireTime1).format(getFormat()) + ")");
                }
                $('.renew-addon-num-package-period').html("(" + moment(data.addOnRenewStartTime).format(getFormat()) + "-" + moment(data.addOnRenewEndTime).format(getFormat()) + ")");
                $('.addon-num-price').text('Rp ' + addSuffix(addOnNumPrice))
                $('.renew-addon-num-price').text('Rp ' + addSuffix(data.addOnParticipantRenewPrice))
            } else {
                $(".addon-num-row").css("display", "none");
                $('.renew-addon-num-row').css("display", "none");
            }
            if (addOnSpacePackageId) {
                $(".addon-space-row").css("display", "table-row");
                $('.addon-space-package').text($('.select-addon-space.active').attr('data-name'))
                if (proPackageState == "1") {
                    $(".upgrade-addon-space-package-period").html('(-----)')
                } else {
                    $(".upgrade-addon-space-package-period").html("(" + moment(data.packageStarTime1).format(getFormat()) + "-" + moment(data.packageExpireTime1).format(getFormat()) + ")");
                }
                $('.renew-addon-space-package-period').html("(" + moment(data.addOnRenewStartTime).format(getFormat()) + "-" + moment(data.addOnRenewEndTime).format(getFormat()) + ")");
                $('.addon-space-price').text('Rp ' + addSuffix(addOnSpacePrice))
                $('.renew-addon-space-price').text('Rp ' + addSuffix(data.addOnSpaceRenewPrice))
            } else {
                $(".addon-space-row").css("display", "none");
                $('.renew-addon-space-row').css("display", "none");
            }
            if (addOnWebinarParticipantPackageId) {
                $(".addon-webinar-row").css("display", "table-row");
                $('.addon-webinar-package').text($('.select-addon-webinar.active').attr('data-name'))
                if (proPackageState == "1") {
                    $(".upgrade-addon-webinar-package-period").html('(-----)')
                } else {
                    $(".upgrade-addon-webinar-package-period").html("(" + moment(data.packageStarTime1).format(getFormat()) + "-" + moment(data.packageExpireTime1).format(getFormat()) + ")");
                }
                $('.renew-addon-webinar-package-period').html("(" + moment(data.addOnRenewStartTime).format(getFormat()) + "-" + moment(data.addOnRenewEndTime).format(getFormat()) + ")");
                $('.addon-webinar-price').text('Rp ' + addSuffix(addOnWebinarNumPrice))
                $('.renew-addon-webinar-price').text('Rp ' + addSuffix(data.addOnWebinarParticipantRenewPrice))
            } else {
                $(".addon-webinar-row").css("display", "none");
                $('.renew-addon-webinar-row').css("display", "none");
            }
            var renewyear = $(".select-duration-row .active").attr("values");
            var unitYear = PKG.PAY_RENEW_UPGRADE_YEAR;
            if(parseInt(renewyear) == 1){
                unitYear = PKG.PAY_RENEW_UPGRADE_MONTH;
            } else if (parseInt(renewyear) < 12) {
                unitYear = PKG.PAY_RENEW_UPGRADE_MONTHS;
            } else if (parseInt(renewyear) == 12) {
                unitYear = PKG.PAY_RENEW_UPGRADE_YEAR;
                renewyear = renewyear/12
            } else {
                unitYear = PKG.PAY_RENEW_UPGRADE_YEARS;
                renewyear = renewyear / 12
            }
            $(".renew-row .renew-package").html(upgradePackageName);
            $(".renew-package-year").html(PKG.PAY_RENEW_UPGRADE_COLON + renewyear+" "+unitYear);
            $(".renew-package-period").html("("+moment(data.renewStartTime).format(getFormat()) +"-"+moment(data.renewEndTime).format(getFormat())+")");
            if(data.discount != undefined && data.discount != ""){
                $(".renew-row .renew-price").html('Rp '+addSuffix(data.fee));
            }else{
                $(".renew-row .renew-price").html("");
            }
            $(".renew-row .renew-price-discount").html('Rp '+addSuffix(data.newFee));
            $(".tax-price").html('Rp '+addSuffix(data.tax));
            $(".payment-total-price").html('Rp '+addSuffix(data.newTotal));
            totalPrice = data.total;
            $(".payment-total-price").attr('values',data.newTotal);
            if(parseFloat(data.newTotal) <= 0 && $(".pay-btn").hasClass("btn-blue")){
                $(".pay-btn").removeClass("btn-blue").addClass("btn-disabled");
            }
            $('#cSerNum').val(data.cSerNum);
            if(result.msg != ""){
                $(".discount-error").html(result.msg);
                $(".discount-error").addClass("error");
                $("#cSerNum").addClass("error");
            }else if(data.discount != undefined && data.discount != ""){
                // $(".discount").html(data.discount);
                $(".discount-error").html(PKG.PLAN_DISCOUNT1+data.discount+PKG.PLAN_DISCOUNT2);
                $(".discount-error").removeClass("error");
                $("#cSerNum").removeClass("error");
            }else{
                // $(".discount").html("");
                $(".discount-error").html("");
                $(".discount-error").removeClass("error");
                $("#cSerNum").removeClass("error");
            }
        }else{
            $(document).alertbox({
                msgContent: result.msg,
                msgContentClass: 'warning'
            });
            $(".renew-package-year").html('');
            $(".renew-package-period").html('');
            $(".renew-row .renew-price").html("");
            $(".renew-row .renew-price-discount").html("Rp 0.00");
            $(".tax-price").html("Rp 0.00");
            $(".payment-total-price").html("Rp 0.00");
            $(".upgrade-row .differ-formula").html(PKG.PAY_PRICE_DIFFERENTIAL+PKG.PAY_RENEW_UPGRADE_COLON);
            $(".differ-formula-tip-icon").hide();
            $(".upgrade-row .differ-price").html("");
            $(".upgrade-row .differ-price-discount").html("Rp 0.00");
            if($(".pay-btn").hasClass("btn-blue")){
                $(".pay-btn").removeClass("btn-blue").addClass("btn-disabled");
            }
            feeError = true;
        }
        var object = new Object();
        object.totalPrice = totalPrice;
        object.feeError = feeError;
        defer.resolve(object);
    });
    return defer.promise();
}
function requiredInput(input){
    if(!input.is(":visible")){
        return true;
    }
    var value = $.trim(input.val());
    var errorBox = input.closest("td").find(".error-box");
    if(value.length > 0){
        input.removeClass("error");
        var tip = $.trim(input.attr("tip-data"));
        errorBox.text(tip);
        errorBox.removeClass("error");
        return true;
    }else{
        errorBox.addClass("error");
        var errorTip = input.attr("charName");
        errorBox.text(errorTip+PKG.BILL_ADRESS_NOT_EMPTY);
        input.addClass("error");
    }
    return false;
}

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
$(function() {
    $(document).on("click", ".payment-history", function (e) {
        var namaAkun = Base64.encode($("#accountName").val());
        var f = document.getElementById('TheForm');
          f.accountName.value = namaAkun;
          window.open('', 'TheWindow');
          f.submit();
    });
});

function checkAddrLength(){
    var streetAddr1 = checkLength($("#streetAddr1"),60,PKG.BILL_ADRESS_STREET1_LENGTH);
    var streetAddr2 = checkLength($("#streetAddr2"),60,PKG.BILL_ADRESS_STREET2_LENGTH);
    var cityAddr = checkLength($("#cityAddr"),60,PKG.BILL_ADRESS_CITY_LENGTH);
    var stateAddr = true;
    if($("#stateAddr").is(":visible")){
        stateAddr = checkLength($("#stateAddr"),60,PKG.BILL_ADRESS_STATE_LENGTH);
    }
    var addrPostal = checkLength($("#addrPostal"),60,PKG.BILL_ADRESS_POST_LENGTH);
    if(streetAddr1 && streetAddr2 && cityAddr && stateAddr && addrPostal){
        return false;
    }
    return true;
}
function checkLength(input,length,errorTip){
    var value = $.trim(input.val());
    var errorBox = input.closest("td").find(".error-box");
    if(value.length > length){
        errorBox.addClass("error");
        errorBox.text(errorTip);
        input.addClass("error");
        return false;
    }else{
        input.removeClass("error");
        var tip = $.trim(input.attr("tip-data"));
        errorBox.text(tip);
        errorBox.removeClass("error");
        return true;
    }
    return false;
}
function removeErrorBoxText(input){
    var errorBox = input.closest("td").find(".error-box");
    var tip = $.trim(input.attr("tip-data"));
    errorBox.text(tip);
    errorBox.removeClass("error");
}
function tipBox(){
    $(document).on({
        mouseover: function () {
            if($(this).attr('tip-vals') == undefined || $(this).attr('tip-vals') == ""){
                return false;
            }
            var left = $(this).offset().left;
            var width = $(this).outerWidth();
            var top = $(this).offset().top;
            console.log(left)
            var html = ''
            if ($(this).hasClass('select-addon-gvc')) {
                var price = $(this).attr('data-price')
                var duration = $(this).attr('data-duration')
                var storageSpace = $(this).attr('data-storageSpace')
                html = '<div class="popover-box"><i class="bottom-arrow"></i><div class="price"><span class="value">$' + price + '</span><span class="color999">' + PKG.PER_MONTH +'</span></div><p><i></i>' + PKG.GVC_TIP_1 + '</p><p><i></i>' + PKG.GVC_TIP_2 + '</p><p><i></i>' + PKG.GVC_TIP_3.replace(/{duration}/, duration) + '</p><p><i></i>' + PKG.GVC_TIP_4.replace(/{storageSpace}/, storageSpace) + '</p></div>'
                $(html).appendTo('body');
                var htmlHeight = $('.popover-box').outerHeight() + 10;
                var htmlWidth = $('.popover-box').outerWidth();
                var htmlLeft = left - htmlWidth / 2;
                $('.popover-box').css({
                    'left': left + (width / 2) - (htmlWidth/2),
                    'top': top - htmlHeight
                });
            } else {
                var txt = JSON.parse($(this).attr('tip-vals'));
                html = '<div class="tip-box" style="word-break:normal"><i></i><b></b>' +
                    '<div class="clearfix" style="width:490px;"><p style="float:left">' + txt.contTip1 + '</p><div style="float:left;width:400px;"><p>' + txt.contTip2 + '</p><p>' + txt.contTip4 + '</p><p>' + txt.contTip5 + '</p><p>' + txt.contTip3 + '</p></div></div>' +
                    '</div>';
                $(html).appendTo('body');
                var htmlHeight = $('.tip-box').outerHeight() + 10;
                var htmlWidth = $('.tip-box').outerWidth();
                var htmlLeft = left - htmlWidth / 2 + width / 2;
                if (($('body').width() - left) <= htmlWidth / 2 + 20) {
                    $('.tip-box b').css({
                        'right': $('body').width() - left - 47
                    });
                    $('.tip-box').css({
                        'left': htmlLeft - (htmlWidth / 2 - ($('body').width() - left) + 40),
                        'top': top - htmlHeight
                    });
                } else {
                    $('.tip-box b').css({
                        'left': (htmlWidth - 18) / 2 - 3
                    });
                    $('.tip-box').css({
                        'left': htmlLeft,
                        'top': top - htmlHeight
                    });
                }
            }
        },
        mouseout: function () {
            $('.tip-box').remove();
            $('.popover-box').remove();
        },
    }, '[tip-vals]');
}
function addSuffix(num){
    var numInit = num + '';
    if (numInit.indexOf('.')>0) {
        var arrNum = numInit.split('.');
        if (arrNum[1].length == 1) {
            return numInit + '0';
        }else{
            return numInit;
        }
    }else{
        return numInit == 'undefined' ? '0.00' : numInit + '.00';
    }
}
function checkBuyNewPlan(val) {
    var reg = /^[1-9][0-9]{0,1}$/;
    return reg.test(val);
}

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function checkStatusPayment(id_transaksi,newWindow, y){
    $.ajax({
            url: APP_DOMAIN + '/srm/payment/status_transaksi',
            async: true,
            type:"post",
            dataType: 'json',
            data:{
                id_transaksi:id_transaksi
            },
            beforeSend: function () {
            },
            complete: function () {
            },
            success: function (result) {
                try {
                    var object;
                    if ((typeof result) != 'object') {
                        object = JSON.parse(result);
                    } else {
                        object = result;
                    }
                    var state = object['state'];
                    if (state == 0) {
                            clearInterval(y);
                            removeLoading();
                            $(document).alertbox({
                                msgContent: object.msg,
                                msgContentClass: 'success'
                            });
                            setTimeout(function(){ location.reload(); }, 5000);
                            location.reload();
                    }

                    if (state == 1) {
                        // waiting payment
                        if (newWindow.closed) {
                            clearInterval(y);
                            removeLoading();
                            $(document).alertbox({
                                msgContent: object.msg,
                                msgContentClass: 'success'
                            });
                            setTimeout(function(){ location.reload(); }, 5000);
                            location.reload();
                        }
                    }

                    if (state == 9) {
                        if (newWindow.closed) {
                            $(document).alertbox({
                                msgContent: "Transaction is Canceled",
                                msgContentClass: 'warning'
                            });
                            clearInterval(y);
                            cancelPayment(id_transaksi);

                        }
                    }

                    if (state == 7 || state == 6) {
                        //error
                        newWindow.close();
                        newWindow = null;
                        $(document).alertbox({
                            msgContent: object.msg,
                            msgContentClass: 'warning'
                        });
                        clearInterval(y);
                        removeLoading();
                    }
                } catch (e) {
                    newWindow.close();
                    newWindow = null;
                    $(document).alertbox({
                        msgContent: object.msg,
                        msgContentClass: 'warning'
                    });
                } 
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        }
    );
}

function cancelPayment(id_transaksi){
    $.ajax({
        url: APP_DOMAIN + '/srm/payment/cancel_payment',
        async: true,
        type:"post",
        dataType: 'json',
        data:{
            id_transaksi:id_transaksi
        },
        beforeSend: function () {
        },
        complete: function () {
        },
        success: function (result) {
            removeLoading();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
}


function get_status_payment(accountName){
    $.ajax({
        url: APP_DOMAIN + '/srm/package/get_open_payment',
        async: true,
        type:"post",
        dataType: 'json',
        data:{
            accountName:accountName
        },
        beforeSend: function () {
        },
        complete: function () {
        },
        success: function (result) {
            try {
                    var object;
                    if ((typeof result) != 'object') {
                        object = JSON.parse(result);
                    } else {
                        object = result;
                    }
                    var status = object['count'];
                    if (status > 0) {
                        $('.payment-history').show();
                        $('.payment-history').html(status + " Pending Payment");
                    } else {
                        $('.payment-history').hide();
                    }
                } catch (e) {
                    console.error("error euy: " + e)
                } 
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
}

