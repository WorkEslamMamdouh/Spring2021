$(document).ready(function () {
    AccTrPaymentNote.InitalizeComponent();
});
var AccTrPaymentNote;
(function (AccTrPaymentNote) {
    var IQ_TrType = 2;
    var AccType = 2;
    //var TrType = 1;
    var codeType = "PayType";
    var ReportGrid = new JsGrid();
    var sys = new SystemTools();
    var SysSession = GetSystemSession();
    var UserDetails = new Array();
    var ListPayType = new Array();
    var Get_IQ_IQ_Catch_Receipt = new Array();
    var SearchDetails = new Array();
    var Selected_Data = new Array();
    var DetailsSupplier = new Array();
    var DetailsCUSTOMER = new Array();
    var DetailsSalesman = new Array();
    var Model = new Outlet();
    var txtDateFrom;
    var txtDateTo;
    var ddlUserMaster;
    var txt_PayType;
    var txt_PayTypeNew;
    var txtCashTypeNew;
    var txt_BankAcc_Code;
    var txt_CODE;
    var txt_note;
    var searchbutmemreport;
    var btnBen;
    var btnback;
    var btnShow;
    var btnAdd;
    var btnEdit;
    var btnsave;
    var compcode; //SharedSession.CurrentEnvironment.CompCode;
    var BranchCode; //SharedSession.CurrentEnvironment.BranchCode;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var ID_Receipt = 0;
    var NewAdd = false;
    var CUSTOMER_ID = null;
    var ID_Supplier = null;
    var SalesmanId = null;
    var ID_Code = null;
    function InitalizeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "إذن صرف";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Payment Permission";
        }
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        InitalizeEvents();
        txtDateFrom.value = SysSession.CurrentEnvironment.StartDate;
        txtDateTo.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        FillddlUserMaster();
        FillddlPayType();
    }
    AccTrPaymentNote.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        btnShow = document.getElementById("btnShow");
        btnAdd = document.getElementById("btnAdd");
        btnEdit = document.getElementById("btnedite");
        btnsave = document.getElementById("btnsave");
        btnback = document.getElementById("btnback");
        btnBen = document.getElementById("btnBen");
        txt_CODE = document.getElementById("txt_CODE");
        txtDateFrom = document.getElementById("txtDateFrom");
        txtDateTo = document.getElementById("txtDateTo");
        txt_note = document.getElementById("txt_note");
        searchbutmemreport = document.getElementById("searchbutmemreport");
        ddlUserMaster = document.getElementById("ddlUserMaster");
        txt_PayType = document.getElementById("txt_PayType");
        txt_PayTypeNew = document.getElementById("txt_PayTypeNew");
    }
    function InitalizeEvents() {
        btnShow.onclick = btnShow_onclick;
        btnAdd.onclick = btnAdd_onclick;
        btnsave.onclick = btnsave_onClick;
        btnback.onclick = btnback_onclick;
        btnBen.onclick = SearchAll;
        btnEdit.onclick = btnEdit_onclick;
        searchbutmemreport.onkeyup = _SearchBox_Change;
        txt_PayTypeNew.onchange = txt_PayTypeNew_onchange;
    }
    function txt_PayTypeNew_onchange() {
        $("#txt_BenCode").val('');
        $('#txt_BenName').val('');
    }
    function FillddlUserMaster() {
        debugger;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("G_USERS", "GetAllUser"),
            data: {},
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    UserDetails = result.Response;
                    debugger;
                    DocumentActions.FillCombowithdefult(UserDetails, ddlUserMaster, "USER_CODE", "USER_CODE", "اختار البائع");
                }
            }
        });
    }
    function FillddlPayType() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GCodes", "GetbycodeTp"),
            data: { CodeType: "PayType", UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    ListPayType = result.Response;
                    DocumentActions.FillComboFirstvalue(ListPayType, txt_PayType, "CodeValue", "" + (lang == "ar" ? "DescA" : "DescE") + "", "" + (lang == "ar" ? " - اختر -" : " - Choose -") + "", null);
                    DocumentActions.FillComboFirstvalue(ListPayType, txt_PayTypeNew, "CodeValue", "" + (lang == "ar" ? "DescA" : "DescE") + "", "" + (lang == "ar" ? " - اختر -" : " - Choose -") + "", null);
                }
            }
        });
    }
    function btnShow_onclick() {
        $('#divMasterGridiv').removeClass('display_none');
        Display();
    }
    function btnEdit_onclick() {
        Remove();
        $("#DivHederMaster").addClass("disabledDiv");
    }
    function btnAdd_onclick() {
        NewAdd = true;
        Remove();
        $("#Div_control").removeClass("display_none");
        $("#Div_control :input").val("");
        txt_PayTypeNew.value = "null";
        $("#DivHederMaster").addClass("disabledDiv");
        txt_PayTypeNew.focus();
    }
    function btnsave_onClick() {
        if (!ValidationHeader())
            return;
        if (NewAdd == true) {
            Insert();
        }
        else {
            Update();
        }
    }
    function btnback_onclick() {
        $("#DivHederMaster").removeClass("disabledDiv");
        if (NewAdd == true) {
            $("#Div_control").addClass("display_none");
        }
        else {
            MasterGridDoubleClick();
        }
    }
    function Display() {
        debugger;
        var startdt = DateFormatDataBes(txtDateFrom.value).toString();
        var enddt = DateFormatDataBes(txtDateTo.value).toString();
        var ID_Peneficiary = txt_PayType.value == 'null' ? 0 : Number(txt_PayType.value);
        var USER_CODE = ddlUserMaster.value == 'null' ? "" : ddlUserMaster.value;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Outletpirce", "GetAllPay"),
            data: { CompCode: compcode, BranchCode: BranchCode, startDate: startdt, endDate: enddt, ID_Peneficiary: ID_Peneficiary, USER_CODE: USER_CODE },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Get_IQ_IQ_Catch_Receipt = result.Response;
                    for (var i = 0; i < Get_IQ_IQ_Catch_Receipt.length; i++) {
                        Get_IQ_IQ_Catch_Receipt[i].Date = DateFormat(Get_IQ_IQ_Catch_Receipt[i].Date);
                        if (Get_IQ_IQ_Catch_Receipt[i].ID_Peneficiary != null && Get_IQ_IQ_Catch_Receipt[i].ID_Peneficiary != 0) {
                            var PayType = ListPayType.filter(function (x) { return x.CodeValue == Get_IQ_IQ_Catch_Receipt[i].ID_Peneficiary; });
                            Get_IQ_IQ_Catch_Receipt[i].PayTypeDescA = PayType[0].DescA;
                        }
                    }
                    InitializeGrid();
                    ReportGrid.DataSource = Get_IQ_IQ_Catch_Receipt;
                    ReportGrid.Bind();
                }
            }
        });
    }
    function _SearchBox_Change() {
        if (searchbutmemreport.value != "") {
            var search_1 = searchbutmemreport.value.toLowerCase();
            SearchDetails = Get_IQ_IQ_Catch_Receipt.filter(function (x) { return x.Dasc_Name.toString().search(search_1) >= 0 || x.id.toString().search(search_1) >= 0; });
            ReportGrid.DataSource = SearchDetails;
            ReportGrid.Bind();
        }
        else {
            ReportGrid.DataSource = Get_IQ_IQ_Catch_Receipt;
            ReportGrid.Bind();
        }
    }
    function InitializeGrid() {
        //let res: any = GetResourceList("");
        ReportGrid.ElementName = "ReportGrid";
        ReportGrid.Paging = true;
        ReportGrid.PageSize = 10;
        ReportGrid.Sorting = true;
        ReportGrid.InsertionMode = JsGridInsertionMode.Binding;
        ReportGrid.Editing = false;
        ReportGrid.Inserting = false;
        ReportGrid.SelectedIndex = 1;
        ReportGrid.OnRowDoubleClicked = MasterGridDoubleClick;
        ReportGrid.PrimaryKey = "id";
        ReportGrid.Columns = [
            { title: "id", name: "id", type: "text", width: "2%", visible: false },
            { title: "رقم الصرف", name: "id", type: "text", width: "18%" },
            { title: " نوع الصرف", name: "PayTypeDescA", type: "text", width: "35%" },
            { title: " الوصف", name: "Dasc_Name", type: "text", width: "35%" },
            { title: "التاريخ", name: "Date", type: "text", width: "20%" },
            { title: "المستخدم", name: "USER_CODE", type: "text", width: "25%" },
        ];
    }
    function MasterGridDoubleClick() {
        Selected_Data = new Array();
        Selected_Data = Get_IQ_IQ_Catch_Receipt.filter(function (x) { return x.id == Number(ReportGrid.SelectedKey); });
        DisplayData(Selected_Data);
    }
    function DisplayData(Selected_Data) {
        NewAdd = false;
        $("#DivHederMaster").removeClass("disabledDiv");
        $("#Div_control :input").attr("disabled", "disabled");
        $("#Div_control").removeClass("display_none");
        $("#btnedite").removeClass("display_none");
        $("#btnsave").removeAttr("disabled");
        $("#btnback").removeAttr("disabled");
        $("#btnedite").removeAttr("disabled");
        $("#btnback").addClass("display_none");
        $("#btnsave").addClass("display_none");
        DocumentActions.RenderFromModel(Selected_Data[0]);
        ID_Receipt = Selected_Data[0].id;
        if (Selected_Data[0].ID_Peneficiary == 1) {
            GetCUSTOMER(Selected_Data[0].CUSTOMER_ID);
        }
        else if (Selected_Data[0].ID_Peneficiary == 2) {
            GetSupplier(Selected_Data[0].ID_Supplier);
        }
        else if (Selected_Data[0].ID_Peneficiary == 3) {
            GetSalesman(Selected_Data[0].SalesmanId);
        }
        else if (Selected_Data[0].ID_Peneficiary == 4) {
            GetUser(Selected_Data[0].ID_Code);
        }
        else {
            $("#txt_BenCode").val('');
            $('#txt_BenName').val('');
        }
    }
    function SearchAll() {
        if (txt_PayTypeNew.value == '1') {
            SearchCUSTOMER();
        }
        else if (txt_PayTypeNew.value == '2') {
            SearchSupplier();
        }
        else if (txt_PayTypeNew.value == '3') {
            SearchSalesman();
        }
        else if (txt_PayTypeNew.value == '4') {
            SearchUser();
        }
        else {
            DisplayMassage("يجب اختيار نوع الصرف", "You must enter a valid email", MessageType.Worning);
            Errorinput($('#txt_PayTypeNew'));
        }
    }
    function SearchCUSTOMER() {
        var sys = new SystemTools();
        sys.FindKey(Modules.Catch_Receipt, "btnCustomerSearch", " Debit > 0 and CompCode =" + compcode + "", function () {
            var CUST_ID = SearchGrid.SearchDataGrid.SelectedKey;
            CUSTOMER_ID = CUST_ID;
            ID_Supplier = null;
            SalesmanId = null;
            ID_Code = null;
            GetCUSTOMER(CUSTOMER_ID);
        });
    }
    function SearchSupplier() {
        var sys = new SystemTools();
        sys.FindKey(Modules.Purchases, "btnSupplierSearch", " CompCode =" + compcode + "", function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            ID_Supplier = id;
            CUSTOMER_ID = null;
            SalesmanId = null;
            ID_Code = null;
            GetSupplier(ID_Supplier);
        });
    }
    function SearchSalesman() {
        var sys = new SystemTools();
        sys.FindKey(Modules.PaymentNote, "btnSalesmanSearch", " CompCode =" + compcode + "", function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            SalesmanId = id;
            CUSTOMER_ID = null;
            ID_Supplier = null;
            ID_Code = null;
            GetSalesman(id);
        });
    }
    function SearchUser() {
        var sys = new SystemTools();
        sys.FindKey(Modules.PaymentNote, "btnSearchUser", " CompCode =" + compcode + "", function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            ID_Code = id;
            CUSTOMER_ID = null;
            ID_Supplier = null;
            SalesmanId = null;
            GetUser(ID_Code);
        });
    }
    function GetCUSTOMER(id) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Customer", "GetAllbyid"),
            data: { id: id },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    DetailsCUSTOMER = result.Response;
                    if (DetailsCUSTOMER.length > 0) {
                        $("#txt_BenCode").val(DetailsCUSTOMER[0].CUSTOMER_ID);
                        $('#txt_BenName').val(DetailsCUSTOMER[0].CUSTOMER_NAME);
                    }
                    else {
                        $("#txt_BenCode").val('');
                        $('#txt_BenName').val('');
                    }
                }
            }
        });
    }
    function GetSupplier(id) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Supplier", "GetAll_Item_by_Cat"),
            data: { ID_Supplier: id },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    DetailsSupplier = result.Response;
                    if (DetailsSupplier.length > 0) {
                        $("#txt_BenCode").val(DetailsSupplier[0].ID_Supplier);
                        $('#txt_BenName').val(DetailsSupplier[0].Name_Supplier);
                    }
                    else {
                        $("#txt_BenCode").val('');
                        $('#txt_BenName').val('');
                    }
                }
            }
        });
    }
    function GetSalesman(id) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefSalesMen", "GetById"),
            data: { id: id },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    DetailsSalesman[0] = result.Response;
                    if (DetailsSalesman[0] != null) {
                        $("#txt_BenCode").val(DetailsSalesman[0].SalesmanId);
                        $('#txt_BenName').val(DetailsSalesman[0].NameA);
                    }
                    else {
                        $("#txt_BenCode").val('');
                        $('#txt_BenName').val('');
                    }
                }
            }
        });
    }
    function GetUser(id) {
        var uesr = UserDetails.filter(function (x) { return x.ID_Code == id; });
        if (uesr.length > 0) {
            $("#txt_BenCode").val(uesr[0].ID_Code);
            $('#txt_BenName').val(uesr[0].USER_NAME);
        }
        else {
            $("#txt_BenCode").val('');
            $('#txt_BenName').val('');
        }
    }
    function Assign() {
        Model = new Outlet();
        DocumentActions.AssignToModel(Model);
        Model.BranchCode = BranchCode;
        Model.CompCode = compcode;
        Model.ID_Supplier = ID_Supplier;
        Model.SalesmanId = SalesmanId;
        Model.CUSTOMER_ID = CUSTOMER_ID;
        Model.ID_Code = ID_Code;
        Model.pirce = Number($('#txt_Amount').val());
        Model.Remark = $('#txt_note').val();
        Model.UserCode = SysSession.CurrentEnvironment.UserCode;
    }
    function Insert() {
        Assign();
        Model.CreatedAt = DateTimeFormat(Date().toString());
        Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("Outletpirce", "Insert"),
            data: JSON.stringify(Model),
            success: function (d) {
                debugger;
                var result = d;
                if (result.IsSuccess == true) {
                    ID_Receipt = result.Response;
                    success();
                }
                else {
                    MessageBox.Show(result.ErrorMessage, "خطأ");
                }
            }
        });
    }
    function Update() {
        Assign();
        Model.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        Model.UpdatedAt = DateTimeFormat(Date().toString());
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("Outletpirce", "Update"),
            data: JSON.stringify(Model),
            success: function (d) {
                debugger;
                var result = d;
                if (result.IsSuccess == true) {
                    ID_Receipt = result.Response;
                    success();
                }
                else {
                    MessageBox.Show(result.ErrorMessage, "خطأ");
                }
            }
        });
    }
    function ValidationHeader() {
        if (txt_PayTypeNew.value == "null") {
            DisplayMassage(" برجاء اختيار نوع الصرف", "Please select a Salesman", MessageType.Error);
            Errorinput(txt_PayTypeNew);
            return false;
        }
        if ($("#txt_BenCode").val().trim() == "") {
            DisplayMassage(" برجاء اختيار المستفيد", "Please select a Date", MessageType.Error);
            Errorinput($("#txt_BenCode"));
            return false;
        }
        if (Number($("#txt_Amount").val()) <= 0) {
            DisplayMassage(" برجاء ادخال المبلغ", "Please select a Date", MessageType.Error);
            Errorinput($("#txt_Amount"));
            return false;
        }
        return true;
    }
    function success() {
        Display();
        Selected_Data = new Array();
        Selected_Data = Get_IQ_IQ_Catch_Receipt.filter(function (x) { return x.id == Number(ID_Receipt); });
        DisplayData(Selected_Data);
    }
    function Remove() {
        $("#btnBen").removeAttr("disabled");
        $("#txt_PayTypeNew").removeAttr("disabled");
        //$("#txt_ReceiptDesc").removeAttr("disabled");
        $("#txt_note").removeAttr("disabled");
        $("#txt_Amount").removeAttr("disabled");
        $("#btnback").removeClass("display_none");
        $("#btnsave").removeClass("display_none");
        $("#btnedite").addClass("display_none");
    }
})(AccTrPaymentNote || (AccTrPaymentNote = {}));
//# sourceMappingURL=AccTrPaymentNote.js.map