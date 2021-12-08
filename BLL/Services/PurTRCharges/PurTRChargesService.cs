using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;


namespace Inv.BLL.Services.PurTRCharges
{
 public  class PurTRChargesService: IPurTRChargesService
    {
        private readonly IUnitOfWork unitOfWork;

        public PurTRChargesService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        public void InsertLst(List<I_Pur_Tr_ReceiveCharges> obj)
        {
            unitOfWork.Repository<I_Pur_Tr_ReceiveCharges>().Insert(obj);
            unitOfWork.Save();
            return;
        }

        public I_Pur_Tr_ReceiveCharges Insert(I_Pur_Tr_ReceiveCharges entity)
        {
            var AccDefAccount = unitOfWork.Repository<I_Pur_Tr_ReceiveCharges>().Insert(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public I_Pur_Tr_ReceiveCharges Update(I_Pur_Tr_ReceiveCharges entity)
        {

            var AccDefAccount = unitOfWork.Repository<I_Pur_Tr_ReceiveCharges>().Update(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<I_Pur_Tr_ReceiveCharges>().Delete(id);
            unitOfWork.Save();
        }
    }
}
