using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.StkDefStore;
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
    public class StkDefStoreController : BaseController
    {
        private readonly IStkDefStoreService StkDefStoreService;
        private readonly G_USERSController UserControl;

        public StkDefStoreController(IStkDefStoreService _IStkDefStoreService, G_USERSController _Control)
        {
            this.StkDefStoreService = _IStkDefStoreService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, int BranchCode ,string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefCustomerList = StkDefStoreService.GetAll(x => x.COMP_CODE == CompCode && x.BRA_CODE == BranchCode).ToList();

                return Ok(new BaseResponse(AccDefCustomerList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefCustomer = StkDefStoreService.GetById(id);

                return Ok(new BaseResponse(AccDefCustomer));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody] G_STORE AccTrReceipt)
        {
            //if (ModelState.IsValid && UserControl.CheckUser(AccTrReceipt.Token, AccTrReceipt.UserCode))
            //{
            var res = StkDefStoreService.Insert(AccTrReceipt);
            return Ok(new BaseResponse(res.StoreId));

            //}
            //return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Update([FromBody] G_STORE AccTrReceipt)
        {
            //if (ModelState.IsValid && UserControl.CheckUser(AccTrReceipt.Token, AccTrReceipt.UserCode))
            //{
            var res = StkDefStoreService.Update(AccTrReceipt);
            return Ok(new BaseResponse(res.StoreId));

            //}
            //return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetItemstore(int CompCode ,string TypeStock, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
               
                var ItemStockList = db.IQ_GetItemStore.Where(x=>x.CompCode == CompCode && x.LOCATION2 == TypeStock && x.StoreCode == 1 && x.OnhandQty > 0).ToList();

                return Ok(new BaseResponse(ItemStockList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult sendqty (int itemid , int QTY)
        {
            var Query = "update i set i.onhandQty = i.onhandQty + " + QTY + "  from i_itemstore as s inner join i_itemstore as i on s.ItemID = " + itemid + " and i.ItemID = " + itemid + " and s.StoreCode = 1 and i.bracode = s.bracode and s.CompCode = i.CompCode where s.LOCATION2 = '1' and i.LOCATION2 = '2'" +
                        "update s set s.OnhandQty = s.OnhandQty - " + QTY + "  from i_itemstore as s inner join i_itemstore as i on s.ItemID = " + itemid + " and i.ItemID = " + itemid + " and s.StoreCode = 1 and i.bracode = s.bracode and s.CompCode = i.CompCode where s.LOCATION2 = '1' and i.LOCATION2 = '2'";

            db.Database.ExecuteSqlCommand(Query);
            return Ok(new BaseResponse(100));
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult sendqtyfromfull(int itemid , int QTY , string location)
        {
            var Query = "update i set i.onhandQty = i.onhandQty + " + QTY + "  from i_itemstore as s inner join i_itemstore as i on s.ItemID = " + itemid + " and i.ItemID = " + itemid + " and s.StoreCode = 1 and i.bracode = s.bracode and s.CompCode = i.CompCode where s.LOCATION2 = '3' and i.LOCATION2 = '"+location+"'" +
                        "update s set s.OnhandQty = s.OnhandQty - " + QTY + "  from i_itemstore as s inner join i_itemstore as i on s.ItemID = " + itemid + " and i.ItemID = " + itemid + " and s.StoreCode = 1 and i.bracode = s.bracode and s.CompCode = i.CompCode where s.LOCATION2 = '3' and i.LOCATION2 = '" + location + "'";

            db.Database.ExecuteSqlCommand(Query);
            return Ok(new BaseResponse(100));
        }
    }
}
