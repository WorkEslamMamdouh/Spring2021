using API.Models;
using Inv.BLL.Services.Customer;
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using API.Controllers;
using Inv.API.Tools;
using System.Web.Http.Cors;
using System.Data.SqlClient;
using System.Data.Entity;
using Inv.DAL.Repository;
using Newtonsoft.Json;
using Inv.API.Models;
using API.Models.CustomModel;
using Inv.BLL.Services.I_Item_Cust;

namespace API.Controllers
{
    [EnableCorsAttribute("*", "*", "*")]
    public class CustomerController : BaseController
    {

        private readonly ICustomerServices CustomerServices;
        private readonly II_Item_CustService I_Item_CustService;

        public CustomerController(ICustomerServices _ICustomerServices, II_Item_CustService _II_Item_CustService)
        {
            CustomerServices = _ICustomerServices;
            I_Item_CustService = _II_Item_CustService;

        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode ,int BranchCode)
        {
            if (ModelState.IsValid)
            {
                var Cust = CustomerServices.GetAll(x => x.CompCode == CompCode && x.BranchCode == BranchCode).ToList();

                return Ok(new BaseResponse(Cust));

            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetFiltered(int? CreditType, string BalType)
        {

            string s = "select * from CUSTOMER ";
            string condition = "";

            if (CreditType != null && BalType != "All")
            {
                condition = condition + " where IsCreditCustomer =" + CreditType;

                if (BalType == ">")
                {
                    condition = condition + " where  Debit > 0 ";
                }

            }


            else if (CreditType != null)
                condition = condition + " where  IsCreditCustomer =" + CreditType;

            else if (BalType != "All")
            {
                if (BalType == ">")
                {
                    condition = condition + " where  Debit > 0 ";
                } 

            }

            string query = s + condition;
            var res = db.Database.SqlQuery<CUSTOMER>(query).ToList();
            return Ok(new BaseResponse(res));


        }


          [HttpGet, AllowAnonymous]
        public IHttpActionResult GetI_Item_CustomerByID(int CUSTOMER_ID)
        {

            string s = "select * from [dbo].[I_Item_Customer] where [CUSTOMER_ID]  = "+ CUSTOMER_ID + " ";
           
            string query = s ;
            var res = db.Database.SqlQuery<I_Item_Customer>(query).ToList();
            return Ok(new BaseResponse(res));


        }




        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]CUSTOMER Nation)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var Nationality = CustomerServices.Insert(Nation);
                    return Ok(new BaseResponse(Nationality));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            return BadRequest(ModelState);
        }
        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insertcustomer([FromBody]CUSTOMER obj)
        {
             
            string query = "INSERT INTO[dbo].[CUSTOMER] (CustomerCODE,CUSTOMER_NAME,NAMEE,CUSTOMER_ADDRES,CUSTOMER_ADDRES_2,PHONE,EMAIL,STATUS,CompCode,BranchCode)  VALUES ('" + obj.CustomerCODE + "', '"+ obj.CUSTOMER_NAME+ "', '"+ obj.NAMEE+ "', '"+ obj.CUSTOMER_ADDRES+ "', '"+ obj.CUSTOMER_ADDRES_2+ "','"+ obj.PHONE+ "','"+ obj.EMAIL+ "',1,1,1)";
                    db.Database.ExecuteSqlCommand(query);

            string query1 = "select * from [dbo].[CUSTOMER]  where CUSTOMER_ADDRES_2= '"+obj.CUSTOMER_ADDRES_2+"' and CustomerCODE = '"+obj.CustomerCODE+"'";
            var cust = db.Database.SqlQuery<CUSTOMER>(query1).ToList();

            return Ok(new BaseResponse(cust[0]));
         
        }
       

       [HttpGet, AllowAnonymous]
        public IHttpActionResult Delete(int ID)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    CustomerServices.Delete(ID);
                    return Ok(new BaseResponse());
                }
                catch (Exception)
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
        public IHttpActionResult Update([FromBody]CUSTOMER Nation)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var Nationality = CustomerServices.Update(Nation);
                    return Ok(new BaseResponse(Nationality));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            return BadRequest(ModelState);
        }



        //***************asmaa********************//
        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateCustlist([FromBody]CustomerMasterDetails CUSTOMERList)
        {



            try
            {
                CUSTOMER CUSTOMERListNew;
                int CUSTOMER_ID = 0;

                var insertedRecords = CUSTOMERList.CUSTOMER.Where(x => x.StatusFlag == 'i').ToList();
                var updatedRecords = CUSTOMERList.CUSTOMER.Where(x => x.StatusFlag == 'u').ToList();
                var deletedRecords = CUSTOMERList.CUSTOMER.Where(x => x.StatusFlag == 'd').ToList();
                ResponseResult res = new ResponseResult();
                //loop insered 
                if (insertedRecords.Count > 0)
                {
                    foreach (var item in insertedRecords)
                    {

                      
                        string quer = "insert_Outlet 'رصيد للعميل "+ item.CUSTOMER_NAME+ "', " + item.Openbalance + ", '" + item.UserCode + "', 'رصيد عميل'";
                        var Outlet = db.Database.SqlQuery<decimal>(quer);
                        var InsertedRec = CustomerServices.Insert(item);
                        CUSTOMERListNew = InsertedRec;
                        CUSTOMER_ID = CUSTOMERListNew.CUSTOMER_ID;
                        //return Ok(new BaseResponse(InsertedRec.CUSTOMER_ID));
                    }

                }


                //loop Update 
                if (updatedRecords.Count > 0)
                {
                    foreach (var item in updatedRecords)
                    {
                        var updatedRec = CustomerServices.Update(item);
                        CUSTOMERListNew = updatedRec;
                        CUSTOMER_ID = CUSTOMERListNew.CUSTOMER_ID;
                        //return Ok(new BaseResponse(updatedRec.CUSTOMER_ID));
                    }

                }


                var insertedRecordsItem = CUSTOMERList.I_Item_Customer.Where(x => x.StatusFlag == 'i').ToList();
                var updatedRecordsItem = CUSTOMERList.I_Item_Customer.Where(x => x.StatusFlag == 'u').ToList();
                var deletedRecordsItem = CUSTOMERList.I_Item_Customer.Where(x => x.StatusFlag == 'd').ToList();




                //loop insered  
                foreach (var item in insertedRecordsItem)
                {
                    item.CUSTOMER_ID = CUSTOMER_ID;
                    var InsertedRec = I_Item_CustService.Insert(item);
                }

                //loop Update  
                foreach (var item in updatedRecordsItem)
                { 
                    item.CUSTOMER_ID = CUSTOMER_ID;
                    var updatedRec = I_Item_CustService.Update(item);
                }

                //loop Delete  
                foreach (var item in deletedRecordsItem)
                {
                    int deletedId = item.Id;
                    item.CUSTOMER_ID = CUSTOMER_ID;
                    I_Item_CustService.Delete(deletedId);
                }



                return Ok(new BaseResponse(CUSTOMER_ID));

                //var ID_CUSTOMER = CustomerServices.GetAll(x => x.PHONE == CUSTOMERList[0].PHONE).ToList();

                //return Ok(new BaseResponse(ID_CUSTOMER[0].CUSTOMER_ID));

            }
            catch (Exception ex)
            {
                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
            }


            return BadRequest(ModelState);
        }



        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll_IQ_Catch_Receipt(string startDate, string endDate, int? CustomerId)
        {
            if (ModelState.IsValid)
            {
                string s = "select * from IQ_Catch_Receipt where [Data] >='" + startDate + "' and [Data] <='" + endDate + "'";

                string condition = "";

                if (CustomerId != 0 && CustomerId != null)
                    condition = condition + " and CUSTOMER_ID =" + CustomerId;
                


                string query = s + condition;
                var res = db.Database.SqlQuery<IQ_Catch_Receipt>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult Insert(int CUSTOMER_ID ,string USER_CODE ,int ID_ORDER_Delivery, decimal AmountRequired ,decimal Amount ,decimal ShootMoney ,string Remarks , string Data, int CompCode, int BranchCode, int InvoiceID)
        {
            
                try
                {
                    string query = "insert into [dbo].[Catch_Receipt] values("+ CUSTOMER_ID+ ",'"+USER_CODE+ "',"+ ID_ORDER_Delivery+ ","+AmountRequired+ "," +Amount + "," +ShootMoney + ",'" +Remarks + "','" + Data + "'," + BranchCode + "," + CompCode + "," + InvoiceID + ")";
                     
                    db.Database.ExecuteSqlCommand(query);


                string updateDebit = "updateDebit  " + CUSTOMER_ID + ","+ ShootMoney + ",'" + USER_CODE + "'";

                db.Database.ExecuteSqlCommand(updateDebit);



                string Receipt = "select max(ID_Receipt) from [dbo].[Catch_Receipt] where BranchCode = "+ BranchCode + " and CompCode = "+ CompCode + " ";

                    int ID_Receipt = db.Database.SqlQuery<int>(Receipt).FirstOrDefault();
                      
                    return Ok(new BaseResponse(ID_Receipt));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
           
        }


    }
}
