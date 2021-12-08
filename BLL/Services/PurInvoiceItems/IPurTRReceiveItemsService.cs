using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.PurInvoiceItems
{
   public interface IPurTRReceiveItemsService
    {
        void InsertLst(List<I_Pur_TR_ReceiveItems> obj);
        I_Pur_TR_ReceiveItems Insert(I_Pur_TR_ReceiveItems entity);
        I_Pur_TR_ReceiveItems Update(I_Pur_TR_ReceiveItems entity);
        void Delete(int id);
    }
}
