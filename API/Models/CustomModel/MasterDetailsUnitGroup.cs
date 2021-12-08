using System;
using Inv.DAL.Domain;
using System.Collections.Generic;
using System.Linq;
using System.Web;

 
namespace Inv.API.Models.CustomModel
{
    public class MasterDetailsUnitGroup
    {
        public I_D_UnitGroup I_D_UnitGroup { get; set; }
        public List<I_D_UnitGroupUom> I_D_UnitGroupUom { get; set; }
  

        public string UserCode { get; set; }
        public string Token { get; set; }

    }
}
