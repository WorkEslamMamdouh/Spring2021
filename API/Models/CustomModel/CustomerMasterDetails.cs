using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;
using Inv.API.Models.CustomEntities;

namespace API.Models.CustomModel
{
    public class CustomerMasterDetails : SecurityClass
    { 
        public List<I_Item_Customer> I_Item_Customer { get; set; }
        public List<CUSTOMER> CUSTOMER { get; set; }
    }
}