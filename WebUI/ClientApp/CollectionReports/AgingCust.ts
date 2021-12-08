$(document).ready(() => {

    AgingCust.InitalizeComponent();
})

namespace AgingCust {

    var compcode: Number;
    var BranchCode: Number;
    var AccountType: Number = 1; 
    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession();
    //------------------------------------------------------------
    var Details_Type_D_Category: Array<A_RecPay_D_Category> = new Array<A_RecPay_D_Category>();
    var Details_CustomerGroup: Array<A_RecPay_D_Group> = new Array<A_RecPay_D_Group>();
    var Details_Vendor: Array<A_Rec_D_Customer> = new Array<A_Rec_D_Customer>();
    var Details_Vendornew: Array<A_Rec_D_Customer> = new Array<A_Rec_D_Customer>();
    //------------------------------------------------------------
    var txt_ID_APP_Category: HTMLSelectElement;
    var txt_ID_APP_Group: HTMLSelectElement;
    var txtDateFrom: HTMLInputElement;
    var oneyear: HTMLInputElement;
    var threeyear: HTMLInputElement;
    var btnReset;

    //-----checkbox
    var chk_1: HTMLInputElement;
    var chk_2: HTMLInputElement;
    var chk_3: HTMLInputElement;
    var chk_4: HTMLInputElement;
    var chk_5: HTMLInputElement;
    var chk_6: HTMLInputElement;

    //--- Print Buttons
    var btnPrint: HTMLButtonElement;
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;


    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);

    export function InitalizeComponent() {

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "إعمار مديونية العملاء";

        } else {
            document.getElementById('Screen_name').innerHTML = "Ages of Customers indebtedness";

        }
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        InitalizeEvents();
        txtDateFrom.value = DateFormat(SysSession.CurrentEnvironment.StartDate);
        Display_SupplierCat();
        Display_SupplierGroup();
        discharge();
        DisplayAccDefVendor();
    }     
    function InitalizeControls() {

        txt_ID_APP_Category = document.getElementById("txt_ID_APP_Category") as HTMLSelectElement;
        txt_ID_APP_Group = document.getElementById("txt_ID_APP_Group") as HTMLSelectElement;



        txtDateFrom = document.getElementById("txtFromDate") as HTMLInputElement;
        oneyear = document.getElementById("oneyear") as HTMLInputElement;
        threeyear = document.getElementById("threeyear") as HTMLInputElement;

        chk_1 = document.getElementById("chk_1") as HTMLInputElement;
        chk_2 = document.getElementById("chk_2") as HTMLInputElement;
        chk_3 = document.getElementById("chk_3") as HTMLInputElement;
        chk_4 = document.getElementById("chk_4") as HTMLInputElement;
        chk_5 = document.getElementById("chk_5") as HTMLInputElement;
        chk_6 = document.getElementById("chk_6") as HTMLInputElement;

        btnReset = document.getElementById("btnReset") as HTMLButtonElement;



        //---------------------------------------------------------------------- Print Buttons

        btnPrint = document.getElementById("btnPrint") as HTMLButtonElement;
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;

    }      
    function InitalizeEvents() {
        // Print Buttons
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        btnPrint.onclick = () => { PrintReport(4); }
        btnReset.onclick = btnReset_onclick;

        txt_ID_APP_Category.onchange = displayvendor;
        txt_ID_APP_Group.onchange = displayvendor;
    }
    //----------------------------------------------------( Get Vend_Cat )
    function Display_SupplierCat() {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenDefCategory", "GetAll"),
            data: { CompCode: compcode, AccountType: AccountType, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                //debugger;
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    
                    Details_Type_D_Category = result.Response as Array<A_RecPay_D_Category>;
                    for (var i = 0; i < Details_Type_D_Category.length; i++) { 
                        $('#txt_ID_APP_Category').append('<option value="' + Details_Type_D_Category[i].CatID + '">' + (lang == "ar" ? Details_Type_D_Category[i].Cat_DescA : Details_Type_D_Category[i].Cat_DescE) + '</option>');
 
                    }
                }
            }
        });
    }
    //----------------------------------------------------( Get vend_Group )
    function Display_SupplierGroup() {


        //debugger
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenDefGroup", "GetAll"),
            data: {
                CompCode: compcode, AccountType: AccountType, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                //debugger;
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details_CustomerGroup = result.Response as Array<A_RecPay_D_Group>;
                    for (var i = 0; i < Details_CustomerGroup.length; i++) {



                        $('#txt_ID_APP_Group').append('<option value="' + Details_CustomerGroup[i].GroupID + '">' + (lang == "ar" ? Details_CustomerGroup[i].Group_DescA : Details_CustomerGroup[i].Group_DescE) + '</option>');
                        $('#txt_Grop').append('<option value="' + Details_CustomerGroup[i].GroupID + '">' + (lang == "ar" ? Details_CustomerGroup[i].Group_DescA : Details_CustomerGroup[i].Group_DescE) + '</option>');



                    }
                }
            }
        });
    }
    //----------------------------------------------------( Get Vendor)
    function DisplayAccDefVendor() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "GetAll"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                //;
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details_Vendor = result.Response as Array<A_Rec_D_Customer>;

                    displayvendor();
                }

            }
        });

    }
    function displayvendor() {
        if (txt_ID_APP_Category.value != "Null" && txt_ID_APP_Group.value == "Null") {
            Details_Vendornew = Details_Vendor.filter(x => x.CatID == Number(txt_ID_APP_Category.value));

            $('#txt_ID_Vendor').html('');
            $('#txt_ID_Vendor').append('<option value="null">اختر العميل</option>');
            for (var i = 0; i < Details_Vendornew.length; i++) {
                $('#txt_ID_Vendor').append('<option value="' + Details_Vendornew[i].CustomerId + '">' + (lang == "ar" ? Details_Vendornew[i].NAMEA : Details_Vendornew[i].NAMEE) + '</option>');
            }
        }
        else if (txt_ID_APP_Category.value == "Null" && txt_ID_APP_Group.value != "Null") {
            Details_Vendornew = Details_Vendor.filter(x => x.GroupId == Number(txt_ID_APP_Group.value));
            $('#txt_ID_Vendor').html('');
            $('#txt_ID_Vendor').append('<option value="null">اختر العميل</option>');
            for (var i = 0; i < Details_Vendornew.length; i++) {
                $('#txt_ID_Vendor').append('<option value="' + Details_Vendornew[i].CustomerId + '">' + (lang == "ar" ? Details_Vendornew[i].NAMEA : Details_Vendornew[i].NAMEE) + '</option>');
            }
        }
        else if (txt_ID_APP_Category.value != "Null" && txt_ID_APP_Group.value != "Null") {
            Details_Vendornew = Details_Vendor.filter(x => x.CatID == Number(txt_ID_APP_Category.value) && x.GroupId == Number(txt_ID_APP_Group.value));
            $('#txt_ID_Vendor').html('');
            $('#txt_ID_Vendor').append('<option value="null">اختر العميل</option>');
            for (var i = 0; i < Details_Vendornew.length; i++) {
                $('#txt_ID_Vendor').append('<option value="' + Details_Vendornew[i].CustomerId + '">' + (lang == "ar" ? Details_Vendornew[i].NAMEA : Details_Vendornew[i].NAMEE) + '</option>');
            }
        }
        else {
            $('#txt_ID_Vendor').html('');
            $('#txt_ID_Vendor').append('<option value="null">اختر العميل</option>');
            for (var i = 0; i < Details_Vendor.length; i++) {
                $('#txt_ID_Vendor').append('<option value="' + Details_Vendor[i].CustomerId + '">' + (lang == "ar" ? Details_Vendor[i].NAMEA : Details_Vendor[i].NAMEE) + '</option>');
            }
        }
    }
    //----------------------------------------------------(Get Date )
    function GetDate() {
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


    function btnReset_onclick() {
        txtDateFrom.value = DateFormat(SysSession.CurrentEnvironment.StartDate);
        //txtDateTo.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;


        discharge();


    }

    function discharge() {
        oneyear.checked = true;
        chk_1.checked = false;
        chk_2.checked = false;
        chk_3.checked = false;
        chk_4.checked = false;
        chk_5.checked = false;
        chk_6.checked = false;
        $('#txt_ID_APP_Category option[value=Null]').prop('selected', 'selected').change();
        $('#txt_ID_APP_Group option[value=Null]').prop('selected', 'selected').change();
        $('#txt_ID_Vendor option[value=Null]').prop('selected', 'selected').change();
    }


    //----------------------------------------------------( Report )
    function PrintReport(OutType: number) {
        
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
        if (BranchNameA == null || BranchNameE == null) {

            BranchNameA = " ";
            BranchNameE = " ";
        }
        rp.BraNameA = BranchNameA;
        rp.BraNameE = BranchNameE;
        rp.LoginUser = SysSession.CurrentEnvironment.UserCode;
        rp.RepType = OutType;//output report as View
        rp.FromDt = DateFormatRep(txtDateFrom.value);

        if ($("#txt_ID_APP_Category").val() == "Null") {//-------------جميع الفئات
            rp.CatId = -1;
        } else {
            rp.CatId = Number($("#txt_ID_APP_Category").val());
        }
        if ($("#txt_ID_APP_Group").val() == "Null") {//-------------جميع المجموعات
            rp.Groupid = -1;
        } else {
            rp.Groupid = Number($("#txt_ID_APP_Group").val());
        }
        if ($("#txt_ID_Vendor").val() == "null") {//-------------جميع العملاء 
            rp.CustomerID = -1;
        } else {
            rp.CustomerID = Number($("#txt_ID_Vendor").val());
        }
        if ($("#txt_ID_APP_Type").val() == 3) {//-------------جميع الانواع

            rp.Status = 3;
        }
        if (Number($("#txt_ID_APP_Type").val()) == 1) {//-------------منفذ 
            rp.Status = 1;

        }
       
        if ($("#txt_indebtedness").val() == 0) {//******الجميع 
            rp.BalType = 0;

        }
        if ($("#txt_indebtedness").val() == 1) {//******عليه مديونيه
            rp.BalType = 1;

        }
        if ($("#txt_indebtedness").val() == 2) {//******   ليه مديونيه
            rp.BalType = 2;

        }
        if ($("#txt_indebtedness").val() == 3) {//******صفري

            rp.BalType = 3;
        }

        if (oneyear.checked == true) {
            rp.Agtype = 1;
        
        }
        else if (threeyear.checked == true) {
            rp.Agtype = 3;
         
           
        }
        else {
            rp.Agtype = 5;


        }
        rp.typedata = 1;
        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_AccCustomerAging", "GeneralReports"),
            data: rp,
            success: (d) => {

                let result = d.result as string;


                window.open(result, "_blank");
            }
        })




    }

}