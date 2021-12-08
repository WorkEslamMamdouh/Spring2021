$(document).ready(function () {
    // ;
    StkDefUnitGroup.InitalizeComponent();
});
var StkDefUnitGroup;
(function (StkDefUnitGroup) {
    var sys = new SystemTools();
    var SysSession = GetSystemSession();
    var Selected_Data = new Array();
    var Data = new Array();
    var Details = new Array();
    var ModelGroup = new I_D_UnitGroup();
    var ModelGroupUom = new I_D_UnitGroupUom();
    var MasterModel = new UnitGroup();
    var Display_D_UOM = new Array();
    var compcode;
    var BranchCode;
    var Flag_Mastr;
    var txtUnitGrpCode;
    var txtDescA;
    var txtDescE;
    var txtRemarks;
    var btnAdd;
    var btnsave;
    var btnback;
    var btnEdit_1;
    var btnSave_1;
    var btnBack_1;
    var btnAddDetails;
    var txtUomID;
    var divGrid = new JsGrid();
    var CountGrid = 0;
    var CountUnit = 0;
    var UnitGrpID = 0;
    var lang = SysSession.CurrentEnvironment.ScreenLanguage;
    function InitalizeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "تعريف مجموعة الوحدات";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Define UnitGroup";
        }
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        InitalizeEvents();
        Display_UOM();
        Display();
    }
    StkDefUnitGroup.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        //HTMLButtonElement
        btnAdd = document.getElementById("btnAdd");
        btnEdit_1 = document.getElementById("btnEdit_1");
        btnSave_1 = document.getElementById("btnSave_1");
        btnBack_1 = document.getElementById("btnBack_1");
        btnAddDetails = document.getElementById("btnAddDetails");
        //HTMLInputElement
        txtUnitGrpCode = document.getElementById("txtUnitGrpCode");
        txtDescA = document.getElementById("txtDescA");
        txtDescE = document.getElementById("txtDescE");
        txtRemarks = document.getElementById("txtRemarks");
        //HTMLSelectElement
        txtUomID = document.getElementById("txtUomID");
    }
    function InitalizeEvents() {
        btnEdit_1.onclick = btnEdit_1_onclick;
        btnBack_1.onclick = btnBack_1_onclick;
        btnAdd.onclick = btnAdd_onClick;
        btnSave_1.onclick = Save_onClick;
        btnAddDetails.onclick = AddNewRow;
    }
    function Display() {
        // 
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("I_D_UnitGroup", "GetBycomp"),
            data: {
                Comp: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Selected_Data = result.Response;
                    for (var i = 0; i < Selected_Data.length; i++) {
                        var Display_UOM = Display_D_UOM.filter(function (x) { return x.UomID == Selected_Data[i].UomID; });
                        Selected_Data[i].Uomdesc = Display_UOM[0].DescA;
                    }
                    InitializeGrid();
                    divGrid.DataSource = Selected_Data;
                    divGrid.Bind();
                }
            }
        });
    }
    function InitializeGrid() {
        var res = GetResourceList("");
        divGrid.ElementName = "divGrid";
        divGrid.Paging = true;
        divGrid.PageSize = 10;
        divGrid.Sorting = true;
        divGrid.InsertionMode = JsGridInsertionMode.Binding;
        divGrid.Editing = false;
        divGrid.Inserting = false;
        divGrid.SelectedIndex = 1;
        divGrid.OnRowDoubleClicked = GridDoubleClick;
        divGrid.PrimaryKey = "UnitGrpID";
        divGrid.Columns = [
            { title: "ID", name: "UnitGrpID", type: "text", width: "2%", visible: false },
            { title: 'رقم ', name: "UnitGrpCode", type: "text", width: "10%" },
            { title: 'الوصف', name: (lang == "ar" ? "DescA" : "DescE"), type: "text", width: "35%" },
            { title: 'الوحدةالاساسيه  ', name: "Uomdesc", type: "text", width: "12%" },
            { title: 'الملاحظات', name: "Remarks", type: "text", width: "35%" },
        ];
    }
    function GridDoubleClick() {
        debugger;
        Flag_Mastr = '';
        $("#id_divGridDetails").removeClass("display_none");
        Data = new Array();
        Data = Selected_Data.filter(function (x) { return x.UnitGrpID == Number(divGrid.SelectedKey); });
        UnitGrpID = Data[0].UnitGrpID;
        DocumentActions.RenderFromModel(Data[0]);
        BindGetGridData(UnitGrpID);
    }
    function DisplayData(Selected_Data) {
        debugger;
        CountGrid = 0;
        BindGetGridData(Selected_Data[0].UnitGrpID);
    }
    function BindGetGridData(UomID) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("I_D_UnitGroupUom", "GetById"),
            data: { id: UomID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Details = result.Response;
                    $("#div_Data").html('');
                    CountGrid = 0;
                    for (var i = 0; i < Details.length; i++) {
                        BuildControls(i);
                        $("#txt_ID" + i).val(Details[i].UnitGrpUom);
                        $("#txt_UOM" + i).val(Details[i].UomID);
                        $("#txtRate" + i).val(Details[i].Rate);
                        if (Details[i].IsWholeSales == true) {
                            $('#IsWholeSales' + i).attr('checked', 'checked');
                        }
                        if (Details[i].IsPurchase == true) {
                            $('#ckIsPurchase' + i).attr('checked', 'checked');
                        }
                        if (Details[i].IsRetailSales == true) {
                            $('#IsRetail' + i).attr('checked', 'checked');
                        }
                        if (Details[i].IsStock == true) {
                            $('#IsStok' + i).attr('checked', 'checked');
                        }
                        $("#txt_StatusFlag" + i).val("");
                        $("#btn_minus3" + i).addClass("display_none");
                        CountGrid += 1;
                    }
                    $("#div_ContentDatacontrol").removeClass("display_none");
                }
            }
        });
    }
    function BuildControls(cnt) {
        var html;
        html = '<div id= "No_Row' + cnt + '" class="container-fluid style_border" > <div class="" > <div class="col-lg-12" > ' +
            '<span id="btn_minus' + cnt + '" class="fa fa-minus-circle fontitm6Processes display_none"></span>' +
            '<div class="col-lg-2  "><select id="txt_UOM' + cnt + '" class="form-control" disabled=""></select></div> ' +
            '<div class="col-lg-1" style=""><input id="txtRate' + cnt + '" type="number" disabled class="form-control right2"   value="0"/></div>' +
            '<div class="col-lg-1" style=""><input id="ckIsPurchase' + cnt + '" type="checkbox" disabled class="form-control right2"/></div>' +
            '<div class="col-lg-1" style=""><input id="IsRetail' + cnt + '" type="checkbox" disabled class="form-control right2"/></div>' +
            '<div class="col-lg-1" style=""><input id="IsWholeSales' + cnt + '" type="checkbox" disabled class="form-control right2"/></div>' +
            '<div class="col-lg-1" style=""><input id="IsStok' + cnt + '" type="checkbox" disabled class="form-control right2"/></div>' +
            '<div class="col-lg-2" style=""><input id="txt_StatusFlag' + cnt + '" name = " " type = "hidden" class="form-control"/><input id="txt_ID' + cnt + '" name = " " type = "hidden" class="form-control" /></div>';
        $("#div_Data").append(html);
        for (var i = 0; i < Display_D_UOM.length; i++) {
            $('#txt_UOM' + cnt).append('<option value="' + Display_D_UOM[i].UomID + '">' + (lang == "ar" ? Display_D_UOM[i].DescA : Display_D_UOM[i].DescE) + '</option>');
        }
        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });
        if (SysSession.CurrentPrivileges.Remove) {
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
        }
        else {
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
        }
        var dropddlUnit = '#txt_UOM' + cnt;
        $('#txt_UOM' + cnt).change(function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            if ($('#txt_UOM' + cnt).val() == "null") {
            }
            else {
                var selectedIUnit = $(dropddlUnit + ' option:selected').attr('value');
                var UnitID = Number(selectedIUnit);
                var res = false;
                res = checkRepeatedUOM(UnitID, cnt);
                if (res == true) {
                    $("#txt_UOM" + cnt).val("null");
                    DisplayMassage_Processes("لايمكن تكرار نفس الوحدة    !", "The same Unit cannot be duplicated on the Unit!", MessageType.Worning);
                }
            }
        });
        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });
        if (SysSession.CurrentPrivileges.Remove) {
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
        }
        else {
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
        }
        $("#txt_UOM" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtRate" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#IsWholeSales" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#IsRetail" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#IsStok" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#ckIsPurchase" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        return;
    }
    function ValidationHeader() {
        if ($('#txtUnitGrpCode').val().trim() == "") {
            DisplayMassage_Processes(" برجاء أدخل رقم  !", "must enter number of truck !", MessageType.Worning);
            Errorinput($('#txtUnitGrpCode'));
            return false;
        }
        else if ($('#txtDescA').val().trim() == "") {
            DisplayMassage_Processes(" برجاء أدخل وصف عربي!", "must enter name of Port of entry !", MessageType.Worning);
            Errorinput($('#txtDescA'));
            return false;
        }
        else if ($('#txtUomID').val() == "null") {
            DisplayMassage_Processes(" برجاء اختيار الوحدة الأساسية!", "must choose Vendor!", MessageType.Worning);
            Errorinput($('#txtUomID'));
            return false;
        }
        return true;
    }
    function Validation_Grid(rowcount) {
        if ($("#txtRate" + rowcount).val().trim() == "" && ($("#txt_StatusFlag" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage_Processes("  برجاءادخال معامل التحويل!", "must enter Type !", MessageType.Worning);
            Errorinput($("#txtRate" + rowcount));
            return false;
        }
        return true;
    }
    function btnEdit_1_onclick() {
        if (SysSession.CurrentPrivileges.EDIT == true) {
            $("#btnSave_1").toggleClass("display_none");
            $("#btnBack_1").toggleClass("display_none");
            $("#btnEdit_1").toggleClass("display_none");
            $("#div_ContentData :input").removeAttr("disabled");
            $("#div_ContentDatacontrol :input").removeAttr("disabled");
            $("#MasterGrid").addClass("disabledDiv");
            $("#btnAddDetails").removeClass("display_none");
            $(".fontitm6Processes").removeClass("display_none");
            $(".fontitm6Processes").removeAttr("disabled");
            Flag_Mastr = 'u';
        }
    }
    function btnBack_1_onclick() {
        if (SysSession.CurrentPrivileges.EDIT == true) {
            $("#btnSave_1").toggleClass("display_none");
            $("#btnBack_1").toggleClass("display_none");
            //$("#btnAdd").toggleClass("display_none");
            $("#btnAddDetails").toggleClass("display_none");
            $("#btnAdd").removeClass("display_none");
            $("#div_ContentData :input").attr("disabled");
            $("#div_ContentDatacontrol :input").attr("disabled");
            $("#btnEdit_1").toggleClass("display_none");
            $("#ID_Print").toggleClass("disabled");
            $("#div_ContentData :input").attr("disabled", "true");
            $("#div_ContentDatacontrol :input").attr("disabled", "true");
            $("#btnEdit_1").removeAttr("disabled");
            $("#ID_Print").removeAttr("disabled");
            $("#btnAdd").removeAttr("disabled");
            $("#MasterGrid").removeClass("disabledDiv");
            Flag_Mastr = '';
            GridDoubleClick();
        }
    }
    function btnAdd_onClick() {
        txtUnitGrpCode.value = "";
        txtDescA.value = "";
        txtDescE.value = "";
        txtRemarks.value = "";
        $("#txtUomID").val("null");
        $("#div_Data").html("");
        $("#btnAddDetails").removeClass("display_none");
        $("#div_ContentDatacontrol").removeClass("display_none");
        $("#MasterGrid").addClass("disabledDiv");
        $("#id_divGridDetails").removeClass("display_none");
        $("#div_ContentDatacontrol :input").prop("disabled", false);
        $("#div_ContentData :input").removeAttr("disabled");
        $("#div_ContentDatacontrol :input").removeAttr("disabled");
        $("#btnSave_1").removeClass("display_none");
        $("#btnBack_1").removeClass("display_none");
        $("#btnEdit_1").addClass("display_none");
        $("#btnAdd").addClass("display_none");
        $(".fontitm6Processes").removeClass("display_none");
        $(".fontitm6Processes").removeAttr("disabled");
        CountGrid = 0;
        Flag_Mastr = 'i';
    }
    function DeleteRow(RecNo) {
        if (!SysSession.CurrentPrivileges.Remove)
            return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", function () {
            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d');
            $("#No_Row" + RecNo).attr("hidden", "true");
        });
    }
    function checkRepeatedUOM(UOMValue, cnt) {
        var UOM = Number(CountGrid); //Error
        var flag = false;
        for (var i = 0; i < UOM; i++) {
            if (Number($("#txt_UOM" + i).val()) == UOMValue && i != cnt) {
                flag = true;
            }
        }
        return flag;
    }
    function Display_UOM() {
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
                    DocumentActions.FillCombowithdefult(Display_D_UOM, txtUomID, "UomID", (lang == "ar" ? "DescA" : "DescL"), (lang == "ar" ? "اختر الوحده الاساسية" : "Select Category"));
                }
            }
        });
    }
    function AddNewRow() {
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        BuildControls(CountGrid);
        $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode  
        $("#ddlFamily" + CountGrid).removeAttr("disabled");
        $("#ddlItem" + CountGrid).removeAttr("disabled");
        $("#txtQuantity" + CountGrid).removeAttr("disabled");
        $("#txtPrice" + CountGrid).removeAttr("disabled");
        $("#txtMinPrice" + CountGrid).removeAttr("disabled");
        $("#btn_minus" + CountGrid).removeClass("display_none");
        $("#btn_minus" + CountGrid).removeAttr("disabled");
        $("#div_Data :input").prop("disabled", false);
        $("#btn_minus" + CountGrid).removeClass("display_none");
        $("#btn_minus" + CountGrid).removeAttr("disabled");
        CountGrid += 1;
    }
    function Save_onClick() {
        if (!ValidationHeader())
            return;
        var CanAdd = true;
        if (CountGrid > 0) {
            for (var i = 0; i < CountGrid; i++) {
                CanAdd = Validation_Grid(i);
                if (CanAdd == false) {
                    break;
                }
            }
        }
        if (CanAdd) {
            var id = divGrid.SelectedKey;
            Assign();
            ModelGroup = new I_D_UnitGroup();
            DocumentActions.AssignToModel(ModelGroup);
            ModelGroup.StatusFlag = Flag_Mastr;
            ModelGroup.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
            if (Flag_Mastr == 'i') {
                ModelGroup.CreatedBy = SysSession.CurrentEnvironment.UserCode;
                ModelGroup.CreatedAt = DateTimeFormat(Date().toString());
            }
            else {
                ModelGroup.UpdatedAt = DateTimeFormat(Date().toString());
                ModelGroup.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
            }
            ModelGroup.UnitGrpID = UnitGrpID;
            MasterModel.I_D_UnitGroup = ModelGroup;
            Ajax.Callsync({
                type: "Post",
                url: sys.apiUrl("I_D_UnitGroup", "Update"),
                data: JSON.stringify(MasterModel),
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess == true) {
                        UnitGrpID = d.result;
                        DisplayMassage("تم الحفظ", "saved success", MessageType.Succeed);
                        if (Flag_Mastr == 'i') {
                            DisplayMassage("تم الحفظ", "saved success", MessageType.Succeed);
                        }
                        else {
                            DisplayMassage(" تم التعديل بنجاح ", "update success", MessageType.Succeed);
                        }
                        Display();
                        btnBack_1_onclick();
                        Flag_Mastr = '';
                        $("#id_divGridDetails").removeClass("display_none");
                        Data = new Array();
                        Data = Selected_Data.filter(function (x) { return x.UnitGrpID == Number(UnitGrpID); });
                        UnitGrpID = Data[0].UnitGrpID;
                        DocumentActions.RenderFromModel(Data[0]);
                        BindGetGridData(Data[0].UomID);
                    }
                    else {
                        DisplayMassage("الرجاء تحديث الصفحة واعادت تكرارالمحاولة مره اخري ", "Please refresh the page and try again", MessageType.Error);
                    }
                }
            });
        }
    }
    function Assign() {
        MasterModel = new UnitGroup();
        var StatusFlag;
        for (var i = 0; i < CountGrid; i++) {
            ModelGroupUom = new I_D_UnitGroupUom();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            if (StatusFlag == "i") {
                ModelGroupUom.UnitGrpID = UnitGrpID;
                ModelGroupUom.StatusFlag = StatusFlag.toString();
                ModelGroupUom.UnitGrpUom = 0;
                ModelGroupUom.UomID = $("#txt_UOM" + i).val();
                ModelGroupUom.IsWholeSales = $("#IsWholeSales" + i).val();
                ModelGroupUom.IsPurchase = $("#ckIsPurchase" + i).val();
                ModelGroupUom.IsRetailSales = $("#IsRetail" + i).val();
                ModelGroupUom.IsStock = $("#IsStok" + i).val();
                ModelGroupUom.Rate = $("#txtRate" + i).val();
                ModelGroupUom.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
                ModelGroupUom.CreatedBy = SysSession.CurrentEnvironment.UserCode;
                ModelGroupUom.CreatedAt = DateTimeFormat(Date().toString());
                if ($("#IsWholeSales" + i).is(":checked")) {
                    ModelGroupUom.IsWholeSales = true;
                }
                else {
                    ModelGroupUom.IsWholeSales = false;
                }
                if ($("#ckIsPurchase" + i).is(":checked")) {
                    ModelGroupUom.IsPurchase = true;
                }
                else {
                    ModelGroupUom.IsPurchase = false;
                }
                if ($("#IsRetail" + i).is(":checked")) {
                    ModelGroupUom.IsRetailSales = true;
                }
                else {
                    ModelGroupUom.IsRetailSales = false;
                }
                if ($("#IsStok" + i).is(":checked")) {
                    ModelGroupUom.IsStock = true;
                }
                else {
                    ModelGroupUom.IsStock = false;
                }
                MasterModel.I_D_UnitGroupUom.push(ModelGroupUom);
            }
            if (StatusFlag == "u") {
                ModelGroupUom.UnitGrpID = UnitGrpID;
                ModelGroupUom.StatusFlag = $("#txt_StatusFlag" + i).val();
                ModelGroupUom.UomID = $("#txt_UOM" + i).val();
                ModelGroupUom.UnitGrpUom = $("#txt_ID" + i).val();
                ModelGroupUom.IsWholeSales = $("#IsWholeSales" + i).val();
                ModelGroupUom.IsPurchase = $("#ckIsPurchase" + i).val();
                ModelGroupUom.IsRetailSales = $("#IsRetail" + i).val();
                ModelGroupUom.IsStock = $("#IsStok" + i).val();
                ModelGroupUom.Rate = $("#txtRate" + i).val();
                ModelGroupUom.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
                ModelGroupUom.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
                ModelGroupUom.UpdatedAt = DateTimeFormat(Date().toString());
                if ($("#IsWholeSales" + i).is(":checked")) {
                    ModelGroupUom.IsWholeSales = true;
                }
                else {
                    ModelGroupUom.IsWholeSales = false;
                }
                if ($("#ckIsPurchase" + i).is(":checked")) {
                    ModelGroupUom.IsPurchase = true;
                }
                else {
                    ModelGroupUom.IsPurchase = false;
                }
                if ($("#IsRetail" + i).is(":checked")) {
                    ModelGroupUom.IsRetailSales = true;
                }
                else {
                    ModelGroupUom.IsRetailSales = false;
                }
                if ($("#IsStok" + i).is(":checked")) {
                    ModelGroupUom.IsStock = true;
                }
                else {
                    ModelGroupUom.IsStock = false;
                }
                MasterModel.I_D_UnitGroupUom.push(ModelGroupUom);
            }
            if (StatusFlag == "d") {
                if ($("#txt_UOM" + i).val() != "") {
                    ModelGroupUom.UnitGrpID = UnitGrpID;
                    ModelGroupUom.UnitGrpUom = $("#txt_ID" + i).val();
                    ModelGroupUom.StatusFlag = $("#txt_StatusFlag" + i).val();
                    ModelGroupUom.UomID = $("#txt_UOM" + i).val();
                    ModelGroupUom.IsWholeSales = $("#IsWholeSales" + i).val();
                    ModelGroupUom.IsPurchase = $("#ckIsPurchase" + i).val();
                    ModelGroupUom.IsRetailSales = $("#IsRetail" + i).val();
                    ModelGroupUom.IsStock = $("#IsStok" + i).val();
                    ModelGroupUom.Rate = $("#txtRate" + i).val();
                    ModelGroupUom.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
                    ModelGroupUom.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
                    ModelGroupUom.UpdatedAt = DateTimeFormat(Date().toString());
                    if ($("#IsWholeSales" + i).is(":checked")) {
                        ModelGroupUom.IsWholeSales = true;
                    }
                    else {
                        ModelGroupUom.IsWholeSales = false;
                    }
                    if ($("#ckIsPurchase" + i).is(":checked")) {
                        ModelGroupUom.IsPurchase = true;
                    }
                    else {
                        ModelGroupUom.IsPurchase = false;
                    }
                    if ($("#IsRetail" + i).is(":checked")) {
                        ModelGroupUom.IsRetailSales = true;
                    }
                    else {
                        ModelGroupUom.IsRetailSales = false;
                    }
                    if ($("#IsStok" + i).is(":checked")) {
                        ModelGroupUom.IsStock = true;
                    }
                    else {
                        ModelGroupUom.IsStock = false;
                    }
                    MasterModel.I_D_UnitGroupUom.push(ModelGroupUom);
                }
            }
        }
    }
})(StkDefUnitGroup || (StkDefUnitGroup = {}));
//# sourceMappingURL=StkDefUnitGroup.js.map