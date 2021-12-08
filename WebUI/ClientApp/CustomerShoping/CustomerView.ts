$(document).ready(() => {

    CustomerView.InitalizeComponent();
})
namespace CustomerView {
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
       
    export function InitalizeComponent()
    {                                        
 

        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        Finyear = Number(SysSession.CurrentEnvironment.CurrentYear);

        InitalizeControls();
        InitializeEvents();
        fillddlCustomer();
        ddlCustomer.value = SysSession.CurrentEnvironment.CUSTOMER_NAME;
        txtStartDate.value = GetDate() ;
        txtEndDate.value = GetDate();
        btnShow_onclick();
    }
    function InitalizeControls() {    
        ddlCustomer = document.getElementById("ddlCustomer") as HTMLInputElement;    
        searchbutmemreport = document.getElementById("searchbutmemreport") as HTMLInputElement;
        txtStartDate = document.getElementById("txtStartDate") as HTMLInputElement;    
        txtEndDate = document.getElementById("txtEndDate") as HTMLInputElement;         
        btnShow = document.getElementById("btnShow") as HTMLButtonElement;
       
        //print 
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;
        btnPrintTransaction = document.getElementById("btnPrintTransaction") as HTMLButtonElement;
        btnPrintslip = document.getElementById("btnPrintslip") as HTMLButtonElement;
        ////
        btnPrintInvoicePrice = document.getElementById("btnPrintInvoicePrice") as HTMLButtonElement;

    }
    function InitializeEvents() {

      
        btnShow.onclick = btnShow_onclick;    
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        //btnPrint.onclick = () => { PrintReport(4); }  
        searchbutmemreport.onkeyup = _SearchBox_Change;
         


    }   

    function btnShow_onclick() {
        debugger
        InitializeGrid();
        $("#divShow").removeClass("display_none");
        $("#DivInvoiceDetails").addClass("display_none");
        $("#cotrolDiv").removeClass("disabledDiv");
    }   
    function fillddlCustomer() {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Customer", "GetAll"),
            data: {
                CompCode: compcode, BranchCode: BranchCode
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {  
                    CustDetails = result.Response as Array<CUSTOMER>; 
                }
            }
        });
    }                                                                            
    function InitializeGrid() {
        let res: any = GetResourceList("");
        Grid.ElementName = "divGridDetails";
        Grid.Paging = true;
        Grid.PageSize = 10;
        Grid.Sorting = true;
        Grid.InsertionMode = JsGridInsertionMode.Binding;
        Grid.Editing = false;
        Grid.Inserting = false;
        Grid.SelectedIndex = 1;
        //Grid.OnRowDoubleClicked = Grid_RowDoubleClicked;
        Grid.OnItemEditing = () => { };
        Grid.PrimaryKey = "InvoiceID";
        Grid.Columns = [
            { title: res.App_Number, name: "InvoiceID", type: "text", width: "2%", visible: false },
            { title: res.App_Number, name: "TrNo", type: "text", width: "13%" },
            { title: res.App_Cutomer, name: "CustomerName", type: "text", width: "25%" },         
            { title: res.App_date, name: "TrDate", type: "text", width: "20%" },        
            { title: res.App_total, name: "TotalAmount", type: "text", width: "15%" },
            { title: res.App_Tax, name: "VatAmount", type: "text", width: "12%" },
            { title: res.App_Net, name: "NetAfterVat", type: "text", width: "13%" },            
            { title: res.App_TobePaid, name: "RemainAmount", type: "text", width: "17%", css: "classfont" },  
        ];
        BindStatisticGridData();
    }
    function BindStatisticGridData() {
        var startDate = txtStartDate.value;
        var endDate = txtEndDate.value;    
        var CustomerId = SysSession.CurrentEnvironment.CustomerId;
 
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetAllSlsInvoiceCust"),
            data: { CompCode: compcode, BranchCode: BranchCode, StartDate: startDate, EndDate: endDate, CustId: CustomerId, TrType : 3 , UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {//(int CompCode, string StartDate, string EndDate, int Status, int? CustId, string SalesUser, string UserCode, string Token)
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    SlsInvoiceStatisticsDetails = result.Response as Array<IQ_GetSlsInvoiceList>;   
                    Grid.DataSource = SlsInvoiceStatisticsDetails;
                    Grid.Bind();
                }
            }
        });
    }
    function _SearchBox_Change() {
        //  k//////

        if (searchbutmemreport.value != "") {

            let search: string = searchbutmemreport.value.toLowerCase();
            SearchDetails = SlsInvoiceStatisticsDetails.filter(x => x.TrNo.toString().search(search) >= 0 || x.CustomerName.toLowerCase().search(search) >= 0 );

            //Grid.DataSource = SearchDetails;
            Grid.Bind();
        } else {
            //Grid.DataSource = SlsInvoiceStatisticsDetails;
            Grid.Bind();
        }
    }
                                        
    export function PrintReport(OutType: number) {
        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();

        rp.RepType = OutType;//output report as View
        rp.FromDate = DateFormatRep(txtStartDate.value);
        rp.ToDate = DateFormatRep(txtEndDate.value);
        rp.CompCode = SysSession.CurrentEnvironment.CompCode;
        rp.BranchCode = SysSession.CurrentEnvironment.BranchCode;
        rp.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
        rp.CompNameE = SysSession.CurrentEnvironment.CompanyName;
        rp.UserCode = SysSession.CurrentEnvironment.UserCode;
        rp.Tokenid = SysSession.CurrentEnvironment.Token;
        rp.BraNameA = SysSession.CurrentEnvironment.BranchName;
        rp.BraNameE = SysSession.CurrentEnvironment.BranchNameEn;
        rp.ScreenLanguage = SysSession.CurrentEnvironment.ScreenLanguage;
        rp.SystemCode = SysSession.CurrentEnvironment.SystemCode;
        rp.SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        if (rp.BraNameA == null || rp.BraNameE == null) {

            rp.BraNameA = " ";
            rp.BraNameE = " ";
        }
        rp.LoginUser = SysSession.CurrentEnvironment.UserCode;
        //if (ddlSalesmanFilter.selectedIndex > 0)

        //    rp.SalesmanID = Number($("#ddlSalesmanFilter").val());
        //else
        //    rp.SalesmanID = -1;

        if ($("#ddlCustomer").val() == "null")
            rp.CustomerID = -1;
        else
            rp.CustomerID = Number($("#ddlCustomer").val());
        rp.OperationId = -1;
        rp.CashType = Number($("#ddlInvoiceType").val());
        rp.Status = Number($("#ddlStateType").val());
        rp.TrType = 2;
        rp.src = 1;

        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_SlsInvoiceList", "GeneralReports"),
            data: rp,
            success: (d) => {

                let result = d.result as string;


                window.open(result, "_blank");
            }
        })
    }
    

}