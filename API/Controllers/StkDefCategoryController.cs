using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.StkDefCategory;
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
    public class StkDefCategoryController : BaseController
    {
        // GET: StKDefinition
        private readonly IStkDefCategoryService StkDefCategoryService;
        private readonly G_USERSController UserControl;

        public StkDefCategoryController(IStkDefCategoryService _StkDefCategoryService, G_USERSController _Control)
        {
            this.StkDefCategoryService = _StkDefCategoryService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, string UserCode, string Token)
        {
          
                var category = StkDefCategoryService.GetAll(x => x.CompCode == CompCode).ToList();

                return Ok(new BaseResponse(category));
          
        }
        public IHttpActionResult GetAllCat(int CompCode,int CatID , string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var category = StkDefCategoryService.GetAll(x => x.CompCode == CompCode && x.CatID == CatID).ToList();
                
                return Ok(new BaseResponse(category));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var category = StkDefCategoryService.GetById(id);

                return Ok(new BaseResponse(category));
            }
            return BadRequest(ModelState);
        }


        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]I_D_Category category)
        {
          
                try
                {
                    var Catg = StkDefCategoryService.Insert(category);
                    return Ok(new BaseResponse(Catg));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
        
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult Delete(int ID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                try
                {
                    StkDefCategoryService.Delete(ID);
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
        public IHttpActionResult Update([FromBody]I_D_Category category)
        {
         
                try
                {
                    var Catg = StkDefCategoryService.Update(category);
                    return Ok(new BaseResponse(Catg));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
   
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateLst(List<I_D_Category> CategoryList)
        {
            try
            {
                StkDefCategoryService.UpdateList(CategoryList);
                return Ok(new BaseResponse());
            }
            catch (Exception ex)
            {
                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
            }
        }
    }
}