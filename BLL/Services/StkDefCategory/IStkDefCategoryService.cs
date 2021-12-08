using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.StkDefCategory
{
   public interface IStkDefCategoryService
    {
        I_D_Category GetById(int id);
        List<I_D_Category> GetAll();
        List<I_D_Category> GetAll(Expression<Func<I_D_Category, bool>> predicate);
        I_D_Category Insert(I_D_Category entity);
        I_D_Category Update(I_D_Category entity);
        void Delete(int id);
        void UpdateList(List<I_D_Category> Lstservice);
    }
}
