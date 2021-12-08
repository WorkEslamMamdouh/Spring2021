using Inv.API.Models;
using Inv.API.Models.CustomModel;
using Inv.API.Tools;
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;
using Inv.BLL.Services.IDUnitGroup;
using Inv.BLL.Services.IDUnitGroupUom;
using Inv.BLL.Services.GUSERS;

namespace Inv.API.Controllers
{
    public class I_D_UnitGroupController : BaseController
    {
        private readonly II_D_UnitGroupService I_D_UnitGroupService;
        private readonly II_D_UnitGroupUomService I_D_UnitGroupUomService;
        //private readonly IVatNatureService VatNatureService;
        private readonly G_USERSController UserControl;

        public I_D_UnitGroupController(II_D_UnitGroupService _II_D_UnitGroupService, II_D_UnitGroupUomService i_D_UnitGroupUomService, G_USERSController _Control)
        {
            this.I_D_UnitGroupService = _II_D_UnitGroupService;
            this.I_D_UnitGroupUomService = i_D_UnitGroupUomService;
            this.UserControl = _Control;
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllUnitGroup(int CompCode, string UserCode, string Token)
        {
            
                var UnitGroupList = I_D_UnitGroupService.GetAll(x => x.CompCode == CompCode).ToList();

                return Ok(new BaseResponse(UnitGroupList));
            
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetBycomp(int Comp, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var GenVatType = I_D_UnitGroupService.GetAll(x => x.CompCode == Comp);

                return Ok(new BaseResponse(GenVatType));
            }
            return BadRequest(ModelState);
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var GenVatType = I_D_UnitGroupService.GetById(id);

                return Ok(new BaseResponse(GenVatType));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetIQ_GetItemYearUom(int ItemID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {

                var sql = "select * from IQ_GetItemYearUom where ItemID = " + ItemID + "";
                var itemyear = db.Database.SqlQuery<IQ_GetItemYearUom>(sql).ToList();
                return Ok(new BaseResponse(itemyear));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetIQ_GetItemStore(int Compcode, int BranchCode, int ItemID, string UserCode, string Token)
        {

            var query = "select * from IQ_GetItemStore where CompCode = " + Compcode + " and ItemID = " + ItemID + "";
            var itemqty = db.Database.SqlQuery<IQ_GetItemStore>(query).ToList();
            return Ok(new BaseResponse(itemqty));

        }
        [HttpPost, AllowAnonymous]
        public IHttpActionResult Update([FromBody] MasterDetailsUnitGroup MasterDetailsUnit)
        {
            //if (ModelState.IsValid)
            //{
            using (var dbTransaction = db.Database.BeginTransaction())
            {
                try
                {
                    int UnitGrpID = 0;
                    if (MasterDetailsUnit.I_D_UnitGroup.StatusFlag == 'i')
                    {
                        var UnitGroup = I_D_UnitGroupService.Insert(MasterDetailsUnit.I_D_UnitGroup);
                        UnitGrpID = UnitGroup.UnitGrpID;

                    }
                    else
                    {
                        var res = I_D_UnitGroupService.Update(MasterDetailsUnit.I_D_UnitGroup);
                        UnitGrpID = res.UnitGrpID;
                    }

                    var insertDetailUnitGroupUom = MasterDetailsUnit.I_D_UnitGroupUom.Where(x => x.StatusFlag == 'i').ToList();
                    var updatedDetailUnitGroupUom = MasterDetailsUnit.I_D_UnitGroupUom.Where(x => x.StatusFlag == 'u').ToList();
                    var deletedDetailUnitGroupUom = MasterDetailsUnit.I_D_UnitGroupUom.Where(x => x.StatusFlag == 'd').ToList();

                    //loop insered   
                    foreach (var Unit in insertDetailUnitGroupUom)
                    {
                        Unit.UnitGrpID = UnitGrpID; 
                        var InsertedRec = I_D_UnitGroupUomService.Insert(Unit);
                    }

                    //loop Update  
                    foreach (var Unit in updatedDetailUnitGroupUom)
                    {
                        Unit.UnitGrpID = UnitGrpID; 
                        var updatedRec = I_D_UnitGroupUomService.Update(Unit);
                    }

                    //loop Delete   
                    foreach (var Unit in deletedDetailUnitGroupUom)
                    {
                        int deletedId = Unit.UnitGrpUom;
                        I_D_UnitGroupUomService.Delete(deletedId);
                    }
                    dbTransaction.Commit();
                    return Ok(new BaseResponse(UnitGrpID));

                }
                catch (Exception ex)
                {
                    dbTransaction.Rollback();

                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            //}
            //return BadRequest(ModelState);
        }


    }
}
