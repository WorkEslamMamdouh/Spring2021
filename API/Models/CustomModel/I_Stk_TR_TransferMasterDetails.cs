using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;
using Inv.API.Models.CustomEntities;

namespace API.Models.CustomModel
{
    public class I_Stk_TR_TransferMasterDetails : SecurityClass
    { 
        public List<I_Stk_TR_Transfer> I_Stk_TR_Transfer { get; set; } 
        public List<I_Stk_TR_TransferDetails> I_Stk_TR_TransferDetails { get; set; } 
    }
}