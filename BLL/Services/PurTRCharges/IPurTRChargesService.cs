using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.PurTRCharges
{
  public  interface IPurTRChargesService
    {
        void InsertLst(List<I_Pur_Tr_ReceiveCharges> obj);
        I_Pur_Tr_ReceiveCharges Insert(I_Pur_Tr_ReceiveCharges entity);
        I_Pur_Tr_ReceiveCharges Update(I_Pur_Tr_ReceiveCharges entity);
        void Delete(int id);
    }
}
