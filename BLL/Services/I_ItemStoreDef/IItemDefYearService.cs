using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.I_ItemStoreDeff
{
  public  interface I_ItemStoreService
    {
        I_ItemStore GetById(int id);
        I_ItemStore GetByIdFromIItem(int id);
        List<I_ItemStore> GetAll();
        List<I_ItemStore> GetAll(Expression<Func<I_ItemStore, bool>> predicate);
        I_ItemStore Insert(I_ItemStore entity);
        I_ItemStore Update(I_ItemStore entity);
        void Delete(int id);
       // void UpdateList(List<I_Item> Lstservice);
    }
}
