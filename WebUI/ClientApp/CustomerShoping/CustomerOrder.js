$(document).ready(function () {
    CustomerOrder.InitalizeComponent();
});
var CustomerOrder;
(function (CustomerOrder) {
    //system varables
    var link = 'http://localhost:65029/';
    var TrType = 2;
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
    InvoiceType = 1;
    (lang == "ar" ? Screen_name = 'عرض سعر' : Screen_name = 'Retail invoice');
    // Arrays
    var CashboxDetails = new Array();
    var CustDetails = new Array();
    var DetailsVatNature = new Array();
    var StateDetailsAr = new Array();
    var StateDetailsEn = new Array();
    var InvoiceDetailsAr = new Array();
    var InvoiceDetailsEn = new Array();
    var InvoiceTypeDetailsAr = new Array();
    var InvoiceEyptDetailsEn = new Array();
    var SlsInvoiceStatisticsDetails = new Array();
    var Selecteditem = new Array();
    var SearchDetails = new Array();
    var SlsInvoiceItemsDetails = new Array();
    var AD_VatTypeDetails = new A_D_VAT_TYPE();
    var SalesmanDetails = new Array();
    //Models
    var InvoiceStatisticsModel = new Array();
    var InvoiceItemsDetailsModel = new Array();
    var InvoiceModel = new I_Sls_TR_Invoice();
    var MasterDetailsModel = new SlsInvoiceMasterDetails();
    var invoiceItemSingleModel = new I_Sls_TR_InvoiceItems();
    var List_MinUnitPrice = new Array();
    var I_Item_Cust = new Array();
    var storeDetails = new Array();
    //TextBoxes
    var txt_Tax_total_Discount;
    var txt_Tax_Discount;
    var txt_Tax_total_AfterDiscount;
    var txtItemCount;
    var txtPackageCount;
    var txtTotalbefore;
    var txt_Remarks;
    var txtInvoiceDate;
    var txtCustomerMobile;
    var txtInvoiceCustomerName;
    var lblInvoiceNumber;
    //checkbox
    var btnAddDetails;
    var btnBack; // btnBack btnSave
    var btnSave;
    //print buttons     
    //global    
    var Discount = 0;
    var StoreID;
    var CountGrid = 0;
    var CountItems = 0;
    var PackageCount = 0;
    var CountTotal = 0;
    var TaxCount = 0;
    var NetCount = 0;
    var VatPrc = 0;
    var Validation_Insert = 0;
    var GlobalinvoiceID = 0;
    var invoiceID;
    //flags : 
    var TypeFlag = false;
    var IsSuccess = true;
    var Show = true;
    var NewAdd = true;
    var AutherizeFlag = false;
    //var flag_PriceWithVAT = (SysSession.CurrentEnvironment.I_Control[0].SalesPriceWithVAT);
    //var btnPrint: HTMLInputElement;
    var Tax_Rate = 0;
    var Tax_Type_Model = new Tax_Type();
    var NumCnt = 0;
    var CustType;
    var CustomerId = 0;
    var html = "";
    //------------------------------------------------------ Main Region------------------------
    function InitalizeComponent() {
        // VatPrc                                           
        debugger;
        CustomerId = Number(SysSession.CurrentEnvironment.CustomerId);
        if (isNaN(CustomerId)) {
            window.open(Url.Action("LogCust", "Home"), "_self");
        }
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        Finyear = Number(SysSession.CurrentEnvironment.CurrentYear);
        InitalizeControls();
        InitializeEvents();
        //fillddlCustomer();
        //FillddlVatNature(); 
        //fillddlSalesman();
        //FillddlStore(); 
        //FillddlStateType();  
        //FillddlInvoiceType();
        //FillddlType();
        //vatType = SysSession.CurrentEnvironment.I_Control[0].DefSlsVatType;
        //GetVatPercentage();
        txtItemCount.value = CountItems.toString();
        txtPackageCount.value = PackageCount.toString();
        btnAdd_onclick();
    }
    CustomerOrder.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        // btnPrint = document.getElementById("btnPrint") as HTMLInputElement;
        // Drop down lists
        //TextBoxes
        txt_Tax_Discount = document.getElementById("txt_Tax_Discount");
        txt_Tax_total_Discount = document.getElementById("txt_Tax_total_Discount");
        txt_Tax_total_AfterDiscount = document.getElementById("txt_Tax_total_AfterDiscount");
        txtItemCount = document.getElementById("txtItemCount");
        txtPackageCount = document.getElementById("txtPackageCount");
        txtTotalbefore = document.getElementById("txtTotalbefore");
        txt_Remarks = document.getElementById("txt_Remarks");
        txtInvoiceDate = document.getElementById("txtInvoiceDate");
        txtCustomerMobile = document.getElementById("txtCustomerMobile");
        txtInvoiceCustomerName = document.getElementById("txtInvoiceCustomerName");
        //labels
        lblInvoiceNumber = document.getElementById("lblInvoiceNumber");
        //checkbox
        //button
        btnAddDetails = document.getElementById("btnAddDetails"); // btnBack btnSave
        btnBack = document.getElementById("btnBack");
        btnSave = document.getElementById("btnSave");
        //print 
    }
    function InitializeEvents() {
        btnAddDetails.onclick = AddNewRow;
        btnBack.onclick = btnBack_onclick;
        btnSave.onclick = btnSave_onclick;
    }
    function Tax_Net_Total() {
        var Net_total_After = Number($("#Tax_TotalInvoice").text()) - Number($("#txt_Tax_total_AfterDiscount").val());
        $("#Tax_Net_total_AfterDiscount").text(Net_total_After.toFixed(2));
        var Tax_Net_VAT = Number($("#Tax_InvoiceVAT").text()) - Number($("#txt_Tax_Vat").val());
        $("#Tax_Net_VAT").text(Tax_Net_VAT.toFixed(2));
        var Net_AfterTotalVAT = Number($("#Tax_AfterTotalInvoiceVAT").text()) - Number($("#txt_Tax_AfterTotalVAT").val());
        $("#Tax_Net_AfterTotalVAT").text(Net_AfterTotalVAT.toFixed(2));
        var difference_1 = (Number($("#Tax_Net_total_AfterDiscount").text()) * 0.15);
        var difference_2 = difference_1 + Number($("#Tax_Net_total_AfterDiscount").text());
        var difference_3 = difference_2 - Number($("#Tax_Net_AfterTotalVAT").text());
        $("#txtFraction_difference").text(difference_3.toFixed(4));
    }
    //------------------------------------------------------ Events Region------------------------
    //------------------------------------------------------ Buttons Region------------------------
    function btnSave_onclick() {
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
            Validation_Insert = 0;
            MasterDetailsModel = new SlsInvoiceMasterDetails();
            Assign();
            MasterDetailsModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            MasterDetailsModel.UserCode = SysSession.CurrentEnvironment.UserCode;
            InvoiceModel.VatType = vatType;
            InvoiceModel.CommitionAmount = Number(txt_Remarks.value);
            InvoiceModel.CreatedAt = DateTimeFormat(Date().toString());
            InvoiceModel.CreatedBy = SysSession.CurrentEnvironment.UserCode;
            MasterDetailsModel.I_Sls_TR_Invoice = InvoiceModel;
            insert();
        }
    }
    function btnBack_onclick() {
        btnAdd_onclick();
    }
    function btnAdd_onclick() {
        var InvTransCode;
        if (InvoiceType == 1)
            InvTransCode = SysSession.CurrentEnvironment.RetailInvoiceTransCode;
        else
            InvTransCode = SysSession.CurrentEnvironment.WholeInvoiceTransCode;
        lblInvoiceNumber.value = '';
        txtInvoiceDate.value = GetDate();
        CustomerId = SysSession.CurrentEnvironment.CustomerId;
        txtInvoiceCustomerName.value = SysSession.CurrentEnvironment.CUSTOMER_NAME;
        txtCustomerMobile.value = SysSession.CurrentEnvironment.CustomerPhone;
        $("#txtCUSTOMER_ADDRES").val(SysSession.CurrentEnvironment.CUSTOMER_ADDRES);
        $("#txtDebit").val(SysSession.CurrentEnvironment.Debit);
        txtTotalbefore.value = '0';
        txt_Remarks.value = '';
        txtItemCount.value = '0';
        txtPackageCount.value = '0';
        TypeFlag = true;
        txt_Remarks.disabled = false;
        $("#btnAddDetails").removeClass("display_none");
        $("#btnUpdate").addClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
        $("#btnPrintInvoicePrice").addClass("display_none");
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
        $('#txtCreatedBy').prop("value", SysSession.CurrentEnvironment.UserCode);
        $('#txtCreatedAt').prop("value", DateTimeFormat(Date().toString()));
        //SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlCashBox').prop('selectedIndex', 1), $("#Div_Money").removeClass("display_none")) : $('#ddlCashBox').prop('selectedIndex', 0); $('#ddlCashBox').attr('disabled', 'disabled');
        SysSession.CurrentEnvironment.I_Control[0].IvoiceDateEditable == true ? $('#txtInvoiceDate').removeAttr("disabled") : $('#txtInvoiceDate').attr("disabled", "disabled");
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
        AddNewRow();
        GetCustItemsGridData(CustomerId);
    }
    //------------------------------------------------------ Drop Down Region------------------------
    //------------------------------------------------------ Controls Grid Region------------------------
    function GetCustItemsGridData(CUSTOMERID) {
        debugger;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Customer", "GetI_Item_CustomerByID"),
            data: { CUSTOMER_ID: CUSTOMERID },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    I_Item_Cust = result.Response;
                }
            }
        });
    }
    function BuildControls(cnt) {
        var html;
        html = '<div id= "No_Row' + cnt + '" class="container-fluid style_border" > <div class="row " > <div class="col-lg-12" style="right:2%;"> ' +
            '<span id="btn_minus' + cnt + '" class="fa fa-minus-circle fontitm3SlsTrSalesManager2 display_none"></span>' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-3 p-0" style="width: 17%;" >' +
            '<input id="txtSerial' + cnt + '" type="text" class="form-control input-sm input-sm right2" disabled /></div>' +
            '<input id="InvoiceItemID' + cnt + '" type="hidden" class="form-control input-sm right2 display_none"  />' +
            '<div class="display_none col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0" style="width: 11%;">' +
            '<input id="txtServiceCode' + cnt + '" name=""   type="text" class="  col-lg-9 form-control input-sm  text_Display  " />' +
            '</div>' +
            '<div class=" col-lg-3 col-md-3 col-sm-3 col-xl-3 col-xs-9 p-0" style="width: 82%;">' +
            '<button type="button" class="col-lg-1 col-xs-1 src-btn btn btn-search input-sm " style="width:22%;" id="btnSearchService' + cnt + '" name="ColSearch">   ' +
            '<i class="fa fa-search  "></i></button>' +
            '<input id="txtServiceName' + cnt + '" name="FromDate" disabled  style="width: 77%;" type="text" class=" col-lg-11 col-xs-8 form-control input-sm  text_Display" style="width:90%;" />' +
            '</div>' +
            '<div class="   col-lg-3 col-md-3 col-sm-3 col-xl-3 col-xs-3 Mopil"  >' +
            '<div class="  col-lg-4 col-md-4 col-sm-4 col-xl-4 col-xs-4 p-0" style="width: 33%;">' +
            '<select id="ddlTypeuom' + cnt + '" disabled class="form-control input-sm"   style="width: 100%;border-radius: 30px;"><option value="null">الوحده</option></select> </div>' +
            '<div class="  col-lg-4 col-md-4 col-sm-4 col-xl-4 col-xs-4 p-0" style="width: 33%;"><input type="number" id="txtQuantity' + cnt + '" name="quant[1]" class="form-control input-sm   font1" value="1" min="1" max="1000" step="1"></div>' +
            '<div class="  col-lg-4 col-md-4 col-sm-4 col-xl-4 col-xs-4 p-0" style="width: 33%;" ><input type="number" disabled id="txtPrice' + cnt + '" name="quant[2]" class="form-control input-sm   font1" value="1" min="0" max="1000" step="0.5"></div>' +
            '</div>' +
            '<div class="display_none col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0"><input type="text"  disabled class="form-control input-sm" id="txtReturnQuantity' + cnt + '" name="quant[3]" class="form-control input-sm   font1" value="0" min="0" max="1000" step="1"></div>' +
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
        //$('#btnSearchService' + cnt).click(function (e) {
        //    debugger
        //    let sys: SystemTools = new SystemTools();
        //    let GetItemInfo: Array<Iproc_GetItemInfo_Result> = new Array<Iproc_GetItemInfo_Result>();
        //    NumCnt = cnt;
        //    var Storeid =1
        //    sys.ShowItemsCust(Number(SysSession.CurrentEnvironment.BranchCode), Storeid, $('#txtServiceName' + cnt).val(), $('#txtServiceCode' + cnt).val(), InvoiceType, () => {
        //        let id = sysInternal_Comm.Itemid;
        //        debugger
        //        if (!validationitem(id, Number($("#txt_ItemID" + NumCnt + "").val()))) return
        //        $("#txt_ItemID" + NumCnt + "").val(id);
        //        let ItemCode = '';
        //        let ItemID = id;
        //        let Mode = InvoiceType;
        //        Ajax.Callsync({
        //            type: "Get",
        //            url: sys.apiUrl("StkDefItemType", "GetItemByCode"),
        //            data: {
        //                CompCode: compcode, FinYear: Finyear, ItemCode: ItemCode, ItemID: ItemID, storeid: Storeid, Mode: Mode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
        //            },
        //            success: (d) => {
        //                let result = d as BaseResponse;
        //                if (result.IsSuccess) {
        //                    GetItemInfo = result.Response as Array<Iproc_GetItemInfo_Result>;
        //                    if (GetItemInfo.length > 0) {
        //                        $('#ddlTypeuom' + NumCnt + '').html('');
        //                        for (var i = 0; i < GetItemInfo.length; i++) {
        //                            $('#ddlTypeuom' + NumCnt + '').append('<option  data-OnhandQty="' + GetItemInfo[i].OnhandQty + '" data-UnitPrice="' + GetItemInfo[i].UnitPrice + '" data-MinPrice="' + GetItemInfo[i].MinPrice + '" data-Rate="' + GetItemInfo[i].Rate + '" value="' + GetItemInfo[i].uomid + '">' + (lang == "ar" ? GetItemInfo[i].u_DescA : GetItemInfo[i].u_DescE) + '</option>');
        //                        }
        //                        $('#txtServiceName' + NumCnt + '').val((lang == "ar" ? GetItemInfo[0].It_DescA : GetItemInfo[0].it_DescE));
        //                        $('#txtServiceCode' + NumCnt + '').val(GetItemInfo[0].ItemCode);
        //                        $('#txtPrice' + NumCnt + '').val(GetItemInfo[0].UnitPrice);
        //                        $('#txtNetUnitPrice' + NumCnt + '').val(GetItemInfo[0].UnitPrice);
        //                        $('#txtQuantity' + NumCnt + '').val('1');
        //                        $('#txtServiceName' + NumCnt + '').attr('disabled', 'disabled');
        //                        $('#txtServiceCode' + NumCnt + '').attr('disabled', 'disabled');
        //                        totalRow(NumCnt);
        //                    }
        //                    else {
        //                        $('#ddlTypeuom' + NumCnt + '').append('<option value="null">اختر الوحده</option>');
        //                        $('#txtServiceName' + NumCnt + '').val('');
        //                        $('#txtServiceCode' + NumCnt + '').val('');
        //                        $('#txtPrice' + NumCnt + '').val('0');
        //                        $('#txtNetUnitPrice' + NumCnt + '').val('0');
        //                        $('#txtQuantity' + NumCnt + '').val('1');
        //                        $('#txtServiceName' + NumCnt + '').removeAttr('disabled');
        //                        $('#txtServiceCode' + NumCnt + '').removeAttr('disabled');
        //                    }
        //                }
        //            }
        //        });
        //    });
        //});
        $('#btnSearchService' + cnt).click(function (e) {
            debugger;
            var sys = new SystemTools();
            var GetItemInfo = new Array();
            NumCnt = cnt;
            var Storeid = 1;
            sys.FindKey(Modules.CUSTOMERS, "btnCustomerOrder", " STATUS = 1 and CUSTOMER_ID = " + CustomerId, function () {
                var id = SearchGrid.SearchDataGrid.SelectedKey;
                var ListCustItem = I_Item_Cust.filter(function (x) { return x.Id == id; });
                if (!validationitem(ListCustItem[0].ItemID, Number($("#txt_ItemID" + NumCnt + "").val())))
                    return;
                //$("#txt_ItemID" + NumCnt + "").val(id);
                var ItemCode = '';
                var ItemID = ListCustItem[0].ItemID;
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
                            debugger;
                            GetItemInfo = result.Response;
                            if (GetItemInfo.length > 0) {
                                debugger;
                                $('#ddlTypeuom' + NumCnt + '').html('');
                                for (var i = 0; i < GetItemInfo.length; i++) {
                                    $('#ddlTypeuom' + NumCnt + '').append('<option  data-OnhandQty="' + GetItemInfo[i].OnhandQty + '" data-UnitPrice="' + GetItemInfo[i].UnitPrice + '" data-MinPrice="' + GetItemInfo[i].MinPrice + '" data-Rate="' + GetItemInfo[i].Rate + '" value="' + GetItemInfo[i].uomid + '">' + (lang == "ar" ? GetItemInfo[i].u_DescA : GetItemInfo[i].u_DescE) + '</option>');
                                }
                                $('#txtQuantity' + NumCnt + '').val('1');
                                $('#txt_ItemID' + NumCnt + '').val(ListCustItem[0].ItemID);
                                $('#txtServiceCode' + NumCnt + '').val(ListCustItem[0].ItemCode);
                                $('#txtServiceName' + NumCnt + '').val((lang == "ar" ? ListCustItem[0].DescA : ListCustItem[0].DescL));
                                $('#ddlTypeuom' + NumCnt + '').val(ListCustItem[0].UomID);
                                $('#txtPrice' + NumCnt + '').val(ListCustItem[0].Unitprice);
                                $('#txtNetUnitPrice' + NumCnt + '').val(ListCustItem[0].Unitprice);
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
            setTimeout(function () { $("#SearchDataTable_wrapper").attr("class", ""); }, 200);
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
                            if (!validationitem(Number($("#txt_ItemID" + NumCnt + "").val()), 0)) {
                                $("#txt_ItemID" + NumCnt + "").val("");
                                $("#txtServiceCode" + NumCnt + "").val("");
                                return;
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
                            Tax_Rate = Tax_Type_Model.Prc;
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
            //if (Number(txtQuantityValue) > Number(OnhandQty)) {
            //    DisplayMassage(" لا يمكن تجاوز الكميه المتاحه  " + OnhandQty + " ", "Please select a customer", MessageType.Worning);
            //    $("#txtQuantity" + cnt).val(OnhandQty);
            //    Errorinput($("#txtQuantity" + cnt));
            //}
            totalRow(cnt);
        });
        $("#txtPrice" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i") {
                $("#txt_StatusFlag" + cnt).val("u");
            }
            var total = Number($("#txtQuantity" + cnt).val()) * Number($("#txtPrice" + cnt).val());
            var vatAmount = (Number(total) * Number($("#txtTax_Rate" + cnt).val())) / 100;
            var totalAfterVat = Number(vatAmount.toFixed(2)) + Number(total.toFixed(2));
            $('#txtTax_Rate' + cnt).val(Tax_Rate);
            VatPrc = $("#txtTax_Rate" + cnt).val();
            $("#txtTax" + cnt).val(vatAmount.toFixed(2));
            $("#txtTotal" + cnt).val(total.toFixed(2));
            $("#txtTotAfterTax" + cnt).val(totalAfterVat.toFixed(2));
            $("#txtDiscountAmount" + cnt).val(((Number($("#txtDiscountPrc" + cnt).val()) * Number($("#txtPrice" + cnt).val())) / 100).toFixed(2));
            $("#txtNetUnitPrice" + cnt).val((Number($("#txtPrice" + cnt).val()) - ((Number($("#txtDiscountPrc" + cnt).val()) * Number($("#txtPrice" + cnt).val())) / 100)));
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
                    DisplayMassage("الصنف موجود من قبل", "Item found before", MessageType.Error);
                    Errorinput($("#txtServiceName" + i + ""));
                    return false;
                }
            }
        }
        return true;
    }
    function DeleteRow(RecNo) {
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", function () {
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
        CountItems = CountItems + 1;
        txtItemCount.value = CountItems.toString();
        BuildControls(CountGrid);
        $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode 
        $("#ddlFamily" + CountGrid).removeAttr("disabled");
        $("#ddlItem" + CountGrid).removeAttr("disabled");
        $("#txtQuantity" + CountGrid).removeAttr("disabled");
        $("#txtReturnQuantity" + CountGrid).attr("disabled", "disabled");
        $("#btn_minus" + CountGrid).removeClass("display_none");
        $("#btn_minus" + CountGrid).removeAttr("disabled");
        CountGrid++;
        Insert_Serial();
        //}
    }
    function ComputeTotals() {
        PackageCount = 0;
        CountTotal = 0;
        var TotalDiscount = 0;
        var Totalbefore = 0;
        TaxCount = 0;
        NetCount = 0;
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
        txtItemCount.value = CountItems.toString();
        txtPackageCount.value = PackageCount.toString();
        txtTotalbefore.value = Totalbefore.toString();
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
    }
    //------------------------------------------------------ Search && Clear &&Validation  Region ------------------------
    function ValidationHeader() {
        if (txtInvoiceDate.value == "") {
            DisplayMassage(" برجاء ادخال التاريخ", "Please select a Date", MessageType.Error);
            Errorinput(txtInvoiceDate);
            return false;
        }
        if (CountGrid == 0) {
            DisplayMassage(" برجاء ادخال بيانات الفاتورة", "Please select a Invoice data", MessageType.Error);
            Errorinput(btnAddDetails);
            return false;
        }
        if (txtItemCount.value == '0') {
            DisplayMassage(" برجاء ادخال بيانات الفاتورة", "Please select a Invoice data", MessageType.Error);
            Errorinput(btnAddDetails);
            return false;
        }
        return true;
    }
    function Validation_Grid(rowcount) {
        var Qty = Number($("#txtQuantity" + rowcount).val());
        var Price = Number($("#txtPrice" + rowcount).val());
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        }
        else {
            if ($("#txt_ItemID" + rowcount).val() == "" || $("#txt_ItemID" + rowcount).val() == "0" || $("#txt_ItemID" + rowcount).val() == null) {
                DisplayMassage(" برجاء ادخال الصنف", "Please enter the type", MessageType.Error);
                Errorinput($("#btnSearchService" + rowcount));
                Errorinput($("#txtServiceName" + rowcount));
                return false;
            }
            //else if ($("#txtServiceCode" + rowcount).val() == "") {
            //    DisplayMassage(" برجاء ادخال الكود", "Please enter the type", MessageType.Error);
            //    Errorinput($("#txtServiceCode" + rowcount));
            //    return false
            //}
            else if (Qty == 0) {
                DisplayMassage(" برجاء ادخال الكمية المباعة", "Please enter the Quantity sold", MessageType.Error);
                Errorinput($("#txtQuantity" + rowcount));
                return false;
            }
            //else if (Price == 0) {
            //    DisplayMassage(" برجاء ادخال السعر", "Please enter the Price", MessageType.Error);
            //    Errorinput($("#txtPrice" + rowcount));
            //    Errorinput($("#txtUnitpriceWithVat" + rowcount));
            //    return false
            //}
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
        $("#txt_Tax_Discount").attr("disabled", "disabled");
        $("#txt_Tax_total_Discount").attr("disabled", "disabled");
        $("#txt_Tax_total_AfterDiscount").attr("disabled", "disabled");
        $("#txtContract_NO").attr("disabled", "disabled");
        $("#txtPurchase_order_No").attr("disabled", "disabled");
        $("#txtDate_of_supply").attr("disabled", "disabled");
        $("#txtSupply_end_Date").attr("disabled", "disabled");
        $("#txtTerms_of_Payment").attr("disabled", "disabled");
    }
    //------------------------------------------------------ Get Functions  Region------------------------     
    //------------------------------------------------------ main Functions  Region------------------------
    function Assign() {
        List_MinUnitPrice = new Array();
        var StatusFlag;
        InvoiceModel = new I_Sls_TR_Invoice();
        InvoiceItemsDetailsModel = new Array();
        InvoiceModel.CustomerId = CustomerId == 0 ? null : CustomerId;
        InvoiceModel.CompCode = Number(compcode);
        InvoiceModel.BranchCode = Number(BranchCode);
        var InvoiceNumber = Number(lblInvoiceNumber.value);
        InvoiceModel.TrNo = InvoiceNumber;
        if (NewAdd != true) { //update
            InvoiceModel.CreatedAt = InvoiceStatisticsModel[0].CreatedAt;
            InvoiceModel.CreatedBy = InvoiceStatisticsModel[0].CreatedBy;
            InvoiceModel.SlsInvType = InvoiceStatisticsModel[0].SlsInvType; //  retail      or WholeSale
            InvoiceModel.DocNo = InvoiceStatisticsModel[0].DocNo;
            InvoiceModel.DocUUID = InvoiceStatisticsModel[0].DocUUID;
            InvoiceModel.TrTime = InvoiceStatisticsModel[0].TrTime;
        }
        else { //insert
            InvoiceModel.SlsInvType = InvoiceType; //  retail  or WholeSale      
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
        InvoiceModel.TrType = 3; //0 invoice 1 return
        InvoiceModel.SlsInvSrc = 1; // 1 from store 2 from van  
        InvoiceModel.StoreId = StoreID; //main store          
        InvoiceModel.PaymentMeansTypeCode = 1; //  Cash or   Credit
        InvoiceModel.RefTrID = null;
        ///////////////
        InvoiceModel.InvoiceID = GlobalinvoiceID;
        InvoiceModel.SalesmanId = null;
        InvoiceModel.StoreId = 1;
        InvoiceModel.TrDate = txtInvoiceDate.value;
        InvoiceModel.CustomerName = txtInvoiceCustomerName.value;
        InvoiceModel.CustomerMobileNo = txtCustomerMobile.value;
        InvoiceModel.CommitionAmount = 0;
        InvoiceModel.Remark = txt_Remarks.value;
        InvoiceModel.VatType = vatType;
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
        InvoiceModel.PurchaseorderNo = $('#txtPurchase_order_No').val();
        InvoiceModel.DeliveryDate = $('#txtDate_of_supply').val();
        InvoiceModel.DeliveryEndDate = $('#txtSupply_end_Date').val();
        InvoiceModel.TaxNotes = $('#txtTerms_of_Payment').val();
        InvoiceModel.ItemTotal = Number(txtTotalbefore.value);
        InvoiceModel.CashBoxID = null;
        InvoiceModel.IsCash = true;
        InvoiceModel.Status = 0;
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
                invoiceItemSingleModel.StockSoldQty = Number($('option:selected', $("#ddlTypeuom" + i)).attr('data-rate')) * Number($('#txtQuantity' + i).val()); //
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
                var VatNatID = Number($("#txtTax_Rate" + i).attr('data-VatNatID'));
                invoiceItemSingleModel.VatPrc = VatPrc; //$("#txtTax" + i).val();
                invoiceItemSingleModel.VatNatID = VatNatID;
                invoiceItemSingleModel.VatAmount = $("#txtTax" + i).val();
                invoiceItemSingleModel.ItemTotal = invoiceItemSingleModel.Unitprice * invoiceItemSingleModel.SoldQty;
                invoiceItemSingleModel.TotRetQty = $("#txtReturnQuantity" + i).val();
                invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                InvoiceItemsDetailsModel.push(invoiceItemSingleModel);
            }
            if (StatusFlag == "u") {
                var invoiceItemId = $("#InvoiceItemID" + i).val();
                invoiceItemSingleModel.InvoiceItemID = invoiceItemId;
                invoiceItemSingleModel.ItemID = $("#txt_ItemID" + i).val();
                invoiceItemSingleModel.Serial = $("#txtSerial" + i).val();
                invoiceItemSingleModel.SoldQty = $('#txtQuantity' + i).val();
                //invoiceItemSingleModel.StockSoldQty = Number($('option:selected', $("#ddlTypeuom" + i)).attr('data-onhandqty'));//
                invoiceItemSingleModel.StockSoldQty = Number($('option:selected', $("#ddlTypeuom" + i)).attr('data-rate')) * Number($('#txtQuantity' + i).val()); //
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
                var VatNatID = Number($("#txtTax_Rate" + i).attr('data-VatNatID'));
                invoiceItemSingleModel.VatPrc = VatPrc; //$("#txtTax" + i).val();
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
    function insert() {
        InvoiceModel.InvoiceID = 0;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("SlsTrSales", "InsertCustomerOrderDetail"),
            data: JSON.stringify(MasterDetailsModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    invoiceID = res.InvoiceID;
                    DisplayMassage(" تم ارسال فاتورة رقم  " + res.TrNo + " ", "An invoice number has been issued ", MessageType.Succeed);
                    btnAdd_onclick();
                    IsSuccess = true;
                }
                else {
                    IsSuccess = false;
                    DisplayMassage("الرجاء تحديث الصفحة واعادت تكرارالمحاولة مره اخري", "Please refresh the page and try again", MessageType.Error);
                }
            }
        });
    }
})(CustomerOrder || (CustomerOrder = {}));
//# sourceMappingURL=CustomerOrder.js.map