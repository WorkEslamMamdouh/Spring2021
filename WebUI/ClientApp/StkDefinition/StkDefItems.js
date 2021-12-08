$(document).ready(function () {
    StkDefItems.InitalizeComponent();
});
var StkDefItems;
(function (StkDefItems) {
    var AccountType = 1;
    var MSG_ID;
    var Details = new Array();
    var Display_Type = new Array();
    var Display_STORE = new Array();
    var Display_D_UOM = new Array();
    var Display_ItemFamily = new Array();
    var BilldItemFamily = new Array();
    var BilldDetail = new I_Item_Year_Details();
    //var Details: Array<I_D_Category> = new Array<I_D_Category>();
    var btnNew_sub_Add_service;
    var btnsave;
    var btnAddDetails;
    var btnEdit;
    var btnShow;
    //var btnView: HTMLButtonElement;
    var sys = new SystemTools();
    //var sys: _shared = new _shared();
    var SysSession = GetSystemSession();
    var Model = new I_Item();
    var Model_Year = new I_ItemYear();
    var CountGrid = 0;
    var compcode; //SharedSession.CurrentEnvironment.CompCode;
    var BranchCode; //SharedSession.CurrentEnvironment.BranchCode;
    var btnback;
    var catId;
    var catId_type_change;
    var ItemFamilyID_change;
    var flag_Assign = 0;
    var ItemFamilyID;
    var storeCode = 1;
    var Itm_DescA;
    var flag_Display = 0;
    var StocK = "All";
    var FinYear = Number(SysSession.CurrentEnvironment.CurrentYear);
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    function InitalizeComponent() {
        // 
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "الاصناف";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Items";
        }
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        InitalizeEvents();
        Display_DrpPaymentType();
        //Display();
        Display_G_store();
        Display_UOM();
        $('#drp_G_Store').prop("selectedIndex", 1);
        //$('#drp_G_Store').prop("value", 1);
        $("#drp_G_Store").attr("disabled", "disabled");
        //Display_I_ItemFamily();
    }
    StkDefItems.InitalizeComponent = InitalizeComponent;
    $('#btnedite').on('click', function () {
        if (SysSession.CurrentPrivileges.EDIT) {
            $('#btnsave').toggleClass("display_none");
            $('#btnback').toggleClass("display_none");
            $("#div_ContentData :input").removeAttr("disabled");
            $("#btnedite").toggleClass("display_none");
            $(".SelectDIS").attr("disabled", "disabled");
            if ($('#drpitem_family').val() == "null") {
                $("#drpitem_family").attr("disabled", "disabled");
            }
            else {
                $("#drpitem_family").removeAttr("disabled");
            }
            $("#drp_G_Store").attr("disabled", "disabled");
            $("#drpPaymentType").attr("disabled", "disabled");
            $("#drpitem_family").attr("disabled", "disabled");
            $("#drp_StocK").attr("disabled", "disabled");
            $("#btnShow").attr("disabled", "disabled");
        }
        else {
            $('#btnsave').toggleClass("display_none");
            $('#btnback').toggleClass("display_none");
            $("#btnedite").toggleClass("display_none");
        }
        if (SysSession.CurrentPrivileges.AddNew) {
            $(".btnAddDetails").removeAttr("disabled");
            $('#btnAddDetails').attr('class', 'glyphicon glyphicon-plus-sign');
        }
        else {
            $(".btnAddDetails").attr("disabled", "disabled");
        }
        if (SysSession.CurrentPrivileges.Remove) {
            $(".fa-minus-circle").removeClass("display_none");
        }
        else {
            $(".fa-minus-circle").addClass("display_none");
        }
    });
    function InitalizeControls() {
        // 
        btnAddDetails = document.getElementById("btnAddDetails");
        btnEdit = document.getElementById("btnedite");
        btnsave = document.getElementById("btnsave");
        btnback = document.getElementById("btnback");
        btnShow = document.getElementById("btnShow");
        // Buton privialges for single record page
    }
    function InitalizeEvents() {
        // 
        $("#drpitem_family").attr("disabled", "disabled");
        //$("#drpPaymentType").attr("disabled", "disabled");
        btnAddDetails.onclick = AddNewRow; //
        btnsave.onclick = btnsave_onClick;
        btnback.onclick = btnback_onclick;
        btnShow.onclick = btnShow_onclick;
        $("#drp_G_Store").on('change', function () {
            $("#drpPaymentType").removeAttr("disabled");
            storeCode = $('#drp_G_Store').val();
        });
        $("#drpPaymentType").on('change', function () {
            if ($("#drpPaymentType").val() == "null") {
                $("#div_Data").html('');
                $("#drpitem_family").attr("disabled", "disabled");
                $('#drpitem_family').prop("value", 'null');
            }
            else {
                storeCode = $('#drp_G_Store').val();
                $("#drpitem_family").removeAttr("disabled");
                $('#drpitem_family').html("");
                catId = $('#drpPaymentType').val();
                Display_I_ItemFamily();
                ItemFamilyID = $('#drpitem_family').val();
            }
        });
        $("#drpitem_family").on('change', function () {
            ItemFamilyID = $('#drpitem_family').val();
        });
    }
    function btnShow_onclick() {
        debugger;
        storeCode = $('#drp_G_Store').val();
        catId = $('#drpPaymentType').val();
        ItemFamilyID = $('#drpitem_family').val();
        StocK = $('#drp_StocK').val();
        if ($("#drpPaymentType").val() == "null") {
            WorningMessage("يجب اختيار الفئة!", "Category must be selected!", "تحذير", "worning");
        }
        else {
            btnback_onclick();
        }
    }
    function AddNewRow() {
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        var CanAdd = true;
        if (CountGrid > 0) {
            for (var i = 0; i < CountGrid; i++) {
                debugger;
                CanAdd = Validation_Grid(i);
                if (CanAdd == false) {
                    break;
                }
            }
        }
        if (CanAdd) {
            BuildControls(CountGrid);
            $("#txtCode" + CountGrid).removeAttr("disabled");
            $("#txtDescA" + CountGrid).removeAttr("disabled");
            $("#txtDescL" + CountGrid).removeAttr("disabled");
            $("#select_Type_Item" + CountGrid).removeAttr("disabled");
            $("#select_ItemFamily" + CountGrid).removeAttr("disabled");
            $("#txtRefItemCode" + CountGrid).removeAttr("disabled");
            $("#txtUnitPrice" + CountGrid).removeAttr("disabled");
            $("#txtLastBarCodeSeq" + CountGrid).removeAttr("disabled");
            $("#txt_UOM" + CountGrid).removeAttr("disabled");
            $("#txtMinUnitPrice" + CountGrid).removeAttr("disabled");
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");
            $("#select_Type_Item" + CountGrid).prop('value', $("#drpPaymentType").val() == 'null' ? 'null' : Number($("#drpPaymentType").val()));
            $("#select_ItemFamily" + CountGrid).prop('value', $("#drpitem_family").val() == 'null' || $("#drpitem_family").val() == null ? 'null' : Number($("#drpitem_family").val()));
            $("#txt_UOM" + CountGrid).prop('value', 1);
            $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode
            CountGrid++;
        }
        $("#btnedite").addClass("display_none");
    }
    function BuildControls(cnt) {
        var html;
        html = '<div id="No_Row' + cnt + '" class="container-fluid ">' +
            '<div class="col-lg-12">' +
            '<div class="col-lg-12">' +
            '<span id = "btn_minus' + cnt + '" class="fa fa-minus-circle fontitm3 display_none" disabled = "disabled"> </span>' +
            '<div class="col-lg-1"><input id="txtCode' + cnt + '" type="text" class="form-control right2" disabled=""></div>' +
            '<div id="DescA' + cnt + '" class="col-lg-3"><input id="txtDescA' + cnt + '" type="text" class="form-control right2 position_DescAE" disabled=""></div> ' +
            //'<div id="DescL' + cnt + '" class="col-lg-3"></div> ' +
            '<div class="col-lg-1"><select id="select_Type_Item' + cnt + '" class="form-control" disabled=""></select></div> ' +
            '<div class="col-lg-1"><select id="select_ItemFamily' + cnt + '" class="form-control " disabled=""></select></div> ' +
            '<div class="col-lg-2"><input id="txtRefItemCode' + cnt + '" type="number" class="form-control right2" disabled=""></div> ' +
            '<div class="col-lg-1"><input id="txtOnhandQty' + cnt + '" type="text" disabled="" class="form-control right2 SelectDIS"></div> ' +
            '<div class="col-lg-1"><input id="txtUnitPrice' + cnt + '" type="number" disabled="" class="form-control right2"></div> ' +
            '<div class="col-lg-1"><input id="txtMinUnitPrice' + cnt + '" type="number" disabled="" class="form-control right2"></div> ' +
            '<div class="col-lg-1  "><select id="txt_UOM' + cnt + '" class="form-control" disabled=""></select></div> ' +
            '<div class="col-lg-3 position_DescEStkDefItems">' +
            '<input id="txtDescL' + cnt + '" type="text" class="form-control position_DescEE " disabled=""></div>' +
            '</div>' +
            '</div> ' +
            '<input id="txt_StatusFlag' + cnt + '" name=" " type="hidden" class="form-control" value=""> ' +
            '<input id="txt_ID' + cnt + '" name=" " type="hidden" class="form-control" value=""> ' +
            '<input id="txt_ItemYearID' + cnt + '" name=" " type="hidden" class="form-control" value=""> ' +
            '<input id="txt_ItemStoreID' + cnt + '" name=" " type="hidden" class="form-control" value=""> ' +
            '</div> ';
        $("#div_Data").append(html);
        //(lang == "ar" ? $('#DescL' + cnt).addClass('display_none') : $('#DescA' + cnt).addClass('display_none')); 
        $('#select_Type_Item' + cnt).append('<option value="null">' + (lang == "ar" ? "أختر الفئة" : "Choose category") + '</option>');
        for (var i = 0; i < Display_Type.length; i++) {
            $('#select_Type_Item' + cnt).append('<option value="' + Display_Type[i].CatID + '">' + (lang == "ar" ? Display_Type[i].DescA : Display_Type[i].DescL) + '</option>');
        }
        $('#txt_UOM' + cnt).append('<option value="null">' + (lang == "ar" ? "وحدة القياس" : "Choose unit") + '</option>');
        for (var i = 0; i < Display_D_UOM.length; i++) {
            $('#txt_UOM' + cnt).append('<option value="' + Display_D_UOM[i].UomID + '">' + (lang == "ar" ? Display_D_UOM[i].DescA : Display_D_UOM[i].DescE) + '</option>');
        }
        $('#select_ItemFamily' + cnt).append('<option value="null"> ' + (lang == "ar" ? "اختر النوع" : "Choose Type") + '</option>');
        for (var i = 0; i < Display_ItemFamily.length; i++) {
            $('#select_ItemFamily' + cnt).append('<option value="' + Display_ItemFamily[i].ItemFamilyID + '">' + (lang == "ar" ? Display_ItemFamily[i].DescA : Display_ItemFamily[i].DescL) + '</option>');
        }
        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });
        $("#txtCode" + cnt).on('change', function () {
            Validate_code(cnt);
        });
        $("#txtDescA" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtDescL" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#select_Type_Item" + cnt).on('change', function () {
            catId_type_change = $("#select_Type_Item" + cnt).val();
            $("#select_ItemFamily" + cnt).removeAttr("disabled");
            $('#select_ItemFamily' + cnt).html("");
            Display_I_ItemFamily_GRED();
            for (var i = 0; i < Display_ItemFamily.length; i++) {
                $('#select_ItemFamily' + cnt).append('<option value="' + Display_ItemFamily[i].ItemFamilyID + '">' + Display_ItemFamily[i].DescA + '</option>');
            }
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#select_ItemFamily" + cnt).on('change', function () {
            ItemFamilyID_change = $("#select_ItemFamily" + cnt).val();
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtRefItemCode" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtOnhandQty" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtUnitPrice" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtMinUnitPrice" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            //debugger
            if ($("#txtUnitPrice" + cnt).val() == "" || $("#txtUnitPrice" + cnt).val() == 0) {
                WorningMessage("يجب أدخال سعر الصنف اوالاً!", "The item price must be entered first!", "تحذير", "worning");
                $("#txtMinUnitPrice" + cnt).val(0);
            }
            else if (Number($("#txtMinUnitPrice" + cnt).val()) > Number($("#txtUnitPrice" + cnt).val())) {
                WorningMessage("يجب ان يكون أقل سعر اصغر من سعر الصنف!", "The lowest price should be smaller than the item price!", "تحذير", "worning");
                $("#txtMinUnitPrice" + cnt).val($("#txtUnitPrice" + cnt).val() - 1);
            }
        });
        $("#txt_UOM" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        if (SysSession.CurrentPrivileges.Remove) {
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
        }
        else {
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
        }
        return;
    }
    function btnsave_onClick() {
        var CanAdd = true;
        if (CountGrid > 0) {
            for (var i = 0; i < CountGrid; i++) {
                debugger;
                CanAdd = Validation_Grid(i);
                if (CanAdd == false) {
                    break;
                }
            }
        }
        if (CanAdd) {
            Update();
            flag_Assign = 0;
        }
    }
    function Display_G_store() {
        //var StkDefCategory: Array<I_D_Category> = new Array<I_D_Category>();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefStore", "GetAll"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Display_STORE = result.Response;
                    DisplayStk_G_store();
                }
            }
        });
    }
    function DisplayStk_G_store() {
        for (var i = 0; i < Display_STORE.length; i++) {
            $('#drp_G_Store').append('<option value="' + Display_STORE[i].StoreId + '">' + (lang == "ar" ? Display_STORE[i].DescA : Display_STORE[i].DescL) + '</option>');
        }
    }
    function Display_I_ItemFamily() {
        //var StkDefCategory: Array<I_D_Category> = new Array<I_D_Category>();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetByCategory"),
            data: {
                CompCode: compcode, CatID: catId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Display_ItemFamily = result.Response;
                    DisplayStk_I_Item();
                }
            }
        });
    }
    function DisplayStk_I_Item() {
        $('#drpitem_family').append('<option value="' + 0 + '"> ' + (lang == "ar" ? " اختر النوع " : "Choose Type") + '</option>');
        for (var i = 0; i < Display_ItemFamily.length; i++) {
            $('#drpitem_family').append('<option value="' + Display_ItemFamily[i].ItemFamilyID + '">' + (lang == "ar" ? Display_ItemFamily[i].DescA : Display_ItemFamily[i].DescL) + '</option>');
        }
    }
    function Display_I_ItemFamily_GRED() {
        //var StkDefCategory: Array<I_D_Category> = new Array<I_D_Category>();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetByCategory"),
            data: {
                CompCode: compcode, CatID: catId_type_change, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Display_ItemFamily = result.Response;
                }
            }
        });
    }
    function Display_DrpPaymentType() {
        //var StkDefCategory: Array<I_D_Category> = new Array<I_D_Category>();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefCategory", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Display_Type = result.Response;
                    DisplayStkDefCategory();
                }
            }
        });
    }
    function DisplayStkDefCategory() {
        ;
        for (var i = 0; i < Display_Type.length; i++) {
            $('#drpPaymentType').append('<option data-ItemID="' + (lang == "ar" ? Display_Type[i].DescA : Display_Type[i].DescL) + '" value="' + Display_Type[i].CatID + '">' + (lang == "ar" ? Display_Type[i].DescA : Display_Type[i].DescL) + '</option>');
        }
    }
    function Display_UOM() {
        //var StkDefCategory: Array<I_D_Category> = new Array<I_D_Category>();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefUnit", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Display_D_UOM = result.Response;
                }
            }
        });
    }
    function DisplayStk_UOM() {
        for (var i = 0; i < Display_D_UOM.length; i++) {
            $('#txt_UOM').append('<option value="' + Display_D_UOM[i].UomID + '">' + Display_D_UOM[i].DescA + '</option>');
        }
    }
    function Update() {
        Assign();
        BilldDetail.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        BilldDetail.UserCode = SysSession.CurrentEnvironment.UserCode;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("StkDefItems", "Updatelist"),
            data: JSON.stringify(BilldDetail),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var OK = result.Response;
                    OK == 0 ? DisplayMassage_Processes('خطاء الصنف مستخدم بالفغل ', 'Wrong the Item is already used ', MessageType.Worning) : DisplayMassage_Processes('تم الحفظ', 'Done', MessageType.Succeed);
                    btnback_onclick();
                    flag_Assign = 0;
                }
                else {
                    DisplayMassage_Processes('خطأ', 'Wrong', MessageType.Worning);
                }
            }
        });
    }
    function Assign() {
        debugger;
        BilldDetail = new I_Item_Year_Details();
        var StatusFlag;
        for (var i = 0; i < CountGrid; i++) {
            Model = new I_Item();
            Model_Year = new I_ItemYear();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            if (StatusFlag == "i") {
                Model.StatusFlag = StatusFlag.toString();
                Model_Year.StatusFlag = StatusFlag.toString();
                Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
                Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;
                Model.CreatedAt = DateTimeFormat(Date().toString());
                Model.ItemID = 0;
                Model.ItemCode = $("#txtCode" + i).val();
                Model.ItemFamilyID = $('#select_ItemFamily' + i).val();
                Model.RefItemCode = $("#txtRefItemCode" + i).val();
                Model.OnhandQty = $("#txtOnhandQty" + i).val() == null ? 0 : $("#txtOnhandQty" + i).val();
                Model.UomID = $('#txt_UOM' + i).val();
                Model.DescA = $("#txtDescA" + i).val() == null ? $("#txtDescL" + i).val() : $("#txtDescA" + i).val();
                Model.DescL = $("#txtDescL" + i).val() == null ? $("#txtDescA" + i).val() : $("#txtDescL" + i).val();
                Model_Year.ItemYearID = $("#txt_ItemYearID" + i).val();
                Model_Year.UnitPrice = $('#txtUnitPrice' + i).val();
                Model_Year.MinUnitPrice = $('#txtMinUnitPrice' + i).val();
                Model_Year.FinYear = FinYear;
                flag_Assign = 1;
                BilldDetail.I_Item.push(Model);
                BilldDetail.I_ItemYear.push(Model_Year);
            }
            if (StatusFlag == "u") {
                Model.StatusFlag = StatusFlag.toString();
                Model_Year.StatusFlag = StatusFlag.toString();
                Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
                Model.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
                Model.UpdatedAt = DateTimeFormat(Date().toString());
                Model.ItemID = $("#txt_ID" + i).val();
                Model.ItemCode = $("#txtCode" + i).val();
                Model.ItemFamilyID = $('#select_ItemFamily' + i).val();
                Model.RefItemCode = $("#txtRefItemCode" + i).val();
                Model.OnhandQty = $("#txtOnhandQty" + i).val() == null ? 0 : $("#txtOnhandQty" + i).val();
                Model.UomID = $('#txt_UOM' + i).val();
                Model.DescA = $("#txtDescA" + i).val() == null ? $("#txtDescL" + i).val() : $("#txtDescA" + i).val();
                Model.DescL = $("#txtDescL" + i).val() == null ? $("#txtDescA" + i).val() : $("#txtDescL" + i).val();
                Model_Year.ItemYearID = $("#txt_ItemYearID" + i).val();
                Model_Year.ItemID = $("#txt_ID" + i).val();
                Model_Year.UnitPrice = $('#txtUnitPrice' + i).val();
                Model_Year.MinUnitPrice = $('#txtMinUnitPrice' + i).val();
                Model_Year.FinYear = FinYear;
                flag_Assign = 1;
                BilldDetail.I_Item.push(Model);
                BilldDetail.I_ItemYear.push(Model_Year);
            }
            if (StatusFlag == "d") {
                if ($("#txt_ID" + i).val() != "") {
                    Model.StatusFlag = StatusFlag.toString();
                    Model_Year.StatusFlag = StatusFlag.toString();
                    Model.ItemID = $("#txt_ID" + i).val();
                    Model_Year.ItemYearID = $("#txt_ItemYearID" + i).val();
                    Model_Year.ItemID = $("#txt_ID" + i).val();
                    Model_Year.FinYear = FinYear;
                    flag_Assign = 1;
                    BilldDetail.I_Item.push(Model);
                    BilldDetail.I_ItemYear.push(Model_Year);
                }
            }
        }
    }
    function Display_All() {
        debugger;
        storeCode = $('#drp_G_Store').val();
        ItemFamilyID = 0;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItems", "GetAllItem"),
            data: {
                CompCode: compcode, FinYear: FinYear, catid: catId, itemFamilyid: ItemFamilyID, Storeid: storeCode, StocK: StocK, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    debugger;
                    Details = result.Response;
                    Details_All();
                }
            }
        });
    }
    function Details_All() {
        CountGrid = 0;
        $("#div_Data").html('');
        for (var i = 0; i < Details.length; i++) {
            BuildControls(CountGrid);
            $("#txt_ItemStoreID" + i).val(Details[i].ItemStoreID);
            $("#txt_ItemYearID" + i).val(Details[i].ItemYearID);
            $("#txt_ID" + i).val(Details[i].ItemID);
            $("#txtCode" + i).val(Details[i].ItemCode);
            $("#txtDescA" + i).val(Details[i].Itm_DescA);
            $("#txtDescL" + i).val(Details[i].Itm_DescE);
            $("#txt_UOM" + i).val(Details[i].UomID);
            $("#txtRefItemCode" + i).val(Details[i].RefItemCode);
            $("#txtOnhandQty" + i).val(Details[i].OnhandQty);
            $("#txtUnitPrice" + i).val(Details[i].UnitPrice);
            $("#txtMinUnitPrice" + i).val(Details[i].MinUnitPrice);
            $("#txt_StatusFlag" + i).val("");
            $('#select_Type_Item' + i).prop("value", catId);
            $('#select_ItemFamily' + i).prop("value", Details[i].ItemFamilyID);
            CountGrid++;
        }
    }
    function Display() {
        //debugger
        storeCode = $('#drp_G_Store').val();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItems", "GetAll_StocK"),
            data: {
                CompCode: compcode, FinYear: FinYear, ItemFamilyID: ItemFamilyID, storeCode: storeCode, StocK: StocK, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Details = result.Response;
                    DisplayGetItemStore();
                }
            }
        });
    }
    function DisplayGetItemStore() {
        CountGrid = 0;
        $("#div_Data").html('');
        for (var i = 0; i < Details.length; i++) {
            BuildControls(CountGrid);
            $("#txt_ItemStoreID" + i).val(Details[i].ItemStoreID);
            $("#txt_ItemYearID" + i).val(Details[i].ItemYearID);
            $("#txt_ID" + i).val(Details[i].ItemID);
            $("#txtCode" + i).val(Details[i].ItemCode);
            $("#txtDescA" + i).val(Details[i].Itm_DescA);
            $("#txtDescL" + i).val(Details[i].Itm_DescE);
            $("#txt_UOM" + i).val(Details[i].UomID);
            $("#txtRefItemCode" + i).val(Details[i].RefItemCode);
            $("#txtOnhandQty" + i).val(Details[i].OnhandQty);
            $("#txtUnitPrice" + i).val(Details[i].UnitPrice);
            $("#txtMinUnitPrice" + i).val(Details[i].MinUnitPrice);
            $("#txt_StatusFlag" + i).val("");
            $('#select_Type_Item' + i).prop("value", catId);
            $('#select_ItemFamily' + i).prop("value", ItemFamilyID);
            CountGrid++;
        }
    }
    function DeleteRow(RecNo) {
        if (!SysSession.CurrentPrivileges.Remove)
            return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", function () {
            if ($("#txtCode" + RecNo).val() == "") {
                Null_Fild(RecNo);
                $("#No_Row" + RecNo).attr("hidden", "true");
            }
            else {
                $("#No_Row" + RecNo).attr("hidden", "true");
            }
            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d');
            $("#txtCode" + RecNo).val("000");
            $("#txtUnitPrice" + RecNo).val("000");
            $("#txtMinUnitPrice" + RecNo).val("000");
        });
    }
    function Null_Fild(RecNo) {
        $("#txt_ItemStoreID" + RecNo).val("");
        $("#txt_ItemYearID" + RecNo).val("");
        $("#txt_ID" + RecNo).val("");
        $("#txtCode" + RecNo).val("0");
        $("#txtDescA" + RecNo).val(0);
        $("#txtDescL" + RecNo).val(0);
        $("#txtRefItemCode" + RecNo).val(0);
        $("#txtOnhandQty" + RecNo).val(0);
        $("#txtLastBarCodeSeq" + RecNo).val(0);
        $("#txtLastBarCodeSeq" + RecNo).val(0);
        $('#select_Type_Item' + RecNo).prop("selectedIndex", 0);
        $('#select_ItemFamily' + RecNo).prop("selectedIndex", 0);
    }
    function btnback_onclick() {
        if ($('#btnback').attr('class') != "btn btn-warning display_none") {
            $('#btnback').toggleClass("display_none");
        }
        if ($('#btnsave').attr('class') != "btn btn-success display_none") {
            $('#btnsave').toggleClass("display_none");
        }
        $('#btnAddDetails').attr('class', 'glyphicon glyphicon-plus-sign  display_none');
        $(".fa-minus-circle").addClass("display_none");
        $("#btnedite").removeClass("display_none");
        $("#btnedite").removeAttr("disabled");
        $("#btnback").removeAttr("disabled");
        $("#btnsave").removeAttr("disabled");
        CountGrid = 0;
        $("#div_Data").html("");
        if ($("#drpitem_family").val() == "0") {
            Display_All();
        }
        else {
            Display();
        }
        $("#drpPaymentType").removeAttr("disabled");
        $("#drpitem_family").removeAttr("disabled");
        $("#drp_StocK").removeAttr("disabled");
        $("#btnShow").removeAttr("disabled");
    }
    function Validation_Grid(rowcount) {
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        }
        else {
            if ($("#txtDescA" + rowcount).val() == "") {
                $("#txtDescA" + rowcount).val($("#txtDescL" + rowcount).val());
            }
            if ($("#txtDescL" + rowcount).val() == "") {
                $("#txtDescL" + rowcount).val($("#txtDescA" + rowcount).val());
            }
            if ($("#txtCode" + rowcount).val() == "" && $("#txt_StatusFlag" + rowcount).val() != "d") {
                Errorinput($("#txtCode" + rowcount));
                DisplayMassage_Processes('ادخل كود', 'Enter The Code', MessageType.Worning);
                return false;
            }
            if ((lang == "ar" ? $("#txtDescA" + rowcount).val() : $("#txtDescL" + rowcount).val()) == '') {
                DisplayMassage_Processes('ادخل الوصف', 'Enter The Description', MessageType.Worning);
                Errorinput((lang == "ar" ? $("#txtDescA" + rowcount) : $("#txtDescL" + rowcount)));
                return false;
            }
            if ($("#select_Type_Item" + rowcount).val() == "null" && $("#txt_StatusFlag" + rowcount).val() != "d") {
                Errorinput($("#select_Type_Item" + rowcount));
                DisplayMassage_Processes('اختار الفئة', ' Choose The Category', MessageType.Worning);
                return false;
            }
            if ($("#select_ItemFamily" + rowcount).val() == "null" && $("#txt_StatusFlag" + rowcount).val() != "d") {
                Errorinput($("#select_ItemFamily" + rowcount));
                DisplayMassage_Processes('اختار النوع', ' Choose The Type', MessageType.Worning);
                return false;
            }
            if ($("#txt_UOM" + rowcount).val() == "null" && $("#txt_StatusFlag" + rowcount).val() != "d") {
                Errorinput($("#txt_UOM" + rowcount));
                DisplayMassage_Processes('اختار وحدة القياس', 'Choose The Measuring Unit', MessageType.Worning);
                return false;
            }
            var Qty = Number($("#txtUnitPrice" + rowcount).val());
            if ($("#txtUnitPrice" + rowcount).val() == "" || Qty == 0) {
                $("#txtUnitPrice" + rowcount).val('0');
            }
            if ($("#txtMinUnitPrice" + rowcount).val() == "") {
                $("#txtMinUnitPrice" + rowcount).val('0');
            }
        }
        return true;
    }
    function Validate_code(rowno) {
        for (var i = 0; i < CountGrid; i++) {
            if (i != rowno) {
                if ($("#txt_StatusFlag" + i).val() == "d") {
                    return true;
                }
                else {
                    if ($("#txtCode" + rowno).val() == $("#txtCode" + i).val()) {
                        var Code = $("#txtCode" + rowno).val();
                        $("#txtCode" + rowno).val("");
                        WorningMessage("لا يمكن تكرار رقم الكود " + Code, "code cannot br repeated?", "تحذير", "worning", function () {
                            $("#txtCode" + rowno).val("");
                            return false;
                        });
                    }
                }
            }
        }
        if ($("#txt_StatusFlag" + rowno).val() != "i")
            $("#txt_StatusFlag" + rowno).val("u");
        return true;
    }
})(StkDefItems || (StkDefItems = {}));
//# sourceMappingURL=StkDefItems.js.map