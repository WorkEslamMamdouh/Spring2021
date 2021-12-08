using Inv.API.Models;
using Inv.API.Models.CustomModel;
using Inv.API.Tools; 
using Inv.BLL.Services.II_ItemYearUomDef;
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
    public class I_ItemYearUomDefController : BaseController
    {
        private readonly I_ItemYearUomDefService I_ItemYearUomDefService;
        private readonly G_USERSController UserControl; 

        public I_ItemYearUomDefController(I_ItemYearUomDefService _IItemDefService, G_USERSController _Control)
        {
            this.I_ItemYearUomDefService = _IItemDefService;
            this.UserControl = _Control; 
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, int FinYear, int ItemFamilyID, int storeCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {

                var ItemStoreInfoList = I_ItemYearUomDefService.GetAll().ToList();
                
                return Ok(new BaseResponse(ItemStoreInfoList));

            }
            return BadRequest(ModelState);
        }
         

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Update(List<I_ItemYearUom>  obj)
        { 
            foreach (I_ItemYearUom item in obj)
            { 
                I_ItemYearUomDefService.Update(item);
            }
            
            return Ok(new BaseResponse(1000));         
        }

          
          



        }


    }
 
