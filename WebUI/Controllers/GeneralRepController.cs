using Inv.DAL.Domain;
using Inv.DAL.Repository;
using Inv.WebUI.Reports.Forms;
using Inv.WebUI.Reports.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Web.Configuration;
using System;

namespace Inv.WebUI.Controllers
{//eslam 1 dec 2020
    public class GeneralRepController : ReportsPagePrintController
    {
        private readonly StdParamters CurrentReportParameters;
        private readonly ReportsDetails ReportsDetail = new ReportsDetails();
        private readonly ReportInfo Rep = new ReportInfo();
        private readonly ClassPrint Printer = new ClassPrint();

        protected InvEntities db = UnitOfWork.context(BuildConnectionString());

        public static string BuildConnectionString()
        {
            HttpClient httpClient = new HttpClient();
            string res = httpClient.GetStringAsync(WebConfigurationManager.AppSettings["ServiceUrl"] + "SystemTools/BuildConnection").Result;
            return res;
        }


       

        public string rptInvoiceNote(RepFinancials rp)
        {

            IEnumerable<IProc_Prnt_SlsInvoice_Result> que = Rpt_Prnt_SlsInvoice(rp);

            return buildReport(que);

        }
        public string rptInvoiceNoteRet(RepFinancials rp)
        {
            IEnumerable<IProc_Prnt_SlsInvoice_Result> que = Rpt_Prnt_SlsInvReturn(rp);

            return buildReport(que);
        }
        //public string Prnt_VATSlsInvoice(RepFinancials rp)
        //{
        //    var que = Prnt_VATSlsInvoicee(rp);

        //    return buildReport(que);

        //} 


         

        // كشف حركة المخزون
        public string IProc_Rpt_ItemStockSummary(RepFinancials rp)
        {
            
            IEnumerable<IProc_Rpt_ItemStockSummary_Result> que = Rpt_ItemStockSummary(rp); 
            return buildReport(que);

        }
        // كشف قيمة المخزون
        public string IProc_Rpt_ItemStockValue(RepFinancials rp)
        {
          
            IEnumerable<IProc_Rpt_ItemStockValue_Result> que = Rpt_ItemStockValue(rp); 
            return buildReport(que);

        }
        // كشف ايراد العمليات
        public string IProc_Rpt_ItemStockIncome(RepFinancials rp)
        {
            
            IEnumerable<IProc_Rpt_ItemStockIncome_Result> que = Rpt_ItemStockIncome(rp); 
            return buildReport(que);

        }



    }
}