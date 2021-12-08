using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.ItemDefYear
{
  public  interface IItemDefYearService
    { 
        I_ItemYear GetById(int id);
        I_ItemYear GetByIdFromIItem(int id);
        List<I_ItemYear> GetAll();
        List<I_ItemYear> GetAll(Expression<Func<I_ItemYear, bool>> predicate);
        I_ItemYear Insert(I_ItemYear entity);
        I_ItemYear Update(I_ItemYear entity);
        void Delete(int id);
       // void UpdateList(List<I_Item> Lstservice);
    }
}
