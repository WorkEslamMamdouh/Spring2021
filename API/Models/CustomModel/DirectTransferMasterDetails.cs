using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;

namespace Inv.API.Models.CustomModel
{
    public class DirectTransferMasterDetails : SecurityandUpdateFlagClass
    {
        public I_Stk_TR_Transfer I_Stk_TR_Transfer { get; set; }
        public List<I_Stk_TR_TransferDetails> I_Stk_TR_TransferDetails { get; set; }
    }
}