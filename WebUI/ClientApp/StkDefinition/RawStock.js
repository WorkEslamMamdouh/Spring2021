$(document).ready(function () {
    //debugger;
    RawStock.InitalizeComponent();
});
var RawStock;
(function (RawStock) {
    var TypeStock = "0";
    var TypeTrans = "1";
    var sys = new SystemTools();
    var ReportGrid = new JsGrid();
    var SysSession = GetSystemSession();
    var detailstock = new Array();
    var Selected_Data = new Array();
    var Branch;
    var startDate;
    var EndDate;
    var FinYear;
    var numcnt;
    var id = 0;
    var TransferID = 0;
    //GridView
    var Grid = new JsGrid();
    var TransGrid = new JsGrid();
    //Arrays
    var BranchDetails = new Array();
    var StatesFilterDetailsAr = new Array();
    var StatesFilterDetailsEn = new Array();
    var StoreSourceDetails = new Array();
    var StoreToDetails = new Array();
    var HeaderWithDetail = new IQ_DirectTransferWithDetail();
    var Selecteditem = new Array();
    var IQ_DirectTransferDetail = new Array();
    var GetTransferDetail = new Array();
    var GetTransferDetail = new Array();
    var SearchDetails = new Array();
    var ItemsListDetails = new Array();
    var ItemsSourceListDetails = new Array();
    var ItemsToListDetails = new Array();
    var GetItemInfo = new Array();
    //Models
    var MasterDetailModel = new DirectTransferMasterDetails();
    var TranferHeaderModel = new I_Stk_TR_Transfer();
    var TransferDetailModel = new Array();
    var TransferDetailSingleModel = new I_Stk_TR_TransferDetails();
    var TransferDetailModelFiltered = new Array();
    var IQTransferDetailModel = new Array();
    var IQTransferDetailSingleModel = new IQ_GetTransferDetail();
    var SelectedTransferModel = new Array();
    //textboxs
    var txtFromDate;
    var txtToDate;
    var txtTransferDate;
    var txtTrNo;
    var txtRefNumber;
    var txtCreatedBy;
    var txtCreatedAt;
    var txtUpdatedBy;
    var txtUpdatedAt;
    var txtSearch;
    var txtApprovedBy;
    var txtRemarks;
    //DropdownLists
    var ddlStatusFilter;
    var ddlSourceBranch;
    var ddlSourceStore;
    var ddlToBranch;
    var ddlToStore;
    var ddlSourceBranchAdd;
    var ddlSourceStoreAdd;
    var ddlToBranchAdd;
    var ddlToStoreAdd;
    //buttons
    var btnShow;
    var btnAdd;
    var btnEdit;
    var btnSave;
    var btnBack;
    var btnAddDetails;
    //check box
    var chkApproved;
    // Flages
    var FlagAddOrEdit = 0; //1 Add 2 Edit
    var showFlag = false;
    var AfterInsertOrUpdateFlag = false;
    //global
    var CountGrid = 0;
    var GlobalTransferID = 0;
    var ItemID = 0;
    var compcode;
    var drpType;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    function InitalizeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "المخزون الخام";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Raw Stock";
        }
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        InitalizeControls();
        InitalizeEvents();
    }
    RawStock.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        drpType = document.getElementById("drpType");
        txtFromDate = document.getElementById("txtFromDate");
        txtToDate = document.getElementById("txtToDate");
        btnShow = document.getElementById("btnShow");
        // Buton privialges for single record page
    }
    function InitalizeEvents() {
        drpType.onchange = drpType_onchange;
        btnShow.onclick = btnShow_onclick;
    }
    function Displaystore() {
        $('#divMasterGridiv').removeClass('display_none');
        detailstock = new Array();
        var BranchCode = Number($('#drpuserType').val());
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefStore", "GetItemstore"),
            data: {
                CompCode: compcode, TypeStock: TypeStock, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    detailstock = result.Response;
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
        var res = GetResourceList("");
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
        ReportGrid.OnItemEditing = function () { };
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
        Selected_Data = detailstock.filter(function (x) { return x.ItemID == Number(ReportGrid.SelectedKey); });
        ItemID = Selected_Data[0].ItemID;
        $("#div_Master_Hedr").removeClass("display_none");
        DisplayData(Selected_Data);
        $('#Div_Show_units').removeClass('display_none');
        $('#Div_Show_Quantity').removeClass('display_none');
        if (SysSession.CurrentPrivileges.CUSTOM2 == false) {
            $('#costdiv').addClass('display_none');
        }
        else {
            $('#costdiv').removeClass('display_none');
        }
        $('#txtFamily').html('');
        //Display_ItemFamilynew1 = Display_ItemFamily.filter(x => x.CatID == Number(txtCat_Type.value))
        //for (var i = 0; i < Display_ItemFamilynew1.length; i++) {
        //    $('#txtFamily').append('<option value="' + Display_ItemFamilynew1[i].ItemFamilyID + '">' + (lang == "ar" ? Display_ItemFamilynew1[i].DescA : Display_ItemFamilynew1[i].DescL) + '</option>');
        //}
    }
    function DisplayData(Selected_Data) {
        DocumentActions.RenderFromModel(Selected_Data[0]);
        $('#Div_Show_units').addClass('display_none');
        $('#Div_Show_Quantity').addClass('display_none');
    }
    function drpType_onchange() {
        debugger;
        if (drpType.value == "0") {
            $('#Stock').removeClass('display_none');
            $('#Trans').addClass('display_none');
            Displaystore();
        }
        else if (drpType.value == "1") {
            $('#Trans').removeClass('display_none');
            $('#Stock').addClass('display_none');
            InitalizeComponentTrans();
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
        var res = GetResourceList("");
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
        TransGrid.OnItemEditing = function () { };
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
            data: { compcode: compcode, TrType: 1, TFType: 1, fromdate: FromDate, todate: toDate, IsPosted: status, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    IQ_DirectTransferDetail = new Array();
                    IQ_DirectTransferDetail = result.Response;
                    for (var i = 0; i < IQ_DirectTransferDetail.length; i++) {
                        IQ_DirectTransferDetail[i].TrDate = DateFormat(IQ_DirectTransferDetail[i].TrDate.toString());
                        IQ_DirectTransferDetail[i].IsPosted == true ? IQ_DirectTransferDetail[i].IsPostdesc = (lang == "ar" ? IQ_DirectTransferDetail[i].IsPostdesc = "منفذ" : IQ_DirectTransferDetail[i].IsPostdesc = "Authrized") : (lang == "ar" ? IQ_DirectTransferDetail[i].IsPostdesc = "غير منفذ" : IQ_DirectTransferDetail[i].IsPostdesc = "Not Authrized");
                        ;
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
        Selecteditem = IQ_DirectTransferDetail.filter(function (x) { return x.TransfareID == Number(TransGrid.SelectedKey); });
        TransferID = Number(TransGrid.SelectedKey);
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Transfer", "GetDetail"),
            data: { TransferID: TransferID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    GetTransferDetail = new Array();
                    GetTransferDetail = result.Response;
                    DocumentActions.RenderFromModel(GetTransferDetail[0]);
                }
            }
        });
    }
    //------------------------------------------------------ Clear && Search && Enable && Disabled Region -----------------------------------
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
        for (var i = 0; i < CountGrid; i++) {
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
        for (var i = 0; i < CountGrid; i++) {
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
})(RawStock || (RawStock = {}));
//# sourceMappingURL=RawStock.js.map