using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.PurTrReceive
{
    public interface IPurTrReceiveService
    {
        I_Pur_TR_Receive GetById(int id);
        I_Pur_TR_Receive GetByIdFromIItem(int id);
        List<I_Pur_TR_Receive> GetAll();
        List<I_Pur_TR_Receive> GetAll(Expression<Func<I_Pur_TR_Receive, bool>> predicate);
        I_Pur_TR_Receive Insert(I_Pur_TR_Receive entity);
        I_Pur_TR_Receive Update(I_Pur_TR_Receive entity);
        void InsertLst(List<I_Pur_TR_Receive> obj);
        void Delete(int id);
    }
}
