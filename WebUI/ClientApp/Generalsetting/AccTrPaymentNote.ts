$(document).ready(() => {
    AccTrPaymentNote.InitalizeComponent();
})

namespace AccTrPaymentNote {

    var IQ_TrType = 2;
    var AccType = 2;
    //var TrType = 1;
    var codeType = "PayType";
    var ReportGrid: JsGrid = new JsGrid();

    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession();
    var UserDetails: Array<G_USERS> = new Array<G_USERS>();
    var ListPayType: Array<G_Codes> = new Array<G_Codes>();
    var Get_IQ_IQ_Catch_Receipt: Array<IQ_Outlet> = new Array<IQ_Outlet>();
    var SearchDetails: Array<IQ_Outlet> = new Array<IQ_Outlet>();
    var Selected_Data: Array<IQ_Outlet> = new Array<IQ_Outlet>();
    var DetailsSupplier: Array<Supplier> = new Array<Supplier>();
    var DetailsCUSTOMER: Array<CUSTOMER> = new Array<CUSTOMER>();
    var DetailsSalesman: Array<I_Sls_D_Salesman> = new Array<I_Sls_D_Salesman>();
    var Model: Outlet = new Outlet();

    var txtDateFrom: HTMLInputElement;
    var txtDateTo: HTMLInputElement;
    var ddlUserMaster: HTMLSelectElement;
    var txt_PayType: HTMLSelectElement;
    var txt_PayTypeNew: HTMLSelectElement;
    var txtCashTypeNew: HTMLSelectElement;
    var txt_BankAcc_Code: HTMLSelectElement;
    var txt_CODE: HTMLInputElement;
    var txt_note: HTMLInputElement;
    var searchbutmemreport: HTMLInputElement;

    var btnBen: HTMLButtonElement;
    var btnback: HTMLButtonElement;
    var btnShow: HTMLButtonElement;
    var btnAdd: HTMLButtonElement;
    var btnEdit: HTMLButtonElement;
    var btnsave: HTMLButtonElement;

    var compcode: number;//SharedSession.CurrentEnvironment.CompCode;
    var BranchCode: number;//SharedSession.CurrentEnvironment.BranchCode;



    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var ID_Receipt = 0;
    var NewAdd = false;
    var CUSTOMER_ID = null;
    var ID_Supplier = null;
    var SalesmanId = null;
    var ID_Code = null;

    export function InitalizeComponent() {

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "إذن صرف";

        } else {
            document.getElementById('Screen_name').innerHTML = "Payment Permission";

        }

        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        InitalizeEvents();
        txtDateFrom.value = SysSession.CurrentEnvironment.StartDate;
        txtDateTo.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        FillddlUserMaster();
        FillddlPayType();
    }
    function InitalizeControls() {
        btnShow = document.getElementById("btnShow") as HTMLButtonElement;
        btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
        btnEdit = document.getElementById("btnedite") as HTMLButtonElement;
        btnsave = document.getElementById("btnsave") as HTMLButtonElement;
        btnback = document.getElementById("btnback") as HTMLButtonElement;
        btnBen = document.getElementById("btnBen") as HTMLButtonElement;


        txt_CODE = document.getElementById("txt_CODE") as HTMLInputElement;
        txtDateFrom = document.getElementById("txtDateFrom") as HTMLInputElement;
        txtDateTo = document.getElementById("txtDateTo") as HTMLInputElement;
        txt_note = document.getElementById("txt_note") as HTMLInputElement;
        searchbutmemreport = document.getElementById("searchbutmemreport") as HTMLInputElement;
        ddlUserMaster = document.getElementById("ddlUserMaster") as HTMLSelectElement;
        txt_PayType = document.getElementById("txt_PayType") as HTMLSelectElement;
        txt_PayTypeNew = document.getElementById("txt_PayTypeNew") as HTMLSelectElement;
    }
    function InitalizeEvents() {

        btnShow.onclick = btnShow_onclick;
        btnAdd.onclick = btnAdd_onclick;
        btnsave.onclick = btnsave_onClick;
        btnback.onclick = btnback_onclick;
        btnBen.onclick = SearchAll;
        btnEdit.onclick = btnEdit_onclick;
        searchbutmemreport.onkeyup = _SearchBox_Change;
        txt_PayTypeNew.onchange = txt_PayTypeNew_onchange;


    }
    function txt_PayTypeNew_onchange() {
        $("#txt_BenCode").val('');
        $('#txt_BenName').val('');

        if (txt_PayTypeNew.value == '5') {
            $("#txt_ReceiptDesc").removeAttr("disabled");
        }
        else {
            $('#txt_ReceiptDesc').attr('disabled','disabled'); 
        }
    }

    function FillddlUserMaster() {
        debugger
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("G_USERS", "GetAllUser"),
            data: {},
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    UserDetails = result.Response as Array<G_USERS>;
                    debugger

                    DocumentActions.FillCombowithdefult(UserDetails, ddlUserMaster, "USER_CODE", "USER_CODE", "اختار البائع");


                }
            }
        });
    }
    function FillddlPayType() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GCodes", "GetbycodeTp"),
            data: { CodeType: "PayType", UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    ListPayType = result.Response as Array<G_Codes>;

                    DocumentActions.FillComboFirstvalue(ListPayType, txt_PayType, "CodeValue", "" + (lang == "ar" ? "DescA" : "DescE") + "", "" + (lang == "ar" ? " - اختر -" : " - Choose -") + "", null);
                    DocumentActions.FillComboFirstvalue(ListPayType, txt_PayTypeNew, "CodeValue", "" + (lang == "ar" ? "DescA" : "DescE") + "", "" + (lang == "ar" ? " - اختر -" : " - Choose -") + "", null);
                }
            }
        });
    }


    function btnShow_onclick() {

        $('#divMasterGridiv').removeClass('display_none');


        Display();


    }
    function btnEdit_onclick() {
        Remove();
        $("#DivHederMaster").addClass("disabledDiv");

    } 
    function btnAdd_onclick() {

        NewAdd = true;
        Remove();
        $("#Div_control").removeClass("display_none");
        $("#Div_control :input").val("");
        txt_PayTypeNew.value = "null";
        $("#DivHederMaster").addClass("disabledDiv");
        txt_PayTypeNew.focus();

    }
    function btnsave_onClick() {

        if (!ValidationHeader()) return;

        if (NewAdd == true) {
            Insert();
        }
        else {
            Update();
        }
    }
    function btnback_onclick() {


        $("#DivHederMaster").removeClass("disabledDiv");
        if (NewAdd == true) {
            $("#Div_control").addClass("display_none");

        }
        else {
            MasterGridDoubleClick();
        }

    }



    function Display() {
        debugger
        var startdt = DateFormatDataBes(txtDateFrom.value).toString();
        var enddt = DateFormatDataBes(txtDateTo.value).toString();
        let ID_Peneficiary = txt_PayType.value == 'null' ? 0 : Number(txt_PayType.value);
        let USER_CODE = ddlUserMaster.value == 'null' ? "" : ddlUserMaster.value;

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Outletpirce", "GetAllPay"),
            data: { CompCode: compcode, BranchCode: BranchCode, startDate: startdt, endDate: enddt, ID_Peneficiary: ID_Peneficiary, USER_CODE: USER_CODE },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Get_IQ_IQ_Catch_Receipt = result.Response as Array<IQ_Outlet>;

                    for (var i = 0; i < Get_IQ_IQ_Catch_Receipt.length; i++) {
                        Get_IQ_IQ_Catch_Receipt[i].Date = DateFormat(Get_IQ_IQ_Catch_Receipt[i].Date);
                        if (Get_IQ_IQ_Catch_Receipt[i].ID_Peneficiary != null && Get_IQ_IQ_Catch_Receipt[i].ID_Peneficiary != 0) {
                            let PayType = ListPayType.filter(x => x.CodeValue == Get_IQ_IQ_Catch_Receipt[i].ID_Peneficiary)
                            Get_IQ_IQ_Catch_Receipt[i].PayTypeDescA = PayType[0].DescA;
                        }

                    }

                    InitializeGrid();
                    ReportGrid.DataSource = Get_IQ_IQ_Catch_Receipt;
                    ReportGrid.Bind();
                }
            }
        });
    }
    function _SearchBox_Change() {
        if (searchbutmemreport.value != "") {

            let search: string = searchbutmemreport.value.toLowerCase();
            SearchDetails = Get_IQ_IQ_Catch_Receipt.filter(x => x.Dasc_Name.toString().search(search) >= 0 || x.id.toString().search(search) >= 0);

            ReportGrid.DataSource = SearchDetails;
            ReportGrid.Bind();
        } else {
            ReportGrid.DataSource = Get_IQ_IQ_Catch_Receipt;
            ReportGrid.Bind();
        }
    }
    function InitializeGrid() {
        //let res: any = GetResourceList("");
        ReportGrid.ElementName = "ReportGrid";
        ReportGrid.Paging = true;
        ReportGrid.PageSize = 10;
        ReportGrid.Sorting = true;
        ReportGrid.InsertionMode = JsGridInsertionMode.Binding;
        ReportGrid.Editing = false;
        ReportGrid.Inserting = false;
        ReportGrid.SelectedIndex = 1;
        ReportGrid.OnRowDoubleClicked = MasterGridDoubleClick;
        ReportGrid.PrimaryKey = "id";
        ReportGrid.Columns = [
            { title: "id", name: "id", type: "text", width: "2%", visible: false },
            { title: "رقم الصرف", name: "id", type: "text", width: "18%" },
            { title: " نوع الصرف", name: "PayTypeDescA", type: "text", width: "35%" },
            { title: " الوصف", name: "Dasc_Name", type: "text", width: "35%" },
            { title: "التاريخ", name: "Date", type: "text", width: "20%" },
            { title: "المستخدم", name: "USER_CODE", type: "text", width: "25%" },

        ];

    }
    function MasterGridDoubleClick() {
        Selected_Data = new Array<IQ_Outlet>();

        Selected_Data = Get_IQ_IQ_Catch_Receipt.filter(x => x.id == Number(ReportGrid.SelectedKey));

        DisplayData(Selected_Data);


    }
    function DisplayData(Selected_Data: Array<IQ_Outlet>) {

        NewAdd = false;
        $("#DivHederMaster").removeClass("disabledDiv"); 
        $("#Div_control :input").attr("disabled", "disabled");
        $("#Div_control").removeClass("display_none");
        $("#btnedite").removeClass("display_none");
        $("#btnsave").removeAttr("disabled");
        $("#btnback").removeAttr("disabled");
        $("#btnedite").removeAttr("disabled");
        $("#btnback").addClass("display_none");
        $("#btnsave").addClass("display_none");

        DocumentActions.RenderFromModel(Selected_Data[0]);
        ID_Receipt = Selected_Data[0].id;


        if (Selected_Data[0].ID_Peneficiary == 1) {
            GetCUSTOMER(Selected_Data[0].CUSTOMER_ID);
        }
        else if (Selected_Data[0].ID_Peneficiary == 2) {
            GetSupplier(Selected_Data[0].ID_Supplier);
        }
        else if (Selected_Data[0].ID_Peneficiary == 3) {
            GetSalesman(Selected_Data[0].SalesmanId);
        }
        else if (Selected_Data[0].ID_Peneficiary == 4) {
            GetUser(Selected_Data[0].ID_Code);
        }
        else {
            $("#txt_BenCode").val('');
            $('#txt_BenName').val('');
        }

    }

    function SearchAll() {

        if (txt_PayTypeNew.value == '1') {
            SearchCUSTOMER();
        }
        else if (txt_PayTypeNew.value == '2') {
            SearchSupplier();
        }
        else if (txt_PayTypeNew.value == '3') {
            SearchSalesman();
        }
        else if (txt_PayTypeNew.value == '4') {
            SearchUser();
        }
        else {
            DisplayMassage("يجب اختيار نوع الصرف", "You must enter a valid email", MessageType.Worning);
            Errorinput($('#txt_PayTypeNew'));
        }

    }

    function SearchCUSTOMER() {
        let sys: SystemTools = new SystemTools();
        sys.FindKey(Modules.Catch_Receipt, "btnCustomerSearch", " Debit > 0 and CompCode =" + compcode + "", () => {
            let CUST_ID = SearchGrid.SearchDataGrid.SelectedKey;
            CUSTOMER_ID = CUST_ID; 
              ID_Supplier = null;
              SalesmanId = null;
            ID_Code = null;

            GetCUSTOMER(CUSTOMER_ID);
              

        });
    }
    function SearchSupplier() {

        let sys: SystemTools = new SystemTools();
        sys.FindKey(Modules.Purchases, "btnSupplierSearch", " CompCode =" + compcode + "", () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey;
            ID_Supplier = id;
            CUSTOMER_ID = null;
            SalesmanId = null;
            ID_Code = null;
            GetSupplier(ID_Supplier);
        
        });

    }
    function SearchSalesman() {

        let sys: SystemTools = new SystemTools();
        sys.FindKey(Modules.PaymentNote, "btnSalesmanSearch", " CompCode =" + compcode + "", () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey;
            SalesmanId = id;
            CUSTOMER_ID = null;
            ID_Supplier = null;
            ID_Code = null;
            GetSalesman(id);

        });

    }
    function SearchUser() {

        let sys: SystemTools = new SystemTools();
        sys.FindKey(Modules.PaymentNote, "btnSearchUser", " CompCode =" + compcode + "", () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey;
            ID_Code = id; 
            CUSTOMER_ID = null;
            ID_Supplier = null;
            SalesmanId = null;
            GetUser(ID_Code);
       

        });

    }

    function GetCUSTOMER(id: number) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Customer", "GetAllbyid"),
            data: { id: id },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    DetailsCUSTOMER = result.Response as Array<CUSTOMER>;
                    if (DetailsCUSTOMER.length > 0) {

                        $("#txt_BenCode").val(DetailsCUSTOMER[0].CUSTOMER_ID);
                        $('#txt_BenName').val(DetailsCUSTOMER[0].CUSTOMER_NAME);

                    }
                    else {
                        $("#txt_BenCode").val('');
                        $('#txt_BenName').val('');
                    }
                }
            }
        });
    }
    function GetSupplier(id: number) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Supplier", "GetAll_Item_by_Cat"),
            data: { ID_Supplier: id },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    DetailsSupplier = result.Response as Array<Supplier>;
                    if (DetailsSupplier.length > 0) {

                        $("#txt_BenCode").val(DetailsSupplier[0].ID_Supplier);
                        $('#txt_BenName').val(DetailsSupplier[0].Name_Supplier);

                    }
                    else {
                        $("#txt_BenCode").val('');
                        $('#txt_BenName').val('');
                    }
                }
            }
        });
    }
    function GetSalesman(id: number) {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefSalesMen", "GetById"),
            data: { id: id },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    DetailsSalesman[0] = result.Response as I_Sls_D_Salesman;
                    if (DetailsSalesman[0] != null) {

                        $("#txt_BenCode").val(DetailsSalesman[0].SalesmanId);
                        $('#txt_BenName').val(DetailsSalesman[0].NameA);

                    }
                    else {
                        $("#txt_BenCode").val('');
                        $('#txt_BenName').val('');
                    }
                }
            }
        });

    }
    function GetUser(id: number) {

        let uesr = UserDetails.filter(x => x.ID_Code == id);
        if (uesr.length > 0) {
            $("#txt_BenCode").val(uesr[0].ID_Code);
            $('#txt_BenName').val(uesr[0].USER_NAME);
        }
        else {
            $("#txt_BenCode").val('');
            $('#txt_BenName').val('');
        }
      
    }

    function Assign() {


        Model = new Outlet();

        DocumentActions.AssignToModel(Model);

        Model.BranchCode = BranchCode;
        Model.CompCode = compcode;
        Model.ID_Supplier = ID_Supplier;
        Model.SalesmanId = SalesmanId;
        Model.CUSTOMER_ID = CUSTOMER_ID;
        Model.ID_Code = ID_Code; 
         
        Model.pirce = Number($('#txt_Amount').val());
        Model.Remark = $('#txt_note').val();
        Model.UserCode = SysSession.CurrentEnvironment.UserCode;


    }
    function Insert() {
        Assign();


        Model.CreatedAt = DateTimeFormat(Date().toString());
        Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;

        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("Outletpirce", "Insert"),
            data: JSON.stringify(Model),
            success: (d) => {
                debugger
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    ID_Receipt = result.Response;

                    success()
                }
                else {

                    MessageBox.Show(result.ErrorMessage, "خطأ");
                }
            }
        });
    } 
    function Update() {
        Assign();


        Model.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        Model.UpdatedAt = DateTimeFormat(Date().toString());

        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("Outletpirce", "Update"),
            data: JSON.stringify(Model),
            success: (d) => {
                debugger
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    ID_Receipt = result.Response;

                    success()
                }
                else {

                    MessageBox.Show(result.ErrorMessage, "خطأ");
                }
            }
        });
    }


    function ValidationHeader() {

      
        if (txt_PayTypeNew.value == "null") {
            DisplayMassage(" برجاء اختيار نوع الصرف", "Please select a Salesman", MessageType.Error);

            Errorinput(txt_PayTypeNew);
            return false
        }
        if ($("#txt_BenCode").val().trim() == "" && txt_PayTypeNew.value != '5') {
            DisplayMassage(" برجاء اختيار المستفيد", "Please select a Date", MessageType.Error);
            Errorinput($("#txt_BenCode"));
            return false
        }
        if (txt_PayTypeNew.value == '5' && $("#txt_ReceiptDesc").val().trim() == '') {
            DisplayMassage(" برجاء ادخال وصف الصرف", "Please select a Date", MessageType.Error);
            Errorinput($("#txt_ReceiptDesc"));
            return false
        }
        if (Number($("#txt_Amount").val()) <= 0  ) {
            DisplayMassage(" برجاء ادخال المبلغ", "Please select a Date", MessageType.Error);
            Errorinput($("#txt_Amount"));
            return false
        }
      
       
        
        return true;
    }
    function success() {

        Display();

        Selected_Data = new Array<IQ_Outlet>();

        Selected_Data = Get_IQ_IQ_Catch_Receipt.filter(x => x.id == Number(ID_Receipt));

        DisplayData(Selected_Data);
    }
    function Remove() {
        $("#btnBen").removeAttr("disabled");
        $("#txt_PayTypeNew").removeAttr("disabled");
        //$("#txt_ReceiptDesc").removeAttr("disabled");
        $("#txt_note").removeAttr("disabled");
        $("#txt_Amount").removeAttr("disabled");
        $("#btnback").removeClass("display_none");
        $("#btnsave").removeClass("display_none");
        $("#btnedite").addClass("display_none");

    }

}