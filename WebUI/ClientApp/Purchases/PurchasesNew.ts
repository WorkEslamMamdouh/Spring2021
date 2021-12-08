
$(document).ready(() => {
    ////debugger;
    PurchasesNew.InitalizeComponent();
})

namespace PurchasesNew {
    //system varables
    var AccType = 3; //نوع الحساب
    //var SysSession: SystemSession = GetSystemSession();
    var compcode: Number;
    var BranchCode: Number;
    var Finyear: number;
    //var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession();
    var sys: SystemTools = new SystemTools();
    //Arrays                         
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);

    var CustomerDetails: Array<CUSTOMER> = new Array<CUSTOMER>();

    var Get_IQ_Purchases_Master: Array<IQ_Purchases_Master> = new Array<IQ_Purchases_Master>();
    var SearchDetails: Array<IQ_Purchases_Master> = new Array<IQ_Purchases_Master>();
    var Selected_Data: Array<IQ_Purchases_Master> = new Array<IQ_Purchases_Master>();
    var AllGetStokMasterDetail: Array<IQ_GetPurReceiveItem> = new Array<IQ_GetPurReceiveItem>();

    var FilterFamilyDetails: Array<CATEGRES> = new Array<CATEGRES>();
    var FamilyDetails: Array<CATEGRES> = new Array<CATEGRES>();
    var FamilyDetailsnew: Array<CATEGRES> = new Array<CATEGRES>();
    var ItemFamilyDetails: Array<PRODUCT> = new Array<PRODUCT>();
    var DetailsBar: Array<PRODUCT> = new Array<PRODUCT>();
    var ItemBaesdFamilyDetails: Array<PRODUCT> = new Array<PRODUCT>();
    var OperationItemModel: Array<IQ_Purchases_Details> = new Array<IQ_Purchases_Details>();
    var OperationItemSingleModel: IQ_Purchases_Details = new IQ_Purchases_Details();

    var PurMasterDetails: PurchasesMasterDetails = new PurchasesMasterDetails();

    var Purchases_Mas: Array<IQ_Purchases_Master> = new Array<IQ_Purchases_Master>();
    var storeDetails: Array<G_STORE> = new Array<G_STORE>();

    var UpdatedModel: Array<Purchases_Master> = new Array<Purchases_Master>();
    var FilteredModel: Array<Purchases_Master> = new Array<Purchases_Master>();
    var MasterDetailModel: PurReceiveMasterDetails = new PurReceiveMasterDetails();
    var ReceiveModel: I_Pur_TR_Receive = new I_Pur_TR_Receive();
    var ReceiveItemsDetailsModel: Array<I_Pur_TR_ReceiveItems> = new Array<I_Pur_TR_ReceiveItems>();
    var chargesDetailsModel: Array<I_Pur_Tr_ReceiveCharges> = new Array<I_Pur_Tr_ReceiveCharges>();
    var ReceiveItemSingleModel: I_Pur_TR_ReceiveItems = new I_Pur_TR_ReceiveItems();
    var ReceiveChargesSingleModel: I_Pur_Tr_ReceiveCharges = new I_Pur_Tr_ReceiveCharges();

    var GetAllVendorDetails: Array<Supplier> = new Array<Supplier>();
    var SearchVendorDetails: Array<Supplier> = new Array<Supplier>();
    var Detailsfamilly_Cat: Array<familly_Cat> = new Array<familly_Cat>();

    //DropDownlist

    var ddlStateType: HTMLSelectElement;

    var ddlVendor: HTMLSelectElement;

    var id_divGridDetails: HTMLDivElement;

    // giedView
    var divMasterGrid: JsGrid = new JsGrid();
    //Textboxes
    var txtFromDate: HTMLInputElement;
    var txtToDate: HTMLInputElement;
    var txtdateopening: HTMLInputElement;
    var txtDateHeader: HTMLInputElement;
    var txtNationality: HTMLSelectElement;
    var ddlStore: HTMLSelectElement;
    //buttons 
    var btnPresent: HTMLButtonElement;
    var btnClose: HTMLButtonElement;
    var btnOpen: HTMLButtonElement;
    var btnView_load: HTMLButtonElement;
    var btnExpenses: HTMLButtonElement;
    var btnShow: HTMLButtonElement;
    var btnadd: HTMLButtonElement;
    var btnprint: HTMLButtonElement;

    var btnUpdate: HTMLButtonElement;
    var btnSave: HTMLButtonElement;
    var btnBack: HTMLButtonElement;
    var btnSupplierSearch: HTMLButtonElement;
    var btnPaid_Up: HTMLButtonElement;


    //new
    var txtClose_Adjustment: HTMLInputElement;
    var txtClose_SalesManCommition: HTMLInputElement;
    var txtClose_CompanyCommitionPrc: HTMLInputElement;
    var txtTruckNumber: HTMLInputElement;
    var txtPaperPurchaseValue: HTMLInputElement;
    var txtPortName: HTMLInputElement;
    var btnAddDetails: HTMLButtonElement;
    var btnAddDetailsCharge: HTMLButtonElement;
    var btnAddDetailslebel: HTMLButtonElement;
    var searchbutmemreport: HTMLInputElement;
    var txtPaid_Up: HTMLInputElement;
    var txtTo_be_Paid: HTMLInputElement;   
    var btnPrint: HTMLButtonElement;
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement; 
    //flags 
    var CountGrid = 0;
    var CountItems = 0;
    var Qtys: number;
    var ID_Supp;
    var AddNew;
    var CashTot;
    var Success_Balance = true;
    var Bal = 0;
    var IsSuccess = false;
    var VatPrc = 0;
    var NumCnt = 0;
    var Tax_Rate = 0;
    var vatType: number;
    var Tax_Type_Model: Tax_Type = new Tax_Type();
    var ModeItmes = 3;
    var ReceiveID = 0;

    export function InitalizeComponent() {

        debugger
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        Finyear = Number(SysSession.CurrentEnvironment.CurrentYear);

        InitalizeControls();
        IntializeEvents();



        txtFromDate.value = SysSession.CurrentEnvironment.StartDate;
        txtToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;


        FillddlVendor();

        FillddlFamily();
        GetAllIItem();
        FillddlPaymentType();
        FillddlStore();
    }
    function InitalizeControls() {
        debugger

        if (SysSession.CurrentEnvironment.ScreenLanguage = "ar") {
            document.getElementById('Screen_name').innerHTML = "المشتريات";

        }
        else {
            document.getElementById('Screen_name').innerHTML = "Sales Invoices";
        }


        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        //Drop Downlists

        txtFromDate = document.getElementById("txtFromDate") as HTMLInputElement;
        txtToDate = document.getElementById("txtToDate") as HTMLInputElement;
        ddlVendor = document.getElementById("ddlVendor") as HTMLSelectElement;
        ddlStore = document.getElementById("ddlStore") as HTMLSelectElement;
        ddlStateType = document.getElementById("ddlStateType") as HTMLSelectElement;
        searchbutmemreport = document.getElementById("searchbutmemreport") as HTMLInputElement;
        txtPaid_Up = document.getElementById("txtPaid_Up") as HTMLInputElement;
        txtTo_be_Paid = document.getElementById("txtTo_be_Paid") as HTMLInputElement;   
        btnadd = document.getElementById("btnadd") as HTMLButtonElement;
        btnShow = document.getElementById("btnShow") as HTMLButtonElement;
        btnUpdate = document.getElementById("btnUpdate") as HTMLButtonElement;
        btnBack = document.getElementById("btnBack") as HTMLButtonElement;
        btnSave = document.getElementById("btnSave") as HTMLButtonElement;
        btnSupplierSearch = document.getElementById("btnSupplierSearch") as HTMLButtonElement;
        btnPaid_Up = document.getElementById("btnPaid_Up") as HTMLButtonElement;
        btnprint = document.getElementById("btnprint") as HTMLButtonElement; 
        btnAddDetails = document.getElementById("btnAddDetails") as HTMLButtonElement;
        btnPrint = document.getElementById("btnPrint") as HTMLButtonElement;
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;

    }
    function IntializeEvents() {

        searchbutmemreport.onkeydown = _SearchBox_Change;
        searchbutmemreport.onkeyup = _SearchBox_Change;


        btnShow.onclick = btnShow_onclick;
        btnUpdate.onclick = Update_onclick;
        btnBack.onclick = btnBack_onclick;
        btnSave.onclick = btnSave_onclick;
        btnadd.onclick = btnAdd_onclick;

        btnAddDetails.onclick = AddNewRow;

        btnSupplierSearch.onclick = Search;


        txtPaid_Up.onkeyup = txtPaid_Up_onchange;

        btnPaid_Up.onclick = btnExecute_onclick;
        btnPrint.onclick = () => { printreport(4) };
        btnPrintTrview.onclick = () => { printreport(1) };
        btnPrintTrPDF.onclick = () => { printreport(2) };
        btnPrintTrEXEL.onclick = () => { printreport(3) };  
    }

    function txtPaid_Up_onchange() {

        ComputeTotals();

        if (Number(txtTo_be_Paid.value) < 0) {

            MessageBox.Show("يجب ان يكون المبلغ المدفوع بيساوي الاجمالي", "خطأ");
            Errorinput($("#txtPaid_Up"));
            Errorinput($("#txtTo_be_Paid"));
            txtTo_be_Paid.value = '0';
            txtPaid_Up.value = $('#txtTotal').val();

        }

    }


    function GetDate() {
        debugger
        var today: Date = new Date();
        var dd: string = today.getDate().toString();
        var ReturnedDate: string;
        var mm: string = (today.getMonth() + 1).toString();
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
                    }

                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(storeDetails, ddlStore, "StoreId", "DescL", "Select Store");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(storeDetails, ddlStore, "StoreId", "DescA", "اختر المستودع");
                    }
                    SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlStore option[value="null"]').remove()) : $('#ddlStore').prop('selectedIndex', 1);
                }
            }
        });
    }
    function FillddlVendor() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Supplier", "GetAll"),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    GetAllVendorDetails = result.Response as Array<Supplier>;
                    DocumentActions.FillCombowithdefult(GetAllVendorDetails, ddlVendor, "ID_Supplier", "Name_Supplier", "اختر المورد");

                }
            }
        });
    }


    function btnShow_onclick() {

        $('#divMasterGridiv').removeClass('display_none');

        $("#rowData").addClass("display_none");
        $("#divTotalSatistics").addClass("display_none");

        Display();
        debugger
        if (ddlStateType.value == '0') {
            $('#btnPaid_Up').removeAttr('disabled');
            $('.Paid').removeAttr('disabled');

        }
        else {
            $('#btnPaid_Up').attr('disabled', 'disabled');
            $('.Paid').attr('disabled', 'disabled');
        }

    }

    function Display() {
        //debugger
        var startdt = DateFormatDataBes(txtFromDate.value).toString();
        var enddt = DateFormatDataBes(txtToDate.value).toString();
        var ID_Supplier = ddlVendor.value == "null" ? 0 : ddlVendor.value;
        var Type_Debit = ddlStateType.value;



        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Purchases", "GetAll_IQ_PurchasesMaster"),
            data: { startDate: startdt, endDate: enddt, ID_Supplier: Number(ID_Supplier), Type_Debit: Number(Type_Debit) },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Get_IQ_Purchases_Master = result.Response as Array<IQ_Purchases_Master>;
                    debugger
                    for (var i = 0; i < Get_IQ_Purchases_Master.length; i++) {
                        Get_IQ_Purchases_Master[i].Tr_Date = DateFormat(Get_IQ_Purchases_Master[i].Tr_Date);
                        //Get_IQ_Purchases_Master[i].Type_Supplier = DateFormat(Get_IQ_Purchases_Master[i].Tr_Date);

                        Get_IQ_Purchases_Master[i].Type_Debit_Name = Get_IQ_Purchases_Master[i].Type_Debit == false ? 'غير مسدد' : 'مسدد';


                    }
                    InitializeGrid();
                    divMasterGrid.DataSource = Get_IQ_Purchases_Master;
                    divMasterGrid.Bind();
                }
            }
        });
    }
    function _SearchBox_Change() {
        //  k//debugger;
        debugger
        if (searchbutmemreport.value != "") {



            let search: string = searchbutmemreport.value.toLowerCase();
            SearchDetails = Get_IQ_Purchases_Master.filter(x => x.TrNo.toString().search(search) >= 0 || x.Name_Supplier.toLowerCase().search(search) >= 0  /*|| x.PortName.toLowerCase().search(search) >= 0*/);

            divMasterGrid.DataSource = SearchDetails;
            divMasterGrid.Bind();
        } else {
            divMasterGrid.DataSource = Get_IQ_Purchases_Master;
            divMasterGrid.Bind();
        }
    }
    function InitializeGrid() {
        //$("#divMasterGrid").attr("style", "");
        let res: any = GetResourceList("");
        divMasterGrid.ElementName = "divMasterGrid";
        divMasterGrid.Paging = true;
        divMasterGrid.PageSize = 10;
        divMasterGrid.Sorting = true;
        divMasterGrid.InsertionMode = JsGridInsertionMode.Binding;
        divMasterGrid.Editing = false;
        divMasterGrid.Inserting = false;
        divMasterGrid.SelectedIndex = 1;
        divMasterGrid.OnRowDoubleClicked = MasterGridDoubleClick;
        divMasterGrid.PrimaryKey = "TrNo";
        divMasterGrid.Columns = [
            { title: "ID", name: "TrNo", type: "text", width: "2%", visible: false },
            { title: "رقم الفاتوره", name: "TrNo", type: "text", width: "10%" },
            { title: " التاريخ  ", name: "Tr_Date", type: "text", width: "18%" },
            { title: "المورد", name: "Name_Supplier", type: "text", width: "20%" },
            { title: "نوع التوريد", name: "Type_Supplier", type: "text", width: "20%" },
            { title: "الحاله", name: "Type_Debit_Name", type: "text", width: "13%" },
            { title: "اجمالي الفاتوره", name: "Total_Amount", type: "text", width: "16%" },
            { title: " المسداد", name: "Paid_Up", type: "text", width: "17%", css: "classfont" },
            { title: "المطلوب سداده", name: "To_be_Paid", type: "text", width: "17%", css: "classfont" },
            {
                title: "سداد نقدي ", css: "ColumPadding", name: "CashPaidAmount", width: "14%",
                itemTemplate: (s: string, item: IQ_Purchases_Master): HTMLInputElement => {
                    let txt: HTMLInputElement = CreateElement("number", "form-control Paid ", " ", " ", "", " ");
                    txt.id = "txtcash";
                    //txt.name = SlsInvoiceListModel.indexOf(item).toString();
                    //SlsInvoiceListModel = Grid.DataSource;
                    txt.style.height = "25px";
                    txt.style.width = "70px";
                    txt.style.backgroundColor = "blanchedalmond";

                    txt.onchange = (e) => {
                        item.CashPaidAmount = Number(txt.value);
                        CashTot = 0;
                        for (let i = 0; i < Purchases_Mas.length; i++) {
                            CashTot += Purchases_Mas[i].CashPaidAmount;
                        }
                        //txtCashTot.value = CashTot.toFixed(2).toString();

                    };

                    txt.value = '0';

                    //    txt.disabled = StatusFlag;
                    //if (item.CashPaidAmount != null) {
                    //    txt.value = item.CashPaidAmount.toString();
                    //}
                    //if (ddlStateType.value != "null") {
                    //    var status = Number(ddlStateType.value.toString());
                    //    if (status == 0) {
                    //        txt.disabled = false;
                    //    }
                    //    else if (status == 2 || status == 1) {
                    //        txt.disabled = true;
                    //    }
                    //}
                    return txt;
                }
            }
        ];

    }
    function btnExecute_onclick() {
        debugger
        Bal = 0;
        var ValidDataFlag = true;
        FilteredModel = divMasterGrid.DataSource;
        /////////
        for (let i = 0; i < FilteredModel.length; i++) {
            var cash: number = FilteredModel[i].CashPaidAmount;
            var Remain: number = FilteredModel[i].To_be_Paid;
            if (cash != 0 && cash != null) {
                if (Remain < cash) {
                    //  $("#btnExecute").attr("disabled", "disabled");

                    MessageBox.Show('يجب ان يكون المبلغ المطلوب سداده مساوي للسداد  للفاتورة رقم   ( ' + FilteredModel[i].TrNo + "  )", "تم");

                    ValidDataFlag = false;
                    break;
                }

                Bal += cash;

            }
        }


        Get_balance();// Chack Balance
        if (Success_Balance == false) {

            Success_Balance = true;
            ValidDataFlag = false;

        } else {

            if (ValidDataFlag == true) {
                ValidDataFlag = false;
                UpdatedModel = divMasterGrid.DataSource;
                UpdatedModel = UpdatedModel.filter(s => s.CashPaidAmount != 0 && s.CashPaidAmount != null);
                for (var i = 0; i < UpdatedModel.length; i++) {
                    var cash: number = UpdatedModel[i].CashPaidAmount;
                    var Paid_Up: number = UpdatedModel[i].Paid_Up;
                    var To_be_Paid: number = UpdatedModel[i].To_be_Paid;

                    UpdatedModel[i].Paid_Up = Paid_Up + cash;
                    UpdatedModel[i].To_be_Paid = To_be_Paid - cash;
                    UpdatedModel[i].Type_Debit = UpdatedModel[i].To_be_Paid == 0 ? true : false;

                }

                if (UpdatedModel.length > 0) {
                    console.log(UpdatedModel);
                    Ajax.Callsync({
                        type: "POST",
                        url: sys.apiUrl("Purchases", "UpdatePurchases_Master"),
                        data: JSON.stringify(UpdatedModel),
                        success: (d) => {
                            let result = d as BaseResponse;
                            if (result.IsSuccess) {
                                debugger
                                let res = result.Response
                                MessageBox.Show("تم الحفظ بنجاح", "تم");

                                btnBack_onclick();

                                //Display();
                                btnShow_onclick();
                                IsSuccess = true;

                            }
                            else {
                                MessageBox.Show("خطأء", "خطأء");

                            }
                        }
                    });
                }
                else {

                    MessageBox.Show('( لا توجد فواتير مسدده كي يتم التنفيذ )', "تم");

                }

            }

            if (IsSuccess != false) {
                Outpirce(Bal);
            }
        }

        ////////////////

    }


    function MasterGridDoubleClick() {
        Selected_Data = new Array<IQ_Purchases_Master>();

        Selected_Data = Get_IQ_Purchases_Master.filter(x => x.TrNo == Number(divMasterGrid.SelectedKey));

        ID_Supp = Selected_Data[0].ID_Supplier;
        $("#ddlStore").attr("disabled", "disabled");
        $("#ddlType").attr("disabled", "disabled");

       

        $("#ddlStore").addClass("display_none");
        $("#ddlType").addClass("display_none");


        $("#rowData").removeClass("display_none");
        $("#divTotalSatistics").removeClass("display_none");
        DisplayData(Selected_Data);
        ReceiveID = Selected_Data[0].ReceiveID;

    }
    function DisplayData(Selected_Data: Array<IQ_Purchases_Master>) {
        debugger

        DocumentActions.RenderFromModel(Selected_Data[0]);
        BindGetOperationItemsGridData(Selected_Data[0].ReceiveID);





    }
    function BindGetOperationItemsGridData(TrNo: number) {
        debugger
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Purchases", "GetAll_IQ_Purchases_DetailsNew"),
            data: { TrNo: TrNo },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    AllGetStokMasterDetail = result.Response as Array<IQ_GetPurReceiveItem>;

                    $("#div_Data").html('');
                    for (var i = 0; i < AllGetStokMasterDetail.length; i++) {

                        BuildControls(i);
                        Disbly_BuildControls(i, AllGetStokMasterDetail);
                        CountGrid++;
                    }

                    $("#txtItemCount").val(CountGrid);





                }
            }
        });
    }



    function FillddlPaymentType() {
        //var StkDefCategory: Array<CATEGRES> = new Array<CATEGRES>();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("familly_Cat", "GetAll"),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    debugger
                    Detailsfamilly_Cat = result.Response as Array<familly_Cat>;
                    //DocumentActions.FillCombowithdefult(Detailsfamilly_Cat, ddlVendor, "ID_Supplier", "Name_Supplier", "اختر المورد");

                }
            }
        });
    }
    function FillddlFamily() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Category", "GetAll"),
            data: {
                CompCode: 1
            },
            success: (d) => {
                //////debugger;
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    FamilyDetails = result.Response as Array<CATEGRES>;
                }
            }
        });
    }
    function GetAllIItem() {
        debugger
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Items", "GetAll"),//(int CompCode,int ItemFamilyID,int storeCode, string UserCode, string Token)
            data: {
                CompCode: 1
            },
            success: (d) => {
                ////////debugger;
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    ItemFamilyDetails = result.Response as Array<PRODUCT>;

                }
            }
        });
    }
    function FillddlItems(Name_CAT: string) {
        debugger
        FilterFamilyDetails = new Array<CATEGRES>();
        FilterFamilyDetails = FamilyDetails.filter(x => x.Name_CAT == Name_CAT);
        ItemBaesdFamilyDetails = ItemFamilyDetails.filter(x => x.ID_CAT == FilterFamilyDetails[0].ID_CAT);
        //Ajax.Callsync({
        //    type: "Get",
        //    url: sys.apiUrl("StkDefItems", "GetAll"),//(int CompCode,int ItemFamilyID,int storeCode, string UserCode, string Token)
        //    data: {
        //        CompCode: compcode, ItemFamilyID: ItemFamilyID, storeCode: storeCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
        //    },
        //    success: (d) => {
        //        //////debugger;
        //        let result = d as BaseResponse;
        //        if (result.IsSuccess) {

        //            ItemBaesdFamilyDetails = result.Response as Array<PRODUCT>;
        //        }
        //    }
        //});
    }


    function BuildControls(cnt: number) {
        var html;


        html = '<div id= "No_Row' + cnt + '" class="container-fluid style_border" > <div class="row " > <div class="col-lg-12" > ' +

            '<span id="btn_minus' + cnt + '" class="fa fa-minus-circle fontitm3SlsTrSalesManager2 display_none"></span>' +

            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0" style="width: 4%;">' +
            '<input id="txtSerial' + cnt + '" type="text" class="form-control input-sm input-sm right2" disabled /></div>' +

            '<input id="InvoiceItemID' + cnt + '" type="hidden" class="form-control input-sm right2 display_none"  />' +

            '<div class="  col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0" style="width: 11%;">' +

            '<input id="txtServiceCode' + cnt + '" name=""  disabled type="text" class="  col-lg-9 form-control input-sm  text_Display  " />' +
            '<button type="button" class="col-lg-3 src-btn  " id="btnSearchService' + cnt + '" disabled name="ColSearch">   ' +
            '<i class="fa fa-search  "></i></button>' +
            '</div>' +

            '<div class=" col-lg-3 col-md-3 col-sm-3 col-xl-3 col-xs-3 p-0">' +


            '<input id="txtServiceName' + cnt + '" name="FromDate" disabled  type="text" class="   form-control input-sm  text_Display"   />' +

            '</div>' +


            '<div class=" col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0">' +
            '<select disabled id="ddlTypeuom' + cnt + '" class="form-control input-sm"   style="width: 100%;border-radius: 30px;"><option value="null">الوحده</option></select> </div>' +

            '<div class=" col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0"><input type="number" disabled id="txtQuantity' + cnt + '" name="quant[1]" class="form-control input-sm   font1" value="1" min="1" max="1000" step="1"></div>' +

            '<div class="  col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0"  ><input type="number" disabled id="txtPrice' + cnt + '" name="quant[2]" class="form-control input-sm   font1" value="1" min="0" max="1000" step="0.5"></div>' +

            '<div class="  col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0"><input type="text"  disabled class="form-control input-sm" id="txtReturnQuantity' + cnt + '" name="quant[3]" class="form-control input-sm   font1" value="0" min="0" max="1000" step="1"></div>' +

            '<div class="  col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0"  ><input type="number" disabled id="txtTotal' + cnt + '" name="quant[2]" class="form-control input-sm   font1" value="0" min="0" max="1000" step="0.5"></div>' +


 
            '</div>' +

            '<input id="txt_StatusFlag' + cnt + '" name = " " type = "hidden" class="form-control"/><input id="txt_ItemID' + cnt + '" name = " " type = "hidden" class="form-control"/><input id="txt_ID' + cnt + '" name = " " type = "hidden" class="form-control" />';
        $("#div_Data").append(html);



        //Search Region
        //// First Search
        $('#btnSearchService' + cnt).click(function (e) {
            debugger
            let sys: SystemTools = new SystemTools();
            let GetItemInfo: Array<Iproc_GetItemInfo_Result> = new Array<Iproc_GetItemInfo_Result>();
            NumCnt = cnt;
            //var Storeid = Number($("#ddlStore").val());
            var Storeid = Number(ddlStore.value);
            sys.ShowItems(Number(SysSession.CurrentEnvironment.BranchCode), Storeid, $('#txtServiceName' + cnt).val(), $('#txtServiceCode' + cnt).val(), ModeItmes, () => {
                let id = sysInternal_Comm.Itemid;
                debugger
                if (!validationitem(id, Number($("#txt_ItemID" + NumCnt + "").val()))) return

                $("#txt_ItemID" + NumCnt + "").val(id);
                let ItemCode = '';
                let ItemID = id;
                let Mode = ModeItmes;
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
                                //$('#txtPrice' + NumCnt + '').val(GetItemInfo[0].UnitPrice);
                                $('#txtQuantity' + NumCnt + '').val('1');
                                $('#txtPrice' + NumCnt + '').val("0");
                                //$('#txtNetUnitPrice' + NumCnt + '').val(GetItemInfo[0].UnitPrice);

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
            //var Storeid = Number($("#ddlStore").val());
            var Storeid = Number(ddlStore.value);
            let ItemCode = $("#txtServiceCode" + cnt).val();
            let ItemID = 0;
            let Mode = ModeItmes;
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

            if ($("#txt_StatusFlag" + cnt).val() != "i") {
                $("#txt_StatusFlag" + cnt).val("u");
            }
            let total = Number($("#txtQuantity" + cnt).val()) * Number($("#txtPrice" + cnt).val());
            let vatAmount = (Number(total) * Number($("#txtTax_Rate" + cnt).val())) / 100;
            let totalAfterVat = Number(vatAmount.toFixed(2)) + Number(total.toFixed(2));
            $('#txtTax_Rate' + cnt).val(Tax_Rate);
            VatPrc = $("#txtTax_Rate" + cnt).val();
            $("#txtTax" + cnt).val(vatAmount.toFixed(2));
            $("#txtTotal" + cnt).val(total.toFixed(2));
            $("#txtTotAfterTax" + cnt).val(totalAfterVat.toFixed(2));
            $("#txtDiscountAmount" + cnt).val(((Number($("#txtDiscountPrc" + cnt).val()) * Number($("#txtPrice" + cnt).val())) / 100).toFixed(2));
            $("#txtNetUnitPrice" + cnt).val((Number($("#txtPrice" + cnt).val()) - ((Number($("#txtDiscountPrc" + cnt).val()) * Number($("#txtPrice" + cnt).val())) / 100)));
            //totalRow(cnt);

            ComputeTotals();

        });

        $("#txtPrice" + cnt).on('keyup', function () {

            if ($("#txt_StatusFlag" + cnt).val() != "i") {
                $("#txt_StatusFlag" + cnt).val("u");
            }
            let total = Number($("#txtQuantity" + cnt).val()) * Number($("#txtPrice" + cnt).val());
            let vatAmount = (Number(total) * Number($("#txtTax_Rate" + cnt).val())) / 100;
            let totalAfterVat = Number(vatAmount.toFixed(2)) + Number(total.toFixed(2));
            $('#txtTax_Rate' + cnt).val(Tax_Rate);
            VatPrc = $("#txtTax_Rate" + cnt).val();
            $("#txtTax" + cnt).val(vatAmount.toFixed(2));
            $("#txtTotal" + cnt).val(total.toFixed(2));
            $("#txtTotAfterTax" + cnt).val(totalAfterVat.toFixed(2));
            $("#txtDiscountAmount" + cnt).val(((Number($("#txtDiscountPrc" + cnt).val()) * Number($("#txtPrice" + cnt).val())) / 100).toFixed(2));
            $("#txtNetUnitPrice" + cnt).val((Number($("#txtPrice" + cnt).val()) - ((Number($("#txtDiscountPrc" + cnt).val()) * Number($("#txtPrice" + cnt).val())) / 100)));
            //totalRow(cnt);

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

        return;
    }
    function Disbly_BuildControls(cnt: number, SlsInvoiceItemsDetails: Array<IQ_GetPurReceiveItem>) {
        debugger
        $("#btnAddDetails").addClass("display_none");
        $("#btn_minus" + cnt).addClass("display_none");
        $("#txt_StatusFlag" + cnt).val("");
        $("#txtSerial" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].Serial);
        $("#txtQuantity" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].RecQty);
        $("#txtServiceCode" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].it_itemCode);
        $("#txtServiceName" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].it_DescA);
        $("#txtPrice" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].RecUnitPrice);
        $("#txtTax_Rate" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].VatPrc);
        $("#txtReturnQuantity" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].TotRetQty);
        $("#txtTax" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].VatAmount.toFixed(2));
        $("#txt_ItemID" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].ItemID);
        $("#txtTotal" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].NetUnitCost);
        filldlltypeuom(cnt, SlsInvoiceItemsDetails);

    }
    function filldlltypeuom(cnt: number, SlsInvoiceItemsDetails: Array<IQ_GetPurReceiveItem>) {


        var Storeid = Number(ddlStore.value);
        let ItemCode = '';
        let ItemID = SlsInvoiceItemsDetails[cnt].ItemID;
        let Mode = ModeItmes;
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
    function AddNewRow() {
        debugger
        //if (!SysSession.CurrentPrivileges.AddNew) return;
        var CanAdd: boolean = true;
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
            BuildControls(CountGrid);
            $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode         
            $("#txtServiceCode" + CountGrid).removeAttr("disabled");
            $("#btnSearchService" + CountGrid).removeAttr("disabled");
            $("#txtQuantity" + CountGrid).removeAttr("disabled");
            $("#txtPrice" + CountGrid).removeAttr("disabled");
            $("#ddlTypeuom" + CountGrid).removeAttr("disabled");
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");
            CountGrid++;
            Insert_Serial();
            ComputeTotals();
        }
    }
    function DeleteRow(RecNo: number) {
        if (!SysSession.CurrentPrivileges.Remove) return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => {
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
    function checkRepeatedItems(itemValue: number, familyValue: number) {
        debugger
        var items: number = Number(CountGrid);//Error
        var flag = false;
        for (let i = 0; i < items; i++) {
            if (Number($("#ddlItem" + i).val()) == itemValue && Number($("#ddlFamily" + i).val()) == familyValue) {
                flag = true;
            }
        }
        return flag;
    }
    function ComputeTotals() {

        var CountTotal = 0;
        var ItemCount = 0;

        for (let i = 0; i < CountGrid; i++) {
            var flagvalue = $("#txt_StatusFlag" + i).val();
            if (flagvalue != "d" && flagvalue != "m") {

                CountTotal += Number($("#txtTotal" + i).val());
                CountTotal = Number(CountTotal.toFixed(2).toString());
                ItemCount += 1;
            }
        }

        $("#txtItemCount").val(ItemCount);
        $("#txtTotal").val(CountTotal);

        var To_be_Paid = Number(CountTotal - Number($("#txtPaid_Up").val() == null ? 0 : $("#txtPaid_Up").val()));

        $("#txtTo_be_Paid").val(To_be_Paid)


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


    function validationitem(id: number, idRow: number) {
        for (var i = 0; i < CountGrid; i++) {

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



    function Validation_Grid(rowcount: number) {
        //else
        debugger
        if (($("#txt_StatusFlag" + rowcount).val() == 'd') || ($("#txt_StatusFlag" + rowcount).val() == 'm')) {
            return true;

        }
        else {

            if ($("#ddlfamilly_Cat" + rowcount).val() == "Null" && ($("#txt_StatusFlag" + rowcount).val() != 'd')) {

                MessageBox.Show(" برجاء أختيار نوع الفئة", "خطأ");
                Errorinput($("#ddlfamilly_Cat" + rowcount));


                return false
            }
            else if ($("#Family" + rowcount).val() == "" && ($("#txt_StatusFlag" + rowcount).val() != 'd')) {

                MessageBox.Show(" برجاءادخال الفئة", "خطأ");
                Errorinput($("#Family" + rowcount));


                return false
            }
            else if (($("#Items" + rowcount).val() == "" || $("#ddlItem" + rowcount).val() == "الصنف") && ($("#txt_StatusFlag" + rowcount).val() != 'd')) {

                MessageBox.Show(" برجاءادخال الصنف", "خطأ");
                Errorinput($("#Items" + rowcount));
                Errorinput($("#ddlItem" + rowcount));

                return false
            }
            else if (($("#txtQuantity" + rowcount).val() == "" || $("#txtQuantity" + rowcount).val() <= 0) && ($("#txt_StatusFlag" + rowcount).val() != 'd')) {

                MessageBox.Show(" برجاءادخال الكمية", "خطأ");
                Errorinput($("#txtQuantity" + rowcount));


                return false
            }
            else if (($("#txtPrice" + rowcount).val() == "" || $("#txtPrice" + rowcount).val() == "0" || $("#txtPrice" + rowcount).val() == 0) && ($("#txt_StatusFlag" + rowcount).val() != 'd')) {

                MessageBox.Show("  برجاءادخال السعر الشراء", "خطأ");
                Errorinput($("#txtPrice" + rowcount));

                return false
            }
            else if (($("#Sales_Price" + rowcount).val() == "" || $("#Sales_Price" + rowcount).val() == 0) && ($("#txt_StatusFlag" + rowcount).val() != 'd')) {

                MessageBox.Show("  برجاءادخال السعر البيع ", "خطأ");
                Errorinput($("#Sales_Price" + rowcount));


                return false
            }
            else if (($("#MinUnitPrice" + rowcount).val() == "" || $("#MinUnitPrice" + rowcount).val() == 0) && ($("#txt_StatusFlag" + rowcount).val() != 'd')) {

                MessageBox.Show(" برجاءادخال السعر اقل سعر بيع", "خطأ");
                Errorinput($("#MinUnitPrice" + rowcount));


                return false
            }

        }
        return true;

    }

    ////-----------------------------------------------------------------------------------------------------------------------

    //---------------------------------------------------------------------------------------------------------------------------
    function AssignNew() {

        var StatusFlag: String;
        ReceiveModel = new I_Pur_TR_Receive();
        ReceiveItemsDetailsModel = new Array<I_Pur_TR_ReceiveItems>();
        chargesDetailsModel = new Array<I_Pur_Tr_ReceiveCharges>();

        MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;

        ReceiveModel.CompCode = Number(compcode);
        ReceiveModel.BranchCode = Number(BranchCode);

        /// if come from PurOrder

        ReceiveModel.StoreID = Number(ddlStore.value);//main store
        ReceiveModel.IsCash = $('#ddlType').val() == '1' ? true : false;

        ReceiveModel.ReceiveID = ReceiveID;
        ReceiveModel.TrType = 0//0 invoice 1 return
        ReceiveModel.PurRecType = 1; //  retail PurRecType 
        ReceiveModel.TrDate = $('#txtDate').val();
        ReceiveModel.Status = 1;
        ReceiveModel.SalesmanId = 0;
        ReceiveModel.VendorID = 0;
        ReceiveModel.VendorInvNo = "";
        ReceiveModel.VATType = 1;
        ReceiveModel.CurrencyID = 1;
        ReceiveModel.CurrencyRate = 1;
        ReceiveModel.TotalFC = 1;
        ReceiveModel.Remarks = "";


        ReceiveModel.NetAdditionVat = 0;
        ReceiveModel.NetAdditionCost = 0;
        ReceiveModel.NetDue = 0;
        ReceiveModel.VatAmount = 0;
        ReceiveModel.Total = Number($('#txtTotal').val());

        debugger
        // Details Receive items
        for (var i = 0; i < CountGrid; i++) {
            ReceiveItemSingleModel = new I_Pur_TR_ReceiveItems();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            debugger

            if (StatusFlag == "i") {

                ReceiveItemSingleModel.ReciveDetailsID = 0;
                ReceiveItemSingleModel.StatusFlag = StatusFlag.toString();
                ReceiveItemSingleModel.ItemID = $('#txt_ItemID' + i).val();
                ReceiveItemSingleModel.UnitID = $('#ddlTypeuom' + i).val();
                ReceiveItemSingleModel.RecQty = $('#txtQuantity' + i).val();


                let Rate_data = Number($('option:selected', $("#ddlTypeuom" + i)).attr('data-rate'));

                let stockqty: number = (Number($('#txtQuantity' + i).val()) * Number(Rate_data));

                ReceiveItemSingleModel.Serial = $("#txtSerial" + i).val();
                ReceiveItemSingleModel.RecStockQty = stockqty;//
                ReceiveItemSingleModel.StockUnitCost = $("#txtPrice" + i).val();//
                ReceiveItemSingleModel.TotRetQty = $("#txtQuantityReturnValue" + i).val();
                ReceiveItemSingleModel.ReceiveRecQty = Number($('#txtQuantity' + i).val());
                ReceiveItemSingleModel.RecUnitPrice = $("#txtPrice" + i).val();
                ReceiveItemSingleModel.VatPrc = VatPrc;//$("#txtTax" + i).val();txtTotal
                ReceiveItemSingleModel.VatAmount = $("#txtTax" + i).val();
                ReceiveItemSingleModel.NetUnitCost = $("#txtTotal" + i).val();
                ReceiveItemSingleModel.RecUnitPriceFC = $("#txtPrice" + i).val();
                ReceiveItemSingleModel.UnitAddCost = 1;


                ReceiveItemsDetailsModel.push(ReceiveItemSingleModel);

            }
            if (StatusFlag == "u") {

                var RecItemId = $("#ReciveDetailsID" + i).val()
                ReceiveItemSingleModel.ReciveDetailsID = RecItemId;
                ReceiveItemSingleModel.StatusFlag = StatusFlag.toString();
                ReceiveItemSingleModel.ItemID = $('#txt_ItemID' + i).val();
                ReceiveItemSingleModel.UnitID = $('#ddlTypeuom' + i).val();
                ReceiveItemSingleModel.RecQty = Number($('#txtQuantity' + i).val());

                let Rate_data = Number($('option:selected', $("#ddlTypeuom" + i)).attr('data-rate'));

                let stockqty: number = (Number($('#txtQuantity' + i).val()) * Number(Rate_data));

                ReceiveItemSingleModel.Serial = $("#txtSerial" + i).val();
                ReceiveItemSingleModel.RecStockQty = stockqty;//
                ReceiveItemSingleModel.StockUnitCost = $("#txtPrice" + i).val();//
                ReceiveItemSingleModel.TotRetQty = $("#txtQuantityReturnValue" + i).val();
                ReceiveItemSingleModel.ReceiveRecQty = Number($('#txtQuantity' + i).val());
                ReceiveItemSingleModel.RecUnitPrice = $("#txtPrice" + i).val();
                ReceiveItemSingleModel.VatPrc = VatPrc;//$("#txtTax" + i).val();txtTotal
                ReceiveItemSingleModel.VatAmount = $("#txtTax" + i).val();
                ReceiveItemSingleModel.NetUnitCost = $("#txtTotal" + i).val();
                ReceiveItemSingleModel.RecUnitPriceFC = $("#txtPrice" + i).val();
                ReceiveItemSingleModel.UnitAddCost = 1;

                ReceiveItemsDetailsModel.push(ReceiveItemSingleModel);

            }
            if (StatusFlag == "d") {
                if ($("#ReciveDetailsID" + i).val() != "") {
                    var deletedID = $("#ReciveDetailsID" + i).val();
                    ReceiveItemSingleModel.StatusFlag = StatusFlag.toString();
                    ReceiveItemSingleModel.ReciveDetailsID = deletedID;
                    ReceiveItemsDetailsModel.push(ReceiveItemSingleModel);
                }
            }
        }

        // Details Receive charges
        if (AddNew == true) {

            ReceiveChargesSingleModel = new I_Pur_Tr_ReceiveCharges();
            ReceiveChargesSingleModel.ReceiveID = 0;
            ReceiveChargesSingleModel.Amount = 1;
            ReceiveChargesSingleModel.ChargeID = 3;
            ReceiveChargesSingleModel.isPaidByVendor = true;
            ReceiveChargesSingleModel.NetAtferVat = Number($('#txtTotal').val());
            chargesDetailsModel.push(ReceiveChargesSingleModel)
        }

        MasterDetailModel.I_Pur_TR_Receive = ReceiveModel;
        MasterDetailModel.I_Pur_TR_ReceiveItems = ReceiveItemsDetailsModel;
        MasterDetailModel.I_Pur_Tr_ReceiveCharges = chargesDetailsModel;//I_Pur_Tr_ReceiveCharges
    }
    function InsertNew() {

        MasterDetailModel.I_Pur_TR_Receive.PurOrderID = 0;
        MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailModel.I_Pur_TR_Receive.CreatedBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.I_Pur_TR_Receive.CreatedAt = DateTimeFormat(Date().toString());
        debugger
        console.log(MasterDetailModel);
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("Purchases", "InsertPurchaseReceiveMasterDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    let res = result.Response as PurReceiveMasterDetails;
                    DisplayMassage(" تم اصدار  فاتورة رقم  " + res.I_Pur_TR_Receive.TrNo + " ", "invoice number" + res.I_Pur_TR_Receive.TrNo + "has been issued", MessageType.Succeed);


                } else {

                    DisplayMassage(" هناك خطـأ  ", "Error", MessageType.Error);
                }
            }
        });

    }
    function UpdateNew() {

        MasterDetailModel.I_Pur_TR_Receive.PurOrderID = 0;
        MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailModel.I_Pur_TR_Receive.CreatedBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.I_Pur_TR_Receive.CreatedAt = DateTimeFormat(Date().toString());
        debugger
        console.log(MasterDetailModel);
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("Purchases", "UpdateListPurchaseReceiveMasterDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    let res = result.Response as PurReceiveMasterDetails;
                    DisplayMassage(" تم تعديل  فاتورة رقم  " + $('#txtNumber').val() + " ", "invoice number" + res.I_Pur_TR_Receive.TrNo + "has been issued", MessageType.Succeed);


                } else {

                    DisplayMassage(" هناك خطـأ  ", "Error", MessageType.Error);
                }
            }
        });

    }
    ////----------------------------------------------------- Div_items-------------------------------------------------------
    function Assign() {

        debugger;
        PurMasterDetails = new PurchasesMasterDetails();
        Bal = 0;
        DocumentActions.AssignToModel(PurMasterDetails.Purchases_Master);
        PurMasterDetails.Purchases_Master.TrNo = Number($('#txtNumber').val());
        PurMasterDetails.Purchases_Master.Tr_Date = $('#txtDate').val();
        PurMasterDetails.Purchases_Master.ID_Supplier = Number(ID_Supp);
        PurMasterDetails.Purchases_Master.Type_Debit = Number(txtTo_be_Paid.value) == 0 ? true : false;
        PurMasterDetails.Purchases_Master.Total_Amount = Number($('#txtTotal').val());
        PurMasterDetails.Purchases_Master.Paid_Up = Number($('#txtPaid_Up').val());
        PurMasterDetails.Purchases_Master.To_be_Paid = Number($('#txtTo_be_Paid').val());
        PurMasterDetails.Purchases_Master.REMARKS = $('#txtRemarks').val();
        Bal = Number($('#txtPaid_Up').val());





    }
    function Update() {
        debugger
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("Purchases", "Insert_PurchasesNew"),
            data: JSON.stringify(PurMasterDetails),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    debugger
                    let res = result.Response

                    if (AddNew == true) {
                        AssignNew();
                        InsertNew();
                    }
                    else {
                        AssignNew();
                        UpdateNew();
                    }



                    //MessageBox.Show("تم الحفظ بنجاح", "تم");


                    btnBack_onclick();

                    //Display();
                    btnShow_onclick();

                    Selected_Data = new Array<IQ_Purchases_Master>();

                    Selected_Data = Get_IQ_Purchases_Master.filter(x => x.TrNo == Number(res));

                    ID_Supp = Selected_Data[0].ID_Supplier;

                    $("#rowData").removeClass("display_none");
                    $("#divTotalSatistics").removeClass("display_none");
                    DisplayData(Selected_Data);

                    IsSuccess = true;

                }
                else {

                    IsSuccess = false;

                    MessageBox.Show("خطأء", "خطأء");

                }
            }
        });

    }
    function Get_balance() {

        Success_Balance = true;

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Outletpirce", "Get_Balance"),
            success: (d) => {
                debugger
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    var Balance = result.Response;

                    if (Balance < Number(Bal)) {
                        MessageBox.Show('لا يوجد مبلغ كافي لاتمام الشراء ( المبلغ المتواجد ( ' + Balance + ' )ج ) ', '');

                        Success_Balance = false;
                    }

                }
                else {
                    Success_Balance = false;



                }
            }
        });



    }
    function Outpirce(pirce: number) {

        let Tr_Type = 'مشتريات';
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Outletpirce", "Insert"),
            data: { Dasc_Name: "مشتريات", pirce: pirce, UserName: SysSession.CurrentEnvironment.UserCode, Tr_Type },
            success: (d) => {
                debugger
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    var Outlet = result.Response;
                    if (Outlet == pirce) {


                    }
                    else {
                        MessageBox.Show(" خطأ لا يوجد مبلغ كافي  (" + Outlet + ")", "خطأ");
                    }

                }
                else {

                    MessageBox.Show(result.ErrorMessage, "خطأ");
                }
            }
        });


    }
    function Enter_Money(pirce: number) {


        var Dasc_Name = 'مشتريات';
        var Tr_Type = "مرتجع مشتريات";
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Outletpirce", "Insert_Enter_Money"),
            data: { Dasc_Name: Dasc_Name, pirce: pirce, UserName: SysSession.CurrentEnvironment.UserCode, Tr_Type: Tr_Type },
            success: (d) => {
                debugger
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    var Outlet = result.Response;
                }
                else {

                    MessageBox.Show(result.ErrorMessage, "خطأ");
                }
            }
        });
    }
    ////----------------------------------------------------------------------------------------------------------------------------


    ////-------------------------------------------------------button---Save and Back and Eidt-------------------------------------- 
    function btnAdd_onclick() {

        AddNew = true;



        btnUpdate.classList.add("display_none");
        btnSave.classList.remove("display_none");
        btnBack.classList.remove("display_none");

        $("#DivShow").removeClass("disabledDiv");
        //$("#DivHederMaster").attr("disabled", "disabled").off('click');
        $("#DivHederMaster").addClass("disabledDiv");

        $(".fontitm3").removeClass("display_none");
        $("#btnAddDetails").removeClass("display_none");

        //remove_disabled_Grid_Controls();

        $("#ddlStore").removeClass("display_none");
        $("#ddlType").removeClass("display_none");

        $("#txtDate").removeAttr("disabled");
        $("#ddlStore").removeAttr("disabled");
        $("#ddlType").removeAttr("disabled");
        $("#txtPaid_Up").removeAttr("disabled");
        //$("#txtTo_be_Paid").removeAttr("disabled");
        $("#txtRemarks").removeAttr("disabled");
        $("#div_Data").html("");

        btnSupplierSearch.disabled = false;

        clear();

        $("#txtDate").val(GetDate());
        CountGrid = 0;
        CountItems = 0;

        $("#rowData").removeClass("display_none");
        $("#divTotalSatistics").removeClass("display_none");

        ID_Supp = 0;
    }
    function Update_onclick() {

        AddNew = false;

        btnUpdate.classList.add("display_none");
        btnSave.classList.remove("display_none");
        btnBack.classList.remove("display_none");

        $("#DivShow").removeClass("disabledDiv");
        //$("#DivHederMaster").attr("disabled", "disabled").off('click');
        $("#DivHederMaster").addClass("disabledDiv");

        $(".fontitm3").removeClass("display_none");
        //$("#btnAddDetails").removeClass("display_none");

        $("#txtDate").removeAttr("disabled");
        //$("#txtPaid_Up").removeAttr("disabled");
        //$("#txtTo_be_Paid").removeAttr("disabled");
        $("#txtRemarks").removeAttr("disabled");
        $("#ddlStore").removeAttr("disabled");
        $("#ddlType").removeAttr("disabled");
        //remove_disabled_Grid_Controls();
 

    }
    function btnBack_onclick() {
        if (AddNew == true) {
            $("#DivHederMaster").removeClass("disabledDiv");

            $("#btnAddDetails").addClass("display_none");
            btnUpdate.classList.remove("display_none");
            btnSave.classList.add("display_none");
            btnBack.classList.add("display_none");
            $("#div_Data").html('');
            CountGrid = 0;
            CountItems = 0;
            clear();
            disabled_Grid_Controls();

            $("#rowData").addClass("display_none");
            $("#divTotalSatistics").addClass("display_none");
        }
        else {


            $("#DivHederMaster").removeClass("disabledDiv");

            $("#btnAddDetails").addClass("display_none");
            btnUpdate.classList.remove("display_none");
            btnSave.classList.add("display_none");
            btnBack.classList.add("display_none");
            $("#div_Data").html('');
            CountGrid = 0;
            for (var i = 0; i < AllGetStokMasterDetail.length; i++) {

                BuildControls(i);
                Disbly_BuildControls(i, AllGetStokMasterDetail);
                CountGrid++;
            }

            disabled_Grid_Controls();

            DocumentActions.RenderFromModel(Selected_Data[0]);
        }
        $("#ddlStore").attr("disabled", "disabled");
        $("#ddlType").attr("disabled", "disabled");
        ComputeTotals();
    }
    function btnSave_onclick() {
        //alert('ok');
        debugger
        if (ID_Supp == 0) {

            MessageBox.Show(" برجاءادخال المورد ", "خطأ");
            Errorinput($("#btnSupplierSearch"));
            Errorinput($("#txtName_Supplier"));

            return false
        }
        if (CountGrid == 0) {

            MessageBox.Show(" برجاءادخال الاصناف ", "خطأ");
            Errorinput($("#btnAddDetails"));


            return false
        }
        //if (Number($("#txtPaid_Up").val()) <= 0 || $("#txtPaid_Up").val() == null || $("#txtPaid_Up").val() == "" || $("#txtPaid_Up").val() == " ") {

        //    MessageBox.Show(" برجاءادخال المبلغ المدفوع", "خطأ");
        //    Errorinput($("#txtPaid_Up"));


        //    return false
        //}

        else {

            var CanAdd: boolean = true;
            if (CountGrid > 0) {

                for (var i = 0; i <= CountGrid; i++) {
                    CanAdd = Validation_Grid(i);
                    if (CanAdd == false) {
                        break;
                    }
                }
            }
            if (CanAdd) {//add
                debugger
                IsSuccess = false;
                if ($('#txtNumber').val() == '') {

                    //alert('Add');
                    Assign();
                    Get_balance();
                    if (Success_Balance == false) {

                        Success_Balance = true;
                        return
                    } else {

                        Update();




                        if (IsSuccess != false) {
                            Outpirce(Bal);
                        }
                    }


                }
                else {//Edit

                    if (Number($("#txtTo_be_Paid").val()) < 0) {

                        let Paid = Number($("#txtTo_be_Paid").val()) * -1;

                        WorningMessage(" برجاءاستلام (" + Paid + ")ج من المورد ", "Do you want to delete?", "تحذير", "worning", () => {

                            $("#txtPaid_Up").val((Number($("#txtPaid_Up").val()) - Paid).toString());
                            $("#txtTo_be_Paid").val(0);
                            Assign();
                            Update();
                            if (IsSuccess != false) {
                                Enter_Money(Paid);
                            }
                        });

                    }
                    else {
                        Assign();
                        Update();
                    }


                }

            }
        }

    }
    function Search() {

        let sys: SystemTools = new SystemTools();
        sys.FindKey(Modules.Purchases, "btnSupplierSearch", "", () => {
            let ID_Supplier = SearchGrid.SearchDataGrid.SelectedKey;
            ID_Supp = ID_Supplier;
            //alert(id);
            SearchVendorDetails = GetAllVendorDetails.filter(x => x.ID_Supplier == Number(ID_Supplier));
            DocumentActions.RenderFromModel(SearchVendorDetails[0]);

            //GetAllVendorDetails
            //btnAddReturn_onclick();
            //$("#ddlVendorDetails").attr("disabled", "disabled");
            //$("#ddlReturnTypeShow").attr("disabled", "disabled");
            //$("#ddlFreeSalesman").attr("disabled", "disabled");
        });

    }
    function clear() {
        $('#txtNumber').val('');
        $('#txtName_Supplier').val('');
        $('#txtType_Supplier').val('');
        $('#txtPHONE').val('');
        $('#txtPaid_Up').val('');
        $('#txtTo_be_Paid').val('');
        $('#txtRemarks').val('');
        $('#txtTotal').val('');
        $('#txtItemCount').val('');


    }
    function remove_disabled_Grid_Controls() {

        $("#txtDate").removeAttr("disabled");
        $("#txtPaid_Up").removeAttr("disabled");
        //$("#txtTo_be_Paid").removeAttr("disabled");
        $("#txtRemarks").removeAttr("disabled");


        for (var i = 0; i < CountGrid; i++) {
            $("#ddlfamilly_Cat" + i).removeAttr("disabled");
            $("#Family" + i).removeAttr("disabled");
            $("#Items" + i).removeAttr("disabled");
            $("#txtQuantity" + i).removeAttr("disabled");
            $("#txtPrice" + i).removeAttr("disabled");
            $("#Sales_Price" + i).removeAttr("disabled");
            $("#MinUnitPrice" + i).removeAttr("disabled");
            $("#txt_StatusFlag" + i).val("");

            //$("#txtTotal" + i).removeAttr("disabled");

        }
    }
    function disabled_Grid_Controls() {

        btnSupplierSearch.disabled = true;

        $("#txtDate").attr("disabled", "disabled");
        $("#txtPaid_Up").attr("disabled", "disabled");
        $("#txtTo_be_Paid").attr("disabled", "disabled");
        $("#txtRemarks").attr("disabled", "disabled");

        for (var i = 0; i < CountGrid; i++) {

            $("#ddlfamilly_Cat" + i).attr("disabled", "disabled");
            $("#Family" + i).attr("disabled", "disabled");
            $("#Items" + i).attr("disabled", "disabled");
            $("#txtQuantity" + i).attr("disabled", "disabled");
            $("#txtQuantityRetrun" + i).attr("disabled", "disabled");
            $("#txtPrice" + i).attr("disabled", "disabled");
            $("#Sales_Price" + i).attr("disabled", "disabled");
            $("#txtMinPrice" + i).attr("disabled", "disabled");
            $("#txt_StatusFlag" + i).val("");

            //$("#txtScrapQty" + i).attr("disabled", "disabled");
        }
    }


    function printreport(type: number) {
        debugger;
        let _StockList: Array<Settings_Report> = new Array<Settings_Report>();
        let _Stock: Settings_Report = new Settings_Report();
        _Stock.Type_Print = type;
        _Stock.ID_Button_Print = 'Purchases';
        _Stock.Parameter_1 = $('#txtNumber').val();
        //_Stock.Parameter_2 = "";
        //_Stock.Parameter_3 = "";
        //_Stock.Parameter_4 = "";
        //_Stock.Parameter_5 = "";
        //_Stock.Parameter_6 = "";
        //_Stock.Parameter_7 = "";
        //_Stock.Parameter_8 = "";
        //_Stock.Parameter_9 = "";


        _StockList.push(_Stock);

        let rp: ReportParameters = new ReportParameters();

        rp.Data_Report = JSON.stringify(_StockList);//output report as View

        debugger
        Ajax.Callsync({
            url: Url.Action("Data_Report_Open", "GeneralReports"),
            data: rp,
            success: (d) => {
                debugger
                let result = d.result as string;


                window.open(result, "_blank");
            }
        })








    }

}