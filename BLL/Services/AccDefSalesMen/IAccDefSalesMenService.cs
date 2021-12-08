using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AccDefSalesMen
{
   public interface IAccDefSalesMenService
    {
        I_Sls_D_Salesman GetById(int id);
        List<I_Sls_D_Salesman> GetAll();
        List<I_Sls_D_Salesman> GetAll(Expression<Func<I_Sls_D_Salesman, bool>> predicate);
        I_Sls_D_Salesman Insert(I_Sls_D_Salesman entity);
        I_Sls_D_Salesman Update(I_Sls_D_Salesman entity);
        void Delete(int id);
        void UpdateList(List<I_Sls_D_Salesman> Lstservice);
        List<IQ_GetSalesMan> GetSalesManView(Expression<Func<IQ_GetSalesMan, bool>> predicate);
    }
}
