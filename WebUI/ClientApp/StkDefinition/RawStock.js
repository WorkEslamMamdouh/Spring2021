$(document).ready(function () {
    RawStock.InitalizeComponent();
});
var RawStock;
(function (RawStock) {
    var TypeStock = "0";
    var TypeTrans = "1";
    var NumCnt = 0;
    var sys = new SystemTools();
    var ReportGrid = new JsGrid();
    var SysSession = GetSystemSession();
    var Finyear;
    var BranchCode;
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
    var ModeItmes = 3;
    var counter = 0;
    //Arrays
    var BranchDetails = new Array();
    var StatesFilterDetailsAr = new Array();
    var StatesFilterDetailsEn = new Array();
    var StoreSourceDetails = new Array();
    var StoreToDetails = new Array();
    var HeaderWithDetail = new IQ_DirectTransferWithDetail();
    var Selecteditem = new Array();
    var IQ_DirectTransferDetail = new Array();
    var SearchDetails = new Array();
    var GetTransferDetail = new Array();
    var GetTransferDetail = new Array();
    var ItemsListDetails = new Array();
    var ItemsSourceListDetails = new Array();
    var ItemsToListDetails = new Array();
    var GetItemInfo = new Array();
    var Display_D_UOM = new Array();
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
    var txtApprovedBy;
    var txtCreatedBy;
    var txtCreatedAt;
    var txtUpdatedBy;
    var txtUpdatedAt;
    var txtSearch;
    var txtApprovedBy;
    var txtSenderTrNO;
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
    var Isnew = false;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    function InitalizeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "?????????????? ??????????";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Raw Stock";
        }
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        InitalizeControls();
        InitalizeEvents();
        drpType.value = "0";
        $('#Stock').removeClass('display_none');
        $('#Trans').addClass('display_none');
        Displaystore();
    }
    RawStock.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        drpType = document.getElementById("drpType");
        txtFromDate = document.getElementById("txtFromDate");
        txtToDate = document.getElementById("txtToDate");
        txtSenderTrNO = document.getElementById("txtSenderTrNO");
        txtTransferDate = document.getElementById("txtTransferDate");
        txtRefNumber = document.getElementById("txtRefNumber");
        txtRemarks = document.getElementById("txtRemarks");
        txtApprovedBy = document.getElementById("txtApprovedBy");
        btnShow = document.getElementById("btnShow");
        btnEdit = document.getElementById("btnEdit");
        btnAdd = document.getElementById("btnAdd");
        btnAddDetails = document.getElementById("btnAddDetails");
        btnSave = document.getElementById("btnSave");
        btnBack = document.getElementById("btnBack");
        txtCreatedAt = document.getElementById("txtCreatedAt");
        txtCreatedBy = document.getElementById("txtCreatedBy");
        txtUpdatedAt = document.getElementById("txtUpdatedAt");
        txtUpdatedBy = document.getElementById("txtUpdatedBy");
        txtSearch = document.getElementById("txtSearch");
        chkApproved = document.getElementById("chkApproved");
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
                    //    detailstock[i].NameIsActive = detailstock[i].IsActive == true ? (lang == "ar" ? "????????" : "Active") : (lang == "ar" ? "?????? ????????" : "Not Active");
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
            { title: '?????? ??????????', name: "ItemCode", type: "text", width: "10%" },
            { title: '??????????', name: (lang == "ar" ? "DescA" : "DescL"), type: "text", width: "35%" },
            { title: '??????????', name: (lang == "ar" ? "CategoryDescA" : "CategoryDescL"), type: "text", width: "12%" },
            { title: '?????????? ??????????????', name: (lang == "ar" ? "ItemFamilyDescA" : "ItemFamilyDescE"), type: "text", width: "14%" },
            { title: '???????????? ????????????????', name: (lang == "ar" ? "UOMDescA" : "UOMDescE"), type: "text", width: "16%" },
            { title: '???????? ??????????????', name: "OnhandQty", type: "text", width: "13%" },
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
    }
    function DisplayData(Selected_Data) {
        DocumentActions.RenderFromModel(Selected_Data[0]);
        $('#Div_Show_units').addClass('display_none');
        $('#Div_Show_Quantity').addClass('display_none');
    }
    function drpType_onchange() {
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
    //------------------------------------------------------ * T R A N S * ---------------------------------------
    function InitalizeComponentTrans() {
        txtFromDate.value = SysSession.CurrentEnvironment.StartDate;
        txtToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        txtTransferDate.value = GetDate();
        InitalizeEventstrans();
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        Finyear = Number(SysSession.CurrentEnvironment.CurrentYear);
        displayUOM();
    }
    function InitalizeEventstrans() {
        btnAddDetails.onclick = AddNewRow;
        btnEdit.onclick = btnEdit_onclick;
        btnBack.onclick = btnBack_onclick;
        btnSave.onclick = btnSave_onclick;
        txtSearch.onkeyup = txtSearch_onKeyup;
        btnAdd.onclick = btnAdd_onclick;
    }
    function btnShow_onclick() {
        $("#divTransferDetails").addClass("display_none");
        $("#div_Approve").addClass("display_none");
        $("#btnBack").addClass("display_none");
        $("#btnSave").addClass("display_none");
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
            { title: "????????????", name: "SendBy", type: "text", width: "15%" },
            { title: "??????????????", name: "IsPostdesc", type: "text", width: "4.5%" },
            { title: "??????????????", name: "ReceivedBy", type: "text", width: "15%" },
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
                        IQ_DirectTransferDetail[i].IsSent == true ? IQ_DirectTransferDetail[i].IsPostdesc = (lang == "ar" ? IQ_DirectTransferDetail[i].IsPostdesc = "????????" : IQ_DirectTransferDetail[i].IsPostdesc = "Authrized") : (lang == "ar" ? IQ_DirectTransferDetail[i].IsPostdesc = "?????? ????????" : IQ_DirectTransferDetail[i].IsPostdesc = "Not Authrized");
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
        Clear();
        $("#btnPrintTransaction").removeClass("display_none");
        $("#divbuttons").removeClass("display_none");
        $("#divTransferDetails").removeClass("display_none");
        $("#btnEdit").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        $("#div_Approve").removeClass("display_none");
        $("#div_Data").html("");
        $("#btnBack").addClass("display_none");
        $("#btnSave").addClass("display_none");
        Selecteditem = IQ_DirectTransferDetail.filter(function (x) { return x.TransfareID == Number(TransGrid.SelectedKey); });
        console.log(Selecteditem);
        TransferID = Number(TransGrid.SelectedKey);
        txtSenderTrNO.value = Selecteditem[0].Tr_No.toString();
        txtTransferDate.value = Selecteditem[0].TrDate;
        txtRefNumber.value = Selecteditem[0].RefNO;
        txtApprovedBy.value = Selecteditem[0].VerfiedBy;
        txtRemarks.value = Selecteditem[0].Remark;
        txtCreatedBy.value = Selecteditem[0].CreatedBy;
        txtCreatedAt.value = Selecteditem[0].CreatedAt;
        txtUpdatedBy.value = Selecteditem[0].UpdatedBy;
        txtUpdatedAt.value = Selecteditem[0].UpdatedAt;
        chkApproved.checked = Selecteditem[0].IsSent;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Transfer", "GetDetail"),
            data: { TransferID: TransferID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    GetTransferDetail = new Array();
                    GetTransferDetail = result.Response;
                    CountGrid = 0;
                    for (var i = 0; i < GetTransferDetail.length; i++) {
                        BuildControls(i);
                        Bindingdata(i, GetTransferDetail);
                        CountGrid++;
                    }
                }
            }
        });
        $("#btnEdit").addClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
    }
    function Bindingdata(Num, list) {
        $('#TransfareDetailID' + Num).val(list[Num].TransfareDetailID);
        $('#txtItemCode' + Num).val(list[Num].ItemCode);
        $('#txtItemName' + Num).val(lang == "ar" ? list[Num].ITFamly_DescA : list[Num].ITFamly_DescA);
        $('#dllUom' + Num).val(list[Num].UnitID);
        $('#txtConvertedQnty' + Num).val(list[Num].SendQty);
        $('#txtRecQty' + Num).val(list[Num].RecQty);
        $('#txtstockQnty' + Num).val(list[Num].StockReqQty);
        $('#txt_ItemID' + Num).val(list[Num].ItemID);
    }
    function displayUOM() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefUnit", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Display_D_UOM = result.Response;
                }
            }
        });
    }
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
                DisplayMassage("?????? ?????????? ???????????? ?????????????? ", "The transferred quantity must be entered", MessageType.Error);
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
            // can delete new inserted record  without need for delete privilage
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");
            counter = 0;
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
            '<span id="btn_minus' + cnt + '" disabled class=" glyphicon glyphicon-minus-sign fontitm3sendTransfer "></span>' +
            '</div>' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1" style="width:3%!important">' +
            '<input id="txtSerial' + cnt + '" name="FromDate" disabled type="hidden" value="' + (CountGrid + 1) + '" class="form-control  text_Display" />' +
            '</div>' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0" style="width:3%!important;">' +
            '<button type="button" class="col-xs-12 src-btn btn btn-warning input-sm" disabled id="btnSearchItems' + cnt + '" name="ColSearch">   ' +
            '<i class="fa fa-search"></i></button>' +
            '<input id="txtItemNumber' + cnt + '" name="" disabled type="hidden" class="col-lg-9  form-control  text_Display" /></div>' +
            '<div class="col-lg-2 col-md-2 col-sm-2 col-xl-2 col-xs-2 Acc" >' +
            '<input id="txtItemCode' + cnt + '" name="" disabled type="text" class="form-control  text_Display" /></div>' +
            '<div class="col-lg-3 col-md-3 col-sm-3 col-xl-3 col-xs-3 Acc" >' +
            '<input id="txtItemName' + cnt + '" name="" disabled type="text" class="form-control  text_Display" /></div>' +
            '<div class="col-xs-1"style="width: 10 % !important;">' +
            '<select id="dllUom' + cnt + '"  disabled class="form-control right2"><option value="0"> ' + (lang == "ar" ? "???????? " : "Choose ") + '</option></select></div>' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1" >' +
            '<input id="txtstockQnty' + cnt + '" name="" disabled type="number" value="0"  min="0" class="form-control  text_Display" /></div>' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1" >' +
            '<input id="txtConvertedQnty' + cnt + '" name="" disabled type="number" value="0"  min="0" class="form-control  text_Display" /></div>' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 Acc" style=" ">' +
            '<input id="txtRecQty' + cnt + '" name="" disabled type="text" class="form-control  text_Display" /></div>' +
            '<input  id="txt_StatusFlag' + cnt + '" name = " " type ="hidden"  />' +
            '<input  id="txt_ItemID' + cnt + '" name = " " type ="hidden"  />' +
            '</div>';
        $("#div_Data").append(html);
        $('#dllUom' + cnt + '').html('');
        for (var i = 0; i < Display_D_UOM.length; i++) {
            $('#dllUom' + cnt + '').append('<option  value="' + Display_D_UOM[i].UomID + '">' + (lang == "ar" ? Display_D_UOM[i].DescA : Display_D_UOM[i].DescE) + '</option>');
        }
        // Items Search
        $('#btnSearchItems' + cnt).click(function (e) {
            if ($("#txt_StatusFlag" + cnt).val() != "i") {
                $("#txt_StatusFlag" + cnt).val("u");
            }
            NumCnt = cnt;
            var TypeStockr = Number(TypeStock);
            sys.FindKey(Modules.RawStock, "btnSearchItems", " CompCode = " + compcode + " and LOCATION2 = '" + TypeStockr + "' and StoreCode = 1 and OnhandQty > 0", function () {
                var Itemid = SearchGrid.SearchDataGrid.SelectedKey;
                if (!validationitem(Itemid, Number($("#txt_ItemID" + NumCnt + "").val())))
                    return;
                var NewItem = detailstock.filter(function (x) { return x.ItemID == Itemid; });
                var GetItemInfo = new Array();
                $("#txt_ItemID" + NumCnt + "").val(Itemid);
                var ItemCode = '';
                var ItemID = Itemid;
                var Mode = ModeItmes;
                Ajax.Callsync({
                    type: "Get",
                    url: sys.apiUrl("StkDefItemType", "GetItemByCode"),
                    data: {
                        CompCode: compcode, FinYear: Finyear, ItemCode: ItemCode, ItemID: ItemID, storeid: 1, Mode: Mode,
                        UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                    },
                    success: function (d) {
                        var result = d;
                        if (result.IsSuccess) {
                            GetItemInfo = result.Response;
                            if (GetItemInfo.length > 0) {
                                $('#dllUom' + NumCnt + '').html('');
                                for (var i = 0; i < GetItemInfo.length; i++) {
                                    $('#dllUom' + NumCnt + '').append('<option  data-OnhandQty="' + GetItemInfo[i].OnhandQty + '" data-UnitPrice="' + GetItemInfo[i].UnitPrice + '" data-MinPrice="' + GetItemInfo[i].MinPrice + '" data-Rate="' + GetItemInfo[i].Rate + '" value="' + GetItemInfo[i].uomid + '">' + (lang == "ar" ? GetItemInfo[i].u_DescA : GetItemInfo[i].u_DescE) + '</option>');
                                }
                                $('#txtItemName' + NumCnt + '').val((lang == "ar" ? GetItemInfo[0].It_DescA : GetItemInfo[0].it_DescE));
                                $('#txtItemCode' + NumCnt + '').val(GetItemInfo[0].ItemCode);
                                $('#txtstockQnty' + NumCnt + '').val(NewItem[0].OnhandQty);
                                $('#txtstockQnty' + NumCnt + '').attr('disabled', 'disabled');
                                $('#txtItemName' + NumCnt + '').attr('disabled', 'disabled');
                            }
                            else {
                                $('#dllUom' + NumCnt + '').append('<option value="null">???????? ????????????</option>');
                                $('#txtItemName' + NumCnt + '').val('');
                                $('#txtstockQnty' + NumCnt + '').val('');
                                $('#txtItemCode' + NumCnt + '').val('');
                                $('#txtItemName' + NumCnt + '').removeAttr('disabled');
                                $('#txtItemCode' + NumCnt + '').removeAttr('disabled');
                            }
                        }
                    }
                });
            });
        });
        $("#txtItemCode" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var GetItemInfo1 = new Array();
            numcnt = cnt;
            var ItemCode = '';
            var ItemID = id;
            var Mode = ModeItmes;
            var Storeid = 1;
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
                            $('#dllUom' + NumCnt + '').html('');
                            for (var i = 0; i < GetItemInfo.length; i++) {
                                $('#dllUom' + NumCnt + '').append('<option  data-OnhandQty="' + GetItemInfo[i].OnhandQty + '" data-UnitPrice="' + GetItemInfo[i].UnitPrice + '" data-MinPrice="' + GetItemInfo[i].MinPrice + '" data-Rate="' + GetItemInfo[i].Rate + '" value="' + GetItemInfo[i].uomid + '">' + (lang == "ar" ? GetItemInfo[i].u_DescA : GetItemInfo[i].u_DescE) + '</option>');
                            }
                            $('#txtItemName' + NumCnt + '').val((lang == "ar" ? GetItemInfo[0].It_DescA : GetItemInfo[0].it_DescE));
                            $('#txtItemCode' + NumCnt + '').val(GetItemInfo[0].ItemCode);
                            $('#txtItemName' + NumCnt + '').attr('disabled', 'disabled');
                        }
                        else {
                            $('#dllUom' + NumCnt + '').append('<option value="null">???????? ????????????</option>');
                            $('#txtItemName' + NumCnt + '').val('');
                            $('#txtItemCode' + NumCnt + '').val('');
                            $('#txtItemName' + NumCnt + '').removeAttr('disabled');
                            $('#txtItemCode' + NumCnt + '').removeAttr('disabled');
                        }
                    }
                }
            });
        });
        $("#dllUom" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var Typeuom = $("#dllUom" + cnt);
            var onhandqty = $('option:selected', Typeuom).attr('data-onhandqty');
            $('#txtSrcQty' + cnt + '').val(onhandqty);
            $('#txtToQty' + cnt + '').val("0");
            $('#txtConvertedQnty' + cnt + '').val('0');
        });
        $("#txtConvertedQnty" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            if (Number($("#txtConvertedQnty" + cnt).val()) > Number($("#txtstockQnty" + cnt).val())) {
                DisplayMassage("???????????? ???? ???????? ???????????? ?????????????? ???????? ???? ?????????? ??????????????", "The number of converters cannot be greater than the available quantity", MessageType.Error);
                $("#txtConvertedQnty" + cnt).val($("#txtstockQnty" + cnt).val());
                Errorinput($("#txtConvertedQnty" + cnt));
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
        WorningMessage("???? ???????? ????????????", "Do you want to delete?", "??????????", "worning", function () {
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
            counter = 0;
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
                    DisplayMassage("?????????? ?????????? ???? ??????", "Item found before", MessageType.Error);
                    Errorinput($("#txtItemName" + CountGrid + ""));
                    $("#txtItemCode" + CountGrid + "").val("");
                    return false;
                }
            }
        }
        return true;
    }
    function btnAdd_onclick() {
        Isnew = true;
        Clear();
        EnableControls();
        HideButtons();
        counter = 0;
        $("#divTransferDetails").removeClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
        $("#divbuttons").removeClass("display_none");
        chkApproved.checked = true;
        chkApproved.disabled = true;
    }
    function btnEdit_onclick() {
        Isnew = false;
        EnableControls();
        $("#btnEdit").addClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");
        $("#div_hedr").addClass("disabledDiv");
    }
    function btnBack_onclick() {
        if (Isnew == true) {
            $("#div_hedr").removeClass("disabledDiv");
            $("#divTransferDetails").addClass("display_none");
            $("#btnPrintTransaction").addClass("display_none");
            $("#divbuttons").addClass("display_none");
            DisableControls();
            Isnew = false;
        }
        else {
            $("#div_hedr").removeClass("disabledDiv");
            $("#btnPrintTransaction").removeClass("display_none");
            $("#divbuttons").removeClass("display_none");
            ShowButons();
        }
    }
    function btnSave_onclick() {
        debugger;
        if (Isnew == true) {
            Insert();
        }
        else {
            Update();
        }
    }
    function Validation_Grid(rowcount) {
        var Qty = Number($("#txtConvertedQnty" + rowcount).val());
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "") {
            return true;
        }
        else {
            if ($("#txtItemName" + rowcount).val() == "") {
                DisplayMassage('?????????? ?????????? ??????????', 'Please enter item', MessageType.Error);
                Errorinput($("#txtItemName" + rowcount));
                return false;
            }
            else if (Qty == 0) {
                DisplayMassage('?????????? ?????????? ???????????? ??????????????', 'Please enter converted Quantity', MessageType.Error);
                Errorinput($("#txtConvertedQnty" + rowcount));
                return false;
            }
            return true;
        }
    }
    //------------------------------------------------------ Clear && Search && Enable && Disabled Region -----------------------------------
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
    function txtSearch_onKeyup() {
        if (txtSearch.value != "") {
            var search_1 = txtSearch.value.toLowerCase();
            SearchDetails = IQ_DirectTransferDetail.filter(function (x) { return x.TrDate.toLowerCase().search(search_1) >= 0
                || x.Tr_No.toString().search(search_1) >= 0 || x.RefNO.toString().search(search_1) >= 0 || x.SendBy.search(search_1) >= 0 || x.ReceivedBy.search(search_1) >= 0; });
            Grid.DataSource = SearchDetails;
            Grid.Bind();
        }
        else {
            Grid.DataSource = IQ_DirectTransferDetail;
            Grid.Bind();
        }
    }
    function EnableControls() {
        //$("#divTransferDetails :input").removeAttr("disabled");
        $("#btnAddDetails").removeClass("display_none");
        $("#txtRefNumber").removeAttr("disabled");
        $("#txtApprovedBy").removeAttr("disabled");
        $("#txtRemarks").removeAttr("disabled");
        $("#chkApproved").removeAttr("disabled");
        for (var i = 0; i < CountGrid; i++) {
            $("#btn_minus" + i).removeAttr("disabled");
            $("#btnSearchItems" + i).removeAttr("disabled");
            $("#txtItemCode" + i).removeAttr("disabled");
            //$("#dllUom" + i).removeAttr("disabled");
            $("#txtConvertedQnty" + i).removeAttr("disabled");
        }
    }
    function DisableControls() {
        $("#btnAddDetails").addClass("display_none");
        $("#txtRefNumber").attr("disabled", "disabled");
        $("#txtApprovedBy").attr("disabled", "disabled");
        $("#txtRemarks").attr("disabled", "disabled");
        $("#chkApproved").attr("disabled", "disabled");
        for (var i = 0; i < CountGrid; i++) {
            $("#btn_minus" + i).attr("disabled", "disabled");
            $("#btnSearchItems" + i).attr("disabled", "disabled");
            $("#txtItemCode" + i).attr("disabled", "disabled");
            //$("#dllUom" + i).attr("disabled", "disabled");
            $("#txtConvertedQnty" + i).attr("disabled", "disabled");
        }
    }
    function HideButtons() {
        $("#btnEdit").addClass("display_none");
        $("#btnSave").removeClass("display_none");
        $("#btnBack").removeClass("display_none");
    }
    function ShowButons() {
        DisableControls();
        $("#btnEdit").removeClass("display_none");
        $("#btnBack").addClass("display_none");
        $("#btnSave").addClass("display_none");
    }
    function DisableDiv() {
        $("#div_hedr").addClass("disabledDiv");
        $("#divTransferDetails").removeClass("disabledDiv");
        $("#divTransferDetails").removeClass("display_none");
    }
    function Clear() {
        txtTransferDate.value = GetDate();
        txtUpdatedBy.value = "";
        txtUpdatedAt.value = "";
        txtCreatedBy.value = "";
        txtCreatedAt.value = "";
        txtRefNumber.value = "";
        txtSenderTrNO.value = "";
        txtApprovedBy.value = "";
        txtRemarks.value = "";
        chkApproved.checked = false;
        $("#divTransferDetails").removeClass("display_none");
        $("#btnEdit").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        $("#div_Approve").removeClass("display_none");
        $("#div_Data").html("");
    }
    //--------------------------------------------------------------Assign & Isert - Update---------------------------------------------------
    function Assign() {
        MasterDetailModel = new DirectTransferMasterDetails();
        TranferHeaderModel = new I_Stk_TR_Transfer();
        TransferDetailModel = new Array();
        // Header Data
        TranferHeaderModel.Tr_No = Number(txtSenderTrNO.value);
        TranferHeaderModel.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
        TranferHeaderModel.BranchCode = Number(BranchCode);
        TranferHeaderModel.TrDate = txtTransferDate.value;
        TranferHeaderModel.RefNO = txtRefNumber.value;
        TranferHeaderModel.VoucherNo = 1;
        TranferHeaderModel.TrType = 1;
        TranferHeaderModel.TFType = 1;
        if (chkApproved.checked == true) {
            TranferHeaderModel.IsSent = true;
        }
        else {
            TranferHeaderModel.IsSent = false;
        }
        TranferHeaderModel.SenderBranchCode = 1;
        TranferHeaderModel.ReceiverBranchCode = 1;
        TranferHeaderModel.SenderStoreID = 1;
        TranferHeaderModel.ReceiverStoreID = 1;
        TranferHeaderModel.VerfiedBy = txtApprovedBy.value;
        TranferHeaderModel.Remark = txtRemarks.value;
        var StatusFlag = "";
        for (var i = 0; i < CountGrid; i++) {
            TransferDetailSingleModel = new I_Stk_TR_TransferDetails();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            $("#txt_StatusFlag" + i).val("");
            TransferDetailSingleModel.StatusFlag = StatusFlag;
            if (StatusFlag == "i") {
                TransferDetailSingleModel.TransfareDetailID = 0;
                TransferDetailSingleModel.Serial = $("#txtSerial" + i).val();
                TransferDetailSingleModel.ItemID = Number($("#txt_ItemID" + i).val());
                TransferDetailSingleModel.SendQty = Number($("#txtConvertedQnty" + i).val());
                TransferDetailSingleModel.UnitID = Number($("#dllUom" + i).val());
                TransferDetailSingleModel.RecOnhandQty = Number($("#txtToQty" + i).val());
                TransferDetailSingleModel.SrcOhnandQty = Number($("#txtSrcQty" + i).val());
                TransferDetailSingleModel.StockSendQty = Number($("#txtConvertedQnty" + i).val());
                TransferDetailSingleModel.StockRecQty = Number($("#txtConvertedQnty" + i).val());
                TransferDetailSingleModel.StockReqQty = Number($("#txtstockQnty" + i).val());
                TransferDetailSingleModel.UserCode = sys.SysSession.CurrentEnvironment.UserCode;
                TransferDetailSingleModel.Token = sys.SysSession.CurrentEnvironment.Token;
                TransferDetailModel.push(TransferDetailSingleModel);
            }
            else if (StatusFlag == "u") {
                TransferDetailSingleModel.TransfareDetailID = Number($("#TransfareDetailID" + i).val());
                TransferDetailSingleModel.Serial = $("#txtSerial" + i).val();
                TransferDetailSingleModel.ItemID = Number($("#txt_ItemID" + i).val());
                TransferDetailSingleModel.SendQty = Number($("#txtConvertedQnty" + i).val());
                TransferDetailSingleModel.UnitID = Number($("#dllUom" + i).val());
                TransferDetailSingleModel.RecOnhandQty = Number($("#txtToQty" + i).val());
                TransferDetailSingleModel.SrcOhnandQty = Number($("#txtSrcQty" + i).val());
                TransferDetailSingleModel.StockSendQty = Number($("#txtConvertedQnty" + i).val());
                TransferDetailSingleModel.StockRecQty = Number($("#txtConvertedQnty" + i).val());
                TransferDetailSingleModel.StockReqQty = Number($("#txtstockQnty" + i).val());
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
        Assign();
        MasterDetailModel.I_Stk_TR_Transfer.CreatedBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.I_Stk_TR_Transfer.SendBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.I_Stk_TR_Transfer.CreatedAt = DateTimeFormat(Date().toString());
        MasterDetailModel.I_Stk_TR_Transfer.TransfareID = 0;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("Transfer", "InsertDirectTransferMasterDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DisplayMassage("???? ??????????  ?????????? ?????? " + res.Tr_No, 'Transfer number ' + res.Tr_No + 'has been issued', MessageType.Succeed);
                    txtSenderTrNO.value = res.Tr_No.toString();
                    GlobalTransferID = res.TransfareID;
                    Save();
                    AfterInsertOrUpdateFlag = true;
                    //GridRowDoubleClick();
                }
                else {
                    DisplayMassage("???????? ?????????? ", '(Error)', MessageType.Error);
                }
            }
        });
    }
    function Update() {
        Assign();
        MasterDetailModel.I_Stk_TR_Transfer.SendBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.I_Stk_TR_Transfer.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.I_Stk_TR_Transfer.UpdatedAt = DateTimeFormat(Date().toString());
        MasterDetailModel.I_Stk_TR_Transfer.TransfareID = GlobalTransferID;
        // creation
        if (SelectedTransferModel.length > 0) {
            MasterDetailModel.I_Stk_TR_Transfer.CreatedBy = SelectedTransferModel[0].CreatedBy;
            MasterDetailModel.I_Stk_TR_Transfer.CreatedAt = SelectedTransferModel[0].CreatedAt;
            MasterDetailModel.I_Stk_TR_Transfer.ReceiverStoreID = SelectedTransferModel[0].ReceiverStoreID;
            MasterDetailModel.I_Stk_TR_Transfer.RequestTransferID = SelectedTransferModel[0].RequestTransferID;
            MasterDetailModel.I_Stk_TR_Transfer.SenderStoreID = SelectedTransferModel[0].SenderStoreID;
            MasterDetailModel.I_Stk_TR_Transfer.SendTransferID = SelectedTransferModel[0].SendTransferID;
            MasterDetailModel.I_Stk_TR_Transfer.TransfareID = SelectedTransferModel[0].TransfareID;
        }
        else {
            MasterDetailModel.I_Stk_TR_Transfer.CreatedBy = SysSession.CurrentEnvironment.UserCode;
            MasterDetailModel.I_Stk_TR_Transfer.CreatedAt = DateTimeFormat(Date().toString());
        }
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("Transfer", "UpdateDirectTransferDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DisplayMassage("???? ?????????????? ?????????? " + res.Tr_No, 'Editied successfully' + res.Tr_No, MessageType.Succeed);
                    GlobalTransferID = res.TransfareID;
                    Save();
                    AfterInsertOrUpdateFlag = true;
                    GridRowDoubleClick();
                }
                else {
                    DisplayMassage("???????? ?????????? ", '(Error)', MessageType.Error);
                }
            }
        });
    }
    function Save() {
        InitializeGridTrans();
        $("#div_hedr").removeClass("disabledDiv");
        $("#divGridShoow").removeClass("disabledDiv");
        ShowButons();
        Clear();
        $("#btnPrintTransaction").removeClass("display_none");
        $("#divbuttons").removeClass("display_none");
        $("#divTransferDetails").removeClass("display_none");
        $("#btnEdit").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        $("#div_Approve").removeClass("display_none");
        $("#div_Data").html("");
        $("#btnBack").addClass("display_none");
        $("#btnSave").addClass("display_none");
        Selecteditem = IQ_DirectTransferDetail.filter(function (x) { return x.TransfareID == Number(GlobalTransferID); });
        console.log(Selecteditem);
        TransferID = Number(GlobalTransferID);
        txtSenderTrNO.value = Selecteditem[0].Tr_No.toString();
        txtTransferDate.value = Selecteditem[0].TrDate;
        txtRefNumber.value = Selecteditem[0].RefNO;
        txtApprovedBy.value = Selecteditem[0].VerfiedBy;
        txtRemarks.value = Selecteditem[0].Remark;
        txtCreatedBy.value = Selecteditem[0].CreatedBy;
        txtCreatedAt.value = Selecteditem[0].CreatedAt;
        txtUpdatedBy.value = Selecteditem[0].UpdatedBy;
        txtUpdatedAt.value = Selecteditem[0].UpdatedAt;
        chkApproved.checked = Selecteditem[0].IsSent;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Transfer", "GetDetail"),
            data: { TransferID: TransferID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    GetTransferDetail = new Array();
                    GetTransferDetail = result.Response;
                    CountGrid = 0;
                    for (var i = 0; i < GetTransferDetail.length; i++) {
                        BuildControls(i);
                        Bindingdata(i, GetTransferDetail);
                        CountGrid++;
                    }
                }
            }
        });
        $("#btnEdit").addClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
    }
})(RawStock || (RawStock = {}));
//# sourceMappingURL=RawStock.js.map