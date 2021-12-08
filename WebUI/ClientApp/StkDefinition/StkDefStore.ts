
$(document).ready(() => {
    DefStore.InitalizeComponent();
})

namespace DefStore {

    var Details: Array<A_RecPay_D_CashBox> = new Array<A_RecPay_D_CashBox>();
    var Details_NumAcount: Array<A_ACCOUNT> = new Array<A_ACCOUNT>();
    var Selected_Data: Array<GQ_GetStore> = new Array<GQ_GetStore>();
    var detailstore: Array<GQ_GetStore> = new Array<GQ_GetStore>();
    var Modelstore: G_STORE = new G_STORE();
    var BranchDetails: Array<G_BRANCH> = new Array<G_BRANCH>();
    var Model: A_RecPay_D_CashBox = new A_RecPay_D_CashBox();
    var SysSession: SystemSession = GetSystemSession();
    var ReportGrid: JsGrid = new JsGrid();
    var sys: SystemTools = new SystemTools();

    //buttons
    var btnsave: HTMLButtonElement;
    var btnback: HTMLButtonElement;
    var btnadd: HTMLButtonElement;
    var btnEdit: HTMLButtonElement;
    var btnback: HTMLButtonElement;
    var btnShow: HTMLButtonElement;

    var checkactive: HTMLInputElement;
    var searchbutmemreport: HTMLInputElement;

    //dropdown
    var drpinventoryAccount: HTMLSelectElement;
    var drpuserType: HTMLSelectElement;

    //global
    var CountGrid = -1;
    var compcode: Number;//SharedSession.CurrentEnvironment.CompCode; 
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var flag = false;
    var flag1 = true;
    var SearchDetails;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var Page = true;
    let pageIndex;
    export function InitalizeComponent() {

        compcode = Number(SysSession.CurrentEnvironment.CompCode);

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "المستودعات";

        } else {
            document.getElementById('Screen_name').innerHTML = " Warehouses";

        }
        InitalizeControls();
        InitalizeEvents();
        FilldrpinventoryAccount();
        fillddlBranch();
    }
    function InitalizeControls() {

        btnadd = document.getElementById("btnadd") as HTMLButtonElement;
        btnEdit = document.getElementById("btnedite") as HTMLButtonElement;
        btnsave = document.getElementById("btnsave") as HTMLButtonElement;
        btnback = document.getElementById("btnback") as HTMLButtonElement;
        btnShow = document.getElementById("btnShow") as HTMLButtonElement;

        searchbutmemreport = document.getElementById("searchbutmemreport") as HTMLInputElement;

        checkactive = document.getElementById("checkactive") as HTMLInputElement;

        drpuserType = document.getElementById("drpuserType") as HTMLSelectElement;
        drpinventoryAccount = document.getElementById("drpinventoryAccount") as HTMLSelectElement;


    }
    function InitalizeEvents() {
        btnsave.onclick = btnsave_onClick;
        btnShow.onclick = Displaystore;
        btnEdit.onclick = btnEdit_onclick;
        btnback.onclick = btnback_onclick;
        btnadd.onclick = btnadd_onclick;
        searchbutmemreport.onkeyup = _SearchBox_Change;


    }
    //---------------------------------------------------------------------------Inventory Account
    function FilldrpinventoryAccount() {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetAll_store"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    Details_NumAcount = result.Response as Array<A_ACCOUNT>;


                    DocumentActions.FillCombowithdefult(Details_NumAcount, drpinventoryAccount, "ACC_CODE", (lang == "ar" ? "ACC_DESCA" : "ACC_DESCL"), (lang == "ar" ? "اختر حساب المخزون" : "Select inventory Account"));



                }
            }
        });
    }
    //---------------------------------------------------------------------------Branch Name  
    function fillddlBranch() {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GBranch", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    BranchDetails = result.Response as Array<G_BRANCH>;
                    DisplaydrpuserType();
                }

            }
        });
    }
    function DisplaydrpuserType() {


        debugger
        for (var i = 0; i < BranchDetails.length; i++) {
            $('#drpuserType').append('<option value="' + BranchDetails[i].BRA_CODE + '">' + (lang == "ar" ? BranchDetails[i].BRA_DESC : BranchDetails[i].BRA_DESCL) + '</option>');
            $('#drpuserType_new').append('<option value="' + BranchDetails[i].BRA_CODE + '">' + (lang == "ar" ? BranchDetails[i].BRA_DESC : BranchDetails[i].BRA_DESCL) + '</option>');

        }

    }
    //---------------------------------------------------------------------------he Grid Of Branchs & Stores
    function Displaystore() {


        $('#divMasterGridiv').removeClass('display_none');

        detailstore = new Array<GQ_GetStore>();
        let BranchCode = Number($('#drpuserType').val());


        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefStore", "GetAll"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {

                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    detailstore = result.Response as Array<GQ_GetStore>;

                    for (var i = 0; i < detailstore.length; i++) {

                        detailstore[i].NameIsActive = detailstore[i].IsActive == true ? (lang == "ar" ? "فعال" : "Active") : (lang == "ar" ? "غير فعال" : "Not Active");
                    }
                    InitializeGridstore();
                    ReportGrid.DataSource = detailstore;
                    ReportGrid.Bind();


                }

            }
        });
    }
    function InitializeGridstore() {

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
        ReportGrid.PrimaryKey = "StoreId";
        ReportGrid.OnItemEditing = () => { };
        ReportGrid.Columns = [
            { title: res.Branch_NUM, name: "BRA_CODE", type: "text", width: "5%" },
            //{ title: res.App_BranchName, name: (lang == "ar" ? "BRA_DESC" : "BRA_DESCL"), type: "text", width: "10%" },
            { title: res.Trns_StoreNO, name: "STORE_CODE", type: "text", width: "10%" },
            { title: res.Store_name, name: (lang == "ar" ? "DescA" : "DescL"), type: "text", width: "10%" },
            { title: res.App_Active, name: "NameIsActive", type: "text", width: "10%" },
        ];

        ReportGrid.Bind();
    }
    function MasterGridDoubleClick() {


        $('#btnedite').removeClass('display_none');
        $('#btnback').addClass('display_none');
        $('#btnsave').addClass('display_none');
        Selected_Data = new Array<GQ_GetStore>();
        Selected_Data = detailstore.filter(x => x.StoreId == Number(ReportGrid.SelectedKey));
        $('#StoreDetail').removeClass('display_none');

        DisplayData(Selected_Data);




    }
    function DisplayData(Selected_Data: Array<GQ_GetStore>) {


        DocumentActions.RenderFromModel(Selected_Data[0]);   
    }
    //---------------------------------------------------------------------------Search in Grid
    function _SearchBox_Change() {

        if (Page) {
            pageIndex = $("#ReportGrid").jsGrid("option", "pageIndex");
        }


        if (searchbutmemreport.value != "") {
            Page = false;
            $("#ReportGrid").jsGrid("option", "pageIndex", 1);
            let search: string = searchbutmemreport.value.toLowerCase();
            SearchDetails = detailstore.filter(x => x.STORE_CODE.toString().search(search) >= 0 || x.DescA.toLowerCase().search(search) >= 0 || x.BRA_DESC.toLowerCase().search(search) >= 0);
            ReportGrid.DataSource = SearchDetails;
            ReportGrid.Bind();


        } else {
            Page = true;
            ReportGrid.DataSource = detailstore;
            ReportGrid.Bind();
            $("#ReportGrid").jsGrid("option", "pageIndex", pageIndex);

        }
    }
    //---------------------------------------------------------------------------Edit button
    function btnEdit_onclick() {
        debugger
        flag = true;
        $('#btnsave').removeClass('display_none');
        $('#btnback').removeClass('display_none');
        $('#btnedite').addClass('display_none');
        $('#btnadd').addClass('display_none');

        $("#masterdiv").attr("disabled", "disabled").off('click');
        $("#masterdiv").addClass("disabledDiv");
        VALIDATEDIS();
    }
    //---------------------------------------------------------------------------Back button
    function btnback_onclick() {

        $('#StoreDetail').addClass('display_none');
        $('#btnsave').addClass('display_none');
        $('#btnback').addClass('display_none');
        $('#btnedite').removeClass('display_none');
        $('#btnShow').removeClass('display_none');
        $('#btnadd').removeClass('display_none');
        $("#masterdiv").removeAttr("disabled");
        $("#masterdiv").removeClass("disabledDiv");
        Displaystore();
        MasterGridDoubleClick();
        REMOVEVALIDATEDIS();
        flag == true ? $('#StoreDetail').removeClass('display_none') : $('#StoreDetail').addClass('display_none');
    }
    //---------------------------------------------------------------------------Add button
    function btnadd_onclick() {
        flag = false;
        $('#btnShow').addClass('display_none');
        $('#btnsave').removeClass('display_none');
        $('#btnback').removeClass('display_none');
        $("#masterdiv").attr("disabled", "disabled").off('click');
        $("#masterdiv").addClass("disabledDiv");
        $('#btnedite').addClass('display_none');
        $('#StoreDetail').removeClass('display_none');
        checkactive.checked = false;
        Cleartxt();
        VALIDATEDIS();
    }
    //---------------------------------------------------------------------------Save button
    function btnsave_onClick() {



        if (!validations())
            return


        Modelstore = new G_STORE();
        DocumentActions.AssignToModel(Modelstore);
        Modelstore.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        Modelstore.UserCode = SysSession.CurrentEnvironment.UserCode;
        Modelstore.COMP_CODE = Number(SysSession.CurrentEnvironment.CompCode);
        Modelstore.BranchId = Number(SysSession.CurrentEnvironment.BranchCode);
        Modelstore.BRA_CODE = $('#drpuserType_new').val();
        Modelstore.IsActive = checkactive.checked;
        Modelstore.StockAccCode = $('#drpinventoryAccount').val();
        Modelstore.Fax = "1";
        Modelstore.STORE_TYPE = 1;
        Modelstore.TYPE_CODE = 1;
        Modelstore.CommissionPRC = Number($('#txtCommission').val());    
        if (flag == true) {
            Modelstore.StoreId = Number(ReportGrid.SelectedKey);
            Modelstore.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
            Modelstore.UpdatedAt = DateTimeFormat(Date().toString());
            Modelstore.CreatedBy = $('#txtCreatedBy').val();
            Modelstore.CreatedAt = $('#txtCreatedAt').val();
            Update();
        }
        else {
            Modelstore.StoreId = 0;
            Modelstore.CreatedBy = SysSession.CurrentEnvironment.UserCode;
            Modelstore.CreatedAt = DateTimeFormat(Date().toString());
            Insert();
        }




    }
    //---------------------------------------------------------------------------Update and Insert
    function Update() {
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("StkDefStore", "Update"),
            data: JSON.stringify(Modelstore),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    DisplayMassage("تم الحفظ بنجاح", "Success", MessageType.Succeed);
                    btnback_onclick();
                    Displaystore();

                    MasterGridDoubleClick();

                }
                else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                }
            }
        });




    }
    function Insert() {
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("StkDefStore", "Insert"),
            data: JSON.stringify(Modelstore),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    var storeID = result.Response as GQ_GetStore;

                    DisplayMassage("تم الحفظ بنجاح", "Success", MessageType.Succeed);

                    btnback_onclick();
                    Displaystore();

                    $('#btnedite').removeClass('display_none');
                    Selected_Data = new Array<GQ_GetStore>();
                    Selected_Data = detailstore.filter(x => x.StoreId == Number(storeID));
                    $('#StoreDetail').removeClass('display_none');

                    DisplayData(Selected_Data);
                }
                else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                }
            }
        });


    }
    //---------------------------------------------------------------------------Validations and movement 
    function Cleartxt() {
        $('#txtPurTrNo').val('');
        $('#drpuserType_new').val('Null');
        $('#txtName_Arabic').val('');
        $('#txtName_English').val('');
        $('#drpinventoryAccount').val('null');
        $('#txtphone').val('');
        $('#txtphone2').val('');
        $('#txtaddress').val('');
        $('#txtNotes').val('');
        $('#txtCommission').val('');
        $('#txtCreatedBy').val('');
        $('#txtCreatedAt').val('');
        $('#txtUpdatedBy').val('');
        $('#txtUpdatedAt').val('');
    }
    function REMOVEVALIDATEDIS() {
        $('#txtPurTrNo').attr('disabled', 'disabled');
        $('#txtPurTrNo').attr('disabled', 'disabled');
        $('#drpuserType_new').attr('disabled', 'disabled');
        $('#txtName_Arabic').attr('disabled', 'disabled');
        $('#txtName_English').attr('disabled', 'disabled');
        $('#drpinventoryAccount').attr('disabled', 'disabled');
        $('#txtphone').attr('disabled', 'disabled');
        $('#txtphone2').attr('disabled', 'disabled');
        $('#txtaddress').attr('disabled', 'disabled');
        $('#txtNotes').attr('disabled', 'disabled');
        $('#txtCommission').attr('disabled', 'disabled');
        $('#checkactive').attr('disabled', 'disabled');
    }
    function VALIDATEDIS() {
        $('#txtPurTrNo').removeAttr('disabled');
        $('#txtPurTrNo').removeAttr('disabled');
        $('#drpuserType_new').removeAttr('disabled');
        $('#txtName_Arabic').removeAttr('disabled');
        $('#txtName_English').removeAttr('disabled');
        $('#drpinventoryAccount').removeAttr('disabled');
        $('#txtphone').removeAttr('disabled');
        $('#txtphone2').removeAttr('disabled');
        $('#txtaddress').removeAttr('disabled');
        $('#txtNotes').removeAttr('disabled');
        $('#txtCommission').removeAttr('disabled');
        $('#checkactive').removeAttr('disabled');
    }
    function validations() {

        if ($('#txtPurTrNo').val() == null || $('#txtPurTrNo').val() == "") {
            WorningMessage("يجب ادخال رقم المستودع!", "The warehouse number must be entered!", "تحذير", "worning");
            Errorinput($('#txtPurTrNo'));
            return false;

        }
        var qty = Number($('#txtName_Arabic').val());

        if ($('#txtName_Arabic').val() == null || $('#txtName_Arabic').val().trim() == "" || qty >= 0) {
            WorningMessage("يجب ادخال الاسم بالعربي!", "The Arabic Name must be entered!", "تحذير", "worning");
            Errorinput($('#txtName_Arabic'));
            return false;

        }
        var qty1 = Number($('#txtName_English').val());
        if ($('#txtName_English').val() == null || $('#txtName_English').val().trim() == "" || qty1 >= 0) {
            WorningMessage("يجب ادخال الاسم بالانجليزية!", "The English Name must be entered!", "تحذير", "worning");
            Errorinput($('#txtName_English'));
            return false;

        }

        if ($('#drpinventoryAccount').val() == "null") {
            WorningMessage("يجب اختيار  حساب المخزون  !", "The Inventory Account must be selected!", "تحذير", "worning");
            Errorinput($('#drpinventoryAccount'));
            return false;

        }
        if ($('#drpuserType_new').val() == "Null") {
            WorningMessage("يجب اختيار اسم الفرع!", "The Branch Name must be selected!", "تحذير", "worning");
            Errorinput($('#drpuserType_new'));
            return false;

        }
        if ($('#txtphone').val().trim() == "") {
            WorningMessage("يجب ادخال الهاتف  !", "The Phone must be selected!", "تحذير", "worning");
            Errorinput($('#txtphone'));
            return false;

        }
        if ($('#txtphone2').val().trim() == "") {
            WorningMessage("يجب ادخال الهاتف2  !", "The Phone2 must be selected!", "تحذير", "worning");
            Errorinput($('#txtphone2'));
            return false;

        }
        var qty2 = Number($('#txtaddress').val());
        if ($('#txtaddress').val().trim() == "" || qty2 >= 0) {
            WorningMessage("يجب ادخال العنوان  !", "The Address must be selected!", "تحذير", "worning");
            Errorinput($('#txtaddress'));
            return false;
        }


        return true
    }
}












