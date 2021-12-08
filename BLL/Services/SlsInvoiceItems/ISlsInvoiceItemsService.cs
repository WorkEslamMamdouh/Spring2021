using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.SlsInvoiceItems
{
    public interface ISlsInvoiceItemsService
    {
        List<I_Sls_TR_InvoiceItems> GetAll(Expression<Func<I_Sls_TR_InvoiceItems, bool>> predicate);
        void InsertLst(List<I_Sls_TR_InvoiceItems> obj);
        I_Sls_TR_InvoiceItems Insert(I_Sls_TR_InvoiceItems entity);
        I_Sls_TR_InvoiceItems Update(I_Sls_TR_InvoiceItems entity);
        void Delete(int id);
    }
}
