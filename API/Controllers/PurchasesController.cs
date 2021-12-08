using Inv.API.Models;
using Inv.BLL.Services.Purchases;
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using API.Controllers;
using Inv.API.Tools;
using System.Web.Http.Cors;
using System.Data.SqlClient;
using System.Data.Entity;
using Inv.DAL.Repository;
using Newtonsoft.Json;
using Inv.API.Models.CustomModel;
using Inv.BLL.Services.PurTrReceive;
using Inv.BLL.Services.PurInvoiceItems;
using Inv.BLL.Services.PurTRCharges;

namespace API.Controllers
{
    [EnableCorsAttribute("*", "*", "*")]
    public class PurchasesController : BaseController
    {

        private readonly IPurTrReceiveService PurTrReceiveService;
        private readonly IPurTRReceiveItemsService PurTRReceiveItemsService;
        private readonly IPurTRChargesService PurTRChargesService;
        private readonly IPurchases_MasterServices Purchases_MasterServices;

        public PurchasesController(IPurTrReceiveService _IPurTrReceiveService, IPurTRReceiveItemsService _IPurTRReceiveItemsService, IPurTRChargesService _IPurTRChargesService, IPurchases_MasterServices _Purchases_MasterServices)
        {
            PurTrReceiveService = _IPurTrReceiveService;
            this.Purchases_MasterServices = _Purchases_MasterServices;
            PurTRChargesService = _IPurTRChargesService;
            PurTRReceiveItemsService = _IPurTRReceiveItemsService;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(string UserName, string password)
        {
            if (ModelState.IsValid)
            {
                var Login = Purchases_MasterServices.GetAll().ToList();

                return Ok(new BaseResponse(Login));

            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll_IQ_PurchasesMaster(string startDate, string endDate, int? ID_Supplier, int Type_Debit)
        {
            if (ModelState.IsValid)
            {
                string s = "select * from IQ_Purchases_Master where Tr_Date >='" + startDate + "' and Tr_Date <='" + endDate + "'";

                string condition = "";

                if (ID_Supplier != 0 && ID_Supplier != null)
                    condition = condition + " and ID_Supplier =" + ID_Supplier;

                if (Type_Debit != 2)
                    condition = condition + " and Type_Debit =" + Type_Debit;


                string query = s + condition;
                var res = db.Database.SqlQuery<IQ_Purchases_Master>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll_IQ_Purchases_Details(int TrNo)
        {
            if (ModelState.IsValid)
            {
                string s = "select * from IQ_Purchases_Details where TrNo = " + TrNo + "";

                string query = s;
                var res = db.Database.SqlQuery<IQ_Purchases_Details>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll_IQ_Purchases_DetailsNew(int TrNo)
        {
            if (ModelState.IsValid)
            {
                string s = "select * from IQ_GetPurReceiveItem where ReceiveID = " + TrNo + "";

                string query = s;
                var res = db.Database.SqlQuery<IQ_GetPurReceiveItem>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult IQ_PurchasesItemInfo(int TrNo)
        {
            if (ModelState.IsValid)
            {
                var res = db.IQ_Purchases_Details.Where(x => x.TrNo == TrNo).ToList();

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }


        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdatePurchases_Master(List<Purchases_Master> Purc_Master)
        {

            try
            {

                //loop Insert  I_Pur_TR_ReceiveItems
                foreach (var item in Purc_Master)
                {

                    var updated = Purchases_MasterServices.Update(item);


                }



                return Ok(new BaseResponse("ok"));
            }
            catch (Exception)
            {
                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, "الصنف مستخدم بافعل لا يمكنك تغيره"));
            }

        }




        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert_Purchases([FromBody] PurchasesMasterDetails Operation)
        {

            try
            {
                var TrNo = 0;

                var insertOperationItems = Operation.Purchases_Details.Where(x => x.StatusFlag == 'i').ToList();
                var updatedOperationItems = Operation.Purchases_Details.Where(x => x.StatusFlag == 'u').ToList();
                var deletedOperationItems = Operation.Purchases_Details.Where(x => x.StatusFlag == 'd').ToList();


                if (Operation.Purchases_Master.TrNo != 0)
                {
                    string Tr_Date = Operation.Purchases_Master.Tr_Date;
                    int ID_Supplier = Convert.ToInt16(Operation.Purchases_Master.ID_Supplier);
                    bool Type_Debit = Convert.ToBoolean(Operation.Purchases_Master.Type_Debit);
                    decimal Total_Amount = Convert.ToDecimal(Operation.Purchases_Master.Total_Amount);
                    decimal Paid_Up = Convert.ToDecimal(Operation.Purchases_Master.Paid_Up);
                    decimal To_be_Paid = Convert.ToDecimal(Operation.Purchases_Master.To_be_Paid);
                    string REMARKS = Operation.Purchases_Master.REMARKS;

                    string update_qury = "update_Purchases_Master " + Operation.Purchases_Master.TrNo + " ,'" + Tr_Date + "'," + ID_Supplier + "," + Type_Debit + ", " + Total_Amount + " ," + Paid_Up + "," + To_be_Paid + ",'" + REMARKS + "'";
                    db.Database.ExecuteSqlCommand(update_qury);

                    TrNo = Operation.Purchases_Master.TrNo;

                }


                if (insertOperationItems.Count > 0)
                {

                    if (insertOperationItems[0].TrNo == 0)
                    {
                        string Tr_Date = Operation.Purchases_Master.Tr_Date;
                        int ID_Supplier = Convert.ToInt16(Operation.Purchases_Master.ID_Supplier);
                        bool Type_Debit = Convert.ToBoolean(Operation.Purchases_Master.Type_Debit);
                        decimal Total_Amount = Convert.ToDecimal(Operation.Purchases_Master.Total_Amount);
                        decimal Paid_Up = Convert.ToDecimal(Operation.Purchases_Master.Paid_Up);
                        decimal To_be_Paid = Convert.ToDecimal(Operation.Purchases_Master.To_be_Paid);
                        string REMARKS = Operation.Purchases_Master.REMARKS;

                        string qury = "insert_Purchases_Master  '" + Tr_Date + "'," + ID_Supplier + "," + Type_Debit + ", " + Total_Amount + " ," + Paid_Up + "," + To_be_Paid + ",'" + REMARKS + "'";

                        TrNo = db.Database.SqlQuery<int>(qury).FirstOrDefault();

                        foreach (var item in insertOperationItems)
                        {

                            //db.Processes_Purchases(item.PRODUCT_NAME, Convert.ToInt16(item.Purchases_Quantity), Convert.ToDecimal(item.Purchases_Price), Convert.ToDecimal(item.Sales_Price), Convert.ToDecimal(item.MinUnitPrice), item.Name_CAT, Convert.ToInt16(TrNo), Convert.ToInt16(item.ID), "i");

                            string Pro_qury = "Processes_Purchases  '" + item.PRODUCT_NAME + "'," + Convert.ToInt16(item.Purchases_Quantity) + "," + Convert.ToDecimal(item.Purchases_Price) + ", " + Convert.ToDecimal(item.Sales_Price) + " ," + Convert.ToDecimal(item.MinUnitPrice) + ",'" + item.Name_CAT + "'," + Convert.ToInt16(TrNo) + "," + Convert.ToInt16(item.ID) + "," + Convert.ToInt16(item.ID_familly_Cat) + ",'i'";
                            db.Database.ExecuteSqlCommand(Pro_qury);

                        }
                    }
                    else
                    {
                        //loop insert  I_Pur_TR_ReceiveItems
                        foreach (var item in insertOperationItems)
                        {
                            //db.Processes_Purchases(item.PRODUCT_NAME, Convert.ToInt16(item.Purchases_Quantity), Convert.ToDecimal(item.Purchases_Price), Convert.ToDecimal(item.Sales_Price), Convert.ToDecimal(item.MinUnitPrice), item.Name_CAT, Convert.ToInt16(item.TrNo), Convert.ToInt16(item.ID), "i");

                            string Pro_qury = "Processes_Purchases  '" + item.PRODUCT_NAME + "'," + Convert.ToInt16(item.Purchases_Quantity) + "," + Convert.ToDecimal(item.Purchases_Price) + ", " + Convert.ToDecimal(item.Sales_Price) + " ," + Convert.ToDecimal(item.MinUnitPrice) + ",'" + item.Name_CAT + "'," + Convert.ToInt16(item.TrNo) + "," + Convert.ToInt16(item.ID) + "," + Convert.ToInt16(item.ID_familly_Cat) + ",'i'";
                            db.Database.ExecuteSqlCommand(Pro_qury);
                            TrNo = item.TrNo;
                        }
                    }

                }

                if (updatedOperationItems.Count > 0)
                {



                    //loop Update  I_Pur_TR_ReceiveItems
                    foreach (var item in updatedOperationItems)
                    {
                        //[Processes_Purchases] 'نتاناتاتييع',11,15,10,30,'NEW MOBILES',2,4,'u'
                        //db.Processes_Purchases(item.PRODUCT_NAME, Convert.ToInt16(item.Purchases_Quantity), Convert.ToDecimal(item.Purchases_Price), Convert.ToDecimal(item.Sales_Price), Convert.ToDecimal(item.MinUnitPrice), item.Name_CAT, Convert.ToInt16(item.TrNo), Convert.ToInt16(item.ID), "u");

                        string Pro_qury = "Processes_Purchases  '" + item.PRODUCT_NAME + "'," + Convert.ToInt16(item.Purchases_Quantity) + "," + Convert.ToDecimal(item.Purchases_Price) + ", " + Convert.ToDecimal(item.Sales_Price) + " ," + Convert.ToDecimal(item.MinUnitPrice) + ",'" + item.Name_CAT + "'," + Convert.ToInt16(item.TrNo) + "," + Convert.ToInt16(item.ID) + "," + Convert.ToInt16(item.ID_familly_Cat) + ",'u'";
                        db.Database.ExecuteSqlCommand(Pro_qury);
                        TrNo = item.TrNo;
                    }
                }
                //loop Delete  I_Pur_TR_ReceiveItems
                foreach (var item in deletedOperationItems)
                {
                    //db.Processes_Purchases(item.PRODUCT_NAME, Convert.ToInt16(item.Purchases_Quantity), Convert.ToDecimal(item.Purchases_Price), Convert.ToDecimal(item.Sales_Price), Convert.ToDecimal(item.MinUnitPrice), item.Name_CAT, Convert.ToInt16(item.TrNo), Convert.ToInt16(item.ID), "d");

                    string Pro_qury = "Processes_Purchases  '" + item.PRODUCT_NAME + "'," + Convert.ToInt16(item.Purchases_Quantity) + "," + Convert.ToDecimal(item.Purchases_Price) + ", " + Convert.ToDecimal(item.Sales_Price) + " ," + Convert.ToDecimal(item.MinUnitPrice) + ",'" + item.Name_CAT + "'," + Convert.ToInt16(item.TrNo) + "," + Convert.ToInt16(item.ID) + "," + Convert.ToInt16(item.ID_familly_Cat) + ",'d'";
                    db.Database.ExecuteSqlCommand(Pro_qury);
                    TrNo = item.TrNo;

                }


                return Ok(new BaseResponse(TrNo));

            }
            catch (Exception ex)
            {

                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
            }


        }



        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert_PurchasesNew([FromBody] PurchasesMasterDetails Operation)
        {

            try
            {
                var TrNo = 0;

                var insertOperationItems = Operation.Purchases_Details.Where(x => x.StatusFlag == 'i').ToList();
                var updatedOperationItems = Operation.Purchases_Details.Where(x => x.StatusFlag == 'u').ToList();
                var deletedOperationItems = Operation.Purchases_Details.Where(x => x.StatusFlag == 'd').ToList();


                if (Operation.Purchases_Master.TrNo != 0)
                {
                    string Tr_Date = Operation.Purchases_Master.Tr_Date;
                    int ID_Supplier = Convert.ToInt16(Operation.Purchases_Master.ID_Supplier);
                    bool Type_Debit = Convert.ToBoolean(Operation.Purchases_Master.Type_Debit);
                    decimal Total_Amount = Convert.ToDecimal(Operation.Purchases_Master.Total_Amount);
                    decimal Paid_Up = Convert.ToDecimal(Operation.Purchases_Master.Paid_Up);
                    decimal To_be_Paid = Convert.ToDecimal(Operation.Purchases_Master.To_be_Paid);
                    string REMARKS = Operation.Purchases_Master.REMARKS;

                    string update_qury = "update_Purchases_Master " + Operation.Purchases_Master.TrNo + " ,'" + Tr_Date + "'," + ID_Supplier + "," + Type_Debit + ", " + Total_Amount + " ," + Paid_Up + "," + To_be_Paid + ",'" + REMARKS + "'";
                    db.Database.ExecuteSqlCommand(update_qury);

                    TrNo = Operation.Purchases_Master.TrNo;

                }



                if (TrNo == 0)
                {
                    string Tr_Date = Operation.Purchases_Master.Tr_Date;
                    int ID_Supplier = Convert.ToInt16(Operation.Purchases_Master.ID_Supplier);
                    bool Type_Debit = Convert.ToBoolean(Operation.Purchases_Master.Type_Debit);
                    decimal Total_Amount = Convert.ToDecimal(Operation.Purchases_Master.Total_Amount);
                    decimal Paid_Up = Convert.ToDecimal(Operation.Purchases_Master.Paid_Up);
                    decimal To_be_Paid = Convert.ToDecimal(Operation.Purchases_Master.To_be_Paid);
                    string REMARKS = Operation.Purchases_Master.REMARKS;

                    string qury = "insert_Purchases_Master  '" + Tr_Date + "'," + ID_Supplier + "," + Type_Debit + ", " + Total_Amount + " ," + Paid_Up + "," + To_be_Paid + ",'" + REMARKS + "'";

                    TrNo = db.Database.SqlQuery<int>(qury).FirstOrDefault();

                    foreach (var item in insertOperationItems)
                    {

                        //db.Processes_Purchases(item.PRODUCT_NAME, Convert.ToInt16(item.Purchases_Quantity), Convert.ToDecimal(item.Purchases_Price), Convert.ToDecimal(item.Sales_Price), Convert.ToDecimal(item.MinUnitPrice), item.Name_CAT, Convert.ToInt16(TrNo), Convert.ToInt16(item.ID), "i");

                        string Pro_qury = "Processes_Purchases  '" + item.PRODUCT_NAME + "'," + Convert.ToInt16(item.Purchases_Quantity) + "," + Convert.ToDecimal(item.Purchases_Price) + ", " + Convert.ToDecimal(item.Sales_Price) + " ," + Convert.ToDecimal(item.MinUnitPrice) + ",'" + item.Name_CAT + "'," + Convert.ToInt16(TrNo) + "," + Convert.ToInt16(item.ID) + "," + Convert.ToInt16(item.ID_familly_Cat) + ",'i'";
                        db.Database.ExecuteSqlCommand(Pro_qury);

                    }
                }
                else
                {
                    //loop insert  I_Pur_TR_ReceiveItems
                    foreach (var item in insertOperationItems)
                    {
                        //db.Processes_Purchases(item.PRODUCT_NAME, Convert.ToInt16(item.Purchases_Quantity), Convert.ToDecimal(item.Purchases_Price), Convert.ToDecimal(item.Sales_Price), Convert.ToDecimal(item.MinUnitPrice), item.Name_CAT, Convert.ToInt16(item.TrNo), Convert.ToInt16(item.ID), "i");

                        string Pro_qury = "Processes_Purchases  '" + item.PRODUCT_NAME + "'," + Convert.ToInt16(item.Purchases_Quantity) + "," + Convert.ToDecimal(item.Purchases_Price) + ", " + Convert.ToDecimal(item.Sales_Price) + " ," + Convert.ToDecimal(item.MinUnitPrice) + ",'" + item.Name_CAT + "'," + Convert.ToInt16(item.TrNo) + "," + Convert.ToInt16(item.ID) + "," + Convert.ToInt16(item.ID_familly_Cat) + ",'i'";
                        db.Database.ExecuteSqlCommand(Pro_qury);
                        TrNo = item.TrNo;
                    }
                }



                if (updatedOperationItems.Count > 0)
                {



                    //loop Update  I_Pur_TR_ReceiveItems
                    foreach (var item in updatedOperationItems)
                    {
                        //[Processes_Purchases] 'نتاناتاتييع',11,15,10,30,'NEW MOBILES',2,4,'u'
                        //db.Processes_Purchases(item.PRODUCT_NAME, Convert.ToInt16(item.Purchases_Quantity), Convert.ToDecimal(item.Purchases_Price), Convert.ToDecimal(item.Sales_Price), Convert.ToDecimal(item.MinUnitPrice), item.Name_CAT, Convert.ToInt16(item.TrNo), Convert.ToInt16(item.ID), "u");

                        string Pro_qury = "Processes_Purchases  '" + item.PRODUCT_NAME + "'," + Convert.ToInt16(item.Purchases_Quantity) + "," + Convert.ToDecimal(item.Purchases_Price) + ", " + Convert.ToDecimal(item.Sales_Price) + " ," + Convert.ToDecimal(item.MinUnitPrice) + ",'" + item.Name_CAT + "'," + Convert.ToInt16(item.TrNo) + "," + Convert.ToInt16(item.ID) + "," + Convert.ToInt16(item.ID_familly_Cat) + ",'u'";
                        db.Database.ExecuteSqlCommand(Pro_qury);
                        TrNo = item.TrNo;
                    }
                }
                //loop Delete  I_Pur_TR_ReceiveItems
                foreach (var item in deletedOperationItems)
                {
                    //db.Processes_Purchases(item.PRODUCT_NAME, Convert.ToInt16(item.Purchases_Quantity), Convert.ToDecimal(item.Purchases_Price), Convert.ToDecimal(item.Sales_Price), Convert.ToDecimal(item.MinUnitPrice), item.Name_CAT, Convert.ToInt16(item.TrNo), Convert.ToInt16(item.ID), "d");

                    string Pro_qury = "Processes_Purchases  '" + item.PRODUCT_NAME + "'," + Convert.ToInt16(item.Purchases_Quantity) + "," + Convert.ToDecimal(item.Purchases_Price) + ", " + Convert.ToDecimal(item.Sales_Price) + " ," + Convert.ToDecimal(item.MinUnitPrice) + ",'" + item.Name_CAT + "'," + Convert.ToInt16(item.TrNo) + "," + Convert.ToInt16(item.ID) + "," + Convert.ToInt16(item.ID_familly_Cat) + ",'d'";
                    db.Database.ExecuteSqlCommand(Pro_qury);
                    TrNo = item.TrNo;

                }


                return Ok(new BaseResponse(TrNo));

            }
            catch (Exception ex)
            {

                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
            }


        }


        [HttpPost, AllowAnonymous]//done 
        public IHttpActionResult InsertPurchaseReceiveMasterDetail([FromBody] PurInvoiceMasterDetails obj)
        {

            using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
            {
                try
                {
                    I_Pur_TR_Receive Pur_TR_Invoice = PurTrReceiveService.Insert(obj.I_Pur_TR_Receive);
                    for (int i = 0; i < obj.I_Pur_TR_ReceiveItems.Count; i++)
                    {
                        obj.I_Pur_TR_ReceiveItems[i].ReceiveID = Pur_TR_Invoice.ReceiveID;
                    }
                    for (int i = 0; i < obj.I_Pur_Tr_ReceiveCharges.Count; i++)
                    {
                        obj.I_Pur_Tr_ReceiveCharges[i].ReceiveID = Pur_TR_Invoice.ReceiveID;
                    }
                    PurTRReceiveItemsService.InsertLst(obj.I_Pur_TR_ReceiveItems);
                    PurTRChargesService.InsertLst(obj.I_Pur_Tr_ReceiveCharges);

                    string Update_Purchases_Master = "update [dbo].[Purchases_Master] set ReceiveID = " + Pur_TR_Invoice.ReceiveID + " where TrNo = (select MAX(TrNo) from Purchases_Master)";
                    db.Database.ExecuteSqlCommand(Update_Purchases_Master);

                    ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Pur_TR_Receive.CompCode), Convert.ToInt32(obj.I_Pur_TR_Receive.BranchCode), Pur_TR_Invoice.ReceiveID, "PurInvoice", "Add", db);
                    if (res.ResponseState == true)
                    {
                        obj.I_Pur_TR_Receive.TrNo = int.Parse(res.ResponseData.ToString());
                        dbTransaction.Commit();
                        return Ok(new BaseResponse(obj));
                    }
                    else
                    {
                        dbTransaction.Rollback();
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                    }
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }

        }


        public IHttpActionResult UpdateListPurchaseReceiveMasterDetail([FromBody] PurInvoiceMasterDetails updatedObj)
        {

            using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
            {
                try
                {
                    // update master
                    PurTrReceiveService.Update(updatedObj.I_Pur_TR_Receive);

                    //update I_Pur_Tr_ReceiveCharges 
                    List<I_Pur_Tr_ReceiveCharges> insertedRecordsCharges = updatedObj.I_Pur_Tr_ReceiveCharges.Where(x => x.StatusFlag == 'i').ToList();
                    List<I_Pur_Tr_ReceiveCharges> updatedRecordsCharges = updatedObj.I_Pur_Tr_ReceiveCharges.Where(x => x.StatusFlag == 'u').ToList();
                    List<I_Pur_Tr_ReceiveCharges> deletedRecordsCharges = updatedObj.I_Pur_Tr_ReceiveCharges.Where(x => x.StatusFlag == 'd').ToList();

                    //update I_Pur_TR_ReceiveItems 
                    List<I_Pur_TR_ReceiveItems> insertedRecordsReceiveItems = updatedObj.I_Pur_TR_ReceiveItems.Where(x => x.StatusFlag == 'i').ToList();
                    List<I_Pur_TR_ReceiveItems> updatedRecordsReceiveItems = updatedObj.I_Pur_TR_ReceiveItems.Where(x => x.StatusFlag == 'u').ToList();
                    List<I_Pur_TR_ReceiveItems> deletedRecordsReceiveItems = updatedObj.I_Pur_TR_ReceiveItems.Where(x => x.StatusFlag == 'd').ToList();


                    //loop insered  I_Pur_Tr_ReceiveCharges
                    foreach (I_Pur_Tr_ReceiveCharges item in insertedRecordsCharges)
                    {
                        item.ReceiveID = updatedObj.I_Pur_TR_Receive.ReceiveID;
                        I_Pur_Tr_ReceiveCharges InsertedRec = PurTRChargesService.Insert(item);
                    }

                    //loop Update  I_Pur_Tr_ReceiveCharges
                    foreach (I_Pur_Tr_ReceiveCharges item in updatedRecordsCharges)
                    {
                        item.ReceiveID = updatedObj.I_Pur_TR_Receive.ReceiveID;
                        I_Pur_Tr_ReceiveCharges updatedRec = PurTRChargesService.Update(item);
                    }

                    //loop Delete  I_Pur_Tr_ReceiveCharges
                    foreach (I_Pur_Tr_ReceiveCharges item in deletedRecordsCharges)
                    {
                        int deletedId = item.ReceiveExpensesID;
                        PurTRChargesService.Delete(deletedId);
                    }


                    //loop insered  I_Pur_TR_ReceiveItems
                    foreach (I_Pur_TR_ReceiveItems item in insertedRecordsReceiveItems)
                    {
                        item.ReceiveID = updatedObj.I_Pur_TR_Receive.ReceiveID;
                        I_Pur_TR_ReceiveItems InsertedRec = PurTRReceiveItemsService.Insert(item);
                    }

                    //loop Update  I_Pur_TR_ReceiveItems
                    foreach (I_Pur_TR_ReceiveItems item in updatedRecordsReceiveItems)
                    {
                        item.ReceiveID = updatedObj.I_Pur_TR_Receive.ReceiveID;

                        int? itemID = item.ItemID;
                        decimal? RecQty = item.RecQty;
                        if (RecQty < 0)
                        {
                            RecQty = RecQty * -1;
                            db.Database.ExecuteSqlCommand("update I_Pur_Tr_PurchaseOrderDetail set TotRecQty = TotRecQty - " + RecQty + " where PurOrderID = " + updatedObj.I_Pur_TR_Receive.PurOrderID + "and ItemID = " + itemID + " ");

                        }
                        else
                        {

                            db.Database.ExecuteSqlCommand("update I_Pur_Tr_PurchaseOrderDetail set TotRecQty = TotRecQty + " + RecQty + " where PurOrderID = " + updatedObj.I_Pur_TR_Receive.PurOrderID + "and ItemID = " + itemID + " ");



                        }

                        item.RecQty = item.RecStockQty;
                        I_Pur_TR_ReceiveItems updatedRec = PurTRReceiveItemsService.Update(item);



                    }

                    //loop Delete  I_Pur_TR_ReceiveItems
                    foreach (I_Pur_TR_ReceiveItems item in deletedRecordsReceiveItems)
                    {
                        int deletedId = item.ReciveDetailsID;
                        PurTRReceiveItemsService.Delete(deletedId);
                    }




                    //if (updatedObj.I_Pur_TR_Receive.PurOrderID != null && updatedObj.I_Pur_TR_Receive.PurOrderID != 0)
                    // {

                    //   foreach (var item in updatedObj.I_Pur_TR_ReceiveItems)
                    //  {

                    //if (updatedObj.I_Pur_TR_ReceiveItems[0].RecQty > item.RecQty)
                    //{
                    //    int? itemID = item.ItemID;
                    //    decimal? RecQty = updatedObj.I_Pur_TR_ReceiveItems[0].RecQty - item.RecQty;
                    //    db.Database.ExecuteSqlCommand("update I_Pur_Tr_PurchaseOrderDetail set TotRecQty = TotRecQty - " + RecQty + " where PurOrderID = " + updatedObj.I_Pur_TR_Receive.PurOrderID + "and ItemID = " + itemID + " ");
                    //}
                    //else
                    //{
                    //    int? itemID = item.ItemID;
                    //    decimal? RecQty = updatedObj.I_Pur_TR_ReceiveItems[0].RecQty;
                    //    db.Database.ExecuteSqlCommand("update I_Pur_Tr_PurchaseOrderDetail set TotRecQty = TotRecQty + " + RecQty + " where PurOrderID = " + updatedObj.I_Pur_TR_Receive.PurOrderID + "and ItemID = " + itemID + " ");

                    //}
                    //   }
                    //   }






                    ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(updatedObj.I_Pur_TR_Receive.CompCode), Convert.ToInt32(updatedObj.I_Pur_TR_Receive.BranchCode), updatedObj.I_Pur_TR_Receive.ReceiveID, "PurInvoice", "Update", db);
                    if (res.ResponseState == true)
                    {
                        updatedObj.I_Pur_TR_Receive.TrNo = int.Parse(res.ResponseData.ToString());
                        dbTransaction.Commit();
                        return Ok(new BaseResponse(updatedObj));
                    }
                    else
                    {
                        dbTransaction.Rollback();
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                    }

                }
                catch (Exception ex)
                {
                    dbTransaction.Rollback();
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }

        }

    }
}
