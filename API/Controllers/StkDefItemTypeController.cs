using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.StkDefItemType;
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Inv.API.Controllers;

namespace Inv.API.Controllers
{
    public class StkDefItemTypeController : BaseController
    {
        private readonly IStkDefItemTypeService StkDefItemTypeService;
        private readonly G_USERSController UserControl;

        public partial class I_ItemFamily_New
        {
            public int ItemFamilyID { get; set; }
            public string DescA { get; set; }
            public string DescL { get; set; }
            public Nullable<int> CatID { get; set; }

        }


        public partial class IQ_GetItemStoreInfo_New
        {


            public int ItemID { get; set; }
            public string Itm_DescA { get; set; }
            public string Itm_DescE { get; set; }
            public Nullable<decimal> UnitPrice { get; set; }
            public int ItemFamilyID { get; set; }
            public int StoreId { get; set; }
            public Nullable<decimal> MinUnitPrice { get; set; }
            public Nullable<decimal> OnhandQty { get; set; }
            public int UomID { get; set; }





        }

        public StkDefItemTypeController(IStkDefItemTypeService _StkDefItemTypeService, G_USERSController _Control)
        {
            this.StkDefItemTypeService = _StkDefItemTypeService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, string UserCode, string Token)
        {
          
                var ItemFamilyList = StkDefItemTypeService.GetAll(x => x.CompCode == CompCode).ToList();

                return Ok(new BaseResponse(ItemFamilyList));
           
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllNew(int CompCode)
        {
             
            string SQL = "Select  * from I_ItemFamily  where CompCode= " + CompCode + "";
            var ItemFamilyList = db.Database.SqlQuery<I_ItemFamily>(SQL).ToList();

            return Ok(new BaseResponse(ItemFamilyList));

        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllOrdered(int CompCode, string UserCode, string Token)
        {
            try
            {

                if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
                {
                    string SQL = "Select  ItemFamilyID, DescA, DescL,CatID  from I_ItemFamily  where CompCode= " + CompCode + " order by catid, FamilyCode";
                    var ItemFamilyList = db.Database.SqlQuery<I_ItemFamily_New>(SQL).ToList();

                    return Ok(new BaseResponse(ItemFamilyList));
                }
                return BadRequest(ModelState);
            }
            catch (Exception ex)
            {

                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
            }
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetItemByFamilyIdOrdered(int CompCode, int BranchCode, int FinYear, int familyid, int storeid, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string SQL = "Select ItemID,  Itm_DescA, Itm_DescE, UnitPrice, OnhandQty, MinUnitPrice,UomID from   IQ_GetItemStoreInfo  where OnhandQty>0 and ItemFamilyID= " + familyid + " and StoreId = " + storeid + " and   CompCode = " + CompCode + " and BraCode = " + BranchCode + " order by ItemCode";
                var GetItemStore = db.Database.SqlQuery<IQ_GetItemStoreInfo_New>(SQL).ToList();

                return Ok(new BaseResponse(GetItemStore));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetItemBycodeIdOrdered(int CompCode, int BranchCode , int FinYear , int storeid, string UserCode, string Token)
        {
                    
                string SQL = "Select ItemID,  Itm_DescA, Itm_DescE, UnitPrice, OnhandQty, MinUnitPrice,UomID from   IQ_GetItemStoreInfo  where OnhandQty>0  and StoreId = " + storeid + " and   CompCode = " + CompCode + " and BraCode = "+ BranchCode + " order by ItemCode";
                var GetItemStore = db.Database.SqlQuery<IQ_GetItemStoreInfo_New>(SQL).ToList();

                return Ok(new BaseResponse(GetItemStore));
     
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetItemByCode(int CompCode, int FinYear, string ItemCode, int? ItemID, int storeid, int Mode, string UserCode, string Token)
        {
            string Itemid = ItemID == 0 ? "null" : ItemID.ToString(); 
            string SQL = "Iproc_GetItemInfo " + CompCode + "," + FinYear + ",'" + ItemCode + "'," + Itemid + "," + storeid + "," + Mode + "";
            var GetItemStore = db.Database.SqlQuery<Iproc_GetItemInfo_Result>(SQL).ToList();

            return Ok(new BaseResponse(GetItemStore));
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllItemOrdered(int CompCode, int BranchCode, int FinYear, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string SQL = "Select ItemID,  Itm_DescA, Itm_DescE, UnitPrice, OnhandQty, MinUnitPrice ,ItemFamilyID,StoreId,UomID from   IQ_GetItemStoreInfo  where OnhandQty>0  and  CompCode = " + CompCode + " and BraCode = " + BranchCode + " order by ItemCode";
                var GetItemStore = db.Database.SqlQuery<IQ_GetItemStoreInfo_New>(SQL).ToList();

                return Ok(new BaseResponse(GetItemStore));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetByCategory(int CompCode, int CatID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var ItemFamilyList = StkDefItemTypeService.GetAll(x => x.CompCode == CompCode && x.CatID == CatID).ToList();

                return Ok(new BaseResponse(ItemFamilyList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var ItemFamily = StkDefItemTypeService.GetById(id);

                return Ok(new BaseResponse(ItemFamily));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Updatelist(List<I_ItemFamily> itemFamilyList)
        {

            if (ModelState.IsValid && UserControl.CheckUser(itemFamilyList[0].Token, itemFamilyList[0].UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        Boolean AllSuccess = true;
                        var insertedRecords = itemFamilyList.FindAll(x => x.StatusFlag == 'i');
                        var updatedRecords = itemFamilyList.FindAll(x => x.StatusFlag == 'u');
                        var deletedRecords = itemFamilyList.FindAll(x => x.StatusFlag == 'd');
                        ResponseResult res = new ResponseResult();
                        //loop insered 
                        foreach (var item in insertedRecords)
                        {
                            item.CreatedAt = DateTime.Now;
                            var InsertedRec = StkDefItemTypeService.Insert(item);
                            int br = 1; // item has no branch 
                            res = Shared.TransactionProcess(Convert.ToInt32(InsertedRec.CompCode), br, InsertedRec.ItemFamilyID, "ItemFamily", "ADD", db);
                            if (res.ResponseState == false)
                            {
                                AllSuccess = false;
                                break;
                            }

                        }

                        //loop Update 
                        foreach (var item in updatedRecords)
                        {
                            item.UpdatedAt = DateTime.Now;
                            var updatedRec = StkDefItemTypeService.Update(item);
                            int br = 1; // item has no branch 
                            res = Shared.TransactionProcess(Convert.ToInt32(updatedRec.CompCode), br, updatedRec.ItemFamilyID, "ItemFamily", "Update", db);
                            if (res.ResponseState == false)
                            {
                                AllSuccess = false;
                                break;
                            }

                        }

                        //loop Delete 
                        foreach (var item in deletedRecords)
                        {

                            int deletedId = item.ItemFamilyID;
                            int DeletedComp = Convert.ToInt32(item.CompCode);
                            StkDefItemTypeService.Delete(item.ItemFamilyID);
                            int br = 1; // item has no branch 
                            res = Shared.TransactionProcess(DeletedComp, br, deletedId, "ItemFamily", "Delete", db);
                            if (res.ResponseState == false)
                            {
                                AllSuccess = false;
                                break;
                            }

                        }

                        // if all success commit 
                        if (AllSuccess)
                        {
                            dbTransaction.Commit();
                            // Return in case if the db generate transaction number   res.ResponseData
                            return Ok(new BaseResponse(100));
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
            return BadRequest(ModelState);
        }
        //public IHttpActionResult Updatelist2(List<I_ItemFamily> itemFamilyList)
        //{

        //    if (ModelState.IsValid && UserControl.CheckUser(itemFamilyList[0].Token, itemFamilyList[0].UserCode))
        //    {
        //        using (var dbTransaction = db.Database.BeginTransaction())
        //        {
        //            try
        //            {
        //                var insertedRecords = itemFamilyList.Where(x => x.StatusFlag == 'i');
        //                var updatedRecords = itemFamilyList.Where(x => x.StatusFlag == 'u');
        //                var deletedRecords = itemFamilyList.Where(x => x.StatusFlag == 'd');
        //                ResponseResult res = new ResponseResult();
        //                //loop insered 
        //                foreach (var item in insertedRecords)
        //                {
        //                    var InsertedRec = StkDefItemTypeService.Insert(item);
        //                    int br = 1; // item has no branch 
        //                    res = Shared.TransactionProcess(Convert.ToInt32(InsertedRec.CompCode), br, InsertedRec.ItemFamilyID, "ItemFamily", db);
        //                    //if (res.ResponseState == false)
        //                    //{
        //                    //      break;
        //                    //}
        //                    //////////////
        //                    if (res.ResponseState == true)
        //                    {
        //                        dbTransaction.Commit();

        //                        return Ok(new BaseResponse(InsertedRec));
        //                    }
        //                    else
        //                    {
        //                        dbTransaction.Rollback();
        //                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
        //                    }
        //                    //////
        //                }
        //                // end loop inserted 

        //                //loop Update 
        //                foreach (var item in updatedRecords)
        //                {
        //                    var updatedRec = StkDefItemTypeService.Update(item);
        //                    int br = 1; // item has no branch 
        //                    res = Shared.TransactionProcess(Convert.ToInt32(updatedRec.CompCode), br, updatedRec.ItemFamilyID, "ItemFamily", db);
        //                    //if (res.ResponseState == false)
        //                    //{
        //                    //    break;
        //                    //}
        //                    //////////////
        //                    if (res.ResponseState == true)
        //                    {
        //                        dbTransaction.Commit();

        //                        return Ok(new BaseResponse(updatedRec));
        //                    }
        //                    else
        //                    {
        //                        dbTransaction.Rollback();
        //                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
        //                    }
        //                    //////
        //                }
        //                // end loop update 

        //                //loop Delete 
        //                foreach (var item in deletedRecords)
        //                {
        //                    //  var DeletedRec =
        //                    int deletedId = item.ItemFamilyID;
        //                    int DeletedComp = Convert.ToInt32(item.CompCode);
        //                    StkDefItemTypeService.Delete(item.ItemFamilyID);
        //                    int br = 1; // item has no branch 
        //                    res = Shared.TransactionProcess(DeletedComp, br, deletedId, "ItemFamily", db);
        //                    //if (res.ResponseState == true)
        //                    //{
        //                    //    dbTransaction.Commit();

        //                    //    return Ok(new BaseResponse(DeletedRec));
        //                    //}
        //                    //else
        //                    //{
        //                    //    dbTransaction.Rollback();
        //                    //    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
        //                    //}
        //                    //////
        //                }
        //                // end loop delete 

        //                //if (res.ResponseState == true)
        //                //{
        //                //    dbTransaction.Commit();

        //                //    return Ok(new BaseResponse(InsertedRec));
        //                //}
        //                //else
        //                //{
        //                //    dbTransaction.Rollback();
        //                //    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
        //                //}


        //            }
        //            catch (Exception ex)
        //            {
        //                dbTransaction.Rollback();
        //                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
        //            }
        //        }
        //    }
        //    return BadRequest(ModelState);
        //}
        //[HttpGet, AllowAnonymous]
        //public IHttpActionResult srePopup(int CompCode, int BranchCode, int catId, int ItemFamilyID, string ItemCode, string Itm_DescA, string UserCode, string Token)
        //{
        //    if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
        //    {
        //        var catID = "";
        //        var ItemFamily = "";
        //        var ItemCod = "";
        //        var Itm_Desc = "";

        //        if (ItemFamilyID > 0)
        //        {
        //            ItemFamily = "ItemFamilyID = " + ItemFamilyID + " and ";
        //        }
        //        else
        //        {
        //            ItemFamily = "";
        //        }
        //        if (catId > 0)
        //        {
        //            catID = "catId = "+ catId + " and ";
        //        }
        //        else
        //        {
        //            catID = "";
        //        }
        //        if (ItemCode != "-1")
        //        {
        //             ItemCod = " ItemCode like '%" + ItemCode + "%' and ";
        //        }
        //        else
        //        {
        //            ItemCod = "";
        //        }
        //        if (Itm_DescA != "-1")
        //        {
        //             Itm_Desc = " Itm_DescA like '%" + Itm_DescA + "%' and";
        //        }
        //        else
        //        {
        //            Itm_Desc = "";
        //        }
        //        string SQL = "Select * from   IQ_GetItemStoreInfo  where  " + ItemFamily + catID + ItemCod + Itm_Desc + " CompCode =" + CompCode + "  and BraCode = " + BranchCode + "";
        //        var GetItemStore = db.Database.SqlQuery<IQ_GetItemStoreInfo>(SQL).ToList();

        //        return Ok(new BaseResponse(GetItemStore));
        //    }
        //    return BadRequest(ModelState);
        //}
    }
}
