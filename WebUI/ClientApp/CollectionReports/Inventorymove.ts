$(document).ready(() => {

    Inventorymove.InitalizeComponent();
})

namespace Inventorymove {

    var compcode: Number;
    var BranchCode : Number;          
    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession();
    var Display_ItemFamily: Array<I_ItemFamily> = new Array<I_ItemFamily>();
    var Display_ItemFamilyFill: Array<I_ItemFamily> = new Array<I_ItemFamily>();
    var Details: Array<IQ_GetItemStoreInfo> = new Array<IQ_GetItemStoreInfo>();
    //------------------------------------------------------------
    var catId;

    var txtDateFrom: HTMLInputElement;
    var txtDateTo: HTMLInputElement;    
    var reptp1: HTMLInputElement;
    var reptp2: HTMLInputElement;
    var btnReset;
  
    //--- Print Buttons
    var btnPrint: HTMLButtonElement;
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
    var drpitem_family: HTMLSelectElement;
    var txt_ID_APP_Type: HTMLSelectElement;
    var drpPaymentType: HTMLSelectElement;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);



    export function InitalizeComponent() {
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number( sys.SysSession.CurrentEnvironment.BranchCode);
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "حركة المخزون";

        } else {
            document.getElementById('Screen_name').innerHTML = "Inventory Movement";

        }
        InitalizeControls();
        InitalizeEvents();
        reptp1.checked = true;
        txtDateFrom.value = DateFormat(SysSession.CurrentEnvironment.StartDate);
        txtDateTo.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;

        Display_DrpPaymentType();
        Display_I_ItemFamily();

        $('#txt_ID_APP_Type').append('<option value="' + 0 + '"> ' + (lang == "ar" ? "اختر الصنف " : "choose item") +'</option>');
    }




    function InitalizeControls() {


        btnPrint = document.getElementById("btnPrint") as HTMLButtonElement;
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;
        txtDateFrom = document.getElementById("txtFromDate") as HTMLInputElement;
        txtDateTo = document.getElementById("txtToDate") as HTMLInputElement;
        drpitem_family = document.getElementById("drpitem_family") as HTMLSelectElement;
        txt_ID_APP_Type = document.getElementById("txt_ID_APP_Type") as HTMLSelectElement;
        drpPaymentType = document.getElementById("drpPaymentType") as HTMLSelectElement;
        reptp1 = document.getElementById("reptp1") as HTMLInputElement;
        reptp2 = document.getElementById("reptp2") as HTMLInputElement;
        btnReset = document.getElementById("btnReset") as HTMLButtonElement;

    }



    function InitalizeEvents() {
        // Print Buttons
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        btnPrint.onclick = () => { PrintReport(4); }
        drpPaymentType.onchange = drpPaymentType_onchange;
        btnReset.onclick = btnReset_onclick;
        drpitem_family.onchange = itemDisplay;
    }

    //----------------------------------------------------( Get Item_Cat )
    function Display_DrpPaymentType() {
         
        var Display_Type: Array<I_D_Category> = new Array<I_D_Category>();
         
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefCategory", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Display_Type = result.Response as Array<I_D_Category>;
                     
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                        DocumentActions.FillCombowithdefult(Display_Type, drpPaymentType, "CatID", "DescA", "اختر الفئة");
                  }
                     else {
                         DocumentActions.FillCombowithdefult(Display_Type, drpPaymentType, "CatID", "DescL", "Select Category");
                     }


                    
                }
            }
        });
    }
    
    //----------------------------------------------------( Get item familly )
    function Display_I_ItemFamily() {
       
         Display_ItemFamily= new Array<I_ItemFamily>();

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    Display_ItemFamily = result.Response as Array<I_ItemFamily>;
                   
                       
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                        DocumentActions.FillCombowithdefult(Display_ItemFamily, drpitem_family, "ItemFamilyID", "DescA", "اختر النوع");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(Display_ItemFamily, drpitem_family, "ItemFamilyID", "DescL", "Select Type");                             
                    }

                    if (drpitem_family.value != 'null') {
                        $('#txt_ID_APP_Type').html('');
                        $('#txt_ID_APP_Type').removeAttr("disabled")
                    } else {
                        $('#txt_ID_APP_Type').html('');
                        $('#txt_ID_APP_Type').attr("disabled")
                    }
                     
                }
            }
        });
    }
    function drpPaymentType_onchange()
    {
        if (drpPaymentType.value!='null') {
            Display_ItemFamilyFill = Display_ItemFamily.filter(x => x.CatID == Number(drpPaymentType.value))
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                DocumentActions.FillCombowithdefult(Display_ItemFamilyFill, drpitem_family, "ItemFamilyID", "DescA", "اختر النوع");
            }
            else {
                DocumentActions.FillCombowithdefult(Display_ItemFamilyFill, drpitem_family, "ItemFamilyID", "DescL", "Select Type");
            }
        } else {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                DocumentActions.FillCombowithdefult(Display_ItemFamily, drpitem_family, "ItemFamilyID", "DescA", "اختر النوع");
            }
            else {
                DocumentActions.FillCombowithdefult(Display_ItemFamily, drpitem_family, "ItemFamilyID", "DescL", "Select Type");
            }
        }
       
    }

    //----------------------------------------------------( Item Desc )
    function itemDisplay() {
         
        if (drpitem_family.value!='null') {
             Details  = new Array<IQ_GetItemStoreInfo>();

             
            var storeCode = 1;
            var ItemFamilyID = Number($("#drpitem_family").val());
            var finyear = sys.SysSession.CurrentEnvironment.CurrentYear;
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("StkDefItemType", "GetItemByFamilyIdOrdered"),
                data: {
                    CompCode: compcode, BranchCode: BranchCode, FinYear: finyear, familyid: ItemFamilyID, storeid: storeCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                },
                success: (d) => {

                    let result = d as BaseResponse;
                    if (result.IsSuccess) {
                         
                        Details = result.Response as Array<IQ_GetItemStoreInfo>;


                        $('#txt_ID_APP_Type').html('');
                        $('#txt_ID_APP_Type').removeAttr("disabled")
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                            DocumentActions.FillCombowithdefult(Details, txt_ID_APP_Type, "ItemID", "Itm_DescA", "اختر الصنف");
                        }
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                            DocumentActions.FillCombowithdefult(Details, txt_ID_APP_Type, "ItemID", "Itm_DescE", "Select Item");
                        }

                    }
                }
            });
        } else {
            $('#txt_ID_APP_Type').attr("disabled", "disabled");         
            DocumentActions.FillCombowithdefult(Details, txt_ID_APP_Type, "ItemID", "Itm_DescA", "اختر الصنف");   
        }
       

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



    function btnReset_onclick() {
         
        txtDateFrom.value = DateFormat(SysSession.CurrentEnvironment.StartDate);
        txtDateTo.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;

        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        discharge();
      

    }

    function discharge() {
        $('#drpPaymentType option[value=Null]').prop('selected', 'selected').change();
        $('#txt_indebtedness option[value=All]').prop('selected', 'selected').change();
        $('#drpitem_family option[value=0]').prop('selected', 'selected').change();
        $('#txt_ID_status option[value=1]').prop('selected', 'selected').change(); 
        $('#txt_ID_APP_Type').html('');
        $('#txt_ID_APP_Type').append('<option value="' + 0 + '">' + (lang == "ar" ? " اختر الصنف" : "choose item")+'  </option>');
        $('#txt_ID_APP_Type').attr("disabled", "disabled");
    }     

    //----------------------------------------------------( Report )
    function PrintReport(OutType: number) {
         
        let rp: ReportParameters = new ReportParameters();

        window.open(Url.Action("ReportsPopup", "Home"), "blank");
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');


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


        if ($("#drpPaymentType").val() == "null") {//-------------جميع الفئات
            rp.CatId = -1;
        } else {
            rp.CatId = Number($("#drpPaymentType").val());
        }
        if ($("#drpitem_family").val() == "null") {//-------------جميع الانواع
            rp.ItemFamId = -1;
            rp.ItemID = -1;
        } else {
            rp.ItemFamId = Number($("#drpitem_family").val());

            if ($("#txt_ID_APP_Type").val() == "null") {//-------------جميع الاصناف
                rp.ItemID = -1;
            } else {
                rp.ItemID = Number($("#txt_ID_APP_Type").val());
            }
        }      
        if ($("#txt_indebtedness").val() == ">") {//******رصيد سالب
            rp.BalType = 2;

        }
        if ($("#txt_indebtedness").val() == "<") {//******رصيد موجود
            rp.BalType = 1;

        }
        if ($("#txt_indebtedness").val() == "=") {//******صفري
            rp.BalType = 3;

        }
        if ($("#txt_indebtedness").val() == "All") {//******الجميع

            rp.BalType = 0;
        }        
         rp.Status = $("#txt_ID_status").val();
        if (reptp1.checked == true) {
            rp.check = 3;

        }
        else if (reptp2.checked == true) {
            rp.check = 2;
        }
        else  {
            rp.check = 1;
        }

         
       
        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_ItemStockSummary", "GeneralRep"),
            data: rp,
            success: (d) => {
                let result = d as BaseResponse;
                window.open(Url.Action("ReportsPopup", "Home"), "blank");
                localStorage.setItem("result", "" + result + "");

                //let result = d.result as string;
                //window.open(result, "_blank");
            }
        })
    }
}