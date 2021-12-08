using Inv.API.Models;
using Inv.API.Tools; 
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Inv.API.Controllers;
using Inv.BLL.Services.IDUnitGroupUom;

namespace Inv.API.Controllers
{
    public class I_D_UnitGroupUomController : BaseController
    {
        private readonly II_D_UnitGroupUomService I_D_UnitGroupUomService;
         private readonly G_USERSController UserControl;

        public I_D_UnitGroupUomController(II_D_UnitGroupUomService _II_D_UnitGroupUomService, G_USERSController _Control)
        {
            this.I_D_UnitGroupUomService = _II_D_UnitGroupUomService;
            this.UserControl = _Control;
        }





        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllUnitGroupUom(string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var UnitGroupList = I_D_UnitGroupUomService.GetAll().ToList();

                return Ok(new BaseResponse(UnitGroupList));
            } 
            return BadRequest(ModelState); 
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetBycomp(int Comp, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var GenVatType = I_D_UnitGroupUomService.GetAll(x => x.CompCode == Comp);

                return Ok(new BaseResponse(GenVatType));
            }
            return BadRequest(ModelState);
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var GroupUom = I_D_UnitGroupUomService.GetAll(x=>x.UnitGrpID==id);

                return Ok(new BaseResponse(GroupUom));
            }
            return BadRequest(ModelState);
        }


    }
}
