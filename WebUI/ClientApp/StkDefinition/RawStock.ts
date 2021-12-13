﻿
$(document).ready(() => {
    //debugger;
    RawStock.InitalizeComponent();
})

namespace RawStock {
    var TypeStock: string = "0";
    var TypeTrans: string = "1";
   
    var sys: SystemTools = new SystemTools();
    var ReportGrid: JsGrid = new JsGrid();
    var SysSession: SystemSession = GetSystemSession();

    var detailstock: Array<IQ_GetItemStore> = new Array<IQ_GetItemStore>();
    var Selected_Data: Array<IQ_GetItemStore> = new Array<IQ_GetItemStore>();
    var Branch: Number;
    var startDate: string;
    var EndDate: string;
    var FinYear: number;
    var numcnt: number;
    var id: number = 0;
    var TransferID: number = 0;
    //GridView
    var Grid: JsGrid = new JsGrid();
    var TransGrid: JsGrid = new JsGrid();

    //Arrays
    var BranchDetails: Array<G_BRANCH> = new Array<G_BRANCH>();
    var StatesFilterDetailsAr: Array<string> = new Array<string>();
    var StatesFilterDetailsEn: Array<string> = new Array<string>();
    var StoreSourceDetails: Array<G_STORE> = new Array<G_STORE>();
    var StoreToDetails: Array<G_STORE> = new Array<G_STORE>();
    var HeaderWithDetail: IQ_DirectTransferWithDetail = new IQ_DirectTransferWithDetail();
    var Selecteditem: Array<I_Stk_TR_Transfer> = new Array<I_Stk_TR_Transfer>();
    var IQ_DirectTransferDetail: Array<I_Stk_TR_Transfer> = new Array<I_Stk_TR_Transfer>();
    var GetTransferDetail: Array<IQ_GetTransferDetail> = new Array<IQ_GetTransferDetail>();
    var GetTransferDetail: Array<IQ_GetTransferDetail> = new Array<IQ_GetTransferDetail>();
    var SearchDetails: Array<IQ_GetTransfer> = new Array<IQ_GetTransfer>();
    var ItemsListDetails: Array<IQ_GetItemStoreInfo> = new Array<IQ_GetItemStoreInfo>();
    var ItemsSourceListDetails: Array<IQ_GetItemStoreInfo> = new Array<IQ_GetItemStoreInfo>();
    var ItemsToListDetails: Array<IQ_GetItemStoreInfo> = new Array<IQ_GetItemStoreInfo>();
    var GetItemInfo: Array<Iproc_GetItemInfo_Result> = new Array<Iproc_GetItemInfo_Result>();


    //Models
    var MasterDetailModel: DirectTransferMasterDetails = new DirectTransferMasterDetails();
    var TranferHeaderModel: I_Stk_TR_Transfer = new I_Stk_TR_Transfer();
    var TransferDetailModel: Array<I_Stk_TR_TransferDetails> = new Array<I_Stk_TR_TransferDetails>();
    var TransferDetailSingleModel: I_Stk_TR_TransferDetails = new I_Stk_TR_TransferDetails();
    var TransferDetailModelFiltered: Array<IQ_GetTransferDetail> = new Array<IQ_GetTransferDetail>();
    var IQTransferDetailModel: Array<IQ_GetTransferDetail> = new Array<IQ_GetTransferDetail>();
    var IQTransferDetailSingleModel: IQ_GetTransferDetail = new IQ_GetTransferDetail();
    var SelectedTransferModel: Array<IQ_GetTransfer> = new Array<IQ_GetTransfer>();

    //textboxs
    var txtFromDate: HTMLInputElement;
    var txtToDate: HTMLInputElement;
    var txtTransferDate: HTMLInputElement;
    var txtTrNo: HTMLInputElement;
    var txtRefNumber: HTMLInputElement;
    var txtCreatedBy: HTMLInputElement;
    var txtCreatedAt: HTMLInputElement;
    var txtUpdatedBy: HTMLInputElement;
    var txtUpdatedAt: HTMLInputElement;
    var txtSearch: HTMLInputElement;
    var txtApprovedBy: HTMLInputElement;
    var txtRemarks: HTMLInputElement;


    //DropdownLists
    var ddlStatusFilter: HTMLSelectElement;
    var ddlSourceBranch: HTMLSelectElement;
    var ddlSourceStore: HTMLSelectElement;
    var ddlToBranch: HTMLSelectElement;
    var ddlToStore: HTMLSelectElement;

    var ddlSourceBranchAdd: HTMLSelectElement;
    var ddlSourceStoreAdd: HTMLSelectElement;
    var ddlToBranchAdd: HTMLSelectElement;
    var ddlToStoreAdd: HTMLSelectElement;     


    //buttons
    var btnShow: HTMLButtonElement;
    var btnAdd: HTMLButtonElement;
    var btnEdit: HTMLButtonElement;
    var btnSave: HTMLButtonElement;
    var btnBack: HTMLButtonElement;
    var btnAddDetails: HTMLButtonElement;

    //check box
    var chkApproved: HTMLInputElement;

    // Flages
    var FlagAddOrEdit: number = 0;//1 Add 2 Edit
    var showFlag: boolean = false;
    var AfterInsertOrUpdateFlag: boolean = false;
    //global
    var CountGrid: number = 0;
    var GlobalTransferID: number = 0;
    var ItemID: number = 0;
    var compcode: Number; 
    var drpType: HTMLSelectElement;
                                      
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);

    export function InitalizeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "المخزون الخام";

        } else {
            document.getElementById('Screen_name').innerHTML = "Raw Stock";

        } 
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        InitalizeControls();
        InitalizeEvents();
   

    }
    function InitalizeControls() {
 
        drpType = document.getElementById("drpType") as HTMLSelectElement;
        txtFromDate = document.getElementById("txtFromDate") as HTMLInputElement;
        txtToDate = document.getElementById("txtToDate") as HTMLInputElement;
        btnShow = document.getElementById("btnShow") as HTMLButtonElement;
        // Buton privialges for single record page



    }
    function InitalizeEvents() {
        
        drpType.onchange = drpType_onchange;
        btnShow.onclick = btnShow_onclick;
    }
    function Displaystore() {


        $('#divMasterGridiv').removeClass('display_none');

        detailstock = new Array<IQ_GetItemStore>();
        let BranchCode = Number($('#drpuserType').val());


        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefStore", "GetItemstore"),
            data: {
                CompCode: compcode, TypeStock: TypeStock, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {

                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    detailstock = result.Response as Array<IQ_GetItemStore>;

                    //for (var i = 0; i < detailstock.length; i++) {

                    //    detailstock[i].NameIsActive = detailstock[i].IsActive == true ? (lang == "ar" ? "فعال" : "Active") : (lang == "ar" ? "غير فعال" : "Not Active");
                    //}
                    InitializeGridstock();
                    ReportGrid.DataSource = detailstock;
                    ReportGrid.Bind();


                }

            }
        });
    }
    function InitializeGridstock() {

        let res: any = GetResourceList("");
        $("#id_ReportGrid").attr("style", "");
        ReportGrid.ElementName = "divMasterGrid";
        ReportGrid.Paging = true;
        ReportGrid.PageSize = 15;
        ReportGrid.Sorting = true;
        ReportGrid.InsertionMode = JsGridInsertionMode.Binding;
        ReportGrid.Editing = false;
        ReportGrid.Inserting = false;
        ReportGrid.OnRowDoubleClicked = MasterGridDoubleClick;
        ReportGrid.SelectedIndex = 1;
        ReportGrid.PrimaryKey = "ItemID";
        ReportGrid.OnItemEditing = () => { };
        ReportGrid.Columns = [
            { title: "ID", name: "ItemID", type: "text", width: "2%", visible: false },
            { title: 'كود الصنف', name: "ItemCode", type: "text", width: "10%" },
            { title: 'الوصف', name: (lang == "ar" ? "DescA" : "DescL"), type: "text", width: "35%" },
            { title: 'الفئة', name: (lang == "ar" ? "CategoryDescA" : "CategoryDescL"), type: "text", width: "12%" },
            { title: 'الصنف الرئيسي', name: (lang == "ar" ? "ItemFamilyDescA" : "ItemFamilyDescE"), type: "text", width: "14%" },
            { title: 'الوحدة الرئيسية', name: (lang == "ar" ? "UOMDescA" : "UOMDescE"), type: "text", width: "16%" },
            { title: 'كمية المخزون', name: "OnhandQty", type: "text", width: "13%" },          
        ];

        ReportGrid.Bind();
    }
    function MasterGridDoubleClick() {

        

         Selected_Data = detailstock.filter(x => x.ItemID == Number(ReportGrid.SelectedKey));
         
         ItemID = Selected_Data[0].ItemID;
        $("#div_Master_Hedr").removeClass("display_none");

        DisplayData(Selected_Data);
        $('#Div_Show_units').removeClass('display_none');
        $('#Div_Show_Quantity').removeClass('display_none');
        if (SysSession.CurrentPrivileges.CUSTOM2 == false) {
            $('#costdiv').addClass('display_none');
        } else {
            $('#costdiv').removeClass('display_none');
        }

        $('#txtFamily').html('');
        //Display_ItemFamilynew1 = Display_ItemFamily.filter(x => x.CatID == Number(txtCat_Type.value))
        //for (var i = 0; i < Display_ItemFamilynew1.length; i++) {
        //    $('#txtFamily').append('<option value="' + Display_ItemFamilynew1[i].ItemFamilyID + '">' + (lang == "ar" ? Display_ItemFamilynew1[i].DescA : Display_ItemFamilynew1[i].DescL) + '</option>');

        //}

    }
    function DisplayData(Selected_Data: Array<IQ_GetItemStore>) {


        DocumentActions.RenderFromModel(Selected_Data[0]);
        $('#Div_Show_units').addClass('display_none');
        $('#Div_Show_Quantity').addClass('display_none');


        
    }
    function drpType_onchange() {
        debugger
        if (drpType.value == "0") {
            $('#Stock').removeClass('display_none');
            $('#Trans').addClass('display_none');
            Displaystore();
        } else if(drpType.value == "1"){
            $('#Trans').removeClass('display_none');
            $('#Stock').addClass('display_none');   
           
            InitalizeComponentTrans()
        }
        else {
            $('#Trans').addClass('display_none');
            $('#Stock').addClass('display_none');
        }
    }
                                       
    //------------------------------------------------------ * T R A N S * -----------------------------------

    function InitalizeComponentTrans() {

        txtFromDate.value = SysSession.CurrentEnvironment.StartDate;
        txtToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;





    }
    function btnShow_onclick() {
        InitializeGridTrans();
    }   
    function InitializeGridTrans() {
        let res: any = GetResourceList("");

        TransGrid.OnRowDoubleClicked = GridRowDoubleClick;
        TransGrid.ElementName = "divGridDetails_View";
        TransGrid.PrimaryKey = "TransfareID";
        TransGrid.Paging = true;
        TransGrid.PageSize = 10;
        TransGrid.Sorting = true;
        TransGrid.InsertionMode = JsGridInsertionMode.Binding;
        TransGrid.Editing = false;
        TransGrid.Inserting = false;
        TransGrid.SelectedIndex = 1;
        TransGrid.OnItemEditing = () => { };
        TransGrid.Columns = [
            { title: res.transfer, name: "TransfareID", type: "text", width: "", visible: false },
            { title: res.transfer, name: "Tr_No", type: "text", width: "8.5%" },
            { title: res.Trns_RefNum, name: "RefNO", type: "text", width: "8.5%" },
            { title: res.App_date, name: "TrDate", type: "text", width: "11%" },
            { title: "المرسل", name: "CreatedBy", type: "text", width: "15%" },
            { title: "التنفيذ", name: "IsPostdesc", type: "text", width: "4.5%" },
            { title: "المستلم", name: "ReceivedBy", type: "text", width: "15%" },
        ];
        BindGridData();
    }
    function BindGridData() {

        $("#divGridShoow").removeClass("display_none");

        var FromDate = DateFormat(txtFromDate.value).toString();
        var toDate = DateFormat(txtToDate.value).toString();
        var status = 0;
          
        status = Number($('#ddlStatusFilter').val());
         
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Transfer", "GetAll"),
            data: { compcode: compcode, TrType: 1, TFType: 1, fromdate: FromDate, todate: toDate, IsPosted: status,UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    IQ_DirectTransferDetail = new Array<I_Stk_TR_Transfer>();
                    IQ_DirectTransferDetail = result.Response as Array<I_Stk_TR_Transfer>;
                     for (let i = 0; i < IQ_DirectTransferDetail.length; i++) {
                         IQ_DirectTransferDetail[i].TrDate = DateFormat(IQ_DirectTransferDetail[i].TrDate.toString());
                         IQ_DirectTransferDetail[i].IsPosted == true ? IQ_DirectTransferDetail[i].IsPostdesc = (lang == "ar" ? IQ_DirectTransferDetail[i].IsPostdesc = "منفذ" : IQ_DirectTransferDetail[i].IsPostdesc = "Authrized") : (lang == "ar" ? IQ_DirectTransferDetail[i].IsPostdesc = "غير منفذ" : IQ_DirectTransferDetail[i].IsPostdesc = "Not Authrized");;
                         
                     
                         if (IQ_DirectTransferDetail[i].TrType == 1)  
                         IQ_DirectTransferDetail[i].TrDate = DateFormat(IQ_DirectTransferDetail[i].TrDate.toString());
                     
                     }
                    TransGrid.DataSource = IQ_DirectTransferDetail;
                    TransGrid.Bind();
                }
            }
        });

    }
    function GridRowDoubleClick() {
        Selecteditem = IQ_DirectTransferDetail.filter(x => x.TransfareID == Number(TransGrid.SelectedKey));
        TransferID = Number(TransGrid.SelectedKey);

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Transfer", "GetDetail"),
            data: { TransferID: TransferID , UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    GetTransferDetail = new Array<IQ_GetTransferDetail>();
                    GetTransferDetail = result.Response as Array<IQ_GetTransferDetail>;
                    DocumentActions.RenderFromModel(GetTransferDetail[0]);
                                  
                }
            }
        });




    }

    //------------------------------------------------------ Clear && Search && Enable && Disabled Region -----------------------------------
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
    function Clear() {
        $("#div_Data").html("");

        txtTransferDate.value = GetDate();

        txtUpdatedBy.value = "";
        txtUpdatedAt.value = "";
        txtCreatedBy.value = "";
        txtCreatedAt.value = "";

        txtRefNumber.value = "";
        txtTrNo.value = "";
        txtApprovedBy.value = "";
        txtRemarks.value = "";

        ddlSourceBranchAdd.value = 'null';
        ddlSourceStoreAdd.value = 'null';
        ddlToBranchAdd.value = 'null';
        ddlToStoreAdd.value = 'null';
        chkApproved.checked = false;

    }
    function txtSearch_onKeyup() {

        //if (txtSearch.value != "") {
        //    let search: string = txtSearch.value.toLowerCase();
        //    SearchDetails = IQ_DirectTransferDetail.filter(x => x.RBr_DescA.toString().toLowerCase().search(search) >= 0 || x.RBr_DescE.toString().toLowerCase().search(search) >= 0
        //        || x.SBr_DescA.toLowerCase().search(search) >= 0 || x.SBr_DescE.toLowerCase().search(search) >= 0
        //        || x.RSt_DescA.toLowerCase().search(search) >= 0 || x.RSt_DescE.toLowerCase().search(search) >= 0
        //        || x.SSt_DescA.toString().search(search) >= 0 || x.SSt_DescE.toString().search(search) >= 0
        //        || x.Tr_No.toString().search(search) >= 0 || x.RefNO.toString().search(search) >= 0);
        //    Grid.DataSource = SearchDetails;
        //    Grid.Bind();
        //} else {
        //    Grid.DataSource = IQ_DirectTransferDetail;
        //    Grid.Bind();
        //}
    }
    function EnableControls() {
        $("#divTransferDetails :input").removeAttr("disabled");
        $("#btnAddDetails").removeClass("display_none");

        for (let i = 0; i < CountGrid; i++) {

            $("#btnSearchItems" + i).removeAttr("disabled");
            $("#txtItemName" + i).attr("disabled", "disabled");
            $("#dllUom" + i).removeAttr("disabled");
            $("#txtSrcQty" + i).attr("disabled", "disabled");
            $("#txtToQty" + i).attr("disabled", "disabled");
            $("#btn_minus" + i).removeClass("display_none");

            $("#txtConvertedQnty" + i).removeClass("display_none");
            $("#dllUom" + i).removeClass("display_none");
        }
        txtTrNo.disabled = true;

        txtCreatedAt.disabled = true;
        txtCreatedBy.disabled = true;
        txtUpdatedAt.disabled = true;
        txtUpdatedBy.disabled = true;
    }
    function DisableControls() {
        $("#divTransferDetails :input").attr("disabled", "disabled");
        $("#btnAddDetails").addClass("display_none");

        for (let i = 0; i < CountGrid; i++) {

            $("#btnSearchItems" + i).attr("disabled", "disabled");
            $("#txtItemName" + i).attr("disabled", "disabled");
            $("#txtConvertedQnty" + i).attr("disabled", "disabled");
            $("#dllUom" + i).attr("disabled", "disabled");
            $("#txtSrcQty" + i).attr("disabled", "disabled");
            $("#txtToQty" + i).attr("disabled", "disabled");

            $("#btn_minus" + i).addClass("display_none");
        }
        txtTrNo.disabled = true;
    }
    function HideButtons() {
        $("#btnEdit").addClass("display_none");

        $("#btnSave").removeClass("display_none");
        $("#btnBack").removeClass("display_none");
    }
    function ShowButons() {
        $("#btnEdit").removeClass("display_none");

        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");
    }
    function DisableDiv() {
        $("#div_hedr").addClass("disabledDiv");
        $("#divTransferDetails").removeClass("disabledDiv");
        $("#divTransferDetails").removeClass("display_none");
    }                              


}












