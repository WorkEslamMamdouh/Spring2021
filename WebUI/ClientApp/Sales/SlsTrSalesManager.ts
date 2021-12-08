$(document).ready(() => {

    SlsTrSalesManager.InitalizeComponent();
})
namespace SlsTrSalesManager {
    //system varables
    var SysSession: SystemSession = GetSystemSession();
    var compcode: Number;
    var BranchCode: number;
    var sys: SystemTools = new SystemTools();
    var vatType: number;
    var Finyear: number;

    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);

    var Screen_name = '';
    var InvoiceType: number = 0;      // 1:Retail invoice , 2: Wholesale invoice            
    var SlsInv = $('#SlsInvType').val();
    if (SlsInv == "1") {  //  1:Retail invoice 
        InvoiceType = 1;

        (lang == "ar" ? Screen_name = 'فواتير التجزئه' : Screen_name = 'Retail invoice')
    }
    else {       //2: Wholesale invoice 
        InvoiceType = 2;
        (lang == "ar" ? Screen_name = 'فواتير الجمله' : Screen_name = 'Wholesale invoice')
    }




    //ddl
    var btnPrintNew: HTMLButtonElement;
    var btndiv_1: HTMLButtonElement;
    var btndiv_2: HTMLButtonElement;
    var ddlStore: HTMLSelectElement;
    var ddlCustomer: HTMLSelectElement;
    var ddlSalesmanFilter: HTMLSelectElement;
    var ddlStateType: HTMLSelectElement;
    var ddlInvoiceType: HTMLSelectElement;
    var ddlSalesman: HTMLSelectElement;
    var ddlType: HTMLSelectElement;
    var ddlCashBox: HTMLSelectElement;
    var flagprice = 0;
    // Arrays
    var Display_D_UOM: Array<I_D_UOM> = new Array<I_D_UOM>();

    var CashboxDetails: Array<A_RecPay_D_CashBox> = new Array<A_RecPay_D_CashBox>();
    var PriceInvDetails: Array<IQ_GetSlsInvoiceStatistic> = new Array<IQ_GetSlsInvoiceStatistic>();
    var PriceInvitemsDetails: Array<IQ_GetSlsInvoiceItem> = new Array<IQ_GetSlsInvoiceItem>();
    var CustDetails: Array<CUSTOMER> = new Array<CUSTOMER>();
    var DetailsVatNature: Array<G_VatNature> = new Array<G_VatNature>();
    var StateDetailsAr: Array<string> = new Array<string>();
    var StateDetailsEn: Array<string> = new Array<string>();
    var InvoiceDetailsAr: Array<string> = new Array<string>();
    var InvoiceDetailsEn: Array<string> = new Array<string>();
    var InvoiceTypeDetailsAr: Array<string> = new Array<string>();
    var InvoiceEyptDetailsEn: Array<string> = new Array<string>();
    var SlsInvoiceStatisticsDetails: Array<IQ_GetSlsInvoiceStatistic> = new Array<IQ_GetSlsInvoiceStatistic>();
    var Selecteditem: Array<IQ_GetSlsInvoiceStatistic> = new Array<IQ_GetSlsInvoiceStatistic>();
    var SearchDetails: Array<IQ_GetSlsInvoiceStatistic> = new Array<IQ_GetSlsInvoiceStatistic>();
    var SlsInvoiceItemsDetails: Array<IQ_GetSlsInvoiceItem> = new Array<IQ_GetSlsInvoiceItem>();
    var AD_VatTypeDetails: A_D_VAT_TYPE = new A_D_VAT_TYPE();
    var SalesmanDetails: Array<I_Sls_D_Salesman> = new Array<I_Sls_D_Salesman>();

    //Models
    var InvoiceStatisticsModel: Array<IQ_GetSlsInvoiceStatistic> = new Array<IQ_GetSlsInvoiceStatistic>();
    var InvoiceItemsDetailsModel: Array<I_Sls_TR_InvoiceItems> = new Array<I_Sls_TR_InvoiceItems>();
    var InvoiceModel: I_Sls_TR_Invoice = new I_Sls_TR_Invoice();
    var MasterDetailsModel: SlsInvoiceMasterDetails = new SlsInvoiceMasterDetails();
    var invoiceItemSingleModel: I_Sls_TR_InvoiceItems = new I_Sls_TR_InvoiceItems();
    var List_MinUnitPrice: Array<I_Sls_TR_InvoiceItems> = new Array<I_Sls_TR_InvoiceItems>();
    var storeDetails: Array<G_STORE> = new Array<G_STORE>();


    //TextBoxes
    var txt_Tax_total_Discount: HTMLInputElement;
    var txt_Tax_Discount: HTMLInputElement;
    var txt_Tax_total_AfterDiscount: HTMLInputElement;
    var txtStartDate: HTMLInputElement;
    var txtEndDate: HTMLInputElement;
    var txtItemCount: HTMLInputElement;
    var txtPackageCount: HTMLInputElement;
    var txtTotalbefore: HTMLInputElement;
    var txtTotalDiscount: HTMLInputElement;
    var txtDiscountValue: HTMLInputElement;
    var txtTotal: HTMLInputElement;
    var txtTax: HTMLInputElement;
    var txtNet: HTMLInputElement;
    var txt_Remarks: HTMLInputElement;
    var txtInvoiceDate: HTMLInputElement;
    var txtCustomerMobile: HTMLInputElement;
    var txtInvoiceCustomerName: HTMLInputElement;
    var txtCustomerCode: HTMLInputElement;
    var txt_ApprovePass: HTMLInputElement;
    var searchbutmemreport: HTMLInputElement;
    var lblInvoiceNumber: HTMLInputElement;
    //checkbox
    var chkActive: HTMLInputElement;
    //buttons       
    var btnAdd: HTMLButtonElement;
    var btnShow: HTMLButtonElement;
    var btnUpdate: HTMLButtonElement;
    var btnAddDetails: HTMLButtonElement;
    var btnBack: HTMLButtonElement;// btnBack btnSave
    var btnSave: HTMLButtonElement;
    var btn_Approveprice: HTMLButtonElement;
    var btn_Exit_Approveprice: HTMLButtonElement;
    var btnCustomerSrch: HTMLButtonElement;
    var btnpriceSrch: HTMLButtonElement;
    var btnOrderSrch: HTMLButtonElement;

    //print buttons     
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
    var btnPrintTransaction: HTMLButtonElement;
    var btndeliverynote: HTMLButtonElement;
    //var btnPrintInvoicePrice: HTMLButtonElement;
    var btnPrintslip: HTMLButtonElement;


    // giedView
    var Grid: JsGrid = new JsGrid();

    //global    
    var Discount = 0;
    var StoreID;
    var CountGrid = 0;
    var CountItems: number = 0;
    var PackageCount: number = 0;
    var CountTotal: number = 0;
    var TaxCount: number = 0;
    var NetCount: number = 0;
    var VatPrc: number = 0;
    var Validation_Insert = 0;
    var GlobalinvoiceID: number = 0;
    var invoiceID: number;
    //flags : 
    var TypeFlag: boolean = false;
    var IsSuccess: boolean = true;
    var Show: boolean = true;
    var NewAdd: boolean = true;
    var AutherizeFlag: boolean = false;
    var flag_PriceWithVAT = (SysSession.CurrentEnvironment.I_Control[0].SalesPriceWithVAT);
    var btnPrint: HTMLInputElement;
    var Tax_Rate = 0;
    var Tax_Type_Model: Tax_Type = new Tax_Type();
    var NumCnt = 0;
    var CustType: CustomerType;
    var CustomerId = 0;
    var invoicePriceID = 0;
    var html = "";
    //------------------------------------------------------ Main Region------------------------
    export function InitalizeComponent() {
        // VatPrc                                           
        document.getElementById('Screen_name').innerHTML = Screen_name;

        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        Finyear = Number(SysSession.CurrentEnvironment.CurrentYear);

        InitalizeControls();
        InitializeEvents();
        fillddlCustomer();
        FillddlVatNature();

        fillddlSalesman();
        FillddlStore();
        txtStartDate.value = SysSession.CurrentEnvironment.StartDate;
        txtEndDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;

        FillddlStateType(); DisplayMassage
        FillddlInvoiceType();
        FillddlType();
        vatType = SysSession.CurrentEnvironment.I_Control[0].DefSlsVatType;

        GetVatPercentage();
        $('#ddlStateType').prop("value", "2");
        $('#ddlInvoiceType').prop("value", "2");
        txtItemCount.value = CountItems.toString();
        txtPackageCount.value = PackageCount.toString();
        txtTotal.value = CountTotal.toString();
        txtTax.value = TaxCount.toString();
        txtNet.value = NetCount.toString();

        //FillddlCashBox();

        GetTypeCust();
        flagprice = 0;
    }
    function InitalizeControls() {
        btnPrint = document.getElementById("btnPrint") as HTMLInputElement;

        // Drop down lists
        ddlStore = document.getElementById("ddlStore") as HTMLSelectElement;
        ddlCustomer = document.getElementById("ddlCustomer") as HTMLSelectElement;
        ddlSalesmanFilter = document.getElementById("ddlSalesmanFilter") as HTMLSelectElement;
        ddlStateType = document.getElementById("ddlStateType") as HTMLSelectElement;
        ddlSalesman = document.getElementById("ddlSalesman") as HTMLSelectElement;
        ddlCashBox = document.getElementById("ddlCashBox") as HTMLSelectElement;
        ddlInvoiceType = document.getElementById("ddlInvoiceType") as HTMLSelectElement;
        ddlType = document.getElementById("ddlType") as HTMLSelectElement;

        //TextBoxes
        searchbutmemreport = document.getElementById("searchbutmemreport") as HTMLInputElement;
        txtStartDate = document.getElementById("txtStartDate") as HTMLInputElement;
        txt_Tax_Discount = document.getElementById("txt_Tax_Discount") as HTMLInputElement;
        txt_Tax_total_Discount = document.getElementById("txt_Tax_total_Discount") as HTMLInputElement;
        txt_Tax_total_AfterDiscount = document.getElementById("txt_Tax_total_AfterDiscount") as HTMLInputElement;
        txtEndDate = document.getElementById("txtEndDate") as HTMLInputElement;
        txtItemCount = document.getElementById("txtItemCount") as HTMLInputElement;
        txtPackageCount = document.getElementById("txtPackageCount") as HTMLInputElement;
        txtTotalbefore = document.getElementById("txtTotalbefore") as HTMLInputElement;
        txtTotalDiscount = document.getElementById("txtTotalDiscount") as HTMLInputElement;
        txtDiscountValue = document.getElementById("txtDiscountValue") as HTMLInputElement;
        txtTotal = document.getElementById("txtTotal") as HTMLInputElement;
        txtTax = document.getElementById("txtTax") as HTMLInputElement;
        txtNet = document.getElementById("txtNet") as HTMLInputElement;
        txt_Remarks = document.getElementById("txt_Remarks") as HTMLInputElement;
        txtInvoiceDate = document.getElementById("txtInvoiceDate") as HTMLInputElement;
        txtCustomerMobile = document.getElementById("txtCustomerMobile") as HTMLInputElement;
        txtInvoiceCustomerName = document.getElementById("txtInvoiceCustomerName") as HTMLInputElement;
        txtCustomerCode = document.getElementById("txtCustomerCode") as HTMLInputElement;
        txt_ApprovePass = document.getElementById("txt_ApprovePass") as HTMLInputElement;

        //labels
        lblInvoiceNumber = document.getElementById("lblInvoiceNumber") as HTMLInputElement;

        //checkbox
        chkActive = document.getElementById("chkActive") as HTMLInputElement;
        //button
        btnPrintNew = document.getElementById("btnPrintNew") as HTMLButtonElement;
        btndiv_1 = document.getElementById("btndiv_1") as HTMLButtonElement;
        btndiv_2 = document.getElementById("btndiv_2") as HTMLButtonElement;
        btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
        btnShow = document.getElementById("btnShow") as HTMLButtonElement;
        btnUpdate = document.getElementById("btnUpdate") as HTMLButtonElement;
        btnAddDetails = document.getElementById("btnAddDetails") as HTMLButtonElement;// btnBack btnSave
        btnBack = document.getElementById("btnBack") as HTMLButtonElement;
        btnSave = document.getElementById("btnSave") as HTMLButtonElement;
        btn_Approveprice = document.getElementById("btn_Approveprice") as HTMLButtonElement;
        btn_Exit_Approveprice = document.getElementById("btn_Exit_Approveprice") as HTMLButtonElement;
        btnCustomerSrch = document.getElementById("btnCustomerSrch") as HTMLButtonElement;
        btnpriceSrch = document.getElementById("btnpriceSrch") as HTMLButtonElement;
        btnOrderSrch = document.getElementById("btnOrderSrch") as HTMLButtonElement;
        //print 
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;
        btnPrintTransaction = document.getElementById("btnPrintTransaction") as HTMLButtonElement;
        btnPrintslip = document.getElementById("btnPrintslip") as HTMLButtonElement;
        btndeliverynote = document.getElementById("btndeliverynote") as HTMLButtonElement;
        ////
        //btnPrintInvoicePrice = document.getElementById("btnPrintInvoicePrice") as HTMLButtonElement;

    }
    function InitializeEvents() {

        txtDiscountValue.onkeyup = txtDiscountValue_onchange;
        chkActive.onclick = chkActive_onchecked;
        btnAdd.onclick = btnAdd_onclick;
        btnShow.onclick = btnShow_onclick;
        btnUpdate.onclick = btnUpdate_onclick;
        btnAddDetails.onclick = AddNewRow;
        btnBack.onclick = btnBack_onclick;
        btnSave.onclick = btnSave_onclick;
        ddlType.onchange = ddlType_onchange;
        btn_Approveprice.onclick = btn_Approveprice_onclick;
        btn_Exit_Approveprice.onclick = btn_Exit_Approveprice_onclick;
        btnCustomerSrch.onclick = btnCustomerSrch_onclick;
        btnpriceSrch.onclick = btnpriceSrch_onclick;
        btnOrderSrch.onclick = btnOrderSrch_onclick;
        txt_Tax_Discount.onkeyup = txt_Tax_Discount_onchange;
        txt_Tax_total_Discount.onkeyup = txt_Tax_Discount_onchange;
        txt_Tax_total_AfterDiscount.onkeyup = Tax_Total_onchange;
        ddlStore.onchange = ddlStore_onchange;
        //print
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        btnPrint.onclick = () => { PrintReport(4); }
        btnPrintTransaction.onclick = PrintTransaction;
        btndeliverynote.onclick = printbtndeliverynote;
        btnPrintslip.onclick = btnPrintslip_onclick;
        ////
        //btnPrintInvoicePrice.onclick = btnPrintInvoicePrice_onclick;
        searchbutmemreport.onkeyup = _SearchBox_Change;
        txtCustomerCode.onchange = txtCustomerCode_onchange;
        btnPrintNew.onclick = btnPrintNew_onclick;
        btndiv_1.onclick = btndiv_1_onclick;
        btndiv_2.onclick = btndiv_2_onclick;


    }
    function GetTypeCust() {

        let Transcode = 0;
        let Iscredit = 0;
        let SlsType = "S";

        if (InvoiceType == 1) {
            Transcode = SysSession.CurrentEnvironment.RetailInvoiceTransCode;
            SlsType = 'R';
            Iscredit = SysSession.CurrentEnvironment.RetailInvoicePayment;
        }
        else if (InvoiceType == 2) {
            Transcode = SysSession.CurrentEnvironment.WholeInvoiceTransCode;
            Iscredit = SysSession.CurrentEnvironment.WholeInvoicePayment;
            SlsType = 'W';
        }



        CustType = SetCustomerType(Transcode, Iscredit, SlsType);


    }
    function btnCustomerSrch_onclick() {

        let Credit = '';
        if (ddlType.value == "0") {
            Credit = " and IsCreditCustomer = 1"
        }
        else {
            Credit = " and IsCreditCustomer = 0"

        }
        let sys: SystemTools = new SystemTools();
        //sys.FindKey(Modules.Sales_Services, "btnCustomerSrch", "CompCode=" + compcode + "and BranchCode=" + BranchCode + " and ISPersonal ='" + CustType.IsPersonal + "' and SalesInvoiceNature = " + CustType.SalesInvoiceNature + "", () => {
        var cond: string;

        //cond = "CompCode=" + compcode + " and ISPersonal ='" + CustType.IsPersonal + "'" + Credit;
        cond = "CompCode=" + compcode + " and SalesInvoiceNature = " + CustType.SalesInvoiceNature + Credit;
        if (CustType.IsPersonal != null)
            cond = cond + " and ISPersonal ='" + CustType.IsPersonal + "'";

        if (SysSession.CurrentEnvironment.I_Control[0].IsLocalBranchCustomer == true) { cond = cond + " and BranchCode=" + BranchCode; }


        sys.FindKey(Modules.Catch_Receipt, "btnCustomerSearch", "", () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey;
            CustomerId = id;
            ddlInvoiceCustomer_onchange();
        });
    }




    function btnpriceSrch_onclick() {


        let sys: SystemTools = new SystemTools();
        sys.FindKey(Modules.SlsTrSalesManager, "btnpriceSrch", "CompCode=" + compcode + "and BranchCode=" + BranchCode + " and TrType = 2  and SlsInvSrc = 1 ", () => {


            let id = SearchGrid.SearchDataGrid.SelectedKey;
            Invpriceshow(id);
        

            //-----------------------------------------------  function Price;
        });
    }
    function Invpriceshow(id: number) {
        debugger
        $("#div_Data").html("");
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetPriceshowById"),
            data: { InvId: id, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    PriceInvDetails = result.Response as Array<IQ_GetSlsInvoiceStatistic>;

                    $('#txtPriceshow').val(PriceInvDetails[0].TrNo);
                    $('#ddlStore').val(PriceInvDetails[0].StoreId);
                    $('#ddlSalesman').val(PriceInvDetails[0].SalesmanId);
                    $('#ddlType').val(PriceInvDetails[0].IsCash == false ? 0 : 1);
                    $('#ddlCashBox').val(PriceInvDetails[0].CashBoxID == null ? 'null' : PriceInvDetails[0].CashBoxID);
                    $('#txtCustomerCode').val(PriceInvDetails[0].CustomerId)
                    $('#txtInvoiceCustomerName').val(PriceInvDetails[0].CustomerName)
                    $('#txtCustomerMobile').val(PriceInvDetails[0].CustomerMobileNo)
                    $('#txtCashMoney').val(PriceInvDetails[0].CashAmount);
                    $('#txtCardMoney').val(PriceInvDetails[0].CardAmount);
                    $('#txtTotalbefore').val(PriceInvDetails[0].TotalAmount);
                    $('#txtTotalDiscount').val(PriceInvDetails[0].ItemDiscountTotal);
                    $('#txtTotal').val(PriceInvDetails[0].ItemTotal);
                    $('#txtTax').val(PriceInvDetails[0].VatAmount);
                    $('#txtDiscountValue').val(PriceInvDetails[0].RoundingAmount);
                    $('#txtNet').val(PriceInvDetails[0].Tot_Net);
                    $('#txtItemCount').val(PriceInvDetails[0].Line_Count);
                    $('#txtPackageCount').val(PriceInvDetails[0].Tot_Qty);
                    $('#txt_Remarks').val(PriceInvDetails[0].Remark);
                    CustomerId = PriceInvDetails[0].CustomerId;
                }
            }
        });

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetPriceshowitemsById"),
            data: { InvId: id, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    PriceInvitemsDetails = result.Response as Array<IQ_GetSlsInvoiceItem>;
                    CountGrid = PriceInvitemsDetails.length;
                    CountItems = 0;
                    for (var i = 0; i < CountGrid; i++) {

                        flagprice = 1;
                        BuildControls(i);
                        $('#txtServiceCode' + i).attr('disabled', 'disabled');
                        $('#txtServiceName' + i).attr('disabled', 'disabled');
                        $('#txtServiceCode' + i).val(PriceInvitemsDetails[i].it_itemCode);
                        $("#txtServiceName" + i).val(PriceInvitemsDetails[i].it_DescA);
                        $("#txt_ItemID" + i).val(PriceInvitemsDetails[i].ItemID);
                        $("#txtSerial" + i).val(PriceInvitemsDetails[i].Serial);
                        $('#txtQuantity' + i).val(PriceInvitemsDetails[i].SoldQty);
                        //$('#txtQuantity' + i).val(PriceInvitemsDetails[i].StockSoldQty);
                        $("#txtNetUnitPrice" + i).val(PriceInvitemsDetails[i].NetUnitPrice);
                        $("#txtPrice" + i).val(PriceInvitemsDetails[i].Unitprice);
                        //$("#txtPrice" + i).val(PriceInvitemsDetails[i].UnitpriceWithVat);
                        $("#txtDiscountPrc" + i).val(PriceInvitemsDetails[i].DiscountPrc);
                        $("#txtDiscountAmount" + i).val(PriceInvitemsDetails[i].DiscountAmount);
                        $("#ddlTypeuom" + i).val(PriceInvitemsDetails[i].UomID);
                        $("#txtTotal" + i).val(PriceInvitemsDetails[i].ItemTotal);
                        $("#txtTotAfterTax" + i).val(PriceInvitemsDetails[i].NetAfterVat);
                        //$("#txtPrice" + i).val(PriceInvitemsDetails[i].NetUnitPriceWithVat);
                        //$("#txtPrice" + i).val(PriceInvitemsDetails[i].BaseQtyPrice); 
                        $("#txtTax_Rate" + i).val(PriceInvitemsDetails[i].VatPrc);
                        $("#txtTax_Rate" + i).attr('data-VatNatID =' + PriceInvitemsDetails[i].VatNatID + '');
                        $("#txtTax" + i).val(PriceInvitemsDetails[i].VatAmount);
                        $("#txtReturnQuantity" + i).val(PriceInvitemsDetails[i].TotRetQty);
                        $("#btn_minus" + i).removeClass("display_none");
                        $("#btn_minus" + i).removeAttr("disabled");
                        $("#txt_StatusFlag" + i).val("i");

                        CountItems = CountItems + 1;
                        txtItemCount.value = CountItems.toString();
                    }
                    ComputeTotals();
                }

            }

        });

    }


    function btnOrderSrch_onclick() {


        let sys: SystemTools = new SystemTools();
        sys.FindKey(Modules.SlsTrSalesManager, "btnpriceSrch", "CompCode=" + compcode + "and BranchCode=" + BranchCode + " and TrType = 3  and SlsInvSrc = 1 ", () => {


            let id = SearchGrid.SearchDataGrid.SelectedKey; 
            InvOrderCust(id);

            //-----------------------------------------------  function Price;
        });
    }
    function InvOrderCust(id: number) {
        debugger
        $("#div_Data").html("");
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetOrderCustById"),
            data: { InvId: id, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    PriceInvDetails = result.Response as Array<IQ_GetSlsInvoiceStatistic>;

                    $('#txtPriceshow').val(PriceInvDetails[0].TrNo);
                    $('#ddlStore').val(PriceInvDetails[0].StoreId);
                    $('#ddlSalesman').val("null");
                    $('#ddlType').val(PriceInvDetails[0].IsCash == false ? 0 : 1);
                    $('#ddlCashBox').val(PriceInvDetails[0].CashBoxID == null ? 'null' : PriceInvDetails[0].CashBoxID);
                    $('#txtCustomerCode').val(PriceInvDetails[0].CustomerId)
                    $('#txtInvoiceCustomerName').val(PriceInvDetails[0].CustomerName)
                    $('#txtCustomerMobile').val(PriceInvDetails[0].CustomerMobileNo)
                    $('#txtCashMoney').val(PriceInvDetails[0].CashAmount);
                    $('#txtCardMoney').val(PriceInvDetails[0].CardAmount);
                    $('#txtTotalbefore').val(PriceInvDetails[0].TotalAmount);
                    $('#txtTotalDiscount').val(PriceInvDetails[0].ItemDiscountTotal);
                    $('#txtTotal').val(PriceInvDetails[0].ItemTotal);
                    $('#txtTax').val(PriceInvDetails[0].VatAmount);
                    $('#txtDiscountValue').val(PriceInvDetails[0].RoundingAmount);
                    $('#txtNet').val(PriceInvDetails[0].Tot_Net);
                    $('#txtItemCount').val(PriceInvDetails[0].Line_Count);
                    $('#txtPackageCount').val(PriceInvDetails[0].Tot_Qty);
                    $('#txt_Remarks').val(PriceInvDetails[0].Remark);
                    CustomerId = PriceInvDetails[0].CustomerId;
                }
            }
        });

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetOrderCustitemsById"),
            data: { InvId: id, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    PriceInvitemsDetails = result.Response as Array<IQ_GetSlsInvoiceItem>;
                    CountGrid = PriceInvitemsDetails.length;
                    CountItems = 0;
                    let GetItemInfo: Array<Iproc_GetItemInfo_Result> = new Array<Iproc_GetItemInfo_Result>();
                    for (var i = 0; i < CountGrid; i++) {

                        flagprice = 1;
                        BuildControls(i);
                        $("#txtSerial" + i).val(PriceInvitemsDetails[i].Serial);
                        $("#txt_ItemID" + i).val(PriceInvitemsDetails[i].ItemID);
                        $("#txtQuantity" + i).val(PriceInvitemsDetails[i].SoldQty);
                        $('#txtServiceCode' + i).attr('disabled', 'disabled');
                        $('#txtServiceName' + i).attr('disabled', 'disabled');
                        NumCnt = i
                        let ItemCode = '';
                        let ItemID = PriceInvitemsDetails[i].ItemID;
                        let Mode = InvoiceType;
                        var Storeid = Number($("#ddlStore").val());
                        Ajax.Callsync({
                            type: "Get",
                            url: sys.apiUrl("StkDefItemType", "GetItemByCode"),
                            data: {
                                CompCode: compcode, FinYear: Finyear, ItemCode: ItemCode, ItemID: ItemID, storeid: Storeid, Mode: Mode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                            },
                            success: (d) => {
                                let result = d as BaseResponse;
                                if (result.IsSuccess) {
                                    GetItemInfo = result.Response as Array<Iproc_GetItemInfo_Result>;
                                    if (GetItemInfo.length > 0) {




                                        $('#ddlTypeuom' + NumCnt + '').html('');
                                        for (var i = 0; i < GetItemInfo.length; i++) {
                                            $('#ddlTypeuom' + NumCnt + '').append('<option  data-OnhandQty="' + GetItemInfo[i].OnhandQty + '" data-UnitPrice="' + GetItemInfo[i].UnitPrice + '" data-MinPrice="' + GetItemInfo[i].MinPrice + '" data-Rate="' + GetItemInfo[i].Rate + '" value="' + GetItemInfo[i].uomid + '">' + (lang == "ar" ? GetItemInfo[i].u_DescA : GetItemInfo[i].u_DescE) + '</option>');
                                        }

                                        $('#txtServiceName' + NumCnt + '').val((lang == "ar" ? GetItemInfo[0].It_DescA : GetItemInfo[0].it_DescE));
                                        $('#txtServiceCode' + NumCnt + '').val(GetItemInfo[0].ItemCode);
                                        $('#txtPrice' + NumCnt + '').val(GetItemInfo[0].UnitPrice);
                                        $('#txtNetUnitPrice' + NumCnt + '').val(GetItemInfo[0].UnitPrice);
                                        //$('#txtQuantity' + NumCnt + '').val('1');

                                        Tax_Rate = GetItemInfo[0].VatPrc;
                                        Tax_Type_Model = GetVat(GetItemInfo[0].VatNatID, Tax_Rate, vatType);

                                        Tax_Rate = Tax_Type_Model.Prc
                                        VatPrc = Tax_Rate;
                                        $("#txtTax_Rate" + NumCnt).attr('Data-VatNatID', Tax_Type_Model.Nature);

                                        $('#txtServiceName' + NumCnt + '').attr('disabled', 'disabled');
                                        $('#txtServiceCode' + NumCnt + '').attr('disabled', 'disabled');

                                        totalRow(NumCnt);

                                    }
                                    else {
                                        $('#ddlTypeuom' + NumCnt + '').append('<option value="null">اختر الوحده</option>');
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

                       
                        $("#btn_minus" + i).removeClass("display_none");
                        $("#btn_minus" + i).removeAttr("disabled");
                        $("#txt_StatusFlag" + i).val("i");

                        CountItems = CountItems + 1;
                        txtItemCount.value = CountItems.toString();
                    }
                    ComputeTotals();
                }

            }

        });

    }


    function txtCustomerCode_onchange() {
        if (txtCustomerCode.value != "") {
            var custObjct: Array<CUSTOMER> = CustDetails.filter(s => s.CustomerCODE == txtCustomerCode.value);
            if (custObjct.length > 0) {
                txtInvoiceCustomerName.value = lang == "ar" ? custObjct[0].CUSTOMER_NAME : custObjct[0].NAMEE;
                txtCustomerCode.value = custObjct[0].CustomerCODE;
                txtCustomerMobile.value = custObjct[0].PHONE;
                CustomerId = custObjct[0].CUSTOMER_ID;
            } else {
                txtCustomerCode.value = "";
                txtInvoiceCustomerName.value = "";
                CustomerId = 0;
                DisplayMassage("كود العميل غير صحيح", "Wrong Customer code", MessageType.Error);
            }
        } else {
            CustomerId = 0;
            txtCustomerCode.value = "";
            txtInvoiceCustomerName.value = "";
        }
    }
    function btndiv_1_onclick() {
        $("#btndiv_1").addClass("Actiev");
        $("#btndiv_1").removeClass("navbar navbar-inverse");
        $("#btndiv_2").removeClass("Actiev");
        $("#btndiv_2").addClass("navbar navbar-inverse");
        $("#div_1").removeClass("display_none");
        $("#div_2").addClass("display_none");
    }
    function btndiv_2_onclick() {

        if (CountGrid == 0 || txtItemCount.value == '0') {
            DisplayMassage(" برجاء ادخال بيانات الفاتورة", "Please enter the invoice data", MessageType.Worning);
            Errorinput(btnAddDetails);
            return false
        }
        else {

            var CanAdd: boolean = true;
            if (CountGrid > 0) {
                for (var i = 0; i < CountGrid; i++) {
                    CanAdd = Validation_Grid(i);
                    if (CanAdd == false) {
                        return false;
                        //break;
                    }
                }
            }

        }



        $("#btndiv_1").removeClass("Actiev");
        $("#btndiv_1").addClass("navbar navbar-inverse");
        $("#btndiv_2").addClass("Actiev");
        $("#btndiv_2").removeClass("navbar navbar-inverse");
        $("#div_1").addClass("display_none");
        $("#div_2").removeClass("display_none");


        if ($("#btnUpdate").attr('class') == 'btn btn-primary float_left display_none') {

        }
        else {

            Compute_Invoice();
        }

    }
    function Compute_Invoice() {


        $("#Tax_TotalInvoice").text(txtTotal.value);
        $("#Tax_InvoiceVAT").text(txtTax.value);
        $("#Tax_AfterTotalInvoiceVAT").text(txtNet.value);


        if (NewAdd == true) {
            if (Discount == 0) {
                $("#txt_Tax_Discount").val(0);

            }
            else {
                $("#txt_Tax_Discount").val(Discount);
            }
            $("#txt_Tax_total_Discount").val($("#Tax_TotalInvoice").text());
        }
        else {

            $("#txt_Tax_Discount").val(Selecteditem[0].AllowPrc);
            $("#txt_Tax_total_Discount").val(Selecteditem[0].AllowBase);


        }

        $("#txt_Tax_total_Discount").val($("#Tax_TotalInvoice").text());
        $("#txt_Tax_total_AfterDiscount").val(0);
        $("#txt_Tax_Vat").val(0);
        $("#txt_Tax_AfterTotalVAT").val(0);



        txt_Tax_Discount_onchange();
    }
    function Tax_Net_Total() {

        let Net_total_After = Number($("#Tax_TotalInvoice").text()) - Number($("#txt_Tax_total_AfterDiscount").val());
        $("#Tax_Net_total_AfterDiscount").text(Net_total_After.toFixed(2));

        let Tax_Net_VAT = Number($("#Tax_InvoiceVAT").text()) - Number($("#txt_Tax_Vat").val())
        $("#Tax_Net_VAT").text(Tax_Net_VAT.toFixed(2));

        let Net_AfterTotalVAT = Number($("#Tax_AfterTotalInvoiceVAT").text()) - Number($("#txt_Tax_AfterTotalVAT").val())
        $("#Tax_Net_AfterTotalVAT").text(Net_AfterTotalVAT.toFixed(2));


        var difference_1 = (Number($("#Tax_Net_total_AfterDiscount").text()) * 0.15)
        var difference_2 = difference_1 + Number($("#Tax_Net_total_AfterDiscount").text());

        var difference_3 = difference_2 - Number($("#Tax_Net_AfterTotalVAT").text());

        $("#txtFraction_difference").text(difference_3.toFixed(4));

    }
    function txt_Tax_Discount_onchange() {
        if (Number(txt_Tax_Discount.value) > 100) {

            txt_Tax_Discount.value = '100';
            Errorinput(txt_Tax_Discount);
            //return
        }

        Discount = Number(txt_Tax_Discount.value);

        let Disc = txt_Tax_Discount.value;
        let total_Discount = $("#txt_Tax_total_Discount").val();
        let total_After_Discount = 0;
        let Tax_Vat = 0;
        let AfterTotalVAT = 0;

        total_After_Discount = (Number(Disc) * Number(total_Discount)) / 100;
        $("#txt_Tax_total_AfterDiscount").val(total_After_Discount.toFixed(2));


        Tax_Vat = (Number($("#txt_Tax_total_AfterDiscount").val()) * VatPrc) / 100;
        $("#txt_Tax_Vat").val(Number(Tax_Vat).toFixed(2));


        AfterTotalVAT = (Number($("#txt_Tax_total_AfterDiscount").val()) + Number($("#txt_Tax_Vat").val()));
        $("#txt_Tax_AfterTotalVAT").val(Number(AfterTotalVAT).toFixed(2));


        Tax_Net_Total();

    }
    function Tax_Total_onchange() {

        if (Number(txt_Tax_total_AfterDiscount.value) > Number($("#Tax_TotalInvoice").text())) {

            txt_Tax_total_AfterDiscount.value = $("#Tax_TotalInvoice").text();
            Errorinput(txt_Tax_total_AfterDiscount);
        }



        let Tax_Vat = 0;
        let AfterTotalVAT = 0;

        $("#txt_Tax_Discount").val('0');
        $("#txt_Tax_total_Discount").val('0');


        Tax_Vat = (Number($("#txt_Tax_total_AfterDiscount").val()) * VatPrc) / 100;
        $("#txt_Tax_Vat").val(Number(Tax_Vat).toFixed(2));


        AfterTotalVAT = (Number($("#txt_Tax_total_AfterDiscount").val()) + Number($("#txt_Tax_Vat").val()));
        $("#txt_Tax_AfterTotalVAT").val(Number(AfterTotalVAT).toFixed(2));


        Tax_Net_Total()
    }
    function Check_on_user_type() {

        if (SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3) { //Salesman

            let SalesId = SysSession.CurrentEnvironment.SalesManID;
            SalesmanDetails = SalesmanDetails.filter(s => s.SalesmanId == SalesId);

        }

    }
    //------------------------------------------------------ Events Region------------------------
    function ddlInvoiceCustomer_onchange() {

        if (CustomerId == 0) {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                txtInvoiceCustomerName.value = "عميل نقدي عام";
                txtCustomerMobile.value = '';
            }
            else {
                txtInvoiceCustomerName.value = "General cash client";
                txtCustomerMobile.value = '';

            }
            ddlType.value = "1";
        } else {
            var custID = CustomerId;
            var customer = CustDetails.filter(s => s.CUSTOMER_ID == custID);
            /*vatType = customer[0].VATType;*/
            txtCustomerCode.value = customer[0].CustomerCODE;
            txtInvoiceCustomerName.value = customer[0].CUSTOMER_NAME.toString();
            txtCustomerMobile.value = customer[0].PHONE;


        }




        //if (NewAdd == true) {

        //    if (CountItems > 0) {
        //        DisplayMassage("من فضلك اعادة ادخال  بيانات الفاتورة مره أخري", "Please re-enter the billing information again", MessageType.Worning);
        //        Errorinput(txtCustomerCode);
        //    }

        //}


        //CountItems = 0;
        //PackageCount = 0;
        //CountTotal = 0;
        //TaxCount = 0;
        //NetCount = 0;
        //CountGrid = 0;
        //$('#div_Data').html("");
        //ComputeTotals();
        //AddNewRow();


    }
    function ddlType_onchange() {
        if (ddlType.value == "1") {//نقدي 
            //if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            //    txtInvoiceCustomerName.value = "عميل نقدي عام";
            //    txtCustomerMobile.value = "";
            //}
            //else {
            //    txtInvoiceCustomerName.value = "General cash client";
            //    txtCustomerMobile.value = "";
            //}
            txtCustomerMobile.value = "";

            CustomerId = 0;
            //$("#ddlInvoiceCustomer").attr("disabled", "disabled");
            //$("#txtCustomerMobile").attr("disabled", "disabled");
            $("#txtCustomerCode").removeAttr("disabled");
            //SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlCashBox').prop('selectedIndex', 1), $("#Div_Money").removeClass("display_none")) : $('#ddlCashBox').prop('selectedIndex', 0); $('#ddlCashBox').attr('disabled', 'disabled');

            vatType = SysSession.CurrentEnvironment.I_Control[0].DefSlsVatType; //From Session
            $("#Div_Money").removeClass("display_none");
            TypeFlag = true;
        } else {//علي الحساب

            //$('#ddlCashBox').prop('selectedIndex', 0);
            //$('#ddlCashBox').attr('disabled', 'disabled');
            //txtInvoiceCustomerName.value = "";
            //txtCustomerCode.value = "";
            //CustomerId = 0;
            $("#btnpriceSrch").removeAttr("disabled");
            $("#btnOrderSrch").removeAttr("disabled");
            $("#txtCustomerCode").removeAttr("disabled");
            $("#btnCustomerSrch").removeAttr("disabled");
            $("#txtCustomerMobile").removeAttr("disabled");

            TypeFlag = false;
            $("#Div_Money").addClass("display_none");

            //fillddlCustomer();
        }



        //if (CountItems > 0) {
        //    DisplayMassage("من فضلك اعادة ادخال  بيانات الفاتورة مره أخري", "Please re-enter the billing information again", MessageType.Worning);
        //}

        //CountItems = 0;
        //PackageCount = 0;
        //CountTotal = 0;
        //TaxCount = 0;
        //NetCount = 0;
        //CountGrid = 0;
        //$('#div_Data').html("");

        //ComputeTotals();


    }
    function txtDiscountValue_onchange() {

        if (txtDiscountValue.value.trim() != '' && txtDiscountValue.value != '0') {
            txtNet.value = (Number(NetCount.toFixed(2)) - Number(txtDiscountValue.value)).toFixed(2);

        }
        else {
            ComputeTotals();
        }
    }
    function checkValidation() {
        if (!SysSession.CurrentPrivileges.CUSTOM1) {
            chkActive.disabled = true;
        } else {
            chkActive.disabled = false;
        }
    }
    function chkActive_onchecked() {
        if (btnUpdate.getAttribute('class') != 'btn btn-primary display_none') {
            if (chkActive.checked == false && InvoiceStatisticsModel[0].Status == 1) {
                openInvoice();
            }
        }

    }
    function chkPreivilegeToEditApprovedInvoice() {

        if (SysSession.CurrentPrivileges.CUSTOM2 == false) {
            chkActive.disabled = true;
            btnUpdate.disabled = true;
        } else {
            chkActive.disabled = false;
            btnUpdate.disabled = true;
        }
    }
    function Check_CreditLimit_Custom(net: number) {

        var custID = CustomerId;
        var custom1 = CustDetails.filter(s => s.CUSTOMER_ID == custID);

        var Isbalance = Number((Number(custom1[0].Openbalance) + Number(custom1[0].Debit) - Number(custom1[0].Credit)).toFixed(2));

        let res = Number((net + Isbalance).toFixed(2));

        if (custom1[0].Openbalance > 0) {

            if (res <= custom1[0].Openbalance) { return true }
            else {
                WorningMessage("خطأ لا يمكن ان تجاوز صافي الفاتوره (" + net + ") مع الرصيد (" + Isbalance + ") الحد الائتماني     (" + custom1[0].CreditLimit + ")", "Error The net invoice (" + net + ") cannot exceed the balance (" + Isbalance + ") credit limit (" + custom1[0].CreditLimit + ") ");
                return false
            }

        }
        return true
    }
    function ddlStore_onchange() {

        let Flag = 0;
        for (var i = 0; i < CountGrid; i++) {

            if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m") {
                Flag = i;
            }

        }

        if ($('#txtServiceCode' + Flag).val() != "") {
             
            if (NewAdd == true) {

                if (CountItems > 0) {
                    DisplayMassage("من فضلك اعادة ادخال  بيانات الفاتورة مره أخري", "Please re-enter the billing information again", MessageType.Worning);
                }

            }


            CountItems = 0;
            PackageCount = 0;
            CountTotal = 0;
            TaxCount = 0;
            NetCount = 0;
            CountGrid = 0;
            $('#div_Data').html("");
            ComputeTotals();
            AddNewRow();
        }
    }
    //------------------------------------------------------ Buttons Region------------------------
    function btnSave_onclick() {
        debugger
        if (!SysSession.CurrentPrivileges.AddNew) return;
        if (!ValidationHeader()) return;

        var CanAdd: boolean = true;
        if (CountGrid > 0) {
            for (var i = 0; i < CountGrid; i++) {
                CanAdd = Validation_Grid(i);
                if (CanAdd == false) {
                    break;
                }
            }
        }
        if (CanAdd) {

            //if (CustomerId != 0 && ddlType.value == "0") {

            //    let net = Number(txtNet.value);
            //    if (!Check_CreditLimit_Custom(net))
            //        return;
            //}

            Validation_Insert = 0;
            MasterDetailsModel = new SlsInvoiceMasterDetails();
            Assign();
            MasterDetailsModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            MasterDetailsModel.UserCode = SysSession.CurrentEnvironment.UserCode;

            InvoiceModel.VatType = vatType;
            InvoiceModel.VatAmount = Number(txtTax.value);             
            if (Validation_Insert == 1) { Open_poup_Pass(); }
            else if (NewAdd == true) {

                InvoiceModel.PurchaseorderNo = $('#txtPriceshow').val();
                InvoiceModel.CreatedAt = DateTimeFormat(Date().toString());
                InvoiceModel.CreatedBy = SysSession.CurrentEnvironment.UserCode;


                MasterDetailsModel.I_Sls_TR_Invoice = InvoiceModel;
                insert();

            }
            else {
                InvoiceModel.PurchaseorderNo = $('#txtPriceshow').val();
                InvoiceModel.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
                InvoiceModel.UpdatedAt = DateTimeFormat(Date().toString());
                MasterDetailsModel.I_Sls_TR_Invoice = InvoiceModel;
                if (AutherizeFlag == false) {

                    Update();
                }
                else {
                    updateWithProcess();
                }

                IsSuccess = false;

            }
        }
    }
    function btnBack_onclick() {
        if (NewAdd == true) { //add

            $("#DivInvoiceDetails").addClass("display_none");
            $("#cotrolDiv").removeClass("disabledDiv");
            $("#txtCustomerCode").attr("disabled", "disabled");
            $("#txtCustomerMobile").attr("disabled", "disabled");
            $("#txtPriceshow").attr("disabled", "disabled");
            $("#ddlType").attr("disabled", "disabled");
            $("#chkActive").attr("disabled", "disabled");
            $("#txt_Remarks").attr("disabled", "disabled");

            $("#txtCashMoney").attr("disabled", "disabled");
            $("#txtCardMoney").attr("disabled", "disabled");

            $("#txt_Tax_Discount").attr("disabled", "disabled");
            $("#txt_Tax_total_Discount").attr("disabled", "disabled");
            $("#txt_Tax_total_AfterDiscount").attr("disabled", "disabled");
            $("#txtContract_NO").attr("disabled", "disabled");
            $("#txtPurchase_order_No").attr("disabled", "disabled");
            $("#txtDate_of_supply").attr("disabled", "disabled");
            $("#txtSupply_end_Date").attr("disabled", "disabled");
            $("#txtTerms_of_Payment").attr("disabled", "disabled");
            $("#txtDiscountValue").attr("disabled", "disabled");



            $("#div_btnPrint").removeClass("display_none");
            $("#txtPriceshow").val("");

            $("#btnUpdate").removeClass("display_none");
            $("#btnPrintTransaction").removeClass("display_none");
            $("#btnBack").addClass("display_none");
            $("#btnSave").addClass("display_none");
            ddlStore.disabled = true;


        }
        else {//Edit

            Grid_RowDoubleClicked();
            $("#cotrolDiv").removeClass("disabledDiv");
            $("#txtCustomerCode").attr("disabled", "disabled");
            $("#txtCustomerMobile").attr("disabled", "disabled");
            $("#txtPriceshow").attr("disabled", "disabled");
            $("#ddlType").attr("disabled", "disabled");
            $("#chkActive").attr("disabled", "disabled");
            $("#txt_Remarks").attr("disabled", "disabled");

            $("#txtCashMoney").attr("disabled", "disabled");
            $("#txtCardMoney").attr("disabled", "disabled");

            $("#txt_Tax_Discount").attr("disabled", "disabled");
            $("#txt_Tax_total_Discount").attr("disabled", "disabled");
            $("#txt_Tax_total_AfterDiscount").attr("disabled", "disabled");
            $("#txtContract_NO").attr("disabled", "disabled");
            $("#txtPurchase_order_No").attr("disabled", "disabled");
            $("#txtDate_of_supply").attr("disabled", "disabled");
            $("#txtSupply_end_Date").attr("disabled", "disabled");
            $("#txtTerms_of_Payment").attr("disabled", "disabled");
            $("#txtDiscountValue").attr("disabled", "disabled");

            $("#div_btnPrint").removeClass("display_none");

            $("#btnUpdate").removeClass("display_none");
            $("#btnPrintTransaction").removeClass("display_none");
            $("#btnBack").addClass("display_none");
            $("#btnSave").addClass("display_none");
            ddlStore.disabled = true;


        }

    }
    function btnAdd_onclick() {
        let InvTransCode;
        if (InvoiceType == 1)
            InvTransCode = SysSession.CurrentEnvironment.RetailInvoiceTransCode;
        else
            InvTransCode = SysSession.CurrentEnvironment.WholeInvoiceTransCode;

        if (InvTransCode != 1) {
            $('#btndiv_2').addClass('display_none');
        } else {
            $('#btndiv_2').removeClass('display_none');
        }
        chkActive.disabled = true;
        $("#DivInvoiceDetails").removeClass("display_none");

        lblInvoiceNumber.value = '';
        txtInvoiceDate.value = GetDate();

        CustomerId = 0;
        txtInvoiceCustomerName.value = ''
        txtCustomerCode.value = ''
        txtCustomerMobile.value = ''
        ddlSalesman.value = 'null'
        SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlStore option[value="null"]').remove()) : $('#ddlStore').prop('selectedIndex', 1);
        ddlType.value = '1';
        txtTotal.value = '0';
        txtTax.value = '0';
        txtNet.value = '0';
        txtTotalDiscount.value = '0';
        txtTotalbefore.value = '0';
        txt_Remarks.value = '';
        txtDiscountValue.value = '';
        txtItemCount.value = '0'
        txtPackageCount.value = '0'
        chkActive.checked = true;
        $('#txtCreatedBy').prop("value", "");
        $('#txtCreatedAt').prop("value", "");
        $('#txtUpdatedBy').prop("value", "");
        $('#txtUpdatedAt').prop("value", "");
        $('#txtPriceshow').prop("value", "");
        $('#txtCashMoney').prop("value", "0");
        $('#txtCardMoney').prop("value", "0");

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            txtInvoiceCustomerName.value = "عميل نقدي عام";
            txtCustomerMobile.value = "";
        }
        else {
            txtInvoiceCustomerName.value = "General cash client";
            txtCustomerMobile.value = "";
        }
        txtCustomerMobile.value = "";
        CustomerId = 0;
        $("#txtCustomerMobile").attr("disabled", "disabled");
        $("#txtCustomerCode").removeAttr("disabled");


        TypeFlag = true;


        txtCustomerCode.disabled = false;
        ddlSalesman.disabled = false;
        ddlStore.disabled = false;
        ddlType.disabled = false;
        txt_Remarks.disabled = false;
        txtDiscountValue.disabled = false;


        $("#btnAddDetails").removeClass("display_none");
        $("#btnUpdate").addClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");

        $("#div_btnPrint").addClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");


        $("#div_Data").html("");
        CountGrid = 0;
        CountItems = 0;

        $("#cotrolDiv").attr("disabled", "disabled").off('click');
        $("#cotrolDiv").addClass("disabledDiv");

        Show = false;
        NewAdd = true;
        //chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM1;
        $('#txtCreatedBy').prop("value", SysSession.CurrentEnvironment.UserCode);
        $('#txtCreatedAt').prop("value", DateTimeFormat(Date().toString()));

        SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlCashBox').prop('selectedIndex', 1), $("#Div_Money").removeClass("display_none")) : $('#ddlCashBox').prop('selectedIndex', 0); $('#ddlCashBox').attr('disabled', 'disabled');

        SysSession.CurrentEnvironment.I_Control[0].IvoiceDateEditable == true ? $('#txtInvoiceDate').removeAttr("disabled") : $('#txtInvoiceDate').attr("disabled", "disabled");

        btndiv_1_onclick();
        $('#txt_Tax_Discount').val("0");
        $('#txt_Tax_total_Discount').val("0");
        $('#txt_Tax_total_AfterDiscount').val("0");
        $('#txt_Tax_Vat').val("0");
        $('#txt_Tax_AfterTotalVAT').val("0");
        $('#txtContract_NO').val("");
        $('#txtPurchase_order_No').val("");
        $('#txtTerms_of_Payment').val("");
        $('#txtDate_of_supply').val(GetDate());
        $('#txtSupply_end_Date').val(GetDate());

        $("#txt_Tax_Discount").removeAttr("disabled");
        $("#txt_Tax_total_Discount").removeAttr("disabled");
        $("#txt_Tax_total_AfterDiscount").removeAttr("disabled");
        $("#txtContract_NO").removeAttr("disabled");
        $("#txtPurchase_order_No").removeAttr("disabled");
        $("#txtDate_of_supply").removeAttr("disabled");
        $("#txtSupply_end_Date").removeAttr("disabled");
        $("#txtTerms_of_Payment").removeAttr("disabled");
        $("#btnpriceSrch").removeAttr("disabled");
        $("#btnOrderSrch").removeAttr("disabled");
        btnCustomerSrch.disabled = false;
        btnpriceSrch.disabled = false;



        if (InvoiceType == 1) {       //Retail 

            if (SysSession.CurrentEnvironment.RetailInvoicePayment == 0) {//Cash
                ddlType.value = '1';
                ddlType.disabled = true;
                $("#Div_Money").removeClass("display_none");
                $("#txtCashMoney").removeAttr("disabled");
                $("#txtCardMoney").removeAttr("disabled");
                $("#txtInvoiceCustomerName").removeAttr("disabled");
                $("#txtCustomerMobile").removeAttr("disabled");

            }
            else if (SysSession.CurrentEnvironment.RetailInvoicePayment == 1) {//Credit
                ddlType.value = '0';
                ddlType.disabled = true;
                $("#Div_Money").addClass("display_none");
                $("#txtInvoiceCustomerName").removeAttr("disabled");
                $("#txtCustomerMobile").removeAttr("disabled");
                $("#txtInvoiceCustomerName").val("");
                $('#ddlCashBox').prop('selectedIndex', 0);
            }
            else {       //Both
                ddlType.disabled = false;
                $("#Div_Money").removeClass("display_none");
                $("#txtCashMoney").removeAttr("disabled");
                $("#txtCardMoney").removeAttr("disabled");
                $("#txtInvoiceCustomerName").removeAttr("disabled");
                $("#txtCustomerMobile").removeAttr("disabled");

            }

        }
        else if (InvoiceType == 2) {  //Wholesale 

            if (SysSession.CurrentEnvironment.WholeInvoicePayment == 0) {//Cash
                ddlType.value = '1';
                ddlType.disabled = true;
                $("#Div_Money").removeClass("display_none");
                $("#txtCashMoney").removeAttr("disabled");
                $("#txtCardMoney").removeAttr("disabled");
                $("#txtInvoiceCustomerName").removeAttr("disabled");
                $("#txtCustomerMobile").removeAttr("disabled");

            }
            else if (SysSession.CurrentEnvironment.WholeInvoicePayment == 1) {//Credit
                ddlType.value = '0';
                ddlType.disabled = true;
                $("#Div_Money").addClass("display_none");
                $("#txtInvoiceCustomerName").removeAttr("disabled");
                $("#txtCustomerMobile").removeAttr("disabled");
                $("#txtInvoiceCustomerName").val("");
                $('#ddlCashBox').prop('selectedIndex', 0);

            }
            else {           //Both
                ddlType.disabled = false;
                $("#Div_Money").removeClass("display_none");
                $("#txtCashMoney").removeAttr("disabled");
                $("#txtCardMoney").removeAttr("disabled");
                $("#txtInvoiceCustomerName").removeAttr("disabled");
                $("#txtCustomerMobile").removeAttr("disabled");


            }

        }
        else {                        //Both



        }


        AddNewRow();

    }
    function btnShow_onclick() {
        InitializeGrid();
        $("#divShow").removeClass("display_none");
        $("#DivInvoiceDetails").addClass("display_none");
        $("#cotrolDiv").removeClass("disabledDiv");
    }
    function btnUpdate_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT) return;
        $("#cotrolDiv").attr("disabled", "disabled").off('click');
        $("#cotrolDiv").addClass("disabledDiv");
        Show = false;
        $("#btnUpdate").addClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
        $("#div_btnPrint").addClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");

        var items: number = Number(CountGrid);
        for (let i = 0; i < items + 1; i++) {
            $("#btnSearchService" + i).removeAttr("disabled");
            $("#txtQuantity" + i).removeAttr("disabled");
            $("#txtPrice" + i).removeAttr("disabled");
            $("#txtDiscountPrc" + i).removeAttr("disabled");
            $("#txtDiscountAmount" + i).removeAttr("disabled");
            $("#txtPrice" + i).removeAttr("disabled");
            $("#ddlTypeuom" + i).removeAttr("disabled");


            $("#btn_minus" + i).removeClass("display_none");
            $("#btn_minus" + i).removeAttr("disabled");
            $("#btn_minus" + i).click(function (e) {
                //  alert("hi");
                DeleteRow(i);
            });
        }
        $("#txtDiscountValue").removeAttr("disabled");
        $("#btnCustomerSrch").removeAttr("disabled");
        $("#ddlSalesman").removeAttr("disabled");
        $("#txtCustomerCode").removeAttr("disabled");
        $("#txtCustomerMobile").removeAttr("disabled");
        $("#ddlType").removeAttr("disabled");
        $("#chkActive").removeAttr("disabled");
        $("#txt_Tax_Discount").removeAttr("disabled");
        $("#txt_Tax_total_Discount").removeAttr("disabled");
        $("#txt_Tax_total_AfterDiscount").removeAttr("disabled");
        $("#txtContract_NO").removeAttr("disabled");
        $("#txtPurchase_order_No").removeAttr("disabled");
        $("#txtDate_of_supply").removeAttr("disabled");
        $("#txtSupply_end_Date").removeAttr("disabled");
        $("#txtTerms_of_Payment").removeAttr("disabled");
        $("#txtCashMoney").removeAttr("disabled");
        $("#txtCardMoney").removeAttr("disabled");
        $("#txt_Remarks").removeAttr("disabled");
        $("#txtInvoiceCustomerName").removeAttr("disabled");
        $("#txtDiscountValue").removeAttr("disabled");
        $("#btnAddDetails").removeClass("display_none");
        checkValidation();

        NewAdd = false;




        if (Selecteditem[0].SlsInvType == 1) {       //Retail 

            if (SysSession.CurrentEnvironment.RetailInvoicePayment == 0) {//Cash      
                ddlType.disabled = true;
            }
            else if (SysSession.CurrentEnvironment.RetailInvoicePayment == 1) {//Credit        
                ddlType.disabled = true;
            }
            else {
                ddlType.disabled = false;
            }

        }
        else if (Selecteditem[0].SlsInvType == 2) {  //Wholesale 

            if (SysSession.CurrentEnvironment.WholeInvoicePayment == 0) {//Cash       
                ddlType.disabled = true;
            }
            else if (SysSession.CurrentEnvironment.WholeInvoicePayment == 1) {//Credit         
                ddlType.disabled = true;
            }
            else {
                ddlType.disabled = false;
            }

        }
        else {                        //Both

        }




        SysSession.CurrentEnvironment.I_Control[0].IvoiceDateEditable == true ? $('#txtInvoiceDate').removeAttr("disabled") : $('#txtInvoiceDate').attr("disabled", "disabled");

    }
    //------------------------------------------------------ Drop Down Region------------------------
    function FillddlCashBox() {

        let CashBoxID = 0;
        if (SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3) {

            CashBoxID = SysSession.CurrentEnvironment.CashBoxID == null ? 0 : SysSession.CurrentEnvironment.CashBoxID;
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefBox", "GetById"),
            data: { compCode: compcode, BranchCode: BranchCode, CashBoxID: CashBoxID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    CashboxDetails = result.Response as Array<A_RecPay_D_CashBox>;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(CashboxDetails, ddlCashBox, "CashBoxID", "CashBox_DescE", "CashBox");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(CashboxDetails, ddlCashBox, "CashBoxID", "CashBox_DescA", "اختر الصندوق");
                    }
                    SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlCashBox').prop('selectedIndex', 1), $("#Div_Money").removeClass("display_none")) : $('#ddlCashBox').prop('selectedIndex', 0); $('#ddlCashBox').attr('disabled', 'disabled');
                }
            }
        });




    }
    function fillddlCustomer() {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Customer", "GetAll"),
            data: {
                CompCode: compcode, BranchCode: BranchCode
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    CustDetails = result.Response as Array<CUSTOMER>;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {//ddlInvoiceCustomer
                        DocumentActions.FillCombowithdefult(CustDetails, ddlCustomer, "CUSTOMER_ID", "NAMEE", "Select customer");

                    }
                    else {
                        DocumentActions.FillCombowithdefult(CustDetails, ddlCustomer, "CUSTOMER_ID", "CUSTOMER_NAME", "اختر العميل");

                    }
                }
            }
        });
    }
    function fillddlSalesman() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefSalesMen", "GetAllSalesPeople"),// GetAllSalesPeople(int CompCode, bool IsSalesEnable, string UserCode, string Token)
            data: {
                CompCode: compcode, BranchCode: BranchCode, IsSalesEnable: true, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    SalesmanDetails = result.Response as Array<I_Sls_D_Salesman>;
                    Check_on_user_type();

                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesman, "SalesmanId", "NameE", "Select Salesman");
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesmanFilter, "SalesmanId", "NameE", "Select Category");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesman, "SalesmanId", "NameA", "اختر المندوب");
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesmanFilter, "SalesmanId", "NameA", "اختر المندوب");
                    }
                    SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlSalesman option[value="null"]').remove()) : $('#ddlSalesman').prop('selectedIndex', 0);
                    SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlSalesmanFilter option[value="null"]').remove()) : $('#ddlSalesmanFilter').prop('selectedIndex', 0);

                }
            }
        });
    }
    function FillddlStateType() {
        StateDetailsAr = ["غير معتمد", " معتمد", "الجميع"];
        StateDetailsEn = [" Not Approved", " Approved", "All"];

        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (let i = 0; i < StateDetailsEn.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsEn[i];
                ddlStateType.options.add(newoption);
            }
        }
        else {
            for (let i = 0; i < StateDetailsAr.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsAr[i];
                ddlStateType.options.add(newoption);
            }
        }
    }
    function FillddlInvoiceType() {
        InvoiceDetailsAr = ["علي الحساب", " نقدي", "الجميع"];
        InvoiceDetailsEn = [" Credit ", " Cash", "All"];

        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (let i = 0; i < InvoiceDetailsEn.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = InvoiceDetailsEn[i];
                ddlInvoiceType.options.add(newoption);
            }
        }
        else {
            for (let i = 0; i < InvoiceDetailsAr.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = InvoiceDetailsAr[i];
                ddlInvoiceType.options.add(newoption);
            }
        }
    }
    function FillddlType() {
        InvoiceTypeDetailsAr = ["علي الحساب", " نقدي"];
        InvoiceEyptDetailsEn = [" Credit ", " Cash"];

        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (let i = 0; i < InvoiceEyptDetailsEn.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = InvoiceEyptDetailsEn[i];
                ddlType.options.add(newoption);
            }
        }
        else {
            for (let i = 0; i < InvoiceTypeDetailsAr.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = InvoiceTypeDetailsAr[i];
                ddlType.options.add(newoption);
            }
        }

    }
    function FillddlStore() {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefStore", "GetAll"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    storeDetails = result.Response as Array<G_STORE>;

                    if (SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3) {
                        let StoreID = SysSession.CurrentEnvironment.StoreID;
                        storeDetails = storeDetails.filter(s => s.StoreId == StoreID);
                    } $('#ddlStore').append('<option commissionPRC="0"  value="null">' + (lang == "ar" ? "اختر المستودع": "Choose store") + ' </option>');
                    for (var i = 0; i < storeDetails.length; i++) {
                        $('#ddlStore').append('<option commissionPRC="' + storeDetails[i].CommissionPRC + '"  value="' + storeDetails[i].StoreId + '">' + (lang == "ar" ? storeDetails[i].DescA : storeDetails[i].DescL) + ' </option>');
                    }
                           
                    SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlStore option[value="null"]').remove()) : $('#ddlStore').prop('selectedIndex', 1);
                }
            }
        });
    }
    function FillddlVatNature() {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenVatType", "GetAllVatNature"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    DetailsVatNature = result.Response as Array<G_VatNature>;
                }
            }
        });
    }
    //------------------------------------------------------ Normal Grid Region------------------------
    function InitializeGrid() {
        let res: any = GetResourceList("");
        Grid.ElementName = "divGridDetails";
        Grid.Paging = true;
        Grid.PageSize = 10;
        Grid.Sorting = true;
        Grid.InsertionMode = JsGridInsertionMode.Binding;
        Grid.Editing = false;
        Grid.Inserting = false;
        Grid.SelectedIndex = 1;
        Grid.OnRowDoubleClicked = Grid_RowDoubleClicked;
        Grid.OnItemEditing = () => { };
        Grid.PrimaryKey = "InvoiceID";
        Grid.Columns = [
            { title: res.App_Number, name: "InvoiceID", type: "text", width: "2%", visible: false },
            { title: res.App_Number, name: "TrNo", type: "text", width: "13%" },
            { title: res.App_Cutomer, name: "CustomerName", type: "text", width: "25%" },
            { title: res.App_Salesman, name: (lang == "ar" ? "Slsm_DescA" : "Slsm_DescE"), type: "text", width: "25%" },
            { title: res.App_date, name: "TrDate", type: "text", width: "20%" },
            { title: res.Men_StkDefItems, name: "Line_Count", type: "text", width: "12%" },
            { title: res.App_Package, name: "Tot_Qty", type: "text", width: "12%" },
            { title: res.App_total, name: "TotalAmount", type: "text", width: "15%" },
            { title: res.App_Tax, name: "VatAmount", type: "text", width: "12%" },
            { title: res.App_Net, name: "NetAfterVat", type: "text", width: "13%" },
            { title: res.App_Commission, name: "CommitionAmount", type: "text", width: "15%" },
            { title: res.App_TobePaid, name: "RemainAmount", type: "text", width: "17%", css: "classfont" },
            { title: res.App_invoiceType, name: "IsCashDesciption", type: "text", width: "16%" },
            { title: res.App_Certified, name: "statusDesciption", type: "text", width: "17%" },
        ];
        BindStatisticGridData();
    }
    function BindStatisticGridData() {
        debugger
        var startDate = txtStartDate.value;
        var endDate = txtEndDate.value;
        var customerId = 0;
        var status = 0;
        var ddlSalesmanFilterValue = 0;
        var IsCash: number = 0;

        if (ddlCustomer.value != "null") {
            customerId = Number(ddlCustomer.value.toString());
        }

        if (ddlSalesmanFilter.value != "null") {
            ddlSalesmanFilterValue = Number(ddlSalesmanFilter.value.toString());
        }
        if (ddlStateType.value != "null") {
            status = Number(ddlStateType.value.toString());
        }
        if (Number(ddlInvoiceType.value) == 0) {
            IsCash = 0;
        } else if (Number(ddlInvoiceType.value) == 1) {
            IsCash = 1;
        } else {
            IsCash = 2;
        }

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetAllSlsInvoiceReviewStatistic"),
            data: { CompCode: compcode, BranchCode: BranchCode, IsCash: IsCash, StartDate: startDate, EndDate: endDate, Status: status, CustId: customerId, SalesMan: ddlSalesmanFilterValue, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {//(int CompCode, string StartDate, string EndDate, int Status, int? CustId, string SalesUser, string UserCode, string Token)
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    SlsInvoiceStatisticsDetails = result.Response as Array<IQ_GetSlsInvoiceStatistic>;

                    Search_FromNum_TONum();





                    for (let i = 0; i < SlsInvoiceStatisticsDetails.length; i++) {
                        SlsInvoiceStatisticsDetails[i].TrDate = DateFormat(SlsInvoiceStatisticsDetails[i].TrDate.toString());
                        SlsInvoiceStatisticsDetails[i].statusDesciption = SlsInvoiceStatisticsDetails[i].Status == 1 ? (lang == "ar" ? "معتمد" : "A certified") : (lang == "ar" ? "غير معتمد" : "Not supported");
                        SlsInvoiceStatisticsDetails[i].IsCashDesciption = SlsInvoiceStatisticsDetails[i].IsCash == true ? (lang == "ar" ? "نقدي" : "Cash") : (lang == "ar" ? "علي الحساب" : "On account");
                    }
                    Grid.DataSource = SlsInvoiceStatisticsDetails;
                    Grid.Bind();
                }
            }
        });
    }
    function Search_FromNum_TONum() {
        let fromNum = Number($('#fromNum').val());
        let ToNum = Number($('#ToNum').val());
        $("#divGridDetails").jsGrid("option", "pageIndex", 1);
        if (fromNum < ToNum && fromNum >= 0) {
            SlsInvoiceStatisticsDetails = SlsInvoiceStatisticsDetails.filter(x => x.TrNo >= fromNum && x.TrNo <= ToNum)
        }
        if (fromNum > 0 && ToNum == 0) {
            SlsInvoiceStatisticsDetails = SlsInvoiceStatisticsDetails.filter(x => x.TrNo >= fromNum)
        }
        if (fromNum == 0 && ToNum > fromNum) {
            SlsInvoiceStatisticsDetails = SlsInvoiceStatisticsDetails.filter(x => x.TrNo <= ToNum)
        }
        if (fromNum >= ToNum) {
            ToNum = 0;
            $('#ToNum').val('0');
            SlsInvoiceStatisticsDetails = SlsInvoiceStatisticsDetails.filter(x => x.TrNo >= fromNum)
        }
        if (fromNum < 0) {
            fromNum = 0;
            $('#fromNum').val('0')
        }
        if (ToNum < 0) {
            ToNum = 0;
            $('#ToNum').val('0')
        }

    }
    function Grid_RowDoubleClicked() {
        Show = true;//   ////
        $("#btnUpdate").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        $("#DivInvoiceDetails").removeClass("display_none");
        clear();
        InvoiceStatisticsModel = new Array<IQ_GetSlsInvoiceStatistic>();
        Selecteditem = new Array<IQ_GetSlsInvoiceStatistic>();

        Selecteditem = SlsInvoiceStatisticsDetails.filter(x => x.InvoiceID == Number(Grid.SelectedKey));
        try {
            GlobalinvoiceID = Number(Selecteditem[0].InvoiceID);

        } catch (e) {
            Selecteditem = SlsInvoiceStatisticsDetails.filter(x => x.InvoiceID == Number(invoiceID));
            GlobalinvoiceID = Number(Selecteditem[0].InvoiceID);
        }
        InvoiceStatisticsModel = Selecteditem;

        if (InvoiceStatisticsModel[0].InvoiceTransCode != 1) {
            $('#btndiv_2').addClass('display_none');
        } else {
            $('#btndiv_2').removeClass('display_none');
        }
        if (InvoiceStatisticsModel.length) {
            txtItemCount.value = InvoiceStatisticsModel[0].Line_Count.toString();
            txtPackageCount.value = InvoiceStatisticsModel[0].Tot_Qty.toString();
            txtTotal.value = InvoiceStatisticsModel[0].TotalAmount.toString();
            txtTax.value = InvoiceStatisticsModel[0].VatAmount.toString();
            txtNet.value = InvoiceStatisticsModel[0].NetAfterVat == null ? '' : InvoiceStatisticsModel[0].NetAfterVat.toString();
            txtDiscountValue.value = InvoiceStatisticsModel[0].RoundingAmount.toString();
            txt_Remarks.value = InvoiceStatisticsModel[0].Remark.toString();
            $('#txtPriceshow').val(InvoiceStatisticsModel[0].PurchaseorderNo);
            ComputeTotals();
            GlobalinvoiceID = InvoiceStatisticsModel[0].InvoiceID;
            lblInvoiceNumber.value = InvoiceStatisticsModel[0].TrNo.toString();
            txtInvoiceDate.value = DateFormat(InvoiceStatisticsModel[0].TrDate.toString());
            StoreID = Selecteditem[0].StoreId
            if (InvoiceStatisticsModel[0].CustomerId != null) {

                CustomerId = InvoiceStatisticsModel[0].CustomerId;

                $('#txtCustomerCode').prop("value", InvoiceStatisticsModel[0].CustomerCODE);
                $('#txtInvoiceCustomerName').prop("value", InvoiceStatisticsModel[0].CustomerName);
                $('#txtCustomerMobile').prop("value", InvoiceStatisticsModel[0].CustomerMobileNo);
            } else {
                $('#txtInvoiceCustomerName').prop("value", InvoiceStatisticsModel[0].CustomerName);
                $('#txtCustomerMobile').prop("value", InvoiceStatisticsModel[0].CustomerMobileNo);
                $('#txtCustomerCode').prop("value", "");
                CustomerId = 0;




            }



            var ddlSalesmanValue = InvoiceStatisticsModel[0].SalesmanId.toString();
            $('#ddlSalesman').prop("value", ddlSalesmanValue);

            if (InvoiceStatisticsModel[0].Status == 1) {
                chkActive.checked = true;
                chkPreivilegeToEditApprovedInvoice();
            } else {
                chkActive.checked = false;
                btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT;
                chkActive.disabled = true;
            }
            if (InvoiceStatisticsModel[0].IsCash == true) {
                $('#ddlType').prop("value", "1");

                $("#Div_Money").removeClass("display_none");
                $('#ddlCashBox').val(InvoiceStatisticsModel[0].CashBoxID);
                $('#txtCardMoney').val(InvoiceStatisticsModel[0].CardAmount);
                $('#txtCashMoney').val(InvoiceStatisticsModel[0].CashAmount);
                //if (InvoiceStatisticsModel[0].CashBoxID != null && InvoiceStatisticsModel[0].CashBoxID != 0) {

                //}
                //else {
                //    $("#Div_Money").addClass("display_none");
                //    $('#ddlCashBox').val(InvoiceStatisticsModel[0].CashBoxID == null ? 'null' : InvoiceStatisticsModel[0].CashBoxID);
                //}

                TypeFlag = true;
            } else {
                $('#ddlType').prop("value", "0");
                $('#ddlCashBox').prop('selectedIndex', 0);
                $('#ddlCashBox').attr('disabled', 'disabled');

                $("#Div_Money").addClass("display_none");

                TypeFlag = false;
            }

            $('#divCreationPanel').removeClass("display_none");

            $('#txtCreatedBy').prop("value", InvoiceStatisticsModel[0].CreatedBy);
            $('#txtCreatedAt').prop("value", InvoiceStatisticsModel[0].CreatedAt);

            $('#txtUpdatedBy').prop("value", InvoiceStatisticsModel[0].UpdatedBy);
            $('#txtUpdatedAt').prop("value", InvoiceStatisticsModel[0].UpdatedAt);
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetSlsInvoiceItem"),
            data: { invoiceID: GlobalinvoiceID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {//(int CompCode, string StartDate, string EndDate, int Status, int? CustId, string SalesUser, string UserCode, string Token)
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    SlsInvoiceItemsDetails = result.Response as Array<IQ_GetSlsInvoiceItem>;
                    for (let i = 0; i < SlsInvoiceItemsDetails.length; i++) {
                        BuildControls(i);
                        Display_GridConrtol(i);
                    }
                    CountGrid = SlsInvoiceItemsDetails.length;
                    CountItems = SlsInvoiceItemsDetails.length;
                }
            }
        });
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");
        $("#div_btnPrint").removeClass("display_none");
        $("#ddlSalesman").attr("disabled", "disabled");
        $("#txtCashMoney").attr("disabled", "disabled");
        $("#txtCardMoney").attr("disabled", "disabled");
        $("#txtPriceshow").attr("disabled", "disabled");
        $("#txtInvoiceCustomerName").attr("disabled", "disabled");
        $("#btnpriceSrch").removeAttr("disabled");
        $("#btnOrderSrch").attr("disabled", "disabled");

        ddlSalesman.disabled = true;

        txtInvoiceDate.disabled = true;
        btnCustomerSrch.disabled = true;
        btnpriceSrch.disabled = true;
        txtCustomerCode.disabled = true;
        txtCustomerMobile.disabled = true;

        ddlSalesman.disabled = true;
        ddlType.disabled = true;
        txt_Remarks.disabled = true;
        txtDiscountValue.disabled = true;
        ddlStore.disabled = true;


        if (InvoiceStatisticsModel[0].Status == 1) {
            if (!SysSession.CurrentPrivileges.CUSTOM2) {
                AutherizeFlag = false;
                $("#btnUpdate").addClass("display_none");
            } else {
                AutherizeFlag = true;
                $("#btnUpdate").removeClass("display_none");

            }
        }
        DocumentActions.RenderFromModel(InvoiceStatisticsModel[0]);

        $('#txtContract_NO').val(InvoiceStatisticsModel[0].ContractNo);
        $('#txtPurchase_order_No').val(InvoiceStatisticsModel[0].PurchaseorderNo);
        $('#txtTerms_of_Payment').val(InvoiceStatisticsModel[0].TaxNotes);

        var DeliveryDate: string = DateFormat(InvoiceStatisticsModel[0].DeliveryDate);
        $('#txtDate_of_supply').val(DeliveryDate);

        var DeliveryEndDate: string = DateFormat(InvoiceStatisticsModel[0].DeliveryEndDate);
        $('#txtSupply_end_Date').val(DeliveryEndDate);


        NewAdd = false;
        btndiv_1_onclick();

        //let commissionprc = Number($('option:selected', $("#ddlStore")).attr('commissionprc'));
        //$('#txtCommission').val(((Number(txtNet.value) * commissionprc) / 100));
        $('#txtCommission').val(InvoiceStatisticsModel[0].CommitionAmount);
    }
    //------------------------------------------------------ Controls Grid Region------------------------
    function BuildControls(cnt: number) {
        var html;


        html = '<div id= "No_Row' + cnt + '" class="container-fluid style_border" > <div class="row " > <div class="col-lg-12" > ' +

            '<span id="btn_minus' + cnt + '" class="fa fa-minus-circle fontitm3SlsTrSalesManager2 display_none"></span>' +

            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0" style="width: 4%;">' +
            '<input id="txtSerial' + cnt + '" type="text" class="form-control input-sm input-sm right2" disabled /></div>' +

            '<input id="InvoiceItemID' + cnt + '" type="hidden" class="form-control input-sm right2 display_none"  />' +

            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0" style="width: 11%;">' +
            '<button type="button" class="col-lg-3 src-btn  " id="btnSearchService' + cnt + '" name="ColSearch">   ' +
            '<i class="fa fa-search  "></i></button>' +
            '<input id="txtServiceCode' + cnt + '" name=""   type="text" class="col-lg-9 form-control input-sm  text_Display  " />' +
            '</div>' +
            '<div class="col-lg-3 col-md-3 col-sm-3 col-xl-3 col-xs-3 p-0">' +
            '<input id="txtServiceName' + cnt + '" name="FromDate"   type="text" class="form-control input-sm  text_Display" /></div>' +

            '<div class=" col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0">' +
            '<select id="ddlTypeuom' + cnt + '" class="form-control input-sm"   style="width: 100%;border-radius: 30px;"><option value="null">الوحده</option></select> </div>' +

            '<div class=" col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0"><input type="number" id="txtQuantity' + cnt + '" name="quant[1]" class="form-control input-sm   font1" value="1" min="1" max="1000" step="1"></div>' +

            '<div class=" col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0"><input type="text"  disabled class="form-control input-sm" id="txtReturnQuantity' + cnt + '" name="quant[3]" class="form-control input-sm   font1" value="0" min="0" max="1000" step="1"></div>' +

            '<div class=" col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0"  ><input type="number"  id="txtPrice' + cnt + '" name="quant[2]" class="form-control input-sm   font1" value="1" min="0" max="1000" step="0.5"></div>' +

            '<div class=" col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0"  ><input type="number"  id="txtDiscountPrc' + cnt + '" name="quant[2]" class="form-control input-sm   font1" value="0" min="0" max="1000" step="0.5"></div>' +

            '<div class=" col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0"  ><input type="number"  id="txtDiscountAmount' + cnt + '" name="quant[2]" class="form-control input-sm   font1" value="0" min="0" max="1000" step="0.5"></div>' +

            '<div class=" col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0"  ><input type="number" disabled id="txtNetUnitPrice' + cnt + '" name="quant[2]" class="form-control input-sm   font1" value="0" min="0" max="1000" step="0.5"></div>' +

            '<div class="col-lg-6 col-md-6 col-sm-6 col-xl-6 col-xs-6 div_gridcontrol_slsmanger_ts">' +

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

        if (flagprice == 1) {

            let ItemCode = PriceInvitemsDetails[cnt].it_itemCode;
            let ItemID = PriceInvitemsDetails[cnt].ItemID;
            let Storeid = ddlStore.value;
            let Mode = InvoiceType;
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("StkDefItemType", "GetItemByCode"),
                data: {
                    CompCode: compcode, FinYear: Finyear, ItemCode: ItemCode, ItemID: ItemID, storeid: Storeid, Mode: Mode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                },
                success: (d) => {
                    let result = d as BaseResponse;
                    if (result.IsSuccess) {
                        let GetItemInfo = result.Response as Array<Iproc_GetItemInfo_Result>;
                        if (GetItemInfo.length > 0) {

                            $('#ddlTypeuom' + cnt + '').html('');
                            for (var i = 0; i < GetItemInfo.length; i++) {
                                $('#ddlTypeuom' + cnt + '').append('<option value="' + GetItemInfo[i].uomid + '">' + (lang == "ar" ? GetItemInfo[i].u_DescA : GetItemInfo[i].u_DescE) + '</option>');
                            }
                        }
                    }
                }

            });
        }

        //Search Region
        //// First Search
        $('#btnSearchService' + cnt).click(function (e) {
            let sys: SystemTools = new SystemTools();
            let GetItemInfo: Array<Iproc_GetItemInfo_Result> = new Array<Iproc_GetItemInfo_Result>();
            NumCnt = cnt;
            var Storeid = Number($("#ddlStore").val());
            sys.ShowItems(Number(SysSession.CurrentEnvironment.BranchCode), Storeid, $('#txtServiceName' + cnt).val(), $('#txtServiceCode' + cnt).val(), InvoiceType, () => {
                let id = sysInternal_Comm.Itemid;

                if (!validationitem(id, Number($("#txt_ItemID" + NumCnt + "").val()))) return

                $("#txt_ItemID" + NumCnt + "").val(id);
                let ItemCode = '';
                let ItemID = id;
                let Mode = InvoiceType;
                Ajax.Callsync({
                    type: "Get",
                    url: sys.apiUrl("StkDefItemType", "GetItemByCode"),
                    data: {
                        CompCode: compcode, FinYear: Finyear, ItemCode: ItemCode, ItemID: ItemID, storeid: Storeid, Mode: Mode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                    },
                    success: (d) => {
                        let result = d as BaseResponse;
                        if (result.IsSuccess) {
                            GetItemInfo = result.Response as Array<Iproc_GetItemInfo_Result>;
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

                                Tax_Rate = GetItemInfo[0].VatPrc;
                                Tax_Type_Model = GetVat(GetItemInfo[0].VatNatID, Tax_Rate, vatType);

                                Tax_Rate = Tax_Type_Model.Prc
                                VatPrc = Tax_Rate;
                                $("#txtTax_Rate" + NumCnt).attr('Data-VatNatID', Tax_Type_Model.Nature);

                                $('#txtServiceName' + NumCnt + '').attr('disabled', 'disabled');
                                $('#txtServiceCode' + NumCnt + '').attr('disabled', 'disabled');

                                totalRow(NumCnt);

                            }
                            else {
                                $('#ddlTypeuom' + NumCnt + '').append('<option value="null">اختر الوحده</option>');
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
            let GetItemInfo1: Array<Iproc_GetItemInfo_Result> = new Array<Iproc_GetItemInfo_Result>();

            NumCnt = cnt;
            var Storeid = Number($("#ddlStore").val());
            let ItemCode = $("#txtServiceCode" + cnt).val();
            let ItemID = 0;
            let Mode = InvoiceType;
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("StkDefItemType", "GetItemByCode"),
                data: {
                    CompCode: compcode, FinYear: Finyear, ItemCode: ItemCode, ItemID: ItemID, storeid: Storeid, Mode: Mode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                },
                success: (d) => {
                    let result = d as BaseResponse;
                    if (result.IsSuccess) {
                        GetItemInfo1 = result.Response as Array<Iproc_GetItemInfo_Result>;
                        if (GetItemInfo1.length > 0) {
                            //alert(NumCnt);
                            $("#txt_ItemID" + NumCnt + "").val(GetItemInfo1[0].ItemID);

                            if (!validationitem(Number($("#txt_ItemID" + NumCnt + "").val()), 0)) {
                                $("#txt_ItemID" + NumCnt + "").val("");
                                $("#txtServiceCode" + NumCnt + "").val("");
                                return
                            }

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

                            Tax_Rate = Tax_Type_Model.Prc
                            VatPrc = Tax_Rate;
                            $("#txtTax_Rate" + NumCnt).attr('Data-VatNatID', Tax_Type_Model.Nature);


                            $('#txtServiceName' + NumCnt + '').attr('disabled', 'disabled');
                            $('#txtServiceCode' + NumCnt + '').attr('disabled', 'disabled');

                            totalRow(NumCnt);

                        }
                        else {


                            DisplayMassage("كود الصنف غير صحيح ", "Wrong service code ", MessageType.Error);
                            $('#ddlTypeuom' + NumCnt + '').append('<option value="null">اختر الوحده</option>');
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

            let Typeuom = $("#ddlTypeuom" + cnt);
            let UnitPrice = $('option:selected', Typeuom).attr('data-UnitPrice');

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

            let Typeuom = $("#ddlTypeuom" + cnt);
            let OnhandQty = $('option:selected', Typeuom).attr('data-OnhandQty');

            if (Number(txtQuantityValue) > Number(OnhandQty)) {

                DisplayMassage(" لا يمكن تجاوز الكميه المتاحه  " + OnhandQty + " ", "Please select a customer", MessageType.Worning);
                $("#txtQuantity" + cnt).val(OnhandQty);
                Errorinput($("#txtQuantity" + cnt));
            }

            totalRow(cnt);

        });

        $("#txtPrice" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

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


            let txtPrice = Number($("#txtPrice" + cnt).val());
            let txtDiscountPrc = Number($("#txtDiscountPrc" + cnt).val());

            $("#txtDiscountAmount" + cnt).val(((txtDiscountPrc * txtPrice) / 100).toFixed(2));

            $("#txtNetUnitPrice" + cnt).val((txtPrice - ((txtDiscountPrc * txtPrice) / 100)));



            ComputeTotals();

        });

        $("#txtDiscountPrc" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            totalRow(cnt);

        });
        $("#txtDiscountAmount" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");


            let txtPrice = Number($("#txtPrice" + cnt).val());
            let txtDiscountAmount = Number($("#txtDiscountAmount" + cnt).val());

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
        flagprice = 0;
        return;
    }
    function totalRow(cnt: number) {
        let txtPrice = Number($("#txtPrice" + cnt).val());
        let txtDiscountPrc = Number($("#txtDiscountPrc" + cnt).val());

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


        filldlltypeuom(cnt);

        $('#ddlTypeuom' + cnt + '').val(SlsInvoiceItemsDetails[cnt].UomID == null ? 'null' : SlsInvoiceItemsDetails[cnt].UomID);



        //$('#ddlTypeuom' + cnt + '').html('');
        //$('#ddlTypeuom' + cnt + '').append('<option  data-OnhandQty="' + SlsInvoiceItemsDetails[cnt].StockSoldQty + '" data-UnitPrice="' + SlsInvoiceItemsDetails[cnt].Unitprice + '" data-MinPrice=" " data-Rate=" " value="' + SlsInvoiceItemsDetails[cnt].UomID + '">' + (lang == "ar" ? SlsInvoiceItemsDetails[cnt].Uom_DescA : SlsInvoiceItemsDetails[cnt].Uom_DescE) + '</option>');




    }
    function filldlltypeuom(cnt: number) {


        var Storeid = Number($("#ddlStore").val());
        let ItemCode = '';
        let ItemID = SlsInvoiceItemsDetails[cnt].ItemID;
        let Mode = InvoiceType;
        let GetItemInfo: Array<Iproc_GetItemInfo_Result> = new Array<Iproc_GetItemInfo_Result>();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetItemByCode"),
            data: {
                CompCode: compcode, FinYear: Finyear, ItemCode: ItemCode, ItemID: ItemID, storeid: Storeid, Mode: Mode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    GetItemInfo = result.Response as Array<Iproc_GetItemInfo_Result>;
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
    function validationitem(id: number, idRow: number) {

        for (var i = 0; i < CountGrid; i++) {
            debugger
            if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m") {
                if ($("#txt_ItemID" + i + "").val() == id && $("#txt_ItemID" + i + "").val() != idRow) {
                    DisplayMassage("الصنف موجود من قبل", "Item found before", MessageType.Error);
                    Errorinput($("#txtServiceName" + i + ""));
                    return false
                }
            }

        }
        return true;
    }
    function DeleteRow(RecNo: number) {
        if (!SysSession.CurrentPrivileges.Remove) return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => {
            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d');
            CountItems = CountItems - 1;
            ComputeTotals();
            Insert_Serial();

            txtItemCount.value = CountItems.toString();
            $("#ddlFamily" + RecNo).val("99");
            $("#ddlItem" + RecNo).val("99");
            $("#txtQuantity" + RecNo).val("99");
            $("#txtPrice" + RecNo).val("199");
            $("#txtUnitpriceWithVat" + RecNo).val("199");
            $("#No_Row" + RecNo).attr("hidden", "true");
        });
    }
    function AddNewRow() {


        //if (ddlType.value == "0" && CustomerId == 0) {//علي الحساب  
        //    DisplayMassage(" برجاء اختيار العميل", "Please select a customer", MessageType.Worning);
        //    Errorinput(btnCustomerSrch);
        //    return false
        //}

        if (InvoiceType == 1) {       //Retail  
            if ((CustomerId == 0 || txtCustomerCode.value.trim() == "") && SysSession.CurrentEnvironment.RetailInvoiceTransCode == 1) {
                DisplayMassage(" برجاء اختيار العميل", "Please select a customer", MessageType.Worning);
                Errorinput(btnCustomerSrch);
                return false
            }
        }
        if (InvoiceType == 2) {  //Wholesale   
            if (CustomerId == 0 && SysSession.CurrentEnvironment.WholeInvoiceTransCode == 1) {
                DisplayMassage(" برجاء اختيار العميل", "Please select a customer", MessageType.Worning);
                Errorinput(btnCustomerSrch);
                return false
            }
        }
        if (ddlStore.value == 'null') {
            DisplayMassage(" برجاء اختيار المستودع", "Please select a customer", MessageType.Worning);
            Errorinput(ddlStore);
            return false
        }



        if (!SysSession.CurrentPrivileges.AddNew) return;
        var CanAdd: boolean = true;
        if (CountGrid > 0) {
            for (var i = 0; i < CountGrid; i++) {
                CanAdd = Validation_Grid(i);
                if (CanAdd == false) {
                    break;
                }
            }
        }
        if (CanAdd) {
            CountItems = CountItems + 1;
            txtItemCount.value = CountItems.toString();
            BuildControls(CountGrid);
            $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode 
            $("#ddlFamily" + CountGrid).removeAttr("disabled");
            $("#ddlItem" + CountGrid).removeAttr("disabled");
            $("#txtQuantity" + CountGrid).removeAttr("disabled");
            $("#txtPrice" + CountGrid).removeAttr("disabled");

            $("#txtReturnQuantity" + CountGrid).attr("disabled", "disabled");
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");
            CountGrid++;
            Insert_Serial();

            if (flag_PriceWithVAT == true) {

                $("#txtUnitpriceWithVat" + CountGrid).removeAttr("disabled");
                $("#txtPrice" + CountGrid).attr("disabled", "disabled");

            } else {
                $("#txtPrice" + CountGrid).removeAttr("disabled");
                $("#txtUnitpriceWithVat" + CountGrid).attr("disabled", "disabled");
            }
        }
    }
    function ComputeTotals() {
        PackageCount = 0;
        CountTotal = 0;
        let TotalDiscount = 0;
        let Totalbefore = 0;
        TaxCount = 0;
        NetCount = 0;
        for (let i = 0; i < CountGrid; i++) {
            var flagvalue = $("#txt_StatusFlag" + i).val();
            if (flagvalue != "d" && flagvalue != "m") {
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
                
                //NetCount = Number(NetCount.toFixed(2).toString());
                //NetCount = (Number(NetCount.toFixed(2)) - Number(txtDiscountValue.value));

            }
        }
        debugger
        txtItemCount.value = CountItems.toString();
        txtPackageCount.value = PackageCount.toString();
        txtTotalDiscount.value = TotalDiscount.toString();
        txtTotalbefore.value = Totalbefore.toString();
        txtTotal.value = CountTotal.toString();
        txtTax.value = TaxCount.toString();
        txtNet.value = (Number(NetCount.toFixed(2)) - Number(txtDiscountValue.value)).toFixed(2);
        let commissionprc = Number($('option:selected', $("#ddlStore")).attr('commissionprc'));
        $('#txtCommission').val(((Number(txtNet.value) * commissionprc) / 100));             
       
    }
    function Insert_Serial() {

        let Ser = 1;
        for (let i = 0; i < CountGrid; i++) {
            var flagvalue = $("#txt_StatusFlag" + i).val();
            if (flagvalue != "d" && flagvalue != "m") {
                $("#txtSerial" + i).val(Ser);
                Ser++;
            }
        }

    }
    //------------------------------------------------------ Search && Clear &&Validation  Region ------------------------
    function _SearchBox_Change() {
        //  k//////

        if (searchbutmemreport.value != "") {

            let search: string = searchbutmemreport.value.toLowerCase();
            SearchDetails = SlsInvoiceStatisticsDetails.filter(x => x.TrNo.toString().search(search) >= 0 || x.CustomerName.toLowerCase().search(search) >= 0
                || x.Slsm_DescA.toLowerCase().search(search) >= 0 || x.Slsm_DescE.toLowerCase().search(search) >= 0 /*|| x.PortName.toLowerCase().search(search) >= 0*/
              /*  || x.CustomerCODE.toString().search(search) >= 0  || x.CreditLimit.toString().search(search) >= 0 || x.Emp_NameA.toString().search(search) >= 0
                || x.ContactMobile.toString().search(search) >= 0 /*|| x.DueAmount.toString().search(search) >= 0 *//*|| x.DaysDiff.toString().search(search) >= 0*/);

            Grid.DataSource = SearchDetails;
            Grid.Bind();
        } else {
            Grid.DataSource = SlsInvoiceStatisticsDetails;
            Grid.Bind();
        }
    }
    function ValidationHeader() {

        debugger
        if (InvoiceType == 1) {       //Retail  
            if ((CustomerId == 0 && txtCustomerCode.value.trim() == "") && SysSession.CurrentEnvironment.RetailInvoiceTransCode == 1) {
                DisplayMassage(" برجاء اختيار العميل", "Please select a customer", MessageType.Worning);
                Errorinput(btnCustomerSrch);
                return false
            }
        }
        if (InvoiceType == 2) {  //Wholesale   
            if (CustomerId == 0 && SysSession.CurrentEnvironment.WholeInvoiceTransCode == 1) {
                DisplayMassage(" برجاء اختيار العميل", "Please select a customer", MessageType.Worning);
                Errorinput(btnCustomerSrch);
                return false
            }
        }
        if (ddlSalesman.value == "null") {
            DisplayMassage(" برجاء اختيار المندوب", "Please select a Salesman", MessageType.Error);

            Errorinput(ddlSalesman);
            return false
        }
        if (ddlStore.value == "null" && NewAdd == true) {
            DisplayMassage(" برجاء اختيار المستودع", "Please select a Store", MessageType.Error);
            Errorinput(ddlStore);
            return false
        }
        if (txtInvoiceDate.value == "") {
            DisplayMassage(" برجاء ادخال التاريخ", "Please select a Date", MessageType.Error);
            Errorinput(txtInvoiceDate);
            return false
        }
        if (CountGrid == 0) {
            DisplayMassage(" برجاء ادخال بيانات الفاتورة", "Please select a Invoice data", MessageType.Error);

            Errorinput(btnAddDetails);
            return false
        }
        if (txtItemCount.value == '0') {
            DisplayMassage(" برجاء ادخال بيانات الفاتورة", "Please select a Invoice data", MessageType.Error);
            Errorinput(btnAddDetails);
            return false
        }
        if ((Number($('#txtCardMoney').val()) == 0 || Number($('#txtCashMoney').val()) == 0) && ddlType.value == '1') {

            let card = Number($('#txtCardMoney').val());
            let Cash = Number($('#txtCashMoney').val());
            let Net = card + Cash;
            if (Net != Number($('#txtNet').val())) {
                DisplayMassage("يجب المبلغ المسدد يساوي الصاف ييجب ان يكون مجموع المبلغ المسدد بالكارت مع المسدد نقدا مساويا لصافي الفاتورة", "The amount paid should be equal to the net", MessageType.Worning);
                Errorinput($('#txtNet'));
                if ($('#txtCardMoney').val().trim() != '') {
                    Errorinput($('#txtCardMoney'));

                }
                if ($('#txtCashMoney').val().trim() != '') {
                    Errorinput($('#txtCashMoney'));

                }
                return false
            }

        }
        return true;
    }
    function Validation_Grid(rowcount: number) {

        var Qty: number = Number($("#txtQuantity" + rowcount).val());
        var Price: number = Number($("#txtPrice" + rowcount).val());
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        } else {

            if ($("#txt_ItemID" + rowcount).val() == "" || $("#txt_ItemID" + rowcount).val() == "0" || $("#txt_ItemID" + rowcount).val() == null) {
                DisplayMassage(" برجاء ادخال الصنف", "Please enter the type", MessageType.Error);
                Errorinput($("#btnSearchService" + rowcount));
                Errorinput($("#txtServiceCode" + rowcount));
                return false
            }

            else if ($("#txtServiceCode" + rowcount).val() == "") {
                DisplayMassage(" برجاء ادخال الكود", "Please enter the type", MessageType.Error);
                Errorinput($("#txtServiceCode" + rowcount));
                return false
            }
            else if (Qty == 0) {
                DisplayMassage(" برجاء ادخال الكمية المباعة", "Please enter the Quantity sold", MessageType.Error);
                Errorinput($("#txtQuantity" + rowcount));
                return false
            }
            else if (Price == 0) {
                DisplayMassage(" برجاء ادخال السعر", "Please enter the Price", MessageType.Error);
                Errorinput($("#txtPrice" + rowcount));
                Errorinput($("#txtUnitpriceWithVat" + rowcount));
                return false
            }
            return true;
        }
    }
    function clear() {
        $('#div_Data').html("");
        CountGrid = 0;
        $('#txt_Tax_Discount').val("0");
        $('#txt_Tax_total_Discount').val("0");
        $('#txt_Tax_total_AfterDiscount').val("0");
        $('#txt_Tax_Vat').val("0");
        $('#txt_Tax_AfterTotalVAT').val("0");
        $('#txtPriceshow').val("");


        $("#txt_Tax_Discount").attr("disabled", "disabled");
        $("#txt_Tax_total_Discount").attr("disabled", "disabled");
        $("#txt_Tax_total_AfterDiscount").attr("disabled", "disabled");
        $("#txtContract_NO").attr("disabled", "disabled");
        $("#txtPurchase_order_No").attr("disabled", "disabled");
        $("#txtDate_of_supply").attr("disabled", "disabled");
        $("#txtSupply_end_Date").attr("disabled", "disabled");
        $("#txtTerms_of_Payment").attr("disabled", "disabled");
        $("#txtPriceshow").attr("disabled", "disabled");
    }
    //------------------------------------------------------ Get Functions  Region------------------------     
    function GetVatPercentage() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenVatType", "GetVatPercentage"),
            data: {
                CompCode: compcode, VatType: vatType, Type: 1, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    AD_VatTypeDetails = result.Response as A_D_VAT_TYPE;
                    VatPrc = AD_VatTypeDetails.VatPerc;
                }
            }
        });
    }
    //------------------------------------------------------ main Functions  Region------------------------
    function Assign() {
        List_MinUnitPrice = new Array<I_Sls_TR_InvoiceItems>();
        var StatusFlag: String;
        InvoiceModel = new I_Sls_TR_Invoice();
        InvoiceItemsDetailsModel = new Array<I_Sls_TR_InvoiceItems>();


        InvoiceModel.CustomerId = CustomerId == 0 ? null : CustomerId;
        InvoiceModel.CompCode = Number(compcode);
        InvoiceModel.BranchCode = Number(BranchCode);
        var InvoiceNumber = Number(lblInvoiceNumber.value);
        InvoiceModel.TrNo = InvoiceNumber;

        if (NewAdd != true) {     //update
            InvoiceModel.CreatedAt = InvoiceStatisticsModel[0].CreatedAt;
            InvoiceModel.CreatedBy = InvoiceStatisticsModel[0].CreatedBy;

            InvoiceModel.SlsInvType = InvoiceStatisticsModel[0].SlsInvType //  retail      or WholeSale

            InvoiceModel.DocNo = InvoiceStatisticsModel[0].DocNo
            InvoiceModel.DocUUID = InvoiceStatisticsModel[0].DocUUID
            InvoiceModel.TrTime = InvoiceStatisticsModel[0].TrTime

            //InvoiceModel.PaymentMeansTypeCode = InvoiceStatisticsModel[0].PaymentMeansTypeCode //  Cash or   Credit
        }
        else {                  //insert
            InvoiceModel.SlsInvType = InvoiceType //  retail  or WholeSale      

            //if (InvoiceType == 1) {       //Retail  
            //    InvoiceModel.PaymentMeansTypeCode = SysSession.CurrentEnvironment.RetailInvoicePayment//  retail 
            //}
            //else if (InvoiceType == 2) {  //Wholesale   
            //    InvoiceModel.PaymentMeansTypeCode = SysSession.CurrentEnvironment.WholeInvoicePayment//  Wholesale   
            //}
            //else {                        //Both
            //    InvoiceModel.PaymentMeansTypeCode = 3
            //}

        }


        InvoiceModel.TrType = 0//0 invoice 1 return
        InvoiceModel.SlsInvSrc = 1   // 1 from store 2 from van  
        InvoiceModel.StoreId = $('#ddlStore').val();//main store
        InvoiceModel.PaymentMeansTypeCode = ddlType.value == '0' ? 2 : 1; //  Cash or   Credit  
        
        

        InvoiceModel.RefTrID = null;
        ///////////////
        debugger
        InvoiceModel.InvoiceID = GlobalinvoiceID;
        InvoiceModel.SalesmanId = Number(ddlSalesman.value);
        InvoiceModel.StoreId = Number(ddlStore.value);
        InvoiceModel.NetAfterVat = Number(txtNet.value) - Number(txtDiscountValue.value);
        InvoiceModel.ItemDiscountTotal = Number(txtTotalDiscount.value);
        InvoiceModel.TotalAmount = Number(txtTotal.value);
        InvoiceModel.TrDate = txtInvoiceDate.value;
        InvoiceModel.CustomerName = txtInvoiceCustomerName.value;
        InvoiceModel.CustomerMobileNo = txtCustomerMobile.value;  
        InvoiceModel.Remark = txt_Remarks.value;
        InvoiceModel.VatType = vatType;
        InvoiceModel.VatAmount = Number(txtTax.value);
        InvoiceModel.CardAmount = $('#txtCardMoney').val().trim() == '' ? 0 : $('#txtCardMoney').val();
        InvoiceModel.CashAmount = $('#txtCashMoney').val().trim() == '' ? 0 : $('#txtCashMoney').val();
        InvoiceModel.TaxCurrencyID = Number(SysSession.CurrentEnvironment.I_Control[0].Currencyid);
        InvoiceModel.InvoiceCurrenyID = Number(SysSession.CurrentEnvironment.I_Control[0].Currencyid);
        InvoiceModel.InvoiceTypeCode = Number(SysSession.CurrentEnvironment.InvoiceTypeCode);

        if (InvoiceType == 1)
            InvoiceModel.InvoiceTransCode = SysSession.CurrentEnvironment.RetailInvoiceTransCode;
        else
            InvoiceModel.InvoiceTransCode = SysSession.CurrentEnvironment.WholeInvoiceTransCode;


        InvoiceModel.DiscountAmount = 0;
        InvoiceModel.DiscountPrc = 0;

        InvoiceModel.AllowBase = $('#txt_Tax_total_Discount').val();
        InvoiceModel.AllowPrc = $('#txt_Tax_Discount').val();
        InvoiceModel.AllowVatPrc = $('#txt_Tax_Vat').val();
        InvoiceModel.AllowAfterVat = $('#txt_Tax_AfterTotalVAT').val();

        //InvoiceModel.RoundingAmount = Number($('#txtFraction_difference').text());

        InvoiceModel.ContractNo = $('#txtContract_NO').val();
        InvoiceModel.DeliveryDate = $('#txtDate_of_supply').val();
        InvoiceModel.DeliveryEndDate = $('#txtSupply_end_Date').val();
        InvoiceModel.TaxNotes = $('#txtTerms_of_Payment').val();
        InvoiceModel.ItemTotal = Number(txtTotalbefore.value);
        InvoiceModel.RoundingAmount = Number(txtDiscountValue.value);
        InvoiceModel.PurchaseorderNo = $('#txtPriceshow').val();

        InvoiceModel.CashBoxID = null;

        if (ddlType.value == "0") {
            InvoiceModel.IsCash = false;
        } else {
            InvoiceModel.IsCash = true;
        }

        if (chkActive.checked == true) {
            InvoiceModel.Status = 1;
        } else {
            InvoiceModel.Status = 0;
        } debugger
        InvoiceModel.CommitionAmount = Number($('#txtCommission').val());
        // Details
        for (var i = 0; i < CountGrid; i++) {
            invoiceItemSingleModel = new I_Sls_TR_InvoiceItems();
            StatusFlag = $("#txt_StatusFlag" + i).val();

            invoiceItemSingleModel.Name_Item = $("#txtServiceName" + i).val();
            invoiceItemSingleModel.MinUnitPrice = Number($('option:selected', $("#ddlTypeuom" + i)).attr('data-minprice'));

            if (Number($("#txtPrice" + i).val()) < Number($('option:selected', $("#ddlTypeuom" + i)).attr('data-minprice'))) {
                List_MinUnitPrice.push(invoiceItemSingleModel);
                Validation_Insert = 1;
            }

            if (StatusFlag == "i") {
                invoiceItemSingleModel.InvoiceItemID = 0;
                invoiceItemSingleModel.ItemID = $("#txt_ItemID" + i).val();
                invoiceItemSingleModel.Serial = $("#txtSerial" + i).val();
                invoiceItemSingleModel.SoldQty = $('#txtQuantity' + i).val();
                //invoiceItemSingleModel.StockSoldQty = Number($('option:selected', $("#ddlTypeuom" + i)).attr('data-onhandqty'));//
                invoiceItemSingleModel.StockSoldQty = Number($('option:selected', $("#ddlTypeuom" + i)).attr('data-rate')) * Number($('#txtQuantity' + i).val());//
                invoiceItemSingleModel.NetUnitPrice = $("#txtNetUnitPrice" + i).val();
                invoiceItemSingleModel.Unitprice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.UnitpriceWithVat = $("#txtPrice" + i).val();
                invoiceItemSingleModel.DiscountPrc = $("#txtDiscountPrc" + i).val();
                invoiceItemSingleModel.DiscountAmount = $("#txtDiscountAmount" + i).val();
                //-----------------------------------------------------
                invoiceItemSingleModel.UomID = Number($("#ddlTypeuom" + i).val());
                invoiceItemSingleModel.UomID = Number($("#ddlTypeuom" + i).val());
                invoiceItemSingleModel.NetUnitPriceWithVat = $("#txtPrice" + i).val();
                invoiceItemSingleModel.BaseQty = 1;
                invoiceItemSingleModel.BaseQtyPrice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.BaseQtyUomid = Number($("#ddlTypeuom" + i).val());
                invoiceItemSingleModel.ChargeVatNatID = null;
                invoiceItemSingleModel.DiscountVatNatID = null;
                invoiceItemSingleModel.ChargeCode = null;
                //-----------------------------------------------------
                VatPrc = $("#txtTax_Rate" + i).val();
                let VatNatID = Number($("#txtTax_Rate" + i).attr('data-VatNatID'));
                invoiceItemSingleModel.VatPrc = VatPrc;//$("#txtTax" + i).val();
                invoiceItemSingleModel.VatNatID = VatNatID;
                invoiceItemSingleModel.VatAmount = $("#txtTax" + i).val();
                invoiceItemSingleModel.ItemTotal = invoiceItemSingleModel.Unitprice * invoiceItemSingleModel.SoldQty;
                invoiceItemSingleModel.TotRetQty = $("#txtReturnQuantity" + i).val();
                invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                InvoiceItemsDetailsModel.push(invoiceItemSingleModel);

            }
            if (StatusFlag == "u") {
                var invoiceItemId = $("#InvoiceItemID" + i).val()
                invoiceItemSingleModel.InvoiceItemID = invoiceItemId;
                invoiceItemSingleModel.ItemID = $("#txt_ItemID" + i).val();
                invoiceItemSingleModel.Serial = $("#txtSerial" + i).val();
                invoiceItemSingleModel.SoldQty = $('#txtQuantity' + i).val();
                //invoiceItemSingleModel.StockSoldQty = Number($('option:selected', $("#ddlTypeuom" + i)).attr('data-onhandqty'));//
                invoiceItemSingleModel.StockSoldQty = Number($('option:selected', $("#ddlTypeuom" + i)).attr('data-rate')) * Number($('#txtQuantity' + i).val());//
                invoiceItemSingleModel.NetUnitPrice = $("#txtNetUnitPrice" + i).val();
                invoiceItemSingleModel.Unitprice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.UnitpriceWithVat = $("#txtPrice" + i).val();
                invoiceItemSingleModel.DiscountPrc = $("#txtDiscountPrc" + i).val();
                invoiceItemSingleModel.DiscountAmount = $("#txtDiscountAmount" + i).val();
                //-----------------------------------------------------
                invoiceItemSingleModel.UomID = Number($("#ddlTypeuom" + i).val());
                invoiceItemSingleModel.NetUnitPriceWithVat = $("#txtPrice" + i).val();
                invoiceItemSingleModel.BaseQty = 1;
                invoiceItemSingleModel.BaseQtyPrice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.BaseQtyUomid = Number($("#ddlTypeuom" + i).val());
                invoiceItemSingleModel.ChargeVatNatID = null;
                invoiceItemSingleModel.DiscountVatNatID = null;
                invoiceItemSingleModel.ChargeCode = null;
                //-----------------------------------------------------
                VatPrc = $("#txtTax_Rate" + i).val();
                let VatNatID = Number($("#txtTax_Rate" + i).attr('data-VatNatID'));
                invoiceItemSingleModel.VatPrc = VatPrc;//$("#txtTax" + i).val();
                invoiceItemSingleModel.VatNatID = VatNatID;
                invoiceItemSingleModel.VatAmount = $("#txtTax" + i).val();
                invoiceItemSingleModel.ItemTotal = invoiceItemSingleModel.Unitprice * invoiceItemSingleModel.SoldQty;
                invoiceItemSingleModel.TotRetQty = $("#txtReturnQuantity" + i).val();
                invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                InvoiceItemsDetailsModel.push(invoiceItemSingleModel);
            }
            if (StatusFlag == "d") {
                if ($("#InvoiceItemID" + i).val() != "") {
                    var deletedID = $("#InvoiceItemID" + i).val();
                    invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                    invoiceItemSingleModel.InvoiceItemID = deletedID;
                    InvoiceItemsDetailsModel.push(invoiceItemSingleModel);
                }
            }
        }
        MasterDetailsModel.I_Sls_TR_Invoice = InvoiceModel;
        MasterDetailsModel.I_Sls_TR_InvoiceItems = InvoiceItemsDetailsModel;
    }
    function Update() {

        if (!CheckDate(DateFormat(txtInvoiceDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            WorningMessage('  التاريخ ليس متطابق مع تاريخ السنه (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', '  The date is not identical with the date of the year (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', "تحذير", "worning");
            return
        }
        InvoiceModel.CreatedAt = InvoiceStatisticsModel[0].CreatedAt;
        InvoiceModel.CreatedBy = InvoiceStatisticsModel[0].CreatedBy;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("SlsTrSales", "updateInvoiceMasterDetail"),
            data: JSON.stringify(MasterDetailsModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {

                    let res = result.Response as I_Sls_TR_Invoice;
                    DisplayMassage('( تم تعديل الفاتورة بنجاح )', '(The invoice has been successfully modified)', MessageType.Succeed);

                    $('#divCreationPanel').removeClass("display_none");
                    $('#txtUpdatedBy').prop("value", res.UpdatedBy);
                    $('#txtUpdatedAt').prop("value", res.UpdatedAt);
                    success();
                    IsSuccess = true;

                } else {
                    IsSuccess = false;
                    DisplayMassage("الرجاء تحديث الصفحة واعادت تكرارالمحاولة مره اخري ", "Please refresh the page and try again", MessageType.Error);
                }
            }
        });


    }
    function insert() {
        debugger
        InvoiceModel.InvoiceID = 0;





        if (!CheckDate(DateFormat(txtInvoiceDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {

            WorningMessage('  التاريخ ليس متطابق مع تاريخ السنه (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', '  The date is not identical with the date of the year (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', "تحذير", "worning");
            return
        }

        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("SlsTrSales", "InsertInvoiceMasterDetail"),
            data: JSON.stringify(MasterDetailsModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {

                    let res = result.Response as I_Sls_TR_Invoice;
                    invoiceID = res.InvoiceID;
                    DisplayMassage(" تم اصدار  فاتورة رقم  " + res.TrNo + " ", "An invoice number has been issued ", MessageType.Succeed);

                    success_insert();

                    IsSuccess = true;

                    //DownloadInvoicePdf();
                } else {
                    IsSuccess = false;

                    DisplayMassage("الرجاء تحديث الصفحة واعادت تكرارالمحاولة مره اخري", "Please refresh the page and try again", MessageType.Error);

                }
            }
        });

    }
    function success_insert() {

        NewAdd = true;
        btnBack_onclick();
        btnShow_onclick();

        $("#cotrolDiv").removeClass("disabledDiv");
        Show = true;
        $("#btnUpdate").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        $("#DivInvoiceDetails").removeClass("display_none");
        clear();
        InvoiceStatisticsModel = new Array<IQ_GetSlsInvoiceStatistic>();
        Selecteditem = new Array<IQ_GetSlsInvoiceStatistic>();
        Selecteditem = SlsInvoiceStatisticsDetails.filter(x => x.InvoiceID == Number(invoiceID));
        GlobalinvoiceID = Number(Selecteditem[0].InvoiceID);
        InvoiceStatisticsModel = Selecteditem;
        if (InvoiceStatisticsModel.length) {
            txtItemCount.value = InvoiceStatisticsModel[0].Line_Count.toString();
            txtPackageCount.value = InvoiceStatisticsModel[0].Tot_Qty.toString();
            txtTax.value = InvoiceStatisticsModel[0].VatAmount.toString();
            txtNet.value = InvoiceStatisticsModel[0].NetAfterVat.toString();
            txt_Remarks.value = InvoiceStatisticsModel[0].Remark.toString();
            $('#txtPriceshow').val(InvoiceStatisticsModel[0].PurchaseorderNo);
            txtDiscountValue.value = InvoiceStatisticsModel[0].RoundingAmount.toString();
            ComputeTotals();
            GlobalinvoiceID = InvoiceStatisticsModel[0].InvoiceID;

            lblInvoiceNumber.value = InvoiceStatisticsModel[0].TrNo.toString();
            txtInvoiceDate.value = DateFormat(InvoiceStatisticsModel[0].TrDate.toString());
            StoreID = Selecteditem[0].StoreId

            if (InvoiceStatisticsModel[0].CustomerId != null) {
                CustomerId = InvoiceStatisticsModel[0].CustomerId;

                $('#txtCustomerCode').prop("value", InvoiceStatisticsModel[0].CustomerCODE);
                $('#txtInvoiceCustomerName').prop("value", InvoiceStatisticsModel[0].CustomerName);
                $('#txtCustomerMobile').prop("value", InvoiceStatisticsModel[0].CustomerMobileNo);
            } else {
                $('#txtInvoiceCustomerName').prop("value", InvoiceStatisticsModel[0].CustomerName);
                $('#txtCustomerMobile').prop("value", InvoiceStatisticsModel[0].CustomerMobileNo);
                $('#txtCustomerCode').prop("value", "");
                CustomerId = 0;
            }

            var ddlSalesmanValue = InvoiceStatisticsModel[0].SalesmanId.toString();
            $('#ddlSalesman').prop("value", ddlSalesmanValue);
            var ddlStoreValue = InvoiceStatisticsModel[0].StoreId.toString();
            $('#ddlStore').prop("value", ddlStoreValue);

            if (InvoiceStatisticsModel[0].Status == 1) {
                chkActive.checked = true;
                chkPreivilegeToEditApprovedInvoice();
            } else {
                chkActive.checked = false;
                btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT;
                chkActive.disabled = true;
            }
            if (InvoiceStatisticsModel[0].IsCash == true) {
                $('#ddlType').prop("value", "1");
                $("#Div_Money").removeClass("display_none");
                $('#ddlCashBox').val(InvoiceStatisticsModel[0].CashBoxID);
                $('#txtCardMoney').val(InvoiceStatisticsModel[0].CardAmount);
                $('#txtCashMoney').val(InvoiceStatisticsModel[0].CashAmount);
                //if (InvoiceStatisticsModel[0].CashBoxID != null && InvoiceStatisticsModel[0].CashBoxID != 0) {

                //}
                //else {
                //    $("#Div_Money").addClass("display_none");
                //    $('#ddlCashBox').val(InvoiceStatisticsModel[0].CashBoxID == null ? 'null' : InvoiceStatisticsModel[0].CashBoxID);
                //}
                TypeFlag = true;
            } else {
                $('#ddlType').prop("value", "0");
                $('#ddlCashBox').prop('selectedIndex', 0);
                $('#ddlCashBox').attr('disabled', 'disabled');
                $('#txtPriceshow').attr('disabled', 'disabled');
                $("#Div_Money").addClass("display_none");


                TypeFlag = false;
            }

            $('#divCreationPanel').removeClass("display_none");

            $('#txtCreatedBy').prop("value", InvoiceStatisticsModel[0].CreatedBy);
            $('#txtCreatedAt').prop("value", InvoiceStatisticsModel[0].CreatedAt);

            $('#txtUpdatedBy').prop("value", InvoiceStatisticsModel[0].UpdatedBy);
            $('#txtUpdatedAt').prop("value", InvoiceStatisticsModel[0].UpdatedAt);
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetSlsInvoiceItem"),
            data: { invoiceID: GlobalinvoiceID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {//(int CompCode, string StartDate, string EndDate, int Status, int? CustId, string SalesUser, string UserCode, string Token)
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    SlsInvoiceItemsDetails = result.Response as Array<IQ_GetSlsInvoiceItem>;
                    for (let i = 0; i < SlsInvoiceItemsDetails.length; i++) {
                        BuildControls(i);
                        Display_GridConrtol(i);
                    }
                    CountGrid = SlsInvoiceItemsDetails.length;
                    CountItems = SlsInvoiceItemsDetails.length;
                }
            }
        });
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");


        $("#txtCashMoney").attr("disabled", "disabled");
        $("#txtCardMoney").attr("disabled", "disabled");
        $("#txtInvoiceCustomerName").attr("disabled", "disabled");
        $("#div_btnPrint").removeClass("display_none");

        ddlSalesman.disabled = true;
        ddlStore.disabled = true;

        txtCustomerCode.disabled = true;
        txtCustomerMobile.disabled = true;

        ddlType.disabled = true;
        txt_Remarks.disabled = true;
        txtDiscountValue.disabled = true;

        if (InvoiceStatisticsModel[0].Status == 1) {
            if (!SysSession.CurrentPrivileges.CUSTOM2) {
                AutherizeFlag = false;
                $("#btnUpdate").addClass("display_none");
            } else {
                AutherizeFlag = true;
                $("#btnUpdate").removeClass("display_none");
            }
        }
        DocumentActions.RenderFromModel(InvoiceStatisticsModel[0]);
        txtTotal.value = Selecteditem[0].TotalAmount.toString();
        txtTotalbefore.value = Selecteditem[0].ItemTotal.toString();
        NewAdd = false;
        btndiv_1_onclick();
        $("#btnCustomerSrch").attr("disabled", "disabled");
        $("#btnpriceSrch").attr("disabled", "disabled");
        $("#btnOrderSrch").attr("disabled", "disabled");
    }
    function success() {
        $("#cotrolDiv").removeClass("disabledDiv");
        BindStatisticGridData();
        Grid_RowDoubleClicked();
    }
    function open_success() {

        Show = true;//    
        $("#btnUpdate").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        $("#DivInvoiceDetails").removeClass("display_none");
        clear();
        InvoiceStatisticsModel = new Array<IQ_GetSlsInvoiceStatistic>();
        let Selecteditem
        Selecteditem = SlsInvoiceStatisticsDetails.filter(x => x.InvoiceID == Number(GlobalinvoiceID));

        InvoiceStatisticsModel = Selecteditem;
        if (InvoiceStatisticsModel.length) {
            txtItemCount.value = InvoiceStatisticsModel[0].Line_Count.toString();
            txtPackageCount.value = InvoiceStatisticsModel[0].Tot_Qty.toString();
            txtTotal.value = InvoiceStatisticsModel[0].TotalAmount.toString();
            txtTax.value = InvoiceStatisticsModel[0].VatAmount.toString();
            txtNet.value = InvoiceStatisticsModel[0].NetAfterVat.toString();
            txt_Remarks.value = InvoiceStatisticsModel[0].Remark.toString();
            $('#txtPriceshow').val(InvoiceStatisticsModel[0].PurchaseorderNo);
            txtDiscountValue.value = InvoiceStatisticsModel[0].RoundingAmount.toString();
            ComputeTotals();
            GlobalinvoiceID = InvoiceStatisticsModel[0].InvoiceID;
            lblInvoiceNumber.innerText = InvoiceStatisticsModel[0].TrNo.toString();
            txtInvoiceDate.value = DateFormat(InvoiceStatisticsModel[0].TrDate.toString());
            StoreID = Selecteditem[0].StoreId

            if (InvoiceStatisticsModel[0].CustomerId != null) {
                CustomerId = InvoiceStatisticsModel[0].CustomerId;

                $('#txtCustomerCode').prop("value", InvoiceStatisticsModel[0].CustomerCODE);
                $('#txtInvoiceCustomerName').prop("value", InvoiceStatisticsModel[0].CustomerName);
                $('#txtCustomerMobile').prop("value", InvoiceStatisticsModel[0].CustomerMobileNo);
            } else {
                $('#txtInvoiceCustomerName').prop("value", InvoiceStatisticsModel[0].CustomerName);
                $('#txtCustomerMobile').prop("value", InvoiceStatisticsModel[0].CustomerMobileNo);
                $('#txtCustomerCode').prop("value", "");
                CustomerId = 0;

            }

            var ddlSalesmanValue = InvoiceStatisticsModel[0].SalesmanId.toString();
            $('#ddlSalesman').prop("value", ddlSalesmanValue);

            if (InvoiceStatisticsModel[0].Status == 1) {
                chkActive.checked = true;
                chkPreivilegeToEditApprovedInvoice();
            } else {
                chkActive.checked = false;
                btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT;
                chkActive.disabled = true;

            }
            if (InvoiceStatisticsModel[0].IsCash == true) {
                $('#ddlType').prop("value", "1");
                $("#Div_Money").removeClass("display_none");
                $('#ddlCashBox').val(InvoiceStatisticsModel[0].CashBoxID);
                $('#txtCardMoney').val(InvoiceStatisticsModel[0].CardAmount);
                $('#txtCashMoney').val(InvoiceStatisticsModel[0].CashAmount);

                TypeFlag = true;
            } else {
                $('#ddlType').prop("value", "0");
                $('#ddlCashBox').prop('selectedIndex', 0);
                $('#ddlCashBox').attr('disabled', 'disabled');

                TypeFlag = false;
            }

            $('#divCreationPanel').removeClass("display_none");

            $('#txtCreatedBy').prop("value", InvoiceStatisticsModel[0].CreatedBy);
            $('#txtCreatedAt').prop("value", InvoiceStatisticsModel[0].CreatedAt);

            $('#txtUpdatedBy').prop("value", InvoiceStatisticsModel[0].UpdatedBy);
            $('#txtUpdatedAt').prop("value", InvoiceStatisticsModel[0].UpdatedAt);
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetSlsInvoiceItem"),
            data: { invoiceID: GlobalinvoiceID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {//(int CompCode, string StartDate, string EndDate, int Status, int? CustId, string SalesUser, string UserCode, string Token)
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    SlsInvoiceItemsDetails = result.Response as Array<IQ_GetSlsInvoiceItem>;
                    for (let i = 0; i < SlsInvoiceItemsDetails.length; i++) {
                        BuildControls(i);
                        Display_GridConrtol(i);
                    }
                    CountGrid = SlsInvoiceItemsDetails.length;
                    CountItems = SlsInvoiceItemsDetails.length;
                }
            }
        });
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");

        $("txtInvoiceDate").attr("disabled", "disabled");
        $("ddlSalesman").attr("disabled", "disabled");

        $("#txtCashMoney").attr("disabled", "disabled");
        $("#txtCardMoney").attr("disabled", "disabled");
        $("#txtInvoiceCustomerName").attr("disabled", "disabled");
        $("#div_btnPrint").removeClass("display_none");

        txtInvoiceDate.disabled = true;
        ddlSalesman.disabled = true;

        txtInvoiceDate.disabled = true;
        txtCustomerCode.disabled = true;
        txtCustomerMobile.disabled = true;

        ddlSalesman.disabled = true;
        ddlType.disabled = true;
        txt_Remarks.disabled = true;
        txtDiscountValue.disabled = true;

        if (InvoiceStatisticsModel[0].Status == 1) {
            if (!SysSession.CurrentPrivileges.CUSTOM2) {
                AutherizeFlag = false;
                $("#btnUpdate").addClass("display_none");
            } else {
                AutherizeFlag = true;
                $("#btnUpdate").removeClass("display_none");

            }
        }
        DocumentActions.RenderFromModel(InvoiceStatisticsModel[0]);
        NewAdd = false;
        btndiv_1_onclick();

    }
    function updateWithProcess() {

        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("SlsTrSales", "Open"),
            data: JSON.stringify(MasterDetailsModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    let res = result.Response as I_Sls_TR_Invoice;
                    if (res.Status == 0) {
                        DisplayMassage('( تم تعديل الفاتورة بنجاح )', '(success)', MessageType.Succeed);
                    } else {
                        DisplayMassage('( تم اعتماد الفاتورة بنجاح )', '(success)', MessageType.Succeed);
                    }

                    $('#divCreationPanel').removeClass("display_none");
                    $('#txtUpdatedBy').prop("value", res.UpdatedBy);
                    $('#txtUpdatedAt').prop("value", res.UpdatedAt);

                    AutherizeFlag = false;
                    success();

                    IsSuccess = true;

                } else {
                    IsSuccess = false;
                    DisplayMassage('( هناك خطـأ)', '(Error)', MessageType.Error);
                }
            }
        });


    }
    function openInvoice() {


        Assign();
        //InvoiceModel.CreatedAt = InvoiceStatisticsModel[0].CreatedAt;
        //InvoiceModel.CreatedBy = InvoiceStatisticsModel[0].CreatedBy;
        //let Selecteditem
        //Selecteditem = SlsInvoiceStatisticsDetails.filter(x => x.InvoiceID == Number(Grid.SelectedKey));
        //try {
        //    GlobalinvoiceID = Number(Selecteditem[0].InvoiceID);

        //} catch (e) {
        //    Selecteditem = SlsInvoiceStatisticsDetails.filter(x => x.InvoiceID == Number(invoiceID));
        //    GlobalinvoiceID = Number(Selecteditem[0].InvoiceID);
        //}

        InvoiceModel.InvoiceID = GlobalinvoiceID;

        InvoiceModel.CompCode = Number(compcode);
        InvoiceModel.BranchCode = Number(BranchCode);
        var InvoiceNumber = Number(lblInvoiceNumber.value);
        InvoiceModel.TrNo = InvoiceNumber;

        InvoiceModel.CreatedAt = $('#txtCreatedAt').val();
        InvoiceModel.CreatedBy = $('#txtCreatedBy').val();

        InvoiceModel.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        InvoiceModel.UpdatedAt = DateTimeFormat(Date().toString());

        InvoiceModel.CustomerName = txtInvoiceCustomerName.value;
        InvoiceModel.TrType = 0//0 invoice 1 return
        InvoiceModel.SlsInvSrc = 1   // 1 from store 2 from van 
        InvoiceModel.SlsInvType = 1 //  retail 
        InvoiceModel.StoreId = StoreID;//main store

        InvoiceModel.SalesmanId = Number(ddlSalesman.value);
        InvoiceModel.StoreId = Number(ddlStore.value);
        InvoiceModel.RefTrID = null;
        InvoiceModel.Status = 0;

        MasterDetailsModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailsModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("SlsTrSales", "Open"),
            data: JSON.stringify(MasterDetailsModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    btnUpdate.disabled = false;

                    $("#cotrolDiv").removeClass("disabledDiv");
                    BindStatisticGridData();
                    open_success();

                } else {
                    btnUpdate.disabled = true;
                }
            }
        });
    }
    //------------------------------------------------------Poup_Pass------------------------
    function Open_poup_Pass() {

        $('#popu_Passowrd').attr('style', 'display:block;');
        $('#popu_Passowrd').attr('class', 'popu animated zoomInLeft');
        txt_ApprovePass.value = "";
        $("#Popup_Passowrd").modal("show");



        var Ul_List = document.getElementById('Ul_List_MinUnitPrice');

        Ul_List.innerHTML = '';

        for (var i = 0; i < List_MinUnitPrice.length; i++) {

            var li_List_MinUnitPrice = document.createElement('li');
            li_List_MinUnitPrice.setAttribute('id', 'li_List_MinUnitPrice' + i);
            li_List_MinUnitPrice.setAttribute('class', 'st_border_li_List_MinUnitPrice');
            Ul_List.appendChild(li_List_MinUnitPrice);

            var id_List = document.getElementById('li_List_MinUnitPrice' + i);
            id_List.innerHTML = '-( ' + List_MinUnitPrice[i].Name_Item + ' ) السعر (' + List_MinUnitPrice[i].Unitprice + ') الحد (0' + List_MinUnitPrice[i].MinUnitPrice + '0)';


        }


    }
    function btn_Approveprice_onclick() {
        if (txt_ApprovePass.value == SysSession.CurrentEnvironment.I_Control[0].ExceedMinPricePassword) {

            if (NewAdd == true) {

                InvoiceModel.CreatedAt = DateTimeFormat(Date().toString());
                InvoiceModel.CreatedBy = SysSession.CurrentEnvironment.UserCode;

                MasterDetailsModel.I_Sls_TR_Invoice = InvoiceModel;
                insert();

            }
            else {

                if (AutherizeFlag == false) {
                    Update();

                } else {
                    updateWithProcess();
                    AutherizeFlag = false;
                }

            }


            if (IsSuccess == true) {
                $('#popu_Passowrd').attr('style', 'display:none;');
                $('#popu_Passowrd').attr('class', 'popu animated zoomOut');
                txt_ApprovePass.value = "";
                $("#Popup_Passowrd").modal("hide");
                Validation_Insert = 0;
                IsSuccess = false;
            }

        }
        else {
            WorningMessage("لايمكن اعتماد الفاتورة", "The invoice cannot be approved", "تحذير", "worning");
            txt_ApprovePass.value = "";

        }
    }
    function btn_Exit_Approveprice_onclick() {

        $('#popu_Passowrd').attr('style', 'display:none;');
        $('#popu_Passowrd').attr('class', 'popu animated zoomOut');
        txt_ApprovePass.value = "";
        $("#Popup_Passowrd").modal("hide");
        Validation_Insert = 0;
        IsSuccess = false;
    }
    //------------------------------------------------------Print------------------------
    export function PrintReport(OutType: number) {

        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();

        rp.RepType = OutType;//output report as View
        rp.FromDate = DateFormatRep(txtStartDate.value);
        rp.ToDate = DateFormatRep(txtEndDate.value);
        rp.CompCode = SysSession.CurrentEnvironment.CompCode;
        rp.BranchCode = SysSession.CurrentEnvironment.BranchCode;
        rp.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
        rp.CompNameE = SysSession.CurrentEnvironment.CompanyName;
        rp.UserCode = SysSession.CurrentEnvironment.UserCode;
        rp.Tokenid = SysSession.CurrentEnvironment.Token;
        rp.BraNameA = SysSession.CurrentEnvironment.BranchName;
        rp.BraNameE = SysSession.CurrentEnvironment.BranchNameEn;
        rp.ScreenLanguage = SysSession.CurrentEnvironment.ScreenLanguage;
        rp.SystemCode = SysSession.CurrentEnvironment.SystemCode;
        rp.SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        if (rp.BraNameA == null || rp.BraNameE == null) {

            rp.BraNameA = " ";
            rp.BraNameE = " ";
        }
        rp.LoginUser = SysSession.CurrentEnvironment.UserCode;
        if (ddlSalesmanFilter.selectedIndex > 0)

            rp.SalesmanID = Number($("#ddlSalesmanFilter").val());
        else
            rp.SalesmanID = -1;

        if ($("#ddlCustomer").val() == "null")
            rp.CustomerID = -1;
        else
            rp.CustomerID = Number($("#ddlCustomer").val());
        rp.OperationId = -1;
        rp.CashType = Number($("#ddlInvoiceType").val());
        rp.Status = Number($("#ddlStateType").val());
        rp.TrType = 0;
        rp.src = 1;

        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_SlsInvoiceList", "GeneralReports"),
            data: rp,
            success: (d) => {

                let result = d.result as string;
                window.open(result, "_blank");
            }
        })
    }
    function btnPrintInvoicePrice_onclick() {
        ////
        if (!SysSession.CurrentPrivileges.PrintOut) return;

        let rp: ReportParameters = new ReportParameters();
        rp.Type = 0;
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

        var CustomerID;
        var SalesmanID;
        if (ddlSalesmanFilter.selectedIndex > 0)

            SalesmanID = Number($("#ddlSalesmanFilter").val());
        else
            SalesmanID = -1;
        if ($("#ddlCustomer").val() == "null")
            CustomerID = -1;
        else
            CustomerID = Number($("#ddlCustomer").val());


        rp.CashType = Number($("#ddlInvoiceType").val());
        rp.Status = Number($("#ddlStateType").val());
        rp.SalesmanID = SalesmanID;
        rp.TrType = 0;
        rp.CustomerID = CustomerID;
        rp.Typ = 1;
        rp.TRId = GlobalinvoiceID;




        Ajax.Callsync({
            url: Url.Action("rptInvoiceNote", "GeneralReports"),
            data: rp,
            success: (d) => {

                let result = d.result as string;


                window.open(result, "_blank");
            }
        })
    }
    function PrintTransaction() {
        if (!SysSession.CurrentPrivileges.PrintOut) return;

        window.open(Url.Action("ReportsPopup", "Home"), "blank");
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');


        let rp: ReportParameters = new ReportParameters();


        rp.CompCode = SysSession.CurrentEnvironment.CompCode;
        rp.BranchCode = SysSession.CurrentEnvironment.BranchCode;
        rp.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
        rp.CompNameE = SysSession.CurrentEnvironment.CompanyName;
        rp.UserCode = SysSession.CurrentEnvironment.UserCode;
        rp.Tokenid = SysSession.CurrentEnvironment.Token;
        rp.ScreenLanguage = SysSession.CurrentEnvironment.ScreenLanguage;
        rp.SystemCode = SysSession.CurrentEnvironment.SystemCode;
        rp.SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        rp.BraNameA = SysSession.CurrentEnvironment.BranchName;
        rp.BraNameE = SysSession.CurrentEnvironment.BranchName;
        if (rp.BraNameA == null || rp.BraNameE == null) {

            rp.BraNameA = " ";
            rp.BraNameE = " ";
        }
        rp.Type = 4;
        rp.Repdesign = 0;
        rp.TRId = GlobalinvoiceID;
        rp.slip = 0;
        rp.stat = 1
        
        debugger
        Ajax.CallAsync({
            url: Url.Action("rptInvoiceNote", "GeneralRep"),
            data:  rp,
            success: (d) => {
                debugger
                let result = d as BaseResponse;
                window.open(Url.Action("ReportsPopup", "Home"), "blank");
                localStorage.setItem("result", "" + result + "");

                //let result = d.result as string;    
                //window.open(result, "_blank");
            }
        })
    }
    function printbtndeliverynote() {
        if (!SysSession.CurrentPrivileges.PrintOut) return;

        window.open(Url.Action("ReportsPopup", "Home"), "blank");
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');


        let rp: ReportParameters = new ReportParameters();


        rp.CompCode = SysSession.CurrentEnvironment.CompCode;
        rp.BranchCode = SysSession.CurrentEnvironment.BranchCode;
        rp.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
        rp.CompNameE = SysSession.CurrentEnvironment.CompanyName;
        rp.UserCode = SysSession.CurrentEnvironment.UserCode;
        rp.Tokenid = SysSession.CurrentEnvironment.Token;
        rp.ScreenLanguage = SysSession.CurrentEnvironment.ScreenLanguage;
        rp.SystemCode = SysSession.CurrentEnvironment.SystemCode;
        rp.SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        rp.BraNameA = SysSession.CurrentEnvironment.BranchName;
        rp.BraNameE = SysSession.CurrentEnvironment.BranchName;
        if (rp.BraNameA == null || rp.BraNameE == null) {

            rp.BraNameA = " ";
            rp.BraNameE = " ";
        }
        rp.Type = 4;
        rp.Repdesign = 0;
        rp.TRId = GlobalinvoiceID;
        rp.slip = 0;
        rp.stat = 1
        rp.RecType = 1; 
        
        debugger
        Ajax.CallAsync({
            url: Url.Action("rptInvoiceNote", "GeneralRep"),
            data:  rp,
            success: (d) => {
                debugger
                let result = d as BaseResponse;
                window.open(Url.Action("ReportsPopup", "Home"), "blank");
                localStorage.setItem("result", "" + result + "");

                //let result = d.result as string;    
                //window.open(result, "_blank");
            }
        })
    }
    function btnPrintslip_onclick() {





        if (!SysSession.CurrentPrivileges.PrintOut) return;


        window.open(Url.Action("ReportsPopup", "Home"), "blank");
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');


        let rp: ReportParameters = new ReportParameters();

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
        rp.Type = 4;
        rp.Repdesign = 0;
        rp.Typ = 0;
        rp.slip = 1;
        rp.TRId = GlobalinvoiceID;

        Ajax.CallAsync({
            url: Url.Action("rptInvoiceNote", "GeneralRep"),
            data: rp,
            success: (d) => {
                let result = d as BaseResponse;
                window.open(Url.Action("ReportsPopup", "Home"), "blank");
                localStorage.setItem("result", "" + result + "");

                //let result = d.result as string;
                //window.open(result, "_blank");
            }
        })

    }
    function DownloadInvoicePdf() {


        let rp: ReportParameters = new ReportParameters();


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
        rp.DocPDFFolder = SysSession.CurrentEnvironment.I_Control[0].DocPDFFolder;

        if (BranchNameA == null || BranchNameE == null) {

            BranchNameA = " ";
            BranchNameE = " ";
        }
        rp.BraNameA = BranchNameA;
        rp.BraNameE = BranchNameE;
        rp.LoginUser = SysSession.CurrentEnvironment.UserCode;
        rp.Type = 0;
        rp.Typ = 2;
        rp.TRId = GlobalinvoiceID;
        if (InvoiceType == 1)
            rp.stat = SysSession.CurrentEnvironment.RetailInvoiceTransCode;
        else
            rp.stat = SysSession.CurrentEnvironment.WholeInvoiceTransCode;

        Ajax.Callsync({
            url: Url.Action("rptInvoiceNote", "Reports_pdf"),
            data: rp,
            success: (d) => {

                let result = d as BaseResponse;

            }
        })


    }


    function btnPrintNew_onclick() {

        if (!SysSession.CurrentPrivileges.PrintOut) return;

        if (($('#ToNum').val() == 0 && $('#fromNum').val() == 0) || ($('#ToNum').val() == '' && $('#fromNum').val() == '')) {
            Errorinput($('#ToNum'));
            Errorinput($('#fromNum'));
            return
        }

        window.open(Url.Action("ReportsPopup", "Home"), "blank");
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div><br/>');

        btnShow_onclick();


        let rp: ReportParameters = new ReportParameters();


        rp.CompCode = SysSession.CurrentEnvironment.CompCode;
        rp.BranchCode = SysSession.CurrentEnvironment.BranchCode;
        rp.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
        rp.CompNameE = SysSession.CurrentEnvironment.CompanyName;
        rp.UserCode = SysSession.CurrentEnvironment.UserCode;
        rp.Tokenid = SysSession.CurrentEnvironment.Token;
        rp.ScreenLanguage = SysSession.CurrentEnvironment.ScreenLanguage;
        rp.SystemCode = SysSession.CurrentEnvironment.SystemCode;
        rp.SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        rp.BraNameA = SysSession.CurrentEnvironment.BranchName;
        rp.BraNameE = SysSession.CurrentEnvironment.BranchName;
        if (rp.BraNameA == null || rp.BraNameE == null) {

            rp.BraNameA = " ";
            rp.BraNameE = " ";
        }
        rp.Type = 4;
        rp.Repdesign = 0;

        rp.slip = 0;
        if (InvoiceType == 1)
            rp.stat = SysSession.CurrentEnvironment.RetailInvoiceTransCode;
        else
            rp.stat = SysSession.CurrentEnvironment.WholeInvoiceTransCode;


        html = "";

        setTimeout(function () {


            debugger
            for (var i = 0; i < SlsInvoiceStatisticsDetails.length; i++) {

                rp.TRId = SlsInvoiceStatisticsDetails[i].InvoiceID;

                Ajax.Callsync({
                    url: Url.Action("rptInvoiceNote", "GeneralRep"),
                    data: rp,
                    success: (d) => {

                        let result = d as BaseResponse;


                        html += result;
                        localStorage.setItem("result", "" + html + "");
                        //let result = d.result as string;    
                        //window.open(result, "_blank");
                    }
                })


            }


            window.open(Url.Action("ReportsPopup", "Home"), "blank");


        }, 700);


    }


    function btnPrintNewNew_onclick() {

        if (!SysSession.CurrentPrivileges.PrintOut) return;

        if (($('#ToNum').val() == 0 && $('#fromNum').val() == 0) || ($('#ToNum').val() == '' && $('#fromNum').val() == '')) {
            Errorinput($('#ToNum'));
            Errorinput($('#fromNum'));
            return
        }

        window.open(Url.Action("ReportsPopup", "Home"), "blank");
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div><br/>');

        btnShow_onclick();




        var NewRP: Array<ReportParameters> = new Array<ReportParameters>();




        html = "";

        setTimeout(function () {


            debugger
            for (var i = 0; i < SlsInvoiceStatisticsDetails.length; i++) {
                let rp: ReportParameters = new ReportParameters();

                rp.CompCode = SysSession.CurrentEnvironment.CompCode;
                rp.BranchCode = SysSession.CurrentEnvironment.BranchCode;
                rp.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
                rp.CompNameE = SysSession.CurrentEnvironment.CompanyName;
                rp.UserCode = SysSession.CurrentEnvironment.UserCode;
                rp.Tokenid = SysSession.CurrentEnvironment.Token;
                rp.ScreenLanguage = SysSession.CurrentEnvironment.ScreenLanguage;
                rp.SystemCode = SysSession.CurrentEnvironment.SystemCode;
                rp.SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
                rp.BraNameA = SysSession.CurrentEnvironment.BranchName;
                rp.BraNameE = SysSession.CurrentEnvironment.BranchName;
                if (rp.BraNameA == null || rp.BraNameE == null) {

                    rp.BraNameA = " ";
                    rp.BraNameE = " ";
                }
                rp.Type = 4;
                rp.Repdesign = 0;

                rp.slip = 0;
                if (InvoiceType == 1)
                    rp.stat = SysSession.CurrentEnvironment.RetailInvoiceTransCode;
                else
                    rp.stat = SysSession.CurrentEnvironment.WholeInvoiceTransCode;

                rp.TRId = SlsInvoiceStatisticsDetails[i].InvoiceID;


                NewRP.push(rp)


            }


            let _Data: string = JSON.stringify(NewRP);

            Ajax.Callsync({
                url: Url.Action("rptInvoiceNoteNew", "GeneralRep"),
                data: { RepP: _Data },
                success: (d) => {

                    let result = d as BaseResponse;


                    //html += result;
                    window.open(Url.Action("ReportsPopup", "Home"), "blank");
                    localStorage.setItem("result", "" + result + "");
                    //let result = d.result as string;    
                    //window.open(result, "_blank");
                }
            })





        }, 700);


    }



}