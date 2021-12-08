using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.IDUnitGroupUom
{
    public interface II_D_UnitGroupUomService
    {
        I_D_UnitGroupUom GetById(int id);      
         List<I_D_UnitGroupUom> GetAll();
        List<I_D_UnitGroupUom> GetAll(Expression<Func<I_D_UnitGroupUom, bool>> predicate);
        I_D_UnitGroupUom Insert(I_D_UnitGroupUom entity);
        I_D_UnitGroupUom Update(I_D_UnitGroupUom entity);
        void Delete(int id);
    }

}
