using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.StkDefUnit;
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
    public class StkDefUnitController : BaseController
    {
        private readonly IStkDefUnitService StkDefUnitService;
        private readonly G_USERSController UserControl;

        public StkDefUnitController(IStkDefUnitService _IStkDefUnitService, G_USERSController _Control)
        {
            this.StkDefUnitService = _IStkDefUnitService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefCustomerList = StkDefUnitService.GetAll(x => x.CompCode == CompCode).ToList();

                return Ok(new BaseResponse(AccDefCustomerList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefCustomer = StkDefUnitService.GetById(id);

                return Ok(new BaseResponse(AccDefCustomer));
            }
            return BadRequest(ModelState);
        }
    }
}
