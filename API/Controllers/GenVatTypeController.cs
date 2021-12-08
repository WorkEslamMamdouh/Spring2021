using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.GenVatType;
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Inv.API.Controllers;
using Inv.BLL.Services.VatNature;

namespace Inv.API.Controllers
{
    public class GenVatTypeController : BaseController
    {
        private readonly IGenVatTypeService GenVatTypeService;
        private readonly IVatNatureService VatNatureService;
        private readonly G_USERSController UserControl;

        public GenVatTypeController(IGenVatTypeService _IGenVatTypeService, IVatNatureService _VatNatureService  ,G_USERSController _Control)
        {
            this.GenVatTypeService = _IGenVatTypeService;
            this.VatNatureService = _VatNatureService;
            this.UserControl = _Control;
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllVatNature(string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var VatNatureList = VatNatureService.GetAll().ToList();

                return Ok(new BaseResponse(VatNatureList));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, string UserCode, string Token)
        {


            var GenVatTypeList = GenVatTypeService.GetAll(x => x.COMP_CODE == CompCode).ToList();

            return Ok(new BaseResponse(GenVatTypeList));


        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllVats(string UserCode, string Token)
        {


            var GenVatTypeList = GenVatTypeService.GetAll().ToList();

            return Ok(new BaseResponse(GenVatTypeList));


        }



        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode,int VatType, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var GenVatTypeList = GenVatTypeService.GetAll(x => x.COMP_CODE == CompCode&&x.TYPE== VatType).ToList();

                return Ok(new BaseResponse(GenVatTypeList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var GenVatType = GenVatTypeService.GetById(id);

                return Ok(new BaseResponse(GenVatType));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetVatPercentage(int CompCode, int VatType,int Type, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var GenVatTypeList = GenVatTypeService.GetAll(x => x.COMP_CODE == CompCode && x.CODE == VatType&&x.TYPE==Type).FirstOrDefault();

                return Ok(new BaseResponse(GenVatTypeList));
            }
            return BadRequest(ModelState);
        }
    }
}
