using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;

namespace Inv.API.Models.CustomModel
{
    public class I_Item_YearMasterDetails : SecurityandUpdateFlagClass
    {
        public List<I_Item> I_Item { get; set; }
        public List<I_ItemYear> I_ItemYear { get; set; }
    }
}