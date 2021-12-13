$(document).ready(() => {

    CustomerHome.InitalizeComponent();
})
namespace CustomerHome {
    //system varables
    var TrType = 2;
    var SysSession: SystemSession = GetSystemSession();
    var compcode: Number;
    var BranchCode: number;
    var sys: SystemTools = new SystemTools();
    var vatType: number;
    var Finyear: number;

    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);       

    var CustDetails: Array<CUSTOMER> = new Array<CUSTOMER>();
    var SlsInvoiceStatisticsDetails: Array<IQ_GetSlsInvoiceList> = new Array<IQ_GetSlsInvoiceList>();
    var SearchDetails: Array<IQ_GetSlsInvoiceList> = new Array<IQ_GetSlsInvoiceList>();

    var txtStartDate: HTMLInputElement;
    var txtEndDate: HTMLInputElement;
    var btnShow: HTMLButtonElement;
    var ddlCustomer: HTMLInputElement;
    var searchbutmemreport: HTMLInputElement    
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
    var btnPrintTransaction: HTMLButtonElement;
    var btnPrintInvoicePrice: HTMLButtonElement;
    var btnPrintslip: HTMLButtonElement;
    
    // giedView
    var Grid: JsGrid = new JsGrid();
    var CustomerId = 0;
       
    export function InitalizeComponent()
    {

        CustomerId = Number(SysSession.CurrentEnvironment.CustomerId);
        if (isNaN(CustomerId)) {
            window.open(Url.Action("LogCust", "Home"), "_self");
        }

       
    }
    
}