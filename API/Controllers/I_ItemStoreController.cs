using Inv.API.Models;
using Inv.API.Models.CustomModel;
using Inv.API.Tools; 
using Inv.BLL.Services.I_ItemStoreDeff;
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
    public class I_ItemStoreController : BaseController
    {
        private readonly I_ItemStoredefService I_ItemStoreService;
        private readonly G_USERSController UserControl; 

        public I_ItemStoreController(I_ItemStoredefService _IItemDefService, G_USERSController _Control)
        {
            this.I_ItemStoreService = _IItemDefService;
            this.UserControl = _Control; 
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, int FinYear, int ItemFamilyID, int storeCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {

                var ItemStoreInfoList = I_ItemStoreService.GetAll().ToList();
                
                return Ok(new BaseResponse(ItemStoreInfoList));

            }
            return BadRequest(ModelState);
        }
         

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Update(List<I_ItemStore>  obj)
        { 
            foreach (I_ItemStore item in obj)
            {
                I_ItemStoreService.Update(item);
            }
            
            return Ok(new BaseResponse(1000));         
        }

          
          



        }


    }
 
