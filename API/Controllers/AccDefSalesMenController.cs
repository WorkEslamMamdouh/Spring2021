using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.AccDefSalesMen;
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
    public class AccDefSalesMenController : BaseController
    {
        private readonly IAccDefSalesMenService AccDefSalesMenService;
        private readonly G_USERSController UserControl;

        public AccDefSalesMenController(IAccDefSalesMenService _IAccDefSalesMenService, G_USERSController _Control)
        {
            this.AccDefSalesMenService = _IAccDefSalesMenService;
            this.UserControl = _Control;
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, int BranchCode, bool? IsSalesEnable,bool? IsPurchaseEnable,bool? ISOperationEnable, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefSalesManList = AccDefSalesMenService.GetAll(s => s.CompCode == CompCode && s.BraCode == BranchCode && s.IsSalesEnable == IsSalesEnable&& s.IsPurchaseEnable == IsPurchaseEnable&& s.ISOperationEnable == ISOperationEnable).ToList();
                return Ok(new BaseResponse(AccDefSalesManList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllSalesPeople(int CompCode,int BranchCode , bool IsSalesEnable, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefSalesManList = AccDefSalesMenService.GetAll(s => s.CompCode == CompCode && s.BraCode == BranchCode && s.IsSalesEnable == IsSalesEnable ).ToList();
                return Ok(new BaseResponse(AccDefSalesManList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllPurchasePeople(int CompCode, int BranchCode, bool IsPurchaseEnable, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefSalesManList = AccDefSalesMenService.GetAll(s => s.CompCode == CompCode && s.BraCode == BranchCode  && s.IsPurchaseEnable == IsPurchaseEnable).ToList();
                return Ok(new BaseResponse(AccDefSalesManList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllOperationPeople(int CompCode, int BranchCode, bool ISOperationEnable, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefSalesManList = AccDefSalesMenService.GetAll(s => s.CompCode == CompCode && s.BraCode == BranchCode && s.ISOperationEnable == ISOperationEnable).ToList();
                return Ok(new BaseResponse(AccDefSalesManList));
            }
            return BadRequest(ModelState);
        }

        //GetSalesManView

        public IHttpActionResult GetSalesManViewAll(int CompCode, int BranchCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefSalesManList = AccDefSalesMenService.GetAll(s => s.CompCode == CompCode && s.BraCode == BranchCode ).ToList();
                return Ok(new BaseResponse(AccDefSalesManList));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetSalesManView(int CompCode, int BranchCode, string IsSalesEnable, string IsPurchaseEnable, string ISOperationEnable, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
               // var AccDefSalesManList = AccDefSalesMenService.GetSalesManView(s => s.CompCode == CompCode && s.IsSalesEnable == IsSalesEnable && s.IsPurchaseEnable == IsPurchaseEnable && s.ISOperationEnable == ISOperationEnable).ToList();
                ////////////
                string s = "select * from IQ_GetSalesMan where BraCode = "+ BranchCode + "and CompCode = " + CompCode + " ";
                string condition = "";
                
                if (IsSalesEnable != "All")
                    condition = condition + " and IsSalesEnable = '" + IsSalesEnable+"' ";

                if (IsPurchaseEnable != "All")
                    condition = condition + " and IsPurchaseEnable = '" + IsPurchaseEnable + "' ";

                if (ISOperationEnable != "All")
                    condition = condition + " and ISOperationEnable = '" + ISOperationEnable + "' ";

                string query = s + condition;
                var res = db.Database.SqlQuery<IQ_GetSalesMan>(query).ToList();
                ///////////////
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult CodeFounBefore(string code, int compCode, int BranchCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefVendor = AccDefSalesMenService.GetAll(x => x.CompCode == compCode && x.BraCode == BranchCode && x.SalesmanCode == code);

                return Ok(new BaseResponse(AccDefVendor));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefSalesMan = AccDefSalesMenService.GetById(id);

                return Ok(new BaseResponse(AccDefSalesMan));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]I_Sls_D_Salesman AccDefSalesMan)
        {
            if (ModelState.IsValid && UserControl.CheckUser(AccDefSalesMan.Token, AccDefSalesMan.UserCode))
            {
                try
                {
                    var AccDefSales = AccDefSalesMenService.Insert(AccDefSalesMan);
                    return Ok(new BaseResponse(AccDefSales));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            return BadRequest(ModelState);
        }

        public IHttpActionResult Delete(int ID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                try
                {
                    AccDefSalesMenService.Delete(ID);
                    return Ok(new BaseResponse());
                }
                catch (Exception ex)
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
        public IHttpActionResult Update([FromBody]I_Sls_D_Salesman AccDefSalesMan)
        {
            if (ModelState.IsValid && UserControl.CheckUser(AccDefSalesMan.Token, AccDefSalesMan.UserCode))
            {
                try
                {
                    var AccDefSales = AccDefSalesMenService.Update(AccDefSalesMan);
                    return Ok(new BaseResponse(AccDefSales));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            return BadRequest(ModelState);
        }
        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateLst(List<I_Sls_D_Salesman> AccDefSalesList)
        {
            try
            {
                AccDefSalesMenService.UpdateList(AccDefSalesList);
                return Ok(new BaseResponse());
            }
            catch (Exception ex)
            {
                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
            }
        }
    }
}
