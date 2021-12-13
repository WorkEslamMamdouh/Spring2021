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
    //GridView
    var Grid = new JsGrid();
    //Arrays
    var BranchDetails = new Array();
    var StatesFilterDetailsAr = new Array();
    var StatesFilterDetailsEn = new Array();
    var StoreSourceDetails = new Array();
    var StoreToDetails = new Array();
    var HeaderWithDetail = new IQ_DirectTransferWithDetail();
    var IQ_DirectTransferDetail = new Array();
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
        // Buton privialges for single record page
    }
    function InitalizeEvents() {
        drpType.onchange = drpType_onchange;
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
            InitializeGrid();
        }
        else {
            $('#Trans').addClass('display_none');
            $('#Stock').addClass('display_none');
        }
    }
    //----------------------------------------------------------------------------trans
    function btnEdit_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT)
            return;
        $('#btnPrintTransaction').addClass('display_none');
        FlagAddOrEdit = 2;
        txtUpdatedAt.value = DateTimeFormat(Date().toString());
        txtUpdatedBy.value = SysSession.CurrentEnvironment.UserCode;
        ddlSourceStoreAdd_onchange();
        ddlToStoreAdd_onchange();
        chkApproved.disabled = false;
        ddlSourceBranchAdd.disabled = true;
        DisableDiv();
        EnableControls();
        HideButtons();
        $("#txtVoucherNo").attr("disabled", "disabled");
    }
    function btnAdd_onclick() {
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        CountGrid = 0;
        Clear();
        DisableDiv();
        HideButtons();
        EnableControls();
        showFlag = false;
        FlagAddOrEdit = 1;
        txtCreatedAt.value = DateTimeFormat(GetDate().toString());
        txtCreatedBy.value = SysSession.CurrentEnvironment.UserCode;
        $("#ddlSourceBranchAdd").prop("value", Branch.toString());
        ddlSourceBranchAdd.disabled = true;
        fillddlSourceStoreAdd();
        AddNewRow();
        $("#div_Approve").removeClass("display_none");
        $("#ddlToStoreAdd").empty();
        chkApproved.disabled = !SysSession.CurrentPrivileges.CUSTOM1;
        $("#txtVoucherNo").attr("disabled", "disabled");
    }
    function btnShow_onclick() {
        $("#div_Approve").addClass("display_none");
        $("#btnEdit").addClass("display_none");
        $("#divTransferDetails").addClass("display_none");
        $("#divGridShoow").removeClass("display_none");
        InitializeGrid();
    }
    function btnBack_onclick() {
        $("#div_hedr").removeClass("disabledDiv");
        $("#divGridShoow").removeClass("disabledDiv");
        $('#btnPrintTransaction').removeClass('display_none');
        ShowButons();
        if (FlagAddOrEdit == 2) {
            GridRowDoubleClick();
        }
        else {
            $("#divTransferDetails").addClass("display_none");
            $("#div_Approve").addClass("display_none");
            $("#btnEdit").addClass("display_none");
            DisableControls();
            Clear();
        }
    }
    function btnSave_onClick() {
        if (!Validation_Header())
            return;
        for (var i = 0; i < CountGrid; i++) {
            if (!Validation_Grid(i))
                return;
        }
        Assign();
        if (FlagAddOrEdit == 1) {
            Insert();
        }
        else {
            Update();
        }
        $('#btnPrintTransaction').removeClass('display_none');
    }
    function chkApproved_checked() {
        if (!SysSession.CurrentPrivileges.CUSTOM2)
            return;
        if (txtTransferDate.disabled == true) {
            Open();
        }
    }
    //------------------------------------------------------ Normal Grid Region -----------------------------------
    function InitializeGrid() {
        var res = GetResourceList("");
        Grid.OnRowDoubleClicked = GridRowDoubleClick;
        Grid.ElementName = "divGridDetails_View";
        Grid.PrimaryKey = "TransfareID";
        Grid.Paging = true;
        Grid.PageSize = 10;
        Grid.Sorting = true;
        Grid.InsertionMode = JsGridInsertionMode.Binding;
        Grid.Editing = false;
        Grid.Inserting = false;
        Grid.SelectedIndex = 1;
        Grid.OnItemEditing = function () { };
        Grid.Columns = [
            { title: res.transfer, name: "TransfareID", type: "text", width: "", visible: false },
            { title: res.transfer, name: "Tr_No", type: "text", width: "8.5%" },
            { title: res.Trns_RefNum, name: "RefNO", type: "text", width: "8.5%" },
            { title: res.App_date, name: "TrDate", type: "text", width: "11%" },
            { title: res.Transfer_type, name: "TrType_Desc", type: "text", width: "9.5%" },
            { title: res.Branch_Transferred_from, name: (lang == "ar" ? "SBr_DescA" : "SBr_DescE"), type: "text", width: "12.5%" },
            { title: res.Store_Transferred_from, name: (lang == "ar" ? "SSt_DescA" : "SSt_DescE"), type: "text", width: "15%" },
            { title: res.Trns_ToBranch, name: (lang == "ar" ? "RBr_DescA" : "RBr_DescE"), type: "text", width: "12%" },
            { title: res.Store_Transferred_To, name: (lang == "ar" ? "RSt_DescA" : "RSt_DescE"), type: "text", width: "15%" },
            { title: res.Trns_IsSent, name: "IsSent_Desc", type: "text", width: "4.5%" },
            { title: res.Done_Received, name: "IsReceived_Desc", type: "text", width: "4.5%" },
        ];
        BindGridData();
    }
    function BindGridData() {
        $("#divGridShoow").removeClass("display_none");
        var FromDate = DateFormatRep(txtFromDate.value).toString();
        var toDate = DateFormatRep(txtToDate.value).toString();
        var status = 0;
        var sourcrBR = 0;
        var ToBR = 0;
        var sourcrStore = 0;
        var ToStore = 0;
        status = Number(ddlStatusFilter.value.toString());
        if (ddlSourceBranch.value != "null") {
            sourcrBR = Number(ddlSourceBranch.value.toString());
        }
        if (ddlToBranch.value != "null") {
            ToBR = Number(ddlToBranch.value.toString());
        }
        if (ddlSourceStore.value != "null") {
            sourcrStore = Number(ddlSourceStore.value.toString());
        }
        if (ddlToStore.value != "null") {
            ToStore = Number(ddlToStore.value.toString());
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("DirectTransfer", "GetAllDirectTransferHeaderWithDetail"),
            data: { compcode: compcode, TrType: 1, TFType: 1, FromDate: FromDate, toDate: toDate, status: status, sourcrBR: sourcrBR, ToBR: ToBR, sourcrStore: sourcrStore, ToStore: ToStore, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    IQ_DirectTransferDetail = new Array();
                    IQ_DirectTransferDetail = result.Response;
                    for (var i = 0; i < IQ_DirectTransferDetail.length; i++) {
                        IQ_DirectTransferDetail[i].TrDate = DateFormat(IQ_DirectTransferDetail[i].TrDate.toString());
                        IQ_DirectTransferDetail[i].IsSent == true ? IQ_DirectTransferDetail[i].IsSent_Desc = (lang == "ar" ? IQ_DirectTransferDetail[i].IsSent_Desc = "تم " : IQ_DirectTransferDetail[i].IsSent_Desc = "Done") : (lang == "ar" ? IQ_DirectTransferDetail[i].IsSent_Desc = "لا" : IQ_DirectTransferDetail[i].IsSent_Desc = "No");
                        ;
                        IQ_DirectTransferDetail[i].IsReceived == true ? (lang == "ar" ? IQ_DirectTransferDetail[i].IsReceived_Desc = "تم " : IQ_DirectTransferDetail[i].IsReceived_Desc = "Done") : (lang == "ar" ? IQ_DirectTransferDetail[i].IsReceived_Desc = "لا" : IQ_DirectTransferDetail[i].IsReceived_Desc = "No");
                        if (IQ_DirectTransferDetail[i].TrType == 1)
                            IQ_DirectTransferDetail[i].TrType_Desc = (lang == "ar" ? "ارسال" : "send");
                        IQ_DirectTransferDetail[i].TrDate = DateFormat(IQ_DirectTransferDetail[i].TrDate.toString());
                    }
                    Grid.DataSource = IQ_DirectTransferDetail;
                    Grid.Bind();
                }
            }
        });
    }
    function GridRowDoubleClick() {
        showFlag = true;
        Clear();
        $("#divTransferDetails").removeClass("display_none");
        $("#btnEdit").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        $("#div_Approve").removeClass("display_none");
        SelectedTransferModel = IQ_DirectTransferDetail.filter(function (x) { return x.TransfareID == Number(Grid.SelectedKey); });
        if (AfterInsertOrUpdateFlag == true) {
            SelectedTransferModel = IQ_DirectTransferDetail.filter(function (x) { return x.TransfareID == GlobalTransferID; });
            AfterInsertOrUpdateFlag = false;
        }
        if (SelectedTransferModel.length > 0) {
            GlobalTransferID = Number(SelectedTransferModel[0].TransfareID);
            txtTrNo.value = SelectedTransferModel[0].Tr_No.toString();
            txtTransferDate.value = SelectedTransferModel[0].TrDate;
            txtApprovedBy.value = SelectedTransferModel[0].VerfiedBy;
            txtRemarks.value = SelectedTransferModel[0].Remark;
            if (SelectedTransferModel[0].RefNO != null)
                txtRefNumber.value = SelectedTransferModel[0].RefNO;
            fillddlBranchFilter();
            if (SelectedTransferModel[0].ReceiverBranchCode != null)
                ddlToBranchAdd.value = SelectedTransferModel[0].ReceiverBranchCode.toString();
            if (SelectedTransferModel[0].SenderBranchCode != null)
                ddlSourceBranchAdd.value = SelectedTransferModel[0].SenderBranchCode.toString();
            fillddlSourceStoreAdd();
            fillddlToStoreAdd();
            if (SelectedTransferModel[0].SenderStoreID != null) {
                ddlSourceStoreAdd.value = SelectedTransferModel[0].SenderStoreID.toString();
                GetAllStoreItems(SelectedTransferModel[0].SenderBranchCode, SelectedTransferModel[0].SenderStoreID);
            }
            if (SelectedTransferModel[0].ReceiverStoreID != null)
                ddlToStoreAdd.value = SelectedTransferModel[0].ReceiverStoreID.toString();
            // creation
            txtCreatedBy.value = SelectedTransferModel[0].CreatedBy;
            txtCreatedAt.value = SelectedTransferModel[0].CreatedAt;
            // Edit
            if (SelectedTransferModel[0].UpdatedBy != null) {
                txtUpdatedBy.value = SelectedTransferModel[0].UpdatedBy;
                txtUpdatedAt.value = SelectedTransferModel[0].UpdatedAt;
            }
            // Detail
            TransferDetailModelFiltered = new Array();
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("DirectTransfer", "GetTransferByID"),
                data: {
                    TransferID: GlobalTransferID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        HeaderWithDetail = result.Response;
                        TransferDetailModelFiltered = HeaderWithDetail.IQ_GetTransferDetail;
                        for (var i = 0; i < TransferDetailModelFiltered.length; i++) {
                            BuildControls(i);
                        }
                    }
                }
            });
            CountGrid = TransferDetailModelFiltered.length;
            DisableControls();
            if (SelectedTransferModel[0].IsSent == true) {
                chkApproved.checked = true;
                btnEdit.disabled = true;
                chkApproved.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
            }
            else {
                chkApproved.checked = false;
                chkApproved.disabled = true;
                btnEdit.disabled = false;
            }
        }
    }
    //------------------------------------------------------ Validation Region -----------------------------------
    function Validation_Header() {
        var newCount = 0;
        for (var i = 0; i < CountGrid; i++) {
            if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "") {
                newCount++;
            }
        }
        if (!CheckDate(DateFormat(txtTransferDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            DisplayMassage(' لا توجد صلاحيه للتحويل في هذا التاريخ (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', 'There is no transfer validity at this date ' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), MessageType.Error);
            Errorinput(txtTransferDate);
            return false;
        }
        else if (ddlSourceBranchAdd.value == "null") {
            DisplayMassage('برجاء اختيار الفرع المحول منه', 'Please choose the branch you are transferring from', MessageType.Error);
            Errorinput(ddlSourceBranchAdd);
            return false;
        }
        else if (ddlSourceStoreAdd.value == "null") {
            DisplayMassage('برجاء اختيار المستودع المحول منه', 'Please choose the Store you are transferring from', MessageType.Error);
            Errorinput(ddlSourceStoreAdd);
            return false;
        }
        else if (ddlToBranchAdd.value == "null") {
            DisplayMassage('برجاء اختيار الفرع المحول اليه', 'Please choose the branch you are transferring to', MessageType.Error);
            Errorinput(ddlToBranchAdd);
            return false;
        }
        else if (ddlToStoreAdd.value == "null") {
            DisplayMassage('برجاء اختيار المستودع المحول اليه', 'Please choose the branch you are transferring to', MessageType.Error);
            Errorinput(ddlToStoreAdd);
            return false;
        }
        else if ((ddlToStoreAdd.value == ddlSourceStoreAdd.value) && (ddlToBranchAdd.value == ddlSourceBranchAdd.value)) {
            DisplayMassage(' لايمكن ان يحول المستودع و الفرع لنفسه ', 'The store and branch cannot be transferred to itself', MessageType.Error);
            Errorinput(ddlToStoreAdd);
            Errorinput(ddlSourceStoreAdd);
            return false;
        }
        else if (txtApprovedBy.value == "") {
            DisplayMassage('برجاء ادخال اعتماد بواسطه', 'Please enter Approved by', MessageType.Error);
            Errorinput(txtApprovedBy);
            return false;
        }
        else if (newCount == 0) {
            DisplayMassage('يجب ادخال اصناف التحويل', 'Please enter Transfering Items', MessageType.Error);
            return false;
        }
        return true;
    }
    function Validation_Grid(rowcount) {
        var Qty = Number($("#txtConvertedQnty" + rowcount).val());
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "") {
            return true;
        }
        else {
            if ($("#txtItemName" + rowcount).val() == "") {
                DisplayMassage('برجاء ادخال الصنف', 'Please enter item', MessageType.Error);
                Errorinput($("#txtItemName" + rowcount));
                return false;
            }
            else if (Qty == 0) {
                DisplayMassage('برجاء ادخال الكمية المحولة', 'Please enter converted Quantity', MessageType.Error);
                Errorinput($("#txtConvertedQnty" + rowcount));
                return false;
            }
            return true;
        }
    }
    function checkRepeatedItems(itemValue, NumberRowid) {
        var items = Number(CountGrid);
        var flag = false;
        for (var i = 0; i < items - 1; i++) {
            if (NumberRowid != 0) {
                if (Number($("#txt_ItemID" + i).val()) == itemValue && Number($("#TransfareDetailID" + i).val()) != NumberRowid) {
                    flag = true;
                }
            }
            else {
                if (Number($("#txt_ItemID" + i).val()) == itemValue) {
                    flag = true;
                }
            }
        }
        return flag;
    }
    //-----------------------------------------------------------------------  DropDownList Region ----------------------------------
    function fillddlStatusFilter() {
        StatesFilterDetailsAr = ["جديد", " محول", "الجميع"];
        StatesFilterDetailsEn = ["New", " Returned", "All"];
        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (var i = 0; i < StatesFilterDetailsEn.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StatesFilterDetailsEn[i];
                ddlStatusFilter.options.add(newoption);
            }
        }
        else {
            for (var i = 0; i < StatesFilterDetailsAr.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StatesFilterDetailsAr[i];
                ddlStatusFilter.options.add(newoption);
            }
        }
    }
    function fillddlBranchFilter() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GBranch", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    BranchDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(BranchDetails, ddlSourceBranch, "BRA_CODE", "BRA_DESCL", "Select branch");
                        DocumentActions.FillCombowithdefult(BranchDetails, ddlToBranch, "BRA_CODE", "BRA_DESCL", "Select branch");
                        DocumentActions.FillCombowithdefult(BranchDetails, ddlSourceBranchAdd, "BRA_CODE", "BRA_DESCL", "Select branch");
                        DocumentActions.FillCombowithdefult(BranchDetails, ddlToBranchAdd, "BRA_CODE", "BRA_DESCL", "Select branch");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(BranchDetails, ddlSourceBranch, "BRA_CODE", "BRA_DESC", "اختر الفرع");
                        DocumentActions.FillCombowithdefult(BranchDetails, ddlToBranch, "BRA_CODE", "BRA_DESC", "اختر الفرع");
                        DocumentActions.FillCombowithdefult(BranchDetails, ddlSourceBranchAdd, "BRA_CODE", "BRA_DESC", "اختر الفرع");
                        DocumentActions.FillCombowithdefult(BranchDetails, ddlToBranchAdd, "BRA_CODE", "BRA_DESC", "اختر الفرع");
                    }
                }
            }
        });
    }
    function fillddlSourceStore() {
        if (ddlSourceBranch.value != "null") {
            var Branch = Number(ddlSourceBranch.value);
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("StkDefStore", "GetAll"),
                data: {
                    CompCode: compcode, BranchCode: Branch, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        StoreSourceDetails = result.Response;
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                            DocumentActions.FillCombowithdefult(StoreSourceDetails, ddlSourceStore, "StoreId", "DescL", "Select Store");
                        }
                        else {
                            DocumentActions.FillCombowithdefult(StoreSourceDetails, ddlSourceStore, "StoreId", "DescA", "اختر المستودع");
                        }
                    }
                }
            });
        }
    }
    function fillddlToStore() {
        if (ddlToBranch.value != "null") {
            var Branch = Number(ddlToBranch.value);
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("StkDefStore", "GetAll"),
                data: {
                    CompCode: compcode, BranchCode: Branch, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        StoreToDetails = result.Response;
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                            DocumentActions.FillCombowithdefult(StoreToDetails, ddlToStore, "StoreId", "DescL", "Select Store");
                        }
                        else {
                            DocumentActions.FillCombowithdefult(StoreToDetails, ddlToStore, "StoreId", "DescA", "اختر المستودع");
                        }
                    }
                }
            });
        }
    }
    function fillddlSourceStoreAdd() {
        if (ddlSourceBranchAdd.value != "null") {
            var Branch = Number(ddlSourceBranchAdd.value);
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("StkDefStore", "GetAll"),
                data: {
                    CompCode: compcode, BranchCode: Branch, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        StoreSourceDetails = result.Response;
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                            DocumentActions.FillCombowithdefult(StoreSourceDetails, ddlSourceStoreAdd, "StoreId", "DescL", "Select Store");
                        }
                        else {
                            DocumentActions.FillCombowithdefult(StoreSourceDetails, ddlSourceStoreAdd, "StoreId", "DescA", "اختر المستودع");
                        }
                    }
                }
            });
        }
    }
    function fillddlToStoreAdd() {
        if (ddlToBranchAdd.value != "null") {
            var Branch = Number(ddlToBranchAdd.value);
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("StkDefStore", "GetAll"),
                data: {
                    CompCode: compcode, BranchCode: Branch, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        StoreToDetails = result.Response;
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                            DocumentActions.FillCombowithdefult(StoreToDetails, ddlToStoreAdd, "StoreId", "DescL", "Select Store");
                        }
                        else {
                            DocumentActions.FillCombowithdefult(StoreToDetails, ddlToStoreAdd, "StoreId", "DescA", "اختر المستودع");
                        }
                    }
                }
            });
        }
    }
    function ddlSourceStoreAdd_onchange() {
        if (ddlSourceStoreAdd.value != "null" && ddlSourceBranchAdd.value != "null") {
            var BranchID = Number(ddlSourceBranchAdd.value);
            var StoreID = Number(ddlSourceStoreAdd.value);
            GetAllStoreItems(BranchID, StoreID);
            ItemsSourceListDetails = new Array();
            ItemsSourceListDetails = ItemsListDetails;
        }
    }
    function ddlToStoreAdd_onchange() {
        if (ddlToStoreAdd.value != "null" && ddlToBranchAdd.value != "null") {
            if ((ddlToStoreAdd.value == ddlSourceStoreAdd.value) && (ddlToBranchAdd.value == ddlSourceBranchAdd.value)) {
                DisplayMassage(' لايمكن ان يحول المستودع و الفرع لنفسه ', 'The store and branch cannot be transferred to itself', MessageType.Error);
                ddlToStoreAdd.focus();
                ddlToStoreAdd.value = "null";
            }
            else {
                var BranchID = Number(ddlToBranchAdd.value);
                var StoreID = Number(ddlToStoreAdd.value);
                GetAllStoreItems(BranchID, StoreID);
                ItemsToListDetails = new Array();
                ItemsToListDetails = ItemsListDetails;
            }
        }
    }
    //------------------------------------------------------ Clear && Search && Enable && Disabled Region -----------------------------------
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
        if (txtSearch.value != "") {
            var search_1 = txtSearch.value.toLowerCase();
            SearchDetails = IQ_DirectTransferDetail.filter(function (x) { return x.RBr_DescA.toString().toLowerCase().search(search_1) >= 0 || x.RBr_DescE.toString().toLowerCase().search(search_1) >= 0
                || x.SBr_DescA.toLowerCase().search(search_1) >= 0 || x.SBr_DescE.toLowerCase().search(search_1) >= 0
                || x.RSt_DescA.toLowerCase().search(search_1) >= 0 || x.RSt_DescE.toLowerCase().search(search_1) >= 0
                || x.SSt_DescA.toString().search(search_1) >= 0 || x.SSt_DescE.toString().search(search_1) >= 0
                || x.Tr_No.toString().search(search_1) >= 0 || x.RefNO.toString().search(search_1) >= 0; });
            Grid.DataSource = SearchDetails;
            Grid.Bind();
        }
        else {
            Grid.DataSource = IQ_DirectTransferDetail;
            Grid.Bind();
        }
    }
    function GetDate() {
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
    //------------------------------------------------------ Controls Grid Region -----------------------------------
    function AddNewRow() {
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        showFlag = false;
        var CanAdd = true;
        if (CountGrid > 0) {
            var LastRowNo = CountGrid - 1;
            CanAdd = Validation_Grid(LastRowNo);
        }
        if (CanAdd) {
            var newcount = CountGrid - 1;
            if ($("#txtConvertedQnty" + newcount).val() == "0" || $("#txtConvertedQnty" + newcount).val() == "") {
                DisplayMassage("يجب إدخال الكمية المحوله ", "The transferred quantity must be entered", MessageType.Error);
                Errorinput($("#txtConvertedQnty" + newcount));
                return;
            }
            $(".Acc").show();
            $(".costcntr").show();
            BuildControls(CountGrid);
            $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode
            $("#txtSerial" + CountGrid).attr("disabled", "disabled");
            $("#btnSearchItems" + CountGrid).removeAttr("disabled");
            $("#txt_ItemID" + CountGrid).attr("disabled", "disabled");
            $("#txtItemName" + CountGrid).attr("disabled", "disabled");
            $("#txtConvertedQnty" + CountGrid).removeAttr("disabled");
            $("#dllUom" + CountGrid).attr("disabled", "disabled");
            $("#txtItemCode" + CountGrid).removeAttr("disabled");
            $("#txtSrcQty" + CountGrid).attr("disabled", "disabled");
            $("#txtToQty" + CountGrid).attr("disabled", "disabled");
            // can delete new inserted record  without need for delete privilage
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");
            var counter = 0;
            for (var i = 0; i <= CountGrid; i++) {
                var flagvalue = $("#txt_StatusFlag" + i).val();
                if (flagvalue != "d" && flagvalue != "") {
                    if ($("#txt_StatusFlag" + i).val() != "i")
                        $("#txt_StatusFlag" + i).val("u");
                    $("#txtSerial" + i).prop("value", counter + 1);
                    counter = counter + 1;
                }
            }
            CountGrid++;
        }
    }
    function BuildControls(cnt) {
        var html = "";
        html = '<div id= "No_Row' + cnt + '" class="container-fluid style_border" > <div class="row" ><div class="col-lg-12">' +
            '<input id="TransfareDetailID' + cnt + '" name="" disabled type="hidden" value=" " class="form-control  text_Display" />' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1" style="width:1.5%!important">' +
            '<span id="btn_minus' + cnt + '" class=" glyphicon glyphicon-minus-sign fontitm3sendTransfer "></span>' +
            '</div>' +
            '<input id="txtSerial' + cnt + '" name="FromDate" disabled type="hidden" value="' + (CountGrid + 1) + '" class="form-control  text_Display" />' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0" style="width:3%!important;">' +
            '<button type="button" class="col-xs-12 src-btn btn btn-warning input-sm" id="btnSearchItems' + cnt + '" name="ColSearch">   ' +
            '<i class="fa fa-search"></i></button>' +
            '<input id="txtItemNumber' + cnt + '" name="" disabled type="hidden" class="col-lg-9  form-control  text_Display" /></div>' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 Acc" >' +
            '<input id="txtItemCode' + cnt + '" name="" disabled type="text" class="form-control  text_Display" /></div>' +
            '<div class="col-lg-3 col-md-3 col-sm-3 col-xl-3 col-xs-3 Acc" >' +
            '<input id="txtItemName' + cnt + '" name="" disabled type="text" class="form-control  text_Display" /></div>' +
            '<div class="col-xs-1"style="width: 10 % !important;">' +
            '<select id="dllUom' + cnt + '"  disabled class="form-control right2"><option value="0"> ' + (lang == "ar" ? "اختر " : "Choose ") + '</option></select></div>' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 Acc" style=" ">' +
            '<input id="txtSrcQty' + cnt + '" name="" disabled type="text" class="form-control  text_Display" /></div>' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 Acc" style=" ">' +
            '<input id="txtToQty' + cnt + '" name="" disabled type="text" class="form-control  text_Display" /></div>' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1" >' +
            '<input id="txtConvertedQnty' + cnt + '" name="" disabled type="number" value="0"  min="0" class="form-control  text_Display" /></div>' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 Acc" style=" ">' +
            '<input id="txtRecQty' + cnt + '" name="" disabled type="text" class="form-control  text_Display" /></div>' +
            '<input  id="txt_StatusFlag' + cnt + '" name = " " type ="hidden"  />' +
            '<input  id="txt_ItemID' + cnt + '" name = " " type ="hidden"  />' +
            '</div>';
        $("#div_Data").append(html);
        //// Items Search
        $('#btnSearchItems' + cnt).click(function (e) {
            var sys = new SystemTools();
            if (ddlSourceStoreAdd.value == "null" || ddlToStoreAdd.value == "null" || ddlToStoreAdd.value == "") {
                DisplayMassage("يجب اختيار المستودع الذي سيتم التحويل منه و المستودع الذي سيتم التحويل له ", "You must choose the store from which the transfer will be made and the store to which the transfer will be made", MessageType.Error);
            }
            else {
                var sys_1 = new SystemTools();
                numcnt = cnt;
                var Storeid = $("#ddlSourceStoreAdd").val();
                sys_1.ShowItems(Number(SysSession.CurrentEnvironment.BranchCode), Storeid, $('#txtItemName' + cnt).val(), $('#txtItemCode' + cnt).val(), 1, function () {
                    id = sysInternal_Comm.Itemid;
                    if (!validationitem(id, numcnt))
                        return;
                    $("#txt_ItemID" + numcnt + "").val(id);
                    $("#dllUom" + cnt).removeAttr('disabled');
                    $('#txtPrice' + numcnt + '').removeAttr('disabled');
                    $('#txtQuantity' + numcnt + '').removeAttr('disabled');
                    var ItemCode = '';
                    var ItemID = id;
                    var Mode = 3;
                    Ajax.Callsync({
                        type: "Get",
                        url: sys_1.apiUrl("StkDefItemType", "GetItemByCode"),
                        data: {
                            CompCode: compcode, FinYear: FinYear, ItemCode: ItemCode, ItemID: ItemID, storeid: Storeid, Mode: Mode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                        },
                        success: function (d) {
                            var result = d;
                            if (result.IsSuccess) {
                                GetItemInfo = result.Response;
                                if (GetItemInfo.length > 0) {
                                    $('#dllUom' + numcnt + '').html('');
                                    for (var i = 0; i < GetItemInfo.length; i++) {
                                        $('#dllUom' + numcnt + '').append('<option  data-OnhandQty="' + GetItemInfo[i].OnhandQty + '" data-UnitPrice="' + GetItemInfo[i].UnitPrice + '" data-MinPrice="' + GetItemInfo[i].MinPrice + '" data-Rate="' + GetItemInfo[i].Rate + '" value="' + GetItemInfo[i].uomid + '">' + (lang == "ar" ? GetItemInfo[i].u_DescA : GetItemInfo[i].u_DescE) + '</option>');
                                    }
                                    $('#txtItemName' + numcnt + '').val((lang == "ar" ? GetItemInfo[0].It_DescA : GetItemInfo[0].it_DescE));
                                    $('#txtItemCode' + numcnt + '').val(GetItemInfo[0].ItemCode);
                                    $('#dllUom' + numcnt + '').val(GetItemInfo[0].uomid);
                                    $('#txtSrcQty' + numcnt + '').val(GetItemInfo[0].OnhandQty);
                                    $('#dllUom' + numcnt + '').removeAttr('disabled');
                                    $('#txtItemName' + numcnt + '').attr('disabled', 'disabled');
                                }
                                else {
                                    DisplayMassage("الكود غير صحيح", "The code is incorrect", MessageType.Error);
                                    Errorinput($("#txtItemCode" + i + ""));
                                    $('#dllUom' + numcnt + '').append('<option value="null">اختر الوحده</option>');
                                    $('#txtItemCode' + numcnt + '').val('');
                                    $('#txtItemName' + numcnt + '').val('');
                                    $('#txtSrcQty' + numcnt + '').val('');
                                    $('#txtItemName' + numcnt + '').attr('disabled', 'disabled');
                                    $('#txtSrcQty' + numcnt + '').attr('disabled', 'disabled');
                                    $('#dllUom' + numcnt + '').attr('disabled', 'disabled');
                                    $('#dllUom' + numcnt + '').attr('disabled', 'disabled');
                                    $('#txtItemCode' + numcnt + '').removeAttr('disabled');
                                    $('#txt_ItemID' + numcnt + '').val('');
                                    $('#txtItemCode' + numcnt + '').focus();
                                    return;
                                }
                            }
                        }
                    });
                    var GetItemInfo2 = new Array();
                    Storeid = Number($("#ddlToStoreAdd").val());
                    ItemCode = GetItemInfo[0].ItemCode;
                    ItemID = GetItemInfo[0].ItemID;
                    Mode = 3;
                    Ajax.Callsync({
                        type: "Get",
                        url: sys_1.apiUrl("StkDefItemType", "GetItemByCode"),
                        data: {
                            CompCode: compcode, FinYear: FinYear, ItemCode: ItemCode, ItemID: ItemID, storeid: Storeid, Mode: Mode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                        },
                        success: function (d) {
                            var result = d;
                            if (result.IsSuccess) {
                                GetItemInfo2 = result.Response;
                                $('#txtToQty' + numcnt + '').val(GetItemInfo2[0].OnhandQty);
                            }
                        }
                    });
                });
            }
        });
        $("#txtItemCode" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var GetItemInfo1 = new Array();
            numcnt = cnt;
            var Storeid = Number($("#ddlSourceStoreAdd").val());
            var ItemCode = $('#txtItemCode' + cnt).val();
            var ItemID = 0;
            var Mode = 3;
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("StkDefItemType", "GetItemByCode"),
                data: {
                    CompCode: compcode, FinYear: FinYear, ItemCode: ItemCode, ItemID: ItemID, storeid: Storeid, Mode: Mode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        GetItemInfo1 = result.Response;
                        if (GetItemInfo1.length > 0) {
                            //alert(NumCnt);                    btnEdit
                            $("#txt_ItemID" + numcnt + "").val(GetItemInfo1[0].ItemID);
                            if (!validationitem(GetItemInfo1[0].ItemID, numcnt))
                                return;
                            $('#dllUom' + numcnt + '').html('');
                            for (var i = 0; i < GetItemInfo1.length; i++) {
                                $('#dllUom' + numcnt + '').append('<option  data-OnhandQty="' + GetItemInfo1[i].OnhandQty + '" data-UnitPrice="' + GetItemInfo1[i].UnitPrice + '" data-MinPrice="' + GetItemInfo1[i].MinPrice + '" data-Rate="' + GetItemInfo1[i].OnhandQty + '" value="' + GetItemInfo1[i].uomid + '">' + (lang == "ar" ? GetItemInfo1[i].u_DescA : GetItemInfo1[i].u_DescE) + '</option>');
                            }
                            $('#txtItemName' + numcnt + '').val((lang == "ar" ? GetItemInfo1[0].It_DescA : GetItemInfo1[0].it_DescE));
                            $('#txtItemCode' + numcnt + '').val(GetItemInfo1[0].ItemCode);
                            $('#dllUom' + numcnt + '').val(GetItemInfo1[0].uomid);
                            $('#txtSrcQty' + numcnt + '').val(GetItemInfo1[0].OnhandQty);
                            $('#dllUom' + numcnt + '').removeAttr('disabled');
                            $('#txtItemName' + numcnt + '').attr('disabled', 'disabled');
                        }
                        else {
                            DisplayMassage("الكود غير صحيح", "The code is incorrect", MessageType.Error);
                            Errorinput($("#txtItemCode" + i + ""));
                            $('#dllUom' + numcnt + '').append('<option value="null">اختر الوحده</option>');
                            $('#txtItemCode' + numcnt + '').val('');
                            $('#txtItemName' + numcnt + '').val('');
                            $('#txtSrcQty' + numcnt + '').val('');
                            $('#txtItemName' + numcnt + '').attr('disabled', 'disabled');
                            $('#txtSrcQty' + numcnt + '').attr('disabled', 'disabled');
                            $('#dllUom' + numcnt + '').attr('disabled', 'disabled');
                            $('#dllUom' + numcnt + '').attr('disabled', 'disabled');
                            $('#txtItemCode' + numcnt + '').removeAttr('disabled');
                            $('#txt_ItemID' + numcnt + '').val('');
                            $('#txtItemCode' + numcnt + '').focus();
                        }
                    }
                }
            });
            var GetItemInfo2 = new Array();
            Storeid = Number($("#ddlToStoreAdd").val());
            ItemCode = TransferDetailModelFiltered[cnt].ItemCode;
            ItemID = TransferDetailModelFiltered[cnt].ItemID;
            Mode = 3;
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("StkDefItemType", "GetItemByCode"),
                data: {
                    CompCode: compcode, FinYear: FinYear, ItemCode: ItemCode, ItemID: ItemID, storeid: Storeid, Mode: Mode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        GetItemInfo2 = result.Response;
                        $('#txtToQty' + numcnt + '').val(GetItemInfo2[0].OnhandQty);
                    }
                }
            });
        });
        //Quintity on change
        $("#dllUom" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var Typeuom = $("#dllUom" + cnt);
            var onhandqty = $('option:selected', Typeuom).attr('data-onhandqty');
            $('#txtSrcQty' + cnt + '').val(onhandqty);
            $('#txtToQty' + cnt + '').val("0");
            $('#txtConvertedQnty' + cnt + '').val('0');
        });
        //Item Code Onchange
        $("#txtConvertedQnty" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var Typeuom = $("#dllUom" + cnt);
            var onhandqty = Number($('option:selected', Typeuom).attr('data-onhandqty'));
            if (Number($('#txtSrcQty' + cnt + '').val()) < Number($("#txtConvertedQnty" + cnt).val())) {
                DisplayMassage("(" + onhandqty + ")لا يمكن تحويل كمية اكبر من الكمية المتاحه ", 'It is not possible to transfer an amount greater than the available quantity(' + onhandqty + ')', MessageType.Error);
                Errorinput($('#txtConvertedQnty' + cnt + ''));
                $('#txtConvertedQnty' + cnt + '').val(onhandqty);
            }
        });
        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });
        if (showFlag == true) {
            var GetItemInfo1_1 = new Array();
            var Storeid = Number($("#ddlSourceStoreAdd").val());
            var ItemCode = TransferDetailModelFiltered[cnt].ItemCode;
            var ItemID_1 = TransferDetailModelFiltered[cnt].ItemID;
            var Mode = 3;
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("StkDefItemType", "GetItemByCode"),
                data: {
                    CompCode: compcode, FinYear: FinYear, ItemCode: ItemCode, ItemID: ItemID_1, storeid: Storeid, Mode: Mode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        GetItemInfo1_1 = result.Response;
                        if (GetItemInfo1_1.length > 0) {
                            $('#dllUom' + cnt + '').html('');
                            for (var i = 0; i < GetItemInfo1_1.length; i++) {
                                $('#dllUom' + cnt + '').append('<option  data-OnhandQty="' + GetItemInfo1_1[i].OnhandQty + '" data-UnitPrice="' + GetItemInfo1_1[i].UnitPrice + '" data-MinPrice="' + GetItemInfo1_1[i].MinPrice + '" data-Rate="' + GetItemInfo1_1[i].OnhandQty + '" value="' + GetItemInfo1_1[i].uomid + '">' + (lang == "ar" ? GetItemInfo1_1[i].u_DescA : GetItemInfo1_1[i].u_DescE) + '</option>');
                            }
                        }
                    }
                }
            });
            debugger;
            var GetItemInfo2_1 = new Array();
            Storeid = Number($("#ddlToStoreAdd").val());
            ItemCode = TransferDetailModelFiltered[cnt].ItemCode;
            ItemID_1 = TransferDetailModelFiltered[cnt].ItemID;
            Mode = 3;
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("StkDefItemType", "GetItemByCode"),
                data: {
                    CompCode: compcode, FinYear: FinYear, ItemCode: ItemCode, ItemID: ItemID_1, storeid: Storeid, Mode: Mode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        GetItemInfo2_1 = result.Response;
                        $('#txtToQty' + cnt).val(GetItemInfo2_1[cnt].OnhandQty);
                    }
                }
            });
            $('#txtSerial' + cnt).val(TransferDetailModelFiltered[cnt].Serial);
            $('#txtRecQty' + cnt).val(TransferDetailModelFiltered[cnt].RecQty);
            $('#TransfareDetailID' + cnt).val(TransferDetailModelFiltered[cnt].TransfareDetailID);
            $('#txt_ItemID' + cnt).val(TransferDetailModelFiltered[cnt].ItemID);
            (lang == "ar" ? $('#txtItemName' + cnt).val(TransferDetailModelFiltered[cnt].Itm_DescA) : $('#txtItemName' + cnt).val(TransferDetailModelFiltered[cnt].Itm_DescE));
            if (TransferDetailModelFiltered[cnt].StockSendQty != null)
                $('#txtConvertedQnty' + cnt).val(TransferDetailModelFiltered[cnt].SendQty.toString());
            $('#txtItemCode' + cnt).val(TransferDetailModelFiltered[cnt].ItemCode);
            $('#dllUom' + cnt).val(TransferDetailModelFiltered[cnt].UnitID);
            $('#txtSrcQty' + cnt).val(TransferDetailModelFiltered[cnt].SrcOhnandQty);
            $('#txt_StatusFlag' + cnt).val("u");
        }
    }
    function DeleteRow(RecNo) {
        if (!SysSession.CurrentPrivileges.Remove)
            return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", function () {
            var statusFlag = $("#txt_StatusFlag" + RecNo).val();
            if (statusFlag == "i")
                $("#txt_StatusFlag" + RecNo).val("");
            else
                $("#txt_StatusFlag" + RecNo).val("d");
            // ComputeTotals();
            $("#txt_ItemID" + RecNo).val("99");
            $("#txtItemName" + RecNo).val("1");
            $("#txtConvertedQnty" + RecNo).val("1");
            $("#dllUom" + RecNo).val("1");
            $("#txtItemCode" + RecNo).val("1");
            $("#txtSrcQty" + RecNo).val("1");
            $("#txtToQty" + RecNo).val("1");
            $("#dllUom" + RecNo).val("1");
            $("#No_Row" + RecNo).attr("hidden", "true");
            var counter = 0;
            for (var i = 0; i < CountGrid; i++) {
                var flagvalue = $("#txt_StatusFlag" + i).val();
                if (flagvalue != "d" && flagvalue != "") {
                    if ($("#txt_StatusFlag" + i).val() != "i")
                        $("#txt_StatusFlag" + i).val("u");
                    $("#txtSerial" + i).prop("value", counter + 1);
                    counter = counter + 1;
                }
            }
        });
    }
    function validationitem(id, numgrid) {
        for (var i = 0; i < CountGrid; i++) {
            if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m" && i != numgrid) {
                if ($("#txt_ItemID" + i + "").val() == id) {
                    DisplayMassage("الصنف موجود من قبل", "Item found before", MessageType.Error);
                    Errorinput($("#txtItemName" + CountGrid + ""));
                    $("#txtItemCode" + CountGrid + "").val("");
                    return false;
                }
            }
        }
        return true;
    }
    //---------------------------------------------- get By id  functions ----------------------------------------
    function GetAllStoreItems(BranchID, StoreID) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItems", "GetAllItemsInStore"),
            data: { branch: BranchID, comp: compcode, Store: StoreID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    ItemsListDetails = result.Response;
                }
            }
        });
    }
    //--------------------------------------------------- Main Functions-----------------------------------------------
    function Assign() {
        MasterDetailModel = new DirectTransferMasterDetails();
        TranferHeaderModel = new I_Stk_TR_Transfer();
        TransferDetailModel = new Array();
        // Header Data
        TranferHeaderModel.Tr_No = Number(txtTrNo.value);
        TranferHeaderModel.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
        TranferHeaderModel.BranchCode = Number(Branch);
        TranferHeaderModel.TrDate = txtTransferDate.value;
        TranferHeaderModel.RefNO = txtRefNumber.value;
        TranferHeaderModel.TrType = 1;
        TranferHeaderModel.TFType = 1;
        if (chkApproved.checked == true) {
            TranferHeaderModel.IsSent = true;
        }
        else {
            TranferHeaderModel.IsSent = false;
        }
        TranferHeaderModel.SenderBranchCode = Number(ddlSourceBranchAdd.value);
        TranferHeaderModel.ReceiverBranchCode = Number(ddlToBranchAdd.value);
        TranferHeaderModel.SenderStoreID = Number(ddlSourceStoreAdd.value);
        TranferHeaderModel.ReceiverStoreID = Number(ddlToStoreAdd.value);
        TranferHeaderModel.VerfiedBy = txtApprovedBy.value;
        TranferHeaderModel.Remark = txtRemarks.value;
        var StatusFlag;
        // Details
        for (var i = 0; i < CountGrid; i++) {
            TransferDetailSingleModel = new I_Stk_TR_TransferDetails();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            $("#txt_StatusFlag" + i).val("");
            TransferDetailSingleModel.StatusFlag = StatusFlag.toString();
            if (StatusFlag == "i") {
                var Typeuom = $("#dllUom" + i);
                var ratedata = $('option:selected', Typeuom).attr('data-rate');
                TransferDetailSingleModel.TransfareDetailID = 0;
                TransferDetailSingleModel.Serial = $("#txtSerial" + i).val();
                TransferDetailSingleModel.ItemID = Number($("#txt_ItemID" + i).val());
                TransferDetailSingleModel.SendQty = Number($("#txtConvertedQnty" + i).val());
                TransferDetailSingleModel.UnitID = Number($("#dllUom" + i).val());
                TransferDetailSingleModel.RecOnhandQty = Number($("#txtToQty" + i).val());
                TransferDetailSingleModel.SrcOhnandQty = Number($("#txtSrcQty" + i).val());
                TransferDetailSingleModel.StockSendQty = (Number($("#txtConvertedQnty" + i).val()) * Number(ratedata));
                TransferDetailSingleModel.StockRecQty = (Number($("#txtConvertedQnty" + i).val()) * Number(ratedata));
                TransferDetailSingleModel.UserCode = sys.SysSession.CurrentEnvironment.UserCode;
                TransferDetailSingleModel.Token = sys.SysSession.CurrentEnvironment.Token;
                TransferDetailModel.push(TransferDetailSingleModel);
            }
            else if (StatusFlag == "u") {
                var Typeuom = $("#dllUom" + i);
                var ratedata = $('option:selected', Typeuom).attr('data-rate');
                TransferDetailSingleModel.TransfareDetailID = Number($("#TransfareDetailID" + i).val());
                TransferDetailSingleModel.Serial = $("#txtSerial" + i).val();
                TransferDetailSingleModel.ItemID = Number($("#txt_ItemID" + i).val());
                TransferDetailSingleModel.SendQty = Number($("#txtConvertedQnty" + i).val());
                TransferDetailSingleModel.UnitID = Number($("#dllUom" + i).val());
                TransferDetailSingleModel.RecOnhandQty = Number($("#txtToQty" + i).val());
                TransferDetailSingleModel.SrcOhnandQty = Number($("#txtSrcQty" + i).val());
                TransferDetailSingleModel.StockSendQty = (Number($("#txtConvertedQnty" + i).val()) * Number(ratedata));
                TransferDetailSingleModel.StockRecQty = (Number($("#txtConvertedQnty" + i).val()) * Number(ratedata));
                TransferDetailSingleModel.UserCode = sys.SysSession.CurrentEnvironment.UserCode;
                TransferDetailSingleModel.Token = sys.SysSession.CurrentEnvironment.Token;
                TransferDetailModel.push(TransferDetailSingleModel);
            }
            else if (StatusFlag == "d") {
                if (FlagAddOrEdit == 2) {
                    if ($("#TransfareDetailID" + i).val() != "") {
                        var deletedID = $("#TransfareDetailID" + i).val();
                        TransferDetailSingleModel.TransfareDetailID = deletedID;
                        TransferDetailModel.push(TransferDetailSingleModel);
                    }
                }
            }
        }
        MasterDetailModel.I_Stk_TR_Transfer = TranferHeaderModel;
        MasterDetailModel.I_Stk_TR_TransferDetails = TransferDetailModel;
        MasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
    }
    function Insert() {
        MasterDetailModel.I_Stk_TR_Transfer.CreatedBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.I_Stk_TR_Transfer.CreatedAt = DateTimeFormat(Date().toString());
        MasterDetailModel.I_Stk_TR_Transfer.TransfareID = 0;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("DirectTransfer", "InsertDirectTransferMasterDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DisplayMassage("تم اصدار  تحويل رقم " + res.Tr_No, 'Transfer number ' + res.Tr_No + 'has been issued', MessageType.Succeed);
                    txtTrNo.value = res.Tr_No.toString();
                    GlobalTransferID = res.TransfareID;
                    Save();
                    AfterInsertOrUpdateFlag = true;
                    GridRowDoubleClick();
                }
                else {
                    DisplayMassage("هناك خطــأ ", '(Error)', MessageType.Error);
                }
            }
        });
    }
    function Update() {
        MasterDetailModel.I_Stk_TR_Transfer.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.I_Stk_TR_Transfer.UpdatedAt = DateTimeFormat(Date().toString());
        MasterDetailModel.I_Stk_TR_Transfer.TransfareID = GlobalTransferID;
        // creation
        if (SelectedTransferModel.length > 0) {
            MasterDetailModel.I_Stk_TR_Transfer.CreatedBy = SelectedTransferModel[0].CreatedBy;
            MasterDetailModel.I_Stk_TR_Transfer.CreatedAt = SelectedTransferModel[0].CreatedAt;
        }
        else {
            MasterDetailModel.I_Stk_TR_Transfer.CreatedBy = SysSession.CurrentEnvironment.UserCode;
            MasterDetailModel.I_Stk_TR_Transfer.CreatedAt = DateTimeFormat(Date().toString());
        }
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("DirectTransfer", "UpdateDirectTransferDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DisplayMassage("تم التعديل بنجاح " + res.Tr_No, 'Editied successfully' + res.Tr_No, MessageType.Succeed);
                    GlobalTransferID = res.TransfareID;
                    Save();
                    AfterInsertOrUpdateFlag = true;
                    GridRowDoubleClick();
                }
                else {
                    DisplayMassage("هناك خطــأ ", '(Error)', MessageType.Error);
                }
            }
        });
    }
    function Open() {
        Assign();
        MasterDetailModel.I_Stk_TR_Transfer.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.I_Stk_TR_Transfer.UpdatedAt = DateTimeFormat(Date().toString());
        MasterDetailModel.I_Stk_TR_Transfer.TransfareID = GlobalTransferID;
        if (SelectedTransferModel.length > 0) {
            MasterDetailModel.I_Stk_TR_Transfer.CreatedBy = SelectedTransferModel[0].CreatedBy;
            MasterDetailModel.I_Stk_TR_Transfer.CreatedAt = SelectedTransferModel[0].CreatedAt;
        }
        else {
            MasterDetailModel.I_Stk_TR_Transfer.CreatedBy = SysSession.CurrentEnvironment.UserCode;
            MasterDetailModel.I_Stk_TR_Transfer.CreatedAt = DateTimeFormat(Date().toString());
        }
        MasterDetailModel.I_Stk_TR_Transfer.IsSent = false;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("DirectTransfer", "Open"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DisplayMassage("تم فك التحويل " + res.Tr_No, 'Transfer decoded' + res.Tr_No, MessageType.Succeed);
                    GlobalTransferID = res.TransfareID;
                    InitializeGrid();
                    chkApproved.disabled = true;
                    btnEdit.disabled = false;
                }
                else {
                    DisplayMassage("هناك خطــأ ", '(Error)', MessageType.Error);
                }
            }
        });
    }
    function Save() {
        InitializeGrid();
        $("#div_hedr").removeClass("disabledDiv");
        $("#divGridShoow").removeClass("disabledDiv");
        ShowButons();
        DisableControls();
    }
})(RawStock || (RawStock = {}));
//# sourceMappingURL=RawStock.js.map