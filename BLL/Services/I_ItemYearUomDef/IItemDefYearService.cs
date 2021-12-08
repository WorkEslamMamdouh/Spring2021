using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.II_ItemYearUomDef
{
  public  interface I_ItemYearUomService
    {
        I_ItemYearUom GetById(int id);
        I_ItemYearUom GetByIdFromIItem(int id);
        List<I_ItemYearUom> GetAll();
        List<I_ItemYearUom> GetAll(Expression<Func<I_ItemYearUom, bool>> predicate);
        I_ItemYearUom Insert(I_ItemYearUom entity);
        I_ItemYearUom Update(I_ItemYearUom entity);
        void Delete(int id);
       // void UpdateList(List<I_Item> Lstservice);
    }
}
