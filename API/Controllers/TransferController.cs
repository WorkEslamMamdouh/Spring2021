using API.Models;
using Inv.BLL.Services.Transfer;
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
using Inv.API.Models;
using API.Models.CustomModel;
using Inv.API.Models.CustomModel;

namespace API.Controllers
{
    [EnableCorsAttribute("*", "*", "*")]
    public class TransferController : BaseController
    {

        private readonly ITransferServices TransferServices; 

        public TransferController(ITransferServices _ITransferServices)
        {
            TransferServices = _ITransferServices; 

        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode ,int TrType , int TFType, string fromdate, string todate ,int IsPosted)
        {
            if (ModelState.IsValid)
            {
                var Query = "SELECT * FROM[dbo].[I_Stk_TR_Transfer]  where TrType = "+ TrType + " and TFType = " + TFType + " and TrDate >= '" + fromdate + "' and TrDate <= '"+ todate + "' ";
                var Cust = db.Database.SqlQuery<I_Stk_TR_Transfer>(Query).ToList();

                return Ok(new BaseResponse(Cust)); 
            }
            return BadRequest(ModelState);
        }
         [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAlltransview(int CompCode ,int TrType , int TFType, string fromdate, string todate ,int IsPosted)
        { 
                var con = "";
                if (IsPosted != 2)
                {
                    con = "and IsPosted = " + IsPosted + "";
                }
                var Query = "SELECT * FROM[dbo].[IQ_GetTransfer]  where TrType = 1 and TFType = 1 and TrDate >= '" + fromdate + "' and TrDate <= '"+ todate + ""+con+"' ";
                var Cust = db.Database.SqlQuery<IQ_GetTransfer>(Query).ToList();

                return Ok(new BaseResponse(Cust)); 
            
        } 
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAlldetail(int TransfareID)
        {  
                var Query = "SELECT * FROM[dbo].[IQ_GetTransferDetail]  where TransfareID = "+ TransfareID + "";
                var Cust = db.Database.SqlQuery<IQ_GetTransferDetail>(Query).ToList();

                return Ok(new BaseResponse(Cust)); 
            
        }
          [HttpGet, AllowAnonymous]
        public IHttpActionResult UpdateIsReceipt (int TransfareID, int IsReceived , string usercode,int CompCode ,int BranchCode)
        {

            using (var dbTransaction = db.Database.BeginTransaction())
            {
                var Query = "UPDATE [dbo].[I_Stk_TR_Transfer] SET IsReceived = " + IsReceived + " , ReceivedBy = '" + usercode + "'  WHERE TransfareID = " + TransfareID + "";
                db.Database.ExecuteSqlCommand(Query);

                ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(CompCode), Convert.ToInt32(BranchCode),  TransfareID, "RecvTransqty", "Add", db);
                if (res.ResponseState == true)
                { 
                    dbTransaction.Commit();
                    return Ok(new BaseResponse(100));
                }
                else
                {
                    dbTransaction.Rollback();
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                }

            }

            return Ok(new BaseResponse(100)); 
           
        }
        
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetDetail(int TransferID)
        {
            if (ModelState.IsValid)
            {
                var Query = "SELECT * FROM[dbo].[IQ_GetTransferDetail]  where TransfareID = " + TransferID + "";
                var Cust = db.Database.SqlQuery<IQ_GetTransferDetail>(Query).ToList();

                return Ok(new BaseResponse(Cust)); 
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetFiltered(int? CreditType, string BalType)
        {

            string s = "select * from I_Stk_TR_Transfer ";
            string condition = "";

            if (CreditType != null && BalType != "All")
            {
                condition = condition + " where IsCreditI_Stk_TR_Transfer =" + CreditType;

                if (BalType == ">")
                {
                    condition = condition + " where  Debit > 0 ";
                }

            }


            else if (CreditType != null)
                condition = condition + " where  IsCreditI_Stk_TR_Transfer =" + CreditType;

            else if (BalType != "All")
            {
                if (BalType == ">")
                {
                    condition = condition + " where  Debit > 0 ";
                } 

            }

            string query = s + condition;
            var res = db.Database.SqlQuery<I_Stk_TR_Transfer>(query).ToList();
            return Ok(new BaseResponse(res));


        }


          [HttpGet, AllowAnonymous]
        public IHttpActionResult GetI_Item_I_Stk_TR_TransferByID(int I_Stk_TR_Transfer_ID)
        {

            string s = "select * from [dbo].[I_Item_I_Stk_TR_Transfer] where [I_Stk_TR_Transfer_ID]  = "+ I_Stk_TR_Transfer_ID + " ";
           
            string query = s ;
            var res = db.Database.SqlQuery<I_Stk_TR_Transfer>(query).ToList();
            return Ok(new BaseResponse(res));


        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateDirectTransferDetail([FromBody] DirectTransferMasterDetails obj)
        {
             
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var jouranalHeader = TransferServices.Update(obj.I_Stk_TR_Transfer);

                        //update Details
                        var insertedObjects = obj.I_Stk_TR_TransferDetails.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedObjects = obj.I_Stk_TR_TransferDetails.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedObjects = obj.I_Stk_TR_TransferDetails.Where(x => x.StatusFlag == 'd').ToList();

                        foreach (var item in insertedObjects)
                        {
                            item.TransfareID = obj.I_Stk_TR_Transfer.TransfareID;
                        TransferServices.InsertDetail(item);
                        }
                        foreach (var item in updatedObjects)
                        {
                            item.TransfareID = obj.I_Stk_TR_Transfer.TransfareID;
                        TransferServices.UpdateDetail(item);
                        }
                        foreach (var item in deletedObjects)
                        {
                            TransferServices.Delete(item.TransfareDetailID);
                        }

                        //// call process trans 
                        if (obj.I_Stk_TR_Transfer.TrType == 0 && obj.I_Stk_TR_Transfer.TFType == 1)
                        {

                            ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Stk_TR_Transfer.CompCode), Convert.ToInt32(obj.I_Stk_TR_Transfer.BranchCode), jouranalHeader.TransfareID, "DirctTrans", "Update", db);
                            if (res.ResponseState == true)
                            {
                                dbTransaction.Commit();
                                return Ok(new BaseResponse(obj.I_Stk_TR_Transfer));
                            }
                            else
                            {
                                dbTransaction.Rollback();
                                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                            }
                        }
                        else if (obj.I_Stk_TR_Transfer.TrType == 1 && obj.I_Stk_TR_Transfer.TFType == 1)
                        {

                            ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Stk_TR_Transfer.CompCode), Convert.ToInt32(obj.I_Stk_TR_Transfer.BranchCode), jouranalHeader.TransfareID, "sendTrans", "Update", db);
                            if (res.ResponseState == true)
                            {
                                dbTransaction.Commit();
                                return Ok(new BaseResponse(obj.I_Stk_TR_Transfer));
                            }
                            else
                            {
                                dbTransaction.Rollback();
                                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                            }
                        }
                        else if (obj.I_Stk_TR_Transfer.TrType == 1 && obj.I_Stk_TR_Transfer.TFType == 2)
                        {

                            ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Stk_TR_Transfer.CompCode), Convert.ToInt32(obj.I_Stk_TR_Transfer.BranchCode), jouranalHeader.TransfareID, "RecvTrans", "Update", db);
                            if (res.ResponseState == true)
                            {
                                dbTransaction.Commit();
                                return Ok(new BaseResponse(obj.I_Stk_TR_Transfer));
                            }
                            else
                            {
                                dbTransaction.Rollback();
                                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            return Ok(new BaseResponse(100));
        }
       
        [HttpPost, AllowAnonymous]
        public IHttpActionResult InsertDirectTransferMasterDetail([FromBody] DirectTransferMasterDetails obj)
        {

            using (var dbTransaction = db.Database.BeginTransaction())
            {
                
                    var TransferHeader = TransferServices.Insert(obj.I_Stk_TR_Transfer);

                //update Details
                var insertedObjects = obj.I_Stk_TR_TransferDetails.Where(x => x.StatusFlag == 'i').ToList();
                var updatedObjects = obj.I_Stk_TR_TransferDetails.Where(x => x.StatusFlag == 'u').ToList();
                var deletedObjects = obj.I_Stk_TR_TransferDetails.Where(x => x.StatusFlag == 'd').ToList();

                foreach (var item in insertedObjects)
                {
                    item.TransfareID = obj.I_Stk_TR_Transfer.TransfareID;
                    TransferServices.InsertDetail(item);
                }
                foreach (var item in updatedObjects)
                {
                    item.TransfareID = obj.I_Stk_TR_Transfer.TransfareID;
                    TransferServices.UpdateDetail(item);
                }
                foreach (var item in deletedObjects)
                {
                    TransferServices.Delete(item.TransfareDetailID);
                } 
                    if (obj.I_Stk_TR_Transfer.TrType == 0 && obj.I_Stk_TR_Transfer.TFType == 1)
                    {
                        //// call process trans 

                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Stk_TR_Transfer.CompCode), Convert.ToInt32(obj.I_Stk_TR_Transfer.BranchCode), TransferHeader.TransfareID, "DirctTrans", "Add", db);
                        if (res.ResponseState == true)
                        {
                            obj.I_Stk_TR_Transfer.Tr_No = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();
                            return Ok(new BaseResponse(obj.I_Stk_TR_Transfer));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                        ////////
                    }
                    else if (obj.I_Stk_TR_Transfer.TrType == 1 && obj.I_Stk_TR_Transfer.TFType == 1)
                    {
                        //// call process trans 

                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Stk_TR_Transfer.CompCode), Convert.ToInt32(obj.I_Stk_TR_Transfer.BranchCode), TransferHeader.TransfareID, "sendTrans", "Add", db);
                        if (res.ResponseState == true)
                        {
                            obj.I_Stk_TR_Transfer.Tr_No = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();
                            return Ok(new BaseResponse(obj.I_Stk_TR_Transfer));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }

                    }
                    else if (obj.I_Stk_TR_Transfer.TrType == 2 && obj.I_Stk_TR_Transfer.TFType == 2)
                    {
                        //// call process trans 

                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Stk_TR_Transfer.CompCode), Convert.ToInt32(obj.I_Stk_TR_Transfer.BranchCode), TransferHeader.TransfareID, "RecvTrans", "Add", db);
                        if (res.ResponseState == true)
                        {
                            obj.I_Stk_TR_Transfer.Tr_No = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();
                            return Ok(new BaseResponse(obj.I_Stk_TR_Transfer));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                        ////////
                    }
                return Ok(new BaseResponse(100));

            }
        }
        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]I_Stk_TR_Transfer Nation)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var Nationality = TransferServices.Insert(Nation);
                    return Ok(new BaseResponse(Nationality));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            return BadRequest(ModelState);
        } 
       

       [HttpGet, AllowAnonymous] 
        public IHttpActionResult Delete(int ID)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    TransferServices.Delete(ID);
                    return Ok(new BaseResponse());
                }
                catch (Exception)
                {
                    return Ok(new BaseResponse(0, "Error"));
                }

            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        [HttpPost, AllowAnonymous]
        public IHttpActionResult Update([FromBody]I_Stk_TR_Transfer Nation)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var Nationality = TransferServices.Update(Nation);
                    return Ok(new BaseResponse(Nationality));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            return BadRequest(ModelState);
        }



        //***************asmaa********************//
        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateCustlist([FromBody]I_Stk_TR_TransferMasterDetails I_Stk_TR_TransferList)
        {



            try
            {
                I_Stk_TR_Transfer I_Stk_TR_TransferListNew;
                int I_Stk_TR_Transfer_ID = 0;

                var insertedRecords = I_Stk_TR_TransferList.I_Stk_TR_Transfer.Where(x => x.StatusFlag == 'i').ToList();
                var updatedRecords = I_Stk_TR_TransferList.I_Stk_TR_Transfer.Where(x => x.StatusFlag == 'u').ToList();
                var deletedRecords = I_Stk_TR_TransferList.I_Stk_TR_Transfer.Where(x => x.StatusFlag == 'd').ToList();
                ResponseResult res = new ResponseResult();
                //loop insered 
                if (insertedRecords.Count > 0)
                {
                    foreach (var item in insertedRecords)
                    {

                      
                        //string quer = "insert_Outlet 'رصيد للعميل "+ item.I_Stk_TR_Transfer_NAME+ "', " + item.Openbalance + ", '" + item.UserCode + "', 'رصيد عميل'";
                        //var Outlet = db.Database.SqlQuery<decimal>(quer);
                        //var InsertedRec = TransferServices.Insert(item);
                        //I_Stk_TR_TransferListNew = InsertedRec;
                        //I_Stk_TR_Transfer_ID = I_Stk_TR_TransferListNew.I_Stk_TR_Transfer_ID;
                        //return Ok(new BaseResponse(InsertedRec.I_Stk_TR_Transfer_ID));
                    }

                }


                //loop Update 
                if (updatedRecords.Count > 0)
                {
                    foreach (var item in updatedRecords)
                    {
                        var updatedRec = TransferServices.Update(item);
                        I_Stk_TR_TransferListNew = updatedRec;
                        //I_Stk_TR_Transfer_ID = I_Stk_TR_TransferListNew.I_Stk_TR_Transfer_ID;
                        //return Ok(new BaseResponse(updatedRec.I_Stk_TR_Transfer_ID));
                    }

                }


                //var insertedRecordsItem = I_Stk_TR_TransferList.I_Item_I_Stk_TR_Transfer.Where(x => x.StatusFlag == 'i').ToList();
                //var updatedRecordsItem = I_Stk_TR_TransferList.I_Item_I_Stk_TR_Transfer.Where(x => x.StatusFlag == 'u').ToList();
                //var deletedRecordsItem = I_Stk_TR_TransferList.I_Item_I_Stk_TR_Transfer.Where(x => x.StatusFlag == 'd').ToList();




                //loop insered  
                //foreach (var item in insertedRecordsItem)
                //{
                //    item.I_Stk_TR_Transfer_ID = I_Stk_TR_Transfer_ID;
                //    var InsertedRec = I_Item_CustService.Insert(item);
                //}

                ////loop Update  
                //foreach (var item in updatedRecordsItem)
                //{ 
                //    item.I_Stk_TR_Transfer_ID = I_Stk_TR_Transfer_ID;
                //    var updatedRec = I_Item_CustService.Update(item);
                //}

                ////loop Delete  
                //foreach (var item in deletedRecordsItem)
                //{
                //    int deletedId = item.Id;
                //    item.I_Stk_TR_Transfer_ID = I_Stk_TR_Transfer_ID;
                //    I_Item_CustService.Delete(deletedId);
                //}



                return Ok(new BaseResponse(I_Stk_TR_Transfer_ID));

                //var ID_I_Stk_TR_Transfer = TransferServices.GetAll(x => x.PHONE == I_Stk_TR_TransferList[0].PHONE).ToList();

                //return Ok(new BaseResponse(ID_I_Stk_TR_Transfer[0].I_Stk_TR_Transfer_ID));

            }
            catch (Exception ex)
            {
                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
            }


            return BadRequest(ModelState);
        }



        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll_IQ_Catch_Receipt(string startDate, string endDate, int? I_Stk_TR_TransferId)
        {
            if (ModelState.IsValid)
            {
                string s = "select * from IQ_Catch_Receipt where [Data] >='" + startDate + "' and [Data] <='" + endDate + "'";

                string condition = "";

                if (I_Stk_TR_TransferId != 0 && I_Stk_TR_TransferId != null)
                    condition = condition + " and I_Stk_TR_Transfer_ID =" + I_Stk_TR_TransferId;
                


                string query = s + condition;
                var res = db.Database.SqlQuery<IQ_Catch_Receipt>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult Insert(int I_Stk_TR_Transfer_ID ,string USER_CODE ,int ID_ORDER_Delivery, decimal AmountRequired ,decimal Amount ,decimal ShootMoney ,string Remarks , string Data, int CompCode, int BranchCode, int InvoiceID)
        {
            
                try
                {
                    string query = "insert into [dbo].[Catch_Receipt] values("+ I_Stk_TR_Transfer_ID+ ",'"+USER_CODE+ "',"+ ID_ORDER_Delivery+ ","+AmountRequired+ "," +Amount + "," +ShootMoney + ",'" +Remarks + "','" + Data + "'," + BranchCode + "," + CompCode + "," + InvoiceID + ")";
                     
                    db.Database.ExecuteSqlCommand(query);


                string updateDebit = "updateDebit  " + I_Stk_TR_Transfer_ID + ","+ ShootMoney + ",'" + USER_CODE + "'";

                db.Database.ExecuteSqlCommand(updateDebit);



                string Receipt = "select max(ID_Receipt) from [dbo].[Catch_Receipt] where BranchCode = "+ BranchCode + " and CompCode = "+ CompCode + " ";

                    int ID_Receipt = db.Database.SqlQuery<int>(Receipt).FirstOrDefault();
                      
                    return Ok(new BaseResponse(ID_Receipt));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
           
        }


    }
}
