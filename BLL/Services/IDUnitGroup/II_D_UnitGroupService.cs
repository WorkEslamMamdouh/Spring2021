using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.IDUnitGroup
{
    public interface II_D_UnitGroupService
    {
        I_D_UnitGroup GetById(int id);
         List<I_D_UnitGroup> GetAll();
        List<I_D_UnitGroup> GetAll(Expression<Func<I_D_UnitGroup, bool>> predicate);
        I_D_UnitGroup Insert(I_D_UnitGroup entity);
        I_D_UnitGroup Update(I_D_UnitGroup entity);
        void Delete(int id);
 
    }

}
