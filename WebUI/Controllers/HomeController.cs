using Inv.WebUI.Filter;
using System.Web.Mvc;

namespace Inv.WebUI.Controllers
{

    [AuthorizeUserAttribute()]
    public class HomeController : Controller
    {



        //    GET: Home
        public ActionResult HomeIndex()
        {

            //Session["ErrorUrl"] = "";//Url.Action("LoginIndex", "Login");
            //SessionManager.SessionRecord.CompanyNameAr = "";

            //Session["SystemProperties"] = SessionManager.SessionRecord;

            return View("HomeIndex");
        }

        public ActionResult Admin()
        {
            return View();
        }

        public ActionResult AdminHome()
        {
            return View();
        }
        public JsonResult AdminHome_()
        {

            var obj = new
            {
                url = Url.Action("AdminHome", "Home")

            };
            var result = Shared.JsonObject(obj);
            return result;
        }


        public ActionResult LogCust()
        {
            return View();
        }

        public ActionResult CustHome()
        {
            return View();
        }
        public JsonResult CustHome_()
        {

            var obj = new
            {
                url = Url.Action("CustHome", "Home")

            };
            var result = Shared.JsonObject(obj);
            return result;
        }



        public ActionResult HomeIndexPackage()
        {


            return View("HomeIndex");
        }

        //public JsonResult GetSystemProperties()
        //{
        //    SessionRecord jsonObject = (SessionRecord)Session["SystemProperties"];
        //    string data = Newtonsoft.Json.JsonConvert.SerializeObject(jsonObject, Newtonsoft.Json.Formatting.Indented);
        //    return Shared.JsonObject(data);
        //}

        public ActionResult Logout()
        {

            //SessionManager.Me = null;
            //SessionManager.ModelCount = 0;
            //SessionManager.PageIndex = 0;
            //SessionManager.SessionRecord = null;

            return RedirectToAction("Loginindex", "Login");
        }

        public ViewResult Help()
        {

            return View();
        }


        public ActionResult OpenView(string ModuleCode)
        {


            if (ModuleCode == "ImagPopUp")
            {
                return PartialView("~/Views/Shared/ImagePopup.cshtml");

            }
            if (ModuleCode == "Messages_screen")
            {
                return PartialView("~/Views/Shared/Messages_screen.cshtml");
            }
            if (ModuleCode == "ImagePopupiupload")
            {
                return PartialView("~/Views/Shared/ImagePopupiupload.cshtml");
            }

            return PartialView("");

        }

        #region Open Pages 



        public ActionResult ReportsPopup()
        {
            return View("~/Views/Partial/ReportsPopup.cshtml");
        }

        public ActionResult USERSIndex()
        {
            return View("~/Views/Tools/USERS/USERSIndex.cshtml");
        }
      
        public ActionResult ClientaccstatIndex()
        {
            return View("~/Views/CollectionReports/ClientaccstatIndex.cshtml");
        }

        public ActionResult AdminBarIndex()
        {
            return View("~/Views/AdminSetting/AdminBarIndex.cshtml");
        }
        public ActionResult AdminCompIndex()
        {
            return View("~/Views/AdminSetting/AdminCompIndex.cshtml");
        }


        public ActionResult CustomerViews1()
        {
            return View("~/Views/CustomerViews/CustomerViews1Index.cshtml");
        }
        public ActionResult CustomerViews2()
        {
            return View("~/Views/CustomerViews/CustomerViews2Index.cshtml");
        }






        public ActionResult SlsTrSalesIndex()
        {
            return View("~/Views/Sales/SlsTrSalesIndex.cshtml");
        }
       
       
        public ActionResult PurchasesIndex()
        {
            return View("~/Views/Purchases/PurchasesIndex.cshtml");
        }
        public ActionResult PurchasesNewIndex()
        {
            return View("~/Views/Purchases/PurchasesNewIndex.cshtml");
        }

        public ActionResult CategoriesIndex()
        {
            return View("~/Views/Stock/CategoriesIndex.cshtml");
        }


        public ActionResult SlsTrSalesManagerIndex()
        {
            return View("~/Views/Sales/SlsTrSalesManagerIndex.cshtml");
        }
        public ActionResult SlsTrReturnIndex()
        {
            return View("~/Views/Sales/SlsTrReturnIndex.cshtml");
        } 
        public ActionResult SlsTrShowPriceIndex()
        {
            return View("~/Views/Sales/SlsTrShowPriceIndex.cshtml");
        }
       



        public ActionResult ItemsIndex()
        {
            return View("~/Views/Stock/ItemsIndex.cshtml");
        }
        public ActionResult familly_CatIndex()
        {

            return View("~/Views/Stock/familly_Cat.cshtml");
        }
        public ActionResult SupplierIndex()
        {
            return View("~/Views/Generalsetting/SupplierIndex.cshtml");
        }

        public ActionResult AccDefSalesmenIndex()
        {
            return View("~/Views/Generalsetting/AccDefSalesmenIndex.cshtml");
        }

        public ActionResult CUSTOMERSIndex()
        {
            return View("~/Views/Generalsetting/CUSTOMERSIndex.cshtml");
        }
        public ActionResult Catch_ReceiptIndex()
        {
            return View("~/Views/Generalsetting/Catch_ReceiptIndex.cshtml");
        } 
        public ActionResult SalesinventoryIndex()
        {

            return View("~/Views/Report/Salesinventory.cshtml");
        }
        public ActionResult Income_expensesIndex()
        {

            return View("~/Views/Report/Income_expenses.cshtml");
        }




        public ActionResult StkDefItemsIndex()
        {
            return View("~/Views/StkDefinition/StkDefItemsNewIndex.cshtml");
        }
        public ActionResult StkDefItemsNewIndex()
        {
            return View("~/Views/StkDefinition/StkDefItemsNewIndex.cshtml");
        }
        public ActionResult StkDefCategoryIndex()
        {
            return View("~/Views/StkDefinition/StkDefCategoryIndex.cshtml");
        }
        public ActionResult StkDefUnitIndex()
        {
            return View("~/Views/StkDefinition/StkDefUnitIndex.cshtml");
        }
        public ActionResult StkDefItemTypeIndex()
        {
            return View("~/Views/StkDefinition/StkDefItemTypeIndex.cshtml");
        }
        public ActionResult StkDefUnitGroupIndex()
        {
            return View("~/Views/StkDefinition/StkDefUnitGroupIndex.cshtml");
        }
        public ActionResult DefStoreIndex()
        {
            return View("~/Views/StkDefinition/StkDefStoreIndex.cshtml");
        }
       
        public ActionResult InventorymoveIndex()
        {
            return View("~/Views/CollectionReports/InventorymoveIndex.cshtml");
        }
        public ActionResult InventoryvalueIndex()
        {
            return View("~/Views/CollectionReports/InventoryvalueIndex.cshtml");
        }
        public ActionResult IncomeoperationsIndex()
        {
            return View("~/Views/CollectionReports/IncomeoperationsIndex.cshtml");
        }


        #endregion  Open Pages 

    }
}