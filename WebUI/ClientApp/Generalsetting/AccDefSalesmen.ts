$(document).ready(() => {

    AccDefSalesmen.InitalizeComponent();
})

namespace AccDefSalesmen { 
    var ReportGrid: JsGrid = new JsGrid();        
    var Details: Array<IQ_GetSalesMan> = new Array<IQ_GetSalesMan>(); 
    var BilldIData: Array<IQ_GetSalesMan> = new Array<IQ_GetSalesMan>();
    var NationalityDetails: Array<G_Nationality> = new Array<G_Nationality>();
    var G_COST_CENTERDetails: Array<G_COST_CENTER> = new Array<G_COST_CENTER >();
    var Model: I_Sls_D_Salesman = new I_Sls_D_Salesman; 
    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession();
     
    var ddlNationality: HTMLSelectElement;
    var txt_CC_Code: HTMLSelectElement;
     
    var btnback: HTMLButtonElement;
    var btnShow: HTMLButtonElement;
    var btnAdd: HTMLButtonElement;
    var btnEdit: HTMLButtonElement;
    var btnsave: HTMLButtonElement;

    var txt_CustomerCODE: HTMLInputElement;
    var txt_NAME: HTMLInputElement;
    var txt_NAMEE: HTMLInputElement;
    var txt_ADDRESS: HTMLInputElement;
    var txt_MOBILE: HTMLInputElement;
    var txt_IDNo: HTMLInputElement;
    var txt_note: HTMLInputElement; 
    var searchbutmemreport: HTMLInputElement;

    //chkboxes
    var chkActive: HTMLInputElement; 
    var IsSalesEnable: HTMLInputElement;
    var IsPurchaseEnable: HTMLInputElement;
    var ISOperationEnable: HTMLInputElement; 
    var Details_IsSalesEnable: HTMLInputElement;
    var Details_IsPurchaseEnable: HTMLInputElement;
    var Details_ISOperationEnable: HTMLInputElement; 
    var chk_IsPurchaseEnable: HTMLInputElement;
    var chk_IsSalesEnable: HTMLInputElement;
    var chk_ISOperationEnable: HTMLInputElement; 
    var chk_PurchaseLimit: HTMLInputElement;
    var chk_SalesCreditLimit: HTMLInputElement;

    var compcode: Number;//SharedSession.CurrentEnvironment.CompCode;
    var BranchCode: number;//SharedSession.CurrentEnvironment.BranchCode;
    var IsNew;
    var index;
    var Selecteditem
    var SalesmanIdUpdate: number = 0; 
    var SalesmanId; 
    var Debit;
    var Credit;
    var Valid = 0; 
    var SearchDetails; 
    var Update_claenData = 0;


    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
  
    export function InitalizeComponent() {
         

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "المناديب";

        } else {
            document.getElementById('Screen_name').innerHTML = "Salesmen";

        }

        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);

        InitalizeControls();
        InitalizeEvents(); 
        reference_Page(); 
        FillddlNationality(); 
        FillddlG_COST_CENTER();
        IsSalesEnable.checked = true;
        IsPurchaseEnable.checked = true;
        ISOperationEnable.checked = true; 
    } 
    function InitalizeControls() {
        //debugger;

        btnShow = document.getElementById("btnShow") as HTMLButtonElement;
        btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
        btnEdit = document.getElementById("btnedite") as HTMLButtonElement;
        btnsave = document.getElementById("btnsave") as HTMLButtonElement;
        btnback = document.getElementById("btnback") as HTMLButtonElement;



        //textBoxes
        txt_CustomerCODE = document.getElementById("txt_CustomerCODE") as HTMLInputElement;

        txt_NAME = document.getElementById("txt_NAME") as HTMLInputElement;
        txt_NAMEE = document.getElementById("txt_NAMEE") as HTMLInputElement;

        txt_ADDRESS = document.getElementById("txt_ADDRESS") as HTMLInputElement;
        txt_MOBILE = document.getElementById("txt_MOBILE") as HTMLInputElement;

        txt_IDNo = document.getElementById("txt_IDNo") as HTMLInputElement;

        txt_note = document.getElementById("txt_note") as HTMLInputElement;
        //txt_tax = document.getElementById("txt_tax") as HTMLSelectElement;
        ddlNationality = document.getElementById("ddlNationality") as HTMLSelectElement;
        txt_CC_Code = document.getElementById("txt_CC_Code") as HTMLSelectElement;



        chk_IsPurchaseEnable = document.getElementById("chk_IsPurchaseEnable") as HTMLInputElement;
        chk_IsSalesEnable = document.getElementById("chk_IsSalesEnable") as HTMLInputElement;
        chk_ISOperationEnable = document.getElementById("chk_ISOperationEnable") as HTMLInputElement;
        chk_PurchaseLimit = document.getElementById("chk_PurchaseLimit") as HTMLInputElement;
        chk_SalesCreditLimit = document.getElementById("chk_SalesCreditLimit") as HTMLInputElement;

        chkActive = document.getElementById("id_chkcustom6") as HTMLInputElement;
        //IsSalesEnable_All = document.getElementById("IsSalesEnable_All") as HTMLInputElement;
        IsSalesEnable = document.getElementById("IsSalesEnable") as HTMLInputElement;
        IsPurchaseEnable = document.getElementById("IsPurchaseEnable") as HTMLInputElement;
        ISOperationEnable = document.getElementById("ISOperationEnable") as HTMLInputElement;


                                         

        searchbutmemreport = document.getElementById("searchbutmemreport") as HTMLInputElement;
    } 
    function reference_Page() {
        if (!SysSession.CurrentPrivileges.EDIT) {

            $('#btnedite').attr('class', 'btn btn-primary display_none');
            $('#btnsave').attr('class', 'btn btn-success display_none');
            $('#btnback').attr('class', 'btn btn-success display_none');

        }
        if (!SysSession.CurrentPrivileges.AddNew) {

            $('#btnAdd').attr('class', 'btn btn-primary display_none');

        }
    } 
    function InitalizeEvents() {

  
        btnShow.onclick = btnShow_onclick;
        btnAdd.onclick = btnAdd_onclick;
        btnsave.onclick = btnsave_onClick;
        btnback.onclick = btnback_onclick;
        btnEdit.onclick = btnEdit_onclick;
        searchbutmemreport.onkeyup = _SearchBox_Change;
 
    } 
    function btnEdit_onclick() {
        IsNew = false;
        removedisabled();
        if (SysSession.CurrentPrivileges.EDIT) {
            $('#btnsave').toggleClass("display_none");
            $('#btnback').toggleClass("display_none");
            $("#div_ContentData :input").removeAttr("disabled");
            $("#btnedite").toggleClass("display_none");
            $("#txt_CustomerCODE").attr("disabled", "disabled");
            $("#txt_Debit").attr("disabled", "disabled");
            $("#txt_DebitFC").attr("disabled", "disabled");
            $("#txt_balance").attr("disabled", "disabled");

            $("#id_div_Add").attr("disabled", "disabled").off('click');
            var x1 = $("#id_div_Add").hasClass("disabledDiv");

            (x1 == true) ? $("#id_div_Add").removeClass("disabledDiv") : $("#id_div_Add").addClass("disabledDiv");

        }
        else {
            $('#btnsave').toggleClass("display_none");
            $('#btnback').toggleClass("display_none");

            $("#btnedite").toggleClass("display_none");

        }
        if (SysSession.CurrentPrivileges.AddNew) {
            $(".btnAddDetails").removeAttr("disabled");
            $('#btnAddDetails').toggleClass("display_none");
        }
        else {
            $(".btnAddDetails").attr("disabled", "disabled");

        }
        if (SysSession.CurrentPrivileges.Remove) {
    
            $(".fa-minus-circle").removeClass("display_none");

        }
        else {

            $(".fa-minus-circle").addClass("display_none");

        }



    }  
    function btnAdd_onclick() {
        IsNew = true;
        EnableControls();
        removedisabled();
         
        $("#id_div_Add").attr("disabled", "disabled").off('click');
        var x1 = $("#id_div_Add").hasClass("disabledDiv");

        (x1 == true) ? $("#id_div_Add").removeClass("disabledDiv") : $("#id_div_Add").addClass("disabledDiv");

        reference_Page();

        chkActive.checked = true;


    } 
    function btnsave_onClick() {
        

        if (!Validation())
            return;


        if (IsNew == true) { 
           
                Insert();
                Update_claenData = 0;
                btnback_onclick();
                Display(); 
          
            
        }
        else {
            
         
                Update();
                Update_claenData = 1;
                btnback_onclick();
                Display();        
           
             
        }



    } 
    function txt_disabled() {


        $("#txt_CustomerCODE").attr("disabled", "disabled");
        $("#txt_Cust_Type").attr("disabled", "disabled");
        $("#id_chkcustom6").attr("disabled", "disabled");
        $("#txt_NAME").attr("disabled", "disabled");
        $("#txt_NAMEE").attr("disabled", "disabled");
        $("#txt_Category").attr("disabled", "disabled");
        $("#txt_Grop").attr("disabled", "disabled");
        $("#txt_ADDRESS").attr("disabled", "disabled");
        $("#txt_MOBILE").attr("disabled", "disabled");
        $("#txt_TEL").attr("disabled", "disabled");
        $("#txt_IDNo").attr("disabled", "disabled");
        $("#txt_WorkTel").attr("disabled", "disabled");
        $("#txt_note").attr("disabled", "disabled"); 
        $("#txt_VatNo").attr("disabled", "disabled");
        $("#txt_Debit").attr("disabled", "disabled");
        $("#txt_DebitFC").attr("disabled", "disabled");
        $("#txt_balance").attr("disabled", "disabled");
        $("#txt_Openbalance").attr("disabled", "disabled");
        $("#txt_CreditLimit").attr("disabled", "disabled");
        $("#txtResName").attr("disabled", "disabled");
        $("#txtResMobile").attr("disabled", "disabled");
        $("#ddlNationality").attr("disabled", "disabled");
        $("#txt_CC_Code").attr("disabled", "disabled");

        chkActive.disabled = true;
        chk_IsPurchaseEnable.disabled = true;
        chk_IsSalesEnable.disabled = true;
        chk_ISOperationEnable.disabled = true;
        chk_SalesCreditLimit.disabled = true;
        chk_PurchaseLimit.disabled = true;

    } 
    function removedisabled() {


        $("#txt_CustomerCODE").removeAttr("disabled");
        $("#txt_Cust_Type").removeAttr("disabled");
        $("#id_chkcustom6").removeAttr("disabled");
        $("#txt_NAME").removeAttr("disabled");
        $("#txt_NAMEE").removeAttr("disabled");
        $("#txt_Category").removeAttr("disabled");
        $("#txt_Grop").removeAttr("disabled");
        $("#txt_ADDRESS").removeAttr("disabled");
        $("#txt_MOBILE").removeAttr("disabled");
        $("#txt_TEL").removeAttr("disabled");
        $("#txt_IDNo").removeAttr("disabled");
        $("#txt_WorkTel").removeAttr("disabled");
        $("#txt_note").removeAttr("disabled"); 
        $("#txt_VatNo").removeAttr("disabled");
        $("#txt_Debit").removeAttr("disabled");
        $("#txt_DebitFC").removeAttr("disabled");
        $("#txt_balance").removeAttr("disabled");
        $("#txt_Openbalance").removeAttr("disabled");
        $("#txt_CreditLimit").removeAttr("disabled");
        $("#txtResName").removeAttr("disabled");
        $("#txtResMobile").removeAttr("disabled");
        $("#ddlNationality").removeAttr("disabled");
        $("#txt_CC_Code").removeAttr("disabled");


        chkActive.disabled = false;
        chk_IsPurchaseEnable.disabled = false;
        chk_IsSalesEnable.disabled = false;
        chk_ISOperationEnable.disabled = false;
        chk_SalesCreditLimit.disabled = false;
        chk_PurchaseLimit.disabled = false;

    } 
    function Validation() {
   
        if (txt_CustomerCODE.value.trim() == '') {
            DisplayMassage("يجب ادخال رقم المندوب", "The delegate number must be entered", MessageType.Worning);
            Errorinput(txt_CustomerCODE);
            return false;

        }       
        if (IsNew == true && txt_CustomerCODE.value != '') {  
            if (CustomerFoundBefore() == false  ) {
                DisplayMassage("رقم المندوب موجود من قبل", "Delegate number already exists", MessageType.Worning);
                Errorinput(txt_CustomerCODE);
                return false;

            }
        }   
        if ($("#chk_IsPurchaseEnable").is(':checked') || $("#chk_IsSalesEnable").is(':checked') || $("#chk_ISOperationEnable").is(':checked')) { }
        else {
            DisplayMassage("يجب اختيار واحد علي الاقل من المصرح له ", "At least one of the tracks must be selected prior to the show", MessageType.Worning);
            
            return false;

        }      
        if (txt_NAME.value == "" && txt_NAMEE.value == "") {
            DisplayMassage("يجب ادخال الاسم بالعربي او بالانجليزي", "The name must be entered in Arabic or English", MessageType.Worning);
            Errorinput(txt_NAME);
            return false;

        }
        if (txt_MOBILE.value.trim()== "") {
            DisplayMassage("يجب ادخال رقم الجوال", "The Mobile Number Must Be Entered", MessageType.Worning);
            Errorinput(txt_MOBILE);
            return false;

        }
        if (txt_ADDRESS.value.trim() == "") {
            DisplayMassage("يجب ادخال العنوان", "Address Must Be Entered", MessageType.Worning);
            Errorinput(txt_ADDRESS);
            return false;

        }
        if (txt_IDNo.value.trim() == "") {
            DisplayMassage("يجب ادخال رقم الهوية", "ID Number Must Be Entered", MessageType.Worning);
            Errorinput(txt_IDNo);
            return false;

        }
      
        //if (ddlNationality.selectedIndex == 0) {
        //    DisplayMassage("يجب اختيار الجنسيه", "Nationality must be selected", MessageType.Worning);
        //    Errorinput(ddlNationality);
        //    return false;

        //}
        //if (txt_CC_Code.selectedIndex == 0) {
        //    DisplayMassage("يجب اختيار مركز التكلفة", "Cost center must be selected", MessageType.Worning);
        //    Errorinput(txt_CC_Code);
        //    return false;
        //}
       

        return true;

    } 
    function CustomerFoundBefore() {
        var res: boolean = true;
        var code = txt_CustomerCODE.value;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefSalesMen", "CodeFounBefore"),
            data: {
                code: code, compCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
        
                let result = d as BaseResponse;
                if (result.Response == 0) {
                    res = true;
                }
                else
                    res = false;
            }
        });
        return res;
    } 
    function btnShow_onclick() {



        Details_IsSalesEnable = document.querySelector("input[name=IsSalesEnable]:checked") as HTMLInputElement;
        Details_IsPurchaseEnable = document.querySelector("input[name=IsPurchaseEnable]:checked") as HTMLInputElement;
        Details_ISOperationEnable = document.querySelector("input[name=ISOperationEnable]:checked") as HTMLInputElement;

        Display();

       
    } 
    function btnback_onclick() {

        Selecteditem = Details.filter(x => x.SalesmanId == Number(ReportGrid.SelectedKey));
        if (Selecteditem.length == 0) {
            IsNew = true;
        }
        if (IsNew == true) {
            $('#btnAddDetails').toggleClass("display_none");
            $('#btnsave').toggleClass("display_none");
            $('#btnback').toggleClass("display_none");
            //$("#div_ContentData :input").attr("disabled", "true");
            $(".fa-minus-circle").addClass("display_none");
            $("#btnedite").removeClass("display_none");
            $("#btnedite").removeAttr("disabled");
            //$("#drpPaymentType").removeAttr("disabled");
            $("#drp_G_Store").removeAttr("disabled");
            txt_disabled();
            $("#Div_control").attr("style", "height: 281px;margin-bottom: 19px;margin-top: 20px;display: none;");
            $("#id_div_Add").attr("disabled", "");
            $("#id_div_Add").removeClass("disabledDiv");
        }
        else {
            $('#btnAddDetails').toggleClass("display_none");
            $('#btnsave').toggleClass("display_none");
            $('#btnback').toggleClass("display_none");
            //$("#div_ContentData :input").attr("disabled", "true");
            $(".fa-minus-circle").addClass("display_none");
            $("#btnedite").removeClass("display_none");
            $("#btnedite").removeAttr("disabled");
            //$("#drpPaymentType").removeAttr("disabled");
            $("#drp_G_Store").removeAttr("disabled");
            txt_disabled();

            if (Update_claenData != 1) {
        
                back_Details();
            }
            Update_claenData = 0;

            $("#id_div_Add").attr("disabled", "");
            $("#id_div_Add").removeClass("disabledDiv");

        }
    } 
    function back_Details() {
        Selecteditem = Details.filter(x => x.SalesmanId == Number(ReportGrid.SelectedKey));
        for (var item of Selecteditem) {
            //CustomerIdUpdate = item.VendorID;
            if (item.Isactive) { chkActive.checked = true; }
            else chkActive.checked = false;
        }
        DisplayData(Selecteditem);
        reference_Page();
    } 
    function DriverDoubleClick() {


        Selecteditem = Details.filter(x => x.SalesmanId == Number(ReportGrid.SelectedKey));
        for (var item of Selecteditem) {
            //SalesmanIdUpdate = item.SalesmanId ;
            if (item.Isactive) { chkActive.checked = true; }
            else chkActive.checked = false;

        }
        DisplayData(Selecteditem);
        $('#btnedite').removeClass("display_none");
        $('#btnsave').addClass("display_none");
        $('#btnback').addClass("display_none");
        $('#btnedite').removeAttr("disabled");
        chkActive.disabled = true;
        chk_IsPurchaseEnable.disabled = true;
        chk_IsSalesEnable.disabled = true;
        chk_ISOperationEnable.disabled = true;
        chk_SalesCreditLimit.disabled = true;
        chk_PurchaseLimit.disabled = true;
        IsNew = false;


        Update_claenData = 0;
        btnback_onclick();
        $('#btnsave').toggleClass("display_none");
        $('#btnback').toggleClass("display_none");

        reference_Page();

        $("#Div_control").attr("style", "height: 281px;margin-bottom: 19px;margin-top: 20px;");
    } 
    function DisplayData(Selecteditem: Array<IQ_GetSalesMan>) {



        DocumentActions.RenderFromModel(Selecteditem[0]);


        for (var item of Selecteditem) {
            //SalesmanIdUpdate = item.SalesmanId ;
            if (item.IsPurchaseEnable) { chk_IsPurchaseEnable.checked = true; }
            else chk_IsPurchaseEnable.checked = false;

        }
        for (var item of Selecteditem) {
            //SalesmanIdUpdate = item.SalesmanId ;
            if (item.IsSalesEnable) { chk_IsSalesEnable.checked = true; }
            else chk_IsSalesEnable.checked = false;

        }

        for (var item of Selecteditem) {
            //SalesmanIdUpdate = item.SalesmanId ;
            if (item.ISOperationEnable) { chk_ISOperationEnable.checked = true; }
            else chk_ISOperationEnable.checked = false;

        }






        if (Selecteditem[0].CC_Code == null) {

            $('#txt_CC_Code').prop("value", "Null");
        }
        else {


            $('#txt_CC_Code').prop("value", Selecteditem[0].CC_Code);
        }


        if (Selecteditem[0].NationalityID == null) {
            $('#ddlNationality').prop("value", "Null");
        }
        else {

            $('#ddlNationality').prop("value", Selecteditem[0].NationalityID);
        }


        SalesmanId = Selecteditem[0].SalesmanId;



    } 
    function FillddlNationality() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Nationality", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    NationalityDetails = result.Response as Array<G_Nationality>;
                    DisplayStG_Nationality();
                }
            }
        });
    } 
    function DisplayStG_Nationality() {
        for (var i = 0; i < NationalityDetails.length; i++) {



            $('#ddlNationality').append('<option value="' + NationalityDetails[i].NationalityID + '">' + (lang == "ar" ? NationalityDetails[i].DescA  : NationalityDetails[i].DescL) + '</option>');



        }

    } 
    function FillddlG_COST_CENTER() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("CostCenter", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    G_COST_CENTERDetails = result.Response as Array<G_COST_CENTER>;
                    DisplayStG_COST_CENTER();
                }
            }
        });
    } 
    function DisplayStG_COST_CENTER() {
        for (var i = 0; i < G_COST_CENTERDetails.length; i++) {

            $('#txt_CC_Code').append('<option value="' + G_COST_CENTERDetails[i].CC_CODE + '">' + (lang == "ar" ? G_COST_CENTERDetails[i].CC_DESCA : G_COST_CENTERDetails[i].CC_DESCE) + '</option>');
             
        }

    } 
    function EnableControls() {
        if (!SysSession.CurrentPrivileges.AddNew) return;

        $("#Div_control").attr("style", "height: 281px;margin-bottom: 19px;margin-top: 20px;");

        $('#btnsave').removeClass("display_none");
        $('#btnback').removeClass("display_none");
        $('#btnedite').addClass("display_none");

        $('#txt_Category').prop("selectedIndex", 0);
        $('#txt_Cust_Type').prop("selectedIndex", 0);
        $('#ddlNationality').prop("selectedIndex", 0);
        $('#txt_CC_Code').prop("selectedIndex", 0); 
        $('#txt_Grop').prop("selectedIndex", 0);

        txt_CustomerCODE.value = "";
        txt_NAME.value = "";
        txt_NAMEE.value = "";
        txt_ADDRESS.value = "";
        txt_MOBILE.value = "";
        txt_IDNo.value = "";
        txt_note.value = "";
        chk_IsPurchaseEnable.checked = false;
        chk_IsSalesEnable.checked = false;
        chk_ISOperationEnable.checked = false;
        chkActive.checked = false;
        chk_PurchaseLimit.value = "";
        chk_SalesCreditLimit.value = "";
         
    } 
    function Display() {

             Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("AccDefSalesMen", "GetSalesManView"),
                data: {
                    CompCode: compcode, BranchCode: BranchCode, IsSalesEnable: Details_IsSalesEnable.value, IsPurchaseEnable: Details_IsPurchaseEnable.value, ISOperationEnable: Details_ISOperationEnable.value, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                },
                success: (d) => {
            
                    let result = d as BaseResponse;
                    if (result.IsSuccess) {
                        Details = result.Response as Array<IQ_GetSalesMan>;

                        for (var i = 0; i < Details.length; i++) {
                            if (Details[i].IsSalesEnable) { Details[i].text_IsSalesEnable = (lang == "ar" ? "له الحق" : "He's right") } else { Details[i].text_IsSalesEnable = (lang == "ar" ? "ليس له الحق" : "He has no right") }
                            if (Details[i].IsPurchaseEnable) { Details[i].text_IsPurchaseEnable = (lang == "ar" ? "له الحق" : "He's right") } else { Details[i].text_IsPurchaseEnable = (lang == "ar" ? "ليس له الحق" : "He has no right") }
                            if (Details[i].ISOperationEnable) { Details[i].text_ISOperationEnable = (lang == "ar" ? "له الحق" : "He's right") } else { Details[i].text_ISOperationEnable = (lang == "ar" ? "ليس له الحق" : "He has no right") }

                        }

                        BilldIData = Details;
                        ReportGrid.DataSource = BilldIData;
                        InitializeGrid();
                        ReportGrid.Bind();


                    }

                }
            });
       
    }  
    function _SearchBox_Change() {


        if (searchbutmemreport.value != "") {



            let search: string = searchbutmemreport.value.toLowerCase();
            SearchDetails = BilldIData.filter(x => x.NameA.toLowerCase().search(search) >= 0 || x.NameE.toLowerCase().search(search) >= 0 || x.MOBILE.toLowerCase().search(search) >= 0
                || x.SalesmanCode.toString().search(search) >= 0 /*|| x.CreditLimit.toString().search(search) >= 0 || x.Emp_NameA.toString().search(search) >= 0
                || x.ContactMobile.toString().search(search) >= 0 /*|| x.DueAmount.toString().search(search) >= 0 *//*|| x.DaysDiff.toString().search(search) >= 0*/);

            ReportGrid.DataSource = SearchDetails;
            ReportGrid.Bind();
        } else {
            ReportGrid.DataSource = BilldIData;
            ReportGrid.Bind();
        }
    } 
    function InitializeGrid() {


        let res: any = GetResourceList("");
        $("#id_ReportGrid").attr("style", "");
        ReportGrid.OnRowDoubleClicked = DriverDoubleClick;
        ReportGrid.ElementName = "ReportGrid";
        ReportGrid.PrimaryKey = "SalesmanId";
        ReportGrid.Paging = true;
        ReportGrid.PageSize = 10;
        ReportGrid.Sorting = true;
        ReportGrid.InsertionMode = JsGridInsertionMode.Binding;
        ReportGrid.Editing = false;
        ReportGrid.Inserting = false;
        ReportGrid.SelectedIndex = 1;
        ReportGrid.OnItemEditing = () => { };
        ReportGrid.Columns = [
            { title: "الرقم", name: "SalesmanId ", type: "text", width: "100px", visible: false },
            { title: res.App_SalesmanCode, name: "SalesmanCode", type: "text", width: "100px" },
            { title: res.SHT_Name, name: (lang == "ar" ? "NameA" : "NameE"), type: "text", width: "100px" },
            { title: res.App_Mobile, name: "MOBILE", type: "text", width: "100px" },
            { title: res.App_Nationality, name: (lang == "ar" ? "Nat_DescA" : "Nat_DescE") , type: "text", width: "100px" },
            { title: res.App_AuthTosellfor, name: "text_IsSalesEnable", type: "text", width: "100px" },
            { title: res.App_AuthToPurchase, name: "text_IsPurchaseEnable", type: "text", width: "100px" },
            //{ title: res.App_AuthTheCommission, name: "text_ISOperationEnable", type: "text", width: "100px" },




        ];
        ReportGrid.Bind();
    } 
    function Assign() { 


        if (txt_NAME.value == "") {
            txt_NAME.value = txt_NAMEE.value;
        }
        if (txt_NAMEE.value == "") {
            txt_NAMEE.value = txt_NAME.value;
        }

        Model = new I_Sls_D_Salesman();
        if (IsNew == true) {

            DocumentActions.AssignToModel(Model);//Insert Update

            if (chkActive.checked) { Model.Isactive = true; }
            else { Model.Isactive = false; }

            if (chk_IsPurchaseEnable.checked) { Model.IsPurchaseEnable = true; }
            else { Model.IsPurchaseEnable = false; }

            if (chk_IsSalesEnable.checked) { Model.IsSalesEnable = true; }
            else { Model.IsSalesEnable = false; }

            if (chk_ISOperationEnable.checked) { Model.ISOperationEnable = true; }
            else { Model.ISOperationEnable = false; }


            Model.CompCode = Number(compcode);
            Model.BraCode = Number(BranchCode);
            Model.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            Model.UserCode = SysSession.CurrentEnvironment.UserCode;

            Model.CREATED_AT = DateTimeFormat(Date().toString());
            Model.CREATED_BY = SysSession.CurrentEnvironment.UserCode;

            Model.SalesmanId = SalesmanId;
            //Model.VendorCode = $('#txt_CustomerCODE').val();

            Model.NationalityID = $('#ddlNationality').val();
            Model.CC_Code = $('#txt_CC_Code').val();




        }
        else {
            //  DocumentActions.RenderFromModel(Model);//Display
            DocumentActions.AssignToModel(Model);//Insert Update

            if (chkActive.checked) { Model.Isactive = true; }
            else { Model.Isactive = false; }

            if (chk_IsPurchaseEnable.checked) { Model.IsPurchaseEnable = true; }
            else { Model.IsPurchaseEnable = false; }

            if (chk_IsSalesEnable.checked) { Model.IsSalesEnable = true; }
            else { Model.IsSalesEnable = false; }

            if (chk_ISOperationEnable.checked) { Model.ISOperationEnable = true; }
            else { Model.ISOperationEnable = false; }

            Model.CompCode = Number(compcode);
            Model.BraCode = Number(BranchCode);
            Model.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            Model.UserCode = SysSession.CurrentEnvironment.UserCode;
            Model.UPDATED_AT = DateTimeFormat(Date().toString());
            Model.UPDATED_BY = SysSession.CurrentEnvironment.UserCode;

            Model.SalesmanId = SalesmanId;

            Model.NationalityID = $('#ddlNationality').val();
            Model.CC_Code = $('#txt_CC_Code').val();

        }


    } 
    function Insert() {
        Assign();

        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AccDefSalesMen", "Insert"),
            data: JSON.stringify(Model),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    DisplayMassage("تم الحفظ بنجاح", "Success", MessageType.Succeed);
                    Valid = 0;
                } else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                }
            }
        });
    } 
    function Update() {
        Assign();
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AccDefSalesMen", "Update"),
            data: JSON.stringify(Model),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    DisplayMassage("تم التعديل بنجاح", "Success", MessageType.Succeed);
                } else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                }
            }
        });

    }

}