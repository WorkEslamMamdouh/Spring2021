$(document).ready(function () {
    CUSTOMERS.InitalizeComponent();
});
var CUSTOMERS;
(function (CUSTOMERS) {
    // Arrays
    var AccountType = 2;
    var MSG_ID;
    //var Details: Array<CUSTOMER> = new Array<CUSTOMER>();
    var invoiceItemSingleModel = new I_Item_Customer();
    var InvoiceItemsDetailsModel = new Array();
    var Det_Single_Cust = new CUSTOMER();
    var CustMasterDetails = new CustomerMasterDetails();
    var Details_Updata_Cust = new Array();
    var I_Item_Cust = new Array();
    var CustomerDetails = new Array();
    var SearchDetails = new Array();
    var BilldIData = new Array();
    var Model = new CUSTOMER();
    var Tax_Type_Model = new Tax_Type();
    var ReportGrid = new JsGrid();
    var CashDetailsAr = new Array();
    var CashDetailsEn = new Array();
    var SlsInvoiceItemsDetails = new Array();
    var sys = new SystemTools();
    var SysSession = GetSystemSession();
    var InvoiceType = 0; // 1:Retail invoice , 2: Wholesale invoice            
    var SlsInv = $('#SlsInvType').val();
    InvoiceType = 1;
    var vatType;
    var Tax_Rate;
    var VatPrc;
    var Finyear;
    var BranchCode;
    var CountGrid = 0;
    var CountItems = 0;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var ID_CUSTOMER;
    var txt_NAME;
    var txt_phone;
    var txt_Notes;
    var txt_Type_CUSTOMER;
    var btnback;
    var btnShow;
    var btnAdd;
    var btnEdit;
    var btnsave;
    var btnAddDetails;
    var txtPackageCount;
    var txtItemCount;
    var searchbutmemreport;
    var txt_Debit;
    var txt_DebitFC;
    var txt_Openbalance;
    var compcode; //SharedSession.CurrentEnvironment.CompCode;
    var IsNew = false;
    var index;
    var Selecteditem = new Array();
    var CustomerIdUpdate = 0;
    var CustomerId;
    var sum_balance;
    var Debit;
    var Credit;
    var Valid = 0;
    var Update_claenData = 0;
    var StatusFlag;
    var txt_ID_APP_Category;
    var txt_Cust_Type;
    var CUSTOMER_ID = 0;
    var NumCnt = 0;
    var status;
    var CheckISActive;
    function InitalizeComponent() {
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        Finyear = Number(SysSession.CurrentEnvironment.CurrentYear);
        //debugger;
        if (SysSession.CurrentEnvironment.ScreenLanguage = "ar") {
            document.getElementById('Screen_name').innerHTML = "??????????????";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "CUSTOMER";
        }
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        InitalizeControls();
        InitalizeEvents();
    }
    CUSTOMERS.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        txt_ID_APP_Category = document.getElementById("txt_ID_APP_Category");
        txt_Cust_Type = document.getElementById("txt_Cust_Type");
        status = document.getElementById('id_chkcustom6');
        CheckISActive = document.getElementById('CheckISActive');
        btnShow = document.getElementById("btnShow");
        btnAdd = document.getElementById("btnAdd");
        btnEdit = document.getElementById("btnedite");
        btnsave = document.getElementById("btnsave");
        btnAddDetails = document.getElementById("btnAddDetails");
        btnback = document.getElementById("btnback");
        ID_CUSTOMER = document.getElementById("txt_NAME");
        txt_NAME = document.getElementById("txt_NAME");
        txt_phone = document.getElementById("txt_NAME");
        txt_Notes = document.getElementById("txt_NAME");
        txt_Type_CUSTOMER = document.getElementById("txt_NAME");
        searchbutmemreport = document.getElementById("searchbutmemreport");
        txtPackageCount = document.getElementById("txtPackageCount");
        txtItemCount = document.getElementById("txtItemCount");
        txt_Debit = document.getElementById("txt_Debit");
        txt_DebitFC = document.getElementById("txt_DebitFC");
        txt_Openbalance = document.getElementById("txt_Openbalance");
    }
    function InitalizeEvents() {
        btnShow.onclick = btnShow_onclick;
        btnAdd.onclick = btnAdd_onclick;
        btnsave.onclick = btnsave_onClick;
        btnback.onclick = btnback_onclick;
        btnEdit.onclick = btnEdit_onclick;
        txt_Cust_Type.onchange = txt_Cust_Type_onchange;
        searchbutmemreport.onkeyup = _SearchBox_Change;
        txt_Openbalance.onkeyup = txt_Openbalance_onchange;
        btnAddDetails.onclick = AddNewRow;
    }
    function Display_All() {
        var CreditType = $("#txt_ID_APP_Type").val();
        var BalType = $("#txt_indebtedness").val();
        CustomerDetails = new Array();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Customer", "GetFiltered"),
            data: { CreditType: CreditType, BalType: BalType },
            success: function (d) {
                debugger;
                var result = d;
                if (result.IsSuccess) {
                    CustomerDetails = result.Response;
                    for (var i = 0; i < CustomerDetails.length; i++) {
                        CustomerDetails[i].Name_STATUS = CustomerDetails[i].STATUS == false ? '?????? ????????' : '????????';
                        CustomerDetails[i].NameIsCreditCustomer = CustomerDetails[i].IsCreditCustomer == false ? '??????' : '????????';
                        //Credit = Number(CustomerDetails[i].Openbalance - CustomerDetails[i].CreditLimit);
                        //if (Credit < 0) {
                        //    CustomerDetails[i].Debit = (Credit * -1);
                        //    CustomerDetails[i].DebitFC = 0;
                        //}
                        //else {
                        //    CustomerDetails[i].DebitFC = Credit;
                        //    CustomerDetails[i].Debit = 0;
                        //}
                    }
                    InitializeGrid();
                    ReportGrid.DataSource = CustomerDetails;
                    ReportGrid.Bind();
                }
            }
        });
    }
    function InitializeGrid() {
        var res = GetResourceList("");
        $("#id_ReportGrid").attr("style", "");
        ReportGrid.OnRowDoubleClicked = DriverDoubleClick;
        ReportGrid.ElementName = "ReportGrid";
        ReportGrid.PrimaryKey = "CUSTOMER_ID";
        ReportGrid.Paging = true;
        ReportGrid.PageSize = 10;
        ReportGrid.Sorting = true;
        ReportGrid.InsertionMode = JsGridInsertionMode.Binding;
        ReportGrid.Editing = false;
        ReportGrid.Inserting = false;
        ReportGrid.SelectedIndex = 1;
        ReportGrid.OnItemEditing = function () { };
        ReportGrid.Columns = [
            { title: "??????????", name: "CUSTOMER_ID", type: "text", width: "100px", visible: false },
            { title: "??????????", name: "CustomerCODE", type: "text", width: "100px" },
            { title: "??????????", name: "CUSTOMER_NAME", type: "text", width: "100px" },
            { title: "?????? ????????????", name: "PHONE", type: "text", width: "100px" },
            { title: "??????????", name: "NameIsCreditCustomer", type: "text", width: "100px" },
            { title: "???????????? ??????????????????", name: "Openbalance", type: "text", width: "100px" },
            { title: "????????", name: "Debit", type: "text", width: "100px" },
            { title: "????????", name: "Credit", type: "text", width: "100px" },
            { title: "????????????", name: "CreditLimit", type: "text", width: "100px" },
            { title: "????????", name: "Name_STATUS", type: "textdd", width: "100px" },
        ];
        ReportGrid.Bind();
    }
    function DriverDoubleClick() {
        debugger;
        Selecteditem = CustomerDetails.filter(function (s) { return s.CUSTOMER_ID == Number(ReportGrid.SelectedKey); });
        DocumentActions.RenderFromModel(Selecteditem[0]);
        $('#txt_Cust_Type').val(Selecteditem[0].IsCreditCustomer == false ? '0' : '1');
        if (Selecteditem[0].STATUS) {
            status.checked = true;
        }
        else
            status.checked = false;
        $('#txtItemCount').val("0");
        $('#btnedite').removeClass("display_none");
        $('#btnsave').addClass("display_none");
        $('#btnback').addClass("display_none");
        $('#btnedite').removeAttr("disabled");
        $('#Div_control').removeClass("display_none");
        if (Selecteditem[0].IsCreditCustomer == false) {
            $('#div_Balance').removeClass("display_none");
        }
        else {
            $('#div_Balance').addClass("display_none");
            txt_Debit.value = "0";
            txt_DebitFC.value = "0";
        }
        CUSTOMER_ID = Selecteditem[0].CUSTOMER_ID;
        $('#Div_control').removeClass("display_none");
        BindCustItemsGridData(CUSTOMER_ID);
        $('#DivShow').removeClass("display_none");
        $("#DivShow :input").attr("disabled", "disabled");
        //Debit = Selecteditem[0].CreditLimit;
        //Credit = Number(Selecteditem[0].Openbalance - Selecteditem[0].CreditLimit);
        //if (Credit < 0) {
        //    $('#txt_Debit').val((Credit * -1));
        //    $('#txt_DebitFC').val(('0'));
        //}
        //else {
        //    $('#txt_DebitFC').val((Credit));
        //    $('#txt_Debit').val(('0'));
        //}
        if (SysSession.CurrentEnvironment.I_Control[0].SalesPriceWithVAT == false) {
            $('#DivShow').addClass('display_none');
        }
    }
    function BindCustItemsGridData(CUSTOMERID) {
        debugger;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Customer", "GetI_Item_CustomerByID"),
            data: { CUSTOMER_ID: CUSTOMERID },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    I_Item_Cust = result.Response;
                    CountGrid = 0;
                    $("#div_Data").html('');
                    for (var i = 0; i < I_Item_Cust.length; i++) {
                        BuildControls(i);
                        Disbly_BuildControls(i, I_Item_Cust);
                        CountGrid++;
                    }
                    $("#txtItemCount").val(CountGrid);
                }
            }
        });
    }
    function txt_Openbalance_onchange() {
        if (IsNew != true) {
            //$('#txt_DebitFC').val((Number(txt_Openbalance.value) - Debit).toString());
            var credit = Selecteditem[0].Debit - Number(txt_Openbalance.value);
            if (credit > 0) {
                $('#txt_Debit').val(credit);
                $('#txt_DebitFC').val("0");
            }
            else {
                $('#txt_DebitFC').val(credit * -1);
                $('#txt_Debit').val("0");
            }
        }
        else {
            $('#txt_DebitFC').val(txt_Openbalance.value);
        }
    }
    function btnEdit_onclick() {
        IsNew = false;
        $('#btnsave').removeClass("display_none");
        $('#btnback').removeClass("display_none");
        $("#Div_control :input").removeAttr("disabled");
        $('#btnedite').addClass("display_none");
        $("#id_div_Add").addClass("disabledDiv");
        $('#txt_balance').attr("disabled", "disabled");
        $('#txt_DebitFC').attr("disabled", "disabled");
        $('#txt_Debit').attr("disabled", "disabled");
        $('#txt_Openbalance').attr("disabled", "disabled");
        $('#txt_CustomerCODE').attr("disabled", "disabled");
        $("#btnAddDetails").removeAttr("disabled");
        $('#btnAddDetails').removeClass("display_none");
        for (var i = 0; i < CountGrid; i++) {
            $("#btnSearchService" + i).removeAttr("disabled");
            $("#ddlTypeuom" + i).removeAttr("disabled");
            $("#txtPrice" + i).removeAttr("disabled");
            $("#CheckISActive" + i).removeAttr("disabled");
            $("#btn_minus" + i).removeAttr("disabled");
            $("#btn_minus" + i).removeClass("display_none");
        }
    }
    function btnAdd_onclick() {
        debugger;
        IsNew = true;
        EnableControls();
        $('#btnsave').removeClass("display_none");
        $('#btnback').removeClass("display_none");
        $("#Div_control :input").removeAttr("disabled");
        $('#btnedite').addClass("display_none");
        $("#id_div_Add").addClass("disabledDiv");
        $("#Div_control :input").val("");
        $('#txt_balance').attr("disabled", "disabled");
        $('#txt_DebitFC').attr("disabled", "disabled");
        $('#txt_Debit').attr("disabled", "disabled");
        $('#txt_CustomerCODE').attr("disabled", "disabled");
        $('#Div_control').removeClass("display_none");
        status.checked = true;
        txt_Cust_Type.value = 'Null';
        if (SysSession.CurrentEnvironment.I_Control[0].SalesPriceWithVAT == false) {
            $('#DivShow').addClass('display_none');
        }
    }
    function btnsave_onClick() {
        if (!Validation())
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
            Insert();
        }
    }
    function btnback_onclick() {
        Selecteditem = CustomerDetails.filter(function (x) { return x.CUSTOMER_ID == Number(ReportGrid.SelectedKey); });
        if (Selecteditem.length == 0) {
            IsNew = true;
        }
        if (IsNew == true) {
            $('#btnAddDetails').toggleClass("display_none");
            $('#btnsave').toggleClass("display_none");
            $('#btnback').toggleClass("display_none");
            $(".fa-minus-circle").addClass("display_none");
            $("#btnedite").removeClass("display_none");
            $("#btnedite").removeAttr("disabled");
            $("#Div_control").addClass("display_none");
            $("#id_div_Add").attr("disabled", "");
            $("#id_div_Add").removeClass("disabledDiv");
        }
        else {
            $('#btnAddDetails').toggleClass("display_none");
            $('#btnsave').toggleClass("display_none");
            $('#btnback').toggleClass("display_none");
            $(".fa-minus-circle").addClass("display_none");
            $("#btnedite").removeClass("display_none");
            $("#btnedite").removeAttr("disabled");
            Update_claenData = 0;
            $("#id_div_Add").attr("disabled", "");
            $("#id_div_Add").removeClass("disabledDiv");
        }
        $("#Div_control :input").attr("disabled", "disabled");
        DriverDoubleClick();
    }
    function btnShow_onclick() {
        Display_All();
    }
    function Validation() {
        if ($('#txt_Cust_Type').val() == "Null") {
            MessageBox.Show("?????? ???????????? ?????????? ", " ");
            Errorinput($('#txt_Cust_Type'));
            return false;
        }
        if ($('#txt_NAME').val() == "") {
            MessageBox.Show("?????? ?????????? ?????? ???????????? ", " ");
            Errorinput($('#txt_NAME'));
            return false;
        }
        if ($('#txt_MOBILE').val() == 0) {
            MessageBox.Show("?????? ?????????? ???????????? ", " ");
            Errorinput($('#txt_MOBILE'));
            return false;
        }
        if ($('#txt_Email').val().trim() != '') {
            if (validate_email() == false) {
                DisplayMassage("?????? ?????????? ???????????? ???????????????????? ???????? ", "You must enter a valid email", MessageType.Worning);
                Errorinput($('#txt_Email'));
                return false;
            }
        }
        return true;
    }
    function EnableControls() {
        debugger;
        $("#Div_control").attr("style", "height: 389px;margin-bottom: 19px;margin-top: 20px;");
        $('#btnsave').removeClass("display_none");
        $('#btnback').removeClass("display_none");
        $('#btnedite').attr('class', 'btn btn-primary display_none');
        $('#txt_IS_Active').prop("selectedIndex", 0);
        ID_CUSTOMER.value = "";
        txt_NAME.value = "";
        txt_phone.value = "";
        txt_Notes.value = "";
        txt_Type_CUSTOMER.value = "";
        $("#btnAddDetails").removeAttr("disabled");
        $('#btnAddDetails').removeClass("display_none");
    }
    function _SearchBox_Change() {
        debugger;
        if (searchbutmemreport.value != "") {
            var search_1 = searchbutmemreport.value.toLowerCase();
            SearchDetails = CustomerDetails.filter(function (x) { return x.CUSTOMER_NAME.toLowerCase().search(search_1) >= 0 || x.PHONE.toString().search(search_1) >= 0; });
            ReportGrid.DataSource = SearchDetails;
            ReportGrid.Bind();
        }
        else {
            ReportGrid.DataSource = CustomerDetails;
            ReportGrid.Bind();
        }
    }
    function Assign() {
        if (IsNew == true) {
            Details_Updata_Cust = new Array();
            Det_Single_Cust = new CUSTOMER();
            DocumentActions.AssignToModel(Det_Single_Cust);
            Det_Single_Cust.CustomerCODE = (Math.floor(Math.random() * 1000) + Math.floor(Math.random() * 1000)).toString();
            //Det_Single_Cust.CustomerCODE = $('#txt_CustomerCODE').val();
            Det_Single_Cust.CUSTOMER_ID = 0;
            Det_Single_Cust.STATUS = status.checked;
            Det_Single_Cust.UserCode = SysSession.CurrentEnvironment.UserCode;
            Det_Single_Cust.IsCreditCustomer = $('#txt_Cust_Type').val() == '0' ? false : true;
            Det_Single_Cust.StatusFlag = "i";
            Det_Single_Cust.CompCode = compcode;
            Det_Single_Cust.BranchCode = BranchCode;
            Details_Updata_Cust.push(Det_Single_Cust);
        }
        else {
            Details_Updata_Cust = new Array();
            Det_Single_Cust = new CUSTOMER();
            DocumentActions.AssignToModel(Det_Single_Cust);
            //Det_Single_Cust.CustomerCODE = (Math.floor(Math.random() * 1000) + Math.floor(Math.random() * 1000)).toString();
            Det_Single_Cust.CustomerCODE = $('#txt_CustomerCODE').val();
            ;
            Det_Single_Cust.CUSTOMER_ID = Number(CUSTOMER_ID);
            Det_Single_Cust.STATUS = status.checked;
            Det_Single_Cust.IsCreditCustomer = $('#txt_Cust_Type').val() == '0' ? false : true;
            Det_Single_Cust.StatusFlag = "u";
            Det_Single_Cust.CompCode = compcode;
            Det_Single_Cust.BranchCode = BranchCode;
            Details_Updata_Cust.push(Det_Single_Cust);
        }
        CustMasterDetails = new CustomerMasterDetails();
        InvoiceItemsDetailsModel = new Array();
        // Details
        for (var i = 0; i < CountGrid; i++) {
            invoiceItemSingleModel = new I_Item_Customer();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            if (StatusFlag == "i") {
                invoiceItemSingleModel.Id = 0;
                invoiceItemSingleModel.CUSTOMER_ID = 0;
                invoiceItemSingleModel.ItemID = Number($("#txt_ItemID" + i).val());
                invoiceItemSingleModel.Serial = Number($("#txtSerial" + i).val());
                invoiceItemSingleModel.ItemCode = $("#txtServiceCode" + i).val();
                invoiceItemSingleModel.DescA = $("#txtServiceName" + i).val();
                invoiceItemSingleModel.DescL = $("#txtServiceName" + i).val();
                invoiceItemSingleModel.UomID = Number($("#ddlTypeuom" + i).val());
                invoiceItemSingleModel.Unitprice = Number($("#txtPrice" + i).val());
                invoiceItemSingleModel.STATUS = $("#CheckISActive" + i).prop('checked');
                invoiceItemSingleModel.Statusflag = StatusFlag.toString();
                InvoiceItemsDetailsModel.push(invoiceItemSingleModel);
            }
            if (StatusFlag == "u") {
                var invoiceItemId = $("#InvoiceItemID" + i).val();
                invoiceItemSingleModel.Id = invoiceItemId;
                invoiceItemSingleModel.CUSTOMER_ID = Number(CUSTOMER_ID);
                invoiceItemSingleModel.ItemID = Number($("#txt_ItemID" + i).val());
                invoiceItemSingleModel.Serial = Number($("#txtSerial" + i).val());
                invoiceItemSingleModel.ItemCode = $("#txtServiceCode" + i).val();
                invoiceItemSingleModel.DescA = $("#txtServiceName" + i).val();
                invoiceItemSingleModel.DescL = $("#txtServiceName" + i).val();
                invoiceItemSingleModel.UomID = Number($("#ddlTypeuom" + i).val());
                invoiceItemSingleModel.Unitprice = Number($("#txtPrice" + i).val());
                invoiceItemSingleModel.STATUS = $("#CheckISActive" + i).prop('checked');
                invoiceItemSingleModel.Statusflag = StatusFlag.toString();
                InvoiceItemsDetailsModel.push(invoiceItemSingleModel);
            }
            if (StatusFlag == "d") {
                if ($("#InvoiceItemID" + i).val() != "") {
                    var deletedID = Number($("#InvoiceItemID" + i).val());
                    invoiceItemSingleModel.Statusflag = StatusFlag.toString();
                    invoiceItemSingleModel.Id = deletedID;
                    InvoiceItemsDetailsModel.push(invoiceItemSingleModel);
                }
            }
        }
        CustMasterDetails.CUSTOMER = Details_Updata_Cust;
        CustMasterDetails.I_Item_Customer = InvoiceItemsDetailsModel;
    }
    function Insert() {
        Assign();
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("Customer", "UpdateCustlist"),
            data: JSON.stringify(CustMasterDetails),
            success: function (d) {
                debugger;
                var result = d;
                if (result.IsSuccess == true) {
                    CUSTOMER_ID = result.Response;
                    success();
                }
                else {
                    MessageBox.Show(result.ErrorMessage, "??????");
                }
            }
        });
    }
    function success() {
        $('#btnAddDetails').toggleClass("display_none");
        $('#btnsave').toggleClass("display_none");
        $('#btnback').toggleClass("display_none");
        $(".fa-minus-circle").addClass("display_none");
        $("#btnedite").removeClass("display_none");
        $("#btnedite").removeAttr("disabled");
        $("#Div_control").addClass("display_none");
        $("#id_div_Add").attr("disabled", "");
        $("#id_div_Add").removeClass("disabledDiv");
        $("#Div_control :input").attr("disabled", "disabled");
        $("#txt_ID_APP_Type").val('Null');
        $("#txt_indebtedness").val('All');
        Display_All();
        Selecteditem = CustomerDetails.filter(function (s) { return s.CUSTOMER_ID == Number(CUSTOMER_ID); });
        DocumentActions.RenderFromModel(Selecteditem[0]);
        $('#txt_Cust_Type').val(Selecteditem[0].IsCreditCustomer == false ? '0' : '1');
        var status = document.getElementById('id_chkcustom6');
        if (Selecteditem[0].STATUS) {
            status.checked = true;
        }
        else
            status.checked = false;
        $('#btnedite').removeClass("display_none");
        $('#btnsave').addClass("display_none");
        $('#btnback').addClass("display_none");
        $('#btnedite').removeAttr("disabled");
        $('#Div_control').removeClass("display_none");
        if (Selecteditem[0].IsCreditCustomer == false) {
            $('#div_Balance').removeClass("display_none");
        }
        else {
            $('#div_Balance').addClass("display_none");
            txt_Debit.value = "0";
            txt_DebitFC.value = "0";
        }
        //Debit = Selecteditem[0].CreditLimit;
        //Credit = Number(Selecteditem[0].Openbalance - Selecteditem[0].CreditLimit);
        //if (Credit < 0) {
        //    $('#txt_Debit').val((Credit * -1));
        //    $('#txt_DebitFC').val(('0'));
        //}
        //else {
        //    $('#txt_DebitFC').val((Credit));
        //    $('#txt_Debit').val(('0'));
        //}
        CountGrid = 0;
        CUSTOMER_ID = Selecteditem[0].CUSTOMER_ID;
        $('#Div_control').removeClass("display_none");
        BindCustItemsGridData(CUSTOMER_ID);
        $('#DivShow').removeClass("display_none");
        $("#DivShow :input").attr("disabled", "disabled");
    }
    function txt_Cust_Type_onchange() {
        if (txt_Cust_Type.value == "0" || txt_Cust_Type.value == "Null") {
            $('#div_Balance').removeClass("display_none");
        }
        else {
            $('#div_Balance').addClass("display_none");
            txt_Debit.value = "0";
            txt_DebitFC.value = "0";
            txt_Openbalance.value = "0";
            $('#txt_balance').val('0');
        }
    }
    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    function validate_email() {
        var email = $("#txt_Email").val();
        validateEmail(email);
        return validateEmail(email);
    }
    function Validation_Grid(rowcount) {
        var Qty = Number($("#txtQuantity" + rowcount).val());
        var Price = Number($("#txtPrice" + rowcount).val());
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        }
        else {
            if ($("#txt_ItemID" + rowcount).val() == "" || $("#txt_ItemID" + rowcount).val() == "0" || $("#txt_ItemID" + rowcount).val() == null) {
                DisplayMassage(" ?????????? ?????????? ??????????", "Please enter the type", MessageType.Error);
                Errorinput($("#btnSearchService" + rowcount));
                Errorinput($("#txtServiceName" + rowcount));
                return false;
            }
            else if (Qty == 0) {
                DisplayMassage(" ?????????? ?????????? ???????????? ??????????????", "Please enter the Quantity sold", MessageType.Error);
                Errorinput($("#txtQuantity" + rowcount));
                return false;
            }
            else if (Price == 0) {
                DisplayMassage(" ?????????? ?????????? ??????????", "Please enter the Price", MessageType.Error);
                Errorinput($("#txtPrice" + rowcount));
                Errorinput($("#txtUnitpriceWithVat" + rowcount));
                return false;
            }
            return true;
        }
    }
    function BuildControls(cnt) {
        var html;
        html = '<div id= "No_Row' + cnt + '" class="container-fluid style_border" > <div class="row " > <div class="col-lg-12" > ' +
            '<span id="btn_minus' + cnt + '" class="fa fa-minus-circle fontitm3SlsTrSalesManager2 display_none"></span>' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-3 p-0" >' +
            '<input id="txtSerial' + cnt + '" type="text" class="form-control input-sm input-sm right2" disabled /></div>' +
            '<input id="InvoiceItemID' + cnt + '" type="hidden" class="form-control input-sm right2 display_none"  />' +
            '<div class="display_none col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0" style="width: 11%;">' +
            '<input id="txtServiceCode' + cnt + '" name=""   type="text" class="  col-lg-9 form-control input-sm  text_Display  " />' +
            '</div>' +
            '<div class=" col-lg-3 col-md-3 col-sm-3 col-xl-3 col-xs-9 p-0">' +
            '<button type="button" class="col-lg-1 col-xs-1 src-btn btn btn-search input-sm " id="btnSearchService' + cnt + '" name="ColSearch">   ' +
            '<i class="fa fa-search  "></i></button>' +
            '<input id="txtServiceName' + cnt + '" name="FromDate" disabled  type="text" class=" col-lg-11 col-xs-8 form-control input-sm  text_Display" style="width:90%;" />' +
            '</div>' +
            '<div class=" col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-4 p-0">' +
            '<select id="ddlTypeuom' + cnt + '" class="form-control input-sm"   style="width: 100%;border-radius: 30px;"><option value="null">????????????</option></select> </div>' +
            '<div class="display_none col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-4 p-0"><input type="number" id="txtQuantity' + cnt + '" name="quant[1]" class="form-control input-sm   font1" value="1" min="1" max="1000" step="1"></div>' +
            '<div class="display_none col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0"><input type="text"  disabled class="form-control input-sm" id="txtReturnQuantity' + cnt + '" name="quant[3]" class="form-control input-sm   font1" value="0" min="0" max="1000" step="1"></div>' +
            '<div class="  col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-4 p-0"  ><input type="number" disabled id="txtPrice' + cnt + '" name="quant[2]" class="form-control input-sm   font1" value="1" min="0" max="1000" step="0.5"></div>' +
            '<div class="col-lg-1 style_pading"> <input id="CheckISActive' + cnt + '"  type= "checkbox"  class="form-control "  /></div>' +
            '<div class="display_none col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0"  ><input type="number"  id="txtDiscountPrc' + cnt + '" name="quant[2]" class="form-control input-sm   font1" value="0" min="0" max="1000" step="0.5"></div>' +
            '<div class="display_none col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0"  ><input type="number"  id="txtDiscountAmount' + cnt + '" name="quant[2]" class="form-control input-sm   font1" value="0" min="0" max="1000" step="0.5"></div>' +
            '<div class="display_none col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0"  ><input type="number" disabled id="txtNetUnitPrice' + cnt + '" name="quant[2]" class="form-control input-sm   font1" value="0" min="0" max="1000" step="0.5"></div>' +
            '<div class="display_none col-lg-6 col-md-6 col-sm-6 col-xl-6 col-xs-6" style="position:absolute; right:97%">' +
            '<div class="col-lg-3 col-md-3 col-sm-3 col-xl-3 col-xs-3 p-0">' +
            '<input id="txtTotal' + cnt + '" type="text" class="form-control input-sm right2" disabled /></div>' +
            '<div class="col-lg-3 col-md-3 col-sm-3 col-xl-3 col-xs-3 p-0">' +
            '<input id="txtTax_Rate' + cnt + '" type="text" class="form-control input-sm input-sm right2" disabled /></div>' +
            '<div class="col-lg-3 col-md-3 col-sm-3 col-xl-3 col-xs-3 p-0">' +
            '<input id="txtTax' + cnt + '" type="text" class="form-control input-sm right2" disabled /></div>' +
            '<div class="col-lg-3 col-md-3 col-sm-3 col-xl-3 col-xs-3 p-0">' +
            '<input id="txtTotAfterTax' + cnt + '" type="text" class="form-control input-sm right2" disabled /></div>' +
            '</div></div></div>' +
            '<input id="txt_StatusFlag' + cnt + '" name = " " type = "hidden" class="form-control"/><input id="txt_ItemID' + cnt + '" name = " " type = "hidden" class="form-control"/><input id="txt_ID' + cnt + '" name = " " type = "hidden" class="form-control" />';
        $("#div_Data").append(html);
        //Search Region
        //// First Search
        $('#btnSearchService' + cnt).click(function (e) {
            debugger;
            var sys = new SystemTools();
            var GetItemInfo = new Array();
            NumCnt = cnt;
            var Storeid = 1;
            sys.ShowItems(Number(SysSession.CurrentEnvironment.BranchCode), Storeid, $('#txtServiceName' + cnt).val(), $('#txtServiceCode' + cnt).val(), InvoiceType, function () {
                var id = sysInternal_Comm.Itemid;
                debugger;
                //if (!validationitem(id, Number($("#txt_ItemID" + NumCnt + "").val()))) return
                $("#txt_ItemID" + NumCnt + "").val(id);
                var ItemCode = '';
                var ItemID = id;
                var Mode = InvoiceType;
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
                                $('#ddlTypeuom' + NumCnt + '').html('');
                                for (var i = 0; i < GetItemInfo.length; i++) {
                                    $('#ddlTypeuom' + NumCnt + '').append('<option  data-OnhandQty="' + GetItemInfo[i].OnhandQty + '" data-UnitPrice="' + GetItemInfo[i].UnitPrice + '" data-MinPrice="' + GetItemInfo[i].MinPrice + '" data-Rate="' + GetItemInfo[i].Rate + '" value="' + GetItemInfo[i].uomid + '">' + (lang == "ar" ? GetItemInfo[i].u_DescA : GetItemInfo[i].u_DescE) + '</option>');
                                }
                                $('#txtServiceName' + NumCnt + '').val((lang == "ar" ? GetItemInfo[0].It_DescA : GetItemInfo[0].it_DescE));
                                $('#txtServiceCode' + NumCnt + '').val(GetItemInfo[0].ItemCode);
                                $('#txtPrice' + NumCnt + '').val(GetItemInfo[0].UnitPrice);
                                $('#txtNetUnitPrice' + NumCnt + '').val(GetItemInfo[0].UnitPrice);
                                $('#txtQuantity' + NumCnt + '').val('1');
                                $('#txtServiceName' + NumCnt + '').attr('disabled', 'disabled');
                                $('#txtServiceCode' + NumCnt + '').attr('disabled', 'disabled');
                                totalRow(NumCnt);
                            }
                            else {
                                $('#ddlTypeuom' + NumCnt + '').append('<option value="null">???????? ????????????</option>');
                                $('#txtServiceName' + NumCnt + '').val('');
                                $('#txtServiceCode' + NumCnt + '').val('');
                                $('#txtPrice' + NumCnt + '').val('0');
                                $('#txtNetUnitPrice' + NumCnt + '').val('0');
                                $('#txtQuantity' + NumCnt + '').val('1');
                                $('#txtServiceName' + NumCnt + '').removeAttr('disabled');
                                $('#txtServiceCode' + NumCnt + '').removeAttr('disabled');
                            }
                        }
                    }
                });
            });
        });
        $("#txtServiceCode" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var GetItemInfo1 = new Array();
            NumCnt = cnt;
            var Storeid = Number($("#ddlStore").val());
            var ItemCode = $("#txtServiceCode" + cnt).val();
            var ItemID = 0;
            var Mode = InvoiceType;
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("StkDefItemType", "GetItemByCode"),
                data: {
                    CompCode: compcode, FinYear: Finyear, ItemCode: ItemCode, ItemID: ItemID, storeid: Storeid, Mode: Mode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        GetItemInfo1 = result.Response;
                        if (GetItemInfo1.length > 0) {
                            //alert(NumCnt);
                            $("#txt_ItemID" + NumCnt + "").val(GetItemInfo1[0].ItemID);
                            //if (!validationitem(Number($("#txt_ItemID" + NumCnt + "").val()), 0)) {
                            //    $("#txt_ItemID" + NumCnt + "").val("");
                            //    $("#txtServiceCode" + NumCnt + "").val("");
                            //    return
                            //}
                            $('#ddlTypeuom' + NumCnt + '').html('');
                            for (var i = 0; i < GetItemInfo1.length; i++) {
                                $('#ddlTypeuom' + NumCnt + '').append('<option  data-OnhandQty="' + GetItemInfo1[i].OnhandQty + '" data-UnitPrice="' + GetItemInfo1[i].UnitPrice + '" data-MinPrice="' + GetItemInfo1[i].MinPrice + '" data-Rate="' + GetItemInfo1[i].OnhandQty + '" value="' + GetItemInfo1[i].uomid + '">' + (lang == "ar" ? GetItemInfo1[i].u_DescA : GetItemInfo1[i].u_DescE) + '</option>');
                            }
                            $('#txtServiceName' + NumCnt + '').val((lang == "ar" ? GetItemInfo1[0].It_DescA : GetItemInfo1[0].it_DescE));
                            $('#txtServiceCode' + NumCnt + '').val(GetItemInfo1[0].ItemCode);
                            $('#txtPrice' + NumCnt + '').val(GetItemInfo1[0].UnitPrice);
                            $('#txtNetUnitPrice' + NumCnt + '').val(GetItemInfo1[0].UnitPrice);
                            $('#txtQuantity' + NumCnt + '').val('1');
                            Tax_Rate = GetItemInfo1[0].VatPrc;
                            Tax_Type_Model = GetVat(GetItemInfo1[0].VatNatID, Tax_Rate, vatType);
                            Tax_Rate = Tax_Type_Model.Prc;
                            VatPrc = Tax_Rate;
                            $("#txtTax_Rate" + NumCnt).attr('Data-VatNatID', Tax_Type_Model.Nature);
                            $('#txtServiceName' + NumCnt + '').attr('disabled', 'disabled');
                            $('#txtServiceCode' + NumCnt + '').attr('disabled', 'disabled');
                            totalRow(NumCnt);
                        }
                        else {
                            DisplayMassage("?????? ?????????? ?????? ???????? ", "Wrong service code ", MessageType.Error);
                            $('#ddlTypeuom' + NumCnt + '').append('<option value="null">???????? ????????????</option>');
                            $('#txtServiceName' + NumCnt + '').val('');
                            $('#txtServiceCode' + NumCnt + '').val('');
                            $('#txtPrice' + NumCnt + '').val('0');
                            $('#txtNetUnitPrice' + NumCnt + '').val('0');
                            $('#txtQuantity' + NumCnt + '').val('1');
                            $('#txtServiceName' + NumCnt + '').removeAttr('disabled');
                            $('#txtServiceCode' + NumCnt + '').removeAttr('disabled');
                        }
                    }
                }
            });
        });
        //// Second Search
        $("#ddlTypeuom" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var Typeuom = $("#ddlTypeuom" + cnt);
            var UnitPrice = $('option:selected', Typeuom).attr('data-UnitPrice');
            $('#txtPrice' + cnt + '').val(UnitPrice);
            $('#txtNetUnitPrice' + cnt + '').val(UnitPrice);
            $('#txtQuantity' + cnt + '').val('1');
            totalRow(cnt);
        });
        // text change      
        $("#txtQuantity" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var Typeuom = $("#ddlTypeuom" + cnt);
            var OnhandQty = $('option:selected', Typeuom).attr('data-OnhandQty');
            if (Number(txtQuantityValue) > Number(OnhandQty)) {
                DisplayMassage(" ???? ???????? ?????????? ???????????? ??????????????  " + OnhandQty + " ", "Please select a customer", MessageType.Worning);
                $("#txtQuantity" + cnt).val(OnhandQty);
                Errorinput($("#txtQuantity" + cnt));
            }
            totalRow(cnt);
        });
        $("#txtPrice" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i") {
                $("#txt_StatusFlag" + cnt).val("u");
            }
            totalRow(cnt);
        });
        $("#CheckISActive" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i") {
                $("#txt_StatusFlag" + cnt).val("u");
            }
        });
        $("#txtDiscountPrc" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            totalRow(cnt);
        });
        $("#txtDiscountAmount" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var txtPrice = Number($("#txtPrice" + cnt).val());
            var txtDiscountAmount = Number($("#txtDiscountAmount" + cnt).val());
            $("#txtDiscountPrc" + cnt).val(((txtDiscountAmount / txtPrice) * 100).toFixed(2));
            $("#txtNetUnitPrice" + cnt).val((txtPrice - txtDiscountAmount).toFixed(2));
            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValue = $("#txtNetUnitPrice" + cnt).val();
            $('#txtTax_Rate' + cnt).val(Tax_Rate);
            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            VatPrc = $("#txtTax_Rate" + cnt).val();
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtTax" + cnt).val(vatAmount.toFixed(2));
            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            $("#txtTotal" + cnt).val(total.toFixed(2));
            var totalAfterVat = Number(vatAmount.toFixed(2)) + Number(total.toFixed(2));
            $("#txtTotAfterTax" + cnt).val(totalAfterVat.toFixed(2));
            ComputeTotals();
        });
        $("#txtNetUnitPrice" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            ComputeTotals();
        });
        $("#btn_minus" + cnt).click(function (e) {
            DeleteRow(cnt);
            // alert('delete');
        });
        return;
    }
    function Disbly_BuildControls(cnt, CustItemsDetails) {
        debugger;
        $("#btnAddDetails").addClass("display_none");
        $("#btn_minus" + cnt).addClass("display_none");
        $("#txt_StatusFlag" + cnt).val("");
        $("#InvoiceItemID" + cnt).prop("value", CustItemsDetails[cnt].Id);
        $("#txt_ItemID" + cnt).prop("value", CustItemsDetails[cnt].ItemID);
        $("#txtSerial" + cnt).prop("value", CustItemsDetails[cnt].Serial);
        $("#txtServiceCode" + cnt).prop("value", CustItemsDetails[cnt].ItemCode);
        $("#txtServiceName" + cnt).prop("value", CustItemsDetails[cnt].DescA);
        $("#txtQuantity" + cnt).prop("value", "1");
        $("#txtPrice" + cnt).prop("value", CustItemsDetails[cnt].Unitprice);
        if (CustItemsDetails[cnt].STATUS == true) {
            $('#CheckISActive' + cnt).attr('checked', 'checked');
        }
        filldlltypeuom(cnt, CustItemsDetails);
        $("#ddlTypeuom" + cnt).prop("value", CustItemsDetails[cnt].UomID);
    }
    function filldlltypeuom(cnt, SlsInvoiceItemsDetails) {
        var Storeid = 1;
        var ItemCode = '';
        var ItemID = SlsInvoiceItemsDetails[cnt].ItemID;
        var Mode = InvoiceType;
        var GetItemInfo = new Array();
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
                            $('#ddlTypeuom' + cnt + '').append('<option  data-OnhandQty="' + GetItemInfo[i].OnhandQty + '" data-UnitPrice="' + GetItemInfo[i].UnitPrice + '" data-MinPrice="' + GetItemInfo[i].MinPrice + '" data-Rate="' + GetItemInfo[i].OnhandQty + '" value="' + GetItemInfo[i].uomid + '">' + (lang == "ar" ? GetItemInfo[i].u_DescA : GetItemInfo[i].u_DescE) + '</option>');
                        }
                    }
                }
            }
        });
    }
    function totalRow(cnt) {
        var txtPrice = Number($("#txtPrice" + cnt).val());
        var txtDiscountPrc = Number($("#txtDiscountPrc" + cnt).val());
        $("#txtDiscountAmount" + cnt).val(((txtDiscountPrc * txtPrice) / 100).toFixed(2));
        $("#txtNetUnitPrice" + cnt).val((txtPrice - ((txtDiscountPrc * txtPrice) / 100)).toFixed(2));
        var txtQuantityValue = $("#txtQuantity" + cnt).val();
        var txtPriceValue = $("#txtNetUnitPrice" + cnt).val();
        $('#txtTax_Rate' + cnt).val(Tax_Rate);
        var total = Number(txtQuantityValue) * Number(txtPriceValue);
        VatPrc = $("#txtTax_Rate" + cnt).val();
        var vatAmount = Number(total) * VatPrc / 100;
        $("#txtTax" + cnt).val(vatAmount.toFixed(2));
        var total = Number(txtQuantityValue) * Number(txtPriceValue);
        $("#txtTotal" + cnt).val(total.toFixed(2));
        var totalAfterVat = Number(vatAmount.toFixed(2)) + Number(total.toFixed(2));
        $("#txtTotAfterTax" + cnt).val(totalAfterVat.toFixed(2));
        ComputeTotals();
    }
    function Display_GridConrtol(cnt) {
        $("#txtServiceCode" + cnt).attr("disabled", "disabled");
        $("#txtServiceName" + cnt).attr("disabled", "disabled");
        $("#ddlTypeuom" + cnt).attr("disabled", "disabled");
        $("#btnSearchService" + cnt).attr("disabled", "disabled");
        $("#txtSerial" + cnt).attr("disabled", "disabled");
        $("#txtTax_Rate" + cnt).attr("disabled", "disabled");
        $("#txtQuantity" + cnt).attr("disabled", "disabled");
        $("#txtPrice" + cnt).attr("disabled", "disabled");
        $("#txtDiscountPrc" + cnt).attr("disabled", "disabled");
        $("#txtDiscountAmount" + cnt).attr("disabled", "disabled");
        $("#txtNetUnitPrice" + cnt).attr("disabled", "disabled");
        $("#txtReturnQuantity" + cnt).attr("disabled", "disabled");
        $("#txtTotal" + cnt).attr("disabled", "disabled");
        $("#txtTax" + cnt).attr("disabled", "disabled");
        $("#txtTotAfterTax" + cnt).attr("disabled", "disabled");
        $("#btnAddDetails").addClass("display_none");
        $("#btn_minus" + cnt).addClass("display_none");
        $("#btn_minus" + cnt).attr("disabled", "disabled");
        //bind Data       
        $("#txt_StatusFlag" + cnt).val("");
        $("#txtServiceName" + cnt).prop("value", (lang == "ar" ? SlsInvoiceItemsDetails[cnt].it_DescA : SlsInvoiceItemsDetails[cnt].It_DescE));
        $("#txtServiceCode" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].it_itemCode);
        $("#txtSerial" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].Serial);
        $("#txtQuantity" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].SoldQty);
        $("#txtPrice" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].Unitprice);
        $("#txtDiscountPrc" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].DiscountPrc);
        $("#txtDiscountAmount" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].DiscountAmount);
        $("#txtNetUnitPrice" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].NetUnitPrice);
        $("#txtTax_Rate" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].VatPrc);
        $("#txtReturnQuantity" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].TotRetQty);
        $("#txtTotal" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].ItemTotal);
        $("#txtTax" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].VatAmount.toFixed(2));
        $("#txtTotAfterTax" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].NetAfterVat.toFixed(2));
        $("#InvoiceItemID" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].InvoiceItemID);
        $("#txt_ItemID" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].ItemID);
        var Storeid = Number($("#ddlStore").val());
        var ItemCode = '';
        var ItemID = SlsInvoiceItemsDetails[cnt].ItemID;
        var Mode = InvoiceType;
        var GetItemInfo = new Array();
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
                            $('#ddlTypeuom' + cnt + '').append('<option  data-OnhandQty="' + GetItemInfo[i].OnhandQty + '" data-UnitPrice="' + GetItemInfo[i].UnitPrice + '" data-MinPrice="' + GetItemInfo[i].MinPrice + '" data-Rate="' + GetItemInfo[i].OnhandQty + '" value="' + GetItemInfo[i].uomid + '">' + (lang == "ar" ? GetItemInfo[i].u_DescA : GetItemInfo[i].u_DescE) + '</option>');
                        }
                    }
                }
            }
        });
        $('#ddlTypeuom' + cnt + '').val(SlsInvoiceItemsDetails[cnt].UomID == null ? 'null' : SlsInvoiceItemsDetails[cnt].UomID);
        //$('#ddlTypeuom' + cnt + '').html('');
        //$('#ddlTypeuom' + cnt + '').append('<option  data-OnhandQty="' + SlsInvoiceItemsDetails[cnt].StockSoldQty + '" data-UnitPrice="' + SlsInvoiceItemsDetails[cnt].Unitprice + '" data-MinPrice=" " data-Rate=" " value="' + SlsInvoiceItemsDetails[cnt].UomID + '">' + (lang == "ar" ? SlsInvoiceItemsDetails[cnt].Uom_DescA : SlsInvoiceItemsDetails[cnt].Uom_DescE) + '</option>');
    }
    function validationitem(id, idRow) {
        for (var i = 0; i < CountGrid; i++) {
            if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m") {
                if ($("#txt_ItemID" + i + "").val() == id && $("#txt_ItemID" + i + "").val() != idRow) {
                    DisplayMassage("?????????? ?????????? ???? ??????", "Item found before", MessageType.Error);
                    Errorinput($("#txtServiceName" + i + ""));
                    return false;
                }
            }
        }
        return true;
    }
    function DeleteRow(RecNo) {
        WorningMessage("???? ???????? ????????????", "Do you want to delete?", "??????????", "worning", function () {
            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d');
            CountItems = CountItems - 1;
            ComputeTotals();
            Insert_Serial();
            $("#ddlFamily" + RecNo).val("99");
            $("#ddlItem" + RecNo).val("99");
            $("#txtQuantity" + RecNo).val("99");
            $("#txtPrice" + RecNo).val("199");
            $("#txtUnitpriceWithVat" + RecNo).val("199");
            $("#No_Row" + RecNo).attr("hidden", "true");
        });
    }
    function AddNewRow() {
        //var CanAdd: boolean = true;
        //if (CountGrid > 0) {
        //    for (var i = 0; i < CountGrid; i++) {
        //        CanAdd = Validation_Grid(i);
        //        if (CanAdd == false) {
        //            break;
        //        }
        //    }
        //}
        //if (CanAdd) {
        //CountItems = CountItems + 1;
        //txtItemCount.value = CountItems.toString();
        BuildControls(CountGrid);
        $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode 
        $("#ddlFamily" + CountGrid).removeAttr("disabled");
        $("#ddlItem" + CountGrid).removeAttr("disabled");
        $("#txtPrice" + CountGrid).removeAttr("disabled");
        $("#txtReturnQuantity" + CountGrid).attr("disabled", "disabled");
        $("#btn_minus" + CountGrid).removeClass("display_none");
        $("#btn_minus" + CountGrid).removeAttr("disabled");
        CountGrid++;
        Insert_Serial();
        //}
    }
    function ComputeTotals() {
        var PackageCount = 0;
        var CountTotal = 0;
        var TotalDiscount = 0;
        var Totalbefore = 0;
        var TaxCount = 0;
        var NetCount = 0;
        for (var i = 0; i < CountGrid; i++) {
            if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m") {
                PackageCount += Number($("#txtQuantity" + i).val());
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
                NetCount = Number(NetCount.toFixed(2).toString());
                //NetCount = (Number(NetCount.toFixed(2)) - Number(txtDiscountValue.value));
            }
        }
        //txtItemCount.value = CountItems.toString();
        txtPackageCount.value = PackageCount.toString();
    }
    function Insert_Serial() {
        var Ser = 1;
        for (var i = 0; i < CountGrid; i++) {
            var flagvalue = $("#txt_StatusFlag" + i).val();
            if (flagvalue != "d" && flagvalue != "m") {
                $("#txtSerial" + i).val(Ser);
                Ser++;
            }
        }
        txtItemCount.value = (Ser - 1).toString();
    }
})(CUSTOMERS || (CUSTOMERS = {}));
//# sourceMappingURL=CUSTOMERS.js.map