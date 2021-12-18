$(document).ready(function () {
    ////debugger;
    Income_expenses.InitalizeComponent();
});
var Income_expenses;
(function (Income_expenses) {
    var CompCode;
    var SysSession = GetSystemSession();
    var sys = new SystemTools();
    //Arrays
    var UserDetails = new Array();
    var ListPayType = new Array();
    var DetailsSupplier = new Array();
    var DetailsCUSTOMER = new Array();
    var DetailsSalesman = new Array();
    //texts
    var txtFromDate;
    var txtToDate;
    var ddlUserMaster;
    var ddlType;
    var txt_PayTypeNew;
    //Buttons
    var btnBen;
    var btnPrint;
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var compcode; //SharedSession.CurrentEnvironment.CompCode;
    var BranchCode; //SharedSession.CurrentEnvironment.BranchCode;
    var CUSTOMER_ID = null;
    var ID_Supplier = null;
    var SalesmanId = null;
    var ID_Code = null;
    function InitalizeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "كشف حساب";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Payment Permission";
        }
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        FillddlUserMaster();
        IntializeEvents();
        txtFromDate.value = SysSession.CurrentEnvironment.StartDate;
        txtToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        FillddlPayType();
    }
    Income_expenses.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        debugger;
        if (SysSession.CurrentEnvironment.ScreenLanguage = "ar") {
            document.getElementById('Screen_name').innerHTML = "كشف حساب ";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Account Statment";
        }
        CompCode = Number(SysSession.CurrentEnvironment.CompCode);
        ////Drop Downlists
        txtFromDate = document.getElementById("txtFromDate");
        txtToDate = document.getElementById("txtToDate");
        ddlUserMaster = document.getElementById("ddlUserMaster");
        ddlType = document.getElementById("ddlType");
        txt_PayTypeNew = document.getElementById("txt_PayTypeNew");
        btnBen = document.getElementById("btnBen");
        btnPrint = document.getElementById("btnPrint");
        btnPrintTrview = document.getElementById("btnPrintTrview");
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF");
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL");
        txtFromDate.value = SysSession.CurrentEnvironment.StartDate;
        txtToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
    }
    function IntializeEvents() {
        btnBen.onclick = SearchAll;
        ddlType.onchange = ddlType_onchange;
        txt_PayTypeNew.onchange = txt_PayTypeNew_onchange;
        btnPrint.onclick = function () { printreport(4); };
        btnPrintTrview.onclick = function () { printreport(1); };
        btnPrintTrPDF.onclick = function () { printreport(2); };
        btnPrintTrEXEL.onclick = function () { printreport(3); };
    }
    function ddlType_onchange() {
        if (ddlType.value == '1') {
            $("#Div_Pay").removeClass("display_none");
            $("#txt_PayTypeNew").val('null');
            $("#txt_BenName").val('');
            $("#txt_BenCode").val('');
            CUSTOMER_ID = null;
            ID_Supplier = null;
            SalesmanId = null;
            ID_Code = null;
        }
        else {
            $("#Div_Pay").addClass("display_none");
            $("#txt_PayTypeNew").val('null');
            $("#txt_BenName").val('');
            $("#txt_BenCode").val('');
            CUSTOMER_ID = null;
            ID_Supplier = null;
            SalesmanId = null;
            ID_Code = null;
        }
    }
    function txt_PayTypeNew_onchange() {
        $("#txt_BenCode").val('');
        $('#txt_BenName').val('');
        CUSTOMER_ID = null;
        ID_Supplier = null;
        SalesmanId = null;
        ID_Code = null;
    }
    function GetDate() {
        debugger;
        var today = new Date();
        var dd = today.getDate().toString();
        var ReturnedDate;
        var mm = (today.getMonth() + 1).toString();
        var yyyy = today.getFullYear();
        if (Number(dd) < 10) {
            dd = ('0' + dd);
        }
        if (Number(mm) < 10) {
            mm = ('0' + mm);
        }
        ReturnedDate = yyyy + '-' + mm + '-' + dd;
        return ReturnedDate;
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
                    DocumentActions.FillComboFirstvalue(ListPayType, txt_PayTypeNew, "CodeValue", "" + (lang == "ar" ? "DescA" : "DescE") + "", "" + (lang == "ar" ? " - اختر -" : " - Choose -") + "", null);
                }
            }
        });
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
            ID_Code = uesr[0].USER_CODE;
            $("#txt_BenCode").val(uesr[0].ID_Code);
            $('#txt_BenName').val(uesr[0].USER_NAME);
        }
        else {
            $("#txt_BenCode").val('');
            $('#txt_BenName').val('');
        }
    }
    function printreport(type) {
        debugger;
        //let UserVal = ddlUserMaster.value == "null" ? "All" : ddlUserMaster.value;
        var DType = ddlType.value == "1" ? "1" : "2";
        var _StockList = new Array();
        var _Stock = new Settings_Report();
        if (DType == "1") {
            _Stock.ID_Button_Print = 'ACCstament1';
        }
        else {
            _Stock.ID_Button_Print = 'ACCstament2';
        }
        var ID_Peneficiary = txt_PayTypeNew.value == 'null' ? null : Number(txt_PayTypeNew.value);
        _Stock.Parameter_1 = txtFromDate.value;
        _Stock.Parameter_2 = txtToDate.value;
        _Stock.Parameter_3 = ID_Code == null ? "All" : ID_Supplier.toString();
        ;
        _Stock.Parameter_4 = DType;
        _Stock.Parameter_5 = compcode.toString();
        _Stock.Parameter_6 = ID_Supplier == null ? 0 : ID_Supplier.toString();
        _Stock.Parameter_7 = SalesmanId == null ? 0 : SalesmanId.toString();
        _Stock.Parameter_8 = CUSTOMER_ID == null ? 0 : CUSTOMER_ID.toString();
        _Stock.Parameter_9 = ID_Peneficiary == null ? '0' : ID_Peneficiary.toString();
        _StockList.push(_Stock);
        var rp = new ReportParameters();
        rp.Data_Report = JSON.stringify(_StockList); //output report as View
        Ajax.Callsync({
            url: Url.Action("Data_Report_Open", "GeneralReports"),
            data: rp,
            success: function (d) {
                debugger;
                var result = d.result;
                window.open(result, "_blank");
            }
        });
    }
})(Income_expenses || (Income_expenses = {}));
//# sourceMappingURL=Income_expenses.js.map