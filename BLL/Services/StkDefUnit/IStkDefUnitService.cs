using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;


namespace Inv.BLL.Services.StkDefUnit
{
    public interface IStkDefUnitService
    {
        I_D_UOM GetById(int id);
        List<I_D_UOM> GetAll();
        List<I_D_UOM> GetAll(Expression<Func<I_D_UOM, bool>> predicate);
    }
}
