using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.I_Item_Cust
{
    public interface II_Item_CustService
    {
        I_Item_Customer GetById(int id);
        I_Item_Customer GetByIdFromIItem(int id);
        List<I_Item_Customer> GetAll();
        List<I_Item_Customer> GetAll(Expression<Func<I_Item_Customer, bool>> predicate);
        I_Item_Customer Insert(I_Item_Customer entity);
        I_Item_Customer Update(I_Item_Customer entity);
        void InsertLst(List<I_Item_Customer> obj);
        void Delete(int id);
    }
}
