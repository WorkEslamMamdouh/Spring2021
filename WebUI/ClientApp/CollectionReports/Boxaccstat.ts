$(document).ready(() => {

    Boxaccstat.InitalizeComponent();
})

namespace Boxaccstat {

    var compcode: Number;
    var BranchCode: Number;
    var AccountType: Number = 1;
    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession();
    //------------------------------------------------------------
    var Details_Box: Array<A_RecPay_D_CashBox> = new Array<A_RecPay_D_CashBox>(); 


    //------------------------------------------------------------
  
    var ddlBox: HTMLSelectElement;
    var txtDateFrom: HTMLInputElement;
    var txtDateTo: HTMLInputElement;
    var txt_ID_APP_Type: HTMLSelectElement;
    var Rd_detail: HTMLInputElement;
    var btnReset: HTMLButtonElement;
    var chk_Certified: HTMLInputElement;
      
 

    //--- Print Buttons
    var btnPrint: HTMLButtonElement;
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;

    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);

    export function InitalizeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "كشف حساب صندوق ";

        } else {
            document.getElementById('Screen_name').innerHTML == "Box Account Statment";

        }


        InitalizeControls();
        InitalizeEvents();
        txtDateFrom.value = DateFormat(SysSession.CurrentEnvironment.StartDate);
        txtDateTo.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;

        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        fillddlBox();
        txt_ID_APP_Type.value = "1";
        Rd_detail.checked = true;

    }     
    function InitalizeControls() {
             
        ddlBox = document.getElementById("ddlBox") as HTMLSelectElement;
        txtDateFrom = document.getElementById("txtFromDate") as HTMLInputElement;
        txtDateTo = document.getElementById("txtToDate") as HTMLInputElement;        
        btnReset = document.getElementById("btnReset") as HTMLButtonElement;
        Rd_detail = document.getElementById("Rd_detail") as HTMLInputElement;
        chk_Certified = document.getElementById("chk_Certified") as HTMLInputElement;
                                                                                          
        //---------------------------------------------------------------------- Print Buttons

        btnPrint = document.getElementById("btnPrint") as HTMLButtonElement;
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;
        txt_ID_APP_Type = document.getElementById("txt_ID_APP_Type") as HTMLSelectElement;

    }



    function InitalizeEvents() {


        btnReset.onclick = btnReset_onclick;
        // Print Buttons
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        btnPrint.onclick = () => { PrintReport(4); }

    }                                            
                    

    function fillddlBox() {           
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefBox", "GetAll"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                //
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details_Box = result.Response as Array<A_RecPay_D_CashBox>;   

                    for (var i = 0; i < Details_Box.length; i++)
                    {  
                        $('#ddlBox').append('<option value="' + Details_Box[i].CashBoxID + '">' + (lang == "ar" ? Details_Box[i].CashBox_DescA : Details_Box[i].CashBox_DescE) + '</option>');
                    }

                }
            }
        });          

    }

                                                                       
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
                                                                     
    function GetSystemSession(): SystemSession {
        if (document.cookie.length > 0) {
            // 
            var SysSession = new SystemSession;
            SysSession.CurrentEnvironment = JSON.parse(readCookie("Inv1_systemProperties")) as SystemEnvironment;
            SysSession.CurrentPrivileges = JSON.parse(readCookie("Inv1_Privilage")) as UserPrivilege;
            //RS.CurrentMemberComm = JSON.parse(getCookie("Inv1_Comm")) as Kids_Comm;
            return SysSession;
        }
    }



    function btnReset_onclick() {
        
        txtDateFrom.value = DateFormat(SysSession.CurrentEnvironment.StartDate);
        txtDateTo.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        txtDateFrom.value = DateFormat(SysSession.CurrentEnvironment.StartDate);
        txtDateTo.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        InitalizeComponent();
        ddlBox.value = "Null";
        if (txt_ID_APP_Type.value == "1") {
            txt_ID_APP_Type.value = "3";
        }
        chk_Certified.checked = true;
        Rd_detail.checked = true;
  
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
        rp.FromDate = DateFormatRep(txtDateFrom.value);
        rp.ToDate = DateFormatRep(txtDateTo.value);

       
        if ($("#ddlBox").val() == "null") {//-------------جميع الصناديق 
            rp.BoxId = -1;
        } else {
            rp.BoxId = Number($("#ddlBox").val());
        }
        if ($("#txt_ID_APP_Type").val() == 3) {//-------------الجميع

            rp.Status = 3;
        }
        if (Number($("#txt_ID_APP_Type").val()) == 1) {//-------------منفذ 
            rp.Status = 1;

        }
  
        if (Rd_detail.checked == true) {//******  تقرير تفصيلي  
            rp.check = 1;

        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_AccBoxDetail", "GeneralReports"),
            data: rp,
            success: (d) => {

                let result = d.result as string;


                window.open(result, "_blank");
            }
        })
            
        }
        else{//******  تقرير ملخص   

            rp.check = 2;

            Ajax.Callsync({
                url: Url.Action("IProc_Rpt_AccBoxSummary", "GeneralReports"),
                data: rp,
                success: (d) => {

                    let result = d.result as string;


                    window.open(result, "_blank");
                }
            })
        }


       
    }

}