$(document).ready(function () {
    SlsTrSalesReturn.InitalizeComponent();
});
var SlsTrSalesReturn;
(function (SlsTrSalesReturn) {
    //system varables
    var SysSession = GetSystemSession();
    var compcode;
    var BranchCode;
    var sys = new SystemTools();
    var vatType;
    var Finyear;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var Screen_name = '';
    var InvoiceType = 0; // 1:Retail invoice , 2: Wholesale invoice            
    var SlsInv = $('#SlsInvType').val();
    if (SlsInv == "1") { //  1:Retail invoice 
        InvoiceType = 1;
        (lang == "ar" ? Screen_name = 'مرتجع التجزئه' : Screen_name = 'Return Retail invoice');
    }
    else { //2: Wholesale invoice 
        InvoiceType = 2;
        (lang == "ar" ? Screen_name = 'مرتجع الجمله' : Screen_name = 'Return Wholesale invoice');
    }
    //ddl
    var ddlCustomer;
    var ddlSalesMan;
    var ddlStateType;
    var ddlFreeSalesman;
    var ddlReturnType;
    var ddlReturnTypeShow;
    var ddlShowFreeReturn;
    var ddlCashBox;
    var ddlTaxTypeHeader;
    var searchbutmemreport;
    // Arrays
    var GetItemInfo = new Array();
    var CustDetails = new Array();
    var AddReturnDetailsAr = new Array();
    var AddReturnDetailsEn = new Array();
    var StateDetailsAr = new Array();
    var StateDetailsEn = new Array();
    var SlsInvoiceStatisticsDetails = new Array();
    var SearchDetails = new Array();
    var SlsInvoiceItemsDetails = new Array();
    var Selecteditem = new Array();
    var SalesmanDetails = new Array();
    var cashboxDetails = new Array();
    var VatDetails = new Array();
    //Model
    var InvoiceStatisticsModel = new Array();
    var InvoicemodelForReturn = new Array();
    var MasterDetailModel = new SlsInvoiceMasterDetails();
    var InvoiceModel = new I_Sls_TR_Invoice();
    var invoiceItemsModel = new Array();
    var invoiceItemSingleModel = new I_Sls_TR_InvoiceItems();
    //TextBoxes
    var txtStartDate;
    var txtEndDate;
    var txtItemCount;
    var txtPackageCount;
    var txtTotalbefore;
    var txtTotal;
    var txtTax;
    var txtTotalDiscount;
    var txtNet;
    var txtCashAmount;
    var txtCustomerCode;
    var txtCustomerName;
    var txtInvoiceDate;
    var txtInvoiceNumber;
    var lblReturnNumber;
    var txtDiscountValue;
    //checkbox
    var chkActive;
    //buttons 
    var btnPrintNew;
    var btnShow;
    var btnAddReturn;
    var btnBack; // btnBack btnSave
    var btnSave;
    var btnInvoiceSearch;
    var btnEdit;
    //print buttons 
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var btnPrintTransaction;
    var btnCustomerSrch;
    // giedView
    var Grid = new JsGrid();
    var CustType;
    //global
    var CountGrid = 0;
    var CountItems = 0;
    var PackageCount = 0;
    var CountTotal = 0;
    var TaxCount = 0;
    var NetCount = 0;
    var Tax_Rate = 0;
    var VatPrc;
    var globalInvoiceID = 0;
    var StoreID;
    var GlobalReturnID = 0;
    //flags
    var Show = true;
    var EditFlag = false;
    var InsertFlag = false;
    var btnPrint;
    var AfterInsertOrUpdateFlag = false;
    var CustomerId = 0;
    var SlsInvType = 0;
    var html = '';
    //------------------------------------------------------ Main Region -----------------------------------
    function InitalizeComponent() {
        // VatPrc
        ////debugger
        document.getElementById('Screen_name').innerHTML = Screen_name;
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        Finyear = Number(SysSession.CurrentEnvironment.CurrentYear);
        InitalizeControls();
        InitializeEvents();
        fillddlCustomer();
        FillddlSalesMan();
        fillddlFreeSalesman();
        FillddlStateType();
        FillddlReturnType();
        FillddlReturnTypeShow();
        fillddlCashBox();
        FillddlTaxType();
        vatType = SysSession.CurrentEnvironment.I_Control[0].DefSlsVatType;
        $('#ddlStateType').prop("value", "2");
        $('#ddlReturnType').prop("value", "2");
        $('#ddlShowFreeReturn').prop("value", "2");
        txtItemCount.value = CountItems.toString();
        txtPackageCount.value = PackageCount.toString();
        txtTotal.value = CountTotal.toString();
        txtTax.value = TaxCount.toString();
        txtNet.value = NetCount.toString();
        txtStartDate.value = SysSession.CurrentEnvironment.StartDate;
        txtEndDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        SysSession.CurrentEnvironment.I_Control[0].IvoiceDateEditable == true ? $('#txtInvoiceDate').removeAttr("disabled") : $('#txtInvoiceDate').attr("disabled", "disabled");
        GetTypeCust();
    }
    SlsTrSalesReturn.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        // Drop down lists
        ddlCustomer = document.getElementById("ddlCustomer");
        ddlSalesMan = document.getElementById("ddlSalesMan");
        ddlStateType = document.getElementById("ddlStateType");
        ddlReturnType = document.getElementById("ddlReturnType");
        ddlReturnTypeShow = document.getElementById("ddlReturnTypeShow");
        ddlFreeSalesman = document.getElementById("ddlFreeSalesman");
        ddlShowFreeReturn = document.getElementById("ddlShowFreeReturn");
        ddlCashBox = document.getElementById("ddlCashBox");
        ddlTaxTypeHeader = document.getElementById("ddlTaxTypeHeader");
        //TextBoxes
        searchbutmemreport = document.getElementById("searchbutmemreport");
        txtStartDate = document.getElementById("txtStartDate");
        txtEndDate = document.getElementById("txtEndDate");
        txtItemCount = document.getElementById("txtItemCount");
        txtPackageCount = document.getElementById("txtPackageCount");
        txtTotal = document.getElementById("txtTotal");
        txtTotalDiscount = document.getElementById("txtTotalDiscount");
        txtTax = document.getElementById("txtTax");
        txtNet = document.getElementById("txtNet");
        txtInvoiceDate = document.getElementById("txtInvoiceDate");
        txtInvoiceNumber = document.getElementById("txtInvoiceNumber");
        lblReturnNumber = document.getElementById("lblReturnNumber");
        txtDiscountValue = document.getElementById("txtDiscountValue");
        txtTotalbefore = document.getElementById("txtTotalbefore");
        txtCashAmount = document.getElementById("txtCashAmount");
        txtCustomerCode = document.getElementById("txtCustomerCode");
        txtCustomerName = document.getElementById("txtCustomerName");
        //checkbox
        chkActive = document.getElementById("chkActive");
        //button
        btnPrintNew = document.getElementById("btnPrintNew");
        btnShow = document.getElementById("btnShow");
        btnAddReturn = document.getElementById("btnAddReturn");
        btnBack = document.getElementById("btnBack");
        btnSave = document.getElementById("btnSave");
        btnInvoiceSearch = document.getElementById("btnInvoiceSearch");
        btnEdit = document.getElementById("btnEdit");
        //print 
        btnPrintTrview = document.getElementById("btnPrintTrview");
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF");
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL");
        btnPrintTransaction = document.getElementById("btnPrintTransaction");
        btnCustomerSrch = document.getElementById("btnCustomerSrch");
        btnPrint = document.getElementById("btnPrint");
    }
    function InitializeEvents() {
        chkActive.onclick = chkActive_onchecked;
        btnPrintNew.onclick = btnPrintNew_onclick;
        btnShow.onclick = btnShow_onclick;
        btnAddReturn.onclick = AddNewReturn_onclick;
        btnBack.onclick = btnBack_onclick;
        btnSave.onclick = btnSave_onclick;
        txtInvoiceNumber.onchange = txtInvoiceNumber_onchange;
        btnInvoiceSearch.onclick = btnInvoiceSearch_onclick;
        btnEdit.onclick = btnEdit_onclick;
        ddlReturnTypeShow.onchange = ddlReturnTypeShow_onchange;
        ddlCustomer.onchange = ddlCustomer_onchange;
        //print
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        btnPrint.onclick = function () { PrintReport(4); };
        btnPrintTransaction.onclick = PrintTransaction;
        searchbutmemreport.onkeyup = _SearchBox_Change;
        txtDiscountValue.onkeyup = txtDiscountValue_onchange;
        btnCustomerSrch.onclick = btnCustomerSrch_onclick;
    }
    function Check_on_user_type() {
        if (SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3) { //Salesman
            var SalesId_1 = SysSession.CurrentEnvironment.SalesManID;
            SalesmanDetails = SalesmanDetails.filter(function (s) { return s.SalesmanId == SalesId_1; });
        }
    }
    //------------------------------------------------------ Events Region -----------------------------------
    function GetTypeCust() {
        var Transcode = 0;
        if (InvoiceType == 1)
            Transcode = SysSession.CurrentEnvironment.RetailInvoiceTransCode;
        else
            Transcode = SysSession.CurrentEnvironment.WholeInvoiceTransCode;
        var Iscredit = SysSession.CurrentEnvironment.RetailInvoicePayment;
        var SlsType = InvoiceType == 1 ? 'R' : InvoiceType == 2 ? 'W' : 'S';
        CustType = SetCustomerType(Transcode, Iscredit, SlsType);
    }
    function btnCustomerSrch_onclick() {
        debugger;
        var Credit = '';
        if (ddlReturnTypeShow.value == "0") {
            Credit = "and IsCreditCustomer = 1";
        }
        if (ddlReturnTypeShow.value == "1") {
            Credit = "and IsCreditCustomer = 0";
        }
        else {
            Credit = "";
        }
        var sys = new SystemTools();
        //sys.FindKey(Modules.Sales_Services, "btnCustomerSrch", "CompCode=" + compcode + "and BranchCode=" + BranchCode + " and ISPersonal ='" + CustType.IsPersonal + "' and SalesInvoiceNature = " + CustType.SalesInvoiceNature + "", () => {
        var cond;
        debugger;
        //cond = "CompCode=" + compcode + " and ISPersonal ='" + CustType.IsPersonal + "'" + Credit;
        cond = "CompCode=" + compcode + " and SalesInvoiceNature = " + CustType.SalesInvoiceNature + Credit;
        if (CustType.IsPersonal != null)
            cond = cond + "and ISPersonal ='" + CustType.IsPersonal + "'";
        if (SysSession.CurrentEnvironment.I_Control[0].IsLocalBranchCustomer == true) {
            cond = cond + "and BranchCode=" + BranchCode;
        }
        sys.FindKey(Modules.Catch_Receipt, "btnCustomerSearch", "", function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            CustomerId = id;
            ddlInvoiceCustomer_onchange();
        });
    }
    function txtDiscountValue_onchange() {
        if (txtDiscountValue.value.trim() != '' && txtDiscountValue.value != '0') {
            txtNet.value = (Number(NetCount.toFixed(2)) - Number(txtDiscountValue.value)).toFixed(2);
        }
        else {
            ComputeTotals();
        }
    }
    function ddlCustomer_onchange() {
        var customerID = Number(ddlCustomer.value);
        var custObj = CustDetails.filter(function (s) { return s.CUSTOMER_ID == customerID; });
        FillddlSalesMan();
        //if (SysSession.CurrentEnvironment.UserType != 1 && SysSession.CurrentEnvironment.UserType == 3) {
        //    ddlSalesMan.value = custObj[0].SalesmanId.toString();
        //}
    }
    function ddlInvoiceCustomer_onchange() {
        var customerID = CustomerId;
        var custObj = CustDetails.filter(function (s) { return s.CUSTOMER_ID == customerID; });
        fillddlFreeSalesman();
        if (lang == "ar")
            $("#txtCustomerName").prop("value", custObj[0].CUSTOMER_NAME);
        else
            $("#txtCustomerName").prop("value", custObj[0].NAMEE);
        $("#txtCustomerCode").prop("value", custObj[0].CustomerCODE);
        //ddlFreeSalesman.value = custObj[0].SalesmanId.toString();
    }
    function ddlReturnTypeShow_onchange() {
        if (ddlReturnTypeShow.value == "1") {
            $("#DivCashBox1").removeClass("display_none");
            $("#DivCashBox2").removeClass("display_none");
            $("#ddlCashBox").prop("value", "");
            $("#txtCashAmount").prop("value", "");
            fillddlCashBox();
        }
        else if (ddlReturnTypeShow.value == "0") {
            $("#DivCashBox1").addClass("display_none");
            $("#DivCashBox2").addClass("display_none");
            $("#ddlCashBox").prop("value", "");
            $("#txtCashAmount").prop("value", "");
        }
    }
    function txtInvoiceNumber_onchange() {
        $('#div_Data').html("");
        txtItemCount.value = "";
        txtPackageCount.value = "";
        txtTotal.value = "";
        txtTax.value = "";
        txtNet.value = "";
        lblReturnNumber.value = "";
        txtInvoiceDate.value = "";
        CustomerId = 0;
        ddlReturnTypeShow.value = "0";
        ddlFreeSalesman.value = "null";
        $('#txtCreatedBy').prop("value", "");
        $('#txtCreatedAt').prop("value", "");
        $('#txtUpdatedBy').prop("value", "");
        $('#txtUpdatedAt').prop("value", "");
        $("#divReturnDetails").removeClass("display_none");
        //Show = true;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetSlsInvoiceByIDFromStatistics"),
            data: { invoiceID: globalInvoiceID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    InvoiceStatisticsModel = result.Response;
                    txtInvoiceNumber.value = InvoiceStatisticsModel[0].TrNo.toString();
                    txtItemCount.value = InvoiceStatisticsModel[0].Line_Count.toString();
                    txtPackageCount.value = "0";
                    txtTotal.value = "0";
                    txtTax.value = "0";
                    txtNet.value = "0";
                    ddlTaxTypeHeader.value = InvoiceStatisticsModel[0].VatType.toString();
                    StoreID = InvoiceStatisticsModel[0].StoreId;
                    txtInvoiceDate.value = DateFormat(InvoiceStatisticsModel[0].TrDate.toString());
                    vatType = InvoiceStatisticsModel[0].VatType;
                    SlsInvType = InvoiceStatisticsModel[0].SlsInvType;
                    ddlFreeSalesman.value = InvoiceStatisticsModel[0].SalesmanId.toString();
                    CustomerId = Number(InvoiceStatisticsModel[0].CustomerId);
                    var customerName = InvoiceStatisticsModel[0].CustomerName.toString();
                    $('#txtCustomerName').prop("value", customerName);
                    txtCustomerCode.value = InvoiceStatisticsModel[0].CustomerCODE.toString();
                    if (InvoiceStatisticsModel[0].Status == 1) {
                        chkActive.checked = true;
                    }
                    else {
                        chkActive.checked = false;
                    }
                    if (InvoiceStatisticsModel[0].IsCash == true) {
                        $('#ddlReturnTypeShow').prop("value", 1);
                        $("#DivCashBox1").removeClass("display_none");
                        $("#DivCashBox2").removeClass("display_none");
                        $("#ddlCashBox").prop("value", "null");
                        $("#txtCashAmount").val("");
                    }
                    else {
                        $('#ddlReturnTypeShow').prop("value", 0);
                        $("#DivCashBox1").addClass("display_none");
                        $("#DivCashBox2").addClass("display_none");
                        $("#ddlCashBox").prop("value", "null");
                        $("#txtCashAmount").val("");
                    }
                    $('#divCreationPanel').removeClass("display_none");
                    $('#txtCreatedBy').prop("value", SysSession.CurrentEnvironment.UserCode);
                    $('#txtCreatedAt').prop("value", GetDate().toString());
                    $('#txtUpdatedBy').prop("value", "");
                    $('#txtUpdatedAt').prop("value", "");
                }
            }
        });
        if (InvoiceStatisticsModel[0].InvoiceID != 0) {
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("SlsTrSales", "GetSlsInvoiceItem"),
                data: { invoiceID: globalInvoiceID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        SlsInvoiceItemsDetails = result.Response;
                        var buildedRows = 0;
                        for (var i = 0; i < SlsInvoiceItemsDetails.length; i++) {
                            if ((SlsInvoiceItemsDetails[i].SoldQty - SlsInvoiceItemsDetails[i].TotRetQty) > 0) {
                                BuildControls(i);
                                $("#txtReturnQuantity" + i).prop("value", '0');
                                $("#txtTotal" + i).prop("value", 0);
                                $("#txtTax" + i).prop("value", 0);
                                $("#txtTotAfterTax" + i).prop("value", 0);
                                txtItemCount.value = '0';
                                txtPackageCount.value = '0';
                                txtTotal.value = '0';
                                txtTax.value = '0';
                                txtNet.value = '0';
                                Display_GridConrtol(i);
                                buildedRows++;
                            }
                            if (buildedRows == 0) {
                                txtInvoiceNumber.value = "";
                                DisplayMassage('( لا توجد اصناف علي هذه الفاتورة)', 'this invoice has no items', MessageType.Error);
                                btnInvoiceSearch.disabled = false;
                                clear();
                                return;
                            }
                        }
                        CountGrid = SlsInvoiceItemsDetails.length;
                        CountItems = SlsInvoiceItemsDetails.length;
                        ComputeTotals();
                    }
                }
            });
        }
        SysSession.CurrentEnvironment.I_Control[0].IvoiceDateEditable == true ? $('#txtInvoiceDate').removeAttr("disabled") : $('#txtInvoiceDate').attr("disabled", "disabled");
    }
    function chkActive_onchecked() {
        if (btnEdit.getAttribute('class') != 'btn btn-primary  float_left_right display_none') {
            openReturn();
            $('#btnPrintTransaction').removeClass("display_none");
        }
    }
    function chkPreivilegeToEditApprovedReturns() {
        try {
            if (InvoiceStatisticsModel[0].Status == 1) {
                chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
                btnEdit.disabled = true;
                chkActive.checked = true;
            }
            else {
                chkActive.disabled = true;
                chkActive.checked = false;
                btnEdit.disabled = !SysSession.CurrentPrivileges.EDIT;
            }
        }
        catch (e) {
        }
    }
    function checkUnApprovedReturns(invoiceID) {
        var res = false;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetAllUnApprovedSlsReturnListByInvoiceID"),
            data: {
                invoiceID: invoiceID, CompCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    if (result.Response != 0) {
                        res = true;
                    }
                }
            }
        });
        return res;
    }
    //------------------------------------------------------ buttons Region -----------------------------------
    function btnEdit_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT)
            return;
        EditFlag = true;
        InsertFlag = true;
        btnInvoiceSearch.disabled = true;
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");
        $('#btnEdit').addClass("display_none");
        $('#btnPrintTransaction').addClass("display_none");
        $("#ddlCashBox").removeAttr("disabled");
        $("#txtCashAmount").removeAttr("disabled");
        $("#txt_Remarks").removeAttr("disabled");
        $("#txtDiscountValue").removeAttr("disabled");
        $("#btnCustomerSrch").removeAttr("disabled");
        //$("#txtInvoiceDate").attr("disabled","disabled");
        $("#divGridDetails_View").addClass("disabledDiv");
        $("#divGridDetails_View").attr("disabled", "disabled").off('click');
        $("#div_hedr").addClass("disabledDiv");
        $("#div_hedr").attr("disabled", "disabled").off('click');
        chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM1;
        for (var cnt = 0; cnt <= CountGrid; cnt++) {
            $("#txtReturnQuantity" + cnt).removeAttr("disabled");
            $('.btn-number3' + cnt).removeAttr("disabled");
            $('.input-number3' + cnt).removeAttr("disabled");
        }
        EditFlag = true;
        SysSession.CurrentEnvironment.I_Control[0].IvoiceDateEditable == true ? $('#txtInvoiceDate').removeAttr("disabled") : $('#txtInvoiceDate').attr("disabled", "disabled");
    }
    function btnInvoiceSearch_onclick() {
        debugger;
        var IsCash = '';
        if (ddlReturnTypeShow.value == "0") {
            IsCash = "and IsCash = 0";
        }
        else if (ddlReturnTypeShow.value == "1") {
            IsCash = "and IsCash = 1";
        }
        else {
            IsCash = "";
        }
        if (CustomerId == 0) {
            var sys_1 = new SystemTools();
            sys_1.FindKey(Modules.SlsTrReturn, "btnInvoiceSearch", "CompCode=" + compcode + "and Status=1 and TrType=0 and BranchCode = " + BranchCode + "" + IsCash, function () {
                var id = SearchGrid.SearchDataGrid.SelectedKey;
                Show = false;
                globalInvoiceID = id;
                btnInvoiceSearch.disabled = true;
                txtInvoiceNumber_onchange();
                btnAddReturn_onclick();
                ComputeTotals();
            });
        }
        else {
            var CustId = CustomerId;
            var sys_2 = new SystemTools();
            sys_2.FindKey(Modules.SlsTrReturn, "btnInvoiceSearch", "CompCode=" + compcode + "and Status=1 and TrType=0 and BranchCode = " + BranchCode + "and CustomerId = " + CustId + "" + IsCash, function () {
                var id = SearchGrid.SearchDataGrid.SelectedKey;
                Show = false;
                globalInvoiceID = id;
                btnInvoiceSearch.disabled = true;
                txtInvoiceNumber_onchange();
                btnAddReturn_onclick();
                ComputeTotals();
            });
        }
    }
    function btnSave_onclick() {
        btnInvoiceSearch.disabled = false;
        if (!ValidationHeader())
            return;
        Assign();
        if (EditFlag == true) {
            if (!SysSession.CurrentPrivileges.EDIT)
                return;
            for (var i = 0; i < CountGrid; i++) {
                if (!ValidationGrid(i))
                    return;
            }
            Update();
        }
        else {
            if (!SysSession.CurrentPrivileges.AddNew)
                return;
            if (invoiceItemsModel.length > 0) {
                Insert();
            }
            else {
                DisplayMassage('( يجب أضافه قيمه للكمية المرتجعه ع الفاتورة)', 'you must add value to the return quantity', MessageType.Error);
            }
        }
    }
    function btnBack_onclick() {
        if (InsertFlag == false) {
            $("#divReturnDetails").addClass("display_none");
            $("#btnBack").addClass("display_none");
            $("#btnSave").addClass("display_none");
            $('#btnPrintTransaction').removeClass("display_none");
            $("#divGridDetails_View").removeClass("disabledDiv");
            $("#div_hedr").removeAttr("disabled");
            $("#div_hedr").removeClass("disabledDiv");
            $("#chkActive").attr("disabled", "disabled");
        }
        else {
            $("#div_hedr").removeAttr("disabled");
            $("#div_hedr").removeClass("disabledDiv");
            $('#condtionbtn1').removeClass("col-lg-10");
            $('#condtionbtn1').addClass("col-lg-8");
            $('#condtionbtn2').removeClass("col-lg-2");
            $('#condtionbtn2').addClass("col-lg-4");
            $("#divGridDetails_View").removeClass("disabledDiv");
            $("#txtCustomerName").attr("disabled", "disabled");
            $("#ddlFreeSalesman").attr("disabled", "disabled");
            $("#txtInvoiceDate").attr("disabled", "disabled");
            $("#btnEdit").addClass("display_none");
            $('#btnPrint').removeClass("display_none");
            $("#btnSave").addClass("display_none");
            $('#btnPrintTransaction').removeClass("display_none");
            $('#btnBack').addClass("display_none");
            $('#btnEdit').removeClass("display_none");
            globalInvoiceID = 0;
            $("#ddlCashBox").attr("disabled", "disabled");
            $("#txtCashAmount").attr("disabled", "disabled");
            $("#btnInvoiceSearch").attr("disabled", "disabled");
            $("#txtInvoiceDate").attr("disabled", "disabled");
            $("#chkActive").attr("disabled", "disabled");
            $("#txt_Remarks").attr("disabled", "disabled");
            $("#txtDiscountValue").attr("disabled", "disabled");
            $("#btnCustomerSrch").attr("disabled", "disabled");
            Grid_RowDoubleClicked();
        }
    }
    function btnShow_onclick() {
        InitializeGrid();
        $("#divShow").removeClass("display_none");
        $("#divReturnDetails").addClass("display_none");
        $("#divGridDetails_View").removeClass("disabledDiv");
    }
    function AddNewReturn_onclick() {
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        $("#divGridDetails_View").addClass("disabledDiv");
        $("#divGridDetails_View").attr("disabled", "disabled").off('click');
        $("#div_hedr").addClass("disabledDiv");
        $("#div_hedr").attr("disabled", "disabled").off('click');
        $("#divShow").removeClass("display_none");
        btnInvoiceSearch.disabled = false;
        $("#divReturnDetails").removeClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");
        $("#btnEdit").addClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
        $("#btnPrint").addClass("display_none");
        $('#div_Data').html("");
        txtItemCount.value = "";
        txtPackageCount.value = "";
        txtTotal.value = "";
        txtTax.value = "";
        txtNet.value = "";
        txtInvoiceNumber.value = "";
        lblReturnNumber.value = "";
        txtDiscountValue.value = "0";
        txtTotalDiscount.value = "0";
        txtTotalbefore.value = "0";
        txtInvoiceDate.value = "";
        CustomerId = 0;
        ddlReturnTypeShow.value = "null";
        ddlFreeSalesman.value = "null";
        txtCashAmount.value = "";
        ddlTaxTypeHeader.value = "null";
        $("#txt_Remarks").prop("value", "");
        $("#txtCustomerName").prop("value", "");
        $("#txtCustomerCode").prop("value", "");
        $("#DivCashBox1").addClass("display_none");
        $("#DivCashBox2").addClass("display_none");
        $("#ddlCashBox").prop("value", "null");
        $("#txtCashAmount").prop("value", "");
        $('#txtCreatedBy').prop("value", SysSession.CurrentEnvironment.UserCode);
        $('#txtCreatedAt').prop("value", DateTimeFormat(Date().toString()));
        $('#txtUpdatedBy').prop("value", "");
        $('#txtUpdatedAt').prop("value", "");
        chkActive.checked = true;
        chkActive.disabled = false;
        txtInvoiceDate.value = GetDate();
        fillddlCashBox();
        $("#ddlFreeSalesman").attr("disabled", "disabled");
        $("#txt_Remarks").removeAttr("disabled");
        $("#txtDiscountValue").removeAttr("disabled");
        $("#btnCustomerSrch").removeAttr("disabled");
        $("#ddlReturnTypeShow").removeAttr("disabled");
        InsertFlag = false;
        EditFlag = false;
        SysSession.CurrentEnvironment.I_Control[0].IvoiceDateEditable == true ? $('#txtInvoiceDate').removeAttr("disabled") : $('#txtInvoiceDate').attr("disabled", "disabled");
        Show = false;
    }
    function btnAddReturn_onclick() {
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        txtInvoiceDate.value = GetDate();
        var unApprovedReturn = false;
        lblReturnNumber.value = "";
        unApprovedReturn = checkUnApprovedReturns(globalInvoiceID);
        if (unApprovedReturn == true) {
            DisplayMassage('( لا يمكن اضافه مرتجع علي الفاتورة قبل اعتماد المرتجعات السابقه)', 'you cannot add new return on invoice before approve previous one ', MessageType.Error);
        }
        else {
            Show = false;
            $("#btnBack").removeClass("display_none");
            $("#btnSave").removeClass("display_none");
            $("#btnPrint").addClass("display_none");
            $('#btnEdit').addClass("display_none");
            for (var i = 0; i < CountGrid; i++) {
                $("#txtReturnQuantity" + i).removeAttr("disabled");
                $('.btn-number3' + i).removeAttr("disabled");
                $('.input-number3' + i).removeAttr("disabled");
            }
            $("#ddlInvoiceCustomer").attr("disabled", "disabled");
            $("#ddlReturnTypeShow").attr("disabled", "disabled");
            $("#ddlFreeSalesman").attr("disabled", "disabled");
            $("#ddlReturnTypeShow").attr("disabled", "disabled");
            $("#txtCustomerName").attr("disabled", "disabled");
            $("#txtInvoiceDate").removeAttr("disabled");
            $("#ddlCashBox").removeAttr("disabled");
            $("#txtCashAmount").removeAttr("disabled");
            SysSession.CurrentEnvironment.I_Control[0].IvoiceDateEditable == true ? $('#txtInvoiceDate').removeAttr("disabled") : $('#txtInvoiceDate').attr("disabled", "disabled");
        }
    }
    //------------------------------------------------------ ddl Region -----------------------------------
    function fillddlCustomer() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Customer", "GetAll"),
            data: {
                CompCode: compcode, BranchCode: BranchCode
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    CustDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") { //ddlInvoiceCustomer
                        DocumentActions.FillCombowithdefult(CustDetails, ddlCustomer, "CUSTOMER_ID", "NAMEE", "Select customer");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(CustDetails, ddlCustomer, "CUSTOMER_ID", "CUSTOMER_NAME", "اختر العميل");
                    }
                }
            }
        });
    }
    function FillddlSalesMan() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefSalesMen", "GetAllSalesPeople"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, IsSalesEnable: true, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    SalesmanDetails = result.Response;
                    SalesmanDetails = SalesmanDetails.filter(function (s) { return s.Isactive == true; });
                    Check_on_user_type();
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesMan, "SalesmanId", "NameE", "Select salesman");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesMan, "SalesmanId", "NameA", "اختر المندوب");
                    }
                    SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlSalesMan option[value="null"]').remove()) : $('#ddlSalesMan').prop('selectedIndex', 0);
                }
            }
        });
    }
    function fillddlCashBox() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefBox", "GetAll"),
            data: {
                compCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    cashboxDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(cashboxDetails, ddlCashBox, "CashBoxID", "CashBox_DescE", "Select CashBox");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(cashboxDetails, ddlCashBox, "CashBoxID", "CashBox_DescA", "اختر الصندوق");
                    }
                }
            }
        });
    }
    function fillddlFreeSalesman() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefSalesMen", "GetAllSalesPeople"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, IsSalesEnable: true, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    SalesmanDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlFreeSalesman, "SalesmanId", "NameE", "Select salesman");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlFreeSalesman, "SalesmanId", "NameA", "اختر المندوب");
                    }
                }
            }
        });
    }
    function FillddlStateType() {
        StateDetailsAr = [" غير معتمد", "معتمد", "الجميع"];
        StateDetailsEn = ["Not Approved", "Approved", "All"];
        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (var i = 0; i < StateDetailsEn.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsEn[i];
                ddlStateType.options.add(newoption);
            }
        }
        else {
            for (var i = 0; i < StateDetailsAr.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsAr[i];
                ddlStateType.options.add(newoption);
            }
        }
    }
    function FillddlReturnType() {
        StateDetailsAr = ["علي الحساب ", "نقدي", "الجميع"];
        StateDetailsEn = ["Credit", "Cash", "All"];
        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (var i = 0; i < StateDetailsEn.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsEn[i];
                ddlReturnType.options.add(newoption);
            }
        }
        else {
            for (var i = 0; i < StateDetailsAr.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsAr[i];
                ddlReturnType.options.add(newoption);
            }
        }
    }
    function FillddlReturnTypeShow() {
        AddReturnDetailsAr = ["علي الحساب ", "نقدي"];
        AddReturnDetailsEn = ["Credit", "Cash"];
        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (var i = 0; i < AddReturnDetailsEn.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = AddReturnDetailsEn[i];
                ddlReturnTypeShow.options.add(newoption);
            }
        }
        else {
            for (var i = 0; i < AddReturnDetailsAr.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = AddReturnDetailsAr[i];
                ddlReturnTypeShow.options.add(newoption);
            }
        }
    }
    function FillddlTaxType() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenVatType", "GetAll"),
            data: {
                CompCode: compcode, VatType: 1, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    VatDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(VatDetails, ddlTaxTypeHeader, "CODE", "DESCRIPTION", "Select vat");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(VatDetails, ddlTaxTypeHeader, "CODE", "DESCRIPTION", "اختر الضريبة");
                    }
                }
            }
        });
    }
    //------------------------------------------------------ Get Functions Region -----------------------------------   
    function _SearchBox_Change() {
        if (searchbutmemreport.value != "") {
            //debugger
            var search_1 = searchbutmemreport.value.toLowerCase();
            SearchDetails = SlsInvoiceStatisticsDetails.filter(function (x) { return x.TrNo.toString().search(search_1) >= 0 || x.CustomerName.toLowerCase().search(search_1) >= 0
                || x.Slsm_DescA.toLowerCase().search(search_1) >= 0 || x.Slsm_DescE.toLowerCase().search(search_1) >= 0; });
            Grid.DataSource = SearchDetails;
            Grid.Bind();
        }
        else {
            Grid.DataSource = SlsInvoiceStatisticsDetails;
            Grid.Bind();
        }
    }
    function GetInvoiceByID(invoiceID) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetSlsInvoiceByIDFromStatistics"),
            data: { invoiceID: invoiceID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    InvoicemodelForReturn = result.Response;
                    if (InvoicemodelForReturn.length > 0)
                        txtInvoiceNumber.value = InvoicemodelForReturn[0].TrNo.toString();
                }
            }
        });
    }
    //------------------------------------------------------ Normal Grid Region -----------------------------------
    function InitializeGrid() {
        var res = GetResourceList("");
        Grid.ElementName = "divGridDetails_View";
        Grid.Paging = true;
        Grid.PageSize = 10;
        Grid.Sorting = true;
        Grid.InsertionMode = JsGridInsertionMode.Binding;
        Grid.Editing = false;
        Grid.Inserting = false;
        Grid.SelectedIndex = 1;
        Grid.OnRowDoubleClicked = Grid_RowDoubleClicked;
        Grid.OnItemEditing = function () { };
        Grid.PrimaryKey = "InvoiceID";
        Grid.Columns = [
            { title: res, name: "InvoiceID", type: "text", width: "2%", visible: false },
            { title: res.App_Number, name: "TrNo", type: "text", width: "13%" },
            { title: res.App_date, name: "TrDate", type: "text", width: "16%" },
            { title: res.App_Cutomer, name: "CustomerName", type: "text", width: "25%" },
            { title: res.App_Salesman, name: (lang == "ar" ? "Slsm_DescA" : "Slsm_DescE"), type: "text", width: "25%" },
            { title: res.Men_StkDefItems, name: "Line_Count", type: "text", width: "12%" },
            { title: res.App_Package, name: "Tot_Qty", type: "text", width: "12%" },
            { title: res.App_total, name: "TotalAmount", type: "text", width: "10%" },
            { title: res.App_Tax, name: "VatAmount", type: "text", width: "10%" },
            { title: res.App_Net, name: "NetAfterVat", type: "text", width: "10%" },
            { title: res.cash_type, name: "returnTypeDesciption", type: "text", width: "20%" },
            { title: res.App_Certified, name: "statusDesciption", type: "text", width: "17%", css: "classfont" }
        ];
        BindStatisticGridData();
    }
    function BindStatisticGridData() {
        var startDate = txtStartDate.value;
        var endDate = txtEndDate.value;
        var customerId = 0;
        var status = 0;
        var returnType = 0;
        var SalesMan = "null";
        var FreeReturnShow = 0;
        if (ddlCustomer.value != "null") {
            customerId = Number(ddlCustomer.value.toString());
        }
        if (ddlSalesMan.value != "null") {
            SalesMan = ddlSalesMan.value.toString();
        }
        status = Number(ddlStateType.value.toString());
        returnType = Number(ddlReturnType.value.toString());
        FreeReturnShow = Number(ddlShowFreeReturn.value.toString());
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetAllReturnSlsInvoiceStatistic"),
            data: { CompCode: compcode, BranchCode: BranchCode, StartDate: startDate, EndDate: endDate, Status: status, FreeReturn: FreeReturnShow, returnType: returnType, CustId: customerId, SalesMan: SalesMan, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    SlsInvoiceStatisticsDetails = result.Response;
                    Search_FromNum_TONum();
                    for (var i = 0; i < SlsInvoiceStatisticsDetails.length; i++) {
                        SlsInvoiceStatisticsDetails[i].returnTypeDesciption = SlsInvoiceStatisticsDetails[i].IsCash == true ? (lang == "ar" ? "نقدي" : "Cash") : (lang == "ar" ? "علي الحساب" : "On account");
                        SlsInvoiceStatisticsDetails[i].statusDesciption = SlsInvoiceStatisticsDetails[i].Status == 1 ? (lang == "ar" ? "معتمد" : "A certified") : (lang == "ar" ? "غير معتمد" : "Not supported");
                        SlsInvoiceStatisticsDetails[i].TrDate = DateFormat(SlsInvoiceStatisticsDetails[i].TrDate.toString());
                    }
                    Grid.DataSource = SlsInvoiceStatisticsDetails;
                    Grid.Bind();
                }
            }
        });
    }
    function Search_FromNum_TONum() {
        var fromNum = Number($('#fromNum').val());
        var ToNum = Number($('#ToNum').val());
        $("#divGridDetails_View").jsGrid("option", "pageIndex", 1);
        if (fromNum < ToNum && fromNum >= 0) {
            SlsInvoiceStatisticsDetails = SlsInvoiceStatisticsDetails.filter(function (x) { return x.TrNo >= fromNum && x.TrNo <= ToNum; });
        }
        if (fromNum > 0 && ToNum == 0) {
            SlsInvoiceStatisticsDetails = SlsInvoiceStatisticsDetails.filter(function (x) { return x.TrNo >= fromNum; });
        }
        if (fromNum == 0 && ToNum > fromNum) {
            SlsInvoiceStatisticsDetails = SlsInvoiceStatisticsDetails.filter(function (x) { return x.TrNo <= ToNum; });
        }
        if (fromNum >= ToNum) {
            ToNum = 0;
            $('#ToNum').val('0');
            SlsInvoiceStatisticsDetails = SlsInvoiceStatisticsDetails.filter(function (x) { return x.TrNo >= fromNum; });
        }
        if (fromNum < 0) {
            fromNum = 0;
            $('#fromNum').val('0');
        }
        if (ToNum < 0) {
            ToNum = 0;
            $('#ToNum').val('0');
        }
    }
    function Grid_RowDoubleClicked() {
        Show = true;
        InvoiceStatisticsModel = new Array();
        Selecteditem = SlsInvoiceStatisticsDetails.filter(function (x) { return x.InvoiceID == Number(Grid.SelectedKey); });
        if (AfterInsertOrUpdateFlag == true) {
            Selecteditem = SlsInvoiceStatisticsDetails.filter(function (x) { return x.InvoiceID == GlobalReturnID; });
            AfterInsertOrUpdateFlag = false;
        }
        InvoiceStatisticsModel = Selecteditem;
        if (InvoiceStatisticsModel.length > 0) {
            GlobalReturnID = Number(InvoiceStatisticsModel[0].InvoiceID);
            globalInvoiceID = Number(InvoiceStatisticsModel[0].RefTrID);
            txtItemCount.value = InvoiceStatisticsModel[0].Line_Count.toString();
            txtPackageCount.value = InvoiceStatisticsModel[0].Tot_Qty.toString();
            txtTotal.value = InvoiceStatisticsModel[0].TotalAmount.toString();
            txtTax.value = InvoiceStatisticsModel[0].VatAmount.toString();
            txtNet.value = InvoiceStatisticsModel[0].NetAfterVat.toString();
            StoreID = InvoiceStatisticsModel[0].StoreId;
            ddlTaxTypeHeader.value = InvoiceStatisticsModel[0].VatType.toString();
            if (InvoiceStatisticsModel[0].RefTrID != null) {
                var RefID = InvoiceStatisticsModel[0].RefTrID;
                GetInvoiceByID(RefID);
            }
            var ReturnNum = InvoiceStatisticsModel[0].TrNo.toString();
            lblReturnNumber.value = ReturnNum;
            txtInvoiceDate.value = DateFormat(InvoiceStatisticsModel[0].TrDate.toString());
            if (InvoiceStatisticsModel[0].IsCash == true) {
                $('#ddlReturnTypeShow').prop("value", "1");
                $("#DivCashBox1").removeClass("display_none");
                $("#DivCashBox2").removeClass("display_none");
                if (InvoiceStatisticsModel[0].CashBoxID != null && InvoiceStatisticsModel[0].CashBoxID != 0) {
                    var BoxID = InvoiceStatisticsModel[0].CashBoxID.toString();
                    var cashAmount = InvoiceStatisticsModel[0].CashAmount;
                    $("#ddlCashBox").prop("value", BoxID);
                    $("#txtCashAmount").prop("value", cashAmount);
                }
                else {
                    $("#ddlCashBox").attr("disabled", "disabled");
                    $("#txtCashAmount").attr("disabled", "disabled");
                    //$('#ddlReturnTypeShow').prop("value", "0");
                    $("#ddlCashBox").prop("value", "null");
                    $("#txtCashAmount").prop("value", "");
                }
            }
            else {
                $("#DivCashBox1").addClass("display_none");
                $("#DivCashBox2").addClass("display_none");
                $('#ddlReturnTypeShow').prop("value", "0");
                $("#ddlCashBox").prop("value", "null");
                $("#txtCashAmount").prop("value", "");
            }
            $('#ddlFreeSalesman').prop("value", InvoiceStatisticsModel[0].SalesmanId.toString());
            if (InvoiceStatisticsModel[0].Status == 1) {
                chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
                btnEdit.disabled = true;
                chkActive.checked = true;
            }
            else {
                chkActive.disabled = true;
                btnEdit.disabled = !SysSession.CurrentPrivileges.EDIT;
                chkActive.checked = false;
            }
            $('#divCreationPanel').removeClass("display_none");
            $('#txtCreatedBy').prop("value", InvoiceStatisticsModel[0].CreatedBy);
            $('#txtCreatedAt').prop("value", InvoiceStatisticsModel[0].CreatedAt);
            $('#txtUpdatedBy').prop("value", InvoiceStatisticsModel[0].UpdatedBy);
            $('#txtUpdatedAt').prop("value", InvoiceStatisticsModel[0].UpdatedAt);
            $('#txt_Remarks').prop("value", InvoiceStatisticsModel[0].Remark);
            $('#txtDiscountValue').prop("value", InvoiceStatisticsModel[0].RoundingAmount);
            txtCustomerName.value = lang == "ar" ? InvoiceStatisticsModel[0].CustomerName.toString() : InvoiceStatisticsModel[0].NAMEE.toString();
            txtCustomerCode.value = InvoiceStatisticsModel[0].CustomerCODE.toString();
            CustomerId = InvoiceStatisticsModel[0].CustomerId;
            SlsInvType = InvoiceStatisticsModel[0].SlsInvType;
            var customerName = InvoiceStatisticsModel[0].CustomerName.toString();
            $('#txtCustomerName').prop("value", customerName);
            $("#txtCustomerName").attr("disabled", "disabled");
            $("#ddlFreeSalesman").attr("disabled", "disabled");
            $("#txt_Remarks").attr("disabled", "disabled");
            $("#txtDiscountValue").attr("disabled", "disabled");
            $("#btnCustomerSrch").attr("disabled", "disabled");
            $("#divReturnDetails").removeClass("display_none");
            $("#divReturnDetails").removeClass("display_none");
            $("#ddlCashBox").attr("disabled", "disabled");
            $("#txtCashAmount").attr("disabled", "disabled");
            $("#btnInvoiceSearch").attr("disabled", "disabled");
            $("#ddlReturnTypeShow").attr("disabled", "disabled");
            $('#btnPrint').removeClass("display_none");
            $("#btnSave").addClass("display_none");
            $('#btnBack').addClass("display_none");
            $('#btnEdit').removeClass("display_none");
            $("#btnInvoiceSearch").attr("disabled", "disabled");
        }
        Show = true;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetSlsInvoiceItem"),
            data: { invoiceID: GlobalReturnID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    SlsInvoiceItemsDetails = result.Response;
                    $("#div_Data").html('');
                    CountGrid = 0;
                    for (var i = 0; i < SlsInvoiceItemsDetails.length; i++) {
                        BuildControls(i);
                        Display_GridConrtol(i);
                    }
                    CountGrid = SlsInvoiceItemsDetails.length;
                    CountItems = SlsInvoiceItemsDetails.length;
                    ComputeTotals();
                }
            }
        });
        $('#btnPrintTransaction').removeClass("display_none");
    }
    //------------------------------------------------------ Controls Grid Region -----------------------------------
    function BuildControls(cnt) {
        var html;
        html = '<div id= "No_Row' + cnt + '" class="container-fluid style_border" > <div class="row " > <div class="col-lg-12" > ' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0" style="width: 4%;">' +
            '<input id="txtSerial' + cnt + '" type="text" class="form-control input-sm right2" disabled /></div>' +
            '<input id="InvoiceItemID' + cnt + '" type="hidden" class="form-control input-sm right2 display_none"  />' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0">' +
            '<input id="txtServicCode' + cnt + '" type="text" class="form-control input-sm right2" disabled /></div>' +
            '<div class="col-lg-2 col-md-2 col-sm-2 col-xl-2 col-xs-2 p-0">' +
            '<input id="ddlItem' + cnt + '" type="text" class="form-control input-sm right2" disabled /></div>' +
            '<div class=" col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0">' +
            '<select id="ddlTypeuom' + cnt + '" class="form-control input-sm" disabled  style="width: 100%;border-radius: 30px;"><option value="null">الوحده</option></select> </div>' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0"><input type="text"  disabled  id="txtQuantity' + cnt + '" class="form-control   input-sm font1" value="1" min="1" max="1000" step="1"></div>' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0"><input type="text"  class="form-control input-sm" id="txtReturnQuantity' + cnt + '" name="quant[3]" class="form-control   font1" value="0" min="0" max="1000" step="1"></div>' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0" ><input type="text" disabled   id="txtPrice' + cnt + '" class="form-control input-sm   font1" value="1" min="0" max="1000" step="0.5"></div>' +
            '<div class=" col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0"  ><input type="number" disabled id="txtDiscountPrc' + cnt + '" name="quant[2]" class="form-control input-sm   font1" value="0" min="0" max="1000" step="0.5"></div>' +
            '<div class=" col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0"  ><input type="number"disabled  id="txtDiscountAmount' + cnt + '" name="quant[2]" class="form-control input-sm   font1" value="0" min="0" max="1000" step="0.5"></div>' +
            '<div class=" col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0"  ><input type="number" disabled id="txtNetUnitPrice' + cnt + '" name="quant[2]" class="form-control input-sm   font1" value="0" min="0" max="1000" step="0.5"></div>' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0">' +
            '<input id="txtTotal' + cnt + '" type="text" class="form-control input-sm right2" disabled /></div>' +
            '<div class="col-lg-6 col-md-6 col-sm-6 col-xl-6 col-xs-6 p-0" style="position:absolute; right:95.5%">' +
            '<div class="col-lg-3 col-md-3 col-sm-3 col-xl-3 col-xs-3 p-0">' +
            '<input id="txtTax_Rate' + cnt + '" type="text" class="form-control input-sm right2" disabled /></div>' +
            '<div class="col-lg-3 col-md-3 col-sm-3 col-xl-3 col-xs-3 p-0">' +
            '<input id="txtTax' + cnt + '" type="text" class="form-control input-sm right2" disabled /></div>' +
            '<div class="col-lg-3 col-md-3 col-sm-3 col-xl-3 col-xs-3 p-0">' +
            '<input id="txtTotAfterTax' + cnt + '" type="text" class="form-control input-sm right2" disabled /></div>' +
            '</div>' +
            '</div></div></div>' +
            '<input id="txt_StatusFlag' + cnt + '" name = " " type = "hidden" class="form-control  input-sm"/><input id="txt_ID' + cnt + '" name = " " type = "hidden" class="form-control" /><input id="txt_ItemID' + cnt + '" name = " " type = "hidden" class="form-control" />';
        $("#div_Data").append(html);
        $("#txtReturnQuantity" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtReturnQuantityValue = $("#txtReturnQuantity" + cnt).val();
            var txtPriceValue = $("#txtNetUnitPrice" + cnt).val();
            if (Number(txtReturnQuantityValue) <= Number(txtQuantityValue)) {
                var total = Number(txtReturnQuantityValue) * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total.toFixed(2));
                VatPrc = Number($("#txtTax_Rate" + cnt).val());
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount.toFixed(2));
                var totalAfterVat = Number(vatAmount.toFixed(2)) + Number(total.toFixed(2));
                $("#txtTotAfterTax" + cnt).val(totalAfterVat.toFixed(2));
                ComputeTotals();
            }
            else {
                $("#txtReturnQuantity" + cnt).val(txtQuantityValue);
                DisplayMassage('( يجب ان تكون الكميه المرتجعه اقل من الكمية المباعة)', 'Return Quantity must be less than sold Quantity', MessageType.Error);
                var total = Number(txtReturnQuantityValue) * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total.toFixed(2));
                VatPrc = Number($("#txtTax_Rate" + cnt).val());
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount.toFixed(2));
                var totalAfterVat = Number(vatAmount.toFixed(2)) + Number(total.toFixed(2));
                $("#txtTotAfterTax" + cnt).val(totalAfterVat.toFixed(2));
                ComputeTotals();
            }
        });
        return;
    }
    function Display_GridConrtol(cnt) {
        $("#txtSerial" + cnt).attr("disabled", "disabled");
        $("#txtTax_Rate" + cnt).attr("disabled", "disabled");
        $("#ddlItem" + cnt).attr("disabled", "disabled");
        $("#txtServicCode" + cnt).attr("disabled", "disabled");
        $("#txtQuantity" + cnt).attr("disabled", "disabled");
        $("#txtPrice" + cnt).attr("disabled", "disabled");
        $("#txtReturnQuantity" + cnt).attr("disabled", "disabled");
        $("#txtTotal" + cnt).attr("disabled", "disabled");
        $("#txtTax" + cnt).attr("disabled", "disabled");
        $("#txtTotAfterTax" + cnt).attr("disabled", "disabled");
        $("#btn_minus" + cnt).addClass("display_none");
        $("#btn_minus" + cnt).attr("disabled", "disabled");
        $("#txtSerial" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].Serial);
        $("#txtServicCode" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].it_itemCode);
        $("#InvoiceItemID" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].InvoiceItemID);
        $("#txt_ItemID" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].ItemID);
        $("#ddlItem" + cnt).prop("value", (lang == "ar" ? SlsInvoiceItemsDetails[cnt].it_DescA : SlsInvoiceItemsDetails[cnt].It_DescE));
        $("#txtPrice" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].Unitprice);
        $("#txtTax_Rate" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].VatPrc);
        $("#txtTax_Rate" + cnt).attr('Data-VatNatID', SlsInvoiceItemsDetails[cnt].VatNatID);
        $("#txtDiscountPrc" + cnt).val(SlsInvoiceItemsDetails[cnt].DiscountPrc);
        $("#txtDiscountAmount" + cnt).val(SlsInvoiceItemsDetails[cnt].DiscountAmount);
        $("#txtNetUnitPrice" + cnt).val(SlsInvoiceItemsDetails[cnt].NetUnitPrice);
        //--------------------------------------------****♥Typeuom♥****---------------------
        var Storeid = StoreID;
        var ItemCode = '';
        var ItemID = SlsInvoiceItemsDetails[cnt].ItemID;
        var Mode = SlsInvType;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetItemByCode"),
            data: {
                CompCode: compcode, FinYear: Finyear, ItemCode: ItemCode, ItemID: ItemID, storeid: Storeid, Mode: Mode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    GetItemInfo = result.Response;
                    if (GetItemInfo.length > 0) {
                        $('#ddlTypeuom' + cnt + '').html('');
                        for (var i = 0; i < GetItemInfo.length; i++) {
                            $('#ddlTypeuom' + cnt + '').append('<option  data-OnhandQty="' + GetItemInfo[i].OnhandQty + '" data-UnitPrice="' + GetItemInfo[i].UnitPrice + '" data-MinPrice="' + GetItemInfo[i].MinPrice + '" data-Rate="' + GetItemInfo[i].Rate + '" value="' + GetItemInfo[i].uomid + '">' + (lang == "ar" ? GetItemInfo[i].u_DescA : GetItemInfo[i].u_DescE) + '</option>');
                        }
                    }
                }
            }
        });
        $('#ddlTypeuom' + cnt + '').val(SlsInvoiceItemsDetails[cnt].UomID == null ? 'null' : SlsInvoiceItemsDetails[cnt].UomID);
        debugger;
        if (Show == true) { // display return      
            //bind Data
            $("#txt_StatusFlag" + cnt).val("");
            $("#txtReturnQuantity" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].SoldQty);
            $("#txtQuantity" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].InvoiceSoldQty);
            $("#txtTotal" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].ItemTotal);
            $("#txtTax" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].VatAmount.toFixed(2));
            $("#txtTotAfterTax" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].NetAfterVat.toFixed(2));
            $("#InvoiceItemID" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].InvoiceItemID);
        }
        else { // load from invoice 
            $("#txt_StatusFlag" + cnt).val("i");
            var InvoiceSoldQty = SlsInvoiceItemsDetails[cnt].SoldQty - SlsInvoiceItemsDetails[cnt].TotRetQty;
            var total = InvoiceSoldQty * SlsInvoiceItemsDetails[cnt].NetUnitPrice;
            var vat = total * SlsInvoiceItemsDetails[cnt].VatPrc / 100;
            $("#txtReturnQuantity" + cnt).prop("value", InvoiceSoldQty);
            $("#txtQuantity" + cnt).prop("value", InvoiceSoldQty);
            $("#txtTotal" + cnt).prop("value", total.toFixed(2));
            $("#txtTax" + cnt).prop("value", vat.toFixed(2));
            $("#txtTotAfterTax" + cnt).prop("value", (vat + total).toFixed(2));
            $("#InvoiceItemID" + cnt).prop("value", 0);
            $("#txtReturnQuantity" + cnt).removeAttr("disabled");
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).removeAttr("disabled");
        }
    }
    function ComputeTotals() {
        PackageCount = 0;
        CountTotal = 0;
        var TotalDiscount = 0;
        var Totalbefore = 0;
        TaxCount = 0;
        NetCount = 0;
        for (var i = 0; i < CountGrid; i++) {
            var flagvalue = $("#txt_StatusFlag" + i).val();
            if (flagvalue != "d" && flagvalue != "m") {
                PackageCount += Number($("#txtReturnQuantity" + i).val());
                PackageCount = Number(PackageCount.toFixed(2).toString());
                Totalbefore += (Number($("#txtQuantity" + i).val()) * Number($("#txtPrice" + i).val()));
                Totalbefore = Number(Totalbefore.toFixed(2).toString());
                TotalDiscount += (Number($("#txtQuantity" + i).val()) * Number($("#txtDiscountAmount" + i).val()));
                TotalDiscount = Number(TotalDiscount.toFixed(2).toString());
                CountTotal += Number($("#txtTotal" + i).val());
                CountTotal = Number(CountTotal.toFixed(2).toString());
                TaxCount += Number($("#txtTax" + i).val());
                TaxCount = Number(TaxCount.toFixed(2).toString());
                NetCount += Number($("#txtTotAfterTax" + i).val());
            }
        }
        txtItemCount.value = CountItems.toString();
        txtPackageCount.value = PackageCount.toString();
        txtTotalDiscount.value = TotalDiscount.toString();
        txtTotalbefore.value = Totalbefore.toString();
        txtTotal.value = CountTotal.toString();
        txtTax.value = TaxCount.toString();
        txtNet.value = (Number(NetCount.toFixed(2)) - Number(txtDiscountValue.value)).toFixed(2);
    }
    //------------------------------------------------------ Validation  && clear Region -----------------------------------
    function clear() {
        $('#div_Data').html("");
        txtItemCount.value = "";
        txtPackageCount.value = "";
        txtTotal.value = "";
        txtTax.value = "";
        txtNet.value = "";
        txtInvoiceNumber.value = "";
        lblReturnNumber.value = "";
        txtInvoiceDate.value = "";
        CustomerId = 0;
        ddlReturnTypeShow.value = "0";
        ddlFreeSalesman.value = "null";
        $("#txtCustomerName").prop("value", "");
        $("#txtCustomerName").attr("disabled", "disabled");
        ddlFreeSalesman.disabled = true;
        $('#txtCreatedBy').prop("value", "");
        $('#txtCreatedAt').prop("value", "");
        $('#txtUpdatedBy').prop("value", "");
        $('#txtUpdatedAt').prop("value", "");
        $("#txtInvoiceDate").attr("disabled", "disabled");
        $("#ddlInvoiceCustomer").attr("disabled", "disabled");
        $("#ddlReturnTypeShow").attr("disabled", "disabled");
        $("#ddlFreeSalesman").attr("disabled", "disabled");
        $("#ddlCashBox").attr("disabled", "disabled");
        $("#txtCashAmount").attr("disabled", "disabled");
        $("#ddlCashBox").prop("value", "null");
        $("#txtCashAmount").prop("value", "");
        $("#ddlTaxTypeHeader").prop("value", "null");
        $("#btnPrint").addClass("display_none");
        for (var cnt = 0; cnt <= CountGrid; cnt++) {
            $("#ddlFamily" + cnt).attr("disabled", "disabled");
            $("#ddlItem" + cnt).attr("disabled", "disabled");
            $("#txtQuantity" + cnt).attr("disabled", "disabled");
            $("#txtPrice" + cnt).attr("disabled", "disabled");
            $("#txtReturnQuantity" + cnt).attr("disabled", "disabled");
            $("#txtTotal" + cnt).attr("disabled", "disabled");
            $("#txtTax" + cnt).attr("disabled", "disabled");
            $("#txtTotAfterTax" + cnt).attr("disabled", "disabled");
            $('.btn-number1' + cnt).attr("disabled", "disabled");
            $('.input-number1' + cnt).attr("disabled", "disabled");
            $('.btn-number2' + cnt).attr("disabled", "disabled");
            $('.input-number2' + cnt).attr("disabled", "disabled");
            $('.btn-number3' + cnt).attr("disabled", "disabled");
            $('.input-number3' + cnt).attr("disabled", "disabled");
        }
        txtInvoiceDate.value = GetDate();
    }
    function ValidationHeader() {
        var newCount = 0;
        for (var i = 0; i < CountGrid; i++) {
            if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m") {
                newCount++;
            }
        }
        var NetVal = 0;
        var CashVal = 0;
        if (txtNet.value != "")
            NetVal = Number(Number(txtNet.value).toFixed(2));
        if (txtCashAmount.value != "")
            CashVal = Number(Number(txtCashAmount.value).toFixed(2));
        if (newCount == 0) {
            DisplayMassage("برجاء ادخال بيانات المرتجع", 'please Enter Return Data', MessageType.Error);
            return false;
        }
        else if (chkActive.checked == true && ddlReturnTypeShow.value == "1" && txtCashAmount.value != "" && (ddlCashBox.value == "null" || ddlCashBox.value == null)) {
            DisplayMassage("برجاءاختيار الصندوق", 'please select Cashbox', MessageType.Error);
            Errorinput(ddlCashBox);
            return false;
        }
        else if (Number(txtCashAmount.value) != NetVal && chkActive.checked == true && ddlReturnTypeShow.value == "1") {
            DisplayMassage("يجب ان يتساوي المبلغ المسدد مع الصافي", 'paid amount must be equal to the net', MessageType.Error);
            Errorinput(txtNet);
            Errorinput(txtCashAmount);
            return false;
        }
        return true;
    }
    function ValidationGrid(i) {
        if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m") {
            var RetQty = Number($("#txtReturnQuantity" + i).val());
            if (RetQty == 0) {
                DisplayMassage('( يجب أضافه قيمه للكمية المرتجعه ع الفاتورة)', 'you must add value to the return quantity', MessageType.Error);
                Errorinput($("#txtReturnQuantity" + i));
                return false;
            }
            else
                return true;
        }
    }
    //--------------------------------------------------- Main Functions-----------------------------------------------
    function Assign() {
        MasterDetailModel = new SlsInvoiceMasterDetails();
        invoiceItemsModel = new Array();
        InvoiceModel = new I_Sls_TR_Invoice();
        // Header
        InvoiceModel.CompCode = Number(compcode);
        InvoiceModel.BranchCode = Number(BranchCode);
        InvoiceModel.VatType = vatType;
        InvoiceModel.VatAmount = Number(txtTax.value);
        InvoiceModel.InvoiceTransCode = InvoiceStatisticsModel[0].InvoiceTransCode;
        InvoiceModel.InvoiceTypeCode = InvoiceStatisticsModel[0].InvoiceTypeCode;
        InvoiceModel.RoundingAmount = Number(txtDiscountValue.value);
        InvoiceModel.Remark = $('#txt_Remarks').val();
        InvoiceModel.TrType = 1; //0 invoice 1 return
        InvoiceModel.SlsInvSrc = 1; // 1 from store 2 from van 
        InvoiceModel.SlsInvType = InvoiceStatisticsModel[0].SlsInvType; //  retail 
        InvoiceModel.StoreId = StoreID; //main store
        InvoiceModel.CRDBReasoncode = 1;
        if (txtInvoiceNumber.value.toString() == "") {
            InvoiceModel.RefTrID = null;
        }
        else {
            InvoiceModel.RefTrID = globalInvoiceID;
        }
        /////////////////////
        if (ddlReturnTypeShow.value == "0") {
            InvoiceModel.IsCash = false;
            InvoiceModel.CustomerName = $("#txtCustomerName").val();
        }
        else {
            InvoiceModel.IsCash = true;
            InvoiceModel.CustomerName = $("#txtCustomerName").val();
            InvoiceModel.CashAmount = $("#txtCashAmount").val();
        }
        InvoiceModel.CashBoxID = Number(ddlCashBox.value);
        InvoiceModel.CustomerId = CustomerId;
        InvoiceModel.PaymentMeansTypeCode = ddlReturnTypeShow.value == '0' ? 2 : 1; //  Cash or   Credit
        InvoiceModel.SalesmanId = Number(ddlFreeSalesman.value);
        InvoiceModel.TrDate = txtInvoiceDate.value;
        InvoiceModel.NetAfterVat = NetCount;
        InvoiceModel.TotalAmount = Number(txtTotal.value);
        if (chkActive.checked == true) {
            InvoiceModel.Status = 1;
        }
        else {
            InvoiceModel.Status = 0;
        }
        // Details
        var StatusFlag;
        for (var i = 0; i < CountGrid; i++) {
            invoiceItemSingleModel = new I_Sls_TR_InvoiceItems();
            StatusFlag = '';
            StatusFlag = $("#txt_StatusFlag" + i).val();
            var Qty = Number($('#txtReturnQuantity' + i).val());
            if (StatusFlag == "i") {
                invoiceItemSingleModel.InvoiceItemID = 0;
                invoiceItemSingleModel.ItemID = $("#txt_ItemID" + i).val();
                invoiceItemSingleModel.UomID = $("#ddlTypeuom" + i).val();
                invoiceItemSingleModel.Serial = $("#txtSerial" + i).val();
                var SoldQty = Number($("#txtReturnQuantity" + i).val());
                invoiceItemSingleModel.InvoiceSoldQty = Number($("#txtQuantity" + i).val());
                invoiceItemSingleModel.SoldQty = $('#txtReturnQuantity' + i).val();
                invoiceItemSingleModel.StockSoldQty = Number($('option:selected', $("#ddlTypeuom" + i)).attr('data-rate')) * Number($('#txtReturnQuantity' + i).val()); //
                invoiceItemSingleModel.Unitprice = $("#txtPrice" + i).val();
                VatPrc = $("#txtTax_Rate" + i).val();
                var VatNatID = Number($("#txtTax_Rate" + i).attr('data-VatNatID'));
                invoiceItemSingleModel.VatPrc = VatPrc;
                invoiceItemSingleModel.VatApplied = VatPrc;
                invoiceItemSingleModel.VatNatID = VatNatID;
                invoiceItemSingleModel.VatAmount = $("#txtTax" + i).val();
                invoiceItemSingleModel.ItemNetAmount = $("#txtTotAfterTax" + i).val();
                invoiceItemSingleModel.ItemTotal = invoiceItemSingleModel.Unitprice * invoiceItemSingleModel.SoldQty;
                invoiceItemSingleModel.DiscountPrc = $("#txtDiscountPrc" + i).val();
                invoiceItemSingleModel.DiscountAmount = $("#txtDiscountAmount" + i).val();
                invoiceItemSingleModel.NetUnitPrice = $("#txtNetUnitPrice" + i).val();
                invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                if (invoiceItemSingleModel.SoldQty > 0) {
                    invoiceItemsModel.push(invoiceItemSingleModel);
                }
            }
            if (StatusFlag == "u") {
                var invoiceItemId = $("#InvoiceItemID" + i).val();
                invoiceItemSingleModel.InvoiceItemID = invoiceItemId;
                invoiceItemSingleModel.ItemID = $("#txt_ItemID" + i).val();
                invoiceItemSingleModel.UomID = $("#ddlTypeuom" + i).val();
                invoiceItemSingleModel.Serial = $("#txtSerial" + i).val();
                invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                var SoldQty = Number($("#txtReturnQuantity" + i).val());
                var TotRetQty = Number($("#txtQuantity" + i).val());
                invoiceItemSingleModel.InvoiceSoldQty = (TotRetQty - SoldQty);
                invoiceItemSingleModel.SoldQty = $('#txtReturnQuantity' + i).val();
                invoiceItemSingleModel.StockSoldQty = Number($('option:selected', $("#ddlTypeuom" + i)).attr('data-rate')) * Number($('#txtReturnQuantity' + i).val()); //
                invoiceItemSingleModel.Unitprice = $("#txtPrice" + i).val();
                VatPrc = $("#txtTax_Rate" + i).val();
                var VatNatID = Number($("#txtTax_Rate" + i).attr('data-VatNatID'));
                invoiceItemSingleModel.VatPrc = VatPrc;
                invoiceItemSingleModel.VatApplied = VatPrc;
                invoiceItemSingleModel.VatNatID = VatNatID;
                invoiceItemSingleModel.ItemNetAmount = $("#txtTotAfterTax" + i).val();
                invoiceItemSingleModel.ItemTotal = invoiceItemSingleModel.Unitprice * invoiceItemSingleModel.SoldQty;
                invoiceItemSingleModel.DiscountPrc = $("#txtDiscountPrc" + i).val();
                invoiceItemSingleModel.DiscountAmount = $("#txtDiscountAmount" + i).val();
                invoiceItemSingleModel.NetUnitPrice = $("#txtNetUnitPrice" + i).val();
                invoiceItemSingleModel.VatAmount = invoiceItemSingleModel.ItemTotal * invoiceItemSingleModel.VatPrc / 100;
                invoiceItemSingleModel.NetAfterVat = invoiceItemSingleModel.ItemTotal + invoiceItemSingleModel.VatAmount;
                if (invoiceItemSingleModel.SoldQty > 0) {
                    invoiceItemsModel.push(invoiceItemSingleModel);
                }
            }
            if (StatusFlag == "d") {
                if ($("#InvoiceItemID" + i).val() != "") {
                    var deletedID = $("#InvoiceItemID" + i).val();
                    invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                    invoiceItemSingleModel.InvoiceItemID = deletedID;
                    invoiceItemsModel.push(invoiceItemSingleModel);
                }
            }
        }
        MasterDetailModel.I_Sls_TR_Invoice = InvoiceModel;
        MasterDetailModel.I_Sls_TR_InvoiceItems = invoiceItemsModel;
        MasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
    }
    function Insert() {
        InvoiceModel.InvoiceID = 0;
        InvoiceModel.CreatedBy = SysSession.CurrentEnvironment.UserCode;
        InvoiceModel.CreatedAt = DateTimeFormat(Date().toString());
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("SlsTrSales", "InsertSlsReturnMasterDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DisplayMassage("تم اصدار  مرتجع رقم " + res.TrNo, 'Return Number ' + res.TrNo + "has been issued", MessageType.Succeed);
                    var returnValue = res.TrNo.toString();
                    lblReturnNumber.value = returnValue.toString();
                    GlobalReturnID = res.InvoiceID;
                    $('#txtCreatedBy').prop("value", SysSession.CurrentEnvironment.UserCode);
                    $('#txtCreatedAt').prop("value", DateTimeFormat(Date().toString()));
                    Success();
                    AfterInsertOrUpdateFlag = true;
                    Grid_RowDoubleClicked();
                    InsertFlag = true;
                    DownloadInvoicePdf();
                }
                else {
                    DisplayMassage("هناك خطــأ ", '(Error)', MessageType.Error);
                    InsertFlag = true;
                }
            }
        });
    }
    function Success() {
        globalInvoiceID = 0;
        InitializeGrid();
        $("#divReturnDetails").removeClass("display_none");
        $("#ddlCashBox").attr("disabled", "disabled");
        $("#txtCashAmount").attr("disabled", "disabled");
        $("#btnInvoiceSearch").attr("disabled", "disabled");
        $('#btnPrint').removeClass("display_none");
        $("#btnSave").addClass("display_none");
        $('#btnBack').addClass("display_none");
        $('#btnEdit').removeClass("display_none");
        $("#div_hedr").removeAttr("disabled");
        $("#div_hedr").removeClass("disabledDiv");
        txtInvoiceDate.disabled = true;
        chkPreivilegeToEditApprovedReturns();
        $("#divShow").removeClass("display_none");
        $("#divGridDetails_View").removeClass("disabledDiv");
        $("#divGridDetails_View").removeClass("display_none");
        for (var i = 0; i < CountGrid; i++) {
            $("#txtReturnQuantity" + i).attr("disabled", "disabled");
            $('.btn-number1' + i).attr("disabled", "disabled");
            $('.input-number1' + i).attr("disabled", "disabled");
            $('.btn-number2' + i).attr("disabled", "disabled");
            $('.input-number2' + i).attr("disabled", "disabled");
            $('.btn-number3' + i).attr("disabled", "disabled");
            $('.input-number3' + i).attr("disabled", "disabled");
        }
        $('#btnPrintTransaction').removeClass("display_none");
    }
    function Update() {
        InvoiceModel.InvoiceID = GlobalReturnID;
        if (InvoiceStatisticsModel.length > 0) {
            InvoiceModel.CreatedBy = InvoiceStatisticsModel[0].CreatedBy;
            InvoiceModel.CreatedAt = InvoiceStatisticsModel[0].CreatedAt;
        }
        else {
            InvoiceModel.CreatedBy = SysSession.CurrentEnvironment.UserCode;
            InvoiceModel.CreatedAt = DateTimeFormat(Date().toString());
        }
        InvoiceModel.DocNo = InvoiceStatisticsModel[0].DocNo;
        InvoiceModel.DocUUID = InvoiceStatisticsModel[0].DocUUID;
        InvoiceModel.TrTime = InvoiceStatisticsModel[0].TrTime;
        InvoiceModel.TrNo = Number(lblReturnNumber.value);
        InvoiceModel.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        InvoiceModel.UpdatedAt = DateTimeFormat(Date().toString());
        InvoiceModel.RefTrID = Number(globalInvoiceID);
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("SlsTrSales", "updateReturnMasterDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    GlobalReturnID = res.InvoiceID;
                    DisplayMassage("تم تعديل المرتجع بنجاح  ", 'Return number ' + res.TrNo + ' modified Successfully', MessageType.Succeed);
                    $('#txtUpdatedBy').prop("value", res.UpdatedBy);
                    $('#txtUpdatedAt').prop("value", res.UpdatedAt);
                    Success();
                    AfterInsertOrUpdateFlag = true;
                    Grid_RowDoubleClicked();
                }
                else {
                    DisplayMassage("هناك خطـأ", '(Error)', MessageType.Error);
                }
            }
        });
        EditFlag = false;
    }
    function openReturn() {
        Assign();
        InvoiceModel.InvoiceID = GlobalReturnID;
        if (InvoiceStatisticsModel.length > 0) {
            InvoiceModel.CreatedBy = InvoiceStatisticsModel[0].CreatedBy;
            InvoiceModel.CreatedAt = InvoiceStatisticsModel[0].CreatedAt;
        }
        else {
            InvoiceModel.CreatedBy = SysSession.CurrentEnvironment.UserCode;
            InvoiceModel.CreatedAt = DateTimeFormat(Date().toString());
        }
        InvoiceModel.DocNo = InvoiceStatisticsModel[0].DocNo;
        InvoiceModel.DocUUID = InvoiceStatisticsModel[0].DocUUID;
        InvoiceModel.TrTime = InvoiceStatisticsModel[0].TrTime;
        InvoiceModel.TrNo = Number(lblReturnNumber.value);
        InvoiceModel.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        InvoiceModel.UpdatedAt = DateTimeFormat(Date().toString());
        InvoiceModel.RefTrID = Number(globalInvoiceID);
        InvoiceModel.Status = 0;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("SlsTrSales", "OpenReturn"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    GlobalReturnID = res.InvoiceID;
                    btnEdit.disabled = false;
                    Success();
                    AfterInsertOrUpdateFlag = true;
                    Grid_RowDoubleClicked();
                }
                else {
                    btnEdit.disabled = true;
                }
            }
        });
    }
    //----------------------------------------------------------PRint region---------------------------------------
    function PrintReport(OutType) {
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.RepType = OutType; //output report as View
        rp.FromDate = DateFormatRep(txtStartDate.value);
        rp.ToDate = DateFormatRep(txtEndDate.value);
        rp.CompCode = SysSession.CurrentEnvironment.CompCode;
        rp.BranchCode = SysSession.CurrentEnvironment.BranchCode;
        rp.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
        rp.CompNameE = SysSession.CurrentEnvironment.CompanyName;
        rp.UserCode = SysSession.CurrentEnvironment.UserCode;
        rp.Tokenid = SysSession.CurrentEnvironment.Token;
        var BranchNameA = SysSession.CurrentEnvironment.BranchName;
        var BranchNameE = SysSession.CurrentEnvironment.BranchNameEn;
        rp.ScreenLanguage = SysSession.CurrentEnvironment.ScreenLanguage;
        rp.SystemCode = SysSession.CurrentEnvironment.SystemCode;
        rp.SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        if (BranchNameA == null || BranchNameE == null) {
            BranchNameA = " ";
            BranchNameE = " ";
        }
        rp.BraNameA = BranchNameA;
        rp.BraNameE = BranchNameE;
        rp.LoginUser = SysSession.CurrentEnvironment.UserCode;
        if (ddlSalesMan.selectedIndex > 0) {
            rp.SalesmanID = Number($("#ddlSalesMan").val());
        }
        else {
            rp.SalesmanID = -1;
        }
        if ($("#ddlCustomer").val() == "null") {
            rp.CustomerID = -1;
        }
        else {
            rp.CustomerID = Number($("#ddlCustomer").val());
        }
        rp.CashType = Number($("#ddlReturnType").val());
        rp.OperationId = -1;
        rp.Status = Number($("#ddlStateType").val());
        rp.TrType = 1;
        rp.src = 1;
        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_SlsInvoiceList", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                window.open(result, "_blank");
            }
        });
    }
    SlsTrSalesReturn.PrintReport = PrintReport;
    function PrintTransaction() {
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        window.open(Url.Action("ReportsPopup", "Home"), "blank");
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        var rp = new ReportParameters();
        rp.CompCode = SysSession.CurrentEnvironment.CompCode;
        rp.BranchCode = SysSession.CurrentEnvironment.BranchCode;
        rp.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
        rp.CompNameE = SysSession.CurrentEnvironment.CompanyName;
        rp.UserCode = SysSession.CurrentEnvironment.UserCode;
        rp.Tokenid = SysSession.CurrentEnvironment.Token;
        rp.ScreenLanguage = SysSession.CurrentEnvironment.ScreenLanguage;
        rp.SystemCode = SysSession.CurrentEnvironment.SystemCode;
        rp.SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        var BranchNameA = SysSession.CurrentEnvironment.BranchName;
        var BranchNameE = SysSession.CurrentEnvironment.BranchName;
        if (BranchNameA == null || BranchNameE == null) {
            BranchNameA = " ";
            BranchNameE = " ";
        }
        rp.BraNameA = BranchNameA;
        rp.BraNameE = BranchNameE;
        rp.Type = 0;
        rp.Repdesign = 1;
        debugger;
        rp.TRId = GlobalReturnID;
        Ajax.CallAsync({
            url: Url.Action("rptInvoiceNoteRet", "GeneralRep"),
            data: rp,
            success: function (d) {
                var result = d;
                window.open(Url.Action("ReportsPopup", "Home"), "blank");
                localStorage.setItem("result", "" + result + "");
                //let result = d.result as string;
                //window.open(result, "_blank");
            }
        });
    }
    function DownloadInvoicePdf() {
        var rp = new ReportParameters();
        rp.CompCode = SysSession.CurrentEnvironment.CompCode;
        rp.BranchCode = SysSession.CurrentEnvironment.BranchCode;
        rp.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
        rp.CompNameE = SysSession.CurrentEnvironment.CompanyName;
        rp.UserCode = SysSession.CurrentEnvironment.UserCode;
        rp.Tokenid = SysSession.CurrentEnvironment.Token;
        rp.ScreenLanguage = SysSession.CurrentEnvironment.ScreenLanguage;
        rp.SystemCode = SysSession.CurrentEnvironment.SystemCode;
        rp.SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        rp.DocPDFFolder = SysSession.CurrentEnvironment.I_Control[0].DocPDFFolder;
        var BranchNameA = SysSession.CurrentEnvironment.BranchName;
        var BranchNameE = SysSession.CurrentEnvironment.BranchName;
        if (BranchNameA == null || BranchNameE == null) {
            BranchNameA = " ";
            BranchNameE = " ";
        }
        rp.BraNameA = BranchNameA;
        rp.BraNameE = BranchNameE;
        rp.Type = 0;
        rp.Repdesign = 1;
        debugger;
        rp.TRId = GlobalReturnID;
        Ajax.CallAsync({
            url: Url.Action("rptInvoiceNoteRet", "Reports_pdf"),
            data: rp,
            success: function (d) {
            }
        });
    }
    function btnPrintNew_onclick() {
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        if (($('#ToNum').val() == 0 && $('#fromNum').val() == 0) || ($('#ToNum').val() == '' && $('#fromNum').val() == '')) {
            Errorinput($('#ToNum'));
            Errorinput($('#fromNum'));
            return;
        }
        window.open(Url.Action("ReportsPopup", "Home"), "blank");
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div><br/>');
        btnShow_onclick();
        var rp = new ReportParameters();
        rp.CompCode = SysSession.CurrentEnvironment.CompCode;
        rp.BranchCode = SysSession.CurrentEnvironment.BranchCode;
        rp.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
        rp.CompNameE = SysSession.CurrentEnvironment.CompanyName;
        rp.UserCode = SysSession.CurrentEnvironment.UserCode;
        rp.Tokenid = SysSession.CurrentEnvironment.Token;
        rp.ScreenLanguage = SysSession.CurrentEnvironment.ScreenLanguage;
        rp.SystemCode = SysSession.CurrentEnvironment.SystemCode;
        rp.SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        var BranchNameA = SysSession.CurrentEnvironment.BranchName;
        var BranchNameE = SysSession.CurrentEnvironment.BranchName;
        if (BranchNameA == null || BranchNameE == null) {
            BranchNameA = " ";
            BranchNameE = " ";
        }
        rp.BraNameA = BranchNameA;
        rp.BraNameE = BranchNameE;
        rp.Type = 0;
        rp.Repdesign = 1;
        html = "";
        setTimeout(function () {
            debugger;
            for (var i = 0; i < SlsInvoiceStatisticsDetails.length; i++) {
                rp.TRId = SlsInvoiceStatisticsDetails[i].InvoiceID;
                Ajax.Callsync({
                    url: Url.Action("rptInvoiceNoteRet", "GeneralRep"),
                    data: rp,
                    success: function (d) {
                        var result = d;
                        html += result;
                        localStorage.setItem("result", "" + html + "");
                        //let result = d.result as string;    
                        //window.open(result, "_blank");
                    }
                });
            }
            window.open(Url.Action("ReportsPopup", "Home"), "blank");
        }, 700);
    }
})(SlsTrSalesReturn || (SlsTrSalesReturn = {}));
//# sourceMappingURL=SlsTrSalesReturn.js.map