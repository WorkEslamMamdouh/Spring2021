using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.ItemDef
{
  public  interface IItemDefService
    { 
        IQ_GetItemStoreInfo GetById(int id);
        I_Item GetByIdFromIItem(int id);
        List<IQ_GetItemStoreInfo> GetAll();
        List<I_Item> GetAllFromItems(Expression<Func<I_Item, bool>> predicate);
        List<IQ_GetItemStoreInfo> GetAll(Expression<Func<IQ_GetItemStoreInfo, bool>> predicate);
        I_Item Insert(I_Item entity);
        I_Item Update(I_Item entity);
        void Delete(int id);
       // void UpdateList(List<I_Item> Lstservice);
    }
}
