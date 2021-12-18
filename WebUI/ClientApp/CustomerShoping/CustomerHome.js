$(document).ready(function () {
    CustomerHome.InitalizeComponent();
});
var CustomerHome;
(function (CustomerHome) {
    //system varables
    var TrType = 2;
    var SysSession = GetSystemSession();
    var compcode;
    var BranchCode;
    var sys = new SystemTools();
    var vatType;
    var Finyear;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var CustDetails = new Array();
    var SlsInvoiceStatisticsDetails = new Array();
    var SearchDetails = new Array();
    var txtStartDate;
    var txtEndDate;
    var btnShow;
    var ddlCustomer;
    var searchbutmemreport;
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var btnPrintTransaction;
    var btnPrintInvoicePrice;
    var btnPrintslip;
    // giedView
    var Grid = new JsGrid();
    var CustomerId = 0;
    function InitalizeComponent() {
        debugger;
        if ($('#ChackEnter').val() == '1') {
            CustomerId = Number(SysSession.CurrentEnvironment.CustomerId);
            if (isNaN(CustomerId)) {
                window.open(Url.Action("LogCust", "Home"), "_self");
            }
        }
    }
    CustomerHome.InitalizeComponent = InitalizeComponent;
})(CustomerHome || (CustomerHome = {}));
//# sourceMappingURL=CustomerHome.js.map