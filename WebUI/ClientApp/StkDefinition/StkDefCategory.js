$(document).ready(function () {
    //debugger;
    StkDefCategory.InitalizeComponent();
});
var StkDefCategory;
(function (StkDefCategory) {
    var MSG_ID;
    var Details = new Array();
    var DetailsVatNature = new Array();
    var D_UnitGroup = new Array();
    //var Details: Array<I_D_Category> = new Array<I_D_Category>();
    var btnNew_sub_Add_service;
    var btnsave;
    var btnAddDetails;
    var btnEdit;
    var sys = new SystemTools();
    //var sys: _shared = new _shared();
    var SysSession = GetSystemSession();
    var Model = new I_D_Category();
    var CountGrid = 0;
    var compcode; //SharedSession.CurrentEnvironment.CompCode;
    var btnback;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    function InitalizeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = " فئات الأصناف";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Item Category";
        }
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        InitalizeControls();
        InitalizeEvents();
        FillddlVatNature();
        FillddlI_D_UnitGroup();
        Display();
    }
    StkDefCategory.InitalizeComponent = InitalizeComponent;
    $('#btnedite').on('click', function () {
        if (SysSession.CurrentPrivileges.EDIT) {
            $('#btnsave').toggleClass("display_none");
            $('#btnback').toggleClass("display_none");
            $("#div_ContentData :input").removeAttr("disabled");
            $("#btnedite").toggleClass("display_none");
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
            $(".minus_btn").removeClass("display_none");
        }
        else {
            $(".minus_btn").addClass("display_none");
        }
    });
    function InitalizeControls() {
        //debugger;
        btnAddDetails = document.getElementById("btnAddDetails");
        btnEdit = document.getElementById("btnedite");
        btnsave = document.getElementById("btnsave");
        btnback = document.getElementById("btnback");
        // Buton privialges for single record page
    }
    function InitalizeEvents() {
        //debugger;
        btnAddDetails.onclick = AddNewRow; //
        btnsave.onclick = btnsave_onClick;
        btnback.onclick = btnback_onclick;
    }
    function AddNewRow() {
        //debugger
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
            $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode
            $("#txtCode" + CountGrid).removeAttr("disabled");
            $("#txtVatNat" + CountGrid).removeAttr("disabled");
            $("#txtDescA" + CountGrid).removeAttr("disabled");
            $("#txtDescL" + CountGrid).removeAttr("disabled");
            $("#txtGroupunits" + CountGrid).removeAttr("disabled");
            // can delete new inserted record  without need for delete privilage
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");
            //$(".minus_btn").addClass("display_none");
            $("#btnedite").removeClass("display_none");
            CountGrid++;
        }
        $("#btnedite").addClass("display_none");
    }
    function FillddlVatNature() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenVatType", "GetAllVatNature"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    DetailsVatNature = result.Response;
                }
            }
        });
    }
    function FillddlI_D_UnitGroup() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("I_D_UnitGroup", "GetAllUnitGroup"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    D_UnitGroup = result.Response;
                }
            }
        });
    }
    function BuildControls(cnt) {
        var html;
        html = '<div id="No_Row' + cnt + '" class="col-lg-12 p-0" ><span id="btn_minus' + cnt + '" class="glyphicon glyphicon-remove-sign fontitm3  minus_btn"></span><div class="col-lg-1 style_pading"> <input id="txtCode' + cnt + '" type= "text" class="form-control right2 " disabled="disabled"/></div><div class="col-lg-3 style_pading"> <input id="txtDescA' + cnt + '" type= "text" class="form-control right3" disabled="disabled"/></div><div class="col-lg-3 style_pading"> <input id="txtDescL' + cnt + '" type= "text" class="form-control right4" disabled="disabled" /></div><div class="col-lg-2 col-xs-3 style_pading"> <select id="txtVatNat' + cnt + '" class="form-control"  disabled="disabled"> <option value="Null">' + (lang == "ar" ? "  الضريبه" : "The Tax") + '</option></select ></div><div class="col-lg-2 col-xs-3 style_pading"> <select id="txtGroupunits' + cnt + '" class="form-control"  disabled="disabled"> <option value="Null">' + (lang == "ar" ? "  مجموعة الوحدات" : "Group units") + '</option></select ></div><div class="col-lg-12"> <input id = "txt_StatusFlag' + cnt + '" name = " " type = "hidden" disabled class="form-control"/></div><div class="col-lg-12"> <input id = "txt_ID' + cnt + '" name = " " type = "hidden" class="form-control"/></div></div>';
        $("#div_Data").append(html);
        for (var i = 0; i < DetailsVatNature.length; i++) {
            $('#txtVatNat' + cnt).append('<option value="' + DetailsVatNature[i].VatNatID + '">' + (lang == "ar" ? DetailsVatNature[i].VatNatureDescA : DetailsVatNature[i].VatNatureDescE) + '</option>');
        }
        for (var i = 0; i < D_UnitGroup.length; i++) {
            $('#txtGroupunits' + cnt).append('<option value="' + D_UnitGroup[i].UnitGrpID + '">' + (lang == "ar" ? D_UnitGroup[i].DescA : D_UnitGroup[i].DescE) + '</option>');
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
        $("#txtVatNat" + cnt).on('change', function () {
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
        }
    }
    function Update() {
        debugger;
        Assign();
        debugger;
        if (Details.filter(function (x) { return x.CatCode == ""; }).length > 0) {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                MessageBox.Show("يجب ادخال الكود", "");
            }
            else {
                MessageBox.Show("Please, Enter the Code", "");
            }
            return;
        }
        if (Details.filter(function (x) { return x.DescA == ""; }).length > 0) {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                MessageBox.Show("يجب ادخال الوصف باعربي", "");
            }
            else {
                MessageBox.Show("Please, Enter the Arabic Description", "");
            }
            return;
        }
        Details[0].Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        Details[0].UserCode = SysSession.CurrentEnvironment.UserCode;
        debugger;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("StkDefCategory", "UpdateLst"),
            data: JSON.stringify(Details),
            success: function (d) {
                debugger;
                var result = d;
                if (result.IsSuccess == true) {
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                        MessageBox.Show("تم الحفظ", "");
                    }
                    else {
                        MessageBox.Show("Done", "");
                    }
                    btnback_onclick();
                    //BilldItemFamily = Details.filter(x => x.CatID == 0)
                    refresh();
                }
                else {
                    debugger;
                    MessageBox.Show(result.ErrorMessage, "خطأ");
                }
            }
        });
    }
    function refresh() {
        $('#div_Data').html("");
        CountGrid = 0;
        Display();
    }
    function Assign() {
        var StatusFlag;
        for (var i = 0; i < CountGrid; i++) {
            Model = new I_D_Category();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            if (StatusFlag == "i") {
                Model.StatusFlag = StatusFlag.toString();
                ;
                Model.CatID = 0;
                Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
                //Model.CreatedAt = GetCurrentDate();
                Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;
                Model.CatLevel = 0;
                Model.IsDetail = true;
                Model.ItemTypeID = 1;
                Model.IsIssuetoCC = true;
                Model.IsIssueToProd = true;
                Model.IsProduct = false;
                Model.ISSales = true;
                Model.IsPurchase = true;
                Model.IsStock = true;
                Model.Remarks = "";
                Model.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
                Model.CatCode = $("#txtCode" + i).val();
                Model.VatNatID = $("#txtVatNat" + i).val();
                Model.UnitGrpID = $("#txtGroupunits" + i).val();
                if ($("#txtDescA" + i).val() == "") {
                    Model.DescA = $("#txtDescL" + i).val();
                    $("#txtDescA" + i).val($("#txtDescL" + i).val());
                }
                else {
                    Model.DescA = $("#txtDescA" + i).val();
                }
                if ($("#txtDescL" + i).val() == "") {
                    Model.DescL = $("#txtDescA" + i).val();
                    $("#txtDescL" + i).val($("#txtDescA" + i).val());
                }
                else {
                    Model.DescL = $("#txtDescL" + i).val();
                }
                Details.push(Model);
                //$("#txt_StatusFlag" + i).val("");
                //Model.CompCode = Number(compcode);
            }
            if (StatusFlag == "u") {
                var UpdatedDetail = Details.filter(function (x) { return x.CatID == $("#txt_ID" + i).val(); });
                UpdatedDetail[0].UpdatedBy = SysSession.CurrentEnvironment.UserCode;
                UpdatedDetail[0].StatusFlag = StatusFlag.toString();
                UpdatedDetail[0].CatCode = $("#txtCode" + i).val();
                UpdatedDetail[0].VatNatID = $("#txtVatNat" + i).val();
                UpdatedDetail[0].UnitGrpID = $("#txtGroupunits" + i).val();
                if ($("#txtDescA" + i).val() == "") {
                    UpdatedDetail[0].DescA = $("#txtDescL" + i).val();
                    $("#txtDescA" + i).val($("#txtDescL" + i).val());
                }
                else {
                    UpdatedDetail[0].DescA = $("#txtDescA" + i).val();
                }
                if ($("#txtDescL" + i).val() == "") {
                    UpdatedDetail[0].DescL = $("#txtDescA" + i).val();
                    $("#txtDescL" + i).val($("#txtDescA" + i).val());
                }
                else {
                    UpdatedDetail[0].DescL = $("#txtDescL" + i).val();
                }
                $("#txt_StatusFlag" + i).val("");
            }
            if (StatusFlag == "d") {
                if ($("#txt_ID" + i).val() != "") {
                    var UpdatedDetail = Details.filter(function (x) { return x.CatID == $("#txt_ID" + i).val(); });
                    UpdatedDetail[0].StatusFlag = StatusFlag.toString();
                    $("#txtCode" + i).val("");
                    $("#txt_StatusFlag" + i).val("");
                }
            }
        }
    }
    function Display() {
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
                    Details = result.Response;
                    DisplayStkDefCategory();
                }
            }
        });
    }
    function DisplayStkDefCategory() {
        for (var i = 0; i < Details.length; i++) {
            BuildControls(CountGrid);
            CountGrid++;
            $("#txt_ID" + i).val(Details[i].CatID);
            $("#txtCode" + i).val(Details[i].CatCode);
            $("#txtVatNat" + i).val(Details[i].VatNatID == null ? 'Null' : Details[i].VatNatID);
            $("#txtGroupunits" + i).val(Details[i].UnitGrpID == null ? 'Null' : Details[i].UnitGrpID);
            $("#txtDescA" + i).val(Details[i].DescA);
            $("#txtDescL" + i).val(Details[i].DescL);
            $("#txt_StatusFlag" + i).val("");
        }
    }
    function DeleteRow(RecNo) {
        if (!SysSession.CurrentPrivileges.Remove)
            return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", function () {
            $("#No_Row" + RecNo).attr("hidden", "true");
            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d');
            $("#txtCode" + RecNo).val("000");
            $("#txtVatNat" + RecNo).val("000");
            $("#txtGroupunits" + RecNo).val("000");
        });
    }
    function btnback_onclick() {
        $('#btnAddDetails').attr('class', 'glyphicon glyphicon-plus-sign  display_none');
        $('#btnsave').toggleClass("display_none");
        $('#btnback').toggleClass("display_none");
        $("#div_ContentData :input").attr("disabled", "true");
        $(".minus_btn").addClass("display_none");
        $("#btnedite").removeClass("display_none");
        $("#btnedite").removeAttr("disabled");
        $("#btnback").removeAttr("disabled");
        $("#btnsave").removeAttr("disabled");
        CountGrid = 0;
        $("#div_Data").html("");
        Display();
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
            if ($("#txtCode" + rowcount).val() == '') {
                WorningMessage('ادخل كود', 'Enter The code', 'خطاء', 'Erorr');
                Errorinput($("#txtCode" + rowcount));
                return false;
            }
            if ((lang == "ar" ? $("#txtDescA" + rowcount).val() : $("#txtDescL" + rowcount).val()) == '') {
                WorningMessage('ادخل الوصف ', 'Enter The Description', 'خطاء', 'Erorr');
                Errorinput((lang == "ar" ? $("#txtDescA" + rowcount) : $("#txtDescL" + rowcount)));
                return false;
            }
            if ($("#txtVatNat" + rowcount).val() == 'Null') {
                WorningMessage('برجاء اختيار الضريبه', 'Enter The Tax', 'خطاء', 'Erorr');
                Errorinput($("#txtVatNat" + rowcount));
                return false;
            }
            if ($("#txtGroupunits" + rowcount).val() == 'Null') {
                WorningMessage('  برجاء اختيار مجموعة الوحدات ', 'Enter The Group units', 'خطاء', 'Erorr');
                Errorinput($("#txtGroupunits" + rowcount));
                return false;
            }
        }
        return true;
    }
    function Validate_code(rowno) {
        debugger;
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
})(StkDefCategory || (StkDefCategory = {}));
//# sourceMappingURL=StkDefCategory.js.map