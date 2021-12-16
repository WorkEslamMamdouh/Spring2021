using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.Transfer
{
    public interface ITransferServices
    {
        I_Stk_TR_Transfer GetById(int id);
        List<I_Stk_TR_Transfer> GetAll();
        List<I_Stk_TR_Transfer> GetAll(Expression<Func<I_Stk_TR_Transfer, bool>> predicate);
        I_Stk_TR_Transfer Insert(I_Stk_TR_Transfer entity);
        I_Stk_TR_Transfer Update(I_Stk_TR_Transfer entity); 
        void Delete(int id);
        void UpdateList(List<I_Stk_TR_TransferDetails> Lstservice);
        void UpdateDetail(I_Stk_TR_TransferDetails entity);
        void InsertDetail(I_Stk_TR_TransferDetails entity);
    }
}
