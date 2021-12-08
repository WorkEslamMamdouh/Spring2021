using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.StkDefItemType
{
   public interface IStkDefItemTypeService
    {
        I_ItemFamily GetById(int id);
        List<I_ItemFamily> GetAll();
        List<I_ItemFamily> GetAll(Expression<Func<I_ItemFamily, bool>> predicate);
        I_ItemFamily Insert(I_ItemFamily entity);
        I_ItemFamily Update(I_ItemFamily entity);
        void Delete(int id);
      //  void UpdateList(List<I_ItemFamily> Lstservice);
    }
}
