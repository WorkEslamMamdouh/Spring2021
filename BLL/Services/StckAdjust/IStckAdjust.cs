using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.StckAdjust
{
   public interface IStckAdjustService
    {
        // header
        I_Stk_TR_Adjust GetById(int id);
        List<I_Stk_TR_Adjust> GetAll(Expression<Func<I_Stk_TR_Adjust, bool>> predicate);
        I_Stk_TR_Adjust Insert(I_Stk_TR_Adjust entity);
        I_Stk_TR_Adjust Update(I_Stk_TR_Adjust entity);
        void UpdateList(List<I_Stk_TR_Adjust> Lstservice);

        //Detail
        List<I_Stk_Tr_AdjustDetails> GetAll(Expression<Func<I_Stk_Tr_AdjustDetails, bool>> predicate);
        void InsertLst(List<I_Stk_Tr_AdjustDetails> obj);
        I_Stk_Tr_AdjustDetails Insert(I_Stk_Tr_AdjustDetails entity);
        I_Stk_Tr_AdjustDetails Update(I_Stk_Tr_AdjustDetails entity);
        void Delete(int id);
    }
}
